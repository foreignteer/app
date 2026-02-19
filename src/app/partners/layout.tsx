import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Partner Organisations - Foreignteer',
  description: 'Discover verified NGOs and non-profit organisations partnered with Foreignteer. Find causes you care about and connect with organisations making a real impact.',
  keywords: 'NGO partners, volunteer organisations, non-profit, charity partners, social impact organisations, verified NGOs',
  openGraph: {
    title: 'Our Partner Organisations - Foreignteer',
    description: 'Discover verified NGOs and non-profit organisations making a real impact',
    url: 'https://www.foreignteer.com/partners',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Partner Organisations - Foreignteer',
    description: 'Discover verified NGOs and non-profit organisations making a real impact',
  },
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
