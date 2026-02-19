# Marketing Analytics Implementation Guide

## Overview

The Foreignteer marketing analytics system tracks user acquisition, engagement, and conversion funnels using a hybrid approach:

1. **Google Analytics GA4** - For broad website analytics and Google's ecosystem
2. **Custom Event Tracking** - For conversion funnels, drop-off analysis, and custom metrics

## Setup

### 1. Configure Google Analytics

Add your GA4 Measurement ID to `.env.local`:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Get your Measurement ID from [Google Analytics](https://analytics.google.com/) → Admin → Data Streams → Web Stream Details

### 2. Event Tracking is Already Configured

The system automatically tracks:
- Page views
- UTM campaign parameters
- Traffic sources (referrers)
- User interactions
- Conversion funnel steps

## Adding Event Tracking to Your Pages

### Import the Tracker

```typescript
import { AnalyticsEvents } from '@/lib/analytics/tracker';
```

### Example: Track Experience View

```typescript
'use client';

import { useEffect } from 'react';
import { AnalyticsEvents } from '@/lib/analytics/tracker';

export default function ExperiencePage({ experience }: { experience: Experience }) {
  useEffect(() => {
    // Track when user views an experience
    AnalyticsEvents.EXPERIENCE_DETAIL_VIEW(experience.id, experience.title);
  }, [experience.id]);

  return (
    // Your component JSX
  );
}
```

### Example: Track Booking Flow

```typescript
'use client';

import { AnalyticsEvents } from '@/lib/analytics/tracker';

export default function BookingPage() {
  const handleBookingStart = () => {
    AnalyticsEvents.BOOKING_START(experienceId, experienceTitle);
    // Continue with booking logic
  };

  const handleDateSelect = (date: string) => {
    AnalyticsEvents.BOOKING_DATE_SELECTED(experienceId, date);
    // Continue with date selection logic
  };

  const handlePayment = () => {
    AnalyticsEvents.BOOKING_PAYMENT_START(experienceId, amount);
    // Continue with payment logic
  };

  const handleBookingComplete = (bookingId: string) => {
    AnalyticsEvents.BOOKING_COMPLETE(bookingId, experienceId, amount, userId);
    // Show confirmation
  };

  return (
    // Your component JSX
  );
}
```

### Example: Track CTA Clicks

```typescript
<button
  onClick={() => {
    AnalyticsEvents.CTA_CLICK('Browse Experiences', 'homepage_hero');
    router.push('/experiences');
  }}
>
  Browse Experiences
</button>
```

### Example: Track Registration

```typescript
const handleRegisterStart = () => {
  AnalyticsEvents.USER_REGISTER_START();
  // Show registration form
};

const handleRegisterComplete = async () => {
  // After successful registration
  AnalyticsEvents.USER_REGISTER_COMPLETE(userId);
};
```

## Available Event Types

### Page Views
- `PAGE_VIEW(page: string)` - Track page visits

### User Registration
- `USER_REGISTER_START()` - User clicks register
- `USER_REGISTER_COMPLETE(userId: string)` - Registration successful
- `NGO_REGISTER_START()` - NGO starts registration
- `NGO_REGISTER_COMPLETE(ngoId: string)` - NGO registration complete

### Experience Browsing
- `EXPERIENCE_LIST_VIEW(filters?: object)` - User views experience list
- `EXPERIENCE_DETAIL_VIEW(id: string, title: string)` - User views experience details
- `EXPERIENCE_FILTER_APPLIED(type: string, value: string)` - User applies filter

### Booking Funnel
- `BOOKING_START(experienceId: string, title: string)` - User initiates booking
- `BOOKING_DATE_SELECTED(experienceId: string, date: string)` - User selects date
- `BOOKING_PAYMENT_START(experienceId: string, amount: number)` - User enters payment
- `BOOKING_COMPLETE(bookingId: string, experienceId: string, amount: number, userId: string)` - Booking confirmed
- `BOOKING_ABANDONED(experienceId: string, step: number)` - User abandons booking

### NGO Actions
- `NGO_PROFILE_VIEW(ngoId: string, name: string)` - User views NGO profile
- `NGO_EXPERIENCE_CREATE_START(ngoId: string)` - NGO starts creating experience
- `NGO_EXPERIENCE_CREATE_COMPLETE(experienceId: string, ngoId: string)` - Experience created

### Social & Engagement
- `SHARE_BUTTON_CLICK(type: string, contentType: string, contentId: string)` - Share button clicked
- `CTA_CLICK(label: string, location: string)` - Call-to-action clicked

## UTM Campaign Tracking

### Create Marketing Links

Add UTM parameters to your marketing URLs:

```
https://foreignteer.com/experiences?utm_source=facebook&utm_medium=social&utm_campaign=summer2024
```

### UTM Parameters

- `utm_source` - Traffic source (facebook, google, newsletter, instagram)
- `utm_medium` - Marketing medium (social, email, cpc, organic)
- `utm_campaign` - Campaign name (summer2024, volunteer_month)
- `utm_term` - Paid search keywords (optional)
- `utm_content` - Content variation (optional, for A/B testing)

### Example Marketing Links

**Facebook Ad:**
```
https://foreignteer.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=spring2024&utm_content=hero_image_v1
```

**Email Newsletter:**
```
https://foreignteer.com/experiences?utm_source=newsletter&utm_medium=email&utm_campaign=monthly_digest
```

**Instagram Bio:**
```
https://foreignteer.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio_link
```

## Viewing Analytics

### Access Marketing Analytics Dashboard

1. Log in as admin
2. Navigate to **Dashboard** → **Marketing Analytics**
3. View:
   - Conversion funnel with drop-off rates
   - Traffic sources
   - Campaign performance
   - Top pages
   - Registration funnels
   - CTA performance

### Time Range Selection

Use the time range buttons (7D, 30D, 90D) to view different periods.

### Interpreting Drop-off Rates

- **Green indicator** (< 20% drop-off) - Healthy conversion
- **Yellow indicator** (20-30% drop-off) - Monitor closely
- **Red indicator** (> 30% drop-off) - Requires optimization

High drop-off points indicate where users are getting stuck or losing interest.

## Key Pages to Implement Tracking

### Priority 1 (Critical for Conversion Funnel)
1. ✅ Homepage (`/src/app/page.tsx`) - Track page view, CTA clicks
2. **Experiences List** (`/src/app/experiences/page.tsx`) - Track list view, filters
3. **Experience Detail** (`/src/app/experiences/[id]/page.tsx`) - Track detail view
4. **Booking Flow** - Track all booking steps
5. **Registration Pages** - Track registration funnel

### Priority 2 (Engagement Metrics)
6. **NGO Profile** (`/src/app/ngos/[slug]/page.tsx`) - Track profile views
7. **Blog** (`/src/app/blog/page.tsx`) - Track blog engagement
8. **About/Contact** - Track engagement with info pages

### Priority 3 (NGO Actions)
9. **NGO Experience Creation** - Track NGO engagement
10. **NGO Dashboard** - Track NGO activity

## Data Retention

Analytics events are stored in Firestore collection `analytics_events`:

```typescript
{
  action: 'booking_complete',
  category: 'conversion',
  label: 'booking_funnel',
  value: 150,
  userId: 'user123',
  timestamp: '2024-02-07T10:30:00Z',
  url: 'https://foreignteer.com/booking/confirm',
  pathname: '/booking/confirm',
  referrer: 'https://foreignteer.com/experiences/abc',
  utm_source: 'facebook',
  utm_medium: 'cpc',
  utm_campaign: 'summer2024',
  properties: {
    experienceId: 'exp123',
    funnel_step: 4
  }
}
```

## Testing

### Test Event Tracking

1. Open browser DevTools → Network tab
2. Filter by `/api/analytics/track`
3. Interact with tracked elements
4. Verify POST requests to tracking endpoint

### Test in Different Scenarios

```typescript
// Test with UTM parameters
https://localhost:3000/?utm_source=test&utm_campaign=dev_test

// Test different user flows
1. Homepage → Experiences → Detail → Booking
2. Direct link → Experience → Booking
3. Campaign link → Registration
```

## Best Practices

### 1. Track User Intent, Not Just Actions

❌ Bad: Track every click
✅ Good: Track meaningful actions (CTA clicks, form submissions)

### 2. Use Descriptive Labels

❌ Bad: `trackEvent({ action: 'click', label: 'button' })`
✅ Good: `AnalyticsEvents.CTA_CLICK('Browse Experiences', 'homepage_hero')`

### 3. Track the Full Funnel

Track all steps in important funnels (registration, booking) to identify drop-off points.

### 4. Use Consistent Naming

Follow the naming convention in `AnalyticsEvents` for new events.

### 5. Don't Track PII

Never track personal information like emails, phone numbers, or addresses.

## Troubleshooting

### Events Not Appearing in Dashboard

1. Check browser console for errors
2. Verify API endpoint is accessible: `/api/analytics/track`
3. Check Firestore permissions
4. Ensure events are being fired (check Network tab)

### GA4 Not Working

1. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local`
2. Check that ID starts with `G-`
3. Wait 24-48 hours for data to appear in GA4
4. Use GA4 DebugView for real-time testing

### Drop-off Rates Seem Wrong

- Ensure all funnel steps are tracked
- Check that events fire in correct order
- Verify timestamp accuracy
- Consider user behavior patterns (users can skip steps)

## Future Enhancements

Potential additions:

1. **Heatmaps** - Track mouse movements and clicks
2. **Session Recording** - Record user sessions for UX analysis
3. **A/B Testing** - Test different versions of pages
4. **Cohort Analysis** - Track user behavior over time
5. **Revenue Attribution** - Link bookings to marketing campaigns
6. **Real-time Dashboard** - Live metrics updates
7. **Automated Alerts** - Email when drop-off rates spike

## Support

For questions or issues:
- Check this guide first
- Review code in `/src/lib/analytics/tracker.ts`
- Check API endpoint: `/src/app/api/analytics/track/route.ts`
- Review dashboard: `/src/app/dashboard/admin/marketing/page.tsx`
