import { NextRequest, NextResponse } from 'next/server';
import { sendNGOApprovalEmail } from '@/lib/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, ngoName, contactName } = await request.json();

    // Validate input
    if (!email || !ngoName || !contactName) {
      return NextResponse.json(
        { error: 'Email, NGO name, and contact name are required' },
        { status: 400 }
      );
    }

    // Send NGO approval email
    await sendNGOApprovalEmail(email, ngoName, contactName);

    return NextResponse.json(
      { message: 'NGO approval email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending NGO approval email:', error);
    return NextResponse.json(
      { error: 'Failed to send NGO approval email' },
      { status: 500 }
    );
  }
}
