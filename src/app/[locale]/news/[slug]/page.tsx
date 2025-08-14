import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Eye, Heart, User, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import NewsCard from '@/components/news/NewsCard';

// 获取新闻详情数据
async function getNewsData(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/news/${slug}`, {
      cache: 'no-store' // 确保获取最新数据
    });
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('获取新闻数据失败:', error);
    return null;
  }
}

interface NewsDetailPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// 生成页面元数据
export async function generateMetadata(
  { params }: NewsDetailPageProps
): Promise<Metadata> {
  const newsData = await getNewsData(params.slug);
  
  if (!newsData) {
    return {
      title: '新闻未找到 - SpacePlus',
      description: '抱歉，您访问的新闻页面不存在。'
    };
  }

  const news = newsData.news;
  
  return {
    title: `${news.title} - SpacePlus新闻`,
    description: news.excerpt,
    keywords: Array.isArray(news.tags) ? news.tags.join(', ') : '',
    openGraph: {
      title: news.title,
      description: news.excerpt,
      type: 'article',
      images: [news.image],
      locale: params.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.excerpt,
      images: [news.image],
    },
  };
}

// 新闻详情页面组件
export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const newsData = await getNewsData(params.slug);
  
  if (!newsData) {
    notFound();
  }

  const news = newsData.news;
  const relatedNews = newsData.relatedNews || [];

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 获取分类标签
  const getCategoryLabel = (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      'technology': '技术趋势',
      'design': '设计',
      'business': '商业洞察',
      'marketing': '数字营销',
      'sustainability': '可持续发展',
      'experience': '客户体验'
    };
    return categoryLabels[category] || category;
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 返回按钮 */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/news" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回新闻列表
          </Link>
        </div>
      </div>

      {/* 文章头部 */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 分类标签 */}
        <div className="mb-6">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {getCategoryLabel(news.category)}
          </Badge>
        </div>

        {/* 标题 */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {news.title}
        </h1>

        {/* 摘要 */}
        {news.excerpt && (
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {news.excerpt}
          </p>
        )}

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          {/* 作者信息 */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-3">
              {news.authorAvatar ? (
                <Image
                  src={news.authorAvatar}
                  alt={news.authorName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {news.authorName}
              </div>
              {news.authorTitle && (
                <div className="text-xs text-gray-500">
                  {news.authorTitle}
                </div>
              )}
            </div>
          </div>

          {/* 发布时间 */}
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{formatDate(news.publishedAt)}</span>
          </div>

          {/* 阅读时间 */}
          {news.readTime && (
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{news.readTime} 分钟阅读</span>
            </div>
          )}

          {/* 浏览量 */}
          {news.views && (
            <div className="flex items-center text-gray-500">
              <Eye className="w-4 h-4 mr-2" />
              <span className="text-sm">{news.views.toLocaleString()} 次浏览</span>
            </div>
          )}

          {/* 点赞数 */}
          {news.likes && (
            <div className="flex items-center text-gray-500">
              <Heart className="w-4 h-4 mr-2" />
              <span className="text-sm">{news.likes} 个赞</span>
            </div>
          )}

          {/* 分享按钮 */}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-2" />
              收藏
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
          </div>
        </div>

        {/* 封面图片 */}
        {news.image && (
          <div className="mb-12">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* 文章内容 */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* 标签 */}
        {news.tags && news.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">相关标签</h3>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* 相关新闻 */}
      {relatedNews.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              相关新闻
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedNews.map((relatedNewsItem: any) => (
                <NewsCard 
                  key={relatedNewsItem.id} 
                  id={relatedNewsItem.id}
                  title={relatedNewsItem.title}
                  excerpt={relatedNewsItem.excerpt}
                  image={relatedNewsItem.image}
                  publishedAt={relatedNewsItem.publishedAt}
                  category={relatedNewsItem.category}
                  slug={relatedNewsItem.slug}
                  locale={params.locale}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

// 生成静态路径
export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/news`);
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    const news = result.success ? result.data.items : [];
    
    return news.map((newsItem: any) => ({
      slug: newsItem.slug,
    }));
  } catch (error) {
    console.error('生成静态路径失败:', error);
    return [];
  }
}