'use client';

import { useCookieConsent } from '@/lib/hooks/useCookieConsent';

export default function ManageCookies() {
  const { resetConsent } = useCookieConsent();

  return (
    <button
      onClick={resetConsent}
      className="text-text-light hover:text-primary transition-colors text-sm"
    >
      Manage Cookies
    </button>
  );
}
