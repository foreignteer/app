import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

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

    // Verify the token and check if user is admin
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

    const userRole = decodedToken.role || 'user';

    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    // Fetch bookings
    let bookingsQuery = adminDb.collection('bookings');

    if (statusFilter) {
      bookingsQuery = bookingsQuery.where('status', '==', statusFilter) as any;
    }

    const bookingsSnapshot = await bookingsQuery.get();

    // Fetch related data for each booking
    const bookingsWithDetails = await Promise.all(
      bookingsSnapshot.docs.map(async (doc) => {
        const booking = doc.data();

        // Fetch user, experience, and NGO data in parallel
        const [userDoc, experienceDoc, ngoDoc] = await Promise.all([
          adminDb.collection('users').doc(booking.userId).get(),
          adminDb.collection('experiences').doc(booking.experienceId).get(),
          adminDb.collection('ngos').doc(booking.ngoId).get(),
        ]);

        const user = userDoc.data();
        const experience = experienceDoc.data();
        const ngo = ngoDoc.data();

        return {
          id: doc.id,
          ...booking,
          appliedAt: booking.appliedAt?.toDate?.() || booking.appliedAt,
          confirmedAt: booking.confirmedAt?.toDate?.() || booking.confirmedAt,
          cancelledAt: booking.cancelledAt?.toDate?.() || booking.cancelledAt,
          completedAt: booking.completedAt?.toDate?.() || booking.completedAt,
          rejectedAt: booking.rejectedAt?.toDate?.() || booking.rejectedAt,
          adminApprovedAt: booking.adminApprovedAt?.toDate?.() || booking.adminApprovedAt,
          adminRejectedAt: booking.adminRejectedAt?.toDate?.() || booking.adminRejectedAt,
          user: {
            id: booking.userId,
            email: user?.email || '',
            displayName: user?.displayName || 'Unknown',
            phone: user?.phone,
            countryOfOrigin: user?.countryOfOrigin,
          },
          experience: {
            id: booking.experienceId,
            title: experience?.title || 'Unknown Experience',
            city: experience?.city || '',
            country: experience?.country || '',
            dates: {
              start: experience?.dates?.start?.toDate?.() || new Date(),
              end: experience?.dates?.end?.toDate?.() || new Date(),
            },
          },
          ngo: {
            id: booking.ngoId,
            name: ngo?.name || 'Unknown NGO',
            contactEmail: ngo?.contactEmail || '',
          },
        };
      })
    );

    // Sort by appliedAt (most recent first)
    bookingsWithDetails.sort((a, b) => {
      const dateA = new Date(a.appliedAt).getTime();
      const dateB = new Date(b.appliedAt).getTime();
      return dateB - dateA;
    });

    return NextResponse.json(
      { bookings: bookingsWithDetails },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
