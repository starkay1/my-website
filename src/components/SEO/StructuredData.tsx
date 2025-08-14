'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'article' | 'service';
  data?: any;
}

export default function StructuredData({ type = 'organization', data }: StructuredDataProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const baseUrl = 'https://spaceplusworldwide.club';
  const currentUrl = `${baseUrl}${pathname}`;

  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': getSchemaType(type),
      ...getSchemaData(type, currentUrl, locale, data)
    };

    return JSON.stringify(baseData, null, 2);
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: getStructuredData() }}
    />
  );
}

function getSchemaType(type: string): string {
  const typeMap: Record<string, string> = {
    organization: 'Organization',
    website: 'WebSite',
    article: 'Article',
    service: 'Service'
  };
  return typeMap[type] || 'Organization';
}

function getSchemaData(type: string, url: string, locale: string, customData?: any) {
  const baseUrl = 'https://spaceplusworldwide.club';
  
  const organizationData = {
    name: 'SpacePlus',
    alternateName: 'SpacePlus Worldwide',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: getLocalizedDescription(locale),
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-XXX-XXX-XXXX',
      contactType: 'customer service',
      availableLanguage: ['Chinese', 'English', 'Thai']
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Global',
      addressLocality: 'Worldwide'
    },
    sameAs: [
      'https://facebook.com/spaceplusworldwide',
      'https://instagram.com/spaceplusworldwide',
      'https://twitter.com/spaceplusww',
      'https://linkedin.com/company/spaceplus'
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 0,
        longitude: 0
      },
      geoRadius: 20000000 // 全球服务
    }
  };

  const websiteData = {
    name: 'SpacePlus - 全球夜生活娱乐平台',
    url: baseUrl,
    description: getLocalizedDescription(locale),
    publisher: {
      '@type': 'Organization',
      name: 'SpacePlus',
      logo: `${baseUrl}/logo.png`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    inLanguage: [locale, 'zh-CN', 'en', 'th']
  };

  const serviceData = {
    name: getLocalizedServiceName(locale),
    description: getLocalizedServiceDescription(locale),
    provider: {
      '@type': 'Organization',
      name: 'SpacePlus',
      url: baseUrl
    },
    serviceType: 'Entertainment Services',
    areaServed: 'Worldwide',
    availableLanguage: ['Chinese', 'English', 'Thai'],
    category: 'Nightlife Entertainment',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free consultation and service matching'
    }
  };

  const articleData = {
    headline: customData?.title || 'SpacePlus Article',
    description: customData?.description || getLocalizedDescription(locale),
    author: {
      '@type': 'Organization',
      name: 'SpacePlus'
    },
    publisher: {
      '@type': 'Organization',
      name: 'SpacePlus',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    datePublished: customData?.publishDate || new Date().toISOString(),
    dateModified: customData?.modifyDate || new Date().toISOString(),
    mainEntityOfPage: url,
    image: customData?.image || `${baseUrl}/og-image.jpg`
  };

  const dataMap: Record<string, any> = {
    organization: organizationData,
    website: websiteData,
    service: serviceData,
    article: articleData
  };

  return { ...dataMap[type], ...customData };
}

function getLocalizedDescription(locale: string): string {
  const descriptions: Record<string, string> = {
    'zh-CN': 'SpacePlus 是全球领先的夜生活娱乐平台，为用户提供世界各地的优质夜生活体验和娱乐服务。',
    'en': 'SpacePlus is a global leading nightlife entertainment platform, providing users with premium nightlife experiences and entertainment services worldwide.',
    'th': 'SpacePlus เป็นแพลตฟอร์มบันเทิงชีวิตยามค่ำคืนชั้นนำระดับโลก ให้บริการประสบการณ์ชีวิตยามค่ำคืนและบริการบันเทิงคุณภาพสูงทั่วโลก'
  };
  return descriptions[locale] || descriptions['en'];
}

function getLocalizedServiceName(locale: string): string {
  const names: Record<string, string> = {
    'zh-CN': '全球夜生活娱乐服务',
    'en': 'Global Nightlife Entertainment Services',
    'th': 'บริการบันเทิงชีวิตยามค่ำคืนทั่วโลก'
  };
  return names[locale] || names['en'];
}

function getLocalizedServiceDescription(locale: string): string {
  const descriptions: Record<string, string> = {
    'zh-CN': '提供全球范围内的夜生活娱乐服务，包括场所推荐、活动策划、VIP服务等。',
    'en': 'Providing global nightlife entertainment services including venue recommendations, event planning, VIP services and more.',
    'th': 'ให้บริการบันเทิงชีวิตยามค่ำคืนทั่วโลก รวมถึงการแนะนำสถานที่ การวางแผนกิจกรรม บริการ VIP และอื่นๆ'
  };
  return descriptions[locale] || descriptions['en'];
}

// 预设的结构化数据组件
export const OrganizationSchema = () => (
  <StructuredData type="organization" />
);

export const WebsiteSchema = () => (
  <StructuredData type="website" />
);

export const ServiceSchema = () => (
  <StructuredData type="service" />
);

export const ArticleSchema = ({ title, description, publishDate, modifyDate, image }: {
  title: string;
  description: string;
  publishDate?: string;
  modifyDate?: string;
  image?: string;
}) => (
  <StructuredData 
    type="article" 
    data={{ title, description, publishDate, modifyDate, image }} 
  />
);