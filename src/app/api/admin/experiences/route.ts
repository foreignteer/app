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

    const userRole = decodedToken.role || 'user';

    // Check if user is an admin
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can access this endpoint' },
        { status: 403 }
      );
    }

    // Get filter parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'draft', 'pending_approval', 'published', 'cancelled'

    // Fetch experiences
    let query = adminDb.collection('experiences');

    if (status) {
      query = query.where('status', '==', status);
    }

    const querySnapshot = await query.get();

    const experiences: any[] = [];
    for (const doc of querySnapshot.docs) {
      const data = doc.data();

      // Fetch NGO details
      let ngoName = 'Unknown NGO';
      if (data.ngoId) {
        const ngoDoc = await adminDb.collection('ngos').doc(data.ngoId).get();
        if (ngoDoc.exists) {
          ngoName = ngoDoc.data()?.name || 'Unknown NGO';
        }
      }

      experiences.push({
        id: doc.id,
        ...data,
        ngoName,
        dates: {
          start: data.dates?.start?.toDate(),
          end: data.dates?.end?.toDate(),
        },
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    }

    // Sort by creation date (newest first)
    experiences.sort((a, b) => {
      const aTime = a.createdAt?.getTime() || 0;
      const bTime = b.createdAt?.getTime() || 0;
      return bTime - aTime;
    });

    return NextResponse.json({ experiences }, { status: 200 });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}
