export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF5EC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-[#2C3E3A] mb-8">Cookie Policy</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <p className="text-sm text-[#7A7A7A] mb-6">
              Last Updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              This Cookie Policy explains how Foreignteer ("we", "us", or "our") uses cookies and similar
              technologies when you visit our platform. By using our platform, you consent to the use of
              cookies in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">1. What Are Cookies?</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when
              you visit a website. They help websites remember information about your visit, making it easier
              to use the site and providing us with information about how the site is being used.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">2. Types of Cookies We Use</h2>

            <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3 mt-4">2.1 Strictly Necessary Cookies</h3>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              These cookies are essential for the platform to function properly. They enable core functionality
              such as security, authentication, and network management.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-[#4A4A4A]"><strong>Examples:</strong></p>
              <ul className="list-disc list-inside text-sm text-[#7A7A7A] mt-2 ml-4">
                <li>Authentication cookies (Firebase Auth)</li>
                <li>Session management cookies</li>
                <li>Security cookies</li>
              </ul>
              <p className="text-xs text-[#7A7A7A] mt-3 italic">
                These cookies cannot be disabled as they are required for the platform to work.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3 mt-4">2.2 Functional Cookies</h3>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              These cookies enable enhanced functionality and personalisation, such as remembering your
              preferences and settings.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-[#4A4A4A]"><strong>Examples:</strong></p>
              <ul className="list-disc list-inside text-sm text-[#7A7A7A] mt-2 ml-4">
                <li>Language preferences</li>
                <li>Location settings</li>
                <li>Display preferences (theme, layout)</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3 mt-4">2.3 Analytics Cookies</h3>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              These cookies help us understand how visitors interact with our platform by collecting and
              reporting information anonymously.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-[#4A4A4A]"><strong>Examples:</strong></p>
              <ul className="list-disc list-inside text-sm text-[#7A7A7A] mt-2 ml-4">
                <li>Google Analytics cookies</li>
                <li>Firebase Analytics cookies</li>
                <li>Usage statistics cookies</li>
              </ul>
              <p className="text-xs text-[#7A7A7A] mt-3">
                <strong>Purpose:</strong> To improve our platform and user experience
              </p>
            </div>

            <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3 mt-4">2.4 Marketing Cookies</h3>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              These cookies are used to track visitors across websites to display relevant advertisements
              and measure the effectiveness of marketing campaigns.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-[#4A4A4A]"><strong>Examples:</strong></p>
              <ul className="list-disc list-inside text-sm text-[#7A7A7A] mt-2 ml-4">
                <li>Advertising network cookies</li>
                <li>Social media cookies (Facebook, Instagram, LinkedIn)</li>
                <li>Retargeting cookies</li>
              </ul>
              <p className="text-xs text-[#7A7A7A] mt-3 italic">
                You can opt out of these cookies without affecting platform functionality.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">3. Third-Party Cookies</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              We use services from third-party providers that may set cookies on your device:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
              <li><strong>Google Analytics:</strong> To analyse platform usage and improve our services</li>
              <li><strong>Firebase:</strong> For authentication, hosting, and analytics</li>
              <li><strong>Stripe:</strong> For secure payment processing</li>
              <li><strong>Social Media Platforms:</strong> For social sharing and advertising</li>
            </ul>
            <p className="text-[#4A4A4A] leading-relaxed mt-4">
              These third parties have their own privacy policies and cookie policies. We recommend
              reviewing them to understand how they use your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">4. How Long Do Cookies Last?</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              Cookies can be either:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
              <li>
                <strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser
              </li>
              <li>
                <strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period
                (from days to years) or until you delete them
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">5. Managing Cookies</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              You have the right to decide whether to accept or reject cookies. You can exercise your
              cookie preferences in several ways:
            </p>

            <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3 mt-4">5.1 Browser Settings</h3>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              Most web browsers allow you to control cookies through their settings. You can typically:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
              <li>View and delete cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Block all cookies</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
            <p className="text-[#4A4A4A] leading-relaxed mt-4">
              Please note that blocking or deleting cookies may impact your ability to use certain
              features of our platform.
            </p>

            <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3 mt-4">5.2 Browser-Specific Instructions</h3>
            <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
              <li>
                <strong>Chrome:</strong>{' '}
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#21B3B1] hover:underline"
                >
                  Chrome Cookie Settings
                </a>
              </li>
              <li>
                <strong>Firefox:</strong>{' '}
                <a
                  href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#21B3B1] hover:underline"
                >
                  Firefox Cookie Settings
                </a>
              </li>
              <li>
                <strong>Safari:</strong>{' '}
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#21B3B1] hover:underline"
                >
                  Safari Cookie Settings
                </a>
              </li>
              <li>
                <strong>Edge:</strong>{' '}
                <a
                  href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#21B3B1] hover:underline"
                >
                  Edge Cookie Settings
                </a>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3 mt-4">5.3 Opt-Out Tools</h3>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              For analytics and advertising cookies, you can opt out through:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
              <li>
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#21B3B1] hover:underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
              <li>
                <a
                  href="https://www.youronlinechoices.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#21B3B1] hover:underline"
                >
                  Your Online Choices (EU)
                </a>
              </li>
              <li>
                <a
                  href="https://optout.aboutads.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#21B3B1] hover:underline"
                >
                  Digital Advertising Alliance Opt-out
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">6. Do Not Track Signals</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              Some browsers include a "Do Not Track" (DNT) feature. Currently, there is no industry
              standard for how DNT signals should be interpreted. Foreignteer does not currently
              respond to DNT signals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">7. Changes to This Cookie Policy</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices
              or for other operational, legal, or regulatory reasons. Please revisit this page
              periodically to stay informed about our use of cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2C3E3A] mb-4">8. More Information</h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              For more information about our privacy practices, please see our{' '}
              <a href="/privacy" className="text-[#21B3B1] hover:underline">
                Privacy Policy
              </a>
              .
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <p className="text-[#4A4A4A]">
              Email:{' '}
              <a href="mailto:privacy@foreignteer.com" className="text-[#21B3B1] hover:underline">
                privacy@foreignteer.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
