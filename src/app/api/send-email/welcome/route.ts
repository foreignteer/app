import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    // Validate input
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Send welcome email
    await sendWelcomeEmail(email, name);

    return NextResponse.json(
      { message: 'Welcome email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email' },
      { status: 500 }
    );
  }
}
