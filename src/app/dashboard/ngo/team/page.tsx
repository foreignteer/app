'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Users2,
  UserPlus,
  Trash2,
  Crown,
  User,
  AlertCircle,
  CheckCircle,
  Mail,
  Loader2,
} from 'lucide-react';

interface TeamMember {
  id: string;
  userId: string;
  ngoRole: 'owner' | 'staff';
  email: string;
  displayName: string;
  joinedAt?: string;
  status: 'active' | 'removed';
}

export default function NGOTeamPage() {
  const { user, firebaseUser } = useAuth();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [inviteError, setInviteError] = useState('');

  // Remove member state
  const [removingId, setRemovingId] = useState<string | null>(null);

  const isOwner = user?.ngoRole === 'owner';

  const fetchTeam = async () => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch('/api/ngo/team', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load team');
      const data = await res.json();
      setMembers(data.members);
    } catch (err) {
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (firebaseUser) fetchTeam();
  }, [firebaseUser]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    setInviteSuccess('');

    if (!inviteEmail.trim()) {
      setInviteError('Please enter an email address');
      return;
    }

    setInviting(true);
    try {
      const token = await firebaseUser!.getIdToken();
      const res = await fetch('/api/ngo/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send invitation');

      setInviteSuccess(`Invitation sent to ${inviteEmail.trim()}`);
      setInviteEmail('');
    } catch (err: any) {
      setInviteError(err.message);
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string, memberName: string) => {
    if (!confirm(`Remove ${memberName} from your team? They will lose access to the NGO dashboard.`)) {
      return;
    }

    setRemovingId(memberId);
    try {
      const token = await firebaseUser!.getIdToken();
      const res = await fetch(`/api/ngo/team/${memberId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove member');

      // Remove from local state
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="ngo">
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-[#21B3B1] animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="ngo">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#4A4A4A] mb-2">Team</h1>
          <p className="text-[#7A7A7A]">
            {isOwner
              ? 'Manage your team members and invite new staff to help run your NGO.'
              : 'View your team members for this NGO.'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Invite Member — owners only */}
        {isOwner && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Invite a Team Member
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#7A7A7A] mb-4">
                Enter the email address of the person you want to invite as a Staff member. They will receive
                an invitation link valid for 72 hours.
              </p>
              <form onSubmit={handleInvite} className="flex gap-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    setInviteError('');
                    setInviteSuccess('');
                  }}
                  placeholder="colleague@example.com"
                  className="flex-1 px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1] text-sm"
                  required
                />
                <Button
                  type="submit"
                  disabled={inviting}
                  isLoading={inviting}
                  className="!bg-[#21B3B1] hover:!bg-[#168E8C] !text-white !border-[#21B3B1] whitespace-nowrap"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invite
                </Button>
              </form>

              {inviteSuccess && (
                <div className="mt-3 flex items-center gap-2 text-sm text-[#6FB7A4]">
                  <CheckCircle className="w-4 h-4" />
                  {inviteSuccess}
                </div>
              )}
              {inviteError && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {inviteError}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Team Members List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="w-5 h-5" />
              Team Members
              <span className="ml-auto text-sm font-normal text-[#7A7A7A]">
                {members.length} {members.length === 1 ? 'member' : 'members'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="text-center py-8">
                <Users2 className="w-10 h-10 text-[#E6EAEA] mx-auto mb-3" />
                <p className="text-[#7A7A7A] text-sm">No team members yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E6EAEA]">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-4 py-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#C9F0EF] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#21B3B1] font-semibold text-sm">
                        {member.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-[#4A4A4A] text-sm truncate">
                          {member.displayName}
                        </p>
                        {member.userId === user?.uid && (
                          <span className="text-xs text-[#7A7A7A]">(You)</span>
                        )}
                        {member.ngoRole === 'owner' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F6C98D]/30 text-[#8B6914] rounded-full text-xs font-medium">
                            <Crown className="w-3 h-3" />
                            Owner
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#C9F0EF] text-[#168E8C] rounded-full text-xs font-medium">
                            <User className="w-3 h-3" />
                            Staff
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#7A7A7A] truncate">{member.email}</p>
                      <p className="text-xs text-[#8FA6A1]">Joined {formatDate(member.joinedAt)}</p>
                    </div>

                    {/* Remove button — owners only, not self, not other owners */}
                    {isOwner && member.userId !== user?.uid && member.ngoRole !== 'owner' && (
                      <button
                        onClick={() => handleRemove(member.id, member.displayName)}
                        disabled={removingId === member.id}
                        className="flex-shrink-0 p-2 text-[#7A7A7A] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove member"
                      >
                        {removingId === member.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role explanation */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-[#4A4A4A] mb-3">About team roles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F6C98D]/30 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-4 h-4 text-[#8B6914]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]">Owner</p>
                  <p className="text-xs text-[#7A7A7A]">
                    Full access — can edit NGO profile, manage team, create experiences, and view applicants.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C9F0EF] flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-[#168E8C]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]">Staff</p>
                  <p className="text-xs text-[#7A7A7A]">
                    Can create and manage experiences and view applicants. Cannot edit NGO profile or manage team.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
