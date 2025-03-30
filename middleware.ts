import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/pricing', '/blog', '/login', '/signup'];
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Protected paths that require authentication
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }

  // If user is authenticated and tries to access login/signup, redirect to home
  if (token && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/home',
    '/dashboard/:path*',
    '/editor/:path*',
    '/templates/:path*',
    '/settings/:path*',
    '/login',
    '/signup',
    '/pricing',
    '/blog'
  ]
}; 