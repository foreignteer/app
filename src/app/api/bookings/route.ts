import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { Booking } from '@/lib/types/booking';

export async function POST(request: NextRequest) {
  try {
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

    // Parse the request body
    const body = await request.json();
    const { experienceId, answers } = body;

    if (!experienceId) {
      return NextResponse.json(
        { error: 'Experience ID is required' },
        { status: 400 }
      );
    }

    // Get the experience to verify it exists and get ngoId
    const experienceDoc = await adminDb
      .collection('experiences')
      .doc(experienceId)
      .get();

    if (!experienceDoc.exists) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    const experience = experienceDoc.data();

    // Check if experience is published
    if (experience?.status !== 'published') {
      return NextResponse.json(
        { error: 'This experience is not available for booking' },
        { status: 400 }
      );
    }

    // Check capacity
    const currentBookings = experience?.currentBookings || 0;
    const capacity = experience?.capacity || 0;

    if (currentBookings >= capacity) {
      return NextResponse.json(
        { error: 'This experience is fully booked' },
        { status: 400 }
      );
    }

    // Check if user has already booked this experience
    const existingBooking = await adminDb
      .collection('bookings')
      .where('experienceId', '==', experienceId)
      .where('userId', '==', userId)
      .where('status', 'in', ['pending', 'confirmed'])
      .get();

    if (!existingBooking.empty) {
      return NextResponse.json(
        { error: 'You have already booked this experience' },
        { status: 400 }
      );
    }

    // Create the booking
    const now = new Date();

    // Determine initial status based on instantConfirmation and requiresAdminApproval settings
    const isInstantConfirm = experience?.instantConfirmation === true;
    const requiresAdminApproval = experience?.requiresAdminApproval === true;

    let initialStatus: BookingStatus;
    if (isInstantConfirm) {
      initialStatus = 'confirmed';
    } else if (requiresAdminApproval) {
      initialStatus = 'pending_admin'; // Admin must approve first
    } else {
      initialStatus = 'pending'; // Direct to NGO approval
    }

    const booking: Omit<Booking, 'id'> = {
      experienceId,
      userId,
      ngoId: experience?.ngoId || '',
      status: initialStatus,
      answers: answers || {},
      appliedAt: now,
      ...(isInstantConfirm && { confirmedAt: now }), // Only set confirmedAt if instant
    };

    const bookingRef = await adminDb.collection('bookings').add(booking);

    // Update the experience's current bookings count
    await adminDb
      .collection('experiences')
      .doc(experienceId)
      .update({
        currentBookings: currentBookings + 1,
        updatedAt: now,
      });

    return NextResponse.json(
      {
        success: true,
        bookingId: bookingRef.id,
        booking: {
          id: bookingRef.id,
          ...booking,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const experienceId = searchParams.get('experienceId');
    const ngoId = searchParams.get('ngoId');

    let query = adminDb.collection('bookings');

    // Filter based on user role
    if (userRole === 'admin') {
      // Admin can see all bookings, optionally filtered
      if (experienceId) {
        query = query.where('experienceId', '==', experienceId) as any;
      }
      if (ngoId) {
        query = query.where('ngoId', '==', ngoId) as any;
      }
    } else if (userRole === 'ngo') {
      // NGO can see bookings for their experiences
      // First get the NGO's ID from their user document
      const userDoc = await adminDb.collection('users').doc(userId).get();
      const userNgoId = userDoc.data()?.ngoId;

      if (!userNgoId) {
        return NextResponse.json(
          { error: 'NGO ID not found for user' },
          { status: 403 }
        );
      }

      query = query.where('ngoId', '==', userNgoId) as any;

      if (experienceId) {
        query = query.where('experienceId', '==', experienceId) as any;
      }
    } else {
      // Regular users can only see their own bookings
      query = query.where('userId', '==', userId) as any;
    }

    const querySnapshot = await query.orderBy('appliedAt', 'desc').get();

    const bookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: doc.id,
        ...data,
        appliedAt: data.appliedAt?.toDate?.() || data.appliedAt,
        confirmedAt: data.confirmedAt?.toDate?.() || data.confirmedAt,
        cancelledAt: data.cancelledAt?.toDate?.() || data.cancelledAt,
        completedAt: data.completedAt?.toDate?.() || data.completedAt,
        rejectedAt: data.rejectedAt?.toDate?.() || data.rejectedAt,
      } as Booking);
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
