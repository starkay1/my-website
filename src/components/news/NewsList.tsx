'use client';

import { motion } from 'framer-motion';
import { Clock, Eye, Heart, ArrowRight, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent, CardMedia, Button, Badge } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: number;
  image: string;
  tags: string[];
  views: number;
  likes: number;
}

interface NewsListProps extends ComponentProps {
  news: NewsItem[];
  currentPage: number;
  totalPages: number;
  category: string;
}

export default function NewsList({ news, currentPage, totalPages, category, className }: NewsListProps) {
  const searchParams = useSearchParams();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    return `/news${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const getCategoryTitle = (categoryId: string) => {
    const categoryMap: Record<string, string> = {
      all: '全部文章',
      technology: '技术趋势',
      strategy: '品牌策略',
      marketing: '数字营销',
      business: '商业洞察',
      sustainability: '可持续发展',
      experience: '客户体验'
    };
    return categoryMap[categoryId] || '全部文章';
  };

  return (
    <section className={cn('py-20 lg:py-32 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {getCategoryTitle(category)}
              </h2>
              <p className="text-gray-600">
                共找到 {news.length} 篇文章
                {category !== 'all' && (
                  <span className="ml-2">
                    · 分类：{getCategoryTitle(category)}
                  </span>
                )}
              </p>
            </div>
            
            {/* Sort Options */}
            <div className="mt-6 md:mt-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">排序：</span>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="latest">最新发布</option>
                  <option value="popular">最受欢迎</option>
                  <option value="trending">热门趋势</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* News Grid */}
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {news.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, ...ANIMATION_CONFIG.smooth }}
                viewport={{ once: true }}
              >
                <Card variant="elevated" className="group hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">
                  {/* Article Image */}
                  <CardMedia className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-900">
                        {article.categoryLabel}
                      </Badge>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-2">
                        <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200">
                          <Heart className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </CardMedia>

                  <CardContent className="p-6 flex flex-col flex-1">
                    {/* Meta Info */}
                    <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(article.publishedAt)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime}min
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {article.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 mb-6 line-clamp-3 flex-1">
                      {article.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {article.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Author & Stats */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          {article.author.avatar ? (
                            <Image
                              src={article.author.avatar}
                              alt={article.author.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {article.author.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {article.author.title}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-400 text-sm space-x-3">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {article.views.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {article.likes}
                        </div>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <Link href={`/news/${article.slug}`} className="block">
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                      >
                        阅读全文
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={ANIMATION_CONFIG.smooth}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              暂无相关文章
            </h3>
            <p className="text-gray-600 mb-8">
              该分类下暂时没有文章，请尝试其他分类或稍后再来查看
            </p>
            <Link href="/news">
              <Button variant="outline">
                查看全部文章
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ...ANIMATION_CONFIG.smooth }}
            viewport={{ once: true }}
            className="mt-16 lg:mt-20"
          >
            <div className="flex items-center justify-center space-x-2">
              {/* Previous Button */}
              <Link
                href={createPageUrl(Math.max(1, currentPage - 1))}
                className={cn(
                  'flex items-center px-4 py-2 rounded-lg border transition-all duration-300',
                  currentPage === 1
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                )}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                上一页
              </Link>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 7) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 4) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNumber = totalPages - 6 + i;
                  } else {
                    pageNumber = currentPage - 3 + i;
                  }

                  const isActive = pageNumber === currentPage;
                  
                  return (
                    <Link
                      key={pageNumber}
                      href={createPageUrl(pageNumber)}
                      className={cn(
                        'w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-300',
                        isActive
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      )}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}
              </div>

              {/* Next Button */}
              <Link
                href={createPageUrl(Math.min(totalPages, currentPage + 1))}
                className={cn(
                  'flex items-center px-4 py-2 rounded-lg border transition-all duration-300',
                  currentPage === totalPages
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                )}
              >
                下一页
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Page Info */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                第 {currentPage} 页，共 {totalPages} 页
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}