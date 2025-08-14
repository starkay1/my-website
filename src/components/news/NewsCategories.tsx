'use client';

import { motion } from 'framer-motion';
import { Filter, TrendingUp, Target, Globe, Lightbulb, Leaf, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

interface Category {
  id: string;
  label: string;
  count: number;
}

interface NewsCategoriesProps extends ComponentProps {
  categories: Category[];
  activeCategory: string;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  all: Globe,
  technology: Zap,
  strategy: Target,
  marketing: TrendingUp,
  business: Lightbulb,
  sustainability: Leaf,
  experience: Users
};

export default function NewsCategories({ categories, activeCategory, className }: NewsCategoriesProps) {
  const searchParams = useSearchParams();
  
  const createCategoryUrl = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    params.delete('page'); // Reset to first page when changing category
    return `/news${params.toString() ? `?${params.toString()}` : ''}`;
  };

  return (
    <section className={cn('py-16 bg-gray-50 border-y border-gray-200', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-600 text-sm font-medium mb-4">
            <Filter className="w-4 h-4 mr-2" />
            内容分类
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            按主题浏览内容
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            选择您感兴趣的主题，获取相关的深度文章和行业洞察
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.id] || Globe;
            const isActive = activeCategory === category.id;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, ...ANIMATION_CONFIG.smooth }}
                viewport={{ once: true }}
              >
                <Link href={createCategoryUrl(category.id)}>
                  <div
                    className={cn(
                      'group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer',
                      isActive
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-600 text-white shadow-lg'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    )}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className={cn(
                        'absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl transition-opacity duration-300',
                        isActive
                          ? 'bg-white/20 opacity-100'
                          : 'bg-blue-500/10 opacity-0 group-hover:opacity-100'
                      )} />
                    </div>
                    
                    {/* Content */}
                    <div className="relative text-center">
                      {/* Icon */}
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300',
                        isActive
                          ? 'bg-white/20 backdrop-blur-sm'
                          : 'bg-gray-100 group-hover:bg-blue-100'
                      )}>
                        <Icon className={cn(
                          'w-6 h-6 transition-colors duration-300',
                          isActive
                            ? 'text-white'
                            : 'text-gray-600 group-hover:text-blue-600'
                        )} />
                      </div>
                      
                      {/* Label */}
                      <h3 className={cn(
                        'font-semibold mb-2 transition-colors duration-300',
                        isActive
                          ? 'text-white'
                          : 'text-gray-900 group-hover:text-blue-900'
                      )}>
                        {category.label}
                      </h3>
                      
                      {/* Count */}
                      <div className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                      )}>
                        {category.count} 篇文章
                      </div>
                    </div>
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {categories.reduce((sum, cat) => sum + cat.count, 0)}
            </div>
            <p className="text-gray-600 text-sm">
              总文章数
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {categories.length - 1}
            </div>
            <p className="text-gray-600 text-sm">
              内容分类
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              每周
            </div>
            <p className="text-gray-600 text-sm">
              更新频率
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              专业
            </div>
            <p className="text-gray-600 text-sm">
              内容质量
            </p>
          </div>
        </motion.div>

        {/* Popular Categories Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-xl font-bold mb-4">
            🔥 本月热门分类
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories
              .filter(cat => cat.id !== 'all')
              .sort((a, b) => b.count - a.count)
              .slice(0, 3)
              .map((category, index) => {
                const Icon = categoryIcons[category.id] || Globe;
                return (
                  <Link key={category.id} href={createCategoryUrl(category.id)}>
                    <div className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-105">
                      <Icon className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {category.count}
                      </span>
                    </div>
                  </Link>
                );
              })
            }
          </div>
          
          <p className="text-blue-100 text-sm mt-4">
            这些分类的文章最受读者欢迎
          </p>
        </motion.div>
      </div>
    </section>
  );
}