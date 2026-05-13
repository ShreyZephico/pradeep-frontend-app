import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('customerAccessToken');
  const { pathname } = request.nextUrl;

  // Public paths (no login required)
  const publicPaths = [
    '/login',
    '/signup',
    '/api/auth',
    '/api/login',
    '/api/signup',
    '/api/check-user',
    '/api/send-otp',
    '/api/verify-otp',
    '/api/products',
  ];
  const publicPages = ['/', '/landing', '/products'];
  const isPublicPath =
    publicPages.includes(pathname) ||
    publicPaths.some(path => pathname.startsWith(path));

  // If no token and trying to access private page → redirect to login
  if (!token && !isPublicPath) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Please login before continuing.' }, { status: 401 });
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If has token and trying to access login → redirect to landing
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/landing', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
