import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorised - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Unauthorised - Invalid token' },
        { status: 401 }
      );
    }

    const userRole = decodedToken.role || 'user';

    // Check if user is an admin
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can access this endpoint' },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { approved } = body;

    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request - approved must be a boolean' },
        { status: 400 }
      );
    }

    // Update the NGO
    await adminDb.collection('ngos').doc(id).update({
      approved,
      updatedAt: new Date(),
    });

    // Fetch the updated NGO
    const ngoDoc = await adminDb.collection('ngos').doc(id).get();
    const ngoData = ngoDoc.data();

    return NextResponse.json(
      {
        success: true,
        ngo: {
          id: ngoDoc.id,
          ...ngoData,
          createdAt: ngoData?.createdAt?.toDate(),
          updatedAt: ngoData?.updatedAt?.toDate(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating NGO:', error);
    return NextResponse.json(
      { error: 'Failed to update NGO' },
      { status: 500 }
    );
  }
}
