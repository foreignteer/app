'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is Foreignteer?',
    answer:
      'Foreignteer is a platform that connects volunteers with meaningful experiences worldwide. We partner with verified NGOs to offer volunteering opportunities that make a real impact while providing volunteers with unforgettable cultural experiences.',
  },
  {
    question: 'How do I sign up as a volunteer?',
    answer:
      'Click on "Sign Up" in the top right corner, create your account, and complete your profile. Once registered, you can browse available experiences and apply for opportunities that match your interests and skills.',
  },
  {
    question: 'Is there a fee to volunteer?',
    answer:
      'Programme fees vary by experience and are set by the hosting NGO to cover accommodation, meals, training, and project materials. Foreignteer charges a small service fee to maintain the platform. All fees are clearly displayed on each experience page before you apply.',
  },
  {
    question: 'How do I know the NGOs are legitimate?',
    answer:
      'All NGOs on our platform go through a verification process. We review their registration documents, mission statements, and track records. We also collect feedback from volunteers to ensure quality and authenticity.',
  },
  {
    question: 'What is Instant Confirmation?',
    answer:
      'Some experiences offer Instant Confirmation, meaning your booking is automatically approved upon submission. Others require NGO approval, where the organization reviews your application before confirming your participation. You can filter experiences by Instant Confirmation availability.',
  },
  {
    question: 'Can I cancel my booking?',
    answer:
      'Yes, you can cancel your booking from your dashboard. Cancellation policies vary by experience and are set by the hosting NGO. Please review the cancellation policy on the experience page before booking, as refunds may be subject to conditions.',
  },
  {
    question: 'What happens if my application is rejected?',
    answer:
      'If an NGO rejects your application (for experiences requiring approval), you\'ll receive an email notification. The NGO may provide a reason for the rejection. Don\'t be discouraged - you can apply for other experiences that better match your profile or timing.',
  },
  {
    question: 'How do I become a partner NGO?',
    answer:
      'Visit our "Partner With Us" page and fill out the partnership application form. Our team will review your organization and contact you with next steps. Once approved, you can create experiences and manage volunteer applications through your NGO dashboard.',
  },
  {
    question: 'What documents do I need to volunteer abroad?',
    answer:
      'Requirements vary by country and experience. Generally, you\'ll need a valid passport and may require a visa, travel insurance, and health vaccinations. Check the specific requirements listed on each experience page and consult your country\'s travel advisory.',
  },
  {
    question: 'Can I volunteer as part of a group?',
    answer:
      'Yes! Many experiences welcome groups. If you\'re planning to volunteer with friends, family, or colleagues, contact the NGO through the experience page to discuss group arrangements. Some NGOs offer special group rates or custom programmes.',
  },
  {
    question: 'How does payment work?',
    answer:
      'When you book an experience, payment is processed securely through our platform. For Instant Confirmation experiences, payment is taken immediately. For experiences requiring approval, payment is processed once the NGO confirms your application. You\'ll receive a confirmation email with your receipt.',
  },
  {
    question: 'What if I have dietary requirements or allergies?',
    answer:
      'During the booking process, you can specify dietary requirements, allergies, and other important information in the application form. NGOs review this information and will contact you if they cannot accommodate specific needs.',
  },
  {
    question: 'Can I extend my volunteering period?',
    answer:
      'Yes, if you\'d like to extend your stay, contact the NGO through your dashboard. Extension availability depends on project capacity and scheduling. The NGO will inform you of any additional fees and confirm the extended dates.',
  },
  {
    question: 'How do I contact support?',
    answer:
      'You can reach our support team by emailing hello@foreignteer.com or using the Contact Us form on our website. We typically respond within 24 hours on business days.',
  },
  {
    question: 'Is my personal data safe?',
    answer:
      'Yes, we take data privacy seriously. We comply with UK GDPR regulations and use industry-standard security measures to protect your personal information. Read our Privacy Policy for full details on how we collect, use, and protect your data.',
  },
];

function AccordionItem({ faq, isOpen, onToggle }: { faq: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#E6EAEA] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-6 text-left hover:bg-[#FAF5EC] transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="text-base font-semibold text-[#4A4A4A] pr-8">{faq.question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-[#21B3B1] transition-transform flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <p className="text-sm text-[#7A7A7A] leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#21B3B1] to-[#168E8C] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-white/90">
            Find answers to common questions about volunteering with Foreignteer
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#E6EAEA] rounded-lg shadow-sm overflow-hidden">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>

          {/* Still Have Questions? */}
          <div className="mt-12 text-center bg-[#C9F0EF] rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-3">Still have questions?</h2>
            <p className="text-[#7A7A7A] mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-[#21B3B1] hover:bg-[#168E8C] text-white font-semibold rounded-lg transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
