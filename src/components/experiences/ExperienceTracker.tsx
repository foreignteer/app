'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AnalyticsEvents } from '@/lib/analytics/tracker';
import { useAuth } from '@/lib/hooks/useAuth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface ExperienceTrackerProps {
  experienceId: string;
  experienceTitle: string;
  country?: string;
  city?: string;
  causeCategories?: string[];
  image?: string;
}

// Fires EXPERIENCE_DETAIL_VIEW on mount and saves to browse history for logged-in users
export function ExperienceTracker({
  experienceId,
  experienceTitle,
  country,
  city,
  causeCategories,
  image,
}: ExperienceTrackerProps) {
  const { user } = useAuth();

  useEffect(() => {
    AnalyticsEvents.EXPERIENCE_DETAIL_VIEW(experienceId, experienceTitle);

    // Save to browse history for logged-in users
    if (user?.uid) {
      const historyRef = doc(db, 'users', user.uid, 'browseHistory', experienceId);
      setDoc(historyRef, {
        experienceId,
        title: experienceTitle,
        country: country || '',
        city: city || '',
        causeCategories: causeCategories || [],
        image: image || '',
        viewedAt: serverTimestamp(),
      }).catch(() => {
        // Silently fail — browse history is non-critical
      });
    }
  }, [experienceId, experienceTitle, user?.uid]);

  return null;
}

interface BookingLinkProps {
  href: string;
  experienceId: string;
  experienceTitle: string;
  disabled?: boolean;
  children: React.ReactNode;
}

// Tracks BOOKING_START when the Apply Now button is clicked
export function BookingLink({ href, experienceId, experienceTitle, disabled, children }: BookingLinkProps) {
  const handleClick = () => {
    if (!disabled) {
      AnalyticsEvents.BOOKING_START(experienceId, experienceTitle);
    }
  };

  if (disabled) {
    return (
      <button
        disabled
        className="w-full text-center px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-semibold"
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={href} onClick={handleClick} className="w-full block">
      {children}
    </Link>
  );
}
