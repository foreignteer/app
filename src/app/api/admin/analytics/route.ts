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

    // Check if user is admin
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Fetch all data in parallel
    const [ngosSnapshot, experiencesSnapshot, bookingsSnapshot, usersSnapshot] = await Promise.all([
      adminDb.collection('ngos').get(),
      adminDb.collection('experiences').get(),
      adminDb.collection('bookings').get(),
      adminDb.collection('users').get(),
    ]);

    // Process NGOs
    const ngos = ngosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const approvedNGOs = ngos.filter((ngo: any) => ngo.approved === true);
    const pendingNGOs = ngos.filter((ngo: any) => !ngo.approved && !ngo.rejectionReason);
    const rejectedNGOs = ngos.filter((ngo: any) => ngo.rejectionReason);

    // Process Experiences
    const experiences = experiencesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const publishedExperiences = experiences.filter((exp: any) => exp.status === 'published');
    const draftExperiences = experiences.filter((exp: any) => exp.status === 'draft');
    const cancelledExperiences = experiences.filter((exp: any) => exp.status === 'cancelled');

    // Process Bookings
    const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed');
    const pendingBookings = bookings.filter((b: any) => b.status === 'pending');
    const completedBookings = bookings.filter((b: any) => b.status === 'completed');
    const cancelledBookings = bookings.filter((b: any) => b.status === 'cancelled');

    // Process Users
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const volunteers = users.filter((u: any) => u.role === 'user');
    const ngoUsers = users.filter((u: any) => u.role === 'ngo');
    const adminUsers = users.filter((u: any) => u.role === 'admin');

    // Calculate revenue (platform fee: £15 per booking)
    const platformFee = 15.0;
    const totalRevenue = confirmedBookings.length * platformFee;
    const totalProgrammeFees = bookings.reduce((sum: number, booking: any) => {
      return sum + (booking.programmeFee || 0);
    }, 0);

    // Popular Causes
    const causeCounts: Record<string, number> = {};
    experiences.forEach((exp: any) => {
      exp.causeCategories?.forEach((cause: string) => {
        causeCounts[cause] = (causeCounts[cause] || 0) + 1;
      });
    });
    const popularCauses = Object.entries(causeCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Geographic Distribution (NGOs by country)
    const ngoCountries: Record<string, number> = {};
    ngos.forEach((ngo: any) => {
      const country = ngo.jurisdiction || 'Unknown';
      ngoCountries[country] = (ngoCountries[country] || 0) + 1;
    });
    const topCountries = Object.entries(ngoCountries)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Experience Locations (by country)
    const experienceCountries: Record<string, number> = {};
    experiences.forEach((exp: any) => {
      const country = exp.country || 'Unknown';
      experienceCountries[country] = (experienceCountries[country] || 0) + 1;
    });
    const topExperienceLocations = Object.entries(experienceCountries)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Monthly trends (last 12 months)
    const now = new Date();
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = date.getTime();
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).getTime();

      const monthNGOs = ngos.filter((ngo: any) => {
        const createdAt = ngo.createdAt?.toDate?.()?.getTime() || 0;
        return createdAt >= monthStart && createdAt <= monthEnd;
      }).length;

      const monthExperiences = experiences.filter((exp: any) => {
        const createdAt = exp.createdAt?.toDate?.()?.getTime() || 0;
        return createdAt >= monthStart && createdAt <= monthEnd;
      }).length;

      const monthBookings = bookings.filter((b: any) => {
        const createdAt = b.createdAt?.toDate?.()?.getTime() || 0;
        return createdAt >= monthStart && createdAt <= monthEnd;
      }).length;

      const monthUsers = users.filter((u: any) => {
        const createdAt = u.createdAt?.toDate?.()?.getTime() || 0;
        return createdAt >= monthStart && createdAt <= monthEnd;
      }).length;

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        ngos: monthNGOs,
        experiences: monthExperiences,
        bookings: monthBookings,
        users: monthUsers,
      });
    }

    // Booking conversion rate
    const totalExperienceViews = publishedExperiences.length * 10; // Placeholder - you'd track this properly
    const conversionRate = totalExperienceViews > 0
      ? ((bookings.length / totalExperienceViews) * 100).toFixed(2)
      : '0.00';

    // Prepare response
    const analytics = {
      totals: {
        ngos: {
          total: ngos.length,
          approved: approvedNGOs.length,
          pending: pendingNGOs.length,
          rejected: rejectedNGOs.length,
        },
        experiences: {
          total: experiences.length,
          published: publishedExperiences.length,
          draft: draftExperiences.length,
          cancelled: cancelledExperiences.length,
        },
        bookings: {
          total: bookings.length,
          confirmed: confirmedBookings.length,
          pending: pendingBookings.length,
          completed: completedBookings.length,
          cancelled: cancelledBookings.length,
        },
        users: {
          total: users.length,
          volunteers: volunteers.length,
          ngos: ngoUsers.length,
          admins: adminUsers.length,
        },
      },
      revenue: {
        platformRevenue: totalRevenue,
        programmeFees: totalProgrammeFees,
        totalRevenue: totalRevenue + totalProgrammeFees,
      },
      performance: {
        conversionRate,
        popularCauses,
        topCountries,
        topExperienceLocations,
      },
      trends: {
        monthly: monthlyData,
      },
    };

    return NextResponse.json({ analytics }, { status: 200 });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
