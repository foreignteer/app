import { NextRequest, NextResponse } from 'next/server';
import { sendBookingConfirmationEmail } from '@/lib/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, name, bookingDetails } = await request.json();

    // Validate input
    if (!email || !name || !bookingDetails) {
      return NextResponse.json(
        { error: 'Email, name, and booking details are required' },
        { status: 400 }
      );
    }

    // Validate booking details structure
    const requiredFields = ['experienceTitle', 'ngoName', 'date', 'location', 'price'];
    for (const field of requiredFields) {
      if (!bookingDetails[field]) {
        return NextResponse.json(
          { error: `Missing booking detail: ${field}` },
          { status: 400 }
        );
      }
    }

    // Send booking confirmation email
    await sendBookingConfirmationEmail(email, name, bookingDetails);

    return NextResponse.json(
      { message: 'Booking confirmation email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send booking confirmation email' },
      { status: 500 }
    );
  }
}
