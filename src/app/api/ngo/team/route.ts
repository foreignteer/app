import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { sendEmail } from '@/lib/services/emailService';
import { randomBytes } from 'crypto';

// Helper: verify caller is an active NGO member
async function getCallerNGOMembership(userId: string, ngoId: string) {
  const snapshot = await adminDb
    .collection('ngoTeamMembers')
    .where('userId', '==', userId)
    .where('ngoId', '==', ngoId)
    .where('status', '==', 'active')
    .limit(1)
    .get();
  return snapshot.empty ? null : snapshot.docs[0].data();
}

// GET /api/ngo/team — list team members for caller's NGO
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
    } catch {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    if (decodedToken.role !== 'ngo') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get caller's ngoId from user doc
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const ngoId = userDoc.data()?.ngoId;
    if (!ngoId) {
      return NextResponse.json({ error: 'NGO not found' }, { status: 404 });
    }

    const snapshot = await adminDb
      .collection('ngoTeamMembers')
      .where('ngoId', '==', ngoId)
      .where('status', '==', 'active')
      .get();

    const members = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      invitedAt: doc.data().invitedAt?.toDate?.()?.toISOString() || null,
      joinedAt: doc.data().joinedAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}

// POST /api/ngo/team — send staff invitation (owner only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
    } catch {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    if (decodedToken.role !== 'ngo') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    const ngoId = userData?.ngoId;

    if (!ngoId) {
      return NextResponse.json({ error: 'NGO not found' }, { status: 404 });
    }

    // Only owners can invite
    const membership = await getCallerNGOMembership(decodedToken.uid, ngoId);
    if (!membership || membership.ngoRole !== 'owner') {
      return NextResponse.json({ error: 'Only NGO owners can invite team members' }, { status: 403 });
    }

    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check email not already a team member
    const existingMember = await adminDb
      .collection('ngoTeamMembers')
      .where('ngoId', '==', ngoId)
      .where('email', '==', normalizedEmail)
      .where('status', '==', 'active')
      .limit(1)
      .get();

    if (!existingMember.empty) {
      return NextResponse.json({ error: 'This email is already a team member' }, { status: 400 });
    }

    // Check no pending invite for same email at same NGO
    const now = new Date();
    const existingInvite = await adminDb
      .collection('ngoInvitations')
      .where('ngoId', '==', ngoId)
      .where('invitedEmail', '==', normalizedEmail)
      .where('used', '==', false)
      .limit(1)
      .get();

    if (!existingInvite.empty) {
      const invite = existingInvite.docs[0].data();
      const expiry = invite.expiresAt?.toDate?.() || new Date(0);
      if (expiry > now) {
        return NextResponse.json({ error: 'An active invitation already exists for this email' }, { status: 400 });
      }
    }

    // Get NGO name
    const ngoDoc = await adminDb.collection('ngos').doc(ngoId).get();
    const ngoName = ngoDoc.data()?.name || 'Your Organisation';

    // Create invitation token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 hours

    await adminDb.collection('ngoInvitations').doc(token).set({
      ngoId,
      ngoName,
      invitedEmail: normalizedEmail,
      ngoRole: 'staff',
      invitedBy: decodedToken.uid,
      createdAt: now,
      expiresAt,
      used: false,
    });

    // Send invitation email
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://foreignteer.com';
    const inviteUrl = `${baseUrl}/join-ngo?token=${token}`;
    const inviterName = userData?.displayName || 'The team';

    await sendEmail({
      to: [{ email: normalizedEmail }],
      subject: `You've been invited to join ${ngoName} on Foreignteer`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #4A4A4A; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #21B3B1; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #FAF5EC; padding: 30px 20px; }
              .button { display: inline-block; background-color: #21B3B1; color: white !important; padding: 14px 40px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
              .notice { background-color: #FFF3CD; border: 1px solid #F2B56B; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; }
              .footer { background-color: #4A4A4A; color: white; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 8px 8px; }
              .role-badge { background-color: #C9F0EF; color: #21B3B1; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>You're Invited! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p><strong>${inviterName}</strong> has invited you to join <strong>${ngoName}</strong> as a team member on Foreignteer.</p>

              <p>Your role: <span class="role-badge">Staff</span></p>

              <p>As a Staff member, you'll be able to:</p>
              <ul>
                <li>Create and manage volunteering experiences</li>
                <li>Review and manage applicants</li>
                <li>Track volunteer attendance</li>
              </ul>

              <div style="text-align: center;">
                <a href="${inviteUrl}" class="button">Accept Invitation</a>
              </div>

              <div class="notice">
                <strong>⏰ Important:</strong> This invitation expires in 72 hours. You'll need to create a new Foreignteer account using the email address this invitation was sent to.
              </div>

              <p>If you weren't expecting this invitation or don't recognise <strong>${ngoName}</strong>, you can safely ignore this email.</p>

              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E6EAEA; font-size: 14px; color: #7A7A7A;">
                <strong>Button not working?</strong> Copy and paste this link:<br>
                <span style="word-break: break-all; color: #21B3B1;">${inviteUrl}</span>
              </p>

              <p><strong>The Foreignteer Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Foreignteer. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
      textContent: `
You've been invited to join ${ngoName} on Foreignteer!

${inviterName} has invited you as a Staff member.

Accept your invitation: ${inviteUrl}

This invite expires in 72 hours.

If you weren't expecting this, ignore this email.

The Foreignteer Team
      `,
    });

    return NextResponse.json({ message: 'Invitation sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}
