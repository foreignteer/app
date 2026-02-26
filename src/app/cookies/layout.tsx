import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - Foreignteer',
  description: 'Learn about how Foreignteer uses cookies and similar technologies. Understand our cookie policy and how to manage your preferences.',
  alternates: { canonical: 'https://foreignteer.com/cookies' },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
