'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const { firebaseUser, resendVerificationEmail } = useAuth();
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [checkingVerification, setCheckingVerification] = useState(false);

  useEffect(() => {
    // If user is already verified, redirect to dashboard
    if (firebaseUser?.emailVerified) {
      router.push('/dashboard/user');
    }
  }, [firebaseUser, router]);

  const handleResendEmail = async () => {
    setResending(true);
    setMessage('');
    setError('');

    try {
      await resendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      console.error('Resend error:', err);
      if (err.message?.includes('too-many-requests')) {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else {
        setError('Failed to send verification email. Please try again.');
      }
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setCheckingVerification(true);
    setMessage('');
    setError('');

    try {
      // Reload the user to get fresh emailVerified status
      await firebaseUser?.reload();

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
    } finally {
      setCheckingVerification(false);
    }
  };

  if (!firebaseUser) {
    return (
      <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-[#7A7A7A]">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              isLoading={checkingVerification}
              disabled={checkingVerification}
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

          <div className="pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-[#7A7A7A] mb-3">
              Didn't receive the email?
            </p>
            <ul className="text-xs text-[#7A7A7A] space-y-1 text-left">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Wait a few minutes for the email to arrive</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
