'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Mail, Home } from 'lucide-react';

export default function NGORegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-primary-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl" padding="lg">
        <CardHeader>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-center">
              Registration Submitted Successfully!
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  What Happens Next?
                </h3>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">1.</span>
                    <span>
                      Our admin team will review your organisation's registration within 1-2
                      business days
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">2.</span>
                    <span>
                      You'll receive an email notification once your organisation is approved
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">3.</span>
                    <span>
                      After approval, you can log in and start creating volunteering experiences
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-text-primary mb-3">
              While You Wait
            </h3>
            <ul className="space-y-2 text-sm text-text-primary">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Prepare details about the volunteering experiences you'd like to offer
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Gather photos and descriptions of your past volunteer projects
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Think about the capacity and requirements for your volunteer opportunities
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href="/">
              <Button variant="outline" fullWidth className="sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Back to Homepage
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="primary" fullWidth className="sm:w-auto">
                Go to Login
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-text-muted pt-4 border-t">
            <p>
              Have questions? Email us at{' '}
              <a href="mailto:partner@foreignteer.com" className="text-primary hover:text-primary-dark font-semibold">
                partner@foreignteer.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
