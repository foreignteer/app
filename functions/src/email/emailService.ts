// Email service configuration using Gmail SMTP
import * as nodemailer from 'nodemailer';
import * as functions from 'firebase-functions';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Create email transporter using Gmail SMTP
 * Uses App Password from Firebase Functions config
 */
function createTransporter() {
  // Check if email configuration exists
  const emailConfig = functions.config().email;

  if (!emailConfig || !emailConfig.user || !emailConfig.password) {
    console.warn('⚠️ Email configuration missing. Set using:');
    console.warn('firebase functions:config:set email.user="foreignteer@gmail.com"');
    console.warn('firebase functions:config:set email.password="YOUR_APP_PASSWORD"');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password,
    },
  });
}

/**
 * Send an email using Gmail SMTP
 *
 * @param options Email options including to, subject, and html content
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const transporter = createTransporter();

  // If no transporter (missing config), just log the email
  if (!transporter) {
    console.log('📧 Email (no config, logging only):', {
      from: 'Foreignteer <foreignteer@gmail.com>',
      to: options.to,
      subject: options.subject,
      preview: options.html.substring(0, 200) + '...',
    });
    return;
  }

  try {
    const result = await transporter.sendMail({
      from: 'Foreignteer <foreignteer@gmail.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log('✅ Email sent successfully:', {
      to: options.to,
      subject: options.subject,
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message || error}`);
  }
}
