import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { sendNGOApprovalEmail, sendNGORejectionEmail } from '@/lib/services/emailService';

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
    const { approved, rejectionReason } = body;

    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request - approved must be a boolean' },
        { status: 400 }
      );
    }

    // If rejecting, require a rejection reason
    if (approved === false && (!rejectionReason || rejectionReason.trim() === '')) {
      return NextResponse.json(
        { error: 'Rejection reason is required when rejecting an NGO' },
        { status: 400 }
      );
    }

    // Fetch the NGO document first to get details for email
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

    // Get the user who created this NGO to send them an email
    const createdBy = ngoData.createdBy;
    if (!createdBy) {
      return NextResponse.json(
        { error: 'NGO creator not found' },
        { status: 500 }
      );
    }

    const userDoc = await adminDb.collection('users').doc(createdBy).get();
    const userData = userDoc.data();

    if (!userData || !userData.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 500 }
      );
    }

    const userEmail = userData.email;
    const userName = userData.displayName || 'there';
    const ngoName = ngoData.name || 'Your organisation';

    // Prepare update data
    const updateData: any = {
      approved,
      updatedAt: new Date(),
    };

    if (approved) {
      // Approving: clear any previous rejection data
      updateData.rejectionReason = null;
      updateData.rejectedAt = null;
      updateData.approvedAt = new Date();
    } else {
      // Rejecting: add rejection data
      updateData.rejectionReason = rejectionReason.trim();
      updateData.rejectedAt = new Date();
      updateData.approvedAt = null;
    }

    // Update the NGO
    await adminDb.collection('ngos').doc(id).update(updateData);

    // Send email notification
    try {
      if (approved) {
        await sendNGOApprovalEmail(userEmail, ngoName, userName);
        console.log(`Approval email sent to ${userEmail} for NGO: ${ngoName}`);
      } else {
        await sendNGORejectionEmail(userEmail, ngoName, userName, rejectionReason);
        console.log(`Rejection email sent to ${userEmail} for NGO: ${ngoName}`);
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Error sending email notification:', emailError);
    }

    // Fetch the updated NGO
    const updatedNgoDoc = await adminDb.collection('ngos').doc(id).get();
    const updatedNgoData = updatedNgoDoc.data();

    return NextResponse.json(
      {
        success: true,
        message: approved ? 'NGO approved successfully' : 'NGO rejected successfully',
        ngo: {
          id: updatedNgoDoc.id,
          ...updatedNgoData,
          createdAt: updatedNgoData?.createdAt?.toDate(),
          updatedAt: updatedNgoData?.updatedAt?.toDate(),
          approvedAt: updatedNgoData?.approvedAt?.toDate(),
          rejectedAt: updatedNgoData?.rejectedAt?.toDate(),
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
