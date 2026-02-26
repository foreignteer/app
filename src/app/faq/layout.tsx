import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Foreignteer',
  description: 'Find answers to common questions about volunteering with Foreignteer, booking experiences, NGO partnerships, and making an impact through micro-volunteering.',
  alternates: { canonical: 'https://foreignteer.com/faq' },
  keywords: 'volunteering FAQ, foreignteer questions, volunteer answers, NGO questions, volunteering help',
  openGraph: {
    title: 'Frequently Asked Questions - Foreignteer',
    description: 'Find answers to common questions about volunteering with Foreignteer',
    url: 'https://www.foreignteer.com/faq',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FAQ - Foreignteer',
    description: 'Find answers to common questions about volunteering with Foreignteer',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
