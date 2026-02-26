import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Calendar, Clock, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund Policy | Foreignteer',
  description: 'Understand our refund and cancellation policy for volunteering experiences, compliant with UK consumer law.',
  alternates: { canonical: 'https://foreignteer.com/refund-policy' },
  openGraph: {
    title: 'Refund Policy | Foreignteer',
    description: 'Our fair and transparent refund policy for micro-volunteering experiences',
    url: 'https://foreignteer.com/refund-policy',
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF5EC]">
      {/* Header */}
      <div className="bg-[#21B3B1] text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-start gap-4 mb-4">
            <Shield className="w-10 h-10 flex-shrink-0" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
              <p className="text-[#C9F0EF] text-lg">
                Fair, transparent, and compliant with UK consumer law
              </p>
            </div>
          </div>
          <p className="text-sm text-[#C9F0EF] mt-4">
            Last Updated: 7 February 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-white rounded-lg p-6 border border-[#E6EAEA]">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-[#21B3B1] flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-[#4A4A4A] mb-3">Your Consumer Rights</h2>
                <p className="text-[#7A7A7A] mb-3">
                  At Foreignteer, we are committed to protecting your rights as a consumer under UK law,
                  including the Consumer Rights Act 2015 and the Consumer Contracts (Information, Cancellation
                  and Additional Charges) Regulations 2013.
                </p>
                <p className="text-[#7A7A7A]">
                  This policy explains your right to cancel bookings and receive refunds for volunteering
                  experiences purchased through our platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 14-Day Cooling-Off Period */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#21B3B1]" />
            14-Day Cooling-Off Period
          </h2>
          <div className="bg-white rounded-lg p-6 border border-[#E6EAEA] space-y-4">
            <p className="text-[#7A7A7A]">
              Under UK consumer law, you have the right to cancel your booking within 14 days of purchase
              (the "cooling-off period") for any reason, provided the volunteering experience has not yet
              taken place.
            </p>

            <div className="bg-[#C9F0EF] rounded-lg p-4">
              <h3 className="font-semibold text-[#4A4A4A] mb-2">How to Exercise Your Right to Cancel:</h3>
              <ul className="space-y-2 text-sm text-[#4A4A4A]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#21B3B1] flex-shrink-0 mt-0.5" />
                  <span>Email us at <a href="mailto:refunds@foreignteer.com" className="text-[#21B3B1] underline">refunds@foreignteer.com</a> with your booking reference</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#21B3B1] flex-shrink-0 mt-0.5" />
                  <span>Or use the "Cancel Booking" button in your dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#21B3B1] flex-shrink-0 mt-0.5" />
                  <span>State clearly that you wish to cancel your booking</span>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-[#F2B56B] bg-[#FFF3CD] p-4 rounded">
              <p className="text-sm text-[#4A4A4A]">
                <strong>Important:</strong> If the volunteering experience is scheduled to take place within
                the 14-day cooling-off period and you request the experience to proceed before the 14 days
                have elapsed, you acknowledge that you waive your right to cancel without charge once the
                experience has fully begun with your express consent.
              </p>
            </div>
          </div>
        </section>

        {/* Cancellation Windows */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#21B3B1]" />
            Cancellation Windows & Refunds
          </h2>
          <div className="bg-white rounded-lg border border-[#E6EAEA] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#21B3B1] text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Cancellation Timing</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Refund Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Processing Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6EAEA]">
                  <tr className="hover:bg-[#FAF5EC]">
                    <td className="px-6 py-4 text-sm text-[#4A4A4A]">
                      <strong>7+ days before experience</strong>
                      <p className="text-xs text-[#7A7A7A] mt-1">Cancel a week or more in advance</p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center gap-1 text-[#6FB7A4] font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        100% refund
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#7A7A7A]">None</td>
                  </tr>
                  <tr className="hover:bg-[#FAF5EC]">
                    <td className="px-6 py-4 text-sm text-[#4A4A4A]">
                      <strong>3-6 days before experience</strong>
                      <p className="text-xs text-[#7A7A7A] mt-1">Cancel 3-6 days in advance</p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center gap-1 text-[#21B3B1] font-semibold">
                        75% refund
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#7A7A7A]">25% retained</td>
                  </tr>
                  <tr className="hover:bg-[#FAF5EC]">
                    <td className="px-6 py-4 text-sm text-[#4A4A4A]">
                      <strong>24-72 hours before experience</strong>
                      <p className="text-xs text-[#7A7A7A] mt-1">Late cancellation notice</p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center gap-1 text-[#F2B56B] font-semibold">
                        50% refund
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#7A7A7A]">50% retained</td>
                  </tr>
                  <tr className="hover:bg-[#FAF5EC]">
                    <td className="px-6 py-4 text-sm text-[#4A4A4A]">
                      <strong>Less than 24 hours or no-show</strong>
                      <p className="text-xs text-[#7A7A7A] mt-1">Very late cancellation or failure to attend</p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center gap-1 text-[#4A4A4A] font-semibold">
                        No refund
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#7A7A7A]">100% retained</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-sm text-[#7A7A7A] mt-4">
            * Times are based on the scheduled start time of the volunteering experience in the local time zone.
          </p>
        </section>

        {/* Exceptional Circumstances */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4">Exceptional Circumstances</h2>
          <div className="bg-white rounded-lg p-6 border border-[#E6EAEA] space-y-4">
            <p className="text-[#7A7A7A]">
              We understand that unforeseen circumstances may prevent you from attending a booked experience.
              Full refunds may be granted regardless of timing in the following situations:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#21B3B1] mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-[#4A4A4A]">Medical Emergencies</h3>
                  <p className="text-sm text-[#7A7A7A]">
                    Serious illness, injury, or medical emergency affecting you or an immediate family member
                    (medical documentation may be required)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#21B3B1] mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-[#4A4A4A]">Travel Disruptions</h3>
                  <p className="text-sm text-[#7A7A7A]">
                    Flight cancellations, natural disasters, or government travel restrictions preventing you
                    from reaching the experience location
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#21B3B1] mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-[#4A4A4A]">Bereavement</h3>
                  <p className="text-sm text-[#7A7A7A]">
                    Death of an immediate family member
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#21B3B1] mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-[#4A4A4A]">NGO Cancellation</h3>
                  <p className="text-sm text-[#7A7A7A]">
                    The NGO cancels the experience for any reason
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#21B3B1] mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-[#4A4A4A]">Safety Concerns</h3>
                  <p className="text-sm text-[#7A7A7A]">
                    Official warnings against travel to the destination from the UK Foreign Office or equivalent authority
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#C9F0EF] rounded-lg p-4 mt-4">
              <p className="text-sm text-[#4A4A4A]">
                <strong>To claim an exceptional circumstances refund:</strong> Contact us at{' '}
                <a href="mailto:refunds@foreignteer.com" className="text-[#21B3B1] underline">
                  refunds@foreignteer.com
                </a>{' '}
                with your booking reference and supporting documentation. Each case will be reviewed individually.
              </p>
            </div>
          </div>
        </section>

        {/* Refund Processing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-[#21B3B1]" />
            Refund Processing
          </h2>
          <div className="bg-white rounded-lg p-6 border border-[#E6EAEA] space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[#4A4A4A] mb-2">Processing Time</h3>
                <p className="text-sm text-[#7A7A7A]">
                  Approved refunds will be processed within <strong>14 working days</strong> of your
                  cancellation request being approved.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#4A4A4A] mb-2">Refund Method</h3>
                <p className="text-sm text-[#7A7A7A]">
                  Refunds will be issued to the original payment method used for the booking. Please allow
                  5-10 business days for the refund to appear in your account after processing.
                </p>
              </div>
            </div>

            <div className="border-t border-[#E6EAEA] pt-4 mt-4">
              <h3 className="font-semibold text-[#4A4A4A] mb-2">Transaction Fees</h3>
              <p className="text-sm text-[#7A7A7A]">
                Please note that payment processing fees charged by third-party payment providers
                (e.g., Stripe, PayPal) are non-refundable, even for full refunds within the cooling-off period.
                These fees typically amount to 1.5-3% of the booking value.
              </p>
            </div>
          </div>
        </section>

        {/* Modifications & Transfers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4">Modifications & Transfers</h2>
          <div className="bg-white rounded-lg p-6 border border-[#E6EAEA] space-y-4">
            <div>
              <h3 className="font-semibold text-[#4A4A4A] mb-2">Rescheduling Your Experience</h3>
              <p className="text-sm text-[#7A7A7A] mb-3">
                If you need to change the date of your volunteering experience:
              </p>
              <ul className="space-y-2 text-sm text-[#7A7A7A]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#21B3B1] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>7+ days before:</strong> Free rescheduling, subject to availability
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#21B3B1] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>3-6 days before:</strong> One free reschedule; subsequent changes subject to cancellation fees
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#F2B56B] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Less than 72 hours:</strong> Rescheduling not permitted; cancellation policy applies
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-t border-[#E6EAEA] pt-4">
              <h3 className="font-semibold text-[#4A4A4A] mb-2">Transferring Your Booking</h3>
              <p className="text-sm text-[#7A7A7A]">
                Bookings may be transferred to another person at no charge up to 48 hours before the
                experience starts. Contact us with the new participant's details. The new participant
                must meet any age, skill, or other requirements specified for the experience.
              </p>
            </div>
          </div>
        </section>

        {/* NGO-Initiated Changes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4">NGO-Initiated Changes or Cancellations</h2>
          <div className="bg-white rounded-lg p-6 border border-[#E6EAEA] space-y-4">
            <p className="text-[#7A7A7A]">
              If the NGO needs to cancel or significantly modify your experience:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#6FB7A4] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#4A4A4A]">Full Cancellation</h3>
                  <p className="text-sm text-[#7A7A7A]">
                    You will receive a full refund (100%) with no fees retained, processed within 7 working days
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#6FB7A4] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#4A4A4A]">Significant Changes</h3>
                  <p className="text-sm text-[#7A7A7A]">
                    Changes to date, time, location, or activities may entitle you to a full refund if you
                    choose not to proceed with the modified experience
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#6FB7A4] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#4A4A4A]">Alternative Experiences</h3>
                  <p className="text-sm text-[#7A7A7A]">
                    We may offer you an alternative experience of equal or greater value. You are not
                    obligated to accept and may request a full refund instead
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Disputes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4">Disputes & Complaints</h2>
          <div className="bg-white rounded-lg p-6 border border-[#E6EAEA] space-y-4">
            <p className="text-[#7A7A7A]">
              If you are dissatisfied with a volunteering experience or have a complaint about our service:
            </p>

            <ol className="space-y-3 text-sm text-[#4A4A4A]">
              <li className="flex items-start gap-3">
                <span className="font-semibold flex-shrink-0">1.</span>
                <div>
                  <strong>Contact us first:</strong> Email{' '}
                  <a href="mailto:info@foreignteer.com" className="text-[#21B3B1] underline">
                    info@foreignteer.com
                  </a>{' '}
                  within 14 days of your experience
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-semibold flex-shrink-0">2.</span>
                <div>
                  <strong>Investigation:</strong> We will investigate your complaint and respond within
                  14 working days
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-semibold flex-shrink-0">3.</span>
                <div>
                  <strong>Resolution:</strong> If appropriate, we may offer a partial refund, credit toward
                  a future booking, or other remedy
                </div>
              </li>
            </ol>

            <div className="bg-[#FAF5EC] rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-[#4A4A4A] mb-2">Alternative Dispute Resolution</h3>
              <p className="text-sm text-[#7A7A7A]">
                If we cannot resolve your complaint to your satisfaction, you may refer the matter to the
                UK European Consumer Centre or use the EU Online Dispute Resolution platform at{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#21B3B1] underline"
                >
                  ec.europa.eu/consumers/odr
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Legal Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4">Legal Information</h2>
          <div className="bg-white rounded-lg p-6 border border-[#E6EAEA] space-y-4">
            <p className="text-sm text-[#7A7A7A]">
              This refund policy operates alongside your statutory rights under UK consumer law and does
              not affect those rights. In particular:
            </p>

            <ul className="space-y-2 text-sm text-[#7A7A7A]">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#21B3B1] mt-2 flex-shrink-0"></div>
                <span>
                  You retain all rights under the Consumer Rights Act 2015 regarding services not
                  performed with reasonable care and skill
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#21B3B1] mt-2 flex-shrink-0"></div>
                <span>
                  Nothing in this policy limits our liability for fraud, fraudulent misrepresentation,
                  or death/personal injury caused by negligence
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#21B3B1] mt-2 flex-shrink-0"></div>
                <span>
                  This policy is governed by the laws of England and Wales
                </span>
              </li>
            </ul>

            <div className="border-t border-[#E6EAEA] pt-4 mt-4">
              <h3 className="font-semibold text-[#4A4A4A] mb-2">Company Information</h3>
              <p className="text-sm text-[#7A7A7A]">
                Foreignteer<br />
                Email: <a href="mailto:info@foreignteer.com" className="text-[#21B3B1] underline">info@foreignteer.com</a>
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <div className="bg-[#21B3B1] text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Questions About Refunds?</h2>
            <p className="mb-6 text-[#C9F0EF]">
              Our team is here to help. Contact us for any questions about cancellations or refunds.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:refunds@foreignteer.com"
                className="inline-flex items-center gap-2 bg-white text-[#21B3B1] px-6 py-3 rounded-lg font-semibold hover:bg-[#FAF5EC] transition-colors"
              >
                Email Refunds Team
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/30"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section>
          <div className="bg-[#FAF5EC] rounded-lg p-6 border border-[#E6EAEA]">
            <h3 className="font-semibold text-[#4A4A4A] mb-3">Related Policies</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/terms"
                className="text-sm text-[#21B3B1] hover:underline"
              >
                Terms of Service →
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-[#21B3B1] hover:underline"
              >
                Privacy Policy →
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-[#21B3B1] hover:underline"
              >
                Cookie Policy →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
