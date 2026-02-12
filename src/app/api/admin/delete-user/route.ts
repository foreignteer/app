import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const { email, adminPassword } = await request.json();

    // Simple admin password check (you should change this!)
    if (adminPassword !== 'delete-user-admin-2025') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log(`Attempting to delete user: ${email}`);

    // Get user by email
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
      console.log(`Found user: ${userRecord.uid}`);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return NextResponse.json(
          { message: 'User not found in Firebase Auth' },
          { status: 404 }
        );
      }
      throw error;
    }

    // Delete from Firestore
    // 1. Delete user document
    await adminDb.collection('users').doc(userRecord.uid).delete();
    console.log('Deleted user document');

    // 2. Delete verification tokens
    const tokens = await adminDb
      .collection('verificationTokens')
      .where('userId', '==', userRecord.uid)
      .get();

    const batch = adminDb.batch();
    tokens.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Deleted ${tokens.size} verification tokens`);

    // 3. Delete newsletter subscription
    const newsletters = await adminDb
      .collection('newsletterSubscribers')
      .where('email', '==', email.toLowerCase())
      .get();

    const batch2 = adminDb.batch();
    newsletters.docs.forEach((doc) => {
      batch2.delete(doc.ref);
    });
    await batch2.commit();
    console.log(`Deleted ${newsletters.size} newsletter subscriptions`);

    // 4. Delete from Firebase Auth (do this last)
    await adminAuth.deleteUser(userRecord.uid);
    console.log('Deleted from Firebase Auth');

    return NextResponse.json(
      {
        success: true,
        message: `Successfully deleted user: ${email}`,
        deletedItems: {
          auth: true,
          userDoc: true,
          verificationTokens: tokens.size,
          newsletterSubs: newsletters.size,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
