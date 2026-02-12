import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';
import ManageCookies from '@/components/ManageCookies';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Signup */}
        <NewsletterSignup />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image
                src="/images/foreignteer-logo.png"
                alt="Foreignteer"
                width={140}
                height={35}
                className="h-9 w-auto"
              />
              <span className="text-xl font-heading font-bold text-[#21B3B1]">
                Foreignteer
              </span>
            </Link>
            <p className="text-sm text-text-light mb-4">
              Connecting volunteers with meaningful experiences worldwide.
            </p>
            <div className="space-y-2 text-sm text-text-light">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Hong Kong</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@foreignteer.com" className="hover:text-primary">
                  info@foreignteer.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-text mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/experiences"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Browse Experiences
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/partner"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For NGOs */}
          <div>
            <h4 className="font-semibold text-text mb-4">For NGOs</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/partner"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/ngo"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  NGO Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-text mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <ManageCookies />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-light text-center md:text-left">
              &copy; {currentYear} Foreignteer. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/foreignteer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-light hover:text-[#21B3B1] transition-colors p-3 min-w-[48px] min-h-[48px] flex items-center justify-center hover:bg-gray-100 rounded-lg"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/foreignteer/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-light hover:text-[#21B3B1] transition-colors p-3 min-w-[48px] min-h-[48px] flex items-center justify-center hover:bg-gray-100 rounded-lg"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/foreignteer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-light hover:text-[#21B3B1] transition-colors p-3 min-w-[48px] min-h-[48px] flex items-center justify-center hover:bg-gray-100 rounded-lg"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
