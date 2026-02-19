'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { MailWarning, UserCircle, X, CheckCircle, RefreshCw } from 'lucide-react';

export default function RegistrationBanner() {
  const { user, firebaseUser, resendVerificationEmail } = useAuth();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);

  if (!user || !firebaseUser) return null;

  const emailVerified = firebaseUser.emailVerified;
  const profileCompleted = user.profileCompleted;

  const dismiss = (key: string) => {
    setDismissed((prev) => [...prev, key]);
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendVerificationEmail();
      setResendSent(true);
    } catch {
      // Silently fail
    } finally {
      setResendLoading(false);
    }
  };

  const banners = [];

  // Email verification banner
  if (!emailVerified && !dismissed.includes('email')) {
    banners.push(
      <div
        key="email"
        className="flex items-start gap-3 bg-[#FFF3CD] border border-[#F2B56B] rounded-xl px-4 py-3"
      >
        <MailWarning className="w-5 h-5 text-[#F2B56B] flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#4A4A4A]">Please verify your email address</p>
          <p className="text-sm text-[#7A7A7A] mt-0.5">
            We sent a verification link to <span className="font-medium text-[#4A4A4A]">{user.email}</span>.
            Check your inbox (and spam folder).
          </p>
          <div className="mt-2">
            {resendSent ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-[#6FB7A4] font-medium">
                <CheckCircle className="w-4 h-4" />
                Verification email sent!
              </span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="inline-flex items-center gap-1.5 text-sm text-[#21B3B1] font-medium hover:underline disabled:opacity-50"
              >
                {resendLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend verification email'
                )}
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => dismiss('email')}
          className="flex-shrink-0 p-1 hover:bg-[#F2B56B]/20 rounded transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 text-[#7A7A7A]" />
        </button>
      </div>
    );
  }

  // Profile completion banner
  if (!profileCompleted && !dismissed.includes('profile')) {
    banners.push(
      <div
        key="profile"
        className="flex items-start gap-3 bg-[#C9F0EF] border border-[#21B3B1]/30 rounded-xl px-4 py-3"
      >
        <UserCircle className="w-5 h-5 text-[#21B3B1] flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#4A4A4A]">Complete your profile</p>
          <p className="text-sm text-[#7A7A7A] mt-0.5">
            Add your country, skills, and emergency contact to get better matched with volunteering opportunities.
          </p>
          <Link
            href="/dashboard/user/profile"
            className="inline-block mt-2 text-sm text-[#21B3B1] font-medium hover:underline"
          >
            Complete profile →
          </Link>
        </div>
        <button
          onClick={() => dismiss('profile')}
          className="flex-shrink-0 p-1 hover:bg-[#21B3B1]/10 rounded transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 text-[#7A7A7A]" />
        </button>
      </div>
    );
  }

  if (banners.length === 0) return null;

  return <div className="space-y-3">{banners}</div>;
}
