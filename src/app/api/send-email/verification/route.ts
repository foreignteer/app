import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, name, verificationLink } = await request.json();

    // Validate input
    if (!email || !name || !verificationLink) {
      return NextResponse.json(
        { error: 'Email, name, and verification link are required' },
        { status: 400 }
      );
    }

    // Send email verification using Brevo
    await sendEmail({
      to: [{ email, name }],
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
                color: white;
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
              <p>Hi ${name},</p>
              <p>Thank you for joining Foreignteer! We're excited to help you discover meaningful volunteering experiences around the world.</p>

              <p><strong>To get started, please verify your email address:</strong></p>

              <p style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </p>

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

              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #21B3B1; font-size: 14px;">${verificationLink}</p>

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

        Hi ${name},

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
