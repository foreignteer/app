'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Building2,
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  MapPin,
  Target,
  Activity,
} from 'lucide-react';

interface Analytics {
  totals: {
    ngos: { total: number; approved: number; pending: number; rejected: number };
    experiences: { total: number; published: number; draft: number; cancelled: number };
    bookings: { total: number; confirmed: number; pending: number; completed: number; cancelled: number };
    users: { total: number; volunteers: number; ngos: number; admins: number };
  };
  revenue: {
    platformRevenue: number;
    programmeFees: number;
    totalRevenue: number;
  };
  performance: {
    conversionRate: string;
    popularCauses: Array<{ name: string; count: number }>;
    topCountries: Array<{ name: string; count: number }>;
    topExperienceLocations: Array<{ name: string; count: number }>;
  };
  trends: {
    monthly: Array<{
      month: string;
      ngos: number;
      experiences: number;
      bookings: number;
      users: number;
    }>;
  };
}

const COLORS = ['#21B3B1', '#F6C98D', '#168E8C', '#8FA6A1', '#6FB7A4', '#F2B56B'];

export default function AdminAnalyticsPage() {
  const { firebaseUser } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (firebaseUser) {
      fetchAnalytics();
    }
  }, [firebaseUser]);

  const fetchAnalytics = async () => {
    try {
      const token = await firebaseUser!.getIdToken();
      const response = await fetch('/api/admin/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !analytics) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Failed to load analytics'}</p>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      title: 'Total NGOs',
      value: analytics.totals.ngos.total,
      subtitle: `${analytics.totals.ngos.approved} approved, ${analytics.totals.ngos.pending} pending`,
      icon: Building2,
      color: '#21B3B1',
    },
    {
      title: 'Total Experiences',
      value: analytics.totals.experiences.total,
      subtitle: `${analytics.totals.experiences.published} published`,
      icon: Calendar,
      color: '#F6C98D',
    },
    {
      title: 'Total Bookings',
      value: analytics.totals.bookings.total,
      subtitle: `${analytics.totals.bookings.confirmed} confirmed, ${analytics.totals.bookings.completed} completed`,
      icon: Activity,
      color: '#168E8C',
    },
    {
      title: 'Total Users',
      value: analytics.totals.users.total,
      subtitle: `${analytics.totals.users.volunteers} volunteers`,
      icon: Users,
      color: '#8FA6A1',
    },
    {
      title: 'Platform Revenue',
      value: `£${analytics.revenue.platformRevenue.toLocaleString()}`,
      subtitle: `£${analytics.revenue.totalRevenue.toLocaleString()} total inc. programme fees`,
      icon: DollarSign,
      color: '#6FB7A4',
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.performance.conversionRate}%`,
      subtitle: 'Bookings vs. published experiences',
      icon: TrendingUp,
      color: '#F2B56B',
    },
  ];

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#4A4A4A] mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-[#7A7A7A]">
            Platform-wide metrics and performance insights
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          })}
        </div>

        {/* Growth Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Trends (Last 12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analytics.trends.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6EAEA" />
                <XAxis dataKey="month" stroke="#7A7A7A" />
                <YAxis stroke="#7A7A7A" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF5EC',
                    border: '1px solid #E6EAEA',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ngos"
                  stroke="#21B3B1"
                  strokeWidth={2}
                  name="NGOs"
                />
                <Line
                  type="monotone"
                  dataKey="experiences"
                  stroke="#F6C98D"
                  strokeWidth={2}
                  name="Experiences"
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#168E8C"
                  strokeWidth={2}
                  name="Bookings"
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8FA6A1"
                  strokeWidth={2}
                  name="Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Causes & Geographic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Causes */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Causes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={analytics.performance.popularCauses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6EAEA" />
                  <XAxis
                    dataKey="name"
                    stroke="#7A7A7A"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    interval={0}
                  />
                  <YAxis stroke="#7A7A7A" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF5EC',
                      border: '1px solid #E6EAEA',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#21B3B1" name="Experiences" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* NGO Distribution by Country */}
          <Card>
            <CardHeader>
              <CardTitle>NGO Distribution by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={analytics.performance.topCountries}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.performance.topCountries.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF5EC',
                      border: '1px solid #E6EAEA',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Experience Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Top Experience Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {analytics.performance.topExperienceLocations.map((location, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#FAF5EC] border border-[#E6EAEA] rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#21B3B1]" />
                    <span className="text-sm font-medium text-[#4A4A4A]">
                      {location.name}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[#21B3B1]">
                    {location.count}
                  </p>
                  <p className="text-xs text-[#7A7A7A]">experiences</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
