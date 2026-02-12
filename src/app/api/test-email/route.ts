import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/services/emailService';

export async function GET() {
  try {
    console.log('Testing Brevo email connection...');
    console.log('BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
    console.log('BREVO_API_KEY length:', process.env.BREVO_API_KEY?.length || 0);

    await sendEmail({
      to: [{ email: 'foreignteer@gmail.com', name: 'Test' }],
      subject: 'Test Email from Foreignteer',
      htmlContent: '<p>This is a test email to verify Brevo integration.</p>',
      textContent: 'This is a test email to verify Brevo integration.',
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: {
          name: error.name,
          message: error.message,
          response: error.response?.body || error.response || 'No response',
          status: error.status || error.statusCode,
        },
      },
      { status: 500 }
    );
  }
}
