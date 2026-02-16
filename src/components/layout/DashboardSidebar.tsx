'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/lib/types/user';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Building2,
  User,
  Settings,
  FileText,
  CheckCircle,
  X,
  Star,
  BarChart3,
} from 'lucide-react';

interface DashboardSidebarProps {
  role: UserRole;
  onClose?: () => void;
}

export default function DashboardSidebar({ role, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  const adminLinks = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/admin/ngos', label: 'NGO Approvals', icon: Building2 },
    {
      href: '/dashboard/admin/experiences',
      label: 'Experience Approvals',
      icon: Calendar,
    },
    { href: '/dashboard/admin/reviews', label: 'Review Moderation', icon: Star },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  ];

  const ngoLinks = [
    { href: '/dashboard/ngo', label: 'Dashboard', icon: LayoutDashboard },
    {
      href: '/dashboard/ngo/experiences',
      label: 'My Experiences',
      icon: Calendar,
    },
    {
      href: '/dashboard/ngo/applicants',
      label: 'Applicants',
      icon: Users,
    },
    {
      href: '/dashboard/ngo/attendance',
      label: 'Attendance',
      icon: CheckCircle,
    },
    {
      href: '/dashboard/ngo/profile',
      label: 'NGO Profile',
      icon: Building2,
    },
  ];

  const userLinks = [
    { href: '/dashboard/user', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/user/bookings', label: 'My Bookings', icon: Calendar },
    { href: '/dashboard/user/profile', label: 'Profile', icon: User },
  ];

  const links = role === 'admin' ? adminLinks : role === 'ngo' ? ngoLinks : userLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen h-full flex flex-col">
      {/* Mobile close button */}
      {onClose && (
        <div className="md:hidden flex justify-end p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-lg transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-[#4A4A4A]" />
          </button>
        </div>
      )}

      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-heading font-bold text-primary">
          {role === 'admin' ? 'Admin' : role === 'ngo' ? 'NGO' : 'User'} Portal
        </h2>
      </div>

      <nav className="p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                {
                  'bg-primary text-text-on-primary': isActive,
                  'text-text hover:bg-gray-100': !isActive,
                }
              )}
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
