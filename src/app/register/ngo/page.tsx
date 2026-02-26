'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { validatePassword } from '@/lib/utils/validation';
import { CheckCircle, XCircle, ArrowLeft, Building2 } from 'lucide-react';

const CAUSE_CATEGORIES = [
  'Education',
  'Environment & Sustainability',
  'Community Development',
  'Healthcare',
  'Animal Welfare',
  'Arts & Culture',
  'Human Rights',
  'Poverty Alleviation',
  'Children & Youth',
  'Elderly Care',
  'Disability Support',
  'Women Empowerment',
  'Refugee & Migration Support',
  'Food Security & Nutrition',
  'Water & Sanitation',
  'Climate Action',
  'Sports & Recreation',
  'Mental Health & Wellbeing',
];

const ENTITY_TYPES = [
  'Registered Charity',
  'Non-Profit Organisation',
  'Social Enterprise',
  'Community Interest Company (CIC)',
  'Foundation',
  'Trust',
  'Association',
  'For-Profit with CSR Programme',
  'Other',
];

export default function RegisterNGOPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(true); // Pre-ticked per GDPR requirement
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Account Information
  const [accountData, setAccountData] = useState({
    contactName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Organisation Information
  const [orgData, setOrgData] = useState({
    name: '',
    description: '',
    entityType: '',
    jurisdiction: '',
    serviceLocations: '',
    website: '',
    contactEmail: '',
    hasInsurance: false,
    insuranceType: '',
    insuranceCoverageLimit: '',
  });

  // Causes (checkboxes)
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [otherCause, setOtherCause] = useState('');

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountData({
      ...accountData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrgChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setOrgData({
      ...orgData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCauseToggle = (cause: string) => {
    setSelectedCauses((prev) =>
      prev.includes(cause) ? prev.filter((c) => c !== cause) : [...prev, cause]
    );
  };

  const validateStep1 = () => {
    if (!accountData.contactName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!accountData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (accountData.password !== accountData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    const passwordValidation = validatePassword(accountData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join('. '));
      return false;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!orgData.name.trim()) {
      setError('Please enter your organisation name');
      return false;
    }
    if (!orgData.description.trim()) {
      setError('Please provide a description of your organisation');
      return false;
    }
    if (!orgData.entityType) {
      setError('Please select your entity type');
      return false;
    }
    if (!orgData.jurisdiction.trim()) {
      setError('Please enter your jurisdiction');
      return false;
    }
    if (!orgData.serviceLocations.trim()) {
      setError('Please enter at least one service location');
      return false;
    }
    if (!orgData.contactEmail.trim()) {
      setError('Please enter a contact email address');
      return false;
    }
    if (selectedCauses.length === 0 && !otherCause.trim()) {
      setError('Please select at least one cause category');
      return false;
    }
    if (selectedCauses.includes('Other') && !otherCause.trim()) {
      setError('Please specify your cause category');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare the registration data
      const finalCauses = [...selectedCauses];
      if (selectedCauses.includes('Other') && otherCause.trim()) {
        // Replace "Other" with the actual custom cause
        const index = finalCauses.indexOf('Other');
        finalCauses[index] = `Other: ${otherCause.trim()}`;
      }

      const registrationData = {
        // Account info
        contactName: accountData.contactName,
        email: accountData.email,
        password: accountData.password,
        // Organisation info
        name: orgData.name,
        description: orgData.description,
        entityType: orgData.entityType,
        jurisdiction: orgData.jurisdiction,
        serviceLocations: orgData.serviceLocations.split(',').map((loc) => loc.trim()),
        website: orgData.website || undefined,
        contactEmail: orgData.contactEmail,
        causes: finalCauses,
        // Insurance info
        hasInsurance: orgData.hasInsurance,
        insuranceType: orgData.hasInsurance ? orgData.insuranceType : null,
        insuranceCoverageLimit: orgData.hasInsurance ? orgData.insuranceCoverageLimit : null,
      };

      const response = await fetch('/api/register/ngo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register organisation');
      }

      // Subscribe to newsletter if consent given
      if (marketingConsent) {
        try {
          await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: accountData.email,
              name: accountData.contactName || orgData.name,
              source: 'ngo-registration',
              userId: data.userId, // Assuming API returns userId
            }),
          });
        } catch (newsletterErr) {
          // Don't fail registration if newsletter subscription fails
          console.error('Newsletter subscription error:', newsletterErr);
        }
      }

      // Redirect to success page or login
      router.push('/register/ngo/success');
    } catch (err: any) {
      console.error('NGO registration error:', err);
      if (err.message.includes('email-already-in-use')) {
        setError('This email is already registered. Please sign in instead.');
      } else {
        setError(err.message || 'Failed to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Partner With Foreignteer</CardTitle>
                <p className="text-text-muted mt-1">
                  Register your NGO to create volunteering experiences
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mt-6">
              <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`} />
              <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={step >= 1 ? 'text-primary font-medium' : 'text-text-muted'}>
                Account
              </span>
              <span className={step >= 2 ? 'text-primary font-medium' : 'text-text-muted'}>
                Organisation
              </span>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                {error}
              </div>
            )}

            {/* Step 1: Account Information */}
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Account Information
                  </h3>

                  <div className="space-y-4">
                    <Input
                      id="contactName"
                      name="contactName"
                      type="text"
                      label="Full Name"
                      value={accountData.contactName}
                      onChange={handleAccountChange}
                      placeholder="John Doe"
                      required
                      helperText="Primary contact person for this organisation"
                    />

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      label="Email Address"
                      value={accountData.email}
                      onChange={handleAccountChange}
                      placeholder="you@ngo.org"
                      required
                      helperText="This will be your login email"
                    />

                    <div>
                      <PasswordInput
                        id="password"
                        name="password"
                        label="Password"
                        value={accountData.password}
                        onChange={(e) => {
                          handleAccountChange(e);
                          if (!passwordTouched) setPasswordTouched(true);
                        }}
                        onBlur={() => setPasswordTouched(true)}
                        placeholder="••••••••"
                        required
                      />

                      {passwordTouched && accountData.password && (
                        <div className="mt-2 text-sm space-y-1">
                          <div className={`flex items-center gap-2 ${accountData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                            {accountData.password.length >= 8 ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            <span>At least 8 characters</span>
                          </div>
                          <div className={`flex items-center gap-2 ${/[a-zA-Z]/.test(accountData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                            {/[a-zA-Z]/.test(accountData.password) ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            <span>Contains letters</span>
                          </div>
                          <div className={`flex items-center gap-2 ${/[0-9]/.test(accountData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                            {/[0-9]/.test(accountData.password) ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            <span>Contains numbers</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <PasswordInput
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm Password"
                      value={accountData.confirmPassword}
                      onChange={handleAccountChange}
                      placeholder="••••••••"
                      required
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
                          I'd like to receive updates about volunteer opportunities, partnership tips, and platform news from Foreignteer (you can unsubscribe anytime)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Link href="/register">
                    <Button variant="ghost">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Registration
                    </Button>
                  </Link>
                  <Button type="submit">
                    Next: Organisation Details
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: Organisation Information */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Organisation Information
                  </h3>

                  <div className="space-y-4">
                    <Input
                      id="name"
                      name="name"
                      label="Organisation Name"
                      value={orgData.name}
                      onChange={handleOrgChange}
                      placeholder="e.g., Global Impact Foundation"
                      required
                    />

                    <Textarea
                      id="description"
                      name="description"
                      label="Description"
                      value={orgData.description}
                      onChange={handleOrgChange}
                      rows={4}
                      placeholder="Tell us about your organisation's mission and work..."
                      required
                      helperText="Minimum 50 characters"
                    />

                    <div>
                      <label
                        htmlFor="entityType"
                        className="block text-sm font-medium text-text-primary mb-2"
                      >
                        Entity Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="entityType"
                        name="entityType"
                        value={orgData.entityType}
                        onChange={handleOrgChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Select entity type...</option>
                        {ENTITY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-sm text-text-muted">
                        Legal structure of your organisation
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        id="jurisdiction"
                        name="jurisdiction"
                        label="Jurisdiction"
                        value={orgData.jurisdiction}
                        onChange={handleOrgChange}
                        placeholder="e.g., United Kingdom"
                        required
                        helperText="Country where your NGO is registered"
                      />

                      <Input
                        id="serviceLocations"
                        name="serviceLocations"
                        label="Service Locations"
                        value={orgData.serviceLocations}
                        onChange={handleOrgChange}
                        placeholder="e.g., London, Manchester, Birmingham"
                        required
                        helperText="Comma-separated list of cities"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        label="Organisation Contact Email"
                        value={orgData.contactEmail}
                        onChange={handleOrgChange}
                        placeholder="contact@ngo.org"
                        required
                        helperText="Public contact email for volunteers"
                      />

                      <Input
                        id="website"
                        name="website"
                        type="url"
                        label="Website (Optional)"
                        value={orgData.website}
                        onChange={handleOrgChange}
                        placeholder="https://www.ngo.org"
                      />
                    </div>

                    {/* Insurance Information */}
                    <div className="border-t pt-4 mt-4">
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
                        Insurance Coverage
                      </label>
                      <p className="text-sm text-[#7A7A7A] mb-4">
                        To ensure volunteer safety, we encourage NGOs to have appropriate insurance coverage for activities.
                      </p>

                      <div className="flex items-start mb-4">
                        <div className="flex items-center h-5">
                          <input
                            id="hasInsurance"
                            name="hasInsurance"
                            type="checkbox"
                            checked={orgData.hasInsurance}
                            onChange={(e) => {
                              setOrgData({
                                ...orgData,
                                hasInsurance: e.target.checked,
                                insuranceType: e.target.checked ? orgData.insuranceType : '',
                                insuranceCoverageLimit: e.target.checked ? orgData.insuranceCoverageLimit : '',
                              });
                            }}
                            className="h-4 w-4 text-[#21B3B1] focus:ring-[#21B3B1] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="hasInsurance" className="text-sm font-medium text-[#4A4A4A]">
                            We have relevant insurance to cover accidents during our experiences
                          </label>
                          <p className="text-xs text-[#7A7A7A] mt-1">
                            e.g., Public Liability Insurance, Professional Indemnity Insurance
                          </p>
                        </div>
                      </div>

                      {orgData.hasInsurance && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#FAF5EC] border border-[#E6EAEA] rounded-lg">
                          <Input
                            id="insuranceType"
                            name="insuranceType"
                            label="Insurance Type (Optional)"
                            value={orgData.insuranceType}
                            onChange={handleOrgChange}
                            placeholder="e.g., Public Liability Insurance"
                            helperText="Type of insurance coverage"
                          />

                          <Input
                            id="insuranceCoverageLimit"
                            name="insuranceCoverageLimit"
                            label="Coverage Limit (Optional)"
                            value={orgData.insuranceCoverageLimit}
                            onChange={handleOrgChange}
                            placeholder="e.g., £1,000,000 or £5,000,000"
                            helperText="Maximum coverage amount"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Cause Categories *
                      </label>
                      <p className="text-sm text-text-muted mb-3">
                        Select all that apply to your organisation
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {CAUSE_CATEGORIES.map((cause) => (
                          <label
                            key={cause}
                            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedCauses.includes(cause)
                                ? 'border-primary bg-primary-light'
                                : 'border-gray-300 hover:border-primary'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedCauses.includes(cause)}
                              onChange={() => handleCauseToggle(cause)}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="text-sm text-text-primary">{cause}</span>
                          </label>
                        ))}
                        {/* Other option */}
                        <label
                          className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedCauses.includes('Other')
                              ? 'border-primary bg-primary-light'
                              : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCauses.includes('Other')}
                            onChange={() => handleCauseToggle('Other')}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <span className="text-sm text-text-primary">Other</span>
                        </label>
                      </div>
                      {selectedCauses.includes('Other') && (
                        <div className="mt-3">
                          <Input
                            name="otherCause"
                            label="Please specify your cause"
                            value={otherCause}
                            onChange={(e) => setOtherCause(e.target.value)}
                            placeholder="e.g., Technology Education, Marine Conservation"
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                  <p className="font-semibold mb-1">📋 Application Review</p>
                  <p>
                    Your application will be reviewed by our admin team. You'll receive an email
                    notification once your organisation is approved. This typically takes 1-2
                    business days.
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePreviousStep}
                    disabled={loading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={loading}
                    disabled={loading}
                  >
                    Submit Registration
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
