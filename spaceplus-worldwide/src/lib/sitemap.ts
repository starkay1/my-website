// Sitemap generation utilities for SpacePlus Worldwide

import { seoConfig } from '@/config/seo';

export interface SitemapUrl {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: {
    languages: Record<string, string>;
  };
}

// Static pages configuration
const staticPages = [
  {
    path: '',
    changeFreq: 'weekly' as const,
    priority: 1.0,
    lastMod: new Date(),
  },
  {
    path: '/services',
    changeFreq: 'monthly' as const,
    priority: 0.9,
    lastMod: new Date(),
  },
  {
    path: '/about',
    changeFreq: 'monthly' as const,
    priority: 0.8,
    lastMod: new Date(),
  },
  {
    path: '/contact',
    changeFreq: 'monthly' as const,
    priority: 0.7,
    lastMod: new Date(),
  },
];

// Supported locales
const locales = ['en', 'zh'];
const defaultLocale = 'en';

// Generate sitemap URLs for all pages and locales
export function generateSitemapUrls(): SitemapUrl[] {
  const baseUrl = seoConfig.siteUrl.replace(/\/$/, '');
  const urls: SitemapUrl[] = [];

  // Generate URLs for each static page and locale
  staticPages.forEach(page => {
    locales.forEach(locale => {
      const path = page.path;
      const localizedPath = locale === defaultLocale ? path : `/${locale}${path}`;
      const fullUrl = `${baseUrl}${localizedPath}`;

      // Generate alternate language URLs
      const alternates: Record<string, string> = {};
      locales.forEach(altLocale => {
        const altPath = altLocale === defaultLocale ? path : `/${altLocale}${path}`;
        alternates[altLocale] = `${baseUrl}${altPath}`;
      });

      urls.push({
        url: fullUrl,
        lastModified: page.lastMod,
        changeFrequency: page.changeFreq,
        priority: page.priority,
        alternates: {
          languages: alternates,
        },
      });
    });
  });

  return urls;
}

// Generate XML sitemap content
export function generateSitemapXML(urls: SitemapUrl[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const sitemapOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
  const sitemapClose = '</urlset>';

  const urlEntries = urls.map(urlEntry => {
    const { url, lastModified, changeFrequency, priority, alternates } = urlEntry;
    
    let entry = '  <url>\n';
    entry += `    <loc>${escapeXml(url)}</loc>\n`;
    
    if (lastModified) {
      entry += `    <lastmod>${lastModified.toISOString().split('T')[0]}</lastmod>\n`;
    }
    
    if (changeFrequency) {
      entry += `    <changefreq>${changeFrequency}</changefreq>\n`;
    }
    
    if (priority !== undefined) {
      entry += `    <priority>${priority.toFixed(1)}</priority>\n`;
    }
    
    // Add alternate language links
    if (alternates?.languages) {
      Object.entries(alternates.languages).forEach(([lang, langUrl]) => {
        entry += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(langUrl)}" />\n`;
      });
    }
    
    entry += '  </url>';
    return entry;
  }).join('\n');

  return `${xmlHeader}\n${sitemapOpen}\n${urlEntries}\n${sitemapClose}`;
}

// Generate robots.txt content
export function generateRobotsTxt(): string {
  const baseUrl = seoConfig.siteUrl.replace(/\/$/, '');
  
  return `# Robots.txt for SpacePlus Worldwide
# Generated automatically

User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /.well-known/
Disallow: /private/

# Allow important files
Allow: /api/sitemap
Allow: /api/robots

# Sitemap location
Sitemap: ${baseUrl}/api/sitemap

# Crawl delay for respectful crawling
Crawl-delay: 1

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

# Block AI training bots (optional)
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /`;
}

// Utility function to escape XML characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Generate sitemap index for large sites (future use)
export function generateSitemapIndex(sitemaps: string[]): string {
  const baseUrl = seoConfig.siteUrl.replace(/\/$/, '');
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const indexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const indexClose = '</sitemapindex>';

  const sitemapEntries = sitemaps.map(sitemap => {
    return `  <sitemap>
    <loc>${baseUrl}${sitemap}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;
  }).join('\n');

  return `${xmlHeader}\n${indexOpen}\n${sitemapEntries}\n${indexClose}`;
}

// Validate sitemap URLs
export function validateSitemapUrls(urls: SitemapUrl[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const baseUrl = seoConfig.siteUrl;

  urls.forEach((urlEntry, index) => {
    // Check if URL is valid
    try {
      new URL(urlEntry.url);
    } catch {
      errors.push(`Invalid URL at index ${index}: ${urlEntry.url}`);
    }

    // Check if URL belongs to the same domain
    if (!urlEntry.url.startsWith(baseUrl)) {
      errors.push(`URL at index ${index} does not belong to the site domain: ${urlEntry.url}`);
    }

    // Check priority range
    if (urlEntry.priority !== undefined && (urlEntry.priority < 0 || urlEntry.priority > 1)) {
      errors.push(`Invalid priority at index ${index}: ${urlEntry.priority}. Must be between 0 and 1.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

const sitemapUtils = {
  generateSitemapUrls,
  generateSitemapXML,
  generateRobotsTxt,
  generateSitemapIndex,
  validateSitemapUrls,
};

export default sitemapUtils;