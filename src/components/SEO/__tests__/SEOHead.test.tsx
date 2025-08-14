import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SEOHead, { ArticleSEO, JobSEO } from '../SEOHead';

// Mock Next.js Head component
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <div data-testid="head">{children}</div>;
  };
});

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/test-path'
}));

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_BASE_URL: 'https://test.spaceplus.com'
  };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('SEOHead', () => {
  it('should render default SEO meta tags', () => {
    const { container } = render(<SEOHead />);
    
    // Check for title
    const title = container.querySelector('title');
    expect(title).toHaveTextContent('SpacePlus - 专业品牌设计与数字营销服务');
    
    // Check for description meta tag
    const description = container.querySelector('meta[name="description"]');
    expect(description).toHaveAttribute('content', 'SpacePlus提供专业的品牌设计、数字营销、网站开发等服务，助力企业数字化转型和品牌升级。');
    
    // Check for keywords meta tag
    const keywords = container.querySelector('meta[name="keywords"]');
    expect(keywords).toHaveAttribute('content', '品牌设计, 数字营销, 网站开发, 企业服务, SpacePlus');
  });

  it('should render custom title and description', () => {
    const customTitle = 'Custom Page Title';
    const customDescription = 'Custom page description';
    
    const { container } = render(
      <SEOHead 
        title={customTitle}
        description={customDescription}
      />
    );
    
    const title = container.querySelector('title');
    expect(title).toHaveTextContent(customTitle);
    
    const description = container.querySelector('meta[name="description"]');
    expect(description).toHaveAttribute('content', customDescription);
  });

  it('should render Open Graph meta tags', () => {
    const { container } = render(
      <SEOHead 
        title="Test Title"
        description="Test Description"
        image="/test-image.jpg"
        type="article"
      />
    );
    
    // Check Open Graph tags
    const ogType = container.querySelector('meta[property="og:type"]');
    expect(ogType).toHaveAttribute('content', 'article');
    
    const ogTitle = container.querySelector('meta[property="og:title"]');
    expect(ogTitle).toHaveAttribute('content', 'Test Title');
    
    const ogDescription = container.querySelector('meta[property="og:description"]');
    expect(ogDescription).toHaveAttribute('content', 'Test Description');
    
    const ogImage = container.querySelector('meta[property="og:image"]');
    expect(ogImage).toHaveAttribute('content', 'https://test.spaceplus.com/test-image.jpg');
    
    const ogUrl = container.querySelector('meta[property="og:url"]');
    expect(ogUrl).toHaveAttribute('content', 'https://test.spaceplus.com/test-path');
  });

  it('should render Twitter Card meta tags', () => {
    const { container } = render(
      <SEOHead 
        title="Test Title"
        description="Test Description"
        image="/test-image.jpg"
      />
    );
    
    const twitterCard = container.querySelector('meta[name="twitter:card"]');
    expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
    
    const twitterTitle = container.querySelector('meta[name="twitter:title"]');
    expect(twitterTitle).toHaveAttribute('content', 'Test Title');
    
    const twitterDescription = container.querySelector('meta[name="twitter:description"]');
    expect(twitterDescription).toHaveAttribute('content', 'Test Description');
    
    const twitterImage = container.querySelector('meta[name="twitter:image"]');
    expect(twitterImage).toHaveAttribute('content', 'https://test.spaceplus.com/test-image.jpg');
  });

  it('should render canonical link', () => {
    const { container } = render(
      <SEOHead canonical="https://test.spaceplus.com/custom-canonical" />
    );
    
    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical).toHaveAttribute('href', 'https://test.spaceplus.com/custom-canonical');
  });

  it('should render alternate language links', () => {
    const { container } = render(
      <SEOHead alternateLocales={['en', 'th']} />
    );
    
    const enLink = container.querySelector('link[hreflang="en"]');
    expect(enLink).toHaveAttribute('href', 'https://test.spaceplus.com/en/test-path');
    
    const thLink = container.querySelector('link[hreflang="th"]');
    expect(thLink).toHaveAttribute('href', 'https://test.spaceplus.com/th/test-path');
  });

  it('should render noindex meta tag when specified', () => {
    const { container } = render(<SEOHead noIndex={true} />);
    
    const robots = container.querySelector('meta[name="robots"]');
    expect(robots).toHaveAttribute('content', 'noindex, nofollow');
  });

  it('should render article meta tags when provided', () => {
    const publishedTime = '2023-01-01T00:00:00Z';
    const modifiedTime = '2023-01-02T00:00:00Z';
    const author = 'Test Author';
    
    const { container } = render(
      <SEOHead 
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        author={author}
      />
    );
    
    const publishedMeta = container.querySelector('meta[property="article:published_time"]');
    expect(publishedMeta).toHaveAttribute('content', publishedTime);
    
    const modifiedMeta = container.querySelector('meta[property="article:modified_time"]');
    expect(modifiedMeta).toHaveAttribute('content', modifiedTime);
    
    const authorMeta = container.querySelector('meta[property="article:author"]');
    expect(authorMeta).toHaveAttribute('content', author);
  });

  it('should render structured data script', () => {
    const { container } = render(<SEOHead />);
    
    const structuredDataScript = container.querySelector('script[type="application/ld+json"]');
    expect(structuredDataScript).toBeInTheDocument();
    
    const scriptContent = JSON.parse(structuredDataScript?.textContent || '{}');
    expect(scriptContent['@context']).toBe('https://schema.org');
    expect(scriptContent['@type']).toBe('Organization');
    expect(scriptContent.name).toBe('SpacePlus');
  });
});

describe('ArticleSEO', () => {
  it('should render article-specific SEO tags', () => {
    const articleProps = {
      title: 'Test Article',
      description: 'Test article description',
      publishedTime: '2023-01-01T00:00:00Z',
      author: 'Test Author',
      tags: ['tag1', 'tag2'],
      category: 'News'
    };
    
    const { container } = render(<ArticleSEO {...articleProps} />);
    
    // Check for article structured data - 获取所有script标签并找到Article类型的
    const structuredDataScripts = container.querySelectorAll('script[type="application/ld+json"]');
    let articleScript = null;
    
    structuredDataScripts.forEach(script => {
      try {
        const content = JSON.parse(script.textContent || '{}');
        if (content['@type'] === 'Article') {
          articleScript = content;
        }
      } catch (e) {
        // 忽略解析错误
      }
    });
    
    expect(articleScript).toBeTruthy();
    expect(articleScript['@type']).toBe('Article');
    expect(articleScript.headline).toBe('Test Article');
    expect(articleScript.author.name).toBe('Test Author');
    expect(articleScript.keywords).toBe('tag1, tag2');
    expect(articleScript.articleSection).toBe('News');
  });
});

describe('JobSEO', () => {
  it('should render job-specific SEO tags', () => {
    const jobProps = {
      title: 'Frontend Developer',
      description: 'We are looking for a frontend developer',
      location: '上海',
      salary: { min: 15000, max: 25000, currency: 'CNY' },
      datePosted: '2023-01-01T00:00:00Z',
      validThrough: '2023-02-01T00:00:00Z'
    };
    
    const { container } = render(<JobSEO {...jobProps} />);
    
    // Check for job structured data - 获取所有script标签并找到JobPosting类型的
    const structuredDataScripts = container.querySelectorAll('script[type="application/ld+json"]');
    let jobPostingScript = null;
    
    structuredDataScripts.forEach(script => {
      try {
        const content = JSON.parse(script.textContent || '{}');
        if (content['@type'] === 'JobPosting') {
          jobPostingScript = content;
        }
      } catch (e) {
        // 忽略解析错误
      }
    });
    
    expect(jobPostingScript).toBeTruthy();
    expect(jobPostingScript['@type']).toBe('JobPosting');
    expect(jobPostingScript.title).toBe('Frontend Developer');
    expect(jobPostingScript.jobLocation.address.addressLocality).toBe('上海');
    expect(jobPostingScript.baseSalary.currency).toBe('CNY');
    expect(jobPostingScript.baseSalary.value.minValue).toBe(15000);
    expect(jobPostingScript.baseSalary.value.maxValue).toBe(25000);
  });

  it('should render job SEO without salary when not provided', () => {
    const jobProps = {
      title: 'Backend Developer',
      description: 'We are looking for a backend developer',
      location: '北京',
      datePosted: '2023-01-01T00:00:00Z'
    };
    
    const { container } = render(<JobSEO {...jobProps} />);
    
    // 获取所有script标签并找到JobPosting类型的
    const structuredDataScripts = container.querySelectorAll('script[type="application/ld+json"]');
    let jobPostingScript = null;
    
    structuredDataScripts.forEach(script => {
      try {
        const content = JSON.parse(script.textContent || '{}');
        if (content['@type'] === 'JobPosting') {
          jobPostingScript = content;
        }
      } catch (e) {
        // 忽略解析错误
      }
    });
    
    expect(jobPostingScript).toBeTruthy();
    expect(jobPostingScript.baseSalary).toBeUndefined();
    expect(jobPostingScript.title).toBe('Backend Developer');
  });
});