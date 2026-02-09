'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExperienceCard } from '@/components/experiences/ExperienceCard';
import { ExperienceFilters } from '@/components/experiences/ExperienceFilters';
import { Experience, ExperienceFilters as ExperienceFiltersType } from '@/lib/types/experience';
import { Loader2 } from 'lucide-react';

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<ExperienceFiltersType>({});

  useEffect(() => {
    fetchExperiences();
  }, [filters]);

  const fetchExperiences = async () => {
    setLoading(true);
    setError('');

    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.city) params.append('city', filters.city);
      if (filters.country) params.append('country', filters.country);
      if (filters.causeCategory) params.append('causeCategory', filters.causeCategory);
      if (filters.instantConfirmation !== undefined) params.append('instantConfirmation', filters.instantConfirmation.toString());
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/experiences?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch experiences');
      }

      const data = await response.json();
      setExperiences(data.experiences);
    } catch (err: any) {
      console.error('Error fetching experiences:', err);
      setError('Failed to load experiences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: ExperienceFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-text-on-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Discover Volunteering Experiences</h1>
          <p className="text-lg text-text-on-primary opacity-90 mb-6">
            Browse meaningful micro-volunteering opportunities around the world
          </p>
          <Link href="/how-it-works">
            <button className="px-6 py-2 bg-white text-[#21B3B1] hover:bg-gray-100 font-medium rounded-lg transition-colors border-2 border-white">
              How It Works
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <ExperienceFilters onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Experiences Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="ml-3 text-text-muted">Loading experiences...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : experiences.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-text-muted mb-2">No experiences found</p>
                <p className="text-text-muted">Try adjusting your filters to see more results</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-text-muted">
                    {experiences.length} {experiences.length === 1 ? 'experience' : 'experiences'} found
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {experiences.map((experience) => (
                    <ExperienceCard key={experience.id} experience={experience} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
