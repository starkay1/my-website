'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Users, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  preferences?: string[];
  subscribedAt: string;
  unsubscribedAt?: string;
  lastEmailSent?: string;
}

interface FilterState {
  status: 'all' | 'active' | 'unsubscribed';
  search: string;
  dateRange: 'all' | '7d' | '30d' | '90d';
}

const PREFERENCE_LABELS: Record<string, string> = {
  industry_news: '行业资讯',
  case_studies: '案例分享',
  company_updates: '公司动态',
  events: '活动信息',
  tips: '专业建议',
};

/**
 * 新闻订阅管理页面
 * 管理员可以查看、筛选和管理订阅用户
 */
export default function NewsletterManagementPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    search: '',
    dateRange: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    const loadSubscribers = async () => {
      try {
        setLoading(true);
        // 这里应该调用实际的 API
        // const response = await fetch('/api/admin/newsletter/subscribers');
        // const data = await response.json();
        
        // 模拟数据
        const mockData: Subscriber[] = [
          {
            id: '1',
            email: 'user1@example.com',
            name: '张三',
            status: 'active',
            preferences: ['industry_news', 'case_studies'],
            subscribedAt: '2024-01-15T10:30:00Z',
            lastEmailSent: '2024-01-20T09:00:00Z',
          },
          {
            id: '2',
            email: 'user2@example.com',
            name: '李四',
            status: 'active',
            preferences: ['company_updates', 'events'],
            subscribedAt: '2024-01-10T14:20:00Z',
            lastEmailSent: '2024-01-18T09:00:00Z',
          },
          {
            id: '3',
            email: 'user3@example.com',
            status: 'unsubscribed',
            preferences: ['industry_news'],
            subscribedAt: '2024-01-05T16:45:00Z',
            unsubscribedAt: '2024-01-12T11:30:00Z',
          },
        ];
        
        setSubscribers(mockData);
      } catch (err) {
        console.error('Failed to load subscribers:', err);
        setError('加载订阅用户失败');
      } finally {
        setLoading(false);
      }
    };

    loadSubscribers();
  }, []);

  // 筛选订阅用户
  const filteredSubscribers = subscribers.filter(subscriber => {
    // 状态筛选
    if (filters.status !== 'all' && subscriber.status !== filters.status) {
      return false;
    }

    // 搜索筛选
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesEmail = subscriber.email.toLowerCase().includes(searchLower);
      const matchesName = subscriber.name?.toLowerCase().includes(searchLower);
      if (!matchesEmail && !matchesName) {
        return false;
      }
    }

    // 日期范围筛选
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const subscribedDate = new Date(subscriber.subscribedAt);
      const daysDiff = Math.floor((now.getTime() - subscribedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filters.dateRange) {
        case '7d':
          if (daysDiff > 7) return false;
          break;
        case '30d':
          if (daysDiff > 30) return false;
          break;
        case '90d':
          if (daysDiff > 90) return false;
          break;
      }
    }

    return true;
  });

  // 统计数据
  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.status === 'active').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
  };

  const handleSelectSubscriber = (id: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(id) 
        ? prev.filter(sid => sid !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(s => s.id));
    }
  };

  const handleExport = () => {
    // 导出选中的订阅用户数据
    const dataToExport = filteredSubscribers
      .filter(s => selectedSubscribers.length === 0 || selectedSubscribers.includes(s.id))
      .map(s => ({
        邮箱: s.email,
        姓名: s.name || '',
        状态: s.status === 'active' ? '活跃' : '已取消',
        订阅偏好: s.preferences?.map(p => PREFERENCE_LABELS[p]).join(', ') || '',
        订阅时间: new Date(s.subscribedAt).toLocaleString('zh-CN'),
        取消时间: s.unsubscribedAt ? new Date(s.unsubscribedAt).toLocaleString('zh-CN') : '',
      }));

    const csv = [
      Object.keys(dataToExport[0] || {}).join(','),
      ...dataToExport.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            新闻订阅管理
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            管理和查看所有新闻订阅用户
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  总订阅数
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stats.total}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  活跃订阅
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  已取消订阅
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.unsubscribed}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </motion.div>
        </div>

        {/* 筛选和操作栏 */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 mb-6">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* 搜索框 */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="搜索邮箱或姓名..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* 筛选按钮 */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  筛选
                </button>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  导出
                </button>
              </div>
            </div>

            {/* 展开的筛选选项 */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* 状态筛选 */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      状态
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as FilterState['status'] }))}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">全部</option>
                      <option value="active">活跃</option>
                      <option value="unsubscribed">已取消</option>
                    </select>
                  </div>

                  {/* 日期范围筛选 */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      订阅时间
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as FilterState['dateRange'] }))}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">全部时间</option>
                      <option value="7d">最近 7 天</option>
                      <option value="30d">最近 30 天</option>
                      <option value="90d">最近 90 天</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* 批量操作栏 */}
          {selectedSubscribers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  已选择 {selectedSubscribers.length} 个订阅用户
                </span>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    发送邮件
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                    批量删除
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 订阅用户列表 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-neutral-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    用户信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    订阅偏好
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    订阅时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredSubscribers.map((subscriber) => (
                  <motion.tr
                    key={subscriber.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={() => handleSelectSubscriber(subscriber.id)}
                        className="rounded border-neutral-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {subscriber.name || '未提供'}
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {subscriber.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        subscriber.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      )}>
                        {subscriber.status === 'active' ? '活跃' : '已取消'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900 dark:text-neutral-100">
                        {subscriber.preferences?.length ? (
                          <div className="flex flex-wrap gap-1">
                            {subscriber.preferences.slice(0, 2).map((pref) => (
                              <span
                                key={pref}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                              >
                                {PREFERENCE_LABELS[pref]}
                              </span>
                            ))}
                            {subscriber.preferences.length > 2 && (
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                +{subscriber.preferences.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-500 dark:text-neutral-400">无偏好</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                      {formatDate(subscriber.subscribedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="text-neutral-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 空状态 */}
          {filteredSubscribers.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                没有找到订阅用户
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                {filters.search || filters.status !== 'all' || filters.dateRange !== 'all'
                  ? '尝试调整筛选条件'
                  : '还没有用户订阅新闻'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}