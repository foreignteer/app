'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Users, TrendingUp, CheckCircle, Sparkles, FileCheck, MessageCircle, Calendar, Heart, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    jurisdiction: '',
    serviceLocations: '',
    causes: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: 'partner',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setSuccess(true);
      setFormData({
        organizationName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        jurisdiction: '',
        serviceLocations: '',
        causes: '',
        description: '',
      });
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#21B3B1] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4 text-white">Partner With Foreignteer</h1>
          <p className="text-xl text-white max-w-3xl mx-auto mb-4">
            Join our network of verified NGOs and connect with passionate volunteers ready to make a difference
          </p>
          <p className="text-white/90 mb-8">
            Questions? Contact us at{' '}
            <a href="mailto:partner@foreignteer.com" className="underline hover:text-white font-semibold">
              partner@foreignteer.com
            </a>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/ngo">
              <Button size="lg" className="min-w-[200px] bg-white text-[#21B3B1] hover:bg-[#F6C98D] hover:text-[#2C3E3A] border-2 border-white font-semibold">
                <Building2 className="w-5 h-5 mr-2" />
                Register Your NGO
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="min-w-[200px] !bg-transparent border-2 border-white text-white hover:!bg-[#168E8C] hover:border-[#168E8C] font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works for NGOs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#4A4A4A] mb-4">How It Works</h2>
          <p className="text-lg text-[#7A7A7A] max-w-2xl mx-auto">
            From registration to impact in four simple steps
          </p>
        </div>

        <div className="space-y-16">
          {[
            {
              number: '01',
              icon: FileCheck,
              title: 'Register & Get Verified',
              description: 'Complete our simple registration form with your organization details. Our team reviews and verifies your NGO within 2-3 business days.',
              details: [
                'Quick online registration form',
                'Upload required documents for verification',
                'Get approved within 2-3 business days',
                'Access your dedicated dashboard',
              ],
            },
            {
              number: '02',
              icon: Calendar,
              title: 'Create Experiences',
              description: 'Post your micro-volunteering opportunities with details about the cause, duration, and requirements. Make them as flexible or specific as you need.',
              details: [
                'Create unlimited experiences',
                'Set schedules and capacity',
                'Add custom application questions',
                'Upload photos and descriptions',
              ],
            },
            {
              number: '03',
              icon: MessageCircle,
              title: 'Review Applications',
              description: 'Receive applications from engaged volunteers. Review their profiles, communicate directly, and approve the best fits for your opportunities.',
              details: [
                'Get instant email notifications',
                'Review volunteer profiles and experience',
                'Approve or decline applications',
                'Communicate directly with volunteers',
              ],
            },
            {
              number: '04',
              icon: Heart,
              title: 'Host & Impact',
              description: 'Welcome volunteers to your cause. Host meaningful experiences that advance your mission while providing cultural exchange for travelers.',
              details: [
                'Receive enthusiastic volunteers',
                'Share your cause and impact',
                'Build lasting connections',
                'Grow your organization\'s reach',
              ],
            },
          ].map((step, index) => (
            <div key={step.number} className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="inline-flex items-center gap-3 mb-6">
                  <span className="text-sm font-bold text-[#F6C98D]">{step.number}</span>
                  <div className="w-10 h-10 bg-[#21B3B1]/10 rounded-xl flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-[#21B3B1]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#4A4A4A] mb-4">{step.title}</h3>
                <p className="text-lg text-[#7A7A7A] mb-6 leading-relaxed">{step.description}</p>
                <ul className="space-y-3">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#21B3B1] flex-shrink-0 mt-0.5" />
                      <span className="text-[#7A7A7A]">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="bg-[#C9F0EF] rounded-2xl p-8 h-64 flex items-center justify-center">
                  <step.icon className="w-24 h-24 text-[#21B3B1]/30" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What to Expect Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4A4A4A] mb-4">What to Expect as a Partner</h2>
            <p className="text-lg text-[#7A7A7A] max-w-2xl mx-auto">
              Every experience is designed to be simple, effective, and impactful for your organization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-[#FAF5EC] rounded-2xl border border-[#E6EAEA]">
              <div className="w-14 h-14 bg-[#21B3B1]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-[#21B3B1]" />
              </div>
              <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">1-4 Hours</h3>
              <p className="text-[#7A7A7A] text-sm">
                Flexible micro-volunteering sessions that fit busy schedules while making real impact
              </p>
            </div>

            <div className="text-center p-8 bg-[#FAF5EC] rounded-2xl border border-[#E6EAEA]">
              <div className="w-14 h-14 bg-[#21B3B1]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-[#21B3B1]" />
              </div>
              <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">Engaged Volunteers</h3>
              <p className="text-[#7A7A7A] text-sm">
                Connect with passionate travelers who truly care about making a difference in your community
              </p>
            </div>

            <div className="text-center p-8 bg-[#FAF5EC] rounded-2xl border border-[#E6EAEA]">
              <div className="w-14 h-14 bg-[#21B3B1]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[#21B3B1]" />
              </div>
              <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">Full Support</h3>
              <p className="text-[#7A7A7A] text-sm">
                Our team is here to help with onboarding, technical support, and growing your impact
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Why Partner With Us?</h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Foreignteer helps NGOs reach engaged volunteers and fill opportunities quickly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card variant="elevated" className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Access Volunteers</h3>
              <p className="text-text-muted">
                Tap into our growing community of skilled, passionate volunteers ready to contribute to your cause
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated" className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Grow Your Impact</h3>
              <p className="text-text-muted">
                Increase your organization's visibility and reach more people who care about your mission
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated" className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Simple Management</h3>
              <p className="text-text-muted">
                Easily post opportunities, review applications, and manage volunteers from one intuitive dashboard
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-text-primary mb-6">What You Get</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Dedicated organization profile page',
              'Unlimited experience listings',
              'Applicant management dashboard',
              'Custom application forms',
              'Email notifications for new applicants',
              'Export applicant data to CSV',
              'Priority support from our team',
              'Analytics and insights (coming soon)',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-text-primary">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#FAF5EC] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4A4A4A] mb-4">Common Questions</h2>
            <p className="text-lg text-[#7A7A7A]">
              Everything you need to know about partnering with Foreignteer
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'Is there a cost to join?',
                answer: 'Registration and basic platform access are completely free. We charge a small service fee per confirmed booking to support platform maintenance and growth.',
              },
              {
                question: 'What types of organizations can join?',
                answer: 'We work with registered nonprofits, NGOs, charities, and community organizations that have a clear social or environmental mission and can provide safe, meaningful volunteer experiences.',
              },
              {
                question: 'How long does verification take?',
                answer: 'Most organizations are reviewed and verified within 2-3 business days. We may request additional documentation if needed to ensure volunteer safety and program quality.',
              },
              {
                question: 'Can we choose which volunteers to accept?',
                answer: 'Absolutely! You have full control over your applicant review process. You can approve or decline applications, ask follow-up questions, and set specific requirements for your experiences.',
              },
              {
                question: 'What if we need to cancel an experience?',
                answer: 'You can cancel experiences through your dashboard. We ask that you notify confirmed volunteers as soon as possible. Our team is here to help manage any communication needed.',
              },
              {
                question: 'What are the service fees and how do programme fees work?',
                answer: 'You can add a programme fee to your experiences to cover operational costs. Foreignteer charges a service fee to cover platform operations. If you collect programme fees, we process payments and distribute them to you quarterly, minus transaction fees.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-[#E6EAEA]">
                <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">{faq.question}</h3>
                <p className="text-[#7A7A7A]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-text-primary mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-text-muted mb-6">
              Register your NGO directly to get immediate access to our platform
            </p>
            <Link href="/register/ngo">
              <Button size="lg" variant="primary">
                <Building2 className="w-5 h-5 mr-2" />
                Complete Registration Form
              </Button>
            </Link>
            <p className="text-sm text-text-muted mt-4">
              Or fill out the enquiry form below if you have questions first
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    Thank you for your application! We'll review it and get back to you within 2-3 business days.
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Organisation Information</h3>
                  <div className="space-y-4">
                    <Input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      label="Organisation Name"
                      value={formData.organizationName}
                      onChange={handleChange}
                      placeholder="Your NGO name"
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        id="jurisdiction"
                        name="jurisdiction"
                        type="text"
                        label="Registered Jurisdiction"
                        value={formData.jurisdiction}
                        onChange={handleChange}
                        placeholder="e.g., United Kingdom"
                        required
                      />

                      <Input
                        id="serviceLocations"
                        name="serviceLocations"
                        type="text"
                        label="Service Locations"
                        value={formData.serviceLocations}
                        onChange={handleChange}
                        placeholder="e.g., London, Manchester"
                        required
                        helperText="Separate multiple locations with commas"
                      />
                    </div>

                    <Input
                      id="causes"
                      name="causes"
                      type="text"
                      label="Cause Categories"
                      value={formData.causes}
                      onChange={handleChange}
                      placeholder="e.g., Education, Environment"
                      required
                      helperText="Separate multiple causes with commas"
                    />

                    <Input
                      id="website"
                      name="website"
                      type="url"
                      label="Website (Optional)"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourorganization.org"
                    />

                    <Textarea
                      id="description"
                      name="description"
                      label="Organisation Description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tell us about your organization, mission, and impact..."
                      rows={4}
                      required
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <Input
                      id="contactName"
                      name="contactName"
                      type="text"
                      label="Contact Person Name"
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@organization.org"
                        required
                      />

                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        label="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+44 20 1234 5678"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={loading}
                    disabled={loading}
                  >
                    Submit Application
                  </Button>
                </div>

                <p className="text-xs text-text-muted text-center">
                  By submitting this form, you agree to our{' '}
                  <Link href="/terms" className="text-primary hover:text-primary-dark">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:text-primary-dark">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card variant="elevated" className="bg-gradient-to-r from-primary to-primary-dark text-text-on-primary">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Already a Partner?</h2>
            <p className="text-xl text-primary-light mb-8">
              Sign in to your dashboard to post opportunities and manage applicants
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary">
                Sign In to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
