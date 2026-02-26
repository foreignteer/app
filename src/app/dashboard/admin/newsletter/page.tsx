'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { NewsletterSubscriber } from '@/lib/types/newsletter';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Download, Mail, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminNewsletterPage() {
  const { firebaseUser } = useAuth();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');

  useEffect(() => {
    if (firebaseUser) {
      fetchSubscribers();
    }
  }, [firebaseUser]);

  const fetchSubscribers = async () => {
    if (!firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/admin/newsletter', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }

      const data = await response.json();
      setSubscribers(data.subscribers || []);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const filteredSubs = subscribers.filter((sub) => {
      if (filter === 'active') return sub.status === 'active';
      if (filter === 'unsubscribed') return sub.status === 'unsubscribed';
      return true;
    });

    const headers = ['Email', 'Status', 'Source', 'Subscribed At', 'Consent Given At', 'User ID'];
    const rows = filteredSubs.map((sub) => [
      sub.email,
      sub.status,
      sub.source,
      format(new Date(sub.subscribedAt), 'yyyy-MM-dd HH:mm:ss'),
      format(new Date(sub.consentGivenAt), 'yyyy-MM-dd HH:mm:ss'),
      sub.userId || 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    if (filter === 'active') return sub.status === 'active';
    if (filter === 'unsubscribed') return sub.status === 'unsubscribed';
    return true;
  });

  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.status === 'active').length,
    unsubscribed: subscribers.filter((s) => s.status === 'unsubscribed').length,
    fromVolunteerRegistration: subscribers.filter((s) => s.source === 'volunteer-registration').length,
    fromNGORegistration: subscribers.filter((s) => s.source === 'ngo-registration').length,
    fromNewsletterPage: subscribers.filter((s) => s.source === 'newsletter-page').length,
    fromFooter: subscribers.filter((s) => s.source === 'footer').length,
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading subscribers...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Newsletter Subscribers
            </h1>
            <p className="text-text-muted">
              Manage and export newsletter subscriptions (GDPR compliant)
            </p>
          </div>
          <Button onClick={exportToCSV} disabled={filteredSubscribers.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export to CSV
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="space-y-4">
          {/* Status Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Total</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <Mail className="w-8 h-8 text-green-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Unsubscribed</p>
                    <p className="text-2xl font-bold text-red-600">{stats.unsubscribed}</p>
                  </div>
                  <Mail className="w-8 h-8 text-red-600 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Source Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Volunteer Registration</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.fromVolunteerRegistration}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted mb-1">NGO Registration</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.fromNGORegistration}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Newsletter Page</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.fromNewsletterPage}</p>
                  </div>
                  <Mail className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Footer</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.fromFooter}</p>
                  </div>
                  <Mail className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Subscribers List</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'primary' : 'outline'}
                  onClick={() => setFilter('all')}
                >
                  All ({stats.total})
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'active' ? 'primary' : 'outline'}
                  onClick={() => setFilter('active')}
                >
                  Active ({stats.active})
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'unsubscribed' ? 'primary' : 'outline'}
                  onClick={() => setFilter('unsubscribed')}
                >
                  Unsubscribed ({stats.unsubscribed})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSubscribers.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-text-light mx-auto mb-4" />
                <p className="text-text-muted">No subscribers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Source</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Subscribed</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Consent Given</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-text-primary">{sub.email}</td>
                        <td className="py-3 px-4">
                          {sub.status === 'active' ? (
                            <Badge variant="success" size="sm">Active</Badge>
                          ) : (
                            <Badge variant="danger" size="sm">Unsubscribed</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" size="sm">
                            {sub.source === 'volunteer-registration' ? 'Volunteer Registration' :
                             sub.source === 'ngo-registration' ? 'NGO Registration' :
                             sub.source === 'newsletter-page' ? 'Newsletter Page' : 'Footer'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-muted">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(sub.subscribedAt), 'MMM d, yyyy')}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-muted">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(sub.consentGivenAt), 'MMM d, yyyy')}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
