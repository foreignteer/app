import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    // Verify admin token via Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    if (decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log(`Admin ${decodedToken.uid} attempting to delete user: ${email}`);

    // Get user by email
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return NextResponse.json({ message: 'User not found in Firebase Auth' }, { status: 404 });
      }
      throw error;
    }

    // Delete from Firestore
    await adminDb.collection('users').doc(userRecord.uid).delete();

    // Delete verification tokens
    const tokens = await adminDb
      .collection('verificationTokens')
      .where('userId', '==', userRecord.uid)
      .get();

    const batch = adminDb.batch();
    tokens.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    // Delete newsletter subscription
    const newsletters = await adminDb
      .collection('newsletterSubscribers')
      .where('email', '==', email.toLowerCase())
      .get();

    const batch2 = adminDb.batch();
    newsletters.docs.forEach((doc) => batch2.delete(doc.ref));
    await batch2.commit();

    // Delete from Firebase Auth (do this last)
    await adminAuth.deleteUser(userRecord.uid);

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
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
