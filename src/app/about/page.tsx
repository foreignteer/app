import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import {
  Heart,
  Globe,
  Sparkles,
  ArrowRight,
  Target,
  Compass,
  Handshake,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Foreignteer - Micro-Volunteering Made Easy',
  description: 'Learn about Foreignteer\'s mission to connect travellers with meaningful volunteering experiences. Discover how we\'re making travel more impactful.',
  alternates: {
    canonical: 'https://foreignteer.com/about',
  },
  openGraph: {
    title: 'About Foreignteer',
    description: 'Our mission to connect travellers with meaningful volunteering',
    url: 'https://foreignteer.com/about',
  },
};

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Impact Over Tourism',
      description: 'We believe travel should leave places better than we found them. Every experience creates tangible value for local communities.',
    },
    {
      icon: Handshake,
      title: 'Community First',
      description: 'Local NGOs lead every experience. We\'re the bridge, not the driver — ensuring authenticity and sustainable partnerships.',
    },
    {
      icon: Compass,
      title: 'Accessible Giving',
      description: 'Not everyone can commit weeks to volunteering. We make giving back possible for any traveller, any schedule.',
    },
    {
      icon: Target,
      title: 'Quality Over Quantity',
      description: 'We carefully vet every partner and experience. Less is more when it comes to creating meaningful moments.',
    },
  ];

  const stats = [
    { number: '6', label: 'European Cities' },
    { number: '25+', label: 'NGO Partners' },
    { number: '500+', label: 'Experiences Completed' },
    { number: '2K+', label: 'Hours Volunteered' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF5EC]">
      {/* Hero */}
      <section className="bg-white border-b border-[#E6EAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9F0EF] rounded-full text-[#21B3B1] text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Our Story
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2C3E3A] mb-6">
                Making travel more meaningful
              </h1>
              <p className="text-lg text-[#7A7A7A] leading-relaxed">
                Foreignteer was born from a simple observation: travellers want to connect
                authentically with the places they visit, and local organisations need helping
                hands — even for just an hour or two.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=600&fit=crop&q=80"
                alt="Team collaboration"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C3E3A] mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-[#7A7A7A] leading-relaxed">
              To transform how people travel by creating bridges between conscious
              travellers and local communities. We believe that even small acts of
              service can create lasting impact — for both the giver and the receiver.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-20 bg-[#21B3B1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center"
              >
                <p className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.number}</p>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C3E3A] mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-[#7A7A7A] max-w-2xl mx-auto">
              Our values guide everything we do — from partnering with NGOs to designing experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="flex gap-5 p-6 bg-[#FAF5EC] rounded-2xl hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#C9F0EF] rounded-xl flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-6 h-6 text-[#21B3B1]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2C3E3A] mb-2">{value.title}</h3>
                  <p className="text-[#7A7A7A]">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="py-16 lg:py-24 bg-[#FAF5EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2C3E3A] mb-6">
                The Problem We Solve
              </h2>
              <div className="space-y-6 text-[#7A7A7A] leading-relaxed">
                <p>
                  Traditional volunteering often requires long-term commitments that
                  don't fit a traveller's schedule. Meanwhile, "voluntourism" has developed
                  a reputation for being more about the tourist than the community.
                </p>
                <p>
                  Local NGOs struggle to find reliable help for short-term tasks, even
                  though many of their needs could be met in just an hour or two by
                  willing participants.
                </p>
                <p>
                  <strong className="text-[#2C3E3A]">Foreignteer bridges this gap.</strong> We connect
                  travellers who want to give back with vetted organisations that have
                  real, immediate needs — creating genuine impact without the logistical
                  complexity.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&q=80"
                alt="Volunteers working together"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C3E3A] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[#7A7A7A] max-w-2xl mx-auto">
              We've made it simple to give back while you travel
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#C9F0EF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-[#21B3B1]" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3">Browse Experiences</h3>
              <p className="text-[#7A7A7A]">
                Explore micro-volunteering opportunities in cities you're visiting,
                from 1-hour workshops to half-day projects.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F6C98D] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-[#F2B56B]" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3">Book & Connect</h3>
              <p className="text-[#7A7A7A]">
                Reserve your spot with just a £15 platform fee. Connect directly
                with vetted NGO partners who value your contribution.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#6FB7A4] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E3A] mb-3">Make an Impact</h3>
              <p className="text-[#7A7A7A]">
                Show up, contribute authentically, and create meaningful connections
                that last long after your trip ends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#FAF5EC] to-[#C9F0EF]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2C3E3A] mb-6">
            Join the movement
          </h2>
          <p className="text-lg text-[#7A7A7A] mb-8 max-w-2xl mx-auto">
            Whether you're a traveller looking to give back or an NGO seeking volunteers,
            we'd love to connect with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/experiences">
              <Button size="lg" className="bg-[#21B3B1] hover:bg-[#168E8C] text-white px-8 w-full sm:w-auto">
                Find Experiences
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-[#21B3B1] text-[#21B3B1] hover:bg-[#C9F0EF] px-8 w-full sm:w-auto"
              >
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
