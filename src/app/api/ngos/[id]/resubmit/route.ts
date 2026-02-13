import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function POST(
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

    const userId = decodedToken.uid;

    // Fetch the NGO document
    const ngoDoc = await adminDb.collection('ngos').doc(id).get();

    if (!ngoDoc.exists) {
      return NextResponse.json(
        { error: 'NGO not found' },
        { status: 404 }
      );
    }

    const ngoData = ngoDoc.data();
    if (!ngoData) {
      return NextResponse.json(
        { error: 'NGO data not found' },
        { status: 404 }
      );
    }

    // Check authorization - only the NGO owner can resubmit
    if (ngoData.createdBy !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - Only the NGO owner can resubmit for review' },
        { status: 403 }
      );
    }

    // Check if the NGO was actually rejected
    if (!ngoData.rejectionReason) {
      return NextResponse.json(
        { error: 'This NGO was not rejected and does not need resubmission' },
        { status: 400 }
      );
    }

    // Clear rejection status and mark as pending review
    await adminDb.collection('ngos').doc(id).update({
      approved: false,
      rejectionReason: null,
      rejectedAt: null,
      resubmittedAt: new Date(),
      updatedAt: new Date(),
    });

    // TODO: Send email notification to admin about resubmission
    console.log(`NGO ${ngoData.name} resubmitted for review by ${userId}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Profile submitted for review. Admin will be notified.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resubmitting NGO for review:', error);
    return NextResponse.json(
      { error: 'Failed to submit for review' },
      { status: 500 }
    );
  }
}
