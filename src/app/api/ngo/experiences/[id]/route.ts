import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { Experience } from '@/lib/types/experience';

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

    // Check if user is an NGO
    if (userRole !== 'ngo') {
      return NextResponse.json(
        { error: 'Forbidden - Only NGOs can access this endpoint' },
        { status: 403 }
      );
    }

    // Get the user's NGO ID
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const ngoId = userDoc.data()?.ngoId;

    if (!ngoId) {
      return NextResponse.json(
        { error: 'NGO ID not found for user' },
        { status: 400 }
      );
    }

    // Fetch the experience
    const experienceDoc = await adminDb.collection('experiences').doc(id).get();

    if (!experienceDoc.exists) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    const experienceData = experienceDoc.data();

    // Verify that this experience belongs to the NGO
    if (experienceData?.ngoId !== ngoId) {
      return NextResponse.json(
        { error: 'Forbidden - This experience does not belong to your organisation' },
        { status: 403 }
      );
    }

    const experience: Experience = {
      id: experienceDoc.id,
      ...experienceData,
      dates: {
        start: experienceData.dates.start.toDate(),
        end: experienceData.dates.end.toDate(),
      },
      recurrenceEndDate: experienceData.recurrenceEndDate?.toDate?.() || experienceData.recurrenceEndDate,
      createdAt: experienceData.createdAt.toDate(),
      updatedAt: experienceData.updatedAt.toDate(),
    } as Experience;

    return NextResponse.json({ experience }, { status: 200 });
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
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

    // Check if user is an NGO
    if (userRole !== 'ngo') {
      return NextResponse.json(
        { error: 'Forbidden - Only NGOs can update experiences' },
        { status: 403 }
      );
    }

    // Get the user's NGO ID
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const ngoId = userDoc.data()?.ngoId;

    if (!ngoId) {
      return NextResponse.json(
        { error: 'NGO ID not found for user' },
        { status: 400 }
      );
    }

    // Fetch the experience to verify ownership
    const experienceDoc = await adminDb.collection('experiences').doc(id).get();

    if (!experienceDoc.exists) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    const existingData = experienceDoc.data();

    // Verify that this experience belongs to the NGO
    if (existingData?.ngoId !== ngoId) {
      return NextResponse.json(
        { error: 'Forbidden - This experience does not belong to your organisation' },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await request.json();

    // Check if this is a recurring event and if we need to update the series
    const editScope = body.editScope; // 'occurrence' or 'series'
    const recurringGroupId = existingData?.recurringGroupId;

    if (editScope === 'series' && recurringGroupId) {
      // For series updates, we DON'T update dates (each occurrence keeps its own date)
      // We only update fields that should be the same across all occurrences
      const seriesUpdateData: any = {
        updatedAt: new Date(),
      };

      // Only include fields that are defined
      if (body.title !== undefined) seriesUpdateData.title = body.title;
      if (body.summary !== undefined) seriesUpdateData.summary = body.summary;
      if (body.description !== undefined) seriesUpdateData.description = body.description;
      if (body.city !== undefined) seriesUpdateData.city = body.city;
      if (body.country !== undefined) seriesUpdateData.country = body.country;
      if (body.location !== undefined) seriesUpdateData.location = body.location;
      if (body.causeCategories !== undefined) seriesUpdateData.causeCategories = body.causeCategories;
      if (body.otherCategory !== undefined) seriesUpdateData.otherCategory = body.otherCategory || null;
      if (body.capacity !== undefined) seriesUpdateData.capacity = Number(body.capacity);
      if (body.platformServiceFee !== undefined) seriesUpdateData.platformServiceFee = body.platformServiceFee;
      if (body.programmeFee !== undefined) seriesUpdateData.programmeFee = body.programmeFee || 0;
      if (body.totalFee !== undefined) seriesUpdateData.totalFee = body.totalFee;
      if (body.requirements !== undefined) seriesUpdateData.requirements = body.requirements || [];
      if (body.accessibility !== undefined) seriesUpdateData.accessibility = body.accessibility || null;
      if (body.images !== undefined) seriesUpdateData.images = body.images || [];
      if (body.status !== undefined) seriesUpdateData.status = body.status;
      if (body.instantConfirmation !== undefined) seriesUpdateData.instantConfirmation = body.instantConfirmation;

      // Update ALL experiences in the recurring series
      const seriesSnapshot = await adminDb
        .collection('experiences')
        .where('recurringGroupId', '==', recurringGroupId)
        .get();

      console.log(`Updating ${seriesSnapshot.size} experiences in series ${recurringGroupId}`);

      const batch = adminDb.batch();
      seriesSnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, seriesUpdateData);
      });

      await batch.commit();

      return NextResponse.json(
        {
          success: true,
          message: `Updated ${seriesSnapshot.size} experiences in the series`,
          count: seriesSnapshot.size,
        },
        { status: 200 }
      );
    } else {
      // For single occurrence updates, we CAN update dates
      const occurrenceUpdateData: any = {
        updatedAt: new Date(),
      };

      // Only include fields that are defined
      if (body.title !== undefined) occurrenceUpdateData.title = body.title;
      if (body.summary !== undefined) occurrenceUpdateData.summary = body.summary;
      if (body.description !== undefined) occurrenceUpdateData.description = body.description;
      if (body.city !== undefined) occurrenceUpdateData.city = body.city;
      if (body.country !== undefined) occurrenceUpdateData.country = body.country;
      if (body.location !== undefined) occurrenceUpdateData.location = body.location;
      if (body.causeCategories !== undefined) occurrenceUpdateData.causeCategories = body.causeCategories;
      if (body.otherCategory !== undefined) occurrenceUpdateData.otherCategory = body.otherCategory || null;
      if (body.capacity !== undefined) occurrenceUpdateData.capacity = Number(body.capacity);
      if (body.platformServiceFee !== undefined) occurrenceUpdateData.platformServiceFee = body.platformServiceFee;
      if (body.programmeFee !== undefined) occurrenceUpdateData.programmeFee = body.programmeFee || 0;
      if (body.totalFee !== undefined) occurrenceUpdateData.totalFee = body.totalFee;
      if (body.requirements !== undefined) occurrenceUpdateData.requirements = body.requirements || [];
      if (body.accessibility !== undefined) occurrenceUpdateData.accessibility = body.accessibility || null;
      if (body.images !== undefined) occurrenceUpdateData.images = body.images || [];
      if (body.status !== undefined) occurrenceUpdateData.status = body.status;
      if (body.instantConfirmation !== undefined) occurrenceUpdateData.instantConfirmation = body.instantConfirmation;

      // Include dates for single occurrence updates
      if (body.dates) {
        occurrenceUpdateData.dates = {
          start: new Date(body.dates.start),
          end: new Date(body.dates.end),
        };
      }

      // Update only this single experience
      await adminDb.collection('experiences').doc(id).update(occurrenceUpdateData);

      // Fetch the updated experience
      const updatedDoc = await adminDb.collection('experiences').doc(id).get();
      const updatedData = updatedDoc.data();

      const experience: Experience = {
        id: updatedDoc.id,
        ...updatedData,
        dates: {
          start: updatedData.dates.start.toDate(),
          end: updatedData.dates.end.toDate(),
        },
        recurrenceEndDate: updatedData.recurrenceEndDate?.toDate?.() || updatedData.recurrenceEndDate,
        createdAt: updatedData.createdAt.toDate(),
        updatedAt: updatedData.updatedAt.toDate(),
      } as Experience;

      return NextResponse.json(
        {
          success: true,
          experience,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if user is an NGO
    if (userRole !== 'ngo') {
      return NextResponse.json(
        { error: 'Forbidden - Only NGOs can delete experiences' },
        { status: 403 }
      );
    }

    // Get the user's NGO ID
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const ngoId = userDoc.data()?.ngoId;

    if (!ngoId) {
      return NextResponse.json(
        { error: 'NGO ID not found for user' },
        { status: 400 }
      );
    }

    // Fetch the experience to verify ownership
    const experienceDoc = await adminDb.collection('experiences').doc(id).get();

    if (!experienceDoc.exists) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    const existingData = experienceDoc.data();

    // Verify that this experience belongs to the NGO
    if (existingData?.ngoId !== ngoId) {
      return NextResponse.json(
        { error: 'Forbidden - This experience does not belong to your organisation' },
        { status: 403 }
      );
    }

    // Check if there are any bookings for this experience
    const bookingsSnapshot = await adminDb
      .collection('bookings')
      .where('experienceId', '==', id)
      .where('status', 'in', ['pending', 'confirmed'])
      .get();

    if (!bookingsSnapshot.empty) {
      return NextResponse.json(
        { error: 'Cannot delete experience with active bookings' },
        { status: 400 }
      );
    }

    // Delete the experience
    await adminDb.collection('experiences').doc(id).delete();

    return NextResponse.json(
      {
        success: true,
        message: 'Experience deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
}
