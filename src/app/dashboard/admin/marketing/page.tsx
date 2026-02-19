'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  FunnelChart,
  Funnel,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MousePointer,
  ExternalLink,
  Target,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface MarketingAnalytics {
  dateRange: {
    start: string;
    end: string;
    days: number;
  };
  conversionFunnel: Array<{
    step: number;
    name: string;
    count: number;
    percentage: number;
    dropOffRate: number;
  }>;
  overallConversion: {
    totalVisitors: number;
    totalBookings: number;
    conversionRate: number;
  };
  trafficSources: Array<{ source: string; count: number }>;
  campaigns: Array<{ campaign: string; count: number }>;
  pageEngagement: Array<{ page: string; views: number }>;
  userRegistrations: {
    started: number;
    completed: number;
    conversionRate: number;
  };
  ngoRegistrations: {
    started: number;
    completed: number;
    conversionRate: number;
  };
  ctaPerformance: Array<{ cta: string; clicks: number }>;
  totalEvents: number;
}

const FUNNEL_COLORS = ['#21B3B1', '#168E8C', '#6FB7A4', '#8FA6A1', '#F6C98D', '#F2B56B'];

export default function MarketingAnalyticsPage() {
  const { firebaseUser } = useAuth();
  const [analytics, setAnalytics] = useState<MarketingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    if (firebaseUser) {
      fetchAnalytics();
    }
  }, [firebaseUser, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = await firebaseUser!.getIdToken();
      const response = await fetch(`/api/admin/marketing-analytics?days=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch marketing analytics');
      }

      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (err) {
      console.error('Error fetching marketing analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#21B3B1]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !analytics) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Failed to load marketing analytics'}</p>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Visitors',
      value: analytics.overallConversion.totalVisitors.toLocaleString(),
      subtitle: `Last ${timeRange} days`,
      icon: Users,
      color: '#21B3B1',
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.overallConversion.conversionRate.toFixed(2)}%`,
      subtitle: 'Homepage to booking',
      icon: Target,
      color: '#6FB7A4',
    },
    {
      title: 'Total Bookings',
      value: analytics.overallConversion.totalBookings.toLocaleString(),
      subtitle: `${analytics.conversionFunnel[6]?.dropOffRate.toFixed(1)}% drop at payment`,
      icon: TrendingUp,
      color: '#168E8C',
    },
    {
      title: 'User Registrations',
      value: `${analytics.userRegistrations.conversionRate.toFixed(1)}%`,
      subtitle: `${analytics.userRegistrations.completed} of ${analytics.userRegistrations.started} completed`,
      icon: Users,
      color: '#8FA6A1',
    },
  ];

  // Find biggest drop-off point
  const biggestDropOff = analytics.conversionFunnel.reduce((max, step) =>
    step.dropOffRate > max.dropOffRate ? step : max
  );

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#4A4A4A] mb-2">
              Marketing Analytics
            </h1>
            <p className="text-[#7A7A7A]">
              Track user acquisition, engagement, and conversion funnels
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  timeRange === days
                    ? 'bg-[#21B3B1] text-white border-[#21B3B1]'
                    : 'bg-white text-[#4A4A4A] border-[#E6EAEA] hover:border-[#21B3B1]'
                }`}
              >
                {days}D
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-[#7A7A7A] mb-1">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-[#4A4A4A] mb-2">
                        {stat.value}
                      </h3>
                      <p className="text-xs text-[#7A7A7A]">{stat.subtitle}</p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}</div>

        {/* Biggest Drop-off Alert */}
        {biggestDropOff.dropOffRate > 20 && (
          <Card className="border-[#F2B56B] bg-[#FFF9F0]">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-[#F2B56B] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#4A4A4A] mb-1">
                    High Drop-off Detected
                  </h3>
                  <p className="text-sm text-[#7A7A7A]">
                    <strong>{biggestDropOff.dropOffRate.toFixed(1)}%</strong> of users drop off at{' '}
                    <strong>{biggestDropOff.name}</strong>. This is the biggest bottleneck in your conversion funnel.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.conversionFunnel.map((step, index) => {
                const isHighDropOff = step.dropOffRate > 30;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: FUNNEL_COLORS[index % FUNNEL_COLORS.length] }}
                        >
                          {step.step}
                        </div>
                        <span className="font-medium text-[#4A4A4A]">{step.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#7A7A7A]">
                          {step.count.toLocaleString()} users
                        </span>
                        <span className="font-semibold text-[#4A4A4A] min-w-[60px] text-right">
                          {step.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#E6EAEA] rounded-full h-3 mb-2">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{
                          width: `${step.percentage}%`,
                          backgroundColor: FUNNEL_COLORS[index % FUNNEL_COLORS.length],
                        }}
                      />
                    </div>
                    {index < analytics.conversionFunnel.length - 1 && (
                      <div className="flex items-center gap-2 ml-11 mb-2">
                        {step.dropOffRate > 0 && (
                          <>
                            <TrendingDown
                              className={`w-4 h-4 ${
                                isHighDropOff ? 'text-red-500' : 'text-[#F2B56B]'
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                isHighDropOff ? 'text-red-600 font-semibold' : 'text-[#7A7A7A]'
                              }`}
                            >
                              {step.dropOffRate.toFixed(1)}% drop-off to next step
                              {isHighDropOff && ' ⚠️'}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources & Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.trafficSources}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6EAEA" />
                  <XAxis dataKey="source" stroke="#7A7A7A" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#7A7A7A" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF5EC',
                      border: '1px solid #E6EAEA',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#21B3B1" name="Visitors" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Campaign Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.campaigns.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.campaigns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6EAEA" />
                    <XAxis dataKey="campaign" stroke="#7A7A7A" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#7A7A7A" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FAF5EC',
                        border: '1px solid #E6EAEA',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#168E8C" name="Visitors" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-[#7A7A7A]">
                  <p>No campaign data yet. Add UTM parameters to your links to track campaigns.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Page Engagement & CTAs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Most Viewed Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.pageEngagement.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-[#4A4A4A] truncate flex-1">{page.page}</span>
                    <span className="text-sm font-semibold text-[#21B3B1] ml-4">
                      {page.views.toLocaleString()} views
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Call-to-Action Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.ctaPerformance.length > 0 ? (
                <div className="space-y-3">
                  {analytics.ctaPerformance.map((cta, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-[#4A4A4A] truncate flex-1">{cta.cta}</span>
                      <span className="text-sm font-semibold text-[#168E8C] ml-4">
                        {cta.clicks.toLocaleString()} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-[#7A7A7A]">
                  <p>No CTA tracking data yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Registration Funnels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Registration Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#7A7A7A]">Started Registration</span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {analytics.userRegistrations.started}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#7A7A7A]" />
                  <div className="flex-1 bg-[#E6EAEA] rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-[#21B3B1]"
                      style={{
                        width: `${analytics.userRegistrations.conversionRate}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A7A7A]">Completed Registration</span>
                  <span className="font-semibold text-[#21B3B1]">
                    {analytics.userRegistrations.completed} ({analytics.userRegistrations.conversionRate.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NGO Registration Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#7A7A7A]">Started Registration</span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {analytics.ngoRegistrations.started}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#7A7A7A]" />
                  <div className="flex-1 bg-[#E6EAEA] rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-[#168E8C]"
                      style={{
                        width: `${analytics.ngoRegistrations.conversionRate}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A7A7A]">Completed Registration</span>
                  <span className="font-semibold text-[#168E8C]">
                    {analytics.ngoRegistrations.completed} ({analytics.ngoRegistrations.conversionRate.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Guide */}
        <Card className="border-[#21B3B1] bg-[#C9F0EF]">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[#4A4A4A] mb-3 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Getting More Data
            </h3>
            <ul className="space-y-2 text-sm text-[#4A4A4A]">
              <li>• <strong>UTM Parameters:</strong> Add ?utm_source=facebook&utm_campaign=summer to your marketing links</li>
              <li>• <strong>Google Analytics:</strong> Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env to enable GA4 tracking</li>
              <li>• <strong>Track Events:</strong> Events are automatically tracked as users interact with your site</li>
              <li>• <strong>Integration:</strong> This dashboard shows data from the last {timeRange} days</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
