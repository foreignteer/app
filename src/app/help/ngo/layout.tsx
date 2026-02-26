import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NGO User Manual - Foreignteer',
  description: 'Official guide for NGO partners. Learn how to manage your organisation, create volunteering experiences, and collaborate with your team on Foreignteer.',
  alternates: { canonical: 'https://foreignteer.com/help/ngo' },
};

export default function HelpNGOLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
