import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// 安全头部配置
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// 速率限制配置
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = { windowMs: 15 * 60 * 1000, maxRequests: 100 };

// 获取客户端IP
function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
         request.headers.get('x-real-ip') || 
         request.ip || 'unknown';
}

// 速率限制检查
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return true;
  }
  
  if (record.count >= RATE_LIMIT.maxRequests) return false;
  record.count++;
  return true;
}

// 检查恶意请求
function isSuspiciousRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const url = request.url.toLowerCase();
  
  const suspiciousPatterns = ['sqlmap', 'nikto', 'union select', 'drop table', '<script', 'javascript:'];
  return suspiciousPatterns.some(pattern => userAgent.includes(pattern) || url.includes(pattern));
}

const intlMiddleware = createMiddleware({
  locales: ['zh-CN', 'en', 'th'],
  defaultLocale: 'zh-CN',
  localePrefix: 'always',
  localeDetection: process.env.GITHUB_PAGES !== 'true'
});

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change-me');
const PROTECTED_PREFIXES = ['/admin', '/api/admin'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);
  
  // 安全检查
  if (isSuspiciousRequest(request)) {
    console.warn(`Suspicious request from ${clientIP}: ${request.url}`);
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // 速率限制
  if (!checkRateLimit(clientIP)) {
    return new NextResponse('Too Many Requests', { 
      status: 429, 
      headers: { 'Retry-After': '900' } 
    });
  }

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
    
    // For admin routes, add security headers and continue
    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Apply internationalization middleware for non-admin routes
  const response = intlMiddleware(request);
  
  // 添加安全头部到国际化响应
  if (response) {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  return response;
}

export const config = {
  matcher: ['/', '/(zh-CN|en|th)/:path*', '/admin/:path*', '/api/admin/:path*']
};