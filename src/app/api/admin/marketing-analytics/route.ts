import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

interface StoredAnalyticsEvent {
  id: string;
  action: string;
  category?: string;
  label?: string;
  value?: number;
  userId?: string;
  properties?: Record<string, any>;
  timestamp: string | null;
  url?: string;
  pathname?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

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

    // Get query parameters for date range
    const url = new URL(request.url);
    const daysBack = parseInt(url.searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Fetch analytics events
    const eventsSnapshot = await adminDb
      .collection('analytics_events')
      .where('timestamp', '>=', startDate)
      .orderBy('timestamp', 'desc')
      .get();

    const events: StoredAnalyticsEvent[] = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || null,
    } as StoredAnalyticsEvent));

    // Calculate conversion funnel metrics
    const funnelSteps = {
      homepage_view: events.filter(e => e.action === 'page_view' && e.pathname === '/').length,
      experience_list_view: events.filter(e => e.action === 'experience_list_view').length,
      experience_detail_view: events.filter(e => e.action === 'experience_detail_view').length,
      booking_start: events.filter(e => e.action === 'booking_start').length,
      booking_date_selected: events.filter(e => e.action === 'booking_date_selected').length,
      booking_payment_start: events.filter(e => e.action === 'booking_payment_start').length,
      booking_complete: events.filter(e => e.action === 'booking_complete').length,
    };

    // Calculate drop-off rates
    const conversionFunnel = [
      {
        step: 1,
        name: 'Homepage View',
        count: funnelSteps.homepage_view,
        percentage: 100,
        dropOffRate: 0,
      },
      {
        step: 2,
        name: 'Browse Experiences',
        count: funnelSteps.experience_list_view,
        percentage: funnelSteps.homepage_view > 0
          ? ((funnelSteps.experience_list_view / funnelSteps.homepage_view) * 100)
          : 0,
        dropOffRate: funnelSteps.homepage_view > 0
          ? (((funnelSteps.homepage_view - funnelSteps.experience_list_view) / funnelSteps.homepage_view) * 100)
          : 0,
      },
      {
        step: 3,
        name: 'View Experience Details',
        count: funnelSteps.experience_detail_view,
        percentage: funnelSteps.homepage_view > 0
          ? ((funnelSteps.experience_detail_view / funnelSteps.homepage_view) * 100)
          : 0,
        dropOffRate: funnelSteps.experience_list_view > 0
          ? (((funnelSteps.experience_list_view - funnelSteps.experience_detail_view) / funnelSteps.experience_list_view) * 100)
          : 0,
      },
      {
        step: 4,
        name: 'Start Booking',
        count: funnelSteps.booking_start,
        percentage: funnelSteps.homepage_view > 0
          ? ((funnelSteps.booking_start / funnelSteps.homepage_view) * 100)
          : 0,
        dropOffRate: funnelSteps.experience_detail_view > 0
          ? (((funnelSteps.experience_detail_view - funnelSteps.booking_start) / funnelSteps.experience_detail_view) * 100)
          : 0,
      },
      {
        step: 5,
        name: 'Select Date',
        count: funnelSteps.booking_date_selected,
        percentage: funnelSteps.homepage_view > 0
          ? ((funnelSteps.booking_date_selected / funnelSteps.homepage_view) * 100)
          : 0,
        dropOffRate: funnelSteps.booking_start > 0
          ? (((funnelSteps.booking_start - funnelSteps.booking_date_selected) / funnelSteps.booking_start) * 100)
          : 0,
      },
      {
        step: 6,
        name: 'Enter Payment',
        count: funnelSteps.booking_payment_start,
        percentage: funnelSteps.homepage_view > 0
          ? ((funnelSteps.booking_payment_start / funnelSteps.homepage_view) * 100)
          : 0,
        dropOffRate: funnelSteps.booking_date_selected > 0
          ? (((funnelSteps.booking_date_selected - funnelSteps.booking_payment_start) / funnelSteps.booking_date_selected) * 100)
          : 0,
      },
      {
        step: 7,
        name: 'Complete Booking',
        count: funnelSteps.booking_complete,
        percentage: funnelSteps.homepage_view > 0
          ? ((funnelSteps.booking_complete / funnelSteps.homepage_view) * 100)
          : 0,
        dropOffRate: funnelSteps.booking_payment_start > 0
          ? (((funnelSteps.booking_payment_start - funnelSteps.booking_complete) / funnelSteps.booking_payment_start) * 100)
          : 0,
      },
    ];

    // Traffic sources analysis
    const trafficSources: Record<string, number> = {};
    events.forEach((event) => {
      if (event.utm_source) {
        trafficSources[event.utm_source] = (trafficSources[event.utm_source] || 0) + 1;
      } else if (event.referrer) {
        try {
          const referrerDomain = new URL(event.referrer).hostname;
          if (referrerDomain && !referrerDomain.includes('foreignteer')) {
            trafficSources[referrerDomain] = (trafficSources[referrerDomain] || 0) + 1;
          }
        } catch {
          // Invalid referrer URL
        }
      } else {
        trafficSources['Direct'] = (trafficSources['Direct'] || 0) + 1;
      }
    });

    const topTrafficSources = Object.entries(trafficSources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // UTM Campaign analysis
    const campaigns: Record<string, number> = {};
    events.forEach((event) => {
      if (event.utm_campaign) {
        campaigns[event.utm_campaign] = (campaigns[event.utm_campaign] || 0) + 1;
      }
    });

    const topCampaigns = Object.entries(campaigns)
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Page engagement analysis
    const pageViews: Record<string, number> = {};
    events
      .filter(e => e.action === 'page_view')
      .forEach((event) => {
        const page = event.pathname || event.label || 'Unknown';
        pageViews[page] = (pageViews[page] || 0) + 1;
      });

    const topPages = Object.entries(pageViews)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // User registration funnel
    const userRegistrations = {
      started: events.filter(e => e.action === 'user_register_start').length,
      completed: events.filter(e => e.action === 'user_register_complete').length,
      conversionRate: 0,
    };
    userRegistrations.conversionRate = userRegistrations.started > 0
      ? ((userRegistrations.completed / userRegistrations.started) * 100)
      : 0;

    // NGO registration funnel
    const ngoRegistrations = {
      started: events.filter(e => e.action === 'ngo_register_start').length,
      completed: events.filter(e => e.action === 'ngo_register_complete').length,
      conversionRate: 0,
    };
    ngoRegistrations.conversionRate = ngoRegistrations.started > 0
      ? ((ngoRegistrations.completed / ngoRegistrations.started) * 100)
      : 0;

    // Overall conversion metrics
    const overallConversion = {
      totalVisitors: funnelSteps.homepage_view,
      totalBookings: funnelSteps.booking_complete,
      conversionRate: funnelSteps.homepage_view > 0
        ? ((funnelSteps.booking_complete / funnelSteps.homepage_view) * 100)
        : 0,
    };

    // CTA performance
    const ctaClicks: Record<string, number> = {};
    events
      .filter(e => e.action === 'cta_click')
      .forEach((event) => {
        const cta = event.label || 'Unknown';
        ctaClicks[cta] = (ctaClicks[cta] || 0) + 1;
      });

    const topCTAs = Object.entries(ctaClicks)
      .map(([cta, clicks]) => ({ cta, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Prepare response
    const analytics = {
      dateRange: {
        start: startDate.toISOString(),
        end: new Date().toISOString(),
        days: daysBack,
      },
      conversionFunnel,
      overallConversion,
      trafficSources: topTrafficSources,
      campaigns: topCampaigns,
      pageEngagement: topPages,
      userRegistrations,
      ngoRegistrations,
      ctaPerformance: topCTAs,
      totalEvents: events.length,
    };

    return NextResponse.json({ analytics }, { status: 200 });
  } catch (error) {
    console.error('Error fetching marketing analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketing analytics' },
      { status: 500 }
    );
  }
}
