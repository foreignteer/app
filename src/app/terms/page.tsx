import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Foreignteer',
  description: 'Read Foreignteer\'s terms of service. Learn about our platform rules, user responsibilities, and service conditions.',
  alternates: { canonical: 'https://foreignteer.com/terms' },
  openGraph: {
    title: 'Terms of Service - Foreignteer',
    url: 'https://www.foreignteer.com/terms',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#FAF5EC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-[#2C3E3A] mb-8">Terms of Service</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <p className="text-sm text-[#7A7A7A] mb-6">
              Last Updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              Welcome to Foreignteer. By accessing or using our platform, you agree to be bound by these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">1. Acceptance of Terms</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              By creating an account or using Foreignteer's services, you acknowledge that you have read, understood,
              and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms,
              please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">2. User Accounts</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              <strong>Registration:</strong> You must provide accurate, current, and complete information during registration.
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account.
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              <strong>Age Requirement:</strong> You must be at least 18 years old to use Foreignteer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">3. Volunteer Experiences</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              <strong>Booking:</strong> When you book an experience, you agree to attend at the scheduled time and
              follow the NGO's guidelines and instructions.
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              <strong>Cancellation:</strong> Cancellation policies vary by experience. Please review the specific
              cancellation policy before booking.
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              <strong>Platform Fee:</strong> Foreignteer charges a platform service fee of £15 per booking.
              This fee is non-refundable except as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">4. NGO Partners</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              <strong>Verification:</strong> While we vet all NGO partners, Foreignteer is not responsible for
              the actions, quality, or safety of experiences provided by partner organisations.
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              <strong>Direct Relationship:</strong> The volunteering relationship is between you and the NGO.
              Foreignteer acts as a platform facilitator.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">5. User Conduct</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
              <li>Violate any laws or regulations</li>
              <li>Harass, abuse, or harm other users or NGO staff</li>
              <li>Provide false or misleading information</li>
              <li>Attempt to gain unauthorized access to the platform</li>
              <li>Use the platform for commercial purposes without authorization</li>
              <li>Post inappropriate, offensive, or harmful content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">6. Intellectual Property</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              All content on the Foreignteer platform, including text, graphics, logos, and software, is the property
              of Foreignteer or its licensors and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">7. Disclaimers and Limitation of Liability</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              <strong>As Is Basis:</strong> Foreignteer is provided "as is" without warranties of any kind, either express or implied.
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              <strong>No Liability:</strong> To the fullest extent permitted by law, Foreignteer shall not be liable
              for any indirect, incidental, special, or consequential damages arising from your use of the platform or
              participation in experiences.
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              <strong>Insurance:</strong> You are responsible for obtaining appropriate travel and health insurance.
              Foreignteer does not provide insurance coverage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">8. Indemnification</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              You agree to indemnify and hold harmless Foreignteer, its officers, directors, employees, and agents
              from any claims, damages, losses, or expenses arising from your use of the platform or participation
              in experiences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">9. Termination</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              Foreignteer reserves the right to suspend or terminate your account at any time for violation of these
              terms or for any other reason at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">10. Changes to Terms</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              We may update these Terms of Service from time to time. Continued use of the platform after changes
              are posted constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">11. Governing Law</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              These Terms of Service shall be governed by and construed in accordance with the laws of England and Wales,
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">12. Contact Us</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-[#4A4A4A]">
              Email: <a href="mailto:info@foreignteer.com" className="text-[#21B3B1] hover:underline">info@foreignteer.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
