'use client';

import { useState, useEffect } from 'react';

export interface CookiePreferences {
  essential: boolean; // Always true, cannot be disabled
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'foreignteer_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'foreignteer_cookie_preferences';

export function useCookieConsent() {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consentGiven = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (consentGiven === 'true' && savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
        setHasConsented(true);
        setShowBanner(false);
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
      setHasConsented(false);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const rejectAll = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    savePreferences(essentialOnly);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    // Ensure essential is always true
    const finalPrefs = { ...prefs, essential: true };

    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(finalPrefs));
    setPreferences(finalPrefs);
    setHasConsented(true);
    setShowBanner(false);

    // Apply preferences (enable/disable analytics, marketing scripts)
    applyPreferences(finalPrefs);
  };

  const applyPreferences = (prefs: CookiePreferences) => {
    // Google Analytics
    if (prefs.analytics) {
      // Enable GA if not already enabled
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      }
    } else {
      // Disable GA
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    }

    // Marketing cookies
    if (prefs.marketing) {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      }
    } else {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
    }
  };

  const updatePreferences = (prefs: CookiePreferences) => {
    savePreferences(prefs);
  };

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    setHasConsented(false);
    setShowBanner(true);
    setPreferences({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  };

  return {
    hasConsented,
    preferences,
    showBanner,
    acceptAll,
    rejectAll,
    updatePreferences,
    resetConsent,
  };
}
