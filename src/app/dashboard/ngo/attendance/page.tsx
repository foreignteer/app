'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/hooks/useAuth';
import { Booking, AttendanceStatus } from '@/lib/types/booking';
import { Experience } from '@/lib/types/experience';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  MapPin,
  User,
} from 'lucide-react';
import { format } from 'date-fns';

interface BookingWithDetails extends Booking {
  user: {
    id: string;
    email: string;
    displayName: string;
    phone?: string;
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
}

export default function NGOAttendancePage() {
  const { user, firebaseUser } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);

  useEffect(() => {
    if (user && firebaseUser) {
      fetchBookings();
    }
  }, [user, firebaseUser]);

  const fetchBookings = async () => {
    if (!user || !firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/ngo/bookings?status=completed', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (bookingId: string, notes?: string) => {
    setCheckingInId(bookingId);

    try {
      if (!firebaseUser) throw new Error('Not authenticated');
      const token = await firebaseUser.getIdToken();

      const response = await fetch(`/api/bookings/${bookingId}/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: 'ngo',
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to check in');
      }

      const data = await response.json();
      alert(data.message);
      await fetchBookings();
    } catch (err: any) {
      console.error('Check-in error:', err);
      alert(err.message || 'Failed to check in. Please try again.');
    } finally {
      setCheckingInId(null);
    }
  };

  const getAttendanceBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Attendance Confirmed
          </Badge>
        );
      case 'volunteer_only':
        return (
          <Badge variant="warning" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            Awaiting Your Confirmation
          </Badge>
        );
      case 'ngo_only':
        return (
          <Badge variant="info" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            Waiting for Volunteer
          </Badge>
        );
      case 'disputed':
        return (
          <Badge variant="danger" size="sm">
            <AlertCircle className="w-3 h-3 mr-1" />
            Disputed
          </Badge>
        );
      default:
        return (
          <Badge variant="default" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            Pending Check-In
          </Badge>
        );
    }
  };

  // Filter bookings where experience has ended
  const endedBookings = bookings.filter((booking) => {
    const experienceEndDate = new Date(booking.experience.dates.end);
    return experienceEndDate < new Date();
  });

  // Group by status
  const pendingCheckIn = endedBookings.filter(
    (b) => !b.ngoCheckedIn && b.attendanceStatus !== 'confirmed'
  );
  const awaitingVolunteer = endedBookings.filter(
    (b) => b.ngoCheckedIn && b.attendanceStatus === 'ngo_only'
  );
  const confirmed = endedBookings.filter(
    (b) => b.attendanceStatus === 'confirmed'
  );

  return (
    <DashboardLayout requiredRole="ngo">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Attendance Tracking
          </h1>
          <p className="text-text-muted">
            Confirm volunteer attendance for completed experiences
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    Needs Your Confirmation
                  </p>
                  <p className="text-3xl font-bold text-[#F2B56B]">
                    {pendingCheckIn.length}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-[#F2B56B]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    Awaiting Volunteer
                  </p>
                  <p className="text-3xl font-bold text-[#8FA6A1]">
                    {awaitingVolunteer.length}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-[#8FA6A1]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">Confirmed</p>
                  <p className="text-3xl font-bold text-[#6FB7A4]">
                    {confirmed.length}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-[#6FB7A4]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading attendance records...</p>
          </div>
        ) : endedBookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No Completed Experiences Yet
              </h3>
              <p className="text-text-muted">
                Attendance tracking will appear here after your experiences have ended
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Pending Check-In Section */}
            {pendingCheckIn.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Needs Your Confirmation ({pendingCheckIn.length})
                </h2>
                <div className="space-y-4">
                  {pendingCheckIn.map((booking) => (
                    <Card key={booking.id} variant="elevated">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getAttendanceBadge(booking.attendanceStatus)}
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-1">
                              {booking.experience.title}
                            </h3>
                            <div className="space-y-1 text-sm text-text-muted">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{booking.user.displayName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  {booking.experience.city}, {booking.experience.country}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(
                                    new Date(booking.experience.dates.end),
                                    'MMM d, yyyy'
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {booking.volunteerCheckedIn && (
                          <div className="bg-[#C9F0EF] border border-[#21B3B1] rounded-lg p-3 mb-4">
                            <p className="text-sm text-[#4A4A4A]">
                              ✓ Volunteer checked in on{' '}
                              {format(
                                new Date(booking.volunteerCheckInTime!),
                                'MMM d, yyyy'
                              )}
                            </p>
                          </div>
                        )}

                        <Button
                          onClick={() => handleCheckIn(booking.id)}
                          isLoading={checkingInId === booking.id}
                          disabled={checkingInId === booking.id}
                          size="sm"
                          className="!bg-[#21B3B1] hover:!bg-[#168E8C] !text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Attendance
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Awaiting Volunteer Section */}
            {awaitingVolunteer.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Awaiting Volunteer Confirmation ({awaitingVolunteer.length})
                </h2>
                <div className="space-y-4">
                  {awaitingVolunteer.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getAttendanceBadge(booking.attendanceStatus)}
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-1">
                              {booking.experience.title}
                            </h3>
                            <div className="space-y-1 text-sm text-text-muted">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{booking.user.displayName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(
                                    new Date(booking.experience.dates.end),
                                    'MMM d, yyyy'
                                  )}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-[#7A7A7A] mt-2">
                              You checked in on{' '}
                              {format(
                                new Date(booking.ngoCheckInTime!),
                                'MMM d, yyyy'
                              )}
                              . Waiting for volunteer to confirm.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Confirmed Section */}
            {confirmed.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Confirmed Attendance ({confirmed.length})
                </h2>
                <div className="space-y-4">
                  {confirmed.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getAttendanceBadge(booking.attendanceStatus)}
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-1">
                              {booking.experience.title}
                            </h3>
                            <div className="space-y-1 text-sm text-text-muted">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{booking.user.displayName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(
                                    new Date(booking.experience.dates.end),
                                    'MMM d, yyyy'
                                  )}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-[#6FB7A4] mt-2">
                              ✓ Both parties confirmed attendance
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
