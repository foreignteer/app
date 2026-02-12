'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { UserRole } from '@/lib/types/user';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export default function DashboardLayout({
  children,
  requiredRole,
}: DashboardLayoutProps) {
  const { user, loading, firebaseUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login
        router.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname));
      } else if (firebaseUser && !firebaseUser.emailVerified) {
        // Email not verified - redirect to verification page
        router.push('/verify-email');
      } else if (requiredRole && user.role !== requiredRole) {
        // Logged in but wrong role - redirect to appropriate dashboard
        router.push(`/dashboard/${user.role}`);
      }
    }
  }, [user, loading, firebaseUser, requiredRole, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (firebaseUser && !firebaseUser.emailVerified) {
    return null; // Will redirect to verify-email
  }

  if (requiredRole && user.role !== requiredRole) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-3 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-[#4A4A4A]" />
      </button>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar - responsive */}
      <aside
        className={`
          fixed md:relative
          inset-y-0 left-0
          transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-transform duration-300 ease-in-out
          w-64
          z-50 md:z-auto
        `}
      >
        <DashboardSidebar
          role={user.role}
          onClose={() => setMobileMenuOpen(false)}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 w-full">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
