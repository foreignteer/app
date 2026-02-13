'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useBookings } from '@/lib/hooks/useBookings';
import { Booking } from '@/lib/types/booking';
import { Experience } from '@/lib/types/experience';
import { CheckInButton } from '@/components/bookings/CheckInButton';
import { ReviewModal } from '@/components/bookings/ReviewModal';
import {
  Calendar,
  MapPin,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Star,
} from 'lucide-react';
import { format } from 'date-fns';

function BookingsContent() {
  const searchParams = useSearchParams();
  const { bookings, loading, cancelBooking, refetch } = useBookings();
  const [experiences, setExperiences] = useState<
    Record<string, Experience | null>
  >({});
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<{
    bookingId: string;
    experienceTitle: string;
  } | null>(null);

  // Fetch experience details for each booking
  useEffect(() => {
    async function fetchExperiences() {
      const experienceIds = [
        ...new Set(bookings.map((b) => b.experienceId)),
      ];

      const fetchedExperiences: Record<string, Experience | null> = {};

      for (const id of experienceIds) {
        try {
          const response = await fetch(`/api/experiences/${id}`);
          if (response.ok) {
            const data = await response.json();
            fetchedExperiences[id] = data.experience;
          } else {
            fetchedExperiences[id] = null;
          }
        } catch (error) {
          console.error(`Error fetching experience ${id}:`, error);
          fetchedExperiences[id] = null;
        }
      }

      setExperiences(fetchedExperiences);
    }

    if (bookings.length > 0) {
      fetchExperiences();
    }
  }, [bookings]);

  // Handle URL parameter for auto-opening review modal
  useEffect(() => {
    const reviewParam = searchParams.get('review');
    if (reviewParam && bookings.length > 0 && Object.keys(experiences).length > 0) {
      const booking = bookings.find((b) => b.id === reviewParam);
      if (booking && booking.attendanceStatus === 'confirmed' && !booking.rating) {
        const experience = experiences[booking.experienceId];
        if (experience) {
          setSelectedBookingForReview({
            bookingId: booking.id,
            experienceTitle: experience.title,
          });
          setReviewModalOpen(true);
        }
      }
    }
  }, [searchParams, bookings, experiences]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleCheckIn = () => {
    // Refresh bookings after check-in
    refetch();
  };

  const handleOpenReviewModal = (bookingId: string, experienceTitle: string) => {
    setSelectedBookingForReview({ bookingId, experienceTitle });
    setReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    // Refresh bookings after review submission
    refetch();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="danger" size="sm">
            <X className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="info" size="sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  const activeBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            My Bookings
          </h1>
          <p className="text-text-muted">
            View and manage all your volunteering bookings
          </p>
        </div>

        {loading && bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading your bookings...</p>
          </div>
        ) : (
          <>
            {/* Active Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Active Bookings ({activeBookings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {activeBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <h3 className="font-semibold text-text-primary mb-2">
                      No Active Bookings
                    </h3>
                    <p className="text-text-muted">
                      You don't have any active bookings at the moment
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeBookings.map((booking) => {
                      const experience = experiences[booking.experienceId];
                      return (
                        <div
                          key={booking.id}
                          className="border border-gray-200 rounded-lg p-6 hover:border-primary transition-colors"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusBadge(booking.status)}
                              </div>
                              <Link href={`/experiences/${booking.experienceId}`}>
                                <h3 className="text-lg font-semibold text-text-primary mb-1 hover:text-primary transition-colors cursor-pointer">
                                  {experience?.title || 'Loading...'}
                                </h3>
                              </Link>
                              {experience && (
                                <div className="space-y-1 text-sm text-text-muted">
                                  <div className="flex items-center gap-2">
                                    <MapPin size={14} />
                                    <span>
                                      {experience.city}, {experience.country}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>
                                      {format(
                                        new Date(experience.dates.start),
                                        'MMM d'
                                      )}{' '}
                                      -{' '}
                                      {format(
                                        new Date(experience.dates.end),
                                        'MMM d, yyyy'
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <Link href={`/experiences/${booking.experienceId}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                >
                                  View Experience
                                </Button>
                              </Link>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                isLoading={cancellingId === booking.id}
                                disabled={cancellingId === booking.id}
                              >
                                Cancel Booking
                              </Button>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-xs text-text-muted mb-2">
                              Applied on{' '}
                              {format(
                                new Date(booking.appliedAt),
                                'MMM d, yyyy'
                              )}
                            </p>
                            {booking.confirmedAt && (
                              <p className="text-xs text-text-muted">
                                Confirmed on{' '}
                                {format(
                                  new Date(booking.confirmedAt),
                                  'MMM d, yyyy'
                                )}
                              </p>
                            )}
                          </div>

                          {booking.answers && (
                            <details className="mt-4">
                              <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary-dark">
                                View Application Details
                              </summary>
                              <div className="mt-3 pl-4 space-y-2 text-sm">
                                {Object.entries(booking.answers).map(
                                  ([key, value]) => (
                                    <div key={key}>
                                      <p className="font-medium text-text-primary capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                                      </p>
                                      <p className="text-text-muted">{value}</p>
                                    </div>
                                  )
                                )}
                              </div>
                            </details>
                          )}

                          {/* Status-specific messaging */}
                          {booking.status === 'pending' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                              <div className="flex items-start gap-2">
                                <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-yellow-900">
                                    Awaiting NGO Approval
                                  </p>
                                  <p className="text-xs text-yellow-800 mt-1">
                                    Your application is under review. The NGO will notify you once approved.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {booking.status === 'confirmed' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-green-900">
                                    Confirmed - You're All Set!
                                  </p>
                                  <p className="text-xs text-green-800 mt-1">
                                    Check your email for details and next steps.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {booking.status === 'rejected' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                              <div className="flex items-start gap-2">
                                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-red-900">
                                    Application Not Approved
                                  </p>
                                  {booking.rejectionReason && (
                                    <p className="text-xs text-red-800 mt-1">
                                      Reason: {booking.rejectionReason}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Past Bookings ({pastBookings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastBookings.map((booking) => {
                      const experience = experiences[booking.experienceId];
                      const experienceEndDate = experience?.dates?.end
                        ? new Date(experience.dates.end)
                        : new Date();
                      return (
                        <div
                          key={booking.id}
                          className="border border-gray-200 rounded-lg p-6"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusBadge(booking.status)}
                              </div>
                              <h3 className="text-lg font-semibold text-text-primary mb-1">
                                {experience?.title || 'Loading...'}
                              </h3>
                              {experience && (
                                <div className="space-y-1 text-sm text-text-muted">
                                  <div className="flex items-center gap-2">
                                    <MapPin size={14} />
                                    <span>
                                      {experience.city}, {experience.country}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>
                                      {format(
                                        new Date(experience.dates.start),
                                        'MMM d, yyyy'
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Check-in Section */}
                          {booking.status === 'completed' && experience && (
                            <div className="mb-4">
                              <CheckInButton
                                booking={booking}
                                experienceEndDate={experienceEndDate}
                                onCheckIn={handleCheckIn}
                              />
                            </div>
                          )}

                          {/* Review Section */}
                          {booking.attendanceStatus === 'confirmed' && (
                            <div className="mb-4">
                              {booking.rating ? (
                                <div className="bg-[#F6F9F9] border border-[#E6EAEA] rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`w-4 h-4 ${
                                            star <= (booking.rating || 0)
                                              ? 'fill-[#F6C98D] stroke-[#F6C98D]'
                                              : 'stroke-[#E6EAEA]'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm font-medium text-[#4A4A4A]">
                                      Your Review
                                    </span>
                                  </div>
                                  {booking.review && (
                                    <p className="text-sm text-[#7A7A7A] mt-2">
                                      {booking.review}
                                    </p>
                                  )}
                                  <p className="text-xs text-[#7A7A7A] mt-2">
                                    {booking.reviewApproved
                                      ? '✓ Published'
                                      : 'Pending moderation'}
                                  </p>
                                </div>
                              ) : (
                                <Button
                                  onClick={() =>
                                    handleOpenReviewModal(
                                      booking.id,
                                      experience?.title || 'Experience'
                                    )
                                  }
                                  size="sm"
                                  className="!bg-[#F6C98D] hover:!bg-[#F2B56B] !text-[#4A4A4A]"
                                >
                                  <Star className="w-4 h-4 mr-2" />
                                  Write a Review
                                </Button>
                              )}
                            </div>
                          )}

                          {booking.cancelledAt && (
                            <div className="mt-4 text-xs text-text-muted">
                              Cancelled on{' '}
                              {format(
                                new Date(booking.cancelledAt),
                                'MMM d, yyyy'
                              )}
                            </div>
                          )}
                          {booking.completedAt && (
                            <div className="mt-4 text-xs text-text-muted">
                              Completed on{' '}
                              {format(
                                new Date(booking.completedAt),
                                'MMM d, yyyy'
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedBookingForReview(null);
          }}
          bookingId={selectedBookingForReview.bookingId}
          experienceTitle={selectedBookingForReview.experienceTitle}
          onSuccess={handleReviewSuccess}
        />
      )}
    </DashboardLayout>
  );
}

export default function UserBookingsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout requiredRole="user">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading your bookings...</p>
          </div>
        </DashboardLayout>
      }
    >
      <BookingsContent />
    </Suspense>
  );
}
