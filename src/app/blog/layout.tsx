import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Foreignteer Blog - Volunteering Stories & Travel Tips',
  description: 'Read inspiring stories from volunteers, get travel tips, and learn about making a difference through micro-volunteering around the world.',
  alternates: { canonical: 'https://foreignteer.com/blog' },
  keywords: 'volunteering blog, travel stories, impact stories, volunteer tips, micro-volunteering experiences',
  openGraph: {
    title: 'Foreignteer Blog - Volunteering Stories & Travel Tips',
    description: 'Inspiring stories and tips from volunteers making a difference worldwide',
    url: 'https://www.foreignteer.com/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foreignteer Blog - Volunteering Stories & Travel Tips',
    description: 'Inspiring stories and tips from volunteers making a difference worldwide',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
