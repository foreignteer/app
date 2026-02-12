import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { verifyToken } from '@/lib/services/verificationService';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Verify the token
    const result = await verifyToken(token);

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error || 'Invalid verification token' },
        { status: 400 }
      );
    }

    const userId = result.userId!;

    // Update user's email verified status in Firebase Auth
    await adminAuth.updateUser(userId, {
      emailVerified: true,
    });

    // Update user document in Firestore
    await adminDb.collection('users').doc(userId).update({
      emailVerified: true,
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully',
        userId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
