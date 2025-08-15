import { NextResponse } from 'next/server';
import { generateSitemapUrls, generateSitemapXML, validateSitemapUrls } from '@/lib/sitemap';

export async function GET() {
  try {
    // Generate sitemap URLs
    const urls = generateSitemapUrls();
    
    // Validate URLs
    const validation = validateSitemapUrls(urls);
    if (!validation.valid) {
      console.error('Sitemap validation errors:', validation.errors);
      // Continue with generation but log errors
    }
    
    // Generate XML sitemap
    const sitemapXML = generateSitemapXML(urls);
    
    return new NextResponse(sitemapXML, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        'X-Robots-Tag': 'noindex', // Don't index the sitemap itself
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a basic sitemap as fallback
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spaceplus-worldwide.com';
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Shorter cache for fallback
      },
    });
  }
}