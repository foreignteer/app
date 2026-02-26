import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newsletter - Foreignteer',
  description: 'Stay updated with Foreignteer. Get the latest volunteering opportunities, travel tips, and impact stories delivered to your inbox.',
  alternates: { canonical: 'https://foreignteer.com/newsletter' },
};

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
