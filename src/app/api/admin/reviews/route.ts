import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Verify user is admin
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Fetch all bookings with reviews
    const bookingsSnapshot = await adminDb
      .collection('bookings')
      .where('reviewSubmittedAt', '!=', null)
      .orderBy('reviewSubmittedAt', 'desc')
      .get();

    const reviews = await Promise.all(
      bookingsSnapshot.docs.map(async (doc) => {
        const booking = doc.data();

        // Fetch user details
        const userRef = adminDb.collection('users').doc(booking.userId);
        const userDoc = await userRef.get();
        const user = userDoc.data();

        // Fetch experience details
        const experienceRef = adminDb.collection('experiences').doc(booking.experienceId);
        const experienceDoc = await experienceRef.get();
        const experience = experienceDoc.data();

        return {
          id: doc.id,
          userId: booking.userId,
          experienceId: booking.experienceId,
          rating: booking.rating,
          review: booking.review,
          reviewSubmittedAt: booking.reviewSubmittedAt,
          reviewApproved: booking.reviewApproved || false,
          reviewRejectionReason: booking.reviewRejectionReason,
          user: {
            displayName: user?.name || user?.displayName || 'Unknown User',
            email: user?.email || '',
          },
          experience: {
            title: experience?.title || 'Unknown Experience',
            city: experience?.city || '',
            country: experience?.country || '',
            dates: {
              start: experience?.dates?.start || null,
              end: experience?.dates?.end || null,
            },
          },
        };
      })
    );

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
