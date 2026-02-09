import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

// Helper function to generate URL-friendly slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      contactName,
      email,
      password,
      name,
      description,
      jurisdiction,
      serviceLocations,
      website,
      contactEmail,
      causes,
    } = body;

    // Validate required fields
    if (!contactName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required account information' },
        { status: 400 }
      );
    }

    if (!name || !description || !jurisdiction || !serviceLocations || !contactEmail || !causes) {
      return NextResponse.json(
        { error: 'Missing required organisation information' },
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

    // Check if email already exists
    try {
      await adminAuth.getUserByEmail(email);
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    } catch (error: any) {
      // User doesn't exist, which is what we want
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Generate public slug
    const baseSlug = generateSlug(name);
    let publicSlug = baseSlug;
    let slugExists = true;
    let counter = 1;

    // Ensure slug is unique
    while (slugExists) {
      const slugQuery = await adminDb
        .collection('ngos')
        .where('publicSlug', '==', publicSlug)
        .get();

      if (slugQuery.empty) {
        slugExists = false;
      } else {
        publicSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: contactName,
    });

    const userId = userRecord.uid;

    try {
      // Create NGO document
      const now = new Date();
      const ngoData = {
        name,
        description,
        jurisdiction,
        serviceLocations,
        website: website || null,
        contactEmail,
        publicSlug,
        causes,
        approved: false, // Requires admin approval
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
      };

      const ngoRef = await adminDb.collection('ngos').add(ngoData);
      const ngoId = ngoRef.id;

      // Set custom claims for role
      await adminAuth.setCustomUserClaims(userId, { role: 'ngo' });

      // Create user document in Firestore
      await adminDb.collection('users').doc(userId).set({
        uid: userId,
        email,
        displayName: contactName,
        role: 'ngo',
        ngoId, // Link user to NGO
        profileCompleted: true,
        createdAt: now,
        updatedAt: now,
      });

      return NextResponse.json(
        {
          success: true,
          message: 'NGO registration submitted successfully. Awaiting admin approval.',
          userId,
          ngoId,
        },
        { status: 201 }
      );
    } catch (error) {
      // If NGO/user creation fails, delete the auth user
      await adminAuth.deleteUser(userId);
      throw error;
    }
  } catch (error: any) {
    console.error('NGO registration error:', error);

    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to register NGO. Please try again.' },
      { status: 500 }
    );
  }
}
