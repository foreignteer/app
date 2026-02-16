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
 * Send NGO rejection notification email
 */
export async function sendNGORejectionEmail(
  email: string,
  ngoName: string,
  contactName: string,
  rejectionReason: string
): Promise<void> {
  await sendEmail({
    to: [{ email, name: contactName }],
    subject: `Application Update for ${ngoName}`,
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
              background-color: #7A7A7A;
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #FAF5EC;
              padding: 30px 20px;
            }
            .reason-box {
              background-color: #FEF3F2;
              border-left: 4px solid #EF4444;
              padding: 15px;
              margin: 20px 0;
            }
            .option-box {
              background-color: #EFF6FF;
              border: 1px solid #3B82F6;
              padding: 15px;
              margin: 15px 0;
              border-radius: 6px;
            }
            .button {
              display: inline-block;
              background-color: #21B3B1;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin: 10px 5px;
            }
            .button-secondary {
              display: inline-block;
              background-color: white;
              color: #21B3B1;
              border: 2px solid #21B3B1;
              padding: 10px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin: 10px 5px;
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
            <h1>Application Update</h1>
            <p style="color: #E6EAEA;">${ngoName}</p>
          </div>
          <div class="content">
            <p>Hi ${contactName},</p>

            <p>Thank you for your interest in joining Foreignteer. After reviewing your application for <strong>${ngoName}</strong>, we're unable to approve it at this time.</p>

            <div class="reason-box">
              <h3 style="margin-top: 0; color: #DC2626;">Reason for Not Approving:</h3>
              <p style="margin-bottom: 0;">${rejectionReason}</p>
            </div>

            <h3>What You Can Do Next:</h3>

            <div class="option-box">
              <h4 style="margin-top: 0; color: #1D4ED8;">Option 1: Edit Your Profile & Resubmit</h4>
              <p>If you can address the concerns mentioned above, you can update your organisation profile and request another review.</p>
              <p><strong>Steps:</strong></p>
              <ol>
                <li>Log in to your account</li>
                <li>Go to "NGO Profile" in your dashboard</li>
                <li>Update the necessary information</li>
                <li>Click "Submit for Review" to request re-approval</li>
              </ol>
              <p style="text-align: center;">
                <a href="https://foreignteer.com/dashboard/ngo/profile" class="button">Edit Your Profile</a>
              </p>
            </div>

            <div class="option-box">
              <h4 style="margin-top: 0; color: #1D4ED8;">Option 2: Create a New Account</h4>
              <p>If there are fundamental issues with the registration, you may create a new account with corrected information.</p>
              <p style="text-align: center;">
                <a href="https://foreignteer.com/register/ngo" class="button-secondary">Create New Account</a>
              </p>
            </div>

            <p><strong>Have Questions?</strong></p>
            <p>If you'd like more details about why your application wasn't approved or need guidance on how to address the issues, please don't hesitate to contact us at <a href="mailto:partner@foreignteer.com">partner@foreignteer.com</a>.</p>

            <p>We appreciate your interest in Foreignteer and hope to work with you in the future.</p>
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
      Application Update for ${ngoName}

      Hi ${contactName},

      Thank you for your interest in joining Foreignteer. After reviewing your application for ${ngoName}, we're unable to approve it at this time.

      REASON FOR NOT APPROVING:
      ${rejectionReason}

      WHAT YOU CAN DO NEXT:

      Option 1: Edit Your Profile & Resubmit
      If you can address the concerns mentioned above, you can update your organisation profile and request another review.

      Steps:
      1. Log in to your account
      2. Go to "NGO Profile" in your dashboard
      3. Update the necessary information
      4. Click "Submit for Review" to request re-approval

      Edit your profile: https://foreignteer.com/dashboard/ngo/profile

      Option 2: Create a New Account
      If there are fundamental issues with the registration, you may create a new account with corrected information.

      Create new account: https://foreignteer.com/register/ngo

      HAVE QUESTIONS?
      If you'd like more details about why your application wasn't approved or need guidance on how to address the issues, please contact us at partner@foreignteer.com.

      We appreciate your interest in Foreignteer and hope to work with you in the future.

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

/**
 * Send attendance confirmation email
 */
export async function sendAttendanceConfirmationEmail(
  email: string,
  name: string,
  details: {
    experienceTitle: string;
    ngoName: string;
    date: string;
  }
): Promise<void> {
  await sendEmail({
    to: [{ email, name }],
    subject: `Attendance Confirmed - ${details.experienceTitle}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #4A4A4A; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #21B3B1 0%, #168E8C 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✓ Attendance Confirmed!</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #E6EAEA; border-top: none; border-radius: 0 0 10px 10px;">
            <p>Hi ${name},</p>

            <p>Great news! Your attendance has been confirmed for:</p>

            <div style="background-color: #C9F0EF; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #21B3B1;">${details.experienceTitle}</p>
              <p style="margin: 10px 0 0 0; color: #4A4A4A;">
                <strong>Organisation:</strong> ${details.ngoName}<br>
                <strong>Date:</strong> ${details.date}
              </p>
            </div>

            <p>Both you and ${details.ngoName} have confirmed your attendance. Thank you for making a difference!</p>

            <p><strong>We'd love to hear about your experience!</strong></p>
            <p>You'll receive a separate email inviting you to rate and review your volunteering experience. Your feedback helps other volunteers find great opportunities and helps organisations improve.</p>

            <p style="text-align: center; margin: 30px 0;">
              <a href="https://foreignteer.com/dashboard/user/bookings" style="display: inline-block; background-color: #21B3B1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">View My Bookings</a>
            </p>

            <p>Thank you for being part of the Foreignteer community!</p>
            <p><strong>The Foreignteer Team</strong></p>
          </div>
          <div style="background-color: #FAF5EC; padding: 20px; text-align: center; color: #7A7A7A; font-size: 12px; border-radius: 0 0 10px 10px;">
            <p>&copy; 2026 Foreignteer. All rights reserved.</p>
            <p>Connecting travellers with meaningful volunteering experiences worldwide.</p>
            <p style="margin-top: 15px;">
              <a href="https://foreignteer.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #8FA6A1; text-decoration: underline;">Unsubscribe</a>
            </p>
          </div>
        </body>
      </html>
    `,
    textContent: `
      Attendance Confirmed!

      Hi ${name},

      Great news! Your attendance has been confirmed for:

      ${details.experienceTitle}
      Organisation: ${details.ngoName}
      Date: ${details.date}

      Both you and ${details.ngoName} have confirmed your attendance. Thank you for making a difference!

      We'd love to hear about your experience! You'll receive a separate email inviting you to rate and review your volunteering experience.

      View your bookings: https://foreignteer.com/dashboard/user/bookings

      Thank you for being part of the Foreignteer community!
      The Foreignteer Team

      ---
      Unsubscribe: https://foreignteer.com/unsubscribe?email=${encodeURIComponent(email)}
    `,
  });
}

/**
 * Send review invitation email
 */
export async function sendReviewInvitationEmail(
  email: string,
  name: string,
  details: {
    experienceTitle: string;
    bookingId: string;
  }
): Promise<void> {
  const reviewUrl = `https://foreignteer.com/dashboard/user/bookings?review=${details.bookingId}`;

  await sendEmail({
    to: [{ email, name }],
    subject: `Share Your Experience - ${details.experienceTitle}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #4A4A4A; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #F6C98D 0%, #21B3B1 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💫 How Was Your Experience?</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #E6EAEA; border-top: none; border-radius: 0 0 10px 10px;">
            <p>Hi ${name},</p>

            <p>Thank you for completing your volunteering experience: <strong>${details.experienceTitle}</strong></p>

            <p>Your feedback is incredibly valuable! Please take a moment to:</p>

            <div style="background-color: #FAF5EC; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F6C98D;">
              <p style="margin: 0 0 10px 0;"><strong>⭐ Rate your experience (1-5 stars)</strong></p>
              <p style="margin: 0 0 10px 0;"><strong>✍️ Share your story</strong> - What did you enjoy? What impact did you make?</p>
              <p style="margin: 0;"><strong>📸 (Optional) Submit a testimonial</strong> - Inspire future volunteers!</p>
            </div>

            <p><strong>Why your review matters:</strong></p>
            <ul style="color: #7A7A7A; font-size: 14px;">
              <li>Help other volunteers find great opportunities</li>
              <li>Support organisations in improving their programmes</li>
              <li>Build trust in the Foreignteer community</li>
              <li>Inspire others to volunteer</li>
            </ul>

            <p style="text-align: center; margin: 30px 0;">
              <a href="${reviewUrl}" style="display: inline-block; background-color: #21B3B1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Leave a Review</a>
            </p>

            <p style="font-size: 14px; color: #7A7A7A;">This should only take 2-3 minutes. Your honest feedback helps everyone!</p>

            <p>Thank you for making a difference!</p>
            <p><strong>The Foreignteer Team</strong></p>
          </div>
          <div style="background-color: #FAF5EC; padding: 20px; text-align: center; color: #7A7A7A; font-size: 12px; border-radius: 0 0 10px 10px;">
            <p>&copy; 2026 Foreignteer. All rights reserved.</p>
            <p>Connecting travellers with meaningful volunteering experiences worldwide.</p>
            <p style="margin-top: 15px;">
              <a href="https://foreignteer.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #8FA6A1; text-decoration: underline;">Unsubscribe</a>
            </p>
          </div>
        </body>
      </html>
    `,
    textContent: `
      How Was Your Experience?

      Hi ${name},

      Thank you for completing your volunteering experience: ${details.experienceTitle}

      Your feedback is incredibly valuable! Please take a moment to:

      ⭐ Rate your experience (1-5 stars)
      ✍️ Share your story - What did you enjoy? What impact did you make?
      📸 (Optional) Submit a testimonial - Inspire future volunteers!

      Why your review matters:
      - Help other volunteers find great opportunities
      - Support organisations in improving their programmes
      - Build trust in the Foreignteer community
      - Inspire others to volunteer

      Leave a review here: ${reviewUrl}

      This should only take 2-3 minutes. Your honest feedback helps everyone!

      Thank you for making a difference!
      The Foreignteer Team

      ---
      Unsubscribe: https://foreignteer.com/unsubscribe?email=${encodeURIComponent(email)}
    `,
  });
}

/**
 * Send NGO registration notification to admin
 */
export async function sendNGORegistrationNotificationToAdmin(
  ngoDetails: {
    name: string;
    contactName: string;
    email: string;
    contactEmail: string;
    description: string;
    entityType: string;
    jurisdiction: string;
    serviceLocations: string[];
    causes: string[];
    website?: string;
    hasInsurance?: boolean;
    insuranceType?: string;
    insuranceCoverageLimit?: string;
    ngoId: string;
  }
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || 'hello@foreignteer.com';
  const adminDashboardUrl = 'https://foreignteer.com/dashboard/admin/ngos';

  await sendEmail({
    to: [{ email: adminEmail, name: 'Foreignteer Admin' }],
    subject: `New NGO Registration: ${ngoDetails.name}`,
    htmlContent: `
      <h2 style="color: #21B3B1;">New NGO Registration</h2>

      <p>A new NGO has registered and is pending approval:</p>

      <div style="background-color: #FAF5EC; border-left: 4px solid #21B3B1; padding: 16px; margin: 20px 0;">
        <h3 style="color: #4A4A4A; margin-top: 0;">Organisation Details</h3>
        <p><strong>Name:</strong> ${ngoDetails.name}</p>
        <p><strong>Contact Person:</strong> ${ngoDetails.contactName}</p>
        <p><strong>Email:</strong> ${ngoDetails.email}</p>
        <p><strong>Organisation Email:</strong> ${ngoDetails.contactEmail}</p>
        ${ngoDetails.website ? `<p><strong>Website:</strong> <a href="${ngoDetails.website}">${ngoDetails.website}</a></p>` : ''}
        <p><strong>Entity Type:</strong> ${ngoDetails.entityType}</p>
        <p><strong>Jurisdiction:</strong> ${ngoDetails.jurisdiction}</p>
        <p><strong>Service Locations:</strong> ${ngoDetails.serviceLocations.join(', ')}</p>
        <p><strong>Causes:</strong> ${ngoDetails.causes.join(', ')}</p>
        <p><strong>Has Insurance:</strong> ${ngoDetails.hasInsurance ? 'Yes' : 'No'}</p>
        ${ngoDetails.hasInsurance && ngoDetails.insuranceType ? `<p><strong>Insurance Type:</strong> ${ngoDetails.insuranceType}</p>` : ''}
        ${ngoDetails.hasInsurance && ngoDetails.insuranceCoverageLimit ? `<p><strong>Coverage Limit:</strong> ${ngoDetails.insuranceCoverageLimit}</p>` : ''}
      </div>

      <div style="background-color: #F6F9F9; border: 1px solid #E6EAEA; padding: 16px; margin: 20px 0; border-radius: 8px;">
        <p><strong>Description:</strong></p>
        <p style="white-space: pre-wrap;">${ngoDetails.description}</p>
      </div>

      <p>
        <a href="${adminDashboardUrl}"
           style="display: inline-block; background-color: #21B3B1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
          Review in Admin Dashboard
        </a>
      </p>

      <p style="color: #7A7A7A; font-size: 14px; margin-top: 30px;">
        This registration requires your approval before the NGO can create experiences.
      </p>
    `,
    textContent: `
      New NGO Registration: ${ngoDetails.name}

      Organisation Details:
      - Name: ${ngoDetails.name}
      - Contact Person: ${ngoDetails.contactName}
      - Email: ${ngoDetails.email}
      - Organisation Email: ${ngoDetails.contactEmail}
      ${ngoDetails.website ? `- Website: ${ngoDetails.website}` : ''}
      - Entity Type: ${ngoDetails.entityType}
      - Jurisdiction: ${ngoDetails.jurisdiction}
      - Service Locations: ${ngoDetails.serviceLocations.join(', ')}
      - Causes: ${ngoDetails.causes.join(', ')}
      - Has Insurance: ${ngoDetails.hasInsurance ? 'Yes' : 'No'}
      ${ngoDetails.hasInsurance && ngoDetails.insuranceType ? `- Insurance Type: ${ngoDetails.insuranceType}` : ''}
      ${ngoDetails.hasInsurance && ngoDetails.insuranceCoverageLimit ? `- Coverage Limit: ${ngoDetails.insuranceCoverageLimit}` : ''}

      Description:
      ${ngoDetails.description}

      Review in Admin Dashboard: ${adminDashboardUrl}
    `,
  });
}

/**
 * Send registration confirmation to NGO
 */
export async function sendNGORegistrationConfirmationToNGO(
  email: string,
  contactName: string,
  ngoName: string
): Promise<void> {
  const contactEmail = 'hello@foreignteer.com';

  await sendEmail({
    to: [{ email, name: contactName }],
    subject: `Registration Received - ${ngoName}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #21B3B1 0%, #168E8C 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Registering!</h1>
        </div>

        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #E6EAEA; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #4A4A4A;">Hi ${contactName},</p>

          <p style="font-size: 16px; color: #4A4A4A; line-height: 1.6;">
            Thank you for registering <strong>${ngoName}</strong> with Foreignteer! We're excited to welcome you to our community of organisations creating meaningful volunteering experiences.
          </p>

          <div style="background-color: #C9F0EF; border-left: 4px solid #21B3B1; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <h3 style="color: #4A4A4A; margin-top: 0; font-size: 18px;">📋 What Happens Next?</h3>
            <ol style="color: #4A4A4A; margin: 0; padding-left: 20px;">
              <li style="margin: 8px 0;"><strong>Review Process:</strong> Our admin team will review your organisation details (typically within 1-2 business days)</li>
              <li style="margin: 8px 0;"><strong>Email Notification:</strong> You'll receive an email once your organisation is approved</li>
              <li style="margin: 8px 0;"><strong>Create Experiences:</strong> After approval, you can start creating volunteering opportunities</li>
            </ol>
          </div>

          <div style="background-color: #FAF5EC; padding: 20px; margin: 24px 0; border-radius: 8px;">
            <h3 style="color: #4A4A4A; margin-top: 0; font-size: 18px;">🚀 In the Meantime...</h3>
            <ul style="color: #4A4A4A; margin: 0; padding-left: 20px;">
              <li style="margin: 8px 0;">Explore existing experiences on our platform to see what volunteers are looking for</li>
              <li style="margin: 8px 0;">Prepare descriptions and photos for your first volunteering experience</li>
              <li style="margin: 8px 0;">Think about dates, capacity, and requirements for your programmes</li>
              <li style="margin: 8px 0;">Review our <a href="https://foreignteer.com/partner" style="color: #21B3B1;">Partner Guidelines</a></li>
            </ul>
          </div>

          <div style="background-color: #F6F9F9; border: 1px solid #E6EAEA; padding: 16px; margin: 24px 0; border-radius: 8px;">
            <h4 style="color: #4A4A4A; margin-top: 0; font-size: 16px;">💬 Questions or Need Help?</h4>
            <p style="color: #4A4A4A; margin: 8px 0;">
              Our team is here to support you. Feel free to reach out at:
              <a href="mailto:${contactEmail}" style="color: #21B3B1; text-decoration: none; font-weight: 600;">${contactEmail}</a>
            </p>
          </div>

          <p style="font-size: 16px; color: #4A4A4A; line-height: 1.6; margin-top: 24px;">
            We're looking forward to working with you to create impactful volunteering experiences!
          </p>

          <p style="font-size: 16px; color: #4A4A4A;">
            Best regards,<br>
            <strong>The Foreignteer Team</strong>
          </p>

          <hr style="border: none; border-top: 1px solid #E6EAEA; margin: 24px 0;">

          <p style="font-size: 12px; color: #7A7A7A; text-align: center;">
            <a href="https://foreignteer.com" style="color: #21B3B1; text-decoration: none;">Visit Foreignteer</a> |
            <a href="https://foreignteer.com/faq" style="color: #21B3B1; text-decoration: none;">FAQs</a> |
            <a href="mailto:${contactEmail}" style="color: #21B3B1; text-decoration: none;">Contact Us</a>
          </p>
        </div>
      </div>
    `,
    textContent: `
      Thank You for Registering!

      Hi ${contactName},

      Thank you for registering ${ngoName} with Foreignteer! We're excited to welcome you to our community of organisations creating meaningful volunteering experiences.

      WHAT HAPPENS NEXT?

      1. Review Process: Our admin team will review your organisation details (typically within 1-2 business days)
      2. Email Notification: You'll receive an email once your organisation is approved
      3. Create Experiences: After approval, you can start creating volunteering opportunities

      IN THE MEANTIME...

      - Explore existing experiences on our platform to see what volunteers are looking for
      - Prepare descriptions and photos for your first volunteering experience
      - Think about dates, capacity, and requirements for your programmes
      - Review our Partner Guidelines at https://foreignteer.com/partner

      QUESTIONS OR NEED HELP?

      Our team is here to support you. Feel free to reach out at: ${contactEmail}

      We're looking forward to working with you to create impactful volunteering experiences!

      Best regards,
      The Foreignteer Team

      ---
      Visit Foreignteer: https://foreignteer.com
      Unsubscribe: https://foreignteer.com/unsubscribe?email=${encodeURIComponent(email)}
    `,
  });
}
