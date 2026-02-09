import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Booking } from '../types/booking';

// Hook for managing bookings with Firebase authentication
export function useBookings(experienceId?: string) {
  const { user, firebaseUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && firebaseUser) {
      fetchBookings();
    }
  }, [user, firebaseUser, experienceId]);

  const fetchBookings = async () => {
    if (!firebaseUser) return;

    setLoading(true);
    setError(null);

    try {
      const token = await firebaseUser.getIdToken();
      const url = experienceId
        ? `/api/bookings?experienceId=${experienceId}`
        : '/api/bookings';

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

  const createBooking = async (
    experienceId: string,
    answers?: Record<string, any>
  ) => {
    if (!firebaseUser) {
      throw new Error('You must be logged in to book an experience');
    }

    setLoading(true);
    setError(null);

    try {
      const token = await firebaseUser.getIdToken();

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          experienceId,
          answers: answers || {},
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      // Refresh bookings list
      await fetchBookings();

      return data.booking;
    } catch (err) {
      console.error('Error creating booking:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!firebaseUser) {
      throw new Error('You must be logged in to cancel a booking');
    }

    setLoading(true);
    setError(null);

    try {
      const token = await firebaseUser.getIdToken();

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'cancelled',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel booking');
      }

      // Refresh bookings list
      await fetchBookings();

      return data.booking;
    } catch (err) {
      console.error('Error cancelling booking:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to cancel booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    cancelBooking,
    refetch: fetchBookings,
  };
}
