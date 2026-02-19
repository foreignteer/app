'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ExperienceCard } from '@/components/experiences/ExperienceCard';
import { ExperienceFilters } from '@/components/experiences/ExperienceFilters';
import { MobileFilterDrawer } from '@/components/experiences/MobileFilterDrawer';
import { Experience, ExperienceFilters as ExperienceFiltersType, SortOption } from '@/lib/types/experience';
import { Loader2, ArrowUpDown, Grid3x3, Map } from 'lucide-react';
import { AnalyticsEvents } from '@/lib/analytics/tracker';

// Dynamically import map to avoid SSR issues with Leaflet
const ExperienceMap = dynamic(
  () => import('@/components/experiences/ExperienceMap').then((mod) => mod.ExperienceMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#21B3B1] animate-spin" />
      </div>
    ),
  }
);

type ViewMode = 'grid' | 'map';

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<ExperienceFiltersType>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    AnalyticsEvents.EXPERIENCE_LIST_VIEW();
  }, []);

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
      if (filters.duration && filters.duration !== 'any') params.append('duration', filters.duration);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

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
    // Track which filters are being applied
    if (newFilters.causeCategory && newFilters.causeCategory !== filters.causeCategory) {
      AnalyticsEvents.EXPERIENCE_FILTER_APPLIED('cause', newFilters.causeCategory);
    }
    if (newFilters.country && newFilters.country !== filters.country) {
      AnalyticsEvents.EXPERIENCE_FILTER_APPLIED('country', newFilters.country);
    }
    if (newFilters.search && newFilters.search !== filters.search) {
      AnalyticsEvents.EXPERIENCE_FILTER_APPLIED('search', newFilters.search);
    }
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
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
          {/* Filters Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              <ExperienceFilters onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Experiences Content */}
          <div className="lg:col-span-3">
            {/* Controls Bar */}
            {!loading && !error && experiences.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-[#7A7A7A]" />
                    <label htmlFor="sortBy" className="text-sm font-medium text-[#4A4A4A]">
                      Sort by:
                    </label>
                    <select
                      id="sortBy"
                      value={filters.sortBy || 'newest'}
                      onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value as SortOption })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1] focus:border-transparent text-[#4A4A4A] bg-white"
                    >
                      <option value="newest">Newest First</option>
                      <option value="date_asc">Date: Earliest First</option>
                      <option value="date_desc">Date: Latest First</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                    </select>
                  </div>

                  {/* View Toggle & Count */}
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-[#7A7A7A]">
                      {experiences.length} {experiences.length === 1 ? 'experience' : 'experiences'}
                    </p>

                    {/* Grid/Map Toggle */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 rounded-md transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-white text-[#21B3B1] shadow-sm'
                            : 'text-[#7A7A7A] hover:text-[#4A4A4A]'
                        }`}
                        aria-label="Grid view"
                      >
                        <Grid3x3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('map')}
                        className={`px-3 py-2 rounded-md transition-colors ${
                          viewMode === 'map'
                            ? 'bg-white text-[#21B3B1] shadow-sm'
                            : 'text-[#7A7A7A] hover:text-[#4A4A4A]'
                        }`}
                        aria-label="Map view"
                      >
                        <Map className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
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
            ) : viewMode === 'map' ? (
              <ExperienceMap experiences={experiences} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {experiences.map((experience) => (
                  <ExperienceCard key={experience.id} experience={experience} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        onFilterChange={handleFilterChange}
        resultCount={experiences.length}
      />
    </div>
  );
}
