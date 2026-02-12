'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, X } from 'lucide-react';
import { CAUSE_CATEGORIES } from '@/lib/constants/categories';
import { COUNTRIES } from '@/lib/constants/countries';
import { ExperienceFilters as ExperienceFiltersType, DurationFilter } from '@/lib/types/experience';

interface ExperienceFiltersProps {
  onFilterChange: (filters: ExperienceFiltersType) => void;
}

export function ExperienceFilters({ onFilterChange }: ExperienceFiltersProps) {
  const [filters, setFilters] = useState<ExperienceFiltersType>({
    search: '',
    city: '',
    country: '',
    causeCategory: '',
    instantConfirmation: undefined,
    startDate: undefined,
    endDate: undefined,
    duration: 'any',
  });

  const handleChange = (field: keyof ExperienceFiltersType, value: string) => {
    const newFilters = { ...filters, [field]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: ExperienceFiltersType = {
      search: '',
      city: '',
      country: '',
      causeCategory: '',
      instantConfirmation: undefined,
      startDate: undefined,
      endDate: undefined,
      duration: 'any',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const handleDurationChange = (duration: DurationFilter) => {
    const newFilters = { ...filters, duration };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'duration') return value !== 'any';
    return value !== '' && value !== undefined;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text">Filter Experiences</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-text-light hover:text-text"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Input
            id="search"
            name="search"
            type="text"
            placeholder="Search experiences..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
        </div>

        {/* Location Filters */}
        <div className="space-y-4">
          <Input
            id="city"
            name="city"
            type="text"
            label="City"
            placeholder="e.g., London"
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-text mb-2">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={filters.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text bg-white"
            >
              <option value="">All Countries</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cause Category */}
        <div>
          <label htmlFor="causeCategory" className="block text-sm font-medium text-text mb-2">
            Cause Category
          </label>
          <select
            id="causeCategory"
            name="causeCategory"
            value={filters.causeCategory}
            onChange={(e) => handleChange('causeCategory', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text bg-white"
          >
            <option value="">All Categories</option>
            {CAUSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-text mb-2">
            Duration
          </label>
          <select
            id="duration"
            name="duration"
            value={filters.duration || 'any'}
            onChange={(e) => handleDurationChange(e.target.value as DurationFilter)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text bg-white"
          >
            <option value="any">Any Duration</option>
            <option value="short">Within 2 hours</option>
            <option value="medium">2-4 hours</option>
            <option value="long">4+ hours</option>
          </select>
        </div>

        {/* Instant Confirmation Filter */}
        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            id="instantConfirmation"
            checked={filters.instantConfirmation === true}
            onChange={(e) => {
              const newFilters = { ...filters, instantConfirmation: e.target.checked ? true : undefined };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
            className="w-4 h-4 text-[#21B3B1] border-gray-300 rounded focus:ring-[#21B3B1]"
          />
          <label htmlFor="instantConfirmation" className="text-sm text-[#4A4A4A] cursor-pointer">
            Instant Confirmation Only
          </label>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="startDate"
            name="startDate"
            type="date"
            label="From Date"
            value={filters.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />

          <Input
            id="endDate"
            name="endDate"
            type="date"
            label="To Date"
            value={filters.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
