import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
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
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    // Get user profile from Firestore
    const userDoc = await adminDb.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    return NextResponse.json(
      {
        profile: {
          displayName: userData?.displayName || '',
          email: userData?.email || '',
          countryOfOrigin: userData?.countryOfOrigin || '',
          volunteeringExperience: userData?.volunteeringExperience || '',
          jobTitle: userData?.jobTitle || '',
          organisation: userData?.organisation || '',
          phone: userData?.phone || '',
          emergencyContact: userData?.emergencyContact || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get the authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
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
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    // Parse request body
    const body = await request.json();

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.displayName !== undefined) updateData.displayName = body.displayName;
    if (body.countryOfOrigin !== undefined) updateData.countryOfOrigin = body.countryOfOrigin;
    if (body.volunteeringExperience !== undefined) updateData.volunteeringExperience = body.volunteeringExperience;
    if (body.jobTitle !== undefined) updateData.jobTitle = body.jobTitle;
    if (body.organisation !== undefined) updateData.organisation = body.organisation;
    if (body.phone !== undefined) updateData.phone = body.phone;

    // Handle emergency contact
    if (body.emergencyContact !== undefined) {
      if (body.emergencyContact && body.emergencyContact.name) {
        updateData.emergencyContact = {
          name: body.emergencyContact.name,
          phone: body.emergencyContact.phone || '',
          relationship: body.emergencyContact.relationship || '',
        };
      } else {
        updateData.emergencyContact = null;
      }
    }

    // Update user document in Firestore
    await adminDb.collection('users').doc(userId).update(updateData);

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
