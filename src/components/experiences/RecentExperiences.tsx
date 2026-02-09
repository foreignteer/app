'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Experience } from '@/lib/types/experience';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';

export default function RecentExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentExperiences();
  }, []);

  const fetchRecentExperiences = async () => {
    try {
      const response = await fetch('/api/experiences?limit=3&sort=recent');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data.experiences || []);
      }
    } catch (error) {
      console.error('Error fetching recent experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#21B3B1] mx-auto"></div>
            <p className="text-[#7A7A7A] mt-2">Loading experiences...</p>
          </div>
        </div>
      </section>
    );
  }

  if (experiences.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#4A4A4A] mb-3">
            Recent Opportunities
          </h2>
          <p className="text-lg text-[#7A7A7A] max-w-2xl mx-auto">
            Discover the latest volunteering experiences added to our platform
          </p>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {experiences.map((experience) => (
            <Link
              key={experience.id}
              href={`/experiences/${experience.id}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {experience.images && experience.images.length > 0 ? (
                  <Image
                    src={experience.images[0]}
                    alt={experience.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#C9F0EF] to-[#F6C98D] flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-white/50" />
                  </div>
                )}
                {experience.instantConfirmation && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-[#6FB7A4] text-white border-[#6FB7A4]">
                      Instant Confirmation
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#4A4A4A] mb-2 group-hover:text-[#21B3B1] transition-colors line-clamp-2">
                  {experience.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-[#7A7A7A] mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{experience.city}, {experience.country}</span>
                </div>

                <p className="text-sm text-[#7A7A7A] mb-4 line-clamp-2">
                  {experience.summary}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[#7A7A7A]">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(experience.dates.start), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7A7A7A]">
                    <Users className="w-4 h-4" />
                    <span>{experience.currentBookings || 0}/{experience.capacity}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/experiences">
            <Button size="lg" className="group">
              View All Experiences
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
