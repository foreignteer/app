import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';

export async function PATCH(
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

    // Fetch the booking
    const bookingRef = adminDb.collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingDoc.data();

    // Verify booking has a review
    if (!booking?.reviewSubmittedAt) {
      return NextResponse.json({ error: 'No review found for this booking' }, { status: 400 });
    }

    // Approve the review
    await bookingRef.update({
      reviewApproved: true,
      reviewApprovedAt: new Date(),
      reviewApprovedBy: userId,
      reviewRejectionReason: null, // Clear any previous rejection reason
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Review approved successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error approving review:', error);
    return NextResponse.json(
      { error: 'Failed to approve review' },
      { status: 500 }
    );
  }
}
