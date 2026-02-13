'use client';

import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  experienceTitle: string;
  onSuccess: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  bookingId,
  experienceTitle,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = await fetch('/api/auth/token').then((r) => r.json()).then((d) => d.token);

      const response = await fetch(`/api/bookings/${bookingId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          review: review.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      const data = await response.json();
      alert(data.message);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Review submission error:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#21B3B1] to-[#168E8C] text-white p-6 rounded-t-xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Share Your Experience</h2>
            <p className="text-white/90 text-sm">{experienceTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-lg font-semibold text-[#4A4A4A] mb-3">
              How was your experience?
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating)
                        ? 'fill-[#F6C98D] stroke-[#F6C98D]'
                        : 'stroke-[#E6EAEA]'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-[#4A4A4A] font-medium">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-lg font-semibold text-[#4A4A4A] mb-2">
              Share your story (optional)
            </label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you enjoy most? What impact did you make? Any tips for future volunteers?"
              rows={6}
              className="w-full"
            />
            <p className="text-xs text-[#7A7A7A] mt-1">
              Your review will be publicly visible after moderation to help other volunteers find great opportunities.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-[#E6EAEA]">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              disabled={submitting || rating === 0}
              className="!bg-[#21B3B1] hover:!bg-[#168E8C] !text-white"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
