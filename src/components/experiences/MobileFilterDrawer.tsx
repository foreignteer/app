'use client';

import { useState, useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { ExperienceFilters } from './ExperienceFilters';
import { ExperienceFilters as ExperienceFiltersType } from '@/lib/types/experience';
import { Button } from '@/components/ui/Button';

interface MobileFilterDrawerProps {
  onFilterChange: (filters: ExperienceFiltersType) => void;
  resultCount: number;
}

export function MobileFilterDrawer({ onFilterChange, resultCount }: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Filter Button - Only visible on mobile */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-[#21B3B1] hover:bg-[#168E8C] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          size="lg"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
          {resultCount > 0 && (
            <span className="bg-white text-[#21B3B1] px-2 py-1 rounded-full text-sm font-semibold ml-1">
              {resultCount}
            </span>
          )}
        </Button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          max-h-[85vh] overflow-y-auto
        `}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#4A4A4A]">Filters</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close filters"
          >
            <X className="w-6 h-6 text-[#7A7A7A]" />
          </button>
        </div>

        {/* Filters Content */}
        <div className="p-6 pb-24">
          <ExperienceFilters onFilterChange={onFilterChange} />
        </div>

        {/* Apply Button - Sticky at bottom */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <Button
            onClick={() => setIsOpen(false)}
            className="w-full bg-[#21B3B1] hover:bg-[#168E8C] text-white"
            size="lg"
          >
            Show {resultCount} {resultCount === 1 ? 'Experience' : 'Experiences'}
          </Button>
        </div>
      </div>
    </>
  );
}
