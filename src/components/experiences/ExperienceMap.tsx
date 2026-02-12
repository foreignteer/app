'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Experience } from '@/lib/types/experience';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface ExperienceMapProps {
  experiences: Experience[];
}

export function ExperienceMap({ experiences }: ExperienceMapProps) {
  // Filter experiences that have valid coordinates
  const mappableExperiences = experiences.filter(
    (exp) => exp.location?.lat && exp.location?.lng
  );

  // Calculate center of map based on experiences
  const center: [number, number] = mappableExperiences.length > 0
    ? [
        mappableExperiences.reduce((sum, exp) => sum + (exp.location.lat || 0), 0) / mappableExperiences.length,
        mappableExperiences.reduce((sum, exp) => sum + (exp.location.lng || 0), 0) / mappableExperiences.length,
      ]
    : [51.505, -0.09]; // Default to London

  if (mappableExperiences.length === 0) {
    return (
      <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-[#7A7A7A] mb-2">No experiences with location data</p>
          <p className="text-sm text-[#7A7A7A]">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={center}
        zoom={mappableExperiences.length === 1 ? 13 : 6}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mappableExperiences.map((experience) => (
          <Marker
            key={experience.id}
            position={[experience.location.lat!, experience.location.lng!]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-[#4A4A4A] mb-1">
                  {experience.title}
                </h3>
                <p className="text-sm text-[#7A7A7A] mb-2">
                  {experience.city}, {experience.country}
                </p>
                <p className="text-sm font-medium text-[#21B3B1] mb-3">
                  £{experience.totalFee.toFixed(2)}
                </p>
                <Link
                  href={`/experiences/${experience.id}`}
                  className="inline-block bg-[#21B3B1] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#168E8C] transition-colors"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
