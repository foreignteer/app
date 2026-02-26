import { Metadata } from 'next';
import Image from 'next/image';
import { Download, Copy, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Brand Kit | Foreignteer',
  description: 'Official Foreignteer brand assets, colors, and typography guidelines.',
  robots: {
    index: false, // Don't index this page
    follow: false,
  },
};

export default function BrandKitPage() {
  return (
    <div className="min-h-screen bg-[#FAF5EC] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#4A4A4A] mb-4">Foreignteer Brand Kit</h1>
          <p className="text-lg text-[#7A7A7A]">
            Official brand assets, color palette, typography, and usage guidelines for Foreignteer.
          </p>
          <p className="text-sm text-[#7A7A7A] mt-2">
            Last updated: February 2026
          </p>
        </div>

        {/* Logo Section */}
        <section className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-6">Logo</h2>

          {/* Primary Logo */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#4A4A4A] mb-4">Primary Logo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Light Background */}
              <div>
                <p className="text-sm text-[#7A7A7A] mb-3">On Light Background</p>
                <div className="bg-white border-2 border-gray-200 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                  <Image
                    src="/images/foreignteer-logo.png"
                    alt="Foreignteer Logo"
                    width={300}
                    height={75}
                    className="w-auto h-16"
                  />
                </div>
              </div>
              {/* Dark Background */}
              <div>
                <p className="text-sm text-[#7A7A7A] mb-3">On Dark Background</p>
                <div className="bg-[#2C3E3A] rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                  <Image
                    src="/images/foreignteer-logo.png"
                    alt="Foreignteer Logo"
                    width={300}
                    height={75}
                    className="w-auto h-16"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logo Usage Guidelines */}
          <div className="bg-gray-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-[#4A4A4A] mb-3">Logo Usage Guidelines</h3>
            <ul className="space-y-2 text-sm text-[#7A7A7A]">
              <li>✅ Maintain clear space around the logo (minimum 20px)</li>
              <li>✅ Use the logo at a minimum height of 40px for digital</li>
              <li>❌ Don't stretch, distort, or rotate the logo</li>
              <li>❌ Don't change the logo colors</li>
              <li>❌ Don't add effects (shadows, outlines, gradients)</li>
            </ul>
          </div>
        </section>

        {/* Color Palette */}
        <section className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-6">Color Palette</h2>

          {/* Primary Colors */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#4A4A4A] mb-4">Primary Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <ColorCard
                name="Teal Blue"
                hex="#21B3B1"
                usage="Main brand color, buttons, links"
                textColor="white"
              />
              <ColorCard
                name="Sand Peach"
                hex="#F6C98D"
                usage="Secondary accent, warm sections"
                textColor="#4A4A4A"
              />
              <ColorCard
                name="Light Aqua"
                hex="#C9F0EF"
                usage="Hero background, light sections"
                textColor="#4A4A4A"
              />
              <ColorCard
                name="Charcoal Grey"
                hex="#4A4A4A"
                usage="Primary text color"
                textColor="white"
              />
              <ColorCard
                name="White"
                hex="#FFFFFF"
                usage="Backgrounds, cards"
                textColor="#4A4A4A"
                border
              />
            </div>
          </div>

          {/* Supporting Colors */}
          <div>
            <h3 className="text-lg font-semibold text-[#4A4A4A] mb-4">Supporting Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <ColorCard
                name="Soft Sand"
                hex="#FAF5EC"
                usage="Card backgrounds"
                textColor="#4A4A4A"
              />
              <ColorCard
                name="Mist Grey"
                hex="#E6EAEA"
                usage="Dividers, borders"
                textColor="#4A4A4A"
              />
              <ColorCard
                name="Deep Teal"
                hex="#168E8C"
                usage="Hover states"
                textColor="white"
              />
              <ColorCard
                name="Olive Grey"
                hex="#8FA6A1"
                usage="Tags, icons"
                textColor="white"
              />
              <ColorCard
                name="Warm Grey"
                hex="#7A7A7A"
                usage="Secondary text"
                textColor="white"
              />
              <ColorCard
                name="Soft Green"
                hex="#6FB7A4"
                usage="Success states"
                textColor="white"
              />
              <ColorCard
                name="Soft Amber"
                hex="#F2B56B"
                usage="Notices, warnings"
                textColor="#4A4A4A"
              />
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-6">Typography</h2>

          {/* Montserrat - Headings */}
          <div className="mb-8">
            <div className="flex items-baseline gap-4 mb-4">
              <h3 className="text-lg font-semibold text-[#4A4A4A]">Montserrat</h3>
              <span className="text-sm text-[#7A7A7A]">Headings • Weights: 600, 700</span>
            </div>
            <div className="space-y-3">
              <div className="font-heading font-bold text-5xl text-[#4A4A4A]">
                Aa Bb Cc Dd Ee Ff
              </div>
              <div className="font-heading font-semibold text-3xl text-[#7A7A7A]">
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          </div>

          {/* Lato - Body */}
          <div>
            <div className="flex items-baseline gap-4 mb-4">
              <h3 className="text-lg font-semibold text-[#4A4A4A]">Lato</h3>
              <span className="text-sm text-[#7A7A7A]">Body Text • Weights: 400, 700</span>
            </div>
            <div className="space-y-3">
              <div className="font-body text-4xl text-[#4A4A4A]">
                Aa Bb Cc Dd Ee Ff
              </div>
              <div className="font-body text-xl text-[#7A7A7A]">
                The quick brown fox jumps over the lazy dog
              </div>
              <div className="font-body text-base text-[#7A7A7A]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
            </div>
          </div>
        </section>

        {/* Voice & Tone */}
        <section className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-6">Voice & Tone</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#21B3B1] mb-3">We Are</h3>
              <ul className="space-y-2 text-[#7A7A7A]">
                <li>✓ Authentic and genuine</li>
                <li>✓ Warm and welcoming</li>
                <li>✓ Action-oriented</li>
                <li>✓ Impact-focused</li>
                <li>✓ Inclusive and accessible</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#4A4A4A] mb-3">We Are Not</h3>
              <ul className="space-y-2 text-[#7A7A7A]">
                <li>✗ Corporate or stuffy</li>
                <li>✗ Guilt-inducing</li>
                <li>✗ Overly casual</li>
                <li>✗ Preachy or judgmental</li>
                <li>✗ Complicated or jargon-heavy</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Imagery Guidelines */}
        <section className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-6">Imagery Guidelines</h2>
          <div className="space-y-4 text-[#7A7A7A]">
            <div>
              <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">Photography Style</h3>
              <ul className="space-y-2">
                <li>✓ Authentic moments of people helping others</li>
                <li>✓ Natural lighting, candid shots</li>
                <li>✓ Diverse representation of volunteers and communities</li>
                <li>✓ Focus on action and impact</li>
                <li>✓ Warm, welcoming tones</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">Avoid</h3>
              <ul className="space-y-2">
                <li>✗ Staged or overly posed photos</li>
                <li>✗ "Savior" imagery</li>
                <li>✗ Heavy filters or artificial effects</li>
                <li>✗ Stock photo feel</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="bg-[#21B3B1] text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-white/90 mb-6">
            For questions about brand usage or to request additional assets, contact us at:
          </p>
          <a
            href="mailto:info@foreignteer.com"
            className="inline-block bg-white text-[#21B3B1] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            info@foreignteer.com
          </a>
        </section>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-[#7A7A7A]">
          <p>© 2026 Foreignteer. All brand assets are proprietary and protected.</p>
          <p className="mt-2">This page is for internal use and partners only. Please do not share publicly.</p>
        </div>
      </div>
    </div>
  );
}

// Color Card Component
function ColorCard({
  name,
  hex,
  usage,
  textColor = 'white',
  border = false
}: {
  name: string;
  hex: string;
  usage: string;
  textColor?: string;
  border?: boolean;
}) {
  return (
    <div className="group">
      <div
        className={`rounded-lg p-6 mb-3 aspect-square flex flex-col justify-between transition-transform hover:scale-105 ${border ? 'border-2 border-gray-200' : ''}`}
        style={{ backgroundColor: hex }}
      >
        <div className={`text-${textColor === 'white' ? 'white' : '[#4A4A4A]'} font-semibold`}>
          {name}
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(hex);
          }}
          className={`text-${textColor === 'white' ? 'white' : '[#4A4A4A]'} opacity-0 group-hover:opacity-100 transition-opacity text-sm flex items-center gap-2`}
          title="Copy hex code"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
      </div>
      <div className="text-sm">
        <div className="font-mono font-semibold text-[#4A4A4A]">{hex}</div>
        <div className="text-[#7A7A7A] text-xs mt-1">{usage}</div>
      </div>
    </div>
  );
}
