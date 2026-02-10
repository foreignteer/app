'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { confirmPasswordReset, verifyPasswordResetCode } = useAuth();
  
  const [oobCode, setOobCode] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);

  // Verify the reset code when component mounts
  useEffect(() => {
    const code = searchParams.get('oobCode');
    
    if (!code) {
      setError('Invalid or missing reset code. Please request a new password reset link.');
      setVerifying(false);
      return;
    }

    setOobCode(code);

    // Verify the code is valid and get the associated email
    verifyPasswordResetCode(code)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail);
        setVerifying(false);
      })
      .catch((err) => {
        console.error('Error verifying reset code:', err);
        if (err.code === 'auth/invalid-action-code') {
          setError('This password reset link is invalid or has expired. Please request a new one.');
        } else if (err.code === 'auth/expired-action-code') {
          setError('This password reset link has expired. Please request a new one.');
        } else {
          setError('Failed to verify reset link. Please try again.');
        }
        setVerifying(false);
      });
  }, [searchParams, verifyPasswordResetCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset(oobCode, newPassword);
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login?message=password-reset-success');
      }, 2000);
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (err.code === 'auth/invalid-action-code') {
        setError('This password reset link is invalid or has already been used.');
      } else {
        setError(err.message || 'Failed to reset password. Please try again.');
      }
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#C9F0EF] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md" padding="lg">
          <CardContent>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#21B3B1] mx-auto mb-4"></div>
              <p className="text-[#7A7A7A]">Verifying reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !oobCode) {
    return (
      <div className="min-h-screen bg-[#C9F0EF] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md" padding="lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-[#4A4A4A]">
              Invalid Reset Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
              <Link href="/forgot-password">
                <Button fullWidth>
                  Request New Reset Link
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#C9F0EF] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md" padding="lg">
          <CardHeader>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6FB7A4] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl text-[#4A4A4A]">Password Reset Successful!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-[#7A7A7A]">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <p className="text-sm text-[#7A7A7A]">
                Redirecting to login page...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#C9F0EF] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md" padding="lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-[#4A4A4A]">
            Set New Password
          </CardTitle>
          <p className="text-center text-[#7A7A7A] mt-2">
            Enter your new password for {email}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              id="newPassword"
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoFocus
            />

            <Input
              id="confirmPassword"
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />

            <div className="text-xs text-[#7A7A7A]">
              Password must be at least 6 characters long
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              disabled={loading}
            >
              Reset Password
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="text-[#21B3B1] hover:text-[#168E8C] font-medium">
              ← Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#C9F0EF] flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
