import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function GET(
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
    const userRole = decodedToken.role || 'user';

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

    // Check authorization - only the NGO owner or admin can view
    if (userRole !== 'admin' && ngoData.createdBy !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to this NGO' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        ngo: {
          id: ngoDoc.id,
          ...ngoData,
          createdAt: ngoData.createdAt?.toDate(),
          updatedAt: ngoData.updatedAt?.toDate(),
          approvedAt: ngoData.approvedAt?.toDate(),
          rejectedAt: ngoData.rejectedAt?.toDate(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching NGO:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NGO' },
      { status: 500 }
    );
  }
}

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

    const userId = decodedToken.uid;
    const userRole = decodedToken.role || 'user';

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

    // Check authorization - only the NGO owner can update
    if (ngoData.createdBy !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - Only the NGO owner can update this profile' },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const {
      name,
      description,
      logoUrl,
      entityType,
      jurisdiction,
      serviceLocations,
      website,
      contactEmail,
      causes,
      featuredOnPartnerList,
    } = body;

    // Validate required fields
    if (!name || !description || !jurisdiction || !contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(serviceLocations) || serviceLocations.length === 0) {
      return NextResponse.json(
        { error: 'Service locations must be a non-empty array' },
        { status: 400 }
      );
    }

    if (!Array.isArray(causes) || causes.length === 0) {
      return NextResponse.json(
        { error: 'Causes must be a non-empty array' },
        { status: 400 }
      );
    }

    // Update the NGO
    await adminDb.collection('ngos').doc(id).update({
      name: name.trim(),
      description: description.trim(),
      logoUrl: logoUrl || null,
      entityType: entityType || null,
      jurisdiction: jurisdiction.trim(),
      serviceLocations,
      website: website?.trim() || null,
      contactEmail: contactEmail.trim(),
      causes,
      featuredOnPartnerList: featuredOnPartnerList || false,
      updatedAt: new Date(),
    });

    // Fetch the updated NGO
    const updatedNgoDoc = await adminDb.collection('ngos').doc(id).get();
    const updatedNgoData = updatedNgoDoc.data();

    return NextResponse.json(
      {
        success: true,
        message: 'NGO profile updated successfully',
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
