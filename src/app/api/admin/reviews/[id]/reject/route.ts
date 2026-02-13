import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';

interface RejectRequestBody {
  reason: string;
}

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

    const body: RejectRequestBody = await request.json();
    const { reason } = body;

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

    // Reject the review
    await bookingRef.update({
      reviewApproved: false,
      reviewRejectionReason: reason || 'Does not meet community guidelines',
      reviewRejectedAt: new Date(),
      reviewRejectedBy: userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Review rejected',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error rejecting review:', error);
    return NextResponse.json(
      { error: 'Failed to reject review' },
      { status: 500 }
    );
  }
}
