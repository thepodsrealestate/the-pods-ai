import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public static assets and auth endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/icon.svg') ||
    pathname.startsWith('/logo_white.jpeg') ||
    pathname.startsWith('/logo_black.jpeg') ||
    pathname === '/login' ||
    pathname === '/api/auth/login' ||
    pathname === '/api/auth/verify' ||
    pathname === '/api/webhooks/whatsapp'
  ) {
    return NextResponse.next();
  }

  // 2. Check HttpOnly session cookie
  const sessionToken = req.cookies.get('pods_session')?.value;
  const sessionSecret = process.env.DASHBOARD_SESSION_SECRET || 'authenticated_minesh_pods_session_token_2026';
  const isAuthenticated = sessionToken === sessionSecret;

  // 3. Protect API routes server-side
  if (pathname.startsWith('/api/')) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized: Valid server authentication session required' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 4. Protect Dashboard routes server-side
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*', '/login'],
};
