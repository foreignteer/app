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
    const status = searchParams.get('status'); // 'pending', 'approved', 'rejected'

    // Fetch NGOs
    let query: FirebaseFirestore.Query | FirebaseFirestore.CollectionReference = adminDb.collection('ngos');

    if (status) {
      query = query.where('approved', '==', status === 'approved');
    }

    const querySnapshot = await query.get();

    const ngos: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      ngos.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });

    // Sort by creation date (newest first)
    ngos.sort((a, b) => {
      const aTime = a.createdAt?.getTime() || 0;
      const bTime = b.createdAt?.getTime() || 0;
      return bTime - aTime;
    });

    return NextResponse.json({ ngos }, { status: 200 });
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NGOs' },
      { status: 500 }
    );
  }
}
