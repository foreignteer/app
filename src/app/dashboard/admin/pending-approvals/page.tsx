'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/hooks/useAuth';
import { Clock, CheckCircle, XCircle, Calendar, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';

interface BookingWithDetails {
  id: string;
  experienceId: string;
  userId: string;
  status: string;
  appliedAt: Date;
  user: {
    id: string;
    email: string;
    displayName: string;
    phone?: string;
    countryOfOrigin?: string;
  };
  experience: {
    id: string;
    title: string;
    city: string;
    country: string;
    dates: {
      start: Date;
      end: Date;
    };
  };
  ngo: {
    id: string;
    name: string;
    contactEmail: string;
  };
}

export default function AdminPendingApprovalsPage() {
  const { user, firebaseUser } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    if (user && firebaseUser) {
      fetchPendingBookings();
    }
  }, [user, firebaseUser]);

  const fetchPendingBookings = async () => {
    if (!user || !firebaseUser) return;

    try {
      setLoading(true);
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/admin/bookings?status=pending_admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending bookings');
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId: string) => {
    if (!confirm('Approve this application? It will be passed to the NGO for review.')) return;

    setApprovingId(bookingId);
    try {
      const token = await firebaseUser!.getIdToken();
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'pending' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to approve booking');
      }

      await fetchPendingBookings();
    } catch (err: any) {
      alert(err.message || 'Error approving booking');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (bookingId: string) => {
    const reason = prompt('Rejection reason (will be sent to volunteer):');
    if (reason === null) return; // User cancelled

    setRejectingId(bookingId);
    try {
      const token = await firebaseUser!.getIdToken();
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'rejected',
          adminRejectionReason: reason,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reject booking');
      }

      await fetchPendingBookings();
    } catch (err: any) {
      alert(err.message || 'Error rejecting booking');
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#4A4A4A] mb-2">
            Pending Admin Approvals
          </h1>
          <p className="text-[#7A7A7A]">
            Review applications that require admin vetting before NGO review
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#21B3B1] mx-auto"></div>
            <p className="mt-4 text-[#7A7A7A]">Loading pending approvals...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-[#6FB7A4] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#4A4A4A] mb-2">
                All Clear!
              </h3>
              <p className="text-[#7A7A7A]">
                No applications requiring admin approval at this time.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Bookings List */}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column - Experience & NGO Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">
                          {booking.experience.title}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-[#7A7A7A]">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {booking.experience.city}, {booking.experience.country}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[#7A7A7A]">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(new Date(booking.experience.dates.start), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-xs font-medium text-[#7A7A7A] mb-1">
                          Organization
                        </p>
                        <p className="text-sm font-semibold text-[#4A4A4A]">
                          {booking.ngo.name}
                        </p>
                        <p className="text-xs text-[#7A7A7A]">
                          {booking.ngo.contactEmail}
                        </p>
                      </div>
                    </div>

                    {/* Right Column - Volunteer Info */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-[#7A7A7A] mb-2">
                          Volunteer Information
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-[#7A7A7A]" />
                            <span className="text-sm font-medium text-[#4A4A4A]">
                              {booking.user.displayName}
                            </span>
                          </div>
                          <p className="text-sm text-[#7A7A7A]">{booking.user.email}</p>
                          {booking.user.phone && (
                            <p className="text-sm text-[#7A7A7A]">{booking.user.phone}</p>
                          )}
                          {booking.user.countryOfOrigin && (
                            <p className="text-sm text-[#7A7A7A]">
                              From: {booking.user.countryOfOrigin}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-xs font-medium text-[#7A7A7A] mb-1">
                          Applied
                        </p>
                        <p className="text-sm text-[#4A4A4A]">
                          {format(new Date(booking.appliedAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="border-t mt-6 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm font-medium text-[#4A4A4A]">
                          Awaiting Your Approval
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleReject(booking.id)}
                          disabled={approvingId === booking.id || rejectingId === booking.id}
                          className="bg-red-500 hover:bg-red-600 text-white border-red-500"
                        >
                          {rejectingId === booking.id ? 'Rejecting...' : 'Reject'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(booking.id)}
                          disabled={approvingId === booking.id || rejectingId === booking.id}
                          className="bg-[#6FB7A4] hover:bg-[#5ca58e] text-white border-[#6FB7A4]"
                        >
                          {approvingId === booking.id ? 'Approving...' : 'Approve & Pass to NGO'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
