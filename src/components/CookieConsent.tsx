'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Settings, Cookie } from 'lucide-react';
import { useCookieConsent, CookiePreferences } from '@/lib/hooks/useCookieConsent';
import { Button } from '@/components/ui/Button';

export default function CookieConsent() {
  const { showBanner, preferences, acceptAll, rejectAll, updatePreferences } = useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [tempPreferences, setTempPreferences] = useState<CookiePreferences>(preferences);

  if (!showBanner) return null;

  const handleOpenSettings = () => {
    setTempPreferences(preferences);
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    updatePreferences(tempPreferences);
    setShowSettings(false);
  };

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Cannot disable essential cookies
    setTempPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      {/* Cookie Banner */}
      {!showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t-2 border-[#21B3B1] shadow-2xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Content */}
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-6 h-6 text-[#21B3B1] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-[#2C3E3A] mb-2">
                    We Value Your Privacy
                  </h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                    By clicking "Accept All", you consent to our use of cookies.{' '}
                    <Link href="/cookies" className="text-[#21B3B1] hover:underline font-medium">
                      Learn more
                    </Link>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenSettings}
                  className="border-[#7A7A7A] text-[#4A4A4A] hover:bg-gray-100 w-full sm:w-auto"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rejectAll}
                  className="border-[#7A7A7A] text-[#4A4A4A] hover:bg-gray-100 w-full sm:w-auto"
                >
                  Reject All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptAll}
                  className="border-[#21B3B1] text-[#21B3B1] hover:bg-[#C9F0EF] w-full sm:w-auto"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <Cookie className="w-6 h-6 text-[#21B3B1]" />
                <h2 className="text-2xl font-bold text-[#2C3E3A]">Cookie Preferences</h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-[#7A7A7A]" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                We use cookies to improve your experience on our platform. You can choose which types of cookies
                to allow. Please note that disabling some cookies may affect your experience.{' '}
                <Link href="/cookies" className="text-[#21B3B1] hover:underline font-medium">
                  Read our Cookie Policy
                </Link>
              </p>

              {/* Essential Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2C3E3A] mb-2">
                      Essential Cookies
                    </h3>
                    <p className="text-sm text-[#7A7A7A] leading-relaxed">
                      These cookies are necessary for the platform to function and cannot be disabled.
                      They include authentication, security, and session management.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-3 py-1 bg-gray-100 text-[#7A7A7A] text-xs font-medium rounded-full">
                      Always Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2C3E3A] mb-2">
                      Functional Cookies
                    </h3>
                    <p className="text-sm text-[#7A7A7A] leading-relaxed">
                      These cookies enable enhanced functionality and personalization, such as remembering
                      your preferences and settings.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempPreferences.functional}
                      onChange={() => handleToggle('functional')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#21B3B1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#21B3B1]"></div>
                  </label>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2C3E3A] mb-2">
                      Analytics Cookies
                    </h3>
                    <p className="text-sm text-[#7A7A7A] leading-relaxed">
                      These cookies help us understand how visitors interact with our platform by collecting
                      and reporting information anonymously (Google Analytics, Firebase Analytics).
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempPreferences.analytics}
                      onChange={() => handleToggle('analytics')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#21B3B1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#21B3B1]"></div>
                  </label>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2C3E3A] mb-2">
                      Marketing Cookies
                    </h3>
                    <p className="text-sm text-[#7A7A7A] leading-relaxed">
                      These cookies are used to track visitors across websites to display relevant advertisements
                      and measure the effectiveness of marketing campaigns.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempPreferences.marketing}
                      onChange={() => handleToggle('marketing')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#21B3B1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#21B3B1]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row gap-3 rounded-b-2xl">
              <Button
                variant="outline"
                onClick={rejectAll}
                className="border-[#7A7A7A] text-[#4A4A4A] hover:bg-gray-100 w-full sm:w-auto"
              >
                Reject All
              </Button>
              <Button
                variant="outline"
                onClick={acceptAll}
                className="border-[#21B3B1] text-[#21B3B1] hover:bg-[#C9F0EF] w-full sm:w-auto"
              >
                Accept All
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveSettings}
                className="border-[#21B3B1] text-[#21B3B1] hover:bg-[#C9F0EF] bg-[#C9F0EF] font-semibold w-full sm:flex-1"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
