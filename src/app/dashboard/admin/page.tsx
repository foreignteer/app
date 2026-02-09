'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Building2,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  BookOpen,
  MessageSquareQuote,
  Mail,
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalNGOs: number;
  totalExperiences: number;
  totalBookings: number;
  pendingNGOs: number;
  pendingExperiences: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalNGOs: 0,
    totalExperiences: 0,
    totalBookings: 0,
    pendingNGOs: 0,
    pendingExperiences: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch actual stats from API
    // For now, using mock data
    setTimeout(() => {
      setStats({
        totalUsers: 156,
        totalNGOs: 23,
        totalExperiences: 48,
        totalBookings: 342,
        pendingNGOs: 5,
        pendingExperiences: 8,
      });
      setLoading(false);
    }, 500);
  }, []);

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-text-muted">
            Manage platform operations and approvals
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-primary">
                    {loading ? '-' : stats.totalUsers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                <TrendingUp size={14} />
                <span>+12% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">NGO Partners</p>
                  <p className="text-3xl font-bold text-primary">
                    {loading ? '-' : stats.totalNGOs}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-accent-dark" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                <TrendingUp size={14} />
                <span>+8% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">Experiences</p>
                  <p className="text-3xl font-bold text-primary">
                    {loading ? '-' : stats.totalExperiences}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                <TrendingUp size={14} />
                <span>+15% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-primary">
                    {loading ? '-' : stats.totalBookings}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                <TrendingUp size={14} />
                <span>+23% this month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approval Queues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending NGO Approvals */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending NGO Approvals</CardTitle>
              <Link href="/dashboard/admin/ngos">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : stats.pendingNGOs === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-text-muted">All caught up!</p>
                  <p className="text-sm text-text-muted">
                    No pending NGO approvals
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">
                          {stats.pendingNGOs} NGOs awaiting review
                        </p>
                        <p className="text-sm text-text-muted">
                          Click to review applications
                        </p>
                      </div>
                    </div>
                    <Link href="/dashboard/admin/ngos">
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Experience Approvals */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Experience Approvals</CardTitle>
              <Link href="/dashboard/admin/experiences">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : stats.pendingExperiences === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-text-muted">All caught up!</p>
                  <p className="text-sm text-text-muted">
                    No pending experience approvals
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">
                          {stats.pendingExperiences} experiences awaiting review
                        </p>
                        <p className="text-sm text-text-muted">
                          Click to review submissions
                        </p>
                      </div>
                    </div>
                    <Link href="/dashboard/admin/experiences">
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <Link href="/dashboard/admin/users">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-text-primary mb-1">
                    Manage Users
                  </h3>
                  <p className="text-sm text-text-muted">
                    View and manage all platform users
                  </p>
                </div>
              </Link>

              <Link href="/dashboard/admin/ngos">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <Building2 className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-text-primary mb-1">
                    NGO Management
                  </h3>
                  <p className="text-sm text-text-muted">
                    Approve and manage NGO partners
                  </p>
                </div>
              </Link>

              <Link href="/dashboard/admin/experiences">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <Calendar className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-text-primary mb-1">
                    Experience Reviews
                  </h3>
                  <p className="text-sm text-text-muted">
                    Review and approve experiences
                  </p>
                </div>
              </Link>

              <Link href="/dashboard/admin/blog">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <BookOpen className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-text-primary mb-1">
                    Blog Management
                  </h3>
                  <p className="text-sm text-text-muted">
                    Create and manage blog posts
                  </p>
                </div>
              </Link>

              <Link href="/dashboard/admin/testimonials">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <MessageSquareQuote className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-text-primary mb-1">
                    Testimonials
                  </h3>
                  <p className="text-sm text-text-muted">
                    Manage and reorder testimonials
                  </p>
                </div>
              </Link>

              <Link href="/dashboard/admin/newsletter">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <Mail className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-text-primary mb-1">
                    Newsletter
                  </h3>
                  <p className="text-sm text-text-muted">
                    View and export subscribers
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
