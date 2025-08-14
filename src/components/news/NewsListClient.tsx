'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import NewsCard from './NewsCard';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    title?: string;
    avatar?: string;
  };
  publishedAt: string;
  readTime: number;
  image: string;
  tags: string[];
  featured: boolean;
  views: number;
  likes: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

interface NewsListClientProps {
  initialNews: NewsItem[];
  categories: Category[];
}

export default function NewsListClient({ initialNews, categories }: NewsListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤新闻
  const filteredNews = initialNews.filter(news => {
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         news.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (Array.isArray(news.tags) && news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* 搜索和筛选 */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* 搜索框 */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索新闻..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* 新闻列表 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.map((news) => (
          <NewsCard 
            key={news.id} 
            id={news.id}
            title={news.title}
            excerpt={news.excerpt}
            image={news.image}
            publishedAt={new Date(news.publishedAt)}
            category={news.category}
            slug={news.slug}
          />
        ))}
      </div>

      {/* 空状态 */}
      {filteredNews.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">未找到相关新闻</h3>
          <p className="text-gray-600">请尝试调整搜索条件或选择其他分类</p>
        </div>
      )}
    </>
  );
}