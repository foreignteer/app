'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface InviteInfo {
  valid: boolean;
  ngoId?: string;
  ngoName?: string;
  invitedEmail?: string;
  ngoRole?: string;
  reason?: string;
}

function JoinNGOContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      setInviteInfo({ valid: false, reason: 'no_token' });
      setLoading(false);
      return;
    }

    fetch(`/api/join-ngo?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        setInviteInfo(data);
      })
      .catch(() => {
        setInviteInfo({ valid: false, reason: 'error' });
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/join-ngo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, displayName: displayName.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      router.push('/verify-email');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#C9F0EF] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#21B3B1] animate-spin" />
      </div>
    );
  }

  const invalidReason = !inviteInfo?.valid ? inviteInfo?.reason : null;

  if (invalidReason) {
    const messages: Record<string, { title: string; body: string }> = {
      not_found: {
        title: 'Invitation not found',
        body: 'This invite link is invalid. Please ask your NGO owner to send a new invitation.',
      },
      already_used: {
        title: 'Invitation already used',
        body: 'This invite link has already been used. Each invitation can only be used once.',
      },
      expired: {
        title: 'Invitation expired',
        body: 'This invite link expired after 72 hours. Please ask your NGO owner to send a new invitation.',
      },
      no_token: {
        title: 'No invitation found',
        body: 'Please use the invitation link sent to your email.',
      },
      error: {
        title: 'Something went wrong',
        body: 'We could not validate your invitation. Please try again or contact support.',
      },
    };

    const msg = messages[invalidReason] || messages.error;

    return (
      <div className="min-h-screen bg-[#C9F0EF] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-[#4A4A4A] mb-2">{msg.title}</h1>
          <p className="text-[#7A7A7A] mb-6">{msg.body}</p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-[#21B3B1] text-white rounded-lg hover:bg-[#168E8C] transition-colors font-medium"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#C9F0EF] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#21B3B1] px-8 py-6 text-center">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/images/foreignteer-logo.png"
              alt="Foreignteer"
              width={140}
              height={40}
              className="brightness-0 invert"
            />
          </Link>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">You've been invited!</h1>
          <p className="text-white/80 text-sm mt-1">Join {inviteInfo?.ngoName} on Foreignteer</p>
        </div>

        {/* Invite info */}
        <div className="px-8 py-4 bg-[#FAF5EC] border-b border-[#E6EAEA]">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#21B3B1] flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#4A4A4A]">{inviteInfo?.ngoName}</p>
              <p className="text-xs text-[#7A7A7A]">
                Joining as <span className="capitalize font-medium text-[#21B3B1]">{inviteInfo?.ngoRole}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          <p className="text-sm text-[#7A7A7A] -mt-2">
            Create your account to get started. Your email address is pre-filled from the invitation.
          </p>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Email address</label>
            <input
              type="email"
              value={inviteInfo?.invitedEmail || ''}
              readOnly
              className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg bg-[#FAF5EC] text-[#7A7A7A] cursor-not-allowed"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Full name</label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your full name"
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-[#7A7A7A]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Confirm password</label>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-3 flex items-center text-[#7A7A7A]"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            isLoading={submitting}
            className="w-full !bg-[#21B3B1] hover:!bg-[#168E8C] !text-white !border-[#21B3B1]"
          >
            Create Account & Join {inviteInfo?.ngoName}
          </Button>

          <p className="text-xs text-[#7A7A7A] text-center">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-[#21B3B1] hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[#21B3B1] hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function JoinNGOPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#C9F0EF] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#21B3B1] animate-spin" />
        </div>
      }
    >
      <JoinNGOContent />
    </Suspense>
  );
}
