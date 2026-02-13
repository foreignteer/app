import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { Booking } from '@/lib/types/booking';

interface ReviewRequestBody {
  rating: number;
  review: string;
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

    const body: ReviewRequestBody = await request.json();
    const { rating, review } = body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

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

    // Verify user owns this booking
    if (booking.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if attendance is confirmed
    if (booking.attendanceStatus !== 'confirmed') {
      return NextResponse.json(
        { error: 'Can only review after attendance is confirmed' },
        { status: 400 }
      );
    }

    // Check if already reviewed
    if (booking.rating) {
      return NextResponse.json(
        { error: 'You have already reviewed this experience' },
        { status: 400 }
      );
    }

    // Update booking with review
    await bookingRef.update({
      rating,
      review: review.trim(),
      reviewSubmittedAt: new Date(),
      reviewApproved: false, // Requires admin moderation
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your review! It will be published after moderation.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
