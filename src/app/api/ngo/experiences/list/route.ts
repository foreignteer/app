import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { Experience } from '@/lib/types/experience';

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
    const querySnapshot = await adminDb
      .collection('experiences')
      .where('ngoId', '==', ngoId)
      .get();

    const experiences: Experience[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      experiences.push({
        id: doc.id,
        ...data,
        dates: {
          start: data.dates.start.toDate(),
          end: data.dates.end.toDate(),
        },
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Experience);
    });

    // Sort by creation date (newest first)
    experiences.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ experiences }, { status: 200 });
  } catch (error) {
    console.error('Error fetching NGO experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}
