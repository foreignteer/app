import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Foreignteer',
  description: 'Get in touch with the Foreignteer team. We\'re here to help volunteers and NGO partners with questions about micro-volunteering experiences.',
  alternates: { canonical: 'https://foreignteer.com/contact' },
  keywords: 'contact foreignteer, volunteer support, NGO partnership, customer service',
  openGraph: {
    title: 'Contact Foreignteer',
    description: 'Get in touch with our team about volunteering opportunities and partnerships',
    url: 'https://www.foreignteer.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Foreignteer',
    description: 'Get in touch with our team about volunteering opportunities and partnerships',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
