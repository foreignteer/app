import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Globe, Mail, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ExperienceCard } from '@/components/experiences/ExperienceCard';
import { adminDb } from '@/lib/firebase/admin';
import { Experience } from '@/lib/types/experience';
import { expandAllRecurringExperiences } from '@/lib/utils/recurring';

interface NGOProfilePageProps {
  params: Promise<{ slug: string }>;
}

async function getNGOBySlug(slug: string) {
  try {
    const querySnapshot = await adminDb
      .collection('ngos')
      .where('publicSlug', '==', slug)
      .where('approved', '==', true)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error fetching NGO:', error);
    return null;
  }
}

async function getNGOExperiences(ngoId: string): Promise<Experience[]> {
  try {
    const querySnapshot = await adminDb
      .collection('experiences')
      .where('ngoId', '==', ngoId)
      .where('status', '==', 'published')
      .get();

    let experiences: Experience[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      experiences.push({
        id: doc.id,
        ...data,
        dates: {
          start: data.dates.start.toDate(),
          end: data.dates.end.toDate(),
        },
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Experience);
    });

    // Expand recurring experiences
    experiences = expandAllRecurringExperiences(experiences);

    // Sort by start date
    experiences.sort((a, b) => {
      const aStart = new Date(a.dates.start).getTime();
      const bStart = new Date(b.dates.start).getTime();
      return aStart - bStart;
    });

    return experiences;
  } catch (error) {
    console.error('Error fetching NGO experiences:', error);
    return [];
  }
}

export default async function NGOProfilePage({ params }: NGOProfilePageProps) {
  const { slug } = await params;
  const ngo = await getNGOBySlug(slug);

  if (!ngo) {
    notFound();
  }

  const experiences = await getNGOExperiences(ngo.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            {ngo.logoUrl && (
              <div className="relative h-32 w-32 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                <Image
                  src={ngo.logoUrl}
                  alt={ngo.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-text-primary mb-3">{ngo.name}</h1>

              <div className="flex flex-wrap gap-2 mb-4">
                {ngo.causes?.map((cause: string) => (
                  <Badge key={cause} variant="primary">
                    {cause}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-text-muted">
                  <MapPin className="w-4 h-4" />
                  <span>
                    Based in {ngo.jurisdiction} • Operates in{' '}
                    {ngo.serviceLocations?.join(', ')}
                  </span>
                </div>

                {ngo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-text-muted" />
                    <a
                      href={ngo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark"
                    >
                      {ngo.website}
                    </a>
                  </div>
                )}

                {ngo.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-text-muted" />
                    <a
                      href={`mailto:${ngo.contactEmail}`}
                      className="text-primary hover:text-primary-dark"
                    >
                      {ngo.contactEmail}
                    </a>
                  </div>
                )}
              </div>

              <p className="text-text-muted leading-relaxed">{ngo.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Experiences Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-text-primary">
            Volunteering Opportunities
          </h2>
          <div className="flex items-center gap-2 text-text-muted">
            <Heart className="w-5 h-5" />
            <span>{experiences.length} experiences available</span>
          </div>
        </div>

        {experiences.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-xl text-text-muted mb-2">
                No experiences available yet
              </p>
              <p className="text-text-muted">
                Check back later for new opportunities from this organisation
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="flat">
              <CardHeader>
                <CardTitle className="text-lg">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-muted">{ngo.description}</p>
              </CardContent>
            </Card>

            <Card variant="flat">
              <CardHeader>
                <CardTitle className="text-lg">Areas of Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ngo.causes?.map((cause: string) => (
                    <Badge key={cause} variant="secondary">
                      {cause}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="flat">
              <CardHeader>
                <CardTitle className="text-lg">Where We Work</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {ngo.serviceLocations?.map((location: string) => (
                    <li key={location} className="flex items-center gap-2 text-text-primary">
                      <MapPin className="w-4 h-4 text-primary" />
                      {location}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
