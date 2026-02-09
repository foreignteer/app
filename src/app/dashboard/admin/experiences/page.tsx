'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Users,
  Eye,
  Building2,
} from 'lucide-react';
import { format } from 'date-fns';

interface Experience {
  id: string;
  title: string;
  summary: string;
  description: string;
  city: string;
  country: string;
  dates: {
    start: Date;
    end: Date;
  };
  causeCategory: string;
  capacity: number;
  currentBookings: number;
  serviceFee: number;
  status: 'draft' | 'pending_approval' | 'published' | 'cancelled';
  ngoId: string;
  ngoName: string;
  recurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminExperiencesPage() {
  const { user, firebaseUser } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending_approval' | 'published'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (user && firebaseUser) {
      fetchExperiences();
    }
  }, [user, firebaseUser, filter]);

  const fetchExperiences = async () => {
    if (!user || !firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      let url = '/api/admin/experiences';

      if (filter !== 'all') {
        url += `?status=${filter}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch experiences');
      }

      const data = await response.json();
      setExperiences(data.experiences || []);
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    experienceId: string,
    newStatus: 'pending_approval' | 'published' | 'cancelled'
  ) => {
    if (!user || !firebaseUser) return;

    setUpdatingId(experienceId);
    setError(null);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/admin/experiences/${experienceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update experience');
      }

      // Refresh the list
      await fetchExperiences();
    } catch (err) {
      console.error('Error updating experience:', err);
      setError(err instanceof Error ? err.message : 'Failed to update experience');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Published
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="warning" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      case 'pending_approval':
        return (
          <Badge variant="info" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            Pending Approval
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="danger" size="sm">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  const pendingExperiences = experiences.filter((exp) => exp.status === 'pending_approval');
  const publishedExperiences = experiences.filter((exp) => exp.status === 'published');

  const displayedExperiences =
    filter === 'pending_approval'
      ? pendingExperiences
      : filter === 'published'
      ? publishedExperiences
      : experiences;

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Experience Management
          </h1>
          <p className="text-text-muted">
            Review and approve experience submissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Total Experiences</p>
                  <p className="text-2xl font-bold text-primary">{experiences.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingExperiences.length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Published</p>
                  <p className="text-2xl font-bold text-green-600">
                    {publishedExperiences.length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({experiences.length})
          </Button>
          <Button
            variant={filter === 'pending_approval' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending_approval')}
          >
            Pending ({pendingExperiences.length})
          </Button>
          <Button
            variant={filter === 'published' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('published')}
          >
            Published ({publishedExperiences.length})
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading experiences...</p>
          </div>
        ) : displayedExperiences.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No Experiences Found
              </h3>
              <p className="text-text-muted">
                {filter === 'pending_approval'
                  ? 'No experiences pending approval at the moment'
                  : filter === 'published'
                  ? 'No published experiences yet'
                  : 'No experiences created yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayedExperiences.map((experience) => (
              <Card key={experience.id} variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(experience.status)}
                        <Badge variant="primary" size="sm">
                          {experience.causeCategory}
                        </Badge>
                        {experience.recurring && (
                          <Badge variant="secondary" size="sm">
                            Recurring
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold text-text-primary mb-1">
                        {experience.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
                        <Building2 className="w-4 h-4" />
                        <span>{experience.ngoName}</span>
                        <span className="text-text-muted">•</span>
                        <span>Submitted {format(new Date(experience.createdAt), 'dd MMM yyyy')}</span>
                      </div>

                      <p className="text-text-muted mb-4 line-clamp-2">
                        {experience.summary}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-text-muted">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {experience.city}, {experience.country}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-text-muted">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(experience.dates.start), 'dd MMM yyyy')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-text-muted">
                          <Users className="w-4 h-4" />
                          <span>
                            {experience.currentBookings} / {experience.capacity} booked
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <Link href={`/experiences/${experience.id}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    {experience.status === 'pending_approval' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleStatusChange(experience.id, 'published')}
                          disabled={updatingId === experience.id}
                          isLoading={updatingId === experience.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve & Publish
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusChange(experience.id, 'cancelled')}
                          disabled={updatingId === experience.id}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}

                    {experience.status === 'published' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(experience.id, 'pending_approval')}
                        disabled={updatingId === experience.id}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Unpublish
                      </Button>
                    )}

                    {experience.status === 'cancelled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(experience.id, 'pending_approval')}
                        disabled={updatingId === experience.id}
                      >
                        Move to Pending
                      </Button>
                    )}
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
