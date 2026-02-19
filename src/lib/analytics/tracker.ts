// Analytics event tracking utility

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
  properties?: Record<string, any>;
}

// Track event to both GA4 and our custom analytics
export const trackEvent = (event: AnalyticsEvent) => {
  // Send to Google Analytics GA4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.properties,
    });
  }

  // Send to custom analytics API (for conversion funnel tracking)
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        pathname: window.location.pathname,
        referrer: document.referrer,
        // Capture UTM parameters
        utm_source: new URLSearchParams(window.location.search).get('utm_source'),
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        utm_term: new URLSearchParams(window.location.search).get('utm_term'),
        utm_content: new URLSearchParams(window.location.search).get('utm_content'),
      }),
    }).catch((error) => {
      console.error('Failed to track event:', error);
    });
  }
};

// Pre-defined event types for type safety
export const AnalyticsEvents = {
  // Page Views
  PAGE_VIEW: (page: string) =>
    trackEvent({
      action: 'page_view',
      category: 'engagement',
      label: page,
    }),

  // User Registration & Authentication
  USER_REGISTER_START: () =>
    trackEvent({
      action: 'user_register_start',
      category: 'conversion',
      label: 'registration_funnel',
    }),

  USER_REGISTER_COMPLETE: (userId: string) =>
    trackEvent({
      action: 'user_register_complete',
      category: 'conversion',
      label: 'registration_funnel',
      userId,
    }),

  NGO_REGISTER_START: () =>
    trackEvent({
      action: 'ngo_register_start',
      category: 'conversion',
      label: 'ngo_registration_funnel',
    }),

  NGO_REGISTER_COMPLETE: (ngoId: string) =>
    trackEvent({
      action: 'ngo_register_complete',
      category: 'conversion',
      label: 'ngo_registration_funnel',
      properties: { ngoId },
    }),

  // Experience Browsing
  EXPERIENCE_LIST_VIEW: (filters?: Record<string, any>) =>
    trackEvent({
      action: 'experience_list_view',
      category: 'engagement',
      label: 'browse_experiences',
      properties: filters,
    }),

  EXPERIENCE_DETAIL_VIEW: (experienceId: string, experienceTitle: string) =>
    trackEvent({
      action: 'experience_detail_view',
      category: 'engagement',
      label: experienceTitle,
      properties: { experienceId },
    }),

  EXPERIENCE_FILTER_APPLIED: (filterType: string, filterValue: string) =>
    trackEvent({
      action: 'experience_filter_applied',
      category: 'engagement',
      label: `${filterType}: ${filterValue}`,
    }),

  // Booking Funnel
  BOOKING_START: (experienceId: string, experienceTitle: string) =>
    trackEvent({
      action: 'booking_start',
      category: 'conversion',
      label: experienceTitle,
      properties: { experienceId, funnel_step: 1 },
    }),

  BOOKING_DATE_SELECTED: (experienceId: string, date: string) =>
    trackEvent({
      action: 'booking_date_selected',
      category: 'conversion',
      label: 'booking_funnel',
      properties: { experienceId, date, funnel_step: 2 },
    }),

  BOOKING_PAYMENT_START: (experienceId: string, amount: number) =>
    trackEvent({
      action: 'booking_payment_start',
      category: 'conversion',
      label: 'booking_funnel',
      value: amount,
      properties: { experienceId, funnel_step: 3 },
    }),

  BOOKING_COMPLETE: (bookingId: string, experienceId: string, amount: number, userId: string) =>
    trackEvent({
      action: 'booking_complete',
      category: 'conversion',
      label: 'booking_funnel',
      value: amount,
      userId,
      properties: { bookingId, experienceId, funnel_step: 4 },
    }),

  // NGO Profile & Experiences
  NGO_PROFILE_VIEW: (ngoId: string, ngoName: string) =>
    trackEvent({
      action: 'ngo_profile_view',
      category: 'engagement',
      label: ngoName,
      properties: { ngoId },
    }),

  NGO_EXPERIENCE_CREATE_START: (ngoId: string) =>
    trackEvent({
      action: 'ngo_experience_create_start',
      category: 'engagement',
      label: 'ngo_dashboard',
      properties: { ngoId },
    }),

  NGO_EXPERIENCE_CREATE_COMPLETE: (experienceId: string, ngoId: string) =>
    trackEvent({
      action: 'ngo_experience_create_complete',
      category: 'conversion',
      label: 'ngo_dashboard',
      properties: { experienceId, ngoId },
    }),

  // Social Actions
  SHARE_BUTTON_CLICK: (shareType: string, contentType: string, contentId: string) =>
    trackEvent({
      action: 'share_button_click',
      category: 'engagement',
      label: `${shareType}_${contentType}`,
      properties: { contentId },
    }),

  // Drop-off Detection
  BOOKING_ABANDONED: (experienceId: string, funnel_step: number) =>
    trackEvent({
      action: 'booking_abandoned',
      category: 'conversion',
      label: 'booking_funnel',
      properties: { experienceId, funnel_step },
    }),

  // CTA Clicks
  CTA_CLICK: (ctaLabel: string, ctaLocation: string) =>
    trackEvent({
      action: 'cta_click',
      category: 'engagement',
      label: ctaLabel,
      properties: { location: ctaLocation },
    }),
};
