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

    // Fetch all experiences for this NGO
    const experiencesSnapshot = await adminDb
      .collection('experiences')
      .where('ngoId', '==', ngoId)
      .get();

    let totalExperiences = 0;
    let publishedExperiences = 0;
    let pendingExperiences = 0;
    let draftExperiences = 0;

    const experienceIds: string[] = [];

    experiencesSnapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      totalExperiences++;
      const data = doc.data();
      experienceIds.push(doc.id);

      switch (data.status) {
        case 'published':
          publishedExperiences++;
          break;
        case 'pending_approval':
          pendingExperiences++;
          break;
        case 'draft':
          draftExperiences++;
          break;
      }
    });

    // Fetch bookings for these experiences
    let totalApplicants = 0;
    let newApplicants = 0;

    if (experienceIds.length > 0) {
      // Firestore 'in' queries are limited to 10 items, so we need to batch if more
      const batchSize = 10;
      for (let i = 0; i < experienceIds.length; i += batchSize) {
        const batch = experienceIds.slice(i, i + batchSize);
        const bookingsSnapshot = await adminDb
          .collection('bookings')
          .where('experienceId', 'in', batch)
          .get();

        bookingsSnapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
          const data = doc.data();
          if (data.status !== 'cancelled') {
            totalApplicants++;
          }

          // Count as "new" if created in the last 7 days
          const createdAt = data.appliedAt?.toDate();
          if (createdAt) {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            if (createdAt > sevenDaysAgo && data.status === 'pending') {
              newApplicants++;
            }
          }
        });
      }
    }

    return NextResponse.json(
      {
        totalExperiences,
        publishedExperiences,
        pendingExperiences,
        draftExperiences,
        totalApplicants,
        newApplicants,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching NGO stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
