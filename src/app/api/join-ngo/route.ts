import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { createVerificationToken } from '@/lib/services/verificationService';
import { sendEmail } from '@/lib/services/emailService';

// GET /api/join-ngo?token=xxx — validate invite token
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const inviteDoc = await adminDb.collection('ngoInvitations').doc(token).get();
    if (!inviteDoc.exists) {
      return NextResponse.json({ valid: false, reason: 'not_found' }, { status: 200 });
    }

    const invite = inviteDoc.data()!;

    if (invite.used) {
      return NextResponse.json({ valid: false, reason: 'already_used' }, { status: 200 });
    }

    const now = new Date();
    const expiresAt = invite.expiresAt?.toDate?.() || new Date(0);
    if (expiresAt < now) {
      return NextResponse.json({ valid: false, reason: 'expired' }, { status: 200 });
    }

    return NextResponse.json({
      valid: true,
      ngoId: invite.ngoId,
      ngoName: invite.ngoName,
      invitedEmail: invite.invitedEmail,
      ngoRole: invite.ngoRole,
    });
  } catch (error) {
    console.error('Error validating invite:', error);
    return NextResponse.json({ error: 'Failed to validate invitation' }, { status: 500 });
  }
}

// POST /api/join-ngo — accept invitation and create account
export async function POST(request: NextRequest) {
  try {
    const { token, displayName, password } = await request.json();

    if (!token || !displayName || !password) {
      return NextResponse.json({ error: 'Token, name, and password are required' }, { status: 400 });
    }

    // Validate token
    const inviteDoc = await adminDb.collection('ngoInvitations').doc(token).get();
    if (!inviteDoc.exists) {
      return NextResponse.json({ error: 'Invalid invitation' }, { status: 400 });
    }

    const invite = inviteDoc.data()!;

    if (invite.used) {
      return NextResponse.json({ error: 'This invitation has already been used' }, { status: 400 });
    }

    const now = new Date();
    const expiresAt = invite.expiresAt?.toDate?.() || new Date(0);
    if (expiresAt < now) {
      return NextResponse.json({ error: 'This invitation has expired' }, { status: 400 });
    }

    const { ngoId, ngoName, invitedEmail, ngoRole } = invite;

    // Check email not already registered
    try {
      await adminAuth.getUserByEmail(invitedEmail);
      return NextResponse.json({
        error: 'An account with this email already exists. Please use a different email or contact your NGO owner.',
      }, { status: 400 });
    } catch (err: any) {
      if (err.code !== 'auth/user-not-found') throw err;
      // Expected: user doesn't exist, continue
    }

    // Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email: invitedEmail,
      password,
      displayName: displayName.trim(),
    });

    const userId = userRecord.uid;

    // Set custom claims: role = 'ngo'
    await adminAuth.setCustomUserClaims(userId, { role: 'ngo' });

    // Create user Firestore document
    await adminDb.collection('users').doc(userId).set({
      uid: userId,
      email: invitedEmail,
      displayName: displayName.trim(),
      role: 'ngo',
      ngoId,
      ngoRole,
      profileCompleted: false,
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    });

    // Create team member record
    await adminDb.collection('ngoTeamMembers').add({
      ngoId,
      userId,
      ngoRole,
      email: invitedEmail,
      displayName: displayName.trim(),
      invitedBy: invite.invitedBy,
      invitedAt: invite.createdAt,
      joinedAt: now,
      status: 'active',
    });

    // Mark invitation as used
    await adminDb.collection('ngoInvitations').doc(token).update({
      used: true,
      usedAt: now,
      usedBy: userId,
    });

    // Send verification email directly (same pattern as /api/auth/send-verification)
    try {
      const verificationToken = await createVerificationToken(userId, invitedEmail);
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://foreignteer.com';
      const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;

      await sendEmail({
        to: [{ email: invitedEmail, name: displayName.trim() }],
        subject: 'Verify Your Foreignteer Email Address',
        htmlContent: `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #21B3B1; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1>Welcome to Foreignteer!</h1>
            </div>
            <div style="background-color: #FAF5EC; padding: 30px 20px;">
              <p>Hi ${displayName.trim()},</p>
              <p>You've been added to <strong>${ngoName}</strong> on Foreignteer. Please verify your email to get started.</p>
              <div style="text-align: center;">
                <a href="${verificationLink}" style="display: inline-block; background-color: #21B3B1; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold;">Verify Email Address</a>
              </div>
              <p style="font-size: 14px; color: #7A7A7A;">This link expires in 24 hours. If you didn't expect this email, you can ignore it.</p>
              <p style="font-size: 14px; color: #7A7A7A;">Or copy this link: <span style="color: #21B3B1; word-break: break-all;">${verificationLink}</span></p>
            </div>
            <div style="background-color: #4A4A4A; color: white; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 8px 8px;">
              <p>&copy; 2026 Foreignteer. All rights reserved.</p>
            </div>
          </div>
        `,
        textContent: `Hi ${displayName.trim()},\n\nYou've been added to ${ngoName} on Foreignteer. Please verify your email:\n\n${verificationLink}\n\nThis link expires in 24 hours.\n\nThe Foreignteer Team`,
      });
    } catch {
      // Don't fail registration if verification email fails
    }

    return NextResponse.json({
      message: 'Account created successfully',
      userId,
      email: invitedEmail,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error accepting invitation:', error);
    if (error.code === 'auth/weak-password') {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
