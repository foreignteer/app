import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get Firebase auth token from cookies (if exists)
  const token = request.cookies.get('__session')?.value;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/how-it-works',
    '/contact',
    '/partner',
    '/login',
    '/register',
  ];

  // Check if current path is public or starts with public path
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith('/experiences') ||
    pathname.startsWith('/ngos') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public');

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Dashboard routes - rely on client-side DashboardLayout for auth checks
  // Firebase Auth uses localStorage, not cookies, so we can't check auth here
  // Client-side DashboardLayout handles authentication and role-based redirects
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
