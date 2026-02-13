'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loader2, CheckCircle, XCircle, Star, User, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewBooking {
  id: string;
  userId: string;
  experienceId: string;
  rating: number;
  review: string;
  reviewSubmittedAt: Date;
  reviewApproved: boolean;
  reviewRejectionReason?: string;
  user: {
    displayName: string;
    email: string;
  };
  experience: {
    title: string;
    city: string;
    country: string;
    dates: {
      start: Date;
      end: Date;
    };
  };
}

export default function AdminReviewsPage() {
  const { firebaseUser } = useAuth();
  const [reviews, setReviews] = useState<ReviewBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError('');

    try {
      if (!firebaseUser) {
        throw new Error('Not authenticated');
      }

      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/admin/reviews', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews);
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId: string) => {
    if (!confirm('Approve this review for public display?')) return;

    setProcessingId(bookingId);

    try {
      if (!firebaseUser) throw new Error('Not authenticated');

      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/admin/reviews/${bookingId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to approve review');
      }

      await fetchReviews();
      alert('Review approved successfully!');
    } catch (err: any) {
      alert(err.message || 'Error approving review');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (bookingId: string) => {
    const reason = prompt('Rejection reason (will be sent to the volunteer):');
    if (reason === null) return; // User cancelled

    setProcessingId(bookingId);

    try {
      if (!firebaseUser) throw new Error('Not authenticated');

      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/admin/reviews/${bookingId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: reason || 'Does not meet community guidelines',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reject review');
      }

      await fetchReviews();
      alert('Review rejected.');
    } catch (err: any) {
      alert(err.message || 'Error rejecting review');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filterStatus === 'pending') return !review.reviewApproved && !review.reviewRejectionReason;
    if (filterStatus === 'approved') return review.reviewApproved;
    if (filterStatus === 'rejected') return !!review.reviewRejectionReason;
    return true;
  });

  const getStatusBadge = (review: ReviewBooking) => {
    if (review.reviewRejectionReason) {
      return (
        <Badge variant="danger" size="sm">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    }
    if (review.reviewApproved) {
      return (
        <Badge variant="success" size="sm">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    }
    return (
      <Badge variant="warning" size="sm">
        <Star className="w-3 h-3 mr-1" />
        Pending Review
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#4A4A4A] mb-2">Review Moderation</h1>
          <p className="text-[#7A7A7A]">
            Moderate volunteer reviews before they're published on the platform
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All ({reviews.length})
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
              >
                Pending (
                {reviews.filter((r) => !r.reviewApproved && !r.reviewRejectionReason).length})
              </Button>
              <Button
                variant={filterStatus === 'approved' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('approved')}
              >
                Approved ({reviews.filter((r) => r.reviewApproved).length})
              </Button>
              <Button
                variant={filterStatus === 'rejected' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('rejected')}
              >
                Rejected ({reviews.filter((r) => !!r.reviewRejectionReason).length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-[#21B3B1] mx-auto mb-4" />
            <p className="text-[#7A7A7A]">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Star className="w-16 h-16 text-[#7A7A7A] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#4A4A4A] mb-2">
                No Reviews {filterStatus !== 'all' && `(${filterStatus})`}
              </h3>
              <p className="text-[#7A7A7A]">
                {filterStatus === 'pending'
                  ? 'All reviews have been moderated'
                  : 'Reviews will appear here once volunteers submit them'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id} variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(review)}
                        <span className="text-sm text-[#7A7A7A]">
                          Submitted {format(new Date(review.reviewSubmittedAt), 'dd MMM yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Review Content */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-[#4A4A4A] mb-3">Review</h4>

                      {/* Star Rating */}
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= review.rating
                                ? 'fill-[#F6C98D] stroke-[#F6C98D]'
                                : 'stroke-[#E6EAEA]'
                            }`}
                          />
                        ))}
                        <span className="text-sm font-medium text-[#4A4A4A] ml-1">
                          {review.rating} / 5
                        </span>
                      </div>

                      {/* Review Text */}
                      <div className="bg-[#FAF5EC] border border-[#E6EAEA] rounded-lg p-4">
                        <p className="text-[#4A4A4A] text-sm leading-relaxed whitespace-pre-wrap">
                          {review.review}
                        </p>
                      </div>

                      {/* Volunteer Info */}
                      <div className="pt-3 border-t border-[#E6EAEA]">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-[#7A7A7A]" />
                          <div>
                            <p className="text-[#4A4A4A] font-medium">
                              {review.user.displayName}
                            </p>
                            <p className="text-[#7A7A7A] text-xs">{review.user.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Experience Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-[#4A4A4A] mb-3">Experience Details</h4>

                      <div className="text-sm">
                        <p className="text-[#7A7A7A] mb-1">Experience</p>
                        <p className="text-[#4A4A4A] font-medium">{review.experience.title}</p>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-[#7A7A7A] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[#7A7A7A]">Location</p>
                          <p className="text-[#4A4A4A]">
                            {review.experience.city}, {review.experience.country}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-[#7A7A7A] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[#7A7A7A]">Experience Date</p>
                          <p className="text-[#4A4A4A]">
                            {format(new Date(review.experience.dates.start), 'dd MMM yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {review.reviewRejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-red-900">
                        <strong>Rejection reason:</strong> {review.reviewRejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons - Only for pending reviews */}
                  {!review.reviewApproved && !review.reviewRejectionReason && (
                    <div className="border-t border-[#E6EAEA] pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-[#7A7A7A]">
                          Review this submission before it's published
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                            disabled={processingId === review.id}
                            className="bg-[#6FB7A4] hover:bg-[#5ca58e] text-white border-[#6FB7A4]"
                          >
                            {processingId === review.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReject(review.id)}
                            disabled={processingId === review.id}
                            className="bg-red-500 hover:bg-red-600 text-white border-red-500"
                          >
                            {processingId === review.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
