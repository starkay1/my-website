'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Search, Filter, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/components/ui/PerformanceOptimizer';
import { ClientOnly } from '@/components/ui';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'case' | 'job' | 'page';
  category?: string;
  date?: string;
  url: string;
  thumbnail?: string;
  excerpt?: string;
}

interface SearchFilters {
  type?: string;
  category?: string;
  dateRange?: string;
  sortBy?: 'relevance' | 'newest' | 'oldest';
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

/**
 * 全站搜索组件
 * 提供实时搜索、筛选、历史记录和热门搜索功能
 */
export default function GlobalSearch({ isOpen, onClose, className }: GlobalSearchProps) {
  const t = useTranslations();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState<string[]>([
    'club management',
    'brand consulting',
    'nightlife strategy',
    'venue operations',
    'marketing solutions'
  ]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // 加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem('search_history');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // 保存搜索历史
  const saveToHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('search_history', JSON.stringify(updated));
  }, [recentSearches]);

  // 执行搜索
  const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters = {}) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        ...searchFilters
      });
      
      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      
      setResults(data.results || []);
      saveToHistory(searchQuery);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [saveToHistory]);

  // 监听搜索查询变化
  useEffect(() => {
    performSearch(debouncedQuery, filters);
  }, [debouncedQuery, filters, performSearch]);

  // 打开时聚焦输入框
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('search_history');
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return '📰';
      case 'case': return '📊';
      case 'job': return '💼';
      case 'page': return '📄';
      default: return '🔍';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'news': return t('news.title');
      case 'case': return t('cases.title');
      case 'job': return t('careers.title');
      case 'page': return 'Page';
      default: return 'Content';
    }
  };

  return (
    <ClientOnly fallback={null}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* 背景遮罩 */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 搜索容器 */}
          <motion.div
            className={cn(
              'relative w-full max-w-2xl bg-white dark:bg-neutral-900',
              'rounded-2xl shadow-apple-lg border border-neutral-200 dark:border-neutral-700',
              'overflow-hidden',
              className
            )}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* 搜索输入区域 */}
            <div className="flex items-center gap-3 p-4 border-b border-neutral-200 dark:border-neutral-700">
              <Search className="w-5 h-5 text-neutral-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="flex-1 bg-transparent text-lg placeholder:text-neutral-400 focus:outline-none"
              />
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  showFilters
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                )}
              >
                <Filter className="w-4 h-4" />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 筛选器 */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-wrap gap-3">
                    <select
                      value={filters.type || ''}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                    >
                      <option value="">{t('search.filters.category')}</option>
                      <option value="news">{t('news.title')}</option>
                      <option value="case">{t('cases.title')}</option>
                      <option value="job">{t('careers.title')}</option>
                      <option value="page">Pages</option>
                    </select>
                    
                    <select
                      value={filters.sortBy || 'relevance'}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                      className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                    >
                      <option value="relevance">{t('search.filters.relevance')}</option>
                      <option value="newest">{t('search.filters.newest')}</option>
                      <option value="oldest">{t('search.filters.oldest')}</option>
                    </select>
                    
                    {Object.keys(filters).length > 0 && (
                      <button
                        onClick={clearFilters}
                        className="px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                      >
                        {t('search.filters.clear')}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 搜索结果区域 */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="ml-2 text-neutral-600 dark:text-neutral-400">
                    {t('common.loading')}
                  </span>
                </div>
              ) : query && results.length > 0 ? (
                <div className="p-2">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 px-2 py-1">
                    {t('search.results_count', { count: results.length })}
                  </div>
                  {results.map((result, index) => (
                    <motion.a
                      key={result.id}
                      href={result.url}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={onClose}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-sm">
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                            {result.title}
                          </h3>
                          <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                            {getTypeLabel(result.type)}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                          {result.excerpt || result.content}
                        </p>
                        {result.date && (
                          <p className="text-xs text-neutral-500 mt-1">
                            {new Date(result.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
                    </motion.a>
                  ))}
                </div>
              ) : query && !loading ? (
                <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
                  <Search className="w-8 h-8 mb-2" />
                  <p>{t('search.no_results')}</p>
                </div>
              ) : (
                <div className="p-4">
                  {/* 最近搜索 */}
                  {recentSearches.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {t('search.recent_searches')}
                        </h3>
                        <button
                          onClick={clearHistory}
                          className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                        >
                          {t('search.clear_history')}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setQuery(search)}
                            className="px-3 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 热门搜索 */}
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4" />
                      {t('search.popular_searches')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setQuery(search)}
                          className="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </ClientOnly>
  );
}

/**
 * 搜索触发按钮
 */
interface SearchTriggerProps {
  onOpen: () => void;
  className?: string;
}

export function SearchTrigger({ onOpen, className }: SearchTriggerProps) {
  const t = useTranslations();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);

  return (
    <button
      onClick={onOpen}
      className={cn(
        'flex items-center gap-3 px-4 py-2 bg-neutral-100 dark:bg-neutral-800',
        'hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors',
        'text-neutral-600 dark:text-neutral-400 text-sm',
        className
      )}
    >
      <Search className="w-4 h-4" />
      <span>{t('search.placeholder')}</span>
      <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-600 rounded">
        <span>⌘</span>K
      </kbd>
    </button>
  );
}