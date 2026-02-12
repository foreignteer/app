import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Foreignteer',
  description: 'Learn about Foreignteer\'s privacy policy. Understand how we collect, use, and protect your personal information.',
  openGraph: {
    title: 'Privacy Policy - Foreignteer',
    url: 'https://www.foreignteer.com/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF5EC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-[#2C3E3A] mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <p className="text-sm text-[#7A7A7A] mb-6">
              Last Updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              At Foreignteer, we are committed to protecting your privacy and personal data. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3 mt-4">1.1 Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
              <li><strong>Account Information:</strong> Name, email address, password, country of origin</li>
              <li><strong>Profile Information:</strong> Job title, organisation, volunteering experience, phone number</li>
              <li><strong>Emergency Contact:</strong> Name, phone number, relationship</li>
              <li><strong>Booking Information:</strong> Experience selections, application responses, availability</li>
              <li><strong>Payment Information:</strong> Payment details (processed securely through our payment provider)</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3 mt-4">1.2 Information Collected Automatically</h3>
            <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
              <li><strong>Cookies:</strong> See our Cookie Policy for details</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">2. How We Use Your Information</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
              <li>Create and manage your account</li>
              <li>Process bookings and payments</li>
              <li>Connect you with NGO partners</li>
              <li>Send booking confirmations and updates</li>
              <li>Provide customer support</li>
              <li>Improve our platform and services</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">3. How We Share Your Information</h2>

            <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3 mt-4">3.1 With NGO Partners</h3>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              When you book an experience, we share your name, contact information, and application responses
              with the relevant NGO partner to facilitate your volunteering experience.
            </p>

            <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3 mt-4">3.2 With Service Providers</h3>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              We work with third-party service providers who help us operate our platform, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
              <li>Payment processors (Stripe)</li>
              <li>Cloud hosting services (Firebase, Google Cloud)</li>
              <li>Email service providers</li>
              <li>Analytics providers</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3 mt-4">3.3 Legal Requirements</h3>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              We may disclose your information if required by law, court order, or governmental request,
              or to protect our rights, property, or safety.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">4. Data Security</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              We implement appropriate technical and organisational measures to protect your personal data,
              including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication (Firebase Authentication)</li>
              <li>Regular security assessments</li>
              <li>Access controls and monitoring</li>
            </ul>
            <p className="text-[#4A4A4A] leading-relaxed mt-4">
              However, no method of transmission over the internet is 100% secure. We cannot guarantee
              absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">5. Data Retention</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              We retain your personal data for as long as necessary to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
              <li>Provide our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
            <p className="text-[#4A4A4A] leading-relaxed mt-4">
              You can request deletion of your account and data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">6. Your Rights</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct your information</li>
              <li><strong>Deletion:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
            </ul>
            <p className="text-[#4A4A4A] leading-relaxed mt-4">
              To exercise these rights, contact us at info@foreignteer.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">7. Children's Privacy</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              Foreignteer is not intended for users under 18 years of age. We do not knowingly collect
              personal information from children. If we become aware that we have collected data from a
              child, we will take steps to delete it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">8. International Data Transfers</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place to protect your data in accordance with
              this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">9. Changes to This Policy</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">10. Contact Us</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="text-[#4A4A4A] space-y-2">
              <p>Email: <a href="mailto:info@foreignteer.com" className="text-[#21B3B1] hover:underline">info@foreignteer.com</a></p>
              <p>Address: Hong Kong</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
