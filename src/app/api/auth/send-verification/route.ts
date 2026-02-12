import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { createVerificationToken } from '@/lib/services/verificationService';
import { sendEmail } from '@/lib/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user details from Firebase Auth
    const user = await adminAuth.getUser(userId);

    if (!user.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    // Generate verification token
    const token = await createVerificationToken(userId, user.email);

    // Create verification link
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://foreignteer.com';
    const verificationLink = `${baseUrl}/verify-email?token=${token}`;

    // Send verification email via Brevo
    await sendEmail({
      to: [{ email: user.email, name: user.displayName || 'there' }],
      subject: 'Verify Your Foreignteer Email Address',
      htmlContent: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #4A4A4A;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #21B3B1;
                color: white;
                padding: 30px 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background-color: #FAF5EC;
                padding: 30px 20px;
              }
              .button {
                display: inline-block;
                background-color: #21B3B1;
                color: white !important;
                padding: 14px 40px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: bold;
              }
              .footer {
                background-color: #4A4A4A;
                color: white;
                padding: 20px;
                text-align: center;
                font-size: 14px;
                border-radius: 0 0 8px 8px;
              }
              .notice {
                background-color: #FFF3CD;
                border: 1px solid #F2B56B;
                padding: 15px;
                border-radius: 6px;
                margin: 20px 0;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Welcome to Foreignteer! 🌍</h1>
            </div>
            <div class="content">
              <p>Hi ${user.displayName || 'there'},</p>
              <p>Thank you for joining Foreignteer! We're excited to help you discover meaningful volunteering experiences around the world.</p>

              <p><strong>To get started, please verify your email address:</strong></p>

              <div style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </div>

              <div class="notice">
                <strong>⏰ Important:</strong> This verification link will expire in 24 hours for security reasons.
              </div>

              <p>After verifying your email, you'll be able to:</p>
              <ul>
                <li>Browse volunteering opportunities worldwide</li>
                <li>Book meaningful experiences</li>
                <li>Track your volunteer journey</li>
                <li>Connect with NGOs making a difference</li>
              </ul>

              <p>If you didn't create a Foreignteer account, you can safely ignore this email.</p>

              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E6EAEA; font-size: 14px; color: #7A7A7A;">
                <strong>Button not working?</strong> Copy and paste this link into your browser:<br>
                <span style="word-break: break-all; color: #21B3B1;">${verificationLink}</span>
              </p>

              <p>Need help? Contact us at <a href="mailto:info@foreignteer.com" style="color: #21B3B1;">info@foreignteer.com</a></p>

              <p><strong>The Foreignteer Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Foreignteer. All rights reserved.</p>
              <p>Connecting travellers with meaningful volunteering experiences worldwide.</p>
            </div>
          </body>
        </html>
      `,
      textContent: `
        Welcome to Foreignteer!

        Hi ${user.displayName || 'there'},

        Thank you for joining Foreignteer! We're excited to help you discover meaningful volunteering experiences around the world.

        To get started, please verify your email address by clicking this link:
        ${verificationLink}

        ⏰ IMPORTANT: This verification link will expire in 24 hours.

        After verifying your email, you'll be able to:
        - Browse volunteering opportunities worldwide
        - Book meaningful experiences
        - Track your volunteer journey
        - Connect with NGOs making a difference

        If you didn't create a Foreignteer account, you can safely ignore this email.

        Need help? Email info@foreignteer.com

        The Foreignteer Team
        © 2025 Foreignteer
      `,
    });

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
