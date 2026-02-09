'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/hooks/useAuth';
import { Clock, CheckCircle, XCircle, Calendar, MapPin, User, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';

interface BookingWithDetails {
  id: string;
  experienceId: string;
  userId: string;
  status: string;
  appliedAt: Date;
  confirmedAt?: Date;
  rejectedAt?: Date;
  adminApprovedAt?: Date;
  adminRejectedAt?: Date;
  rejectionReason?: string;
  adminRejectionReason?: string;
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

export default function AdminBookingsPage() {
  const { user, firebaseUser } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (user && firebaseUser) {
      fetchBookings();
    }
  }, [user, firebaseUser, statusFilter]);

  const fetchBookings = async () => {
    if (!user || !firebaseUser) return;

    try {
      setLoading(true);
      const token = await firebaseUser.getIdToken();
      const url =
        statusFilter === 'all'
          ? '/api/admin/bookings'
          : `/api/admin/bookings?status=${statusFilter}`;

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending_admin' ? 'pending' : 'confirmed';
    const confirmMsg =
      currentStatus === 'pending_admin'
        ? 'Approve this application and pass to NGO for review?'
        : 'Approve this application and confirm booking?';

    if (!confirm(confirmMsg)) return;

    setApprovingId(bookingId);
    try {
      const token = await firebaseUser!.getIdToken();
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
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

  const handleReject = async (bookingId: string, currentStatus: string) => {
    const reason = prompt('Rejection reason (will be sent to volunteer):');
    if (reason === null) return; // User cancelled

    setRejectingId(bookingId);
    try {
      const token = await firebaseUser!.getIdToken();
      const reasonField =
        currentStatus === 'pending_admin' ? 'adminRejectionReason' : 'rejectionReason';

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'rejected',
          [reasonField]: reason,
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
    if (!confirm('Cancel this booking? All parties will be notified.')) return;

    setCancellingId(bookingId);
    try {
      const token = await firebaseUser!.getIdToken();
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
    } finally {
      setCancellingId(null);
    }
  };

  const exportToCSV = () => {
    // Create CSV headers
    const headers = [
      'Booking ID',
      'Status',
      'Applied Date',
      'Admin Approved Date',
      'Admin Rejected Date',
      'Confirmed Date',
      'Rejected Date',
      'Experience',
      'Experience Date',
      'Experience Location',
      'NGO',
      'Volunteer Name',
      'Email',
      'Country of Origin',
      'Rejection Reason (NGO)',
      'Rejection Reason (Admin)',
    ];

    // Create CSV rows
    const rows = bookings.map((booking) => [
      booking.id,
      booking.status,
      format(new Date(booking.appliedAt), 'dd/MM/yyyy HH:mm'),
      booking.adminApprovedAt ? format(new Date(booking.adminApprovedAt), 'dd/MM/yyyy HH:mm') : '',
      booking.adminRejectedAt ? format(new Date(booking.adminRejectedAt), 'dd/MM/yyyy HH:mm') : '',
      booking.confirmedAt ? format(new Date(booking.confirmedAt), 'dd/MM/yyyy HH:mm') : '',
      booking.rejectedAt ? format(new Date(booking.rejectedAt), 'dd/MM/yyyy HH:mm') : '',
      booking.experience.title,
      format(new Date(booking.experience.dates.start), 'dd/MM/yyyy'),
      `${booking.experience.city}, ${booking.experience.country}`,
      booking.ngo.name,
      booking.user.displayName,
      booking.user.email,
      booking.user.countryOfOrigin || '',
      booking.rejectionReason || '',
      booking.adminRejectionReason || '',
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
    link.setAttribute('download', `admin_bookings_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_admin':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Awaiting Admin</Badge>;
      case 'pending':
        return <Badge variant="warning">Awaiting NGO</Badge>;
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#4A4A4A] mb-2">All Bookings & Applications</h1>
            <p className="text-[#7A7A7A]">Manage all volunteer applications and bookings across the platform</p>
          </div>
          {bookings.length > 0 && (
            <Button onClick={exportToCSV} className="bg-white border-2 border-[#21B3B1] text-[#21B3B1] hover:bg-[#21B3B1] hover:text-white">
              <Download className="w-5 h-5 mr-2" />
              Export to CSV
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-[#7A7A7A]" />
              <div className="flex gap-2 flex-wrap">
                {['all', 'pending_admin', 'pending', 'confirmed', 'rejected', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-[#21B3B1] text-white'
                        : 'bg-gray-100 text-[#4A4A4A] hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all'
                      ? 'All'
                      : status === 'pending_admin'
                      ? 'Awaiting Admin'
                      : status === 'pending'
                      ? 'Awaiting NGO'
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#21B3B1] mx-auto"></div>
            <p className="mt-4 text-[#7A7A7A]">Loading bookings...</p>
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
              <h3 className="text-xl font-semibold text-[#4A4A4A] mb-2">No bookings found</h3>
              <p className="text-[#7A7A7A]">
                {statusFilter === 'all'
                  ? 'No bookings in the system yet.'
                  : `No bookings with status: ${statusFilter}`}
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
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Column 1: Experience Info */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-[#4A4A4A]">{booking.experience.title}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-[#7A7A7A]">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {booking.experience.city}, {booking.experience.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#7A7A7A]">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(booking.experience.dates.start), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-[#7A7A7A] mb-1">Organization</p>
                        <p className="text-sm font-medium text-[#4A4A4A]">{booking.ngo.name}</p>
                      </div>
                    </div>

                    {/* Column 2: Volunteer Info */}
                    <div>
                      <p className="text-xs font-medium text-[#7A7A7A] mb-2">Volunteer</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#7A7A7A]" />
                          <span className="text-sm font-medium text-[#4A4A4A]">{booking.user.displayName}</span>
                        </div>
                        <p className="text-sm text-[#7A7A7A]">{booking.user.email}</p>
                        {booking.user.countryOfOrigin && (
                          <p className="text-sm text-[#7A7A7A]">From: {booking.user.countryOfOrigin}</p>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-[#7A7A7A] mb-1">Applied</p>
                        <p className="text-sm text-[#4A4A4A]">
                          {format(new Date(booking.appliedAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>

                    {/* Column 3: Actions */}
                    <div className="flex flex-col justify-between">
                      {/* Status-specific messages */}
                      {booking.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <p className="text-xs font-medium text-red-900 mb-1">NGO Rejection Reason:</p>
                          <p className="text-sm text-red-800">{booking.rejectionReason}</p>
                        </div>
                      )}
                      {booking.adminRejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <p className="text-xs font-medium text-red-900 mb-1">Admin Rejection Reason:</p>
                          <p className="text-sm text-red-800">{booking.adminRejectionReason}</p>
                        </div>
                      )}

                      {/* Actions based on status */}
                      <div className="space-y-2">
                        {(booking.status === 'pending_admin' || booking.status === 'pending') && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(booking.id, booking.status)}
                              disabled={
                                approvingId === booking.id ||
                                rejectingId === booking.id ||
                                cancellingId === booking.id
                              }
                              className="w-full bg-[#6FB7A4] hover:bg-[#5ca58e] text-white border-[#6FB7A4]"
                            >
                              {approvingId === booking.id
                                ? 'Approving...'
                                : booking.status === 'pending_admin'
                                ? 'Approve & Pass to NGO'
                                : 'Approve & Confirm'}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReject(booking.id, booking.status)}
                              disabled={
                                approvingId === booking.id ||
                                rejectingId === booking.id ||
                                cancellingId === booking.id
                              }
                              className="w-full bg-red-500 hover:bg-red-600 text-white border-red-500"
                            >
                              {rejectingId === booking.id ? 'Rejecting...' : 'Reject'}
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white border-gray-500"
                          >
                            {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
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
    </DashboardLayout>
  );
}
