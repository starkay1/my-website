import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware({
  locales: ['zh-CN', 'en', 'th'],
  defaultLocale: 'zh-CN',
  localePrefix: 'as-needed',
  localeDetection: true
});

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change-me');
const PROTECTED_PREFIXES = ['/admin', '/api/admin'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internationalization for admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
    const isLoginPage = pathname === '/admin/login';

    if (isProtected && !isLoginPage) {
      const token = request.cookies.get('admin_token')?.value;
      if (!token) {
        const url = new URL('/admin/login', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
      try {
        await jwtVerify(token, secret);
      } catch {
        const url = new URL('/admin/login', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
    }
    
    // For admin routes, just continue without internationalization
    return NextResponse.next();
  }

  // Apply internationalization middleware for non-admin routes
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(zh-CN|en|th)/:path*', '/admin/:path*', '/api/admin/:path*']
};