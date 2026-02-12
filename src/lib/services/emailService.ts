import * as brevo from '@getbrevo/brevo';

// Initialize Brevo API client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

export interface EmailOptions {
  to: {
    email: string;
    name?: string;
  }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  from?: {
    email: string;
    name: string;
  };
  replyTo?: {
    email: string;
    name?: string;
  };
}

/**
 * Send a transactional email using Brevo
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  // Set sender (default to info@foreignteer.com)
  sendSmtpEmail.sender = options.from || {
    email: 'info@foreignteer.com',
    name: 'Foreignteer',
  };

  // Set recipients
  sendSmtpEmail.to = options.to;

  // Set subject and content
  sendSmtpEmail.subject = options.subject;
  sendSmtpEmail.htmlContent = options.htmlContent;

  if (options.textContent) {
    sendSmtpEmail.textContent = options.textContent;
  }

  // Set reply-to if provided
  if (options.replyTo) {
    sendSmtpEmail.replyTo = options.replyTo;
  }

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent successfully to:', options.to[0].email);
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error: any) {
    console.error('❌ Failed to send email to:', options.to[0].email);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.body || error.response,
      status: error.status || error.statusCode,
    });

    // Provide more specific error messages
    if (error.response?.body?.message) {
      throw new Error(`Email error: ${error.response.body.message}`);
    }

    throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  await sendEmail({
    to: [{ email, name }],
    subject: 'Welcome to Foreignteer! 🌍',
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
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              background-color: #4A4A4A;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              border-radius: 0 0 8px 8px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to Foreignteer!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for joining Foreignteer! We're excited to help you discover meaningful volunteering experiences around the world.</p>
            <p><strong>What's next?</strong></p>
            <ul>
              <li>Browse volunteering opportunities in your favorite destinations</li>
              <li>Complete your profile to personalize your experience</li>
              <li>Book your first micro-volunteering experience</li>
            </ul>
            <p style="text-align: center;">
              <a href="https://foreignteer.com/experiences" class="button">Explore Opportunities</a>
            </p>
            <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:volunteer@foreignteer.com">volunteer@foreignteer.com</a>.</p>
            <p>Happy volunteering!</p>
            <p><strong>The Foreignteer Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Foreignteer. All rights reserved.</p>
            <p>Connecting travellers with meaningful volunteering experiences worldwide.</p>
            <p style="margin-top: 15px; font-size: 12px;">
              <a href="https://foreignteer.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #C9F0EF; text-decoration: underline;">Unsubscribe</a> from our emails
            </p>
          </div>
        </body>
      </html>
    `,
    textContent: `
      Welcome to Foreignteer!

      Hi ${name},

      Thank you for joining Foreignteer! We're excited to help you discover meaningful volunteering experiences around the world.

      What's next?
      - Browse volunteering opportunities in your favorite destinations
      - Complete your profile to personalize your experience
      - Book your first micro-volunteering experience

      Explore opportunities: https://foreignteer.com/experiences

      If you have any questions, reach out to volunteer@foreignteer.com.

      Happy volunteering!
      The Foreignteer Team

      ---
      Unsubscribe: https://foreignteer.com/unsubscribe?email=${encodeURIComponent(email)}
    `,
  });
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail(
  email: string,
  name: string,
  bookingDetails: {
    experienceTitle: string;
    ngoName: string;
    ngoEmail?: string;
    ngoPhone?: string;
    ngoWebsite?: string;
    date: string;
    location: string;
    price: string;
  }
): Promise<void> {
  await sendEmail({
    to: [{ email, name }],
    subject: `Booking Confirmed: ${bookingDetails.experienceTitle}`,
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
            .booking-details {
              background-color: white;
              border: 2px solid #21B3B1;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #E6EAEA;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .button {
              display: inline-block;
              background-color: #21B3B1;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              background-color: #4A4A4A;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              border-radius: 0 0 8px 8px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Booking Confirmed! ✓</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Great news! Your volunteering experience has been confirmed.</p>

            <div class="booking-details">
              <h2 style="color: #21B3B1; margin-top: 0;">Booking Details</h2>
              <div class="detail-row">
                <strong>Experience:</strong>
                <span>${bookingDetails.experienceTitle}</span>
              </div>
              <div class="detail-row">
                <strong>Date:</strong>
                <span>${bookingDetails.date}</span>
              </div>
              <div class="detail-row">
                <strong>Location:</strong>
                <span>${bookingDetails.location}</span>
              </div>
              <div class="detail-row">
                <strong>Total:</strong>
                <span>${bookingDetails.price}</span>
              </div>
            </div>

            <div style="background-color: #C9F0EF; border-left: 4px solid #21B3B1; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #21B3B1; margin-top: 0;">Your Partner Organisation</h3>
              <p style="margin: 10px 0;"><strong>${bookingDetails.ngoName}</strong></p>
              ${bookingDetails.ngoEmail ? `
                <p style="margin: 5px 0;">
                  <strong>Email:</strong>
                  <a href="mailto:${bookingDetails.ngoEmail}" style="color: #21B3B1;">${bookingDetails.ngoEmail}</a>
                </p>
              ` : ''}
              ${bookingDetails.ngoPhone ? `
                <p style="margin: 5px 0;">
                  <strong>Phone:</strong> ${bookingDetails.ngoPhone}
                </p>
              ` : ''}
              ${bookingDetails.ngoWebsite ? `
                <p style="margin: 5px 0;">
                  <strong>Website:</strong>
                  <a href="${bookingDetails.ngoWebsite}" style="color: #21B3B1;" target="_blank">${bookingDetails.ngoWebsite}</a>
                </p>
              ` : ''}
              <p style="margin-top: 15px; font-size: 14px; color: #7A7A7A;">
                The organisation will contact you directly with specific instructions about your volunteering experience.
              </p>
            </div>

            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Check your dashboard for all booking details</li>
              <li>You'll receive a reminder email closer to the date</li>
              <li>The organisation will contact you directly with specific instructions</li>
              <li>Please reach out to them if you have any questions</li>
            </ul>

            <p style="text-align: center;">
              <a href="https://foreignteer.com/dashboard/user" class="button">View My Bookings</a>
            </p>

            <p>If you have any questions, contact us at <a href="mailto:volunteer@foreignteer.com">volunteer@foreignteer.com</a>.</p>

            <p>We can't wait for you to make a difference!</p>
            <p><strong>The Foreignteer Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Foreignteer. All rights reserved.</p>
            <p>Connecting travellers with meaningful volunteering experiences worldwide.</p>
            <p style="margin-top: 15px; font-size: 12px;">
              <a href="https://foreignteer.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #C9F0EF; text-decoration: underline;">Unsubscribe</a> from our emails
            </p>
          </div>
        </body>
      </html>
    `,
    textContent: `
      Booking Confirmed!

      Hi ${name},

      Great news! Your volunteering experience has been confirmed.

      BOOKING DETAILS:
      Experience: ${bookingDetails.experienceTitle}
      Date: ${bookingDetails.date}
      Location: ${bookingDetails.location}
      Total: ${bookingDetails.price}

      YOUR PARTNER ORGANISATION:
      ${bookingDetails.ngoName}
      ${bookingDetails.ngoEmail ? `Email: ${bookingDetails.ngoEmail}` : ''}
      ${bookingDetails.ngoPhone ? `Phone: ${bookingDetails.ngoPhone}` : ''}
      ${bookingDetails.ngoWebsite ? `Website: ${bookingDetails.ngoWebsite}` : ''}

      The organisation will contact you directly with specific instructions about your volunteering experience.

      What happens next?
      - Check your dashboard for all booking details
      - You'll receive a reminder email closer to the date
      - The organisation will contact you with specific instructions
      - Please reach out to them if you have any questions

      View your bookings: https://foreignteer.com/dashboard/user

      Questions? Email volunteer@foreignteer.com

      We can't wait for you to make a difference!
      The Foreignteer Team

      ---
      Unsubscribe: https://foreignteer.com/unsubscribe?email=${encodeURIComponent(email)}
    `,
  });
}

/**
 * Send NGO approval notification
 */
export async function sendNGOApprovalEmail(
  email: string,
  ngoName: string,
  contactName: string
): Promise<void> {
  await sendEmail({
    to: [{ email, name: contactName }],
    subject: `${ngoName} Approved - Welcome to Foreignteer!`,
    from: {
      email: 'partner@foreignteer.com',
      name: 'Foreignteer Partner Team',
    },
    replyTo: {
      email: 'partner@foreignteer.com',
      name: 'Foreignteer Partner Team',
    },
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
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              background-color: #4A4A4A;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              border-radius: 0 0 8px 8px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to Foreignteer! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${contactName},</p>
            <p>Congratulations! We're excited to inform you that <strong>${ngoName}</strong> has been approved to join the Foreignteer platform.</p>

            <p><strong>You can now:</strong></p>
            <ul>
              <li>Create and publish volunteering experiences</li>
              <li>Manage bookings and volunteers</li>
              <li>Connect with travellers who want to make a difference</li>
              <li>Track your impact and reach</li>
            </ul>

            <p style="text-align: center;">
              <a href="https://foreignteer.com/dashboard/ngo" class="button">Access Your Dashboard</a>
            </p>

            <p><strong>Getting Started:</strong></p>
            <ol>
              <li>Log in to your NGO dashboard</li>
              <li>Complete your organisation profile</li>
              <li>Create your first volunteering experience</li>
              <li>Start welcoming volunteers!</li>
            </ol>

            <p>Our partner support team is here to help you succeed. If you have any questions or need assistance, don't hesitate to reach out at <a href="mailto:partner@foreignteer.com">partner@foreignteer.com</a>.</p>

            <p>Thank you for partnering with us to create meaningful impact!</p>
            <p><strong>The Foreignteer Partner Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Foreignteer. All rights reserved.</p>
            <p>Connecting travellers with meaningful volunteering experiences worldwide.</p>
            <p style="margin-top: 15px; font-size: 12px;">
              <a href="https://foreignteer.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #C9F0EF; text-decoration: underline;">Unsubscribe</a> from our emails
            </p>
          </div>
        </body>
      </html>
    `,
    textContent: `
      Welcome to Foreignteer!

      Hi ${contactName},

      Congratulations! ${ngoName} has been approved to join the Foreignteer platform.

      You can now:
      - Create and publish volunteering experiences
      - Manage bookings and volunteers
      - Connect with travellers who want to make a difference
      - Track your impact and reach

      Access your dashboard: https://foreignteer.com/dashboard/ngo

      Getting Started:
      1. Log in to your NGO dashboard
      2. Complete your organisation profile
      3. Create your first volunteering experience
      4. Start welcoming volunteers!

      Questions? Email partner@foreignteer.com

      Thank you for partnering with us to create meaningful impact!
      The Foreignteer Partner Team

      ---
      Unsubscribe: https://foreignteer.com/unsubscribe?email=${encodeURIComponent(email)}
    `,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetLink: string
): Promise<void> {
  await sendEmail({
    to: [{ email, name }],
    subject: 'Reset Your Foreignteer Password',
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
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              background-color: #4A4A4A;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              border-radius: 0 0 8px 8px;
            }
            .warning {
              background-color: #FFF3CD;
              border: 1px solid #F2B56B;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>We received a request to reset your Foreignteer password. Click the button below to create a new password:</p>

            <p style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </p>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact us if you have concerns.
            </div>

            <p>For security reasons, this link can only be used once. If you need to reset your password again, you'll need to request a new link.</p>

            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #21B3B1;">${resetLink}</p>

            <p>Questions? Contact us at <a href="mailto:info@foreignteer.com">info@foreignteer.com</a>.</p>

            <p><strong>The Foreignteer Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Foreignteer. All rights reserved.</p>
            <p>Connecting travellers with meaningful volunteering experiences worldwide.</p>
            <p style="margin-top: 15px; font-size: 12px;">
              <a href="https://foreignteer.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #C9F0EF; text-decoration: underline;">Unsubscribe</a> from our emails
            </p>
          </div>
        </body>
      </html>
    `,
    textContent: `
      Password Reset Request

      Hi ${name},

      We received a request to reset your Foreignteer password.

      Reset your password here: ${resetLink}

      ⚠️ SECURITY NOTICE:
      This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.

      For security reasons, this link can only be used once.

      Questions? Email info@foreignteer.com

      The Foreignteer Team

      ---
      Unsubscribe: https://foreignteer.com/unsubscribe?email=${encodeURIComponent(email)}
    `,
  });
}
