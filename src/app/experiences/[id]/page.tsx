import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Users, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { adminDb } from '@/lib/firebase/admin';
import { Experience } from '@/lib/types/experience';
import { format } from 'date-fns';

interface ExperienceDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}

async function getExperience(id: string, instanceDate?: string): Promise<Experience | null> {
  try {
    const docRef = adminDb.collection('experiences').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data()!;
    const experience = {
      id: doc.id,
      ...data,
      dates: {
        start: data.dates.start.toDate(),
        end: data.dates.end.toDate(),
      },
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Experience;

    // If this is a recurring instance with a specific date, adjust the dates
    if (instanceDate && experience.recurring) {
      const requestedDate = new Date(instanceDate);
      const originalStart = new Date(experience.dates.start);
      const originalEnd = new Date(experience.dates.end);
      const duration = originalEnd.getTime() - originalStart.getTime();

      // Set the start to the requested date (keeping the time)
      requestedDate.setHours(originalStart.getHours(), originalStart.getMinutes(), 0, 0);
      const adjustedEnd = new Date(requestedDate.getTime() + duration);

      experience.dates = {
        start: requestedDate,
        end: adjustedEnd,
      };
    }

    return experience;
  } catch (error) {
    console.error('Error fetching experience:', error);
    return null;
  }
}

async function getNGO(ngoId: string) {
  try {
    const docRef = adminDb.collection('ngos').doc(ngoId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error fetching NGO:', error);
    return null;
  }
}

export default async function ExperienceDetailPage({ params, searchParams }: ExperienceDetailPageProps) {
  const { id } = await params;
  const { date } = await searchParams;
  const experience = await getExperience(id, date);

  if (!experience || experience.status !== 'published') {
    notFound();
  }

  const ngo = await getNGO(experience.ngoId);
  const spotsLeft = experience.capacity - experience.currentBookings;
  const isFull = spotsLeft <= 0;
  const bookUrl = date
    ? `/experiences/${experience.id}/book?date=${date}`
    : `/experiences/${experience.id}/book`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 w-full">
        <Image
          src={experience.images[0] || '/images/placeholder-experience.jpg'}
          alt={experience.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 inline-block max-w-4xl">
              <Badge variant="primary" size="lg" className="mb-4">
                {experience.causeCategories?.[0] || 'Volunteering'}
              </Badge>
              <h1 className="text-4xl font-bold text-[#2C3E3A] mb-2">{experience.title}</h1>
              <p className="text-xl text-[#4A4A4A]">{experience.summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About This Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none text-text-primary"
                  dangerouslySetInnerHTML={{ __html: experience.description }}
                />
              </CardContent>
            </Card>

            {/* Requirements */}
            {experience.requirements && experience.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {experience.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-text-primary">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Accessibility */}
            {experience.accessibility && (
              <Card>
                <CardHeader>
                  <CardTitle>Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-primary">{experience.accessibility}</p>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-text-primary font-medium">{experience.location.address}</p>
                    <p className="text-text-muted">{experience.city}, {experience.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images Gallery */}
            {experience.images.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {experience.images.slice(1).map((image, index) => (
                      <div key={index} className="relative h-40 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${experience.title} - Image ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Card & NGO Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Booking Card */}
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-text-muted">Date & Time</p>
                      <p className="font-semibold text-text-primary">
                        {format(new Date(experience.dates.start), 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-text-muted">
                        {format(new Date(experience.dates.start), 'h:mm a')} - {format(new Date(experience.dates.end), 'h:mm a')}
                      </p>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-text-muted">Availability</p>
                      {isFull ? (
                        <p className="font-semibold text-red-600">Fully Booked</p>
                      ) : (
                        <p className="font-semibold text-primary">{spotsLeft} spots left</p>
                      )}
                    </div>
                  </div>

                  {/* Recurring */}
                  {experience.recurring && (
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <Heart className="w-5 h-5 text-accent-dark" />
                      <div>
                        <p className="text-sm text-text-muted">Type</p>
                        <p className="font-semibold text-text-primary">Recurring Opportunity</p>
                      </div>
                    </div>
                  )}

                  {/* Booking Fee */}
                  <div className="bg-primary-light rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-text-muted mb-1">Booking Fee</p>
                        <p className="text-xs text-text-muted">
                          Platform fee: £15.00
                          {experience.programmeFee && experience.programmeFee > 0 &&
                            ` + Programme fee: £${Number(experience.programmeFee).toFixed(2)}`}
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        £{experience.totalFee ? Number(experience.totalFee).toFixed(2) : '15.00'}
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  {isFull ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">
                            This experience is fully booked
                          </p>
                          <p className="text-xs text-yellow-700 mt-1">
                            Check back later or explore other opportunities
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link href={bookUrl}>
                      <Button fullWidth size="lg">
                        Apply Now
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* NGO Card */}
            {ngo && (
              <Card>
                <CardHeader>
                  <CardTitle>Hosted By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ngo.logoUrl && (
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                        <Image
                          src={ngo.logoUrl}
                          alt={ngo.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">{ngo.name}</h3>
                      <p className="text-sm text-text-muted line-clamp-3">{ngo.description}</p>
                    </div>
                    {ngo.publicSlug && (
                      <Link href={`/ngos/${ngo.publicSlug}`}>
                        <Button variant="outline" size="sm" fullWidth>
                          View Organisation
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
