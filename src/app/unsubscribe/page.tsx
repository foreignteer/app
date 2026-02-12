'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUnsubscribe = async () => {
    if (!email) {
      setError('No email provided');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unsubscribe');
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Unsubscribe error:', err);
      setError(err.message || 'Failed to unsubscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-[#4A4A4A]">No email address provided.</p>
              <Link href="/" className="text-[#21B3B1] hover:underline mt-4 inline-block">
                Return to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">
              Successfully Unsubscribed
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-center text-[#4A4A4A]">
              <strong>{email}</strong> has been removed from our mailing list.
            </p>
            <p className="text-center text-sm text-[#7A7A7A]">
              You'll no longer receive promotional emails (newsletters, travel tips, etc.).
              &#128231; Important: You'll still receive essential transactional emails like booking confirmations, email verification, password resets, and account notifications.
            </p>

            <div className="pt-4">
              <Link href="/">
                <Button fullWidth variant="outline">
                  Return to Home
                </Button>
              </Link>
            </div>
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
            Unsubscribe from Emails
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-[#4A4A4A]">
              Are you sure you want to unsubscribe?
            </p>
            <p className="font-semibold text-[#21B3B1]">
              {email}
            </p>
            <p className="text-sm text-[#7A7A7A]">
              You'll no longer receive updates about volunteering opportunities,
              impact stories, and travel tips from Foreignteer.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleUnsubscribe}
              fullWidth
              isLoading={loading}
              disabled={loading}
              variant="outline"
            >
              Yes, Unsubscribe Me
            </Button>

            <Link href="/">
              <Button fullWidth>
                Never Mind, Keep Me Subscribed
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-[#21B3B1] animate-spin mx-auto" />
          </CardContent>
        </Card>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
