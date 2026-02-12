'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const { firebaseUser, resendVerificationEmail, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  // Auto-verify if token is present in URL
  useEffect(() => {
    if (token && !verifying && !verified) {
      verifyEmailWithToken(token);
    }
  }, [token]);

  // Redirect if already verified
  useEffect(() => {
    if (firebaseUser?.emailVerified) {
      router.push('/dashboard/user');
    }
  }, [firebaseUser, router]);

  const verifyEmailWithToken = async (token: string) => {
    setVerifying(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setVerified(true);
      setMessage('Email verified successfully! Redirecting to your dashboard...');

      // Refresh user data to get updated emailVerified status
      await refreshUser(true);

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard/user');
      }, 2000);
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify email. The link may be expired or invalid.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    setMessage('');
    setError('');

    try {
      await resendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      console.error('Resend error:', err);
      setError('Failed to send verification email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setMessage('');
    setError('');

    try {
      // Refresh user data
      await refreshUser(true);

      if (firebaseUser?.emailVerified) {
        setMessage('Email verified! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard/user');
        }, 1500);
      } else {
        setError('Email not verified yet. Please click the link in your email.');
      }
    } catch (err) {
      console.error('Verification check error:', err);
      setError('Failed to check verification status. Please try again.');
    }
  };

  // Show loading while verifying with token
  if (token && verifying) {
    return (
      <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="w-12 h-12 text-[#21B3B1] animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-[#4A4A4A]">
                Verifying your email...
              </h2>
              <p className="text-sm text-[#7A7A7A]">
                Please wait while we verify your email address.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success message if verified
  if (verified) {
    return (
      <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#4A4A4A]">
                Email Verified!
              </h2>
              <p className="text-[#7A7A7A]">
                Your email has been successfully verified. Redirecting to your dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading if no user yet
  if (!firebaseUser) {
    return (
      <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-[#21B3B1] animate-spin mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default: Show "check your email" message
  return (
    <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#21B3B1]/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#21B3B1]" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">
            Verify Your Email
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-[#4A4A4A]">
              We've sent a verification email to:
            </p>
            <p className="font-semibold text-[#21B3B1]">
              {firebaseUser.email}
            </p>
            <p className="text-sm text-[#7A7A7A]">
              Please click the link in the email to verify your account and access your dashboard.
            </p>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleCheckVerification}
              fullWidth
            >
              I've Verified My Email
            </Button>

            <Button
              onClick={handleResendEmail}
              variant="outline"
              fullWidth
              isLoading={resending}
              disabled={resending}
            >
              Resend Verification Email
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-[#7A7A7A] mb-3 text-center">
              Didn't receive the email?
            </p>
            <ul className="text-xs text-[#7A7A7A] space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#21B3B1]">•</span>
                <span>Check your spam or junk folder</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#21B3B1]">•</span>
                <span>Make sure you entered the correct email address</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#21B3B1]">•</span>
                <span>Wait a few minutes for the email to arrive</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#21B3B1]">•</span>
                <span>Contact us at <a href="mailto:info@foreignteer.com" className="text-[#21B3B1] hover:underline">info@foreignteer.com</a> if you need help</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
