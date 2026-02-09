'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/hooks/useAuth';
import VolunteerProfileModal from '@/components/ngo/VolunteerProfileModal';
import {
  Users,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  UserCircle,
} from 'lucide-react';
import { format } from 'date-fns';

interface BookingWithDetails {
  id: string;
  experienceId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  answers?: Record<string, any>;
  appliedAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  completedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  travelStartDate?: string;
  travelEndDate?: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    phone?: string;
    countryOfOrigin?: string;
    volunteeringExperience?: string;
    jobTitle?: string;
    organisation?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
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

export default function NGOApplicantsPage() {
  const { user, firebaseUser } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterExperience, setFilterExperience] = useState<string>('all');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<BookingWithDetails['user'] | null>(null);
  const [selectedBookingAnswers, setSelectedBookingAnswers] = useState<Record<string, any>>({});
  const [previousBookings, setPreviousBookings] = useState<any[]>([]);
  const [loadingPreviousBookings, setLoadingPreviousBookings] = useState(false);

  useEffect(() => {
    if (user && firebaseUser) {
      fetchBookings();
    }
  }, [user, firebaseUser, filterStatus, filterExperience]);

  const fetchBookings = async () => {
    if (!user || !firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      let url = '/api/ngo/bookings';
      const params = new URLSearchParams();

      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      if (filterExperience !== 'all') {
        params.append('experienceId', filterExperience);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
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

  const handleApprove = async (bookingId: string) => {
    if (!confirm('Confirm approval for this volunteer?')) return;

    setApprovingId(bookingId);
    try {
      if (!firebaseUser) throw new Error('Not authenticated');
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'confirmed' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to approve booking');
      }

      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Error approving booking');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (bookingId: string) => {
    const reason = prompt('Optional rejection reason (will be sent to volunteer):');
    if (reason === null) return; // User cancelled

    setRejectingId(bookingId);
    try {
      if (!firebaseUser) throw new Error('Not authenticated');
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'rejected',
          ...(reason && { rejectionReason: reason }),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reject booking');
      }

      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Error rejecting booking');
    } finally {
      setRejectingId(null);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Cancel this booking? The volunteer will be notified.')) return;

    try {
      if (!firebaseUser) throw new Error('Not authenticated');
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel booking');
      }

      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Error cancelling booking');
    }
  };

  const handleVolunteerClick = async (volunteer: BookingWithDetails['user'], answers?: Record<string, any>) => {
    setSelectedVolunteer(volunteer);
    setSelectedBookingAnswers(answers || {});
    setLoadingPreviousBookings(true);
    setPreviousBookings([]);

    try {
      if (!firebaseUser) throw new Error('Not authenticated');
      const token = await firebaseUser.getIdToken();

      // Fetch all bookings for this volunteer with this NGO
      const response = await fetch(`/api/ngo/bookings?userId=${volunteer.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch previous bookings');
      }

      const data = await response.json();
      setPreviousBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching previous bookings:', err);
      setPreviousBookings([]);
    } finally {
      setLoadingPreviousBookings(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedVolunteer(null);
    setSelectedBookingAnswers({});
    setPreviousBookings([]);
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
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200" size="sm">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="danger" size="sm">
            <XCircle className="w-3 h-3 mr-1" />
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

  const exportToCSV = () => {
    // Create CSV headers
    const headers = [
      'Booking ID',
      'Status',
      'Applied Date',
      'Experience',
      'Experience Date',
      'Volunteer Name',
      'Email',
      'Phone',
      'Country of Origin',
      'Job Title',
      'Organisation',
      'Volunteering Experience',
      'Travel Start Date',
      'Travel End Date',
      'Emergency Contact Name',
      'Emergency Contact Phone',
      'Emergency Contact Relationship',
    ];

    // Create CSV rows
    const rows = bookings.map((booking) => [
      booking.id,
      booking.status,
      format(new Date(booking.appliedAt), 'dd/MM/yyyy'),
      booking.experience.title,
      format(new Date(booking.experience.dates.start), 'dd/MM/yyyy'),
      booking.user.displayName,
      booking.user.email,
      booking.user.phone || '',
      booking.user.countryOfOrigin || '',
      booking.user.jobTitle || '',
      booking.user.organisation || '',
      booking.user.volunteeringExperience || '',
      booking.travelStartDate || '',
      booking.travelEndDate || '',
      booking.user.emergencyContact?.name || '',
      booking.user.emergencyContact?.phone || '',
      booking.user.emergencyContact?.relationship || '',
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applicants_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueExperiences = Array.from(
    new Set(bookings.map((b) => JSON.stringify({ id: b.experience.id, title: b.experience.title })))
  ).map((str) => JSON.parse(str));

  return (
    <DashboardLayout requiredRole="ngo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Applicants & Bookings
            </h1>
            <p className="text-text-muted">
              Manage volunteers who have applied to your experiences
            </p>
          </div>
          {bookings.length > 0 && (
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-5 h-5 mr-2" />
              Export to CSV
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Filter by Experience
                </label>
                <select
                  value={filterExperience}
                  onChange={(e) => setFilterExperience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Experiences</option>
                  {uniqueExperiences.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading applicants...</p>
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No Applicants Yet
              </h3>
              <p className="text-text-muted">
                When volunteers apply to your experiences, they will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(booking.status)}
                        <span className="text-sm text-text-muted">
                          Applied {format(new Date(booking.appliedAt), 'dd MMM yyyy')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleVolunteerClick(booking.user, booking.answers)}
                        className="flex items-center gap-2 text-xl font-semibold text-[#21B3B1] hover:text-[#168E8C] transition-colors group"
                      >
                        <UserCircle className="w-6 h-6" />
                        {booking.user.displayName}
                        <span className="text-xs text-[#7A7A7A] font-normal group-hover:text-[#168E8C]">
                          (View Profile)
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Volunteer Information - Basic */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-text-primary mb-3">
                        Contact Information
                      </h4>

                      {booking.user.phone && (
                        <div className="flex items-start gap-2 text-sm">
                          <Phone className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-text-muted">Phone</p>
                            <p className="text-text-primary">{booking.user.phone}</p>
                          </div>
                        </div>
                      )}

                      {booking.user.countryOfOrigin && (
                        <div className="flex items-start gap-2 text-sm">
                          <Globe className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-text-muted">Country of Origin</p>
                            <p className="text-text-primary">{booking.user.countryOfOrigin}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Experience & Travel Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-text-primary mb-3">
                        Experience Details
                      </h4>

                      <div className="text-sm">
                        <p className="text-text-muted mb-1">Experience</p>
                        <p className="text-text-primary font-medium">{booking.experience.title}</p>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-text-muted">Location</p>
                          <p className="text-text-primary">
                            {booking.experience.city}, {booking.experience.country}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-text-muted">Experience Date</p>
                          <p className="text-text-primary">
                            {format(new Date(booking.experience.dates.start), 'dd MMM yyyy, HH:mm')}
                          </p>
                        </div>
                      </div>

                      {(booking.travelStartDate || booking.travelEndDate) && (
                        <div className="text-sm pt-2 border-t">
                          <p className="text-text-muted mb-1">Travel Dates</p>
                          {booking.travelStartDate && (
                            <p className="text-text-primary">
                              Arrival: {format(new Date(booking.travelStartDate), 'dd MMM yyyy')}
                            </p>
                          )}
                          {booking.travelEndDate && (
                            <p className="text-text-primary">
                              Departure: {format(new Date(booking.travelEndDate), 'dd MMM yyyy')}
                            </p>
                          )}
                        </div>
                      )}

                      {booking.answers && Object.keys(booking.answers).length > 0 && (
                        <div className="text-sm pt-2 border-t">
                          <p className="text-text-muted mb-2">Additional Answers</p>
                          {Object.entries(booking.answers).map(([key, value]) => (
                            <div key={key} className="mb-2">
                              <p className="text-text-muted text-xs">{key}</p>
                              <p className="text-text-primary">{String(value)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Approval Actions - Only show for pending bookings */}
                  {booking.status === 'pending' && (
                    <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-[#7A7A7A]">
                          This application is awaiting your review
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(booking.id)}
                            disabled={approvingId === booking.id || rejectingId === booking.id}
                            className="bg-[#6FB7A4] hover:bg-[#5ca58e] text-white border-[#6FB7A4]"
                          >
                            {approvingId === booking.id ? 'Approving...' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReject(booking.id)}
                            disabled={approvingId === booking.id || rejectingId === booking.id}
                            className="bg-red-500 hover:bg-red-600 text-white border-red-500"
                          >
                            {rejectingId === booking.id ? 'Rejecting...' : 'Reject'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cancel Action - Show for confirmed bookings */}
                  {booking.status === 'confirmed' && (
                    <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-[#7A7A7A]">
                          This booking is confirmed
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                          className="bg-gray-500 hover:bg-gray-600 text-white border-gray-500"
                        >
                          Cancel Booking
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Show rejection reason if booking was rejected */}
                  {booking.status === 'rejected' && booking.rejectionReason && (
                    <div className="md:col-span-2 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-900">
                        <strong>Rejection reason:</strong> {booking.rejectionReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Volunteer Profile Modal */}
        {selectedVolunteer && (
          <VolunteerProfileModal
            isOpen={true}
            onClose={handleCloseModal}
            volunteer={selectedVolunteer}
            currentBookingAnswers={selectedBookingAnswers}
            previousBookings={previousBookings.map((b) => ({
              id: b.id,
              experienceTitle: b.experience.title,
              experienceDate: b.experience.dates.start,
              status: b.status,
              appliedAt: b.appliedAt,
            }))}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
