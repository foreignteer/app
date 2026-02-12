'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, MapPin, Award, Heart, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { NGO } from '@/lib/types/ngo';

export default function PartnersPage() {
  const [partners, setPartners] = useState<NGO[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = partners.filter((partner) =>
        partner.name.toLowerCase().includes(query) ||
        partner.description?.toLowerCase().includes(query) ||
        partner.jurisdiction?.toLowerCase().includes(query) ||
        partner.serviceLocations?.some((loc) => loc.toLowerCase().includes(query)) ||
        partner.causes?.some((cause) => cause.toLowerCase().includes(query))
      );
      setFilteredPartners(filtered);
    } else {
      setFilteredPartners(partners);
    }
  }, [searchQuery, partners]);

  const fetchPartners = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ngos/public');

      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }

      const data = await response.json();
      setPartners(data.ngos || []);
      setFilteredPartners(data.ngos || []);
    } catch (err: any) {
      console.error('Error fetching partners:', err);
      setError('Failed to load partners. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#21B3B1] to-[#168E8C] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Partner Organisations</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Meet the verified nonprofits and NGOs creating meaningful impact worldwide.
              Each partner is carefully vetted to ensure quality volunteering experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-[#21B3B1]">{partners.length}+</div>
              <div className="text-sm text-[#7A7A7A]">Verified Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#21B3B1]">
                {new Set(partners.flatMap(p => p.causes || [])).size}+
              </div>
              <div className="text-sm text-[#7A7A7A]">Cause Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#21B3B1]">
                {new Set(partners.flatMap(p => p.serviceLocations || [])).size}+
              </div>
              <div className="text-sm text-[#7A7A7A]">Service Locations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name, location, or cause..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7A7A]" />
          </div>
        </div>

        {/* Partners Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#21B3B1] animate-spin" />
            <span className="ml-3 text-[#7A7A7A]">Loading partners...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-[#7A7A7A] mb-2">No partners found</p>
            <p className="text-[#7A7A7A]">Try adjusting your search</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-[#7A7A7A]">
                {filteredPartners.length} {filteredPartners.length === 1 ? 'partner' : 'partners'} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <Card key={partner.id} variant="elevated" className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Logo */}
                      {partner.logoUrl && (
                        <div className="relative h-24 w-24 mx-auto rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={partner.logoUrl}
                            alt={partner.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                      )}

                      {/* Badge */}
                      <div className="flex items-center justify-center gap-1 text-[#21B3B1] text-sm">
                        <Award className="w-4 h-4" />
                        <span className="font-medium">Verified Partner</span>
                      </div>

                      {/* Name */}
                      <h3 className="text-xl font-bold text-[#4A4A4A] text-center line-clamp-2">
                        {partner.name}
                      </h3>

                      {/* Location */}
                      {partner.jurisdiction && (
                        <div className="flex items-center justify-center gap-2 text-sm text-[#7A7A7A]">
                          <MapPin className="w-4 h-4" />
                          <span>{partner.jurisdiction}</span>
                        </div>
                      )}

                      {/* Service Locations */}
                      {partner.serviceLocations && partner.serviceLocations.length > 0 && (
                        <div className="text-xs text-[#7A7A7A] text-center">
                          Serving: {partner.serviceLocations.slice(0, 2).join(', ')}
                          {partner.serviceLocations.length > 2 && ` +${partner.serviceLocations.length - 2} more`}
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-sm text-[#7A7A7A] line-clamp-3 text-center">
                        {partner.description || 'Creating meaningful impact in the community.'}
                      </p>

                      {/* Causes */}
                      {partner.causes && partner.causes.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {partner.causes.slice(0, 3).map((cause, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[#C9F0EF] text-[#21B3B1] text-xs font-medium rounded-full"
                            >
                              {cause}
                            </span>
                          ))}
                          {partner.causes.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-[#7A7A7A] text-xs font-medium rounded-full">
                              +{partner.causes.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Website Link */}
                      {partner.website && (
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="block">
                          <button className="w-full bg-white border-2 border-[#21B3B1] text-[#21B3B1] hover:bg-[#21B3B1] hover:text-white font-medium px-4 py-2 rounded-lg transition-colors">
                            Visit Website
                          </button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#C9F0EF] to-[#F6C98D] py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#4A4A4A] mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-[#4A4A4A] mb-8">
            Browse experiences from our verified partner organisations and start your volunteering journey today.
          </p>
          <Link href="/experiences">
            <button className="bg-[#21B3B1] hover:bg-[#168E8C] text-white font-medium px-8 py-4 rounded-lg text-lg transition-colors">
              Browse Experiences
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
