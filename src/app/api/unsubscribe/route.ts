import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase();

    // Remove from newsletter subscribers
    const newsletterQuery = await adminDb
      .collection('newsletterSubscribers')
      .where('email', '==', emailLower)
      .get();

    const batch = adminDb.batch();
    newsletterQuery.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    console.log(`✅ Unsubscribed ${emailLower} from marketing emails`);

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully unsubscribed from marketing emails',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
