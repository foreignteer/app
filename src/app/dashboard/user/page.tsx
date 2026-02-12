'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useBookings } from '@/lib/hooks/useBookings';
import { useAuth } from '@/lib/hooks/useAuth';
import { Calendar, MapPin, Users, ArrowRight, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import { Experience } from '@/lib/types/experience';

export default function UserDashboard() {
  const { user } = useAuth();
  const { bookings, loading } = useBookings();
  const [userName, setUserName] = useState('');
  const [experiences, setExperiences] = useState<Record<string, Experience | null>>({});

  useEffect(() => {
    if (user) {
      setUserName(user.displayName || user.email || 'User');
    }
  }, [user]);

  // Fetch experience details for each booking
  useEffect(() => {
    async function fetchExperiences() {
      const experienceIds = [...new Set(bookings.map((b) => b.experienceId))];
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

  const activeBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  );
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-text-muted">
            Manage your volunteering experiences and bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">Active Bookings</p>
                  <p className="text-3xl font-bold text-primary">
                    {activeBookings.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {completedBookings.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-text-primary">
                    {bookings.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent-dark" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Experiences</CardTitle>
            <Link href="/dashboard/user/bookings">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-text-muted text-sm">Loading bookings...</p>
              </div>
            ) : activeBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="font-semibold text-text-primary mb-2">
                  No Upcoming Experiences
                </h3>
                <p className="text-text-muted mb-4">
                  Start making a difference by booking your first volunteering
                  experience
                </p>
                <Link href="/experiences">
                  <Button>Browse Experiences</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              booking.status === 'confirmed'
                                ? 'success'
                                : 'warning'
                            }
                            size="sm"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-text-primary mb-1">
                          {experiences[booking.experienceId]?.title || `Experience #${booking.experienceId.slice(0, 8)}`}
                        </h4>
                        {experiences[booking.experienceId] && (
                          <p className="text-sm text-text-muted mb-1">
                            {format(new Date(experiences[booking.experienceId]!.dates.start), 'MMM d, yyyy')}
                          </p>
                        )}
                        <p className="text-sm text-text-muted">
                          Applied on{' '}
                          {format(new Date(booking.appliedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Link href="/dashboard/user/bookings">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary mb-2">
                    Explore New Experiences
                  </h3>
                  <p className="text-sm text-text-muted mb-4">
                    Discover meaningful volunteering opportunities around the
                    world
                  </p>
                  <Link href="/experiences">
                    <Button variant="outline" size="sm">
                      Browse Experiences
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-accent-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary mb-2">
                    Update Your Profile
                  </h3>
                  <p className="text-sm text-text-muted mb-4">
                    Keep your information up to date for better matching
                  </p>
                  <Link href="/dashboard/user/profile">
                    <Button variant="outline" size="sm">
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#21B3B1]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#21B3B1]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary mb-2">
                    Need Help?
                  </h3>
                  <p className="text-sm text-text-muted mb-4">
                    Have questions about your bookings or volunteering? Our support team is here to help.
                  </p>
                  <a href="mailto:volunteer@foreignteer.com">
                    <Button variant="outline" size="sm">
                      Contact Support
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
