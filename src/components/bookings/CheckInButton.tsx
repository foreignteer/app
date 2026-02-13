'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Booking, AttendanceStatus } from '@/lib/types/booking';

interface CheckInButtonProps {
  booking: Booking;
  experienceEndDate: Date;
  onCheckIn: () => void;
}

export function CheckInButton({ booking, experienceEndDate, onCheckIn }: CheckInButtonProps) {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const hasExperienceEnded = experienceEndDate < new Date();
  const canCheckIn = hasExperienceEnded && booking.status === 'confirmed' && !booking.volunteerCheckedIn;

  const handleCheckIn = async () => {
    setChecking(true);
    setError('');

    try {
      const token = await fetch('/api/auth/token').then((r) => r.json()).then((d) => d.token);

      const response = await fetch(`/api/bookings/${booking.id}/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: 'volunteer',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to check in');
      }

      const data = await response.json();
      alert(data.message);
      onCheckIn(); // Refresh the bookings list
    } catch (err: any) {
      console.error('Check-in error:', err);
      setError(err.message || 'Failed to check in. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  // Show attendance status badge
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
          <Badge variant="info" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            Waiting for NGO Confirmation
          </Badge>
        );
      case 'ngo_only':
        return (
          <Badge variant="warning" size="sm">
            <AlertCircle className="w-3 h-3 mr-1" />
            Please Check In
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
        return null;
    }
  };

  if (!hasExperienceEnded) {
    return null;
  }

  if (booking.volunteerCheckedIn) {
    return (
      <div className="space-y-2">
        {getAttendanceBadge(booking.attendanceStatus)}
        {booking.attendanceStatus === 'volunteer_only' && (
          <p className="text-xs text-[#7A7A7A]">
            You checked in on {new Date(booking.volunteerCheckInTime!).toLocaleDateString()}.
            Waiting for the organisation to confirm.
          </p>
        )}
        {booking.attendanceStatus === 'confirmed' && (
          <p className="text-xs text-[#6FB7A4]">
            ✓ Both you and the organisation have confirmed attendance!
          </p>
        )}
      </div>
    );
  }

  if (canCheckIn) {
    return (
      <div className="space-y-2">
        {booking.ngoCheckedIn && getAttendanceBadge(booking.attendanceStatus)}
        <Button
          onClick={handleCheckIn}
          isLoading={checking}
          disabled={checking}
          size="sm"
          className="!bg-[#21B3B1] hover:!bg-[#168E8C] !text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Confirm Attendance
        </Button>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <p className="text-xs text-[#7A7A7A]">
          This experience has ended. Please confirm your attendance.
        </p>
      </div>
    );
  }

  return null;
}
