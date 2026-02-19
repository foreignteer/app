'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BookingForm from '@/components/experiences/BookingForm';
import { Experience } from '@/lib/types/experience';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AnalyticsEvents } from '@/lib/analytics/tracker';

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params);
  const dateParam = searchParams.get('date');
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperience() {
      try {
        const url = dateParam
          ? `/api/experiences/${id}?date=${dateParam}`
          : `/api/experiences/${id}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Experience not found');
        }

        const data = await response.json();
        setExperience(data.experience);
        // Track booking flow entry
        if (data.experience) {
          AnalyticsEvents.BOOKING_PAYMENT_START(
            data.experience.id,
            data.experience.totalFee || data.experience.platformServiceFee || 0
          );
        }
      } catch (err) {
        console.error('Error fetching experience:', err);
        setError('Failed to load experience');
      } finally {
        setLoading(false);
      }
    }

    fetchExperience();
  }, [id, dateParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-muted">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Experience not found'}</p>
          <Link
            href="/experiences"
            className="text-primary hover:text-primary-dark"
          >
            ← Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  const backUrl = dateParam
    ? `/experiences/${id}?date=${dateParam}`
    : `/experiences/${id}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href={backUrl}
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Experience</span>
        </Link>

        {/* Booking Form */}
        <BookingForm
          experience={experience}
          onClose={() => router.push(backUrl)}
        />
      </div>
    </div>
  );
}
