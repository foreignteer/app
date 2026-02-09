'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { UserRole } from '@/lib/types/user';

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export default function DashboardLayout({
  children,
  requiredRole,
}: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login
        router.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname));
      } else if (requiredRole && user.role !== requiredRole) {
        // Logged in but wrong role - redirect to appropriate dashboard
        router.push(`/dashboard/${user.role}`);
      }
    }
  }, [user, loading, requiredRole, router]);

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

  if (requiredRole && user.role !== requiredRole) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role={user.role} />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
