import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface NGOProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: NGOProfilePageProps): Promise<Metadata> {
  return {
    title: 'Partner Profile - Foreignteer',
    description: 'View our verified partner organisations at the partners page.',
  };
}

export default async function NGOProfilePage({ params }: NGOProfilePageProps) {
  // NGO profile pages are no longer publicly accessible
  // Users should view partners at /partners instead
  notFound();
}
