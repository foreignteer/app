import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner with Foreignteer - Connect with Volunteers Worldwide',
  description: 'Join Foreignteer as an NGO partner. Connect with passionate volunteers, expand your reach, and create meaningful impact through micro-volunteering experiences.',
  alternates: { canonical: 'https://foreignteer.com/partner' },
  keywords: 'NGO partnership, volunteer recruitment, partner with foreignteer, NGO platform, volunteer management, social impact partnership',
  openGraph: {
    title: 'Partner with Foreignteer - Connect with Volunteers',
    description: 'Join our platform to connect with passionate volunteers worldwide',
    url: 'https://www.foreignteer.com/partner',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partner with Foreignteer',
    description: 'Join our platform to connect with passionate volunteers worldwide',
  },
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
