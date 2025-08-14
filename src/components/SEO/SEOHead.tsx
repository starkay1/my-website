'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  locale?: string;
  alternateLocales?: string[];
  noIndex?: boolean;
  canonical?: string;
}

interface StructuredDataProps {
  type: 'Organization' | 'Article' | 'JobPosting' | 'NewsArticle' | 'WebPage';
  data: any;
}

function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}

export default function SEOHead({
  title = 'SpacePlus - 专业品牌设计与数字营销服务',
  description = 'SpacePlus提供专业的品牌设计、数字营销、网站开发等服务，助力企业数字化转型和品牌升级。',
  keywords = ['品牌设计', '数字营销', '网站开发', '企业服务', 'SpacePlus'],
  image = '/images/og-default.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  locale = 'zh-CN',
  alternateLocales = ['en', 'th'],
  noIndex = false,
  canonical
}: SEOProps) {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://spaceplus.com';
  const fullUrl = url || `${baseUrl}${pathname}`;
  const canonicalUrl = canonical || fullUrl;

  // 生成组织结构化数据
  const organizationData = {
    name: 'SpacePlus',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description: 'SpacePlus是一家专业的品牌设计与数字营销服务公司',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CN',
      addressLocality: '上海',
      addressRegion: '上海市'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+86-400-123-4567',
      contactType: 'customer service',
      availableLanguage: ['Chinese', 'English', 'Thai']
    },
    sameAs: [
      'https://www.linkedin.com/company/spaceplus',
      'https://twitter.com/spaceplus',
      'https://www.facebook.com/spaceplus'
    ]
  };

  return (
    <>
      <Head>
        {/* 基础元标签 */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <meta name="author" content={author || 'SpacePlus'} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
        
        {/* 语言和地区 */}
        <meta httpEquiv="content-language" content={locale} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* 多语言支持 */}
        {alternateLocales.map(altLocale => (
          <link
            key={altLocale}
            rel="alternate"
            hrefLang={altLocale}
            href={`${baseUrl}/${altLocale}${pathname}`}
          />
        ))}
        
        {/* Open Graph 标签 */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${baseUrl}${image}`} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:site_name" content="SpacePlus" />
        <meta property="og:locale" content={locale.replace('-', '_')} />
        
        {alternateLocales.map(altLocale => (
          <meta
            key={altLocale}
            property="og:locale:alternate"
            content={altLocale.replace('-', '_')}
          />
        ))}
        
        {publishedTime && (
          <meta property="article:published_time" content={publishedTime} />
        )}
        {modifiedTime && (
          <meta property="article:modified_time" content={modifiedTime} />
        )}
        {author && (
          <meta property="article:author" content={author} />
        )}
        
        {/* Twitter Card 标签 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@spaceplus" />
        <meta name="twitter:creator" content="@spaceplus" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${baseUrl}${image}`} />
        
        {/* 移动端优化 */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SpacePlus" />
        
        {/* 图标 */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* 预加载关键资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* 性能优化 */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="format-detection" content="telephone=no" />
      </Head>
      
      {/* 结构化数据 */}
      <StructuredData type="Organization" data={organizationData} />
    </>
  );
}

// 专门用于文章页面的SEO组件
export function ArticleSEO({
  title,
  description,
  image,
  publishedTime,
  modifiedTime,
  author,
  tags = [],
  category,
  url
}: {
  title: string;
  description: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  tags?: string[];
  category?: string;
  url?: string;
}) {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://spaceplus.com';
  const fullUrl = url || `${baseUrl}${pathname}`;

  const articleData = {
    headline: title,
    description,
    image: image ? `${baseUrl}${image}` : `${baseUrl}/images/og-default.jpg`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: 'SpacePlus',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl
    },
    keywords: tags.join(', '),
    articleSection: category
  };

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        image={image}
        url={fullUrl}
        type="article"
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        author={author}
        keywords={tags}
      />
      <StructuredData type="Article" data={articleData} />
    </>
  );
}

// 专门用于职位页面的SEO组件
export function JobSEO({
  title,
  description,
  company = 'SpacePlus',
  location,
  salary,
  employmentType = 'FULL_TIME',
  datePosted,
  validThrough,
  url
}: {
  title: string;
  description: string;
  company?: string;
  location: string;
  salary?: { min: number; max: number; currency: string };
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERN';
  datePosted: string;
  validThrough?: string;
  url?: string;
}) {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://spaceplus.com';
  const fullUrl = url || `${baseUrl}${pathname}`;

  const jobData = {
    title,
    description,
    datePosted,
    validThrough,
    employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: company,
      sameAs: baseUrl
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: location,
        addressCountry: 'CN'
      }
    },
    baseSalary: salary ? {
      '@type': 'MonetaryAmount',
      currency: salary.currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: salary.min,
        maxValue: salary.max,
        unitText: 'MONTH'
      }
    } : undefined
  };

  return (
    <>
      <SEOHead
        title={`${title} - ${company} 招聘`}
        description={description}
        url={fullUrl}
        type="website"
        keywords={['招聘', '职位', title, company, location]}
      />
      <StructuredData type="JobPosting" data={jobData} />
    </>
  );
}