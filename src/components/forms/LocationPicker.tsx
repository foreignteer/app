'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [displayAddress, setDisplayAddress] = useState(address);
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteElementRef = useRef<any>(null);

  useEffect(() => {
    setDisplayAddress(address);
  }, [address]);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.places) {
      initAutocomplete();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );

    if (existingScript) {
      // Wait for existing script to load
      const handleLoad = () => {
        // Wait a bit for the places library to be ready
        setTimeout(initAutocomplete, 100);
      };
      existingScript.addEventListener('load', handleLoad);
      return () => {
        existingScript.removeEventListener('load', handleLoad);
      };
    }

    // Load Google Maps script with async loading
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        // Wait a bit for the places library to be ready
        setTimeout(initAutocomplete, 100);
      };
    }
  }, []);

  const initAutocomplete = async () => {
    if (!containerRef.current || !window.google || !window.google.maps) return;

    try {
      // Use the new PlaceAutocompleteElement
      // @ts-ignore - New Google Maps API not yet in TypeScript definitions
      const { PlaceAutocompleteElement } = await window.google.maps.importLibrary("places") as any;

      // Create input element
      const input = document.createElement('input');
      input.type = 'text';
      input.value = displayAddress;
      input.placeholder = 'Start typing to search for a location...';
      input.className = 'w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#21B3B1] focus:border-transparent';
      if (required) {
        input.required = true;
      }

      // Create autocomplete element
      const autocomplete = new PlaceAutocompleteElement({
        inputElement: input,
        // No type restrictions - allows comprehensive search
        componentRestrictions: undefined,
      });

      // Listen for place selection
      autocomplete.addListener('gmp-placeselect', async ({ place }: any) => {
        if (!place) return;

        // Fetch place details
        await place.fetchFields({
          fields: ['displayName', 'formattedAddress', 'location'],
        });

        const newAddress = place.formattedAddress || place.displayName || '';
        const location = place.location;

        if (location) {
          const newLat = location.lat();
          const newLng = location.lng();
          setLat(newLat);
          setLng(newLng);
          setDisplayAddress(newAddress);
          onAddressChange(newAddress, newLat, newLng);
        } else {
          setDisplayAddress(newAddress);
          onAddressChange(newAddress);
        }
      });

      // Handle manual input changes
      input.addEventListener('input', (e: any) => {
        const value = e.target.value;
        setDisplayAddress(value);
        onAddressChange(value);
      });

      // Clear existing content and append new autocomplete
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(input);
      }

      autocompleteElementRef.current = autocomplete;
    } catch (error) {
      console.error('Error initializing PlaceAutocompleteElement:', error);

      // Fallback to old Autocomplete API if new one fails
      initLegacyAutocomplete();
    }
  };

  const initLegacyAutocomplete = () => {
    if (!containerRef.current || !window.google || !window.google.maps.places) return;

    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.value = displayAddress;
    input.placeholder = 'Start typing to search for a location...';
    input.className = 'w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#21B3B1] focus:border-transparent';
    if (required) {
      input.required = true;
    }

    // Create legacy autocomplete (fallback)
    const autocomplete = new window.google.maps.places.Autocomplete(input, {
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
        setDisplayAddress(newAddress);
        onAddressChange(newAddress, newLat, newLng);
      } else if (place.formatted_address || place.name) {
        const newAddress = place.formatted_address || place.name || '';
        setDisplayAddress(newAddress);
        onAddressChange(newAddress);
      }
    });

    input.addEventListener('input', (e: any) => {
      const value = e.target.value;
      setDisplayAddress(value);
      onAddressChange(value);
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(input);
    }
  };

  const getGoogleMapsUrl = () => {
    if (lat && lng) {
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else if (displayAddress) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`;
    }
    return null;
  };

  const mapsUrl = getGoogleMapsUrl();

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div ref={containerRef} className="relative">
          {/* Autocomplete input will be inserted here */}
        </div>
        <MapPin className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      <p className="text-sm text-[#7A7A7A]">
        Search for any location: addresses, landmarks, cities, businesses, parks, etc.
      </p>

      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#21B3B1] hover:text-[#168E8C]"
        >
          <ExternalLink className="w-4 h-4" />
          View on Google Maps
        </a>
      )}

      {lat && lng && (
        <p className="text-xs text-[#7A7A7A]">
          Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
