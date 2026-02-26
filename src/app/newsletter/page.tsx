'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Mail, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

export default function NewsletterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interests: [] as string[],
  });
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const interestOptions = [
    { value: 'volunteering', label: 'Volunteering opportunities' },
    { value: 'travel', label: 'Travel tips & guides' },
    { value: 'impact', label: 'Impact stories & success cases' },
    { value: 'ngo', label: 'NGO partnerships' },
    { value: 'events', label: 'Events & workshops' },
  ];

  const handleInterestToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!marketingConsent) {
      setError('Please agree to receive marketing emails');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          source: 'newsletter-page',
          name: formData.name,
          interests: formData.interests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to subscribe. Please try again.');
        return;
      }

      setSuccess(true);
      setFormData({ name: '', email: '', interests: [] });
      setMarketingConsent(false);
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md" padding="lg">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-[#21B3B1] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-2">
              Welcome to Foreignteer!
            </h2>
            <p className="text-[#7A7A7A] mb-6">
              Thank you for subscribing! You'll receive updates about volunteering opportunities, travel tips, and impact stories.
            </p>
            <div className="space-y-3">
              <Link href="/experiences">
                <Button fullWidth>
                  Explore Experiences
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" fullWidth>
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md" padding="lg">
        <CardHeader>
          <div className="w-12 h-12 bg-[#21B3B1] rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-center text-2xl">
            Stay Updated with Foreignteer
          </CardTitle>
          <p className="text-center text-[#7A7A7A] mt-2">
            Get the latest volunteering opportunities, travel tips, and impact stories delivered to your inbox.
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
              id="name"
              name="name"
              type="text"
              label="Name (optional)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              autoComplete="name"
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
                What are you interested in? (optional)
              </label>
              <div className="space-y-2">
                {interestOptions.map((option) => (
                  <div key={option.value} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={option.value}
                        type="checkbox"
                        checked={formData.interests.includes(option.value)}
                        onChange={() => handleInterestToggle(option.value)}
                        className="h-4 w-4 text-[#21B3B1] focus:ring-[#21B3B1] border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor={option.value} className="text-sm text-[#4A4A4A]">
                        {option.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="marketing"
                  name="marketing"
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="h-4 w-4 text-[#21B3B1] focus:ring-[#21B3B1] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="marketing" className="text-[#4A4A4A]">
                  I agree to receive marketing emails from Foreignteer. You can unsubscribe anytime.{' '}
                  <Link href="/privacy" className="text-[#21B3B1] hover:text-[#168E8C]">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              disabled={loading}
            >
              Subscribe to Newsletter
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#7A7A7A]">
            <p>
              Already have an account?{' '}
              <Link href="/login" className="text-[#21B3B1] hover:text-[#168E8C] font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
