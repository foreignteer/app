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
    const { status } = body;

    const validStatuses = ['draft', 'pending_approval', 'published', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Update the experience
    await adminDb.collection('experiences').doc(id).update({
      status,
      updatedAt: new Date(),
    });

    // Fetch the updated experience
    const experienceDoc = await adminDb.collection('experiences').doc(id).get();
    const experienceData = experienceDoc.data();

    return NextResponse.json(
      {
        success: true,
        experience: {
          id: experienceDoc.id,
          ...experienceData,
          dates: {
            start: experienceData?.dates?.start?.toDate(),
            end: experienceData?.dates?.end?.toDate(),
          },
          createdAt: experienceData?.createdAt?.toDate(),
          updatedAt: experienceData?.updatedAt?.toDate(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}
