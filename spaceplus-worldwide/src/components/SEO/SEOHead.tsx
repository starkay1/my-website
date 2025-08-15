'use client';

import Head from 'next/head';
import { seoConfig, generatePageTitle, generatePageDescription, generateCanonicalUrl, generateStructuredData } from '@/config/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredDataType?: string;
  structuredDataProps?: Record<string, unknown>;
  noIndex?: boolean;
  locale?: string;
}

export default function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  structuredDataType,
  structuredDataProps,
  noIndex = false,
  locale = 'en',
}: SEOHeadProps) {
  const pageTitle = generatePageTitle(title);
  const pageDescription = generatePageDescription(description);
  const canonicalUrl = canonical ? generateCanonicalUrl(canonical) : seoConfig.siteUrl;
  const imageUrl = ogImage || seoConfig.openGraph.images[0].url;
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${seoConfig.siteUrl}${imageUrl}`;

  // Generate structured data if specified
  const structuredData = structuredDataType 
    ? generateStructuredData(structuredDataType, structuredDataProps)
    : seoConfig.structuredData;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={seoConfig.siteName} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots Meta */}
      <meta 
        name="robots" 
        content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} 
      />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:locale" content={locale === 'zh' ? 'zh_CN' : 'en_US'} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={seoConfig.twitter.site} />
      <meta name="twitter:creator" content={seoConfig.twitter.handle} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={pageTitle} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#1a365d" />
      <meta name="msapplication-TileColor" content="#1a365d" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Language alternatives */}
      <link rel="alternate" hrefLang="en" href={`${seoConfig.siteUrl}/en`} />
      <link rel="alternate" hrefLang="zh" href={`${seoConfig.siteUrl}/zh`} />
      <link rel="alternate" hrefLang="x-default" href={`${seoConfig.siteUrl}/en`} />
    </Head>
  );
}

// Hook for easier SEO management
export function useSEO({
  title,
  description,
  canonical,
  ogImage,
  structuredDataType,
  structuredDataProps,
}: Omit<SEOHeadProps, 'keywords' | 'ogType' | 'noIndex' | 'locale'>) {
  return {
    title: generatePageTitle(title),
    description: generatePageDescription(description),
    canonical: canonical ? generateCanonicalUrl(canonical) : seoConfig.siteUrl,
    ogImage: ogImage || seoConfig.openGraph.images[0].url,
    structuredData: structuredDataType 
      ? generateStructuredData(structuredDataType, structuredDataProps)
      : seoConfig.structuredData,
  };
}