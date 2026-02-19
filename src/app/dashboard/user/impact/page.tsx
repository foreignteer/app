'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Clock,
  Globe,
  Heart,
  Award,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { format } from 'date-fns';

interface UserAnalytics {
  stats: {
    totalExperiences: number;
    totalHours: number;
    countriesVisited: number;
    causesSupported: number;
    upcomingCount: number;
    totalBookings: number;
  };
  activityHistory: {
    bookingId: string;
    experienceId: string;
    experienceTitle: string;
    country: string;
    city: string;
    causeCategories: string[];
    durationHours: number;
    completedAt: any;
    rating?: number;
    review?: string;
  }[];
  upcomingExperiences: {
    bookingId: string;
    experienceId: string;
    experienceTitle: string;
    country: string;
    city: string;
    causeCategories: string[];
    durationHours: number;
    startDate: any;
    status: string;
  }[];
  causesBreakdown: Record<string, number>;
  countriesList: string[];
  causesList: string[];
}

const CAUSE_COLORS: Record<string, string> = {
  'Education': '#21B3B1',
  'Environment': '#6FB7A4',
  'Healthcare': '#F2B56B',
  'Community Development': '#F6C98D',
  'Wildlife Conservation': '#8FA6A1',
  'Women Empowerment': '#C9F0EF',
  'Children & Youth': '#21B3B1',
  'Elderly Care': '#FAF5EC',
};

function getCauseColor(cause: string): string {
  return CAUSE_COLORS[cause] || '#21B3B1';
}

export default function UserImpactPage() {
  const { firebaseUser } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!firebaseUser) return;
      try {
        const token = await firebaseUser.getIdToken();
        const response = await fetch('/api/user/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to load analytics');
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load your impact data');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [firebaseUser]);

  const formatDate = (dateValue: any): string => {
    if (!dateValue) return 'Unknown date';
    try {
      const date = dateValue?.toDate ? dateValue.toDate() : new Date(dateValue);
      return format(date, 'MMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="user">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#21B3B1] mx-auto mb-4"></div>
            <p className="text-[#7A7A7A]">Loading your impact data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout requiredRole="user">
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  const stats = analytics?.stats;
  const hasActivity = (stats?.totalExperiences || 0) > 0;

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#4A4A4A] mb-2">My Impact</h1>
          <p className="text-[#7A7A7A]">
            Track your volunteering journey and the difference you've made
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#21B3B1]/10 rounded-full flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-[#21B3B1]" />
                </div>
                <p className="text-3xl font-bold text-[#21B3B1] mb-1">
                  {stats?.totalExperiences || 0}
                </p>
                <p className="text-sm text-[#7A7A7A]">Experiences Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#6FB7A4]/20 rounded-full flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-[#6FB7A4]" />
                </div>
                <p className="text-3xl font-bold text-[#6FB7A4] mb-1">
                  {stats?.totalHours || 0}
                </p>
                <p className="text-sm text-[#7A7A7A]">Hours Volunteered</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#F6C98D]/30 rounded-full flex items-center justify-center mb-3">
                  <Globe className="w-6 h-6 text-[#F2B56B]" />
                </div>
                <p className="text-3xl font-bold text-[#F2B56B] mb-1">
                  {stats?.countriesVisited || 0}
                </p>
                <p className="text-sm text-[#7A7A7A]">Countries Visited</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#C9F0EF] rounded-full flex items-center justify-center mb-3">
                  <Heart className="w-6 h-6 text-[#21B3B1]" />
                </div>
                <p className="text-3xl font-bold text-[#21B3B1] mb-1">
                  {stats?.causesSupported || 0}
                </p>
                <p className="text-sm text-[#7A7A7A]">Causes Supported</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {!hasActivity && (
          <Card>
            <CardContent className="py-16 text-center">
              <TrendingUp className="w-16 h-16 text-[#E6EAEA] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#4A4A4A] mb-3">
                Your Impact Journey Starts Here
              </h3>
              <p className="text-[#7A7A7A] mb-6 max-w-sm mx-auto">
                Complete your first volunteering experience to start tracking your impact and building your volunteer profile.
              </p>
              <Link href="/experiences">
                <Button>
                  Browse Experiences
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {hasActivity && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity History */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#21B3B1]" />
                    Volunteering History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.activityHistory.map((activity) => (
                      <div
                        key={activity.bookingId}
                        className="border border-[#E6EAEA] rounded-lg p-4 hover:border-[#21B3B1] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#4A4A4A] mb-1 truncate">
                              {activity.experienceTitle}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-[#7A7A7A] mb-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {activity.city}, {activity.country}
                              </span>
                              {activity.durationHours > 0 && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {activity.durationHours}h
                                </span>
                              )}
                              <span>{formatDate(activity.completedAt)}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {activity.causeCategories.slice(0, 2).map((cause) => (
                                <span
                                  key={cause}
                                  className="px-2 py-0.5 rounded-full text-xs text-white"
                                  style={{ backgroundColor: getCauseColor(cause) }}
                                >
                                  {cause}
                                </span>
                              ))}
                            </div>
                          </div>
                          {activity.rating && (
                            <div className="flex items-center gap-1 text-[#F2B56B] flex-shrink-0">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm font-medium">{activity.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar: Causes & Countries */}
            <div className="space-y-6">
              {/* Causes Breakdown */}
              {Object.keys(analytics?.causesBreakdown || {}).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-[#21B3B1]" />
                      Causes Supported
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(analytics?.causesBreakdown || {})
                        .sort(([, a], [, b]) => b - a)
                        .map(([cause, count]) => {
                          const maxCount = Math.max(
                            ...Object.values(analytics?.causesBreakdown || {})
                          );
                          const pct = Math.round((count / maxCount) * 100);
                          return (
                            <div key={cause}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-[#4A4A4A] font-medium">{cause}</span>
                                <span className="text-[#7A7A7A]">
                                  {count} {count === 1 ? 'time' : 'times'}
                                </span>
                              </div>
                              <div className="h-2 bg-[#E6EAEA] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor: getCauseColor(cause),
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Countries Visited */}
              {(analytics?.countriesList || []).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#21B3B1]" />
                      Countries Visited
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analytics?.countriesList.map((country) => (
                        <Badge key={country} variant="secondary">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Experiences */}
        {(analytics?.upcomingExperiences || []).length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#21B3B1]" />
                Upcoming Experiences
              </CardTitle>
              <Link href="/dashboard/user/bookings">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analytics?.upcomingExperiences.map((exp) => (
                  <div
                    key={exp.bookingId}
                    className="border border-[#E6EAEA] rounded-lg p-4 hover:border-[#21B3B1] transition-colors"
                  >
                    <h4 className="font-semibold text-[#4A4A4A] mb-2 line-clamp-1">
                      {exp.experienceTitle}
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-[#7A7A7A] mb-1">
                      <MapPin className="w-3 h-3" />
                      {exp.city}, {exp.country}
                    </div>
                    {exp.startDate && (
                      <div className="flex items-center gap-1 text-sm text-[#7A7A7A] mb-2">
                        <Calendar className="w-3 h-3" />
                        {formatDate(exp.startDate)}
                      </div>
                    )}
                    <Badge variant={exp.status === 'confirmed' ? 'success' : 'warning'} size="sm">
                      {exp.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Motivational CTA */}
        <Card className="bg-[#C9F0EF] border-[#21B3B1]/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-[#4A4A4A] mb-2">
              Keep Making a Difference
            </h3>
            <p className="text-[#7A7A7A] mb-4">
              {hasActivity
                ? `You've already volunteered ${stats?.totalHours || 0} hours across ${stats?.countriesVisited || 0} ${(stats?.countriesVisited || 0) === 1 ? 'country' : 'countries'}. Keep going!`
                : 'Your next volunteering experience is waiting. Browse opportunities and start your impact journey.'}
            </p>
            <Link href="/experiences">
              <Button>
                Find More Experiences
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
