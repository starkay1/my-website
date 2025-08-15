import { NextResponse } from 'next/server';
import { generateRobotsTxt } from '@/lib/sitemap';

export async function GET() {
  try {
    // Generate robots.txt content
    const robotsTxt = generateRobotsTxt();
    
    return new NextResponse(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        'X-Robots-Tag': 'noindex', // Don't index the robots.txt file itself
      },
    });
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    
    // Return a basic robots.txt as fallback
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spaceplus-worldwide.com';
    const fallbackRobots = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/api/sitemap`;
    
    return new NextResponse(fallbackRobots, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Shorter cache for fallback
      },
    });
  }
}