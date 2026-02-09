import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Users, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Experience } from '@/lib/types/experience';
import { format } from 'date-fns';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const spotsLeft = experience.capacity - experience.currentBookings;
  const imageUrl = experience.images[0] || '/images/placeholder-experience.jpg';

  // Extract base ID for recurring instances (format: baseId-timestamp)
  const baseId = experience.id.includes('-')
    ? experience.id.split('-')[0]
    : experience.id;

  // Add date parameter for recurring instances
  const dateParam = experience.id.includes('-')
    ? `?date=${new Date(experience.dates.start).toISOString()}`
    : '';

  return (
    <Link href={`/experiences/${baseId}${dateParam}`}>
      <Card variant="elevated" className="h-full hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={experience.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-text mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {experience.title}
          </h3>

          <p className="text-sm text-text-light mb-4 line-clamp-2">
            {experience.summary}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-text">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{experience.city}, {experience.country}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-text">
              <Calendar className="w-4 h-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs text-text-muted">Date & Time</span>
                <span className="font-medium">
                  {format(new Date(experience.dates.start), 'MMM d')} - {format(new Date(experience.dates.end), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-text">
              <Users className="w-4 h-4 text-primary" />
              <span>
                {spotsLeft > 0 ? (
                  <span className="text-primary font-medium">{spotsLeft} spots left</span>
                ) : (
                  <span className="text-red-600 font-medium">Fully booked</span>
                )}
              </span>
            </div>
          </div>

          {experience.recurring && (
            <div className="flex items-center gap-1 text-xs text-accent-dark">
              <Heart className="w-3 h-3" />
              <span>Recurring opportunity</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
