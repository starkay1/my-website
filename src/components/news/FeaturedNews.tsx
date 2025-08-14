'use client';

import { motion } from 'framer-motion';
import { Clock, Eye, Heart, ArrowRight, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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

interface FeaturedNewsProps extends ComponentProps {
  news: NewsItem[];
}

export default function FeaturedNews({ news, className }: FeaturedNewsProps) {
  const mainFeatured = news[0];
  const secondaryFeatured = news.slice(1, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full text-blue-600 text-sm font-medium mb-6">
            <Heart className="w-4 h-4 mr-2" />
            精选推荐
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="block text-gray-900 mb-2">
              编辑
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              精选文章
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们的编辑团队为您精心挑选的高质量内容
          </p>
        </motion.div>

        {/* Featured Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Featured Article */}
          {mainFeatured && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={ANIMATION_CONFIG.smooth}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card variant="elevated" className="group overflow-hidden hover:shadow-2xl transition-all duration-500">
                <CardMedia className="relative h-80 lg:h-96 overflow-hidden">
                  <Image
                    src={mainFeatured.image}
                    alt={mainFeatured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-900">
                      {mainFeatured.categoryLabel}
                    </Badge>
                  </div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-6 right-6">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <Heart className="w-3 h-3 mr-1" />
                      精选
                    </Badge>
                  </div>
                  
                  {/* Meta Info Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center text-white/90 text-sm space-x-4 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(mainFeatured.publishedAt)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {mainFeatured.readTime} 分钟阅读
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {mainFeatured.views.toLocaleString()}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 line-clamp-2">
                      {mainFeatured.title}
                    </h3>
                    
                    <p className="text-white/90 line-clamp-2 mb-4">
                      {mainFeatured.excerpt}
                    </p>
                    
                    <Link href={`/news/${mainFeatured.slug}`}>
                      <Button
                        variant="secondary"
                        className="bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white"
                      >
                        阅读全文
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardMedia>
              </Card>
            </motion.div>
          )}

          {/* Secondary Featured Articles */}
          <div className="space-y-8">
            {secondaryFeatured.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, ...ANIMATION_CONFIG.smooth }}
                viewport={{ once: true }}
              >
                <Card variant="elevated" className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardMedia className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs">
                        {article.categoryLabel}
                      </Badge>
                    </div>
                  </CardMedia>

                  <CardContent className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-3">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(article.publishedAt)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime}min
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {article.title}
                    </h4>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>

                    {/* Author */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                          {article.author.avatar ? (
                            <Image
                              src={article.author.avatar}
                              alt={article.author.name}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
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
                          {article.views}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {article.likes}
                        </div>
                      </div>
                    </div>

                    {/* Read More Link */}
                    <Link href={`/news/${article.slug}`} className="block mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                      >
                        阅读更多
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tags Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-20"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            热门标签
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from(new Set(news.flatMap(article => article.tags))).slice(0, 12).map((tag, index) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05, ...ANIMATION_CONFIG.smooth }}
                viewport={{ once: true }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 hover:scale-105"
              >
                #{tag}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}