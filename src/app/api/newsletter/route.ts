import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { NewsletterSubscriber } from '@/lib/types/newsletter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = 'footer', userId } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Check if already subscribed
    const existingSubscribers = await adminDb
      .collection('newsletterSubscribers')
      .where('email', '==', emailLower)
      .get();

    if (!existingSubscribers.empty) {
      const existing = existingSubscribers.docs[0].data();

      // If previously unsubscribed, resubscribe
      if (existing.status === 'unsubscribed') {
        await adminDb
          .collection('newsletterSubscribers')
          .doc(existingSubscribers.docs[0].id)
          .update({
            status: 'active',
            subscribedAt: new Date(),
            consentGivenAt: new Date(),
            unsubscribedAt: null,
          });

        return NextResponse.json(
          { success: true, message: 'Resubscribed successfully' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Create new subscription
    const now = new Date();
    const subscriber: Omit<NewsletterSubscriber, 'id'> = {
      email: emailLower,
      subscribedAt: now,
      source,
      marketingConsent: true,
      consentGivenAt: now,
      status: 'active',
      ...(userId && { userId }),
    };

    await adminDb.collection('newsletterSubscribers').add(subscriber);

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to newsletter' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Find subscriber
    const subscribers = await adminDb
      .collection('newsletterSubscribers')
      .where('email', '==', emailLower)
      .get();

    if (subscribers.empty) {
      return NextResponse.json(
        { error: 'Email not found in newsletter' },
        { status: 404 }
      );
    }

    // Unsubscribe
    await adminDb
      .collection('newsletterSubscribers')
      .doc(subscribers.docs[0].id)
      .update({
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      });

    return NextResponse.json(
      { success: true, message: 'Successfully unsubscribed from newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
}
