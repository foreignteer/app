'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/hooks/useAuth';
import VolunteerProfileModal from '@/components/ngo/VolunteerProfileModal';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  UserCircle,
  Edit,
} from 'lucide-react';
import { format } from 'date-fns';

interface BookingWithDetails {
  id: string;
  experienceId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected' | 'pending_admin';
  answers?: Record<string, any>;
  appliedAt: Date;
  confirmedAt?: Date;
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
    jobTitle?: string;
    organisation?: string;
    volunteeringExperience?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
}

interface Experience {
  id: string;
  title: string;
  city: string;
  country: string;
  dates: {
    start: Date;
    end: Date;
  };
  capacity: number;
  currentBookings: number;
  status: string;
}

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, firebaseUser } = useAuth();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<BookingWithDetails['user'] | null>(null);
  const [selectedBookingAnswers, setSelectedBookingAnswers] = useState<Record<string, any>>({});
  const [previousBookings, setPreviousBookings] = useState<any[]>([]);
  const [loadingPreviousBookings, setLoadingPreviousBookings] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user && firebaseUser && id) {
      fetchExperienceAndBookings();
    }
  }, [user, firebaseUser, id]);

  const fetchExperienceAndBookings = async () => {
    if (!user || !firebaseUser) return;

    try {
      setLoading(true);
      const token = await firebaseUser.getIdToken();

      // Fetch experience details
      const expResponse = await fetch(`/api/ngo/experiences/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!expResponse.ok) {
        throw new Error('Failed to fetch experience');
      }

      const expData = await expResponse.json();
      setExperience(expData.experience);

      // Fetch bookings for this experience
      const bookingsResponse = await fetch(`/api/ngo/bookings?experienceId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!bookingsResponse.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const bookingsData = await bookingsResponse.json();
      setBookings(bookingsData.bookings || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId: string) => {
    if (!confirm('Approve this application?')) return;

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

      await fetchExperienceAndBookings();
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

      await fetchExperienceAndBookings();
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

      await fetchExperienceAndBookings();
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

      if (response.ok) {
        const data = await response.json();
        setPreviousBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching previous bookings:', err);
    } finally {
      setLoadingPreviousBookings(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedVolunteer(null);
    setSelectedBookingAnswers({});
    setPreviousBookings([]);
  };

  const exportToCSV = () => {
    const filteredBookings = statusFilter === 'all'
      ? bookings
      : bookings.filter(b => b.status === statusFilter);

    // Create CSV headers
    const headers = [
      'Booking ID',
      'Status',
      'Applied Date',
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
    const rows = filteredBookings.map((booking) => [
      booking.id,
      booking.status,
      format(new Date(booking.appliedAt), 'dd/MM/yyyy'),
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
    const fileName = experience
      ? `${experience.title.replace(/[^a-z0-9]/gi, '_')}_applicants_${format(new Date(), 'yyyy-MM-dd')}.csv`
      : `experience_applicants_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'pending_admin':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Awaiting Admin</Badge>;
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === statusFilter);

  return (
    <DashboardLayout requiredRole="ngo">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/dashboard/ngo/experiences"
            className="inline-flex items-center text-[#21B3B1] hover:text-[#168E8C] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Experiences
          </Link>

          {experience && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#4A4A4A] mb-2">
                  {experience.title}
                </h1>
                <div className="flex items-center gap-4 text-[#7A7A7A]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{experience.city}, {experience.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(experience.dates.start), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{experience.currentBookings} / {experience.capacity} spots filled</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {bookings.length > 0 && (
                  <Button onClick={exportToCSV} className="bg-white border-2 border-[#21B3B1] text-[#21B3B1] hover:bg-[#21B3B1] hover:text-white">
                    <Download className="w-5 h-5 mr-2" />
                    Export to CSV
                  </Button>
                )}
                <Link href={`/dashboard/ngo/experiences/${id}/edit`}>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Experience
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Status Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All' },
                { value: 'pending_admin', label: 'Awaiting Admin' },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'cancelled', label: 'Cancelled' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === filter.value
                      ? 'bg-[#21B3B1] text-white'
                      : 'bg-gray-100 text-[#4A4A4A] hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({filter.value === 'all' ? bookings.length : bookings.filter(b => b.status === filter.value).length})
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#21B3B1] mx-auto"></div>
            <p className="mt-4 text-[#7A7A7A]">Loading applicants...</p>
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
        {!loading && !error && filteredBookings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-[#8FA6A1] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#4A4A4A] mb-2">No applicants yet</h3>
              <p className="text-[#7A7A7A]">
                {statusFilter === 'all'
                  ? 'Applications will appear here once volunteers start applying to this experience.'
                  : `No applications with status: ${statusFilter}`}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Applicants List */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Volunteer Info */}
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <UserCircle className="w-10 h-10 text-[#21B3B1]" />
                          <div>
                            <h3 className="text-lg font-semibold text-[#4A4A4A]">
                              {booking.user.displayName}
                            </h3>
                            <p className="text-sm text-[#7A7A7A]">{booking.user.email}</p>
                          </div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>

                      <div className="space-y-2 text-sm">
                        {booking.user.phone && (
                          <p className="text-[#7A7A7A]">
                            <strong>Phone:</strong> {booking.user.phone}
                          </p>
                        )}
                        {booking.user.countryOfOrigin && (
                          <p className="text-[#7A7A7A]">
                            <strong>From:</strong> {booking.user.countryOfOrigin}
                          </p>
                        )}
                        <p className="text-[#7A7A7A]">
                          <strong>Applied:</strong> {format(new Date(booking.appliedAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVolunteerClick(booking.user, booking.answers)}
                        className="mt-4 text-[#21B3B1] hover:text-[#168E8C]"
                      >
                        View Full Profile
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-between">
                      {/* Rejection Reason */}
                      {booking.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <p className="text-xs font-medium text-red-900 mb-1">Rejection Reason:</p>
                          <p className="text-sm text-red-800">{booking.rejectionReason}</p>
                        </div>
                      )}

                      {/* Status-specific Actions */}
                      <div className="space-y-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(booking.id)}
                              disabled={approvingId === booking.id || rejectingId === booking.id}
                              className="w-full bg-[#6FB7A4] hover:bg-[#5ca58e] text-white border-[#6FB7A4]"
                            >
                              {approvingId === booking.id ? 'Approving...' : 'Approve'}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReject(booking.id)}
                              disabled={approvingId === booking.id || rejectingId === booking.id}
                              className="w-full bg-red-500 hover:bg-red-600 text-white border-red-500"
                            >
                              {rejectingId === booking.id ? 'Rejecting...' : 'Reject'}
                            </Button>
                          </>
                        )}

                        {booking.status === 'pending_admin' && (
                          <div className="text-center text-sm text-[#7A7A7A] py-4">
                            Awaiting admin approval before you can review
                          </div>
                        )}

                        {booking.status === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => handleCancel(booking.id)}
                            className="w-full !bg-gray-500 hover:!bg-gray-600 !text-white !border-gray-500"
                          >
                            Cancel Booking
                          </Button>
                        )}

                        {(booking.status === 'rejected' || booking.status === 'cancelled' || booking.status === 'completed') && (
                          <div className="text-center text-sm text-[#7A7A7A] py-2">
                            No actions available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Volunteer Profile Modal */}
      {selectedVolunteer && (
        <VolunteerProfileModal
          isOpen={true}
          onClose={handleCloseModal}
          volunteer={selectedVolunteer}
          currentBookingAnswers={selectedBookingAnswers}
          previousBookings={previousBookings.map((b: any) => ({
            id: b.id,
            experienceTitle: b.experience.title,
            experienceDate: b.experience.dates.start,
            status: b.status,
            appliedAt: b.appliedAt,
          }))}
        />
      )}
    </DashboardLayout>
  );
}
