import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import NewsHero from '@/components/news/NewsHero';
import NewsList from '@/components/news/NewsList';
import NewsCategories from '@/components/news/NewsCategories';
import FeaturedNews from '@/components/news/FeaturedNews';
import NewsletterSignup from '@/components/news/NewsletterSignup';
import NewsListClient from '@/components/news/NewsListClient';

// 获取新闻数据
async function getNewsData(category?: string, featured?: boolean) {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') {
      params.append('category', category);
    }
    if (featured !== undefined) {
      params.append('featured', featured.toString());
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/news?${params}`, {
      cache: 'no-store' // 确保获取最新数据
    });
    
    if (!response.ok) {
      return { items: [], total: 0, page: 1, totalPages: 1 };
    }
    
    const result = await response.json();
    return result.success ? result.data : { items: [], total: 0, page: 1, totalPages: 1 };
  } catch (error) {
    console.error('获取新闻数据失败:', error);
    return { items: [], total: 0, page: 1, totalPages: 1 };
  }
}

// 获取特色新闻
async function getFeaturedNews() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/news/featured`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured news');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured news:', error);
    return [];
  }
}

// 获取新闻分类
function getNewsCategories(newsItems: any[]) {
  const categoryCount: { [key: string]: number } = {};
  
  newsItems.forEach(news => {
    if (news.category) {
      categoryCount[news.category] = (categoryCount[news.category] || 0) + 1;
    }
  });
  
  const categories = [
    { id: 'all', label: '全部', count: newsItems.length }
  ];
  
  Object.entries(categoryCount).forEach(([key, count]) => {
    const categoryNames: { [key: string]: string } = {
      'technology': '技术',
      'design': '设计', 
      'business': '商业'
    };
    
    categories.push({
      id: key,
      label: categoryNames[key] || key,
      count
    });
  });
  
  return categories;
}

interface NewsPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    category?: string;
    page?: string;
  };
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const t = await getTranslations('news');
  
  return {
    title: '新闻资讯 - SpacePlus',
    description: '获取最新的行业动态、技术趋势和商业洞察，了解数字化转型和品牌发展的前沿资讯。',
    keywords: ['新闻资讯', '行业动态', '技术趋势', '商业洞察', '数字化转型', '品牌发展'],
    openGraph: {
      title: '新闻资讯 - SpacePlus',
      description: '获取最新的行业动态、技术趋势和商业洞察',
      type: 'website',
      locale: params.locale,
    },
  };
}

export default async function NewsPage({ params, searchParams }: NewsPageProps) {
  const { locale } = params;
  const { category = 'all', page = '1' } = searchParams;
  
  // Validate locale
  if (!['en', 'zh'].includes(locale)) {
    notFound();
  }

  // 获取所有新闻和特色新闻
  const [allNewsData, featuredNewsData] = await Promise.all([
    getNewsData(),
    getNewsData(undefined, true)
  ]);
  
  const allNews = allNewsData.items;
  const featuredNews = featuredNewsData.items;
  const categories = getNewsCategories(allNews);

  const currentPage = parseInt(page);
  const pageSize = 6;
  const totalPages = Math.ceil(allNews.length / pageSize);
  
  // 过滤和分页新闻
  let filteredNews = category === 'all' ? allNews : allNews.filter((news: any) => news.category === category);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + pageSize);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <NewsHero />
      
      {/* Featured News */}
      <FeaturedNews news={featuredNews} />
      
      {/* Categories Filter */}
      <NewsCategories 
        categories={categories}
        activeCategory={category}
      />
      
      {/* News List */}
      <NewsList 
        news={paginatedNews}
        currentPage={currentPage}
        totalPages={totalPages}
        category={category}
      />
      
      {/* Newsletter Signup */}
      <NewsletterSignup />
    </main>
  );
}