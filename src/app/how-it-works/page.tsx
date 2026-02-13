import Link from 'next/link';
import { Metadata } from 'next';
import { Search, Heart, UserCheck, Star, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'How It Works - Foreignteer',
  description: 'Learn how to find and book meaningful micro-volunteering experiences with Foreignteer. Simple steps for volunteers and NGO partners.',
  openGraph: {
    title: 'How Foreignteer Works',
    description: 'Connect with meaningful micro-volunteering experiences in just a few simple steps',
    url: 'https://www.foreignteer.com/how-it-works',
  },
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#21B3B1] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4 text-white">How Foreignteer Works</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Connect with meaningful micro-volunteering experiences in just a few simple steps
          </p>
        </div>
      </div>

      {/* For Volunteers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">For Volunteers</h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Finding and booking meaningful volunteering experiences has never been easier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <Card variant="elevated" className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary text-text-on-primary rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Browse Experiences</h3>
              <p className="text-text-muted">
                Explore our curated collection of micro-volunteering opportunities across different causes and locations
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card variant="elevated" className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary text-text-on-primary rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Find Your Match</h3>
              <p className="text-text-muted">
                Filter by location, cause category, and dates to find experiences that align with your interests and schedule
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card variant="elevated" className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary text-text-on-primary rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Apply Instantly</h3>
              <p className="text-text-muted">
                Create your profile and apply to experiences with just a few clicks. NGOs will review your application
              </p>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card variant="elevated" className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary text-text-on-primary rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Make an Impact</h3>
              <p className="text-text-muted">
                Show up, volunteer, and make a real difference in your community and beyond
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link href="/experiences">
            <Button size="lg">Browse Experiences</Button>
          </Link>
        </div>
      </div>

      {/* For NGOs */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">For NGOs & Organisations</h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Reach passionate volunteers and fill your opportunities quickly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card variant="bordered">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-accent text-text-primary rounded-full flex items-center justify-center text-lg font-bold">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Register Your Organisation</h3>
                <p className="text-text-muted mb-4">
                  Create your NGO profile with information about your mission, causes, and service areas
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Quick approval process
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Public organisation profile
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card variant="bordered">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-accent text-text-primary rounded-full flex items-center justify-center text-lg font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Post Opportunities</h3>
                <p className="text-text-muted mb-4">
                  Create detailed listings for your volunteering experiences with dates, requirements, and capacity
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Unlimited experience listings
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Custom application questions
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card variant="bordered">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-accent text-text-primary rounded-full flex items-center justify-center text-lg font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Manage Applicants</h3>
                <p className="text-text-muted mb-4">
                  Review applications, communicate with volunteers, and track your opportunities from one dashboard
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Easy applicant management
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Export applicant data
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/partner">
              <Button size="lg" variant="secondary">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Why Foreignteer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Why Choose Foreignteer?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card variant="flat">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Quick & Easy</h3>
              <p className="text-text-muted">
                No lengthy applications or commitments. Find and book micro-volunteering experiences in minutes
              </p>
            </CardContent>
          </Card>

          <Card variant="flat">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Global Impact</h3>
              <p className="text-text-muted">
                Connect with verified NGOs and organisations making a difference worldwide
              </p>
            </CardContent>
          </Card>

          <Card variant="flat">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Trusted Platform</h3>
              <p className="text-text-muted">
                All organisations are vetted and approved. Your personal information is kept secure
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#21B3B1] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Make a Difference?</h2>
          <p className="text-xl text-white mb-8">
            Join thousands of volunteers making an impact through micro-volunteering
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Get Started
              </Button>
            </Link>
            <Link href="/experiences">
              <Button size="lg" className="!bg-white !text-[#21B3B1] hover:!bg-gray-100 !border-white">
                Browse Experiences
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
