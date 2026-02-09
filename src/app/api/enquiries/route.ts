import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    // Validate required fields based on type
    if (type === 'contact') {
      if (!data.name || !data.email || !data.subject || !data.message) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
    } else if (type === 'partner') {
      if (
        !data.organizationName ||
        !data.contactName ||
        !data.email ||
        !data.phone ||
        !data.jurisdiction ||
        !data.serviceLocations ||
        !data.causes ||
        !data.description
      ) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid enquiry type' },
        { status: 400 }
      );
    }

    // Save to Firestore
    const enquiryRef = await addDoc(collection(db, 'enquiries'), {
      type,
      ...data,
      status: 'new',
      createdAt: serverTimestamp(),
    });

    // TODO: Send email notification to admin (implement in Phase 5)

    return NextResponse.json(
      { success: true, id: enquiryRef.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
