import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    // Verify auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    const userId = decodedToken.uid;

    // Fetch all bookings for this user
    const bookingsSnapshot = await adminDb
      .collection('bookings')
      .where('userId', '==', userId)
      .get();

    const bookings = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    const completedBookings = bookings.filter((b) => b.status === 'completed');
    const upcomingBookings = bookings.filter(
      (b) => b.status === 'confirmed' || b.status === 'pending'
    );

    // Collect unique experience IDs from completed bookings
    const completedExperienceIds = [...new Set(completedBookings.map((b) => b.experienceId))];

    // Fetch experience details for completed bookings
    const experienceDetails: Record<string, any> = {};
    await Promise.all(
      completedExperienceIds.map(async (experienceId) => {
        try {
          const expDoc = await adminDb.collection('experiences').doc(experienceId).get();
          if (expDoc.exists) {
            experienceDetails[experienceId] = { id: expDoc.id, ...expDoc.data() };
          }
        } catch {
          // Skip if experience not found
        }
      })
    );

    // Calculate total hours volunteered
    let totalHours = 0;
    const countriesSet = new Set<string>();
    const causesSet = new Set<string>();
    const activityHistory: any[] = [];

    for (const booking of completedBookings) {
      const exp = experienceDetails[booking.experienceId];
      if (exp) {
        // Add hours from experience duration
        const durationHours = exp.time?.duration || 0;
        totalHours += durationHours;

        // Track unique countries
        if (exp.country) countriesSet.add(exp.country);

        // Track unique causes
        if (Array.isArray(exp.causeCategories)) {
          exp.causeCategories.forEach((c: string) => causesSet.add(c));
        }

        // Build activity history entry
        activityHistory.push({
          bookingId: booking.id,
          experienceId: booking.experienceId,
          experienceTitle: exp.title,
          country: exp.country,
          city: exp.city,
          causeCategories: exp.causeCategories || [],
          durationHours: durationHours,
          completedAt: booking.completedAt,
          rating: booking.rating,
          review: booking.review,
        });
      }
    }

    // Sort activity history by completion date (most recent first)
    activityHistory.sort((a, b) => {
      const dateA = a.completedAt?.toDate ? a.completedAt.toDate() : new Date(a.completedAt || 0);
      const dateB = b.completedAt?.toDate ? b.completedAt.toDate() : new Date(b.completedAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // Fetch upcoming experience details
    const upcomingExperienceIds = [...new Set(upcomingBookings.map((b) => b.experienceId))];
    const upcomingDetails: any[] = [];

    await Promise.all(
      upcomingExperienceIds.map(async (experienceId) => {
        try {
          const expDoc = await adminDb.collection('experiences').doc(experienceId).get();
          if (expDoc.exists) {
            const expData = expDoc.data() as any;
            const booking = upcomingBookings.find((b) => b.experienceId === experienceId);
            upcomingDetails.push({
              bookingId: booking?.id,
              experienceId,
              experienceTitle: expData.title,
              country: expData.country,
              city: expData.city,
              causeCategories: expData.causeCategories || [],
              durationHours: expData.time?.duration || 0,
              startDate: expData.dates?.start,
              status: booking?.status,
            });
          }
        } catch {
          // Skip if experience not found
        }
      })
    );

    // Causes breakdown (count per cause)
    const causesBreakdown: Record<string, number> = {};
    for (const booking of completedBookings) {
      const exp = experienceDetails[booking.experienceId];
      if (exp?.causeCategories) {
        exp.causeCategories.forEach((c: string) => {
          causesBreakdown[c] = (causesBreakdown[c] || 0) + 1;
        });
      }
    }

    return NextResponse.json({
      stats: {
        totalExperiences: completedBookings.length,
        totalHours: Math.round(totalHours * 10) / 10,
        countriesVisited: countriesSet.size,
        causesSupported: causesSet.size,
        upcomingCount: upcomingBookings.length,
        totalBookings: bookings.length,
      },
      activityHistory,
      upcomingExperiences: upcomingDetails,
      causesBreakdown,
      countriesList: [...countriesSet],
      causesList: [...causesSet],
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
