'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  TrendingUp,
  MessageSquare,
  Users,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  category: string;
  email?: string;
  name?: string;
  contactId?: string;
  createdAt: string;
  clientIP: string;
}

interface FeedbackStats {
  total: number;
  avgRating: number;
  ratingDistribution: { rating: number; count: number }[];
  categoryStats: { category: string; label: string; count: number }[];
}

interface FeedbackResponse {
  success: boolean;
  data: Feedback[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: FeedbackStats;
}

const FEEDBACK_CATEGORIES = {
  service_quality: '服务质量',
  response_time: '响应速度',
  problem_resolution: '问题解决',
  staff_attitude: '服务态度',
  website_experience: '网站体验',
  other: '其他',
};

const RATING_COLORS = {
  1: 'text-red-500',
  2: 'text-orange-500',
  3: 'text-yellow-500',
  4: 'text-blue-500',
  5: 'text-green-500',
};

export default function FeedbackManagePage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 筛选和搜索状态
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  // 详情模态框
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 获取反馈数据
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        sortBy,
        sortOrder,
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedRating) params.append('rating', selectedRating);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await fetch(`/api/feedback?${params}`);
      const result: FeedbackResponse = await response.json();
      
      if (result.success) {
        setFeedbacks(result.data);
        setStats(result.stats);
        setTotalPages(result.pagination.totalPages);
        setTotalCount(result.pagination.total);
      } else {
        setError('获取反馈数据失败');
      }
    } catch (error) {
      console.error('获取反馈数据失败:', error);
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 重置筛选条件
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedRating('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // 导出数据
  const exportData = async () => {
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '1000', // 导出更多数据
        sortBy,
        sortOrder,
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedRating) params.append('rating', selectedRating);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await fetch(`/api/feedback?${params}`);
      const result: FeedbackResponse = await response.json();
      
      if (result.success) {
        // 转换为CSV格式
        const csvContent = [
          ['ID', '评分', '类别', '反馈内容', '姓名', '邮箱', '联系记录ID', '提交时间', 'IP地址'].join(','),
          ...result.data.map(feedback => [
            feedback.id,
            feedback.rating,
            FEEDBACK_CATEGORIES[feedback.category as keyof typeof FEEDBACK_CATEGORIES],
            `"${feedback.comment.replace(/"/g, '""')}"`,
            feedback.name || '',
            feedback.email || '',
            feedback.contactId || '',
            new Date(feedback.createdAt).toLocaleString('zh-CN'),
            feedback.clientIP
          ].join(','))
        ].join('\n');
        
        // 下载文件
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `feedback_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
      }
    } catch (error) {
      console.error('导出数据失败:', error);
    }
  };

  // 查看详情
  const viewDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailModal(true);
  };

  // 渲染评分星星
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className={`ml-1 text-sm font-medium ${
          RATING_COLORS[rating as keyof typeof RATING_COLORS]
        }`}>
          {rating}
        </span>
      </div>
    );
  };

  // 渲染统计卡片
  const renderStatsCards = () => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总反馈数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均评分</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">满意度</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total > 0 
                  ? Math.round((stats.ratingDistribution.filter(r => r.rating >= 4).reduce((sum, r) => sum + r.count, 0) / stats.total) * 100)
                  : 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">本月反馈</p>
              <p className="text-2xl font-bold text-gray-900">
                {feedbacks.filter(f => 
                  new Date(f.createdAt).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [currentPage, pageSize, sortBy, sortOrder]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchFeedbacks();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, selectedRating, startDate, endDate]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">反馈管理</h1>
          <p className="text-gray-600">查看和分析用户反馈，持续改进服务质量</p>
        </div>

        {/* 统计卡片 */}
        {renderStatsCards()}

        {/* 筛选和搜索 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* 搜索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索反馈内容、姓名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 类别筛选 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">所有类别</option>
              {Object.entries(FEEDBACK_CATEGORIES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {/* 评分筛选 */}
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">所有评分</option>
              {[5, 4, 3, 2, 1].map(rating => (
                <option key={rating} value={rating}>{rating} 星</option>
              ))}
            </select>

            {/* 排序 */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="createdAt-desc">最新提交</option>
              <option value="createdAt-asc">最早提交</option>
              <option value="rating-desc">评分从高到低</option>
              <option value="rating-asc">评分从低到高</option>
              <option value="category-asc">类别排序</option>
            </select>
          </div>

          {/* 日期范围 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                开始日期
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                结束日期
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-end gap-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2 inline" />
                重置筛选
              </button>
              
              <button
                onClick={exportData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                导出数据
              </button>
              
              <button
                onClick={fetchFeedbacks}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 inline ${loading ? 'animate-spin' : ''}`} />
                刷新
              </button>
            </div>
          </div>
        </div>

        {/* 反馈列表 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                反馈列表 ({totalCount} 条)
              </h2>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">每页显示:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">加载中...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchFeedbacks}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                重试
              </button>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">暂无反馈数据</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      评分
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类别
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      反馈内容
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      提交时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feedbacks.map((feedback) => (
                    <tr key={feedback.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderRating(feedback.rating)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {FEEDBACK_CATEGORIES[feedback.category as keyof typeof FEEDBACK_CATEGORIES]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {feedback.comment}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {feedback.name && (
                            <p className="text-gray-900">{feedback.name}</p>
                          )}
                          {feedback.email && (
                            <p className="text-gray-600">{feedback.email}</p>
                          )}
                          {!feedback.name && !feedback.email && (
                            <p className="text-gray-400">匿名用户</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(feedback.createdAt).toLocaleString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => viewDetails(feedback)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  显示第 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)} 条，共 {totalCount} 条
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    上一页
                  </button>
                  
                  <span className="text-sm text-gray-600">
                    第 {currentPage} / {totalPages} 页
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    下一页
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 详情模态框 */}
      {showDetailModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  反馈详情 #{selectedFeedback.id}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* 评分和类别 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      评分
                    </label>
                    {renderRating(selectedFeedback.rating)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      类别
                    </label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {FEEDBACK_CATEGORIES[selectedFeedback.category as keyof typeof FEEDBACK_CATEGORIES]}
                    </span>
                  </div>
                </div>
                
                {/* 反馈内容 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    反馈内容
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedFeedback.comment}
                    </p>
                  </div>
                </div>
                
                {/* 用户信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名
                    </label>
                    <p className="text-gray-900">
                      {selectedFeedback.name || '未提供'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱
                    </label>
                    <p className="text-gray-900">
                      {selectedFeedback.email || '未提供'}
                    </p>
                  </div>
                </div>
                
                {/* 其他信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      关联联系记录
                    </label>
                    <p className="text-gray-900">
                      {selectedFeedback.contactId ? `#${selectedFeedback.contactId}` : '无'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IP地址
                    </label>
                    <p className="text-gray-900">
                      {selectedFeedback.clientIP}
                    </p>
                  </div>
                </div>
                
                {/* 提交时间 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    提交时间
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedFeedback.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}