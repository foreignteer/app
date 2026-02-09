import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const experienceId = searchParams.get('experienceId');
    const status = searchParams.get('status');
    const filterUserId = searchParams.get('userId');

    // Fetch all bookings for this NGO
    let query = adminDb.collection('bookings').where('ngoId', '==', ngoId);

    if (experienceId) {
      query = query.where('experienceId', '==', experienceId);
    }

    if (status) {
      query = query.where('status', '==', status);
    }

    if (filterUserId) {
      query = query.where('userId', '==', filterUserId);
    }

    const querySnapshot = await query.get();

    const bookings: any[] = [];

    // Fetch user and experience details for each booking
    for (const doc of querySnapshot.docs) {
      const bookingData = doc.data();

      // Fetch user details
      const userDoc = await adminDb.collection('users').doc(bookingData.userId).get();
      const userData = userDoc.data();

      // Fetch experience details
      const expDoc = await adminDb.collection('experiences').doc(bookingData.experienceId).get();
      const expData = expDoc.data();

      bookings.push({
        id: doc.id,
        ...bookingData,
        appliedAt: bookingData.appliedAt?.toDate(),
        confirmedAt: bookingData.confirmedAt?.toDate(),
        cancelledAt: bookingData.cancelledAt?.toDate(),
        completedAt: bookingData.completedAt?.toDate(),
        user: {
          id: bookingData.userId,
          email: userData?.email,
          displayName: userData?.displayName,
          phone: userData?.phone,
          countryOfOrigin: userData?.countryOfOrigin,
          volunteeringExperience: userData?.volunteeringExperience,
          jobTitle: userData?.jobTitle,
          organisation: userData?.organisation,
          emergencyContact: userData?.emergencyContact,
        },
        experience: {
          id: bookingData.experienceId,
          title: expData?.title,
          city: expData?.city,
          country: expData?.country,
          dates: {
            start: expData?.dates?.start?.toDate(),
            end: expData?.dates?.end?.toDate(),
          },
        },
      });
    }

    // Sort by application date (newest first)
    bookings.sort((a, b) => {
      const aTime = a.appliedAt?.getTime() || 0;
      const bTime = b.appliedAt?.getTime() || 0;
      return bTime - aTime;
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching NGO bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
