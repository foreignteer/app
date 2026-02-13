'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { MapPin } from 'lucide-react';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export function CityAutocomplete({ value, onChange }: CityAutocompleteProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch all unique cities from experiences
    fetchCities();
  }, []);

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/experiences');
      if (response.ok) {
        const data = await response.json();
        const uniqueCities = Array.from(
          new Set(data.experiences.map((exp: any) => exp.city).filter(Boolean))
        ).sort() as string[];
        setCities(uniqueCities);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);

    if (inputValue.trim()) {
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city: string) => {
    onChange(city);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        id="city"
        name="city"
        type="text"
        label="City"
        placeholder="e.g., London"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (value.trim()) {
            const filtered = cities.filter((city) =>
              city.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
          }
        }}
        autoComplete="off"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((city) => (
            <button
              key={city}
              onClick={() => handleSelectCity(city)}
              className="w-full px-4 py-2 text-left hover:bg-[#C9F0EF] focus:bg-[#C9F0EF] focus:outline-none transition-colors flex items-center gap-2 text-[#4A4A4A]"
            >
              <MapPin className="w-4 h-4 text-[#21B3B1]" />
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
