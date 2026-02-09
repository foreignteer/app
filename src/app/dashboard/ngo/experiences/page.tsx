'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/hooks/useAuth';
import { Experience } from '@/lib/types/experience';
import {
  Plus,
  Calendar,
  Users,
  Edit,
  Eye,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  EyeOff,
  Trash2,
  Repeat,
} from 'lucide-react';
import { format } from 'date-fns';

type FilterType = 'all' | 'ongoing' | 'past' | 'draft';
type EditScope = 'occurrence' | 'series';

export default function NGOExperiencesPage() {
  const { user, firebaseUser } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showEditScopeDialog, setShowEditScopeDialog] = useState(false);
  const [editScope, setEditScope] = useState<EditScope>('occurrence');
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    experienceId: string;
    newStatus: string;
    isRecurring: boolean;
  } | null>(null);

  useEffect(() => {
    if (user && firebaseUser) {
      fetchExperiences();
    }
  }, [user, firebaseUser]);

  const fetchExperiences = async () => {
    if (!user || !firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/ngo/experiences/list', {
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

  const updateStatus = async (experienceId: string, newStatus: string) => {
    if (!user || !firebaseUser) return;

    // Find the experience to check if it's recurring
    const experience = experiences.find((exp) => exp.id === experienceId);
    const isRecurring = !!experience?.recurringGroupId;

    // If it's recurring, show the dialog first
    if (isRecurring) {
      setPendingStatusUpdate({ experienceId, newStatus, isRecurring });
      setEditScope('occurrence'); // Default to occurrence
      setShowEditScopeDialog(true);
      return;
    }

    // Otherwise, proceed with the update directly
    await performStatusUpdate(experienceId, newStatus, 'occurrence');
  };

  const performStatusUpdate = async (
    experienceId: string,
    newStatus: string,
    scope: EditScope
  ) => {
    if (!user || !firebaseUser) return;

    setUpdatingStatus(experienceId);
    setError(null);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/ngo/experiences/${experienceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, editScope: scope }),
      });

      if (!response.ok) {
        throw new Error('Failed to update experience status');
      }

      // Refresh the list
      await fetchExperiences();

      // Close dialog if open
      setShowEditScopeDialog(false);
      setPendingStatusUpdate(null);
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleEditScopeConfirm = () => {
    if (pendingStatusUpdate) {
      performStatusUpdate(
        pendingStatusUpdate.experienceId,
        pendingStatusUpdate.newStatus,
        editScope
      );
    }
  };

  const deleteExperience = async (experienceId: string) => {
    if (!user || !firebaseUser) return;

    setDeletingId(experienceId);
    setError(null);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/ngo/experiences/${experienceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete experience');
      }

      // Refresh the list
      await fetchExperiences();
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting experience:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete experience');
    } finally {
      setDeletingId(null);
    }
  };

  const getFilteredExperiences = () => {
    const now = new Date();

    let filtered: Experience[];
    switch (filter) {
      case 'ongoing':
        filtered = experiences.filter(exp =>
          exp.status === 'published' &&
          new Date(exp.dates.start) <= now &&
          new Date(exp.dates.end) >= now
        );
        break;
      case 'past':
        filtered = experiences.filter(exp =>
          new Date(exp.dates.end) < now
        );
        break;
      case 'draft':
        filtered = experiences.filter(exp =>
          exp.status === 'draft'
        );
        break;
      default:
        filtered = experiences;
    }

    // Sort by date: nearest date first (soonest at top)
    return filtered.sort((a, b) => {
      const aStart = new Date(a.dates.start).getTime();
      const bStart = new Date(b.dates.start).getTime();
      return aStart - bStart;
    });
  };

  const filteredExperiences = getFilteredExperiences();

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

  return (
    <DashboardLayout requiredRole="ngo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              My Experiences
            </h1>
            <p className="text-text-muted">
              Manage your volunteering opportunities
            </p>
          </div>
          <Link href="/dashboard/ngo/experiences/create">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Experience
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'all'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            All ({experiences.length})
          </button>
          <button
            onClick={() => setFilter('ongoing')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'ongoing'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Ongoing ({experiences.filter(exp => {
              const now = new Date();
              return exp.status === 'published' &&
                new Date(exp.dates.start) <= now &&
                new Date(exp.dates.end) >= now;
            }).length})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'past'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Past ({experiences.filter(exp => new Date(exp.dates.end) < new Date()).length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'draft'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Draft ({experiences.filter(exp => exp.status === 'draft').length})
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Edit Scope Dialog for recurring events */}
        {showEditScopeDialog && pendingStatusUpdate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Update Recurring Event
              </h3>
              <p className="text-sm text-text-muted mb-4">
                This is a recurring event. Would you like to update just this occurrence or all events in the series?
              </p>
              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="editScope"
                    value="occurrence"
                    checked={editScope === 'occurrence'}
                    onChange={() => setEditScope('occurrence')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">
                      This occurrence only
                    </div>
                    <div className="text-sm text-text-muted">
                      Changes will apply only to this specific event
                    </div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="editScope"
                    value="series"
                    checked={editScope === 'series'}
                    onChange={() => setEditScope('series')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">
                      All events in the series
                    </div>
                    <div className="text-sm text-text-muted">
                      Changes will apply to all recurring events in this series
                    </div>
                  </div>
                </label>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditScopeDialog(false);
                    setPendingStatusUpdate(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleEditScopeConfirm}>
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading your experiences...</p>
          </div>
        ) : experiences.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No Experiences Yet
              </h3>
              <p className="text-text-muted mb-6">
                Get started by creating your first volunteering experience
              </p>
              <Link href="/dashboard/ngo/experiences/create">
                <Button size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Experience
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : filteredExperiences.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No {filter !== 'all' && `${filter} `}experiences found
              </h3>
              <p className="text-text-muted">
                {filter !== 'all' ? 'Try selecting a different filter' : 'Create your first experience to get started'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredExperiences.map((experience) => (
              <Card key={experience.id} variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {getStatusBadge(experience.status)}
                        {experience.causeCategories?.slice(0, 2).map((category) => (
                          <Badge key={category} variant="primary" size="sm">
                            {category}
                          </Badge>
                        ))}
                        {experience.causeCategories?.length > 2 && (
                          <Badge variant="primary" size="sm">
                            +{experience.causeCategories.length - 2} more
                          </Badge>
                        )}
                        {experience.recurringGroupId && (
                          <Badge variant="secondary" size="sm">
                            <Repeat className="w-3 h-3 mr-1" />
                            Recurring
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold text-text-primary mb-2">
                        {experience.title}
                      </h3>

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
                            {format(new Date(experience.dates.start), 'MMM d, yyyy')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-text-muted">
                          <Users className="w-4 h-4" />
                          <span>
                            {experience.currentBookings} / {experience.capacity}{' '}
                            booked
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <div className="flex gap-2">
                        <Link href={`/experiences/${experience.id}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/ngo/experiences/${experience.id}`}>
                          <Button variant="outline" size="sm">
                            <Users className="w-4 h-4 mr-2" />
                            Applicants
                          </Button>
                        </Link>
                        <Link href={`/dashboard/ngo/experiences/${experience.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                      </div>

                      {/* Status Management Buttons */}
                      <div className="flex gap-2">
                        {experience.status === 'draft' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => updateStatus(experience.id, 'pending_approval')}
                            disabled={updatingStatus === experience.id}
                            isLoading={updatingStatus === experience.id}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Submit for Approval
                          </Button>
                        )}

                        {experience.status === 'pending_approval' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(experience.id, 'draft')}
                            disabled={updatingStatus === experience.id}
                            isLoading={updatingStatus === experience.id}
                          >
                            <EyeOff className="w-4 h-4 mr-1" />
                            Move to Draft
                          </Button>
                        )}

                        {experience.status === 'published' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(experience.id, 'draft')}
                            disabled={updatingStatus === experience.id}
                            isLoading={updatingStatus === experience.id}
                          >
                            <EyeOff className="w-4 h-4 mr-1" />
                            Unpublish
                          </Button>
                        )}

                        {(experience.status === 'draft' || experience.status === 'pending_approval') && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => updateStatus(experience.id, 'published')}
                            disabled={updatingStatus === experience.id}
                            isLoading={updatingStatus === experience.id}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Publish
                          </Button>
                        )}
                      </div>

                      {/* Delete Button */}
                      {confirmDelete === experience.id ? (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-800 mb-2">
                            Are you sure? This cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deleteExperience(experience.id)}
                              disabled={deletingId === experience.id}
                              isLoading={deletingId === experience.id}
                            >
                              Yes, Delete
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setConfirmDelete(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmDelete(experience.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
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
