import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Volunteering Experiences - Foreignteer',
  description: 'Discover meaningful micro-volunteering opportunities worldwide. Find short-term volunteering experiences that fit your travel schedule and make a real impact.',
  keywords: 'volunteering opportunities, volunteer abroad, micro-volunteering, short-term volunteering, volunteer experiences, NGO opportunities',
  openGraph: {
    title: 'Browse Volunteering Experiences - Foreignteer',
    description: 'Discover meaningful micro-volunteering opportunities worldwide',
    url: 'https://www.foreignteer.com/experiences',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Volunteering Experiences - Foreignteer',
    description: 'Discover meaningful micro-volunteering opportunities worldwide',
  },
};

export default function ExperiencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
