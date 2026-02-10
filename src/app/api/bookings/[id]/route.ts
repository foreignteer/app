import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { Booking } from '@/lib/types/booking';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;
    const userRole = decodedToken.role || 'user';

    // Get the booking
    const bookingRef = adminDb.collection('bookings').doc(id);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const booking = bookingDoc.data() as Booking;

    // Check permissions
    // Users can cancel their own bookings
    // NGOs and admins can approve/reject bookings for their experiences
    const isOwner = booking.userId === userId;
    const isNGOForBooking = userRole === 'ngo' && booking.ngoId === (await adminDb.collection('users').doc(userId).get()).data()?.ngoId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isNGOForBooking && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - You cannot modify this booking' },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { status } = body;

    // Validate status transition
    if (status === 'cancelled') {
      // Can only cancel confirmed, pending, or pending_admin bookings
      if (!['confirmed', 'pending', 'pending_admin'].includes(booking.status)) {
        return NextResponse.json(
          { error: 'Cannot cancel this booking' },
          { status: 400 }
        );
      }

      // Update booking status
      const now = new Date();
      await bookingRef.update({
        status: 'cancelled',
        cancelledAt: now,
        updatedAt: now,
      });

      // Decrease the experience's current bookings count
      const experienceRef = adminDb
        .collection('experiences')
        .doc(booking.experienceId);
      const experienceDoc = await experienceRef.get();

      if (experienceDoc.exists) {
        const experience = experienceDoc.data();
        await experienceRef.update({
          currentBookings: Math.max(0, (experience?.currentBookings || 1) - 1),
          updatedAt: now,
        });
      }

      const updatedBooking = await bookingRef.get();
      const data = updatedBooking.data();
      return NextResponse.json(
        {
          success: true,
          booking: {
            id: updatedBooking.id,
            ...data,
            appliedAt: data?.appliedAt?.toDate?.() || data?.appliedAt,
            confirmedAt: data?.confirmedAt?.toDate?.() || data?.confirmedAt,
            cancelledAt: data?.cancelledAt?.toDate?.() || data?.cancelledAt,
            completedAt: data?.completedAt?.toDate?.() || data?.completedAt,
            rejectedAt: data?.rejectedAt?.toDate?.() || data?.rejectedAt,
            adminApprovedAt: data?.adminApprovedAt?.toDate?.() || data?.adminApprovedAt,
            adminRejectedAt: data?.adminRejectedAt?.toDate?.() || data?.adminRejectedAt,
          },
        },
        { status: 200 }
      );
    }

    // For other status updates (admin/NGO use cases)
    if (userRole === 'admin' || userRole === 'ngo') {
      const now = new Date();
      const updates: any = {
        status,
        updatedAt: now,
      };

      // When admin approves a pending_admin booking (passes to NGO)
      if (status === 'pending' && booking.status === 'pending_admin' && userRole === 'admin') {
        updates.adminApprovedAt = now;
        // Status changes to 'pending' for NGO review
        // Capacity remains counted
      }

      // When admin rejects a pending_admin booking
      if (status === 'rejected' && booking.status === 'pending_admin' && userRole === 'admin') {
        // Decrement capacity since pending_admin booking was counting toward it
        const experienceRef = adminDb.collection('experiences').doc(booking.experienceId);
        const expDoc = await experienceRef.get();

        if (expDoc.exists) {
          const expData = expDoc.data();
          await experienceRef.update({
            currentBookings: Math.max(0, (expData?.currentBookings || 0) - 1),
            updatedAt: now,
          });
        }

        updates.adminRejectedAt = now;
        if (body.adminRejectionReason) {
          updates.adminRejectionReason = body.adminRejectionReason;
        }
      }

      // When NGO confirms a pending booking
      if (status === 'confirmed' && booking.status === 'pending') {
        updates.confirmedAt = now;
        // Capacity already reserved when booking was created, so no need to increment
      } else if (status === 'confirmed' && !booking.confirmedAt) {
        updates.confirmedAt = now;
      } else if (status === 'completed' && !booking.completedAt) {
        updates.completedAt = now;
      }

      // When NGO rejects a booking
      if (status === 'rejected' && booking.status === 'pending' && userRole === 'ngo') {
        // Decrement capacity since pending booking was counting toward it
        const experienceRef = adminDb.collection('experiences').doc(booking.experienceId);
        const expDoc = await experienceRef.get();

        if (expDoc.exists) {
          const expData = expDoc.data();
          await experienceRef.update({
            currentBookings: Math.max(0, (expData?.currentBookings || 0) - 1),
            updatedAt: now,
          });
        }

        updates.rejectedAt = now;
        if (body.rejectionReason) {
          updates.rejectionReason = body.rejectionReason;
        }
      }

      await bookingRef.update(updates);

      const updatedBooking = await bookingRef.get();
      const data = updatedBooking.data();
      return NextResponse.json(
        {
          success: true,
          booking: {
            id: updatedBooking.id,
            ...data,
            appliedAt: data?.appliedAt?.toDate?.() || data?.appliedAt,
            confirmedAt: data?.confirmedAt?.toDate?.() || data?.confirmedAt,
            cancelledAt: data?.cancelledAt?.toDate?.() || data?.cancelledAt,
            completedAt: data?.completedAt?.toDate?.() || data?.completedAt,
            rejectedAt: data?.rejectedAt?.toDate?.() || data?.rejectedAt,
            adminApprovedAt: data?.adminApprovedAt?.toDate?.() || data?.adminApprovedAt,
            adminRejectedAt: data?.adminRejectedAt?.toDate?.() || data?.adminRejectedAt,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid status update' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;
    const userRole = decodedToken.role || 'user';

    // Get the booking
    const bookingRef = adminDb.collection('bookings').doc(id);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const bookingData = bookingDoc.data()!; // Non-null assertion since we checked exists
    const booking = bookingData as Booking;

    // Check permissions
    if (
      userRole !== 'admin' &&
      booking.userId !== userId &&
      (userRole !== 'ngo' || booking.ngoId !== userId)
    ) {
      return NextResponse.json(
        { error: 'Unauthorized - You do not have access to this booking' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        booking: {
          id: bookingDoc.id,
          ...bookingData,
          appliedAt: bookingData.appliedAt?.toDate?.() || bookingData.appliedAt,
          confirmedAt: bookingData.confirmedAt?.toDate?.() || bookingData.confirmedAt,
          cancelledAt: bookingData.cancelledAt?.toDate?.() || bookingData.cancelledAt,
          completedAt: bookingData.completedAt?.toDate?.() || bookingData.completedAt,
          rejectedAt: bookingData.rejectedAt?.toDate?.() || bookingData.rejectedAt,
          adminApprovedAt: bookingData.adminApprovedAt?.toDate?.() || bookingData.adminApprovedAt,
          adminRejectedAt: bookingData.adminRejectedAt?.toDate?.() || bookingData.adminRejectedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}
