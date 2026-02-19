import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      action,
      category,
      label,
      value,
      userId,
      properties,
      timestamp,
      url,
      pathname,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    } = body;

    // Validate required fields
    if (!action || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: action and category' },
        { status: 400 }
      );
    }

    // Create analytics event document
    const eventData = {
      action,
      category,
      label: label || null,
      value: value || null,
      userId: userId || null,
      properties: properties || {},
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      url: url || null,
      pathname: pathname || null,
      referrer: referrer || null,
      // UTM parameters
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_term: utm_term || null,
      utm_content: utm_content || null,
      // Additional metadata
      userAgent: request.headers.get('user-agent') || null,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
    };

    // Save to Firestore
    await adminDb.collection('analytics_events').add(eventData);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
