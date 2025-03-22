import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

// List of paths that don't require authentication
const publicPaths = ['/login', '/signup'];

export async function middleware(request: NextRequestWithAuth) {
  const path = request.nextUrl.pathname;
  console.log(`[Middleware] Processing request for path: ${path}`);
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(publicPath => path.startsWith(publicPath));
  console.log(`[Middleware] Path ${path} is ${isPublicPath ? 'public' : 'protected'}`);

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  if (token) {
    console.log(`[Middleware] User authenticated: ${token.email}`);
  } else {
    console.log('[Middleware] No authentication token found');
  }
  
  // Redirect logic
  if (!token && !isPublicPath) {
    console.log(`[Middleware] Unauthenticated user attempting to access protected route: ${path}`);
    console.log(`[Middleware] Redirecting to login with callback URL: ${request.url}`);
    // If no token and trying to access protected route, redirect to login
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  if (token && isPublicPath) {
    console.log(`[Middleware] Authenticated user attempting to access public route: ${path}`);
    console.log(`[Middleware] Redirecting to editor`);
    // If has token and trying to access login/signup, redirect to editor
    return NextResponse.redirect(new URL('/editor', request.url));
  }

  console.log(`[Middleware] Request proceeding for path: ${path}`);
  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
}; 