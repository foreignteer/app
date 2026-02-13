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

    const userRole = decodedToken.role || 'user';

    // Check if user is an admin
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Fetch real statistics from Firestore
    const [usersSnapshot, ngosSnapshot, experiencesSnapshot, bookingsSnapshot] = await Promise.all([
      adminDb.collection('users').get(),
      adminDb.collection('ngos').get(),
      adminDb.collection('experiences').get(),
      adminDb.collection('bookings').get(),
    ]);

    let totalUsers = 0;
    let totalNGOs = ngosSnapshot.size;
    let totalExperiences = 0;
    let publishedExperiences = 0;
    let draftExperiences = 0;
    let pendingExperiences = 0;
    let totalBookings = 0;
    let pendingBookings = 0;
    let confirmedBookings = 0;
    let pendingNGOs = 0;

    // Count users by role
    usersSnapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      if (data.role === 'user') {
        totalUsers++;
      }
    });

    // Count experiences by status
    experiencesSnapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      totalExperiences++;

      if (data.status === 'published') publishedExperiences++;
      else if (data.status === 'draft') draftExperiences++;
      else if (data.status === 'pending_approval') pendingExperiences++;
    });

    // Count bookings by status
    bookingsSnapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      totalBookings++;

      if (data.status === 'pending') pendingBookings++;
      else if (data.status === 'confirmed') confirmedBookings++;
    });

    // Count pending NGO approvals (not yet approved)
    ngosSnapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      // Count as pending if NOT explicitly approved (handles false, undefined, null)
      if (data.approved !== true) {
        pendingNGOs++;
      }
    });

    return NextResponse.json(
      {
        totalUsers,
        totalNGOs,
        totalExperiences,
        publishedExperiences,
        draftExperiences,
        pendingExperiences,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        pendingNGOs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
