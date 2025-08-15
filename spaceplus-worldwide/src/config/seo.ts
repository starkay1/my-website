// SEO Configuration for SpacePlus Worldwide

export const seoConfig = {
  // Basic SEO Settings
  defaultTitle: 'SpacePlus Worldwide - Global Space Solutions & Consulting',
  titleTemplate: '%s | SpacePlus Worldwide',
  defaultDescription: 'Leading provider of space solutions, satellite consulting, and aerospace technology services worldwide. Expert space industry consulting for commercial and government clients.',
  
  // Site Information
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://spaceplus-worldwide.com',
  siteName: 'SpacePlus Worldwide',
  
  // Open Graph Configuration
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://spaceplus-worldwide.com',
    siteName: 'SpacePlus Worldwide',
    title: 'SpacePlus Worldwide - Global Space Solutions & Consulting',
    description: 'Leading provider of space solutions, satellite consulting, and aerospace technology services worldwide.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SpacePlus Worldwide - Space Solutions',
      },
    ],
  },
  
  // Twitter Card Configuration
  twitter: {
    handle: '@spaceplusww',
    site: '@spaceplusww',
    cardType: 'summary_large_image',
  },
  
  // Additional Meta Tags
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#1a365d',
    },
    {
      name: 'msapplication-TileColor',
      content: '#1a365d',
    },
    {
      name: 'keywords',
      content: 'space solutions, satellite consulting, aerospace technology, space industry, commercial space, government space services, space mission planning, satellite operations, space technology consulting',
    },
    {
      name: 'author',
      content: 'SpacePlus Worldwide',
    },
    {
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
  ],
  
  // Structured Data (JSON-LD)
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SpacePlus Worldwide',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://spaceplus-worldwide.com',
    logo: {
      '@type': 'ImageObject',
      url: '/images/logo.png',
    },
    description: 'Leading provider of space solutions, satellite consulting, and aerospace technology services worldwide.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-XXX-XXX-XXXX',
      contactType: 'customer service',
      availableLanguage: ['English', 'Chinese'],
    },
    sameAs: [
      'https://linkedin.com/company/spaceplus-worldwide',
      'https://twitter.com/spaceplusww',
    ],
  },
};

// Page-specific SEO configurations
export const pageConfigs = {
  home: {
    title: 'Home',
    description: 'SpacePlus Worldwide - Your trusted partner for comprehensive space solutions, satellite consulting, and aerospace technology services.',
    keywords: 'space solutions, satellite consulting, aerospace technology, space industry leader',
  },
  services: {
    title: 'Our Services',
    description: 'Comprehensive space industry services including satellite consulting, mission planning, technology development, and space operations support.',
    keywords: 'space services, satellite consulting, mission planning, space operations, aerospace consulting',
  },
  about: {
    title: 'About Us',
    description: 'Learn about SpacePlus Worldwide\'s mission, vision, and expertise in providing world-class space solutions and consulting services.',
    keywords: 'about spaceplus, space company, aerospace expertise, space industry experience',
  },
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with SpacePlus Worldwide for your space solutions needs. Contact our expert team for consultation and services.',
    keywords: 'contact spaceplus, space consulting contact, aerospace services inquiry',
  },
};

// Generate structured data for specific page types
export const generateStructuredData = (pageType: string, pageData?: Record<string, unknown>) => {
  const baseData = seoConfig.structuredData;
  
  switch (pageType) {
    case 'service':
      return {
        ...baseData,
        '@type': 'Service',
        name: pageData?.title || 'Space Solutions Service',
        description: pageData?.description || 'Professional space industry service',
        provider: {
          '@type': 'Organization',
          name: 'SpacePlus Worldwide',
        },
      };
    
    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: pageData?.title,
        description: pageData?.description,
        author: {
          '@type': 'Organization',
          name: 'SpacePlus Worldwide',
        },
        publisher: {
          '@type': 'Organization',
          name: 'SpacePlus Worldwide',
          logo: {
            '@type': 'ImageObject',
            url: '/images/logo.png',
          },
        },
        datePublished: pageData?.publishDate,
        dateModified: pageData?.modifiedDate,
      };
    
    default:
      return baseData;
  }
};

// SEO utility functions
export const generatePageTitle = (pageTitle?: string) => {
  if (!pageTitle) return seoConfig.defaultTitle;
  return `${pageTitle} | ${seoConfig.siteName}`;
};

export const generatePageDescription = (pageDescription?: string) => {
  return pageDescription || seoConfig.defaultDescription;
};

export const generateCanonicalUrl = (path: string) => {
  const baseUrl = seoConfig.siteUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export default seoConfig;