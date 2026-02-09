'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'footer' }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Successfully subscribed!' });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to subscribe' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-gray-200 pb-8 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-5 h-5 text-[#21B3B1]" />
        <h3 className="text-lg font-semibold text-[#4A4A4A]">Stay Updated</h3>
      </div>
      <p className="text-sm text-[#7A7A7A] mb-4">
        Subscribe to our newsletter for new volunteering opportunities, impact stories, and travel tips.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-[#4A4A4A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#21B3B1] focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#21B3B1] hover:bg-[#168E8C] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}

        <p className="text-xs text-[#7A7A7A]">
          By subscribing, you agree to receive marketing emails from Foreignteer.
          You can unsubscribe at any time. View our{' '}
          <a href="/privacy" className="text-[#21B3B1] underline hover:text-[#168E8C]">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
