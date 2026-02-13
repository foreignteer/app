import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { Booking, AttendanceStatus } from '@/lib/types/booking';
import { sendAttendanceConfirmationEmail, sendReviewInvitationEmail } from '@/lib/services/emailService';

interface CheckInRequestBody {
  role: 'volunteer' | 'ngo';
  notes?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const body: CheckInRequestBody = await request.json();
    const { role, notes } = body;

    // Fetch the booking
    const bookingRef = adminDb.collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = {
      id: bookingDoc.id,
      ...bookingDoc.data(),
    } as Booking;

    // Verify authorization
    if (role === 'volunteer' && booking.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (role === 'ngo') {
      // Verify user is admin/member of the NGO
      const ngoRef = adminDb.collection('ngos').doc(booking.ngoId);
      const ngoDoc = await ngoRef.get();

      if (!ngoDoc.exists) {
        return NextResponse.json({ error: 'NGO not found' }, { status: 404 });
      }

      const ngoData = ngoDoc.data();
      if (!ngoData) {
        return NextResponse.json({ error: 'NGO data not found' }, { status: 404 });
      }
      if (ngoData?.createdBy !== userId) {
        // TODO: Add support for NGO team members
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Check if experience date has passed
    const experienceRef = adminDb.collection('experiences').doc(booking.experienceId);
    const experienceDoc = await experienceRef.get();

    if (!experienceDoc.exists) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    const experienceData = experienceDoc.data();
    if (!experienceData) {
      return NextResponse.json({ error: 'Experience data not found' }, { status: 404 });
    }

    const experienceEndDate = experienceData.dates?.end?.toDate();

    if (!experienceEndDate || experienceEndDate > new Date()) {
      return NextResponse.json(
        { error: 'Cannot check in before experience has ended' },
        { status: 400 }
      );
    }

    // Determine new attendance status
    let newAttendanceStatus: AttendanceStatus;
    const now = new Date();

    if (role === 'volunteer') {
      if (booking.ngoCheckedIn) {
        newAttendanceStatus = 'confirmed';
      } else {
        newAttendanceStatus = 'volunteer_only';
      }
    } else {
      // role === 'ngo'
      if (booking.volunteerCheckedIn) {
        newAttendanceStatus = 'confirmed';
      } else {
        newAttendanceStatus = 'ngo_only';
      }
    }

    // Update booking
    const updateData: Partial<Booking> = {
      attendanceStatus: newAttendanceStatus,
      ...(notes && { attendanceNotes: notes }),
    };

    if (role === 'volunteer') {
      updateData.volunteerCheckedIn = true;
      updateData.volunteerCheckInTime = now;
    } else {
      updateData.ngoCheckedIn = true;
      updateData.ngoCheckInTime = now;
    }

    // If attendance is now confirmed, mark as completed
    if (newAttendanceStatus === 'confirmed') {
      updateData.status = 'completed';
      updateData.completedAt = now;
    }

    await bookingRef.update(updateData);

    // If attendance is now confirmed, send emails
    if (newAttendanceStatus === 'confirmed') {
      // Fetch user data
      const userRef = adminDb.collection('users').doc(booking.userId);
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      // Fetch NGO data for email
      const ngoRef = adminDb.collection('ngos').doc(booking.ngoId);
      const ngoDoc = await ngoRef.get();
      const ngoData = ngoDoc.data();

      if (userData?.email) {
        // Send attendance confirmation email
        await sendAttendanceConfirmationEmail(
          userData.email,
          userData.name || 'Volunteer',
          {
            experienceTitle: experienceData.title,
            ngoName: ngoData?.name || 'the organisation',
            date: experienceEndDate.toLocaleDateString(),
          }
        );

        // Send review invitation email
        await sendReviewInvitationEmail(
          userData.email,
          userData.name || 'Volunteer',
          {
            experienceTitle: experienceData.title,
            bookingId: bookingId,
          }
        );

        // Mark review invitation as sent
        await bookingRef.update({
          reviewInvitationSent: true,
          reviewInvitationSentAt: now,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        attendanceStatus: newAttendanceStatus,
        message:
          newAttendanceStatus === 'confirmed'
            ? 'Attendance confirmed! Thank you for participating.'
            : 'Check-in recorded. Waiting for confirmation from the other party.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing check-in:', error);
    return NextResponse.json(
      { error: 'Failed to process check-in' },
      { status: 500 }
    );
  }
}
