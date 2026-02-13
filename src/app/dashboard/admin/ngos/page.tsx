'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';

interface NGO {
  id: string;
  name: string;
  logoUrl?: string;
  entityType?: string;
  jurisdiction: string;
  serviceLocations: string[];
  description: string;
  causes: string[];
  website?: string;
  contactEmail: string;
  publicSlug: string;
  approved: boolean;
  rejectionReason?: string;
  rejectedAt?: Date;
  approvedAt?: Date;
  resubmittedAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminNGOsPage() {
  // Force cache invalidation - 2026-02-13
  const { user, firebaseUser } = useAuth();
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedNGOs, setExpandedNGOs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user && firebaseUser) {
      fetchNGOs();
    }
  }, [user, firebaseUser, filter]);

  const fetchNGOs = async () => {
    if (!user || !firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      let url = '/api/admin/ngos';

      if (filter !== 'all') {
        url += `?status=${filter}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch NGOs');
      }

      const data = await response.json();
      setNgos(data.ngos || []);
    } catch (err) {
      console.error('Error fetching NGOs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch NGOs');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (ngoId: string, approved: boolean) => {
    if (!user || !firebaseUser) return;

    let rejectionReason = '';

    // If rejecting, prompt for reason
    if (!approved) {
      rejectionReason = window.prompt(
        'Please provide a reason for rejection (this will be sent to the NGO):'
      ) || '';

      // If user cancelled or provided empty reason, don't proceed
      if (!rejectionReason.trim()) {
        alert('Rejection cancelled - a reason must be provided.');
        return;
      }
    } else {
      // Confirm approval
      const confirmApprove = window.confirm(
        'Approve this NGO? An approval email will be sent to the organisation.'
      );
      if (!confirmApprove) return;
    }

    setUpdatingId(ngoId);
    setError(null);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/admin/ngos/${ngoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          approved,
          ...(rejectionReason && { rejectionReason }),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update NGO');
      }

      const data = await response.json();

      // Show success message
      alert(
        approved
          ? '✅ NGO approved successfully! Approval email sent.'
          : '✅ NGO rejected. Rejection email sent with details.'
      );

      // Refresh the list
      await fetchNGOs();
    } catch (err) {
      console.error('Error updating NGO:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update NGO';
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpanded = (ngoId: string) => {
    setExpandedNGOs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ngoId)) {
        newSet.delete(ngoId);
      } else {
        newSet.add(ngoId);
      }
      return newSet;
    });
  };

  const pendingNGOs = ngos.filter((ngo) => !ngo.approved && !ngo.rejectionReason);
  const approvedNGOs = ngos.filter((ngo) => ngo.approved === true);

  const displayedNGOs =
    filter === 'pending' ? pendingNGOs : filter === 'approved' ? approvedNGOs : ngos;

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            NGO Management
          </h1>
          <p className="text-text-muted">
            Review and approve NGO registration requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Total NGOs</p>
                  <p className="text-2xl font-bold text-primary">{ngos.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingNGOs.length}
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
                  <p className="text-sm text-text-muted">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {approvedNGOs.length}
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
            All ({ngos.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pending ({pendingNGOs.length})
          </Button>
          <Button
            variant={filter === 'approved' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('approved')}
          >
            Approved ({approvedNGOs.length})
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
            <p className="text-text-muted">Loading NGOs...</p>
          </div>
        ) : displayedNGOs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No NGOs Found
              </h3>
              <p className="text-text-muted">
                {filter === 'pending'
                  ? 'No pending NGO registrations at the moment'
                  : filter === 'approved'
                  ? 'No approved NGOs yet'
                  : 'No NGOs registered yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayedNGOs.map((ngo) => (
              <Card key={ngo.id} variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Logo */}
                    {ngo.logoUrl && (
                      <img
                        src={ngo.logoUrl}
                        alt={ngo.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-text-primary">
                              {ngo.name}
                            </h3>
                            {ngo.approved ? (
                              <Badge variant="success" size="sm">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approved
                              </Badge>
                            ) : ngo.rejectionReason ? (
                              <Badge variant="danger" size="sm">
                                <XCircle className="w-3 h-3 mr-1" />
                                Rejected
                              </Badge>
                            ) : (
                              <Badge variant="warning" size="sm">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending Approval
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-text-muted">
                            {ngo.createdAt && `Registered on ${format(new Date(ngo.createdAt), 'dd MMM yyyy')}`}
                            {ngo.rejectedAt && ` • Rejected on ${format(new Date(ngo.rejectedAt), 'dd MMM yyyy')}`}
                            {ngo.approvedAt && ` • Approved on ${format(new Date(ngo.approvedAt), 'dd MMM yyyy')}`}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className={`text-text-primary ${expandedNGOs.has(ngo.id) ? '' : 'line-clamp-2'}`}>
                          {ngo.description}
                        </p>
                        {ngo.description && ngo.description.length > 150 && (
                          <button
                            onClick={() => toggleExpanded(ngo.id)}
                            className="text-sm text-primary hover:text-primary-dark mt-2 font-medium"
                          >
                            {expandedNGOs.has(ngo.id) ? '← Show less' : 'View full details →'}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                        {ngo.entityType && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-text-muted" />
                            <span className="text-text-muted">Entity Type:</span>
                            <span className="text-text-primary">{ngo.entityType}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-text-muted" />
                          <span className="text-text-muted">Jurisdiction:</span>
                          <span className="text-text-primary">{ngo.jurisdiction}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-text-muted" />
                          <span className="text-text-muted">Contact:</span>
                          <span className="text-text-primary">{ngo.contactEmail}</span>
                        </div>

                        <div className="col-span-2">
                          <span className="text-text-muted">Service Locations: </span>
                          <span className="text-text-primary">
                            {ngo.serviceLocations.join(', ')}
                          </span>
                        </div>

                        <div className="col-span-2">
                          <span className="text-text-muted">Causes: </span>
                          <div className="inline-flex flex-wrap gap-2 mt-1">
                            {ngo.causes.map((cause) => (
                              <Badge key={cause} variant="secondary" size="sm">
                                {cause}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {ngo.website && (
                        <a
                          href={ngo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark"
                        >
                          Visit Website
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      {/* Rejection Reason */}
                      {ngo.rejectionReason && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <h4 className="text-sm font-semibold text-red-900 mb-2">
                            Rejection Reason:
                          </h4>
                          <p className="text-sm text-red-800">{ngo.rejectionReason}</p>
                          <p className="text-xs text-red-600 mt-2">
                            NGO has been notified and can edit their profile to resubmit for review.
                          </p>
                        </div>
                      )}

                      {/* Action Buttons - Only for pending (not yet approved or rejected) */}
                      {!ngo.approved && !ngo.rejectionReason && (
                        <div className="flex gap-3 mt-4 pt-4 border-t">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApproval(ngo.id, true)}
                            disabled={updatingId === ngo.id}
                            isLoading={updatingId === ngo.id}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleApproval(ngo.id, false)}
                            disabled={updatingId === ngo.id}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {/* Revoke/Re-review buttons for approved or rejected NGOs */}
                      {ngo.approved && (
                        <div className="mt-4 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproval(ngo.id, false)}
                            disabled={updatingId === ngo.id}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Revoke Approval
                          </Button>
                        </div>
                      )}

                      {ngo.rejectionReason && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-text-muted mb-3">
                            {ngo.resubmittedAt
                              ? `Resubmitted on ${format(new Date(ngo.resubmittedAt), 'dd MMM yyyy')} - Review again:`
                              : 'Review this rejected application:'}
                          </p>
                          <div className="flex gap-3">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApproval(ngo.id, true)}
                              disabled={updatingId === ngo.id}
                              isLoading={updatingId === ngo.id}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleApproval(ngo.id, false)}
                              disabled={updatingId === ngo.id}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject Again
                            </Button>
                          </div>
                        </div>
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
