'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { MapPin, ExternalLink } from 'lucide-react';

interface LocationPickerProps {
  address: string;
  onAddressChange: (address: string, lat?: number, lng?: number) => void;
  label?: string;
  required?: boolean;
}

export default function LocationPicker({
  address,
  onAddressChange,
  label = 'Location',
  required = false,
}: LocationPickerProps) {
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      initAutocomplete();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );

    if (existingScript) {
      // Wait for existing script to load
      existingScript.addEventListener('load', initAutocomplete);
      return () => {
        existingScript.removeEventListener('load', initAutocomplete);
      };
    }

    // Load Google Maps script
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = initAutocomplete;
    }
  }, []);

  const initAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['formatted_address', 'geometry', 'name'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (place.geometry && place.geometry.location) {
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();
        const newAddress = place.formatted_address || place.name || '';

        setLat(newLat);
        setLng(newLng);
        onAddressChange(newAddress, newLat, newLng);
      } else if (place.formatted_address || place.name) {
        onAddressChange(place.formatted_address || place.name || '');
      }
    });

    autocompleteRef.current = autocomplete;
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAddressChange(e.target.value);
  };

  const getGoogleMapsUrl = () => {
    if (lat && lng) {
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else if (address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }
    return null;
  };

  const mapsUrl = getGoogleMapsUrl();

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          ref={inputRef}
          id="location"
          label={label}
          value={address}
          onChange={handleManualChange}
          placeholder="Start typing to search for a location..."
          required={required}
          helperText="Search for a location using Google Maps"
        />
        <MapPin className="absolute right-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark"
        >
          <ExternalLink className="w-4 h-4" />
          View on Google Maps
        </a>
      )}

      {lat && lng && (
        <p className="text-xs text-text-muted">
          Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
