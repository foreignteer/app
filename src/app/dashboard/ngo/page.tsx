'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  Users,
  Plus,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export default function NGODashboard() {
  const [stats, setStats] = useState({
    totalExperiences: 0,
    publishedExperiences: 0,
    pendingExperiences: 0,
    totalApplicants: 0,
    newApplicants: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const authModule = await import('@/lib/firebase/config');
      const currentUser = authModule.auth.currentUser;

      if (!currentUser) {
        setLoading(false);
        return;
      }

      const token = await currentUser.getIdToken();
      const response = await fetch('/api/ngo/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats({
        totalExperiences: data.totalExperiences,
        publishedExperiences: data.publishedExperiences,
        pendingExperiences: data.pendingExperiences,
        totalApplicants: data.totalApplicants,
        newApplicants: data.newApplicants,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep default stats if fetch fails
      setStats({
        totalExperiences: 0,
        publishedExperiences: 0,
        pendingExperiences: 0,
        totalApplicants: 0,
        newApplicants: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout requiredRole="ngo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              NGO Dashboard
            </h1>
            <p className="text-text-muted">
              Manage your experiences and applicants
            </p>
          </div>
          <Link href="/dashboard/ngo/experiences/create">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Experience
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    Total Experiences
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {loading ? '-' : stats.totalExperiences}
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
                  <p className="text-sm text-text-muted mb-1">Published</p>
                  <p className="text-3xl font-bold text-green-600">
                    {loading ? '-' : stats.publishedExperiences}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    Pending Approval
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {loading ? '-' : stats.pendingExperiences}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    Total Applicants
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {loading ? '-' : stats.totalApplicants}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent-dark" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applicants */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Applicants</CardTitle>
            <Link href="/dashboard/ngo/applicants">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.newApplicants === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-muted">No new applicants</p>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">
                      {stats.newApplicants} new applicants
                    </p>
                    <p className="text-sm text-text-muted">
                      Review applications from volunteers
                    </p>
                  </div>
                  <Link href="/dashboard/ngo/applicants">
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/ngo/experiences/create">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <Plus className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-text-primary mb-1">
                    Create Experience
                  </h3>
                  <p className="text-sm text-text-muted">
                    Post a new volunteering opportunity
                  </p>
                </div>
              </Link>

              <Link href="/dashboard/ngo/experiences">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <Calendar className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-text-primary mb-1">
                    My Experiences
                  </h3>
                  <p className="text-sm text-text-muted">
                    View and manage all experiences
                  </p>
                </div>
              </Link>

              <Link href="/dashboard/ngo/applicants">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-text-primary mb-1">
                    View Applicants
                  </h3>
                  <p className="text-sm text-text-muted">
                    Review volunteer applications
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
