import { adminDb } from '@/lib/firebase/admin';
import crypto from 'crypto';

export interface VerificationToken {
  userId: string;
  email: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
}

/**
 * Generate a secure verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create and store a verification token for a user
 */
export async function createVerificationToken(
  userId: string,
  email: string
): Promise<string> {
  const token = generateVerificationToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  const verificationData: VerificationToken = {
    userId,
    email: email.toLowerCase(),
    token,
    createdAt: now,
    expiresAt,
    used: false,
  };

  await adminDb.collection('verificationTokens').add(verificationData);

  return token;
}

/**
 * Verify a token and return the user ID if valid
 */
export async function verifyToken(token: string): Promise<{
  valid: boolean;
  userId?: string;
  error?: string;
}> {
  try {
    // Find token in database
    const tokenSnapshot = await adminDb
      .collection('verificationTokens')
      .where('token', '==', token)
      .where('used', '==', false)
      .limit(1)
      .get();

    if (tokenSnapshot.empty) {
      return {
        valid: false,
        error: 'Invalid or expired verification link',
      };
    }

    const tokenDoc = tokenSnapshot.docs[0];
    const tokenData = tokenDoc.data() as VerificationToken;

    // Check if token has expired
    const now = new Date();
    const expiresAt = tokenData.expiresAt.toDate
      ? tokenData.expiresAt.toDate()
      : new Date(tokenData.expiresAt);

    if (now > expiresAt) {
      return {
        valid: false,
        error: 'Verification link has expired',
      };
    }

    // Mark token as used
    await tokenDoc.ref.update({ used: true });

    return {
      valid: true,
      userId: tokenData.userId,
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return {
      valid: false,
      error: 'An error occurred during verification',
    };
  }
}

/**
 * Delete old/expired verification tokens (cleanup)
 */
export async function cleanupExpiredTokens(): Promise<void> {
  const now = new Date();

  const expiredTokens = await adminDb
    .collection('verificationTokens')
    .where('expiresAt', '<', now)
    .get();

  const batch = adminDb.batch();
  expiredTokens.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}
