import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { NewsletterSubscriber } from '@/lib/types/newsletter';

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

    // Check if user is admin
    const userRole = decodedToken.role || 'user';
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Fetch all newsletter subscribers
    const subscribersSnapshot = await adminDb
      .collection('newsletterSubscribers')
      .orderBy('subscribedAt', 'desc')
      .get();

    const subscribers: NewsletterSubscriber[] = [];
    subscribersSnapshot.forEach((doc) => {
      const data = doc.data();
      subscribers.push({
        id: doc.id,
        ...data,
        subscribedAt: data.subscribedAt?.toDate?.() || data.subscribedAt,
        consentGivenAt: data.consentGivenAt?.toDate?.() || data.consentGivenAt,
        unsubscribedAt: data.unsubscribedAt?.toDate?.() || data.unsubscribedAt,
      } as NewsletterSubscriber);
    });

    return NextResponse.json({ subscribers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter subscribers' },
      { status: 500 }
    );
  }
}
