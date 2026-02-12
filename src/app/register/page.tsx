'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { validatePassword, getPasswordStrength } from '@/lib/utils/validation';
import { CheckCircle, XCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(true); // Pre-ticked per GDPR requirement
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join('. '));
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signUp(formData.email, formData.password, formData.displayName);

      // Send welcome email
      try {
        await fetch('/api/send-email/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            name: formData.displayName,
          }),
        });
      } catch (emailErr) {
        // Don't fail registration if welcome email fails
        console.error('Welcome email error:', emailErr);
      }

      // Subscribe to newsletter if consent given
      if (marketingConsent) {
        try {
          await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              source: 'registration',
              userId: userCredential.user.uid,
            }),
          });
        } catch (newsletterErr) {
          // Don't fail registration if newsletter subscription fails
          console.error('Newsletter subscription error:', newsletterErr);
        }
      }

      // Redirect to email verification page
      router.push('/verify-email');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md" padding="lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Join Foreignteer
          </CardTitle>
          <p className="text-center text-text-muted mt-2">
            Create your account to start volunteering
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
              id="displayName"
              name="displayName"
              type="text"
              label="Full Name"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="John Doe"
              required
              autoComplete="name"
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <div>
              <PasswordInput
                id="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  if (!passwordTouched) setPasswordTouched(true);
                }}
                onBlur={() => setPasswordTouched(true)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />

              {passwordTouched && formData.password && (
                <div className="mt-2 space-y-2">
                  {/* Password Requirements */}
                  <div className="text-sm space-y-1">
                    <div className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                      {formData.password.length >= 8 ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-2 ${/[a-zA-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                      {/[a-zA-Z]/.test(formData.password) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>Contains letters</span>
                    </div>
                    <div className={`flex items-center gap-2 ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                      {/[0-9]/.test(formData.password) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>Contains numbers</span>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => {
                          const { strength } = getPasswordStrength(formData.password);
                          const isActive =
                            (strength === 'weak' && level === 1) ||
                            (strength === 'medium' && level <= 2) ||
                            (strength === 'strong' && level <= 4);

                          return (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                isActive
                                  ? strength === 'weak'
                                    ? 'bg-red-500'
                                    : strength === 'medium'
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <p className={`text-xs ${
                        getPasswordStrength(formData.password).strength === 'weak'
                          ? 'text-red-600'
                          : getPasswordStrength(formData.password).strength === 'medium'
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}>
                        Password strength: {getPasswordStrength(formData.password).strength}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-text-primary">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:text-primary-dark">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:text-primary-dark">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            {/* Marketing Consent - Pre-ticked per UK GDPR */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="marketing"
                  name="marketing"
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="marketing" className="text-text-primary">
                  I'd like to receive updates about new volunteering opportunities, impact stories, and travel tips from Foreignteer (you can unsubscribe anytime)
                </label>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              disabled={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-text-muted">Already have an account? </span>
            <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
              Sign in
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-sm text-text-muted mb-2">Registering as an NGO?</p>
            <Link href="/register/ngo">
              <Button variant="outline" size="sm">
                NGO Registration
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
