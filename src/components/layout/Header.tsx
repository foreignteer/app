'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Foreignteer Home">
            <Image
              src="/images/foreignteer-logo.png"
              alt="Foreignteer Logo"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <span className="text-2xl font-heading font-bold text-[#21B3B1]">
              Foreignteer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/experiences"
              className="text-text-primary hover:text-primary transition-colors"
            >
              Experiences
            </Link>
            <Link
              href="/partner"
              className="text-text-primary hover:text-primary transition-colors"
            >
              Partner With Us
            </Link>
            <Link
              href="/blog"
              className="text-text-primary hover:text-primary transition-colors"
            >
              Blog
            </Link>

            {/* Auth Buttons */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link href={`/dashboard/${user.role}`}>
                      <Button variant="ghost" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="primary" size="sm">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 text-text-primary min-w-[48px] min-h-[48px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link
                href="/experiences"
                className="text-text-primary hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Experiences
              </Link>
              <Link
                href="/partner"
                className="text-text-primary hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Partner With Us
              </Link>
              <Link
                href="/blog"
                className="text-text-primary hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>

              {/* Mobile Auth Buttons */}
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href={`/dashboard/${user.role}`}
                        className="text-text-primary hover:text-primary py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Button variant="outline" onClick={handleSignOut} fullWidth>
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" fullWidth>
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="primary" fullWidth>
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
