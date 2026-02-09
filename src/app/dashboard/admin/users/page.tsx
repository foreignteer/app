'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Users,
  Mail,
  Calendar,
  Shield,
  Building2,
  User as UserIcon,
  Briefcase,
  Globe,
} from 'lucide-react';
import { format } from 'date-fns';

interface User {
  uid: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: 'admin' | 'ngo' | 'user';
  countryOfOrigin?: string;
  volunteeringExperience?: string;
  jobTitle?: string;
  organization?: string;
  phone?: string;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminUsersPage() {
  const { user, firebaseUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'admin' | 'ngo' | 'user'>('all');

  useEffect(() => {
    if (user && firebaseUser) {
      fetchUsers();
    }
  }, [user, firebaseUser, filter]);

  const fetchUsers = async () => {
    if (!user || !firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      let url = '/api/admin/users';

      if (filter !== 'all') {
        url += `?role=${filter}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="danger" size="sm">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      case 'ngo':
        return (
          <Badge variant="info" size="sm">
            <Building2 className="w-3 h-3 mr-1" />
            NGO
          </Badge>
        );
      case 'user':
        return (
          <Badge variant="secondary" size="sm">
            <UserIcon className="w-3 h-3 mr-1" />
            User
          </Badge>
        );
      default:
        return <Badge size="sm">{role}</Badge>;
    }
  };

  const adminUsers = users.filter((u) => u.role === 'admin');
  const ngoUsers = users.filter((u) => u.role === 'ngo');
  const regularUsers = users.filter((u) => u.role === 'user');

  const displayedUsers =
    filter === 'admin'
      ? adminUsers
      : filter === 'ngo'
      ? ngoUsers
      : filter === 'user'
      ? regularUsers
      : users;

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            User Management
          </h1>
          <p className="text-text-muted">
            View and manage all platform users
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Total Users</p>
                  <p className="text-2xl font-bold text-primary">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Admins</p>
                  <p className="text-2xl font-bold text-red-600">{adminUsers.length}</p>
                </div>
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">NGOs</p>
                  <p className="text-2xl font-bold text-blue-600">{ngoUsers.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Volunteers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {regularUsers.length}
                  </p>
                </div>
                <UserIcon className="w-8 h-8 text-green-600" />
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
            All ({users.length})
          </Button>
          <Button
            variant={filter === 'admin' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('admin')}
          >
            Admins ({adminUsers.length})
          </Button>
          <Button
            variant={filter === 'ngo' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('ngo')}
          >
            NGOs ({ngoUsers.length})
          </Button>
          <Button
            variant={filter === 'user' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('user')}
          >
            Volunteers ({regularUsers.length})
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
            <p className="text-text-muted">Loading users...</p>
          </div>
        ) : displayedUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No Users Found
              </h3>
              <p className="text-text-muted">
                No users match the selected filter
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayedUsers.map((u) => (
              <Card key={u.uid} variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.displayName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        u.displayName.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-text-primary">
                              {u.displayName}
                            </h3>
                            {getRoleBadge(u.role)}
                            {u.profileCompleted && (
                              <Badge variant="success" size="sm">
                                Profile Complete
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-text-muted">
                            Joined {format(new Date(u.createdAt), 'dd MMM yyyy')}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-text-muted" />
                          <span className="text-text-primary">{u.email}</span>
                        </div>

                        {u.countryOfOrigin && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-text-muted" />
                            <span className="text-text-primary">{u.countryOfOrigin}</span>
                          </div>
                        )}

                        {u.jobTitle && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-text-muted" />
                            <span className="text-text-primary">
                              {u.jobTitle}
                              {u.organization && ` at ${u.organization}`}
                            </span>
                          </div>
                        )}

                        {u.volunteeringExperience && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-text-muted" />
                            <span className="text-text-primary">{u.volunteeringExperience}</span>
                          </div>
                        )}
                      </div>
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
