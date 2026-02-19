'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, Clock, Heart, Shield, Users, CheckCircle, ArrowRight, Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Testimonial } from '@/lib/types/testimonial';
import RecentExperiences from '@/components/experiences/RecentExperiences';
import { AnalyticsEvents } from '@/lib/analytics/tracker';

export default function HomePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Track homepage view
    AnalyticsEvents.PAGE_VIEW('/');

    // Fetch published testimonials
    fetch('/api/testimonials?publishedOnly=true')
      .then((res) => res.json())
      .then((data) => setTestimonials(data.testimonials || []))
      .catch((err) => console.error('Error fetching testimonials:', err));
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#C9F0EF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <Badge variant="primary" size="lg" className="bg-[#21B3B1] text-white">
                Micro-volunteering for travellers
              </Badge>

              <h1 className="text-5xl lg:text-6xl font-bold text-[#2C3E3A] leading-tight">
                One meaningful experience.
                <br />
                <span className="text-[#21B3B1]">Two hours.</span>
                <br />
                Anywhere.
              </h1>

              <p className="text-xl text-[#4A4A4A] leading-relaxed">
                Connect with local causes during your travels. Make a real impact in just a few hours,
                no matter where you are in the world.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/experiences"
                  onClick={() => AnalyticsEvents.CTA_CLICK('Browse Experiences', 'homepage_hero')}
                >
                  <Button size="lg" className="group">
                    Browse Experiences
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link
                  href="/partner"
                  onClick={() => AnalyticsEvents.CTA_CLICK('Partner with Us', 'homepage_hero')}
                >
                  <Button size="lg" variant="outline">
                    Partner with Us
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right - Image Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[500px] lg:h-[600px]"
            >
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="space-y-4">
                  <div className="relative h-[55%] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&q=80"
                      alt="Volunteers helping community"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="relative h-[40%] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop&q=80"
                      alt="Teaching children"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-[40%] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&h=600&fit=crop&q=80"
                      alt="Beach cleanup"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="relative h-[55%] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop&q=80"
                      alt="Community building"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is Foreignteer */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-[#2C3E3A]">
              What is Foreignteer?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Foreignteer connects travellers with short, meaningful volunteering opportunities
              during their trips. Whether you have two hours or an afternoon, you can make a
              real difference in the communities you visit. Browse verified experiences hosted
              by local NGOs and give back while you explore the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#2C3E3A] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started with micro-volunteering is simple
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center space-y-4"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-[#2D5A4A] flex items-center justify-center">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-[#2C3E3A]">
                1. Browse
              </h3>
              <p className="text-gray-600">
                Explore vetted micro-volunteering opportunities in your destination.
                Filter by cause, location, and availability.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center space-y-4"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-[#E8B86D] flex items-center justify-center">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-[#2C3E3A]">
                2. Book
              </h3>
              <p className="text-gray-600">
                Reserve your spot with a small booking fee. Get instant confirmation
                and all the details you need.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center space-y-4"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-[#21B3B1] flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-[#2C3E3A]">
                3. Impact
              </h3>
              <p className="text-gray-600">
                Show up, contribute, and make a difference. Leave with memories
                and connections that last.
              </p>
            </motion.div>
          </div>

          {/* How It Works CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="group">
                Learn More About How It Works
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Micro-Volunteering */}
      <section className="py-20 bg-[#F6C98D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold text-[#2C3E3A]">
                Why Micro-Volunteering?
              </h2>
              <p className="text-lg text-[#4A4A4A] leading-relaxed">
                Traditional volunteering programs require weeks of commitment.
                Micro-volunteering lets you contribute meaningfully in just a few hours,
                fitting perfectly into your travel schedule.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#21B3B1] flex-shrink-0 mt-1" />
                  <span className="text-lg text-[#4A4A4A]">
                    <strong>Flexible:</strong> Volunteer for 2-4 hours, not 2-4 weeks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#21B3B1] flex-shrink-0 mt-1" />
                  <span className="text-lg text-[#4A4A4A]">
                    <strong>Meaningful:</strong> Every hour makes a real impact
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#21B3B1] flex-shrink-0 mt-1" />
                  <span className="text-lg text-[#4A4A4A]">
                    <strong>Authentic:</strong> Connect with local communities genuinely
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#21B3B1] flex-shrink-0 mt-1" />
                  <span className="text-lg text-[#4A4A4A]">
                    <strong>Vetted:</strong> All experiences verified by our team
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Right - Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&h=600&fit=crop&q=80"
                alt="Volunteers making impact"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#2C3E3A] mb-4">
              Trust & Safety
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your safety and the integrity of our platform are our top priorities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#2D5A4A] flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E3A]">
                Verified Organizations
              </h3>
              <p className="text-gray-600">
                Every NGO is thoroughly vetted before joining our platform.
                We verify registration, mission, and track record.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 rounded-2xl p-8 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#E8B86D] flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E3A]">
                Community Reviews
              </h3>
              <p className="text-gray-600">
                Read reviews from fellow volunteers. Share your experience
                and help others make informed decisions.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-50 rounded-2xl p-8 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#21B3B1] flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E3A]">
                Support Team
              </h3>
              <p className="text-gray-600">
                Our team is here to help before, during, and after your experience.
                Get support when you need it.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-[#C9F0EF] to-[#F6C98D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[#2C3E3A] mb-3">
                What Our Volunteers Say
              </h2>
              <p className="text-base text-[#4A4A4A] max-w-2xl mx-auto">
                Real stories from travellers who made a difference
              </p>
            </motion.div>

            <div className="relative">
              {/* Scroll Left Button */}
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110 -ml-4"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-[#21B3B1]" />
              </button>

              {/* Scroll Right Button */}
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110 -mr-4"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-[#21B3B1]" />
              </button>

              {/* Scrollable Container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow relative flex-shrink-0 w-[320px] h-[280px] flex flex-col"
                  >
                    {/* Quote Icon */}
                    <div className="absolute top-4 right-4 text-[#C9F0EF]">
                      <Quote className="w-8 h-8" />
                    </div>

                    {/* Rating */}
                    {testimonial.rating && (
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating!
                                ? 'fill-[#F6C98D] text-[#F6C98D]'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Content */}
                    <p className="text-sm text-[#4A4A4A] mb-4 leading-relaxed italic line-clamp-4 flex-grow">
                      "{testimonial.content}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-3 pt-4 border-t border-[#E6EAEA] mt-auto">
                      {testimonial.image ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#21B3B1] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#2C3E3A] truncate">
                          {testimonial.name}
                        </p>
                        {testimonial.location && (
                          <p className="text-xs text-[#7A7A7A] truncate">
                            📍 {testimonial.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Hide scrollbar CSS */}
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </section>
      )}

      {/* Recent Experiences */}
      <RecentExperiences />

      {/* Final CTA */}
      <section className="relative py-24 bg-gradient-to-r from-[#2D5A4A] to-[#21B3B1] text-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to make an impact?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of travellers giving back to the communities they visit
            </p>
            <Link href="/experiences">
              <Button
                size="lg"
                className="bg-white text-[#2D5A4A] hover:bg-gray-100 border-2 border-white group"
              >
                Browse Experiences
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-white rounded-full" />
        </div>
      </section>
    </div>
  );
}
