'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/lib/hooks/useAuth';
import { useBookings } from '@/lib/hooks/useBookings';
import { Experience } from '@/lib/types/experience';
import { CheckCircle, Clock, X, AlertCircle } from 'lucide-react';
import { AnalyticsEvents } from '@/lib/analytics/tracker';

interface BookingFormProps {
  experience: Experience;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function BookingForm({
  experience,
  onClose,
  onSuccess,
}: BookingFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { createBooking, loading, error } = useBookings();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [success, setSuccess] = useState(false);
  const [dateWarning, setDateWarning] = useState<string | null>(null);

  const validateTravelDates = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) {
      setDateWarning(null);
      return;
    }

    const travelStart = new Date(startDate);
    const travelEnd = new Date(endDate);
    const experienceStart = new Date(experience.dates.start);
    const experienceEnd = new Date(experience.dates.end);

    // Check if travel dates overlap with experience dates
    const isStartBeforeExperience = travelEnd < experienceStart;
    const isEndAfterExperience = travelStart > experienceEnd;

    if (isStartBeforeExperience) {
      setDateWarning(`Your departure date is before the experience starts on ${experienceStart.toLocaleDateString()}.`);
    } else if (isEndAfterExperience) {
      setDateWarning(`Your arrival date is after the experience ends on ${experienceEnd.toLocaleDateString()}.`);
    } else if (travelStart > experienceStart) {
      setDateWarning(`Your arrival date is after the experience starts on ${experienceStart.toLocaleDateString()}. Please arrive before the experience begins.`);
    } else if (travelEnd < experienceEnd) {
      setDateWarning(`Your departure date is before the experience ends on ${experienceEnd.toLocaleDateString()}. Please stay until the experience ends.`);
    } else {
      setDateWarning(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate travel dates when they change
    if (name === 'travelStartDate' || name === 'travelEndDate') {
      const newStartDate = name === 'travelStartDate' ? value : formData.travelStartDate;
      const newEndDate = name === 'travelEndDate' ? value : formData.travelEndDate;
      validateTravelDates(newStartDate, newEndDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // Redirect to login with return URL
      router.push(`/login?returnUrl=/experiences/${experience.id}`);
      return;
    }

    try {
      const booking = await createBooking(experience.id, formData);
      setSuccess(true);

      // Track successful booking completion
      AnalyticsEvents.BOOKING_COMPLETE(
        booking?.id || '',
        experience.id,
        experience.totalFee || experience.platformServiceFee || 0,
        user.uid
      );

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard/user/bookings');
      }, 2000);
    } catch (err) {
      // Error is already handled in the hook
      console.error('Booking error:', err);
    }
  };

  if (success) {
    const isInstantConfirm = experience?.instantConfirmation === true;

    return (
      <div className="bg-white rounded-lg p-8">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isInstantConfirm ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            {isInstantConfirm ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <Clock className="w-10 h-10 text-yellow-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {isInstantConfirm
              ? 'Booking Confirmed!'
              : 'Application Submitted!'}
          </h2>
          <p className="text-text-muted mb-6">
            {isInstantConfirm
              ? `You have successfully booked "${experience.title}". Check your email for confirmation details.`
              : `Your application for "${experience.title}" has been submitted. The NGO will review and notify you once approved.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={() => router.push('/dashboard/user/bookings')}
            >
              View My Bookings
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/experiences')}
            >
              Browse More Experiences
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if experience is fully booked
  const isFullyBooked =
    (experience.currentBookings || 0) >= (experience.capacity || 0);

  if (isFullyBooked) {
    return (
      <div className="bg-white rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Experience Fully Booked
          </h2>
          <p className="text-text-muted mb-6">
            Unfortunately, this experience has reached its capacity. Please
            check back later or browse other experiences.
          </p>
          <Button
            variant="primary"
            onClick={() => router.push('/experiences')}
          >
            Browse More Experiences
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">
          Book This Experience
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!user && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium mb-2">Sign in required</p>
          <p className="text-sm">
            You need to be signed in to book this experience. Click "Book Now"
            below to sign in or create an account.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Experience Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-text-primary mb-2">
            {experience.title}
          </h3>
          <div className="text-sm text-text-muted space-y-1">
            <p>
              <span className="font-medium">Location:</span> {experience.city},{' '}
              {experience.country}
            </p>
            <p>
              <span className="font-medium">Dates:</span>{' '}
              {new Date(experience.dates.start).toLocaleDateString()} -{' '}
              {new Date(experience.dates.end).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Spots Available:</span>{' '}
              {(experience.capacity || 0) - (experience.currentBookings || 0)}{' '}
              / {experience.capacity}
            </p>
          </div>

          {/* Service Fee */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Total Fee</p>
                <p className="text-xs text-text-muted">Platform fee + Programme fee (if any)</p>
              </div>
              <p className="text-xl font-bold text-primary">
                £{experience.totalFee?.toFixed(2) || '15.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Travel Dates */}
        <div className="space-y-4">
          <h3 className="font-semibold text-text-primary">
            Travel Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="travelStartDate"
              name="travelStartDate"
              type="date"
              label="Arrival Date to City"
              value={formData.travelStartDate || ''}
              onChange={handleChange}
              required
            />
            <Input
              id="travelEndDate"
              name="travelEndDate"
              type="date"
              label="Departure Date from City"
              value={formData.travelEndDate || ''}
              onChange={handleChange}
              required
            />
          </div>
          <p className="text-xs text-text-muted">
            Please provide your travel dates to {experience.city}
          </p>
          {dateWarning && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">{dateWarning}</p>
            </div>
          )}
        </div>

        {/* Additional Questions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-text-primary">
            Tell Us About Yourself
          </h3>

          <Input
            id="motivation"
            name="motivation"
            label="Why are you interested in this experience?"
            placeholder="Share your motivation for applying..."
            value={formData.motivation || ''}
            onChange={handleChange}
            required
          />

          <Textarea
            id="skills"
            name="skills"
            label="Relevant Skills & Experience"
            placeholder="Tell us about any relevant skills or experience you have..."
            value={formData.skills || ''}
            onChange={handleChange}
            rows={4}
          />

          <Textarea
            id="expectations"
            name="expectations"
            label="What do you hope to gain from this experience?"
            placeholder="Share your expectations and goals..."
            value={formData.expectations || ''}
            onChange={handleChange}
            rows={3}
          />

          <Input
            id="dietaryRestrictions"
            name="dietaryRestrictions"
            label="Dietary Restrictions (if applicable)"
            placeholder="e.g., Vegetarian, Vegan, Allergies..."
            value={formData.dietaryRestrictions || ''}
            onChange={handleChange}
          />

          <Textarea
            id="additionalInfo"
            name="additionalInfo"
            label="Additional Information"
            placeholder="Any other information you'd like to share..."
            value={formData.additionalInfo || ''}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-text-muted">
            By booking this experience, you agree to our{' '}
            <a href="/terms" className="text-primary hover:text-primary-dark">
              Terms of Service
            </a>{' '}
            and confirm that the information provided is accurate. The NGO will
            contact you with further details after your booking is confirmed.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={loading}
            disabled={loading}
          >
            {user ? 'Confirm Booking' : 'Sign In to Book'}
          </Button>
          {onClose && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
