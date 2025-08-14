'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Star,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Clock,
  Target,
  Award
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalContacts: number;
    totalFeedbacks: number;
    avgRating: number;
    responseTime: number;
    resolutionRate: number;
    satisfactionRate: number;
  };
  trends: {
    contacts: { date: string; count: number }[];
    feedbacks: { date: string; count: number; avgRating: number }[];
    responseTime: { date: string; avgTime: number }[];
  };
  categories: {
    contacts: { category: string; count: number; percentage: number }[];
    feedbacks: { category: string; count: number; avgRating: number }[];
  };
  performance: {
    daily: { date: string; resolved: number; pending: number }[];
    weekly: { week: string; efficiency: number; satisfaction: number }[];
    monthly: { month: string; volume: number; quality: number }[];
  };
  topIssues: {
    issue: string;
    count: number;
    avgResolutionTime: number;
    satisfactionRate: number;
  }[];
  staffPerformance: {
    name: string;
    resolved: number;
    avgResponseTime: number;
    satisfactionRate: number;
    efficiency: number;
  }[];
}

interface DateRange {
  start: string;
  end: string;
  preset: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
}

const DATE_PRESETS = {
  today: { label: '今天', days: 1 },
  week: { label: '最近7天', days: 7 },
  month: { label: '最近30天', days: 30 },
  quarter: { label: '最近90天', days: 90 },
  year: { label: '最近365天', days: 365 },
  custom: { label: '自定义', days: 0 },
};

const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#6366F1',
  success: '#059669',
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
    preset: 'month',
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'performance' | 'insights'>('overview');

  // 获取分析数据
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
        preset: dateRange.preset,
      });
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟数据
      const mockData: AnalyticsData = {
        overview: {
          totalContacts: 1247,
          totalFeedbacks: 892,
          avgRating: 4.2,
          responseTime: 2.5,
          resolutionRate: 87.3,
          satisfactionRate: 91.2,
        },
        trends: {
          contacts: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 50) + 20,
          })),
          feedbacks: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 30) + 10,
            avgRating: Math.round((Math.random() * 2 + 3) * 10) / 10,
          })),
          responseTime: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            avgTime: Math.round((Math.random() * 3 + 1) * 10) / 10,
          })),
        },
        categories: {
          contacts: [
            { category: '技术支持', count: 456, percentage: 36.6 },
            { category: '产品咨询', count: 312, percentage: 25.0 },
            { category: '账户问题', count: 234, percentage: 18.8 },
            { category: '投诉建议', count: 156, percentage: 12.5 },
            { category: '其他', count: 89, percentage: 7.1 },
          ],
          feedbacks: [
            { category: '服务质量', count: 234, avgRating: 4.3 },
            { category: '响应速度', count: 198, avgRating: 4.1 },
            { category: '问题解决', count: 167, avgRating: 4.2 },
            { category: '服务态度', count: 145, avgRating: 4.5 },
            { category: '网站体验', count: 98, avgRating: 3.9 },
            { category: '其他', count: 50, avgRating: 4.0 },
          ],
        },
        performance: {
          daily: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN', { weekday: 'short' }),
            resolved: Math.floor(Math.random() * 30) + 20,
            pending: Math.floor(Math.random() * 15) + 5,
          })),
          weekly: Array.from({ length: 4 }, (_, i) => ({
            week: `第${i + 1}周`,
            efficiency: Math.round((Math.random() * 20 + 80) * 10) / 10,
            satisfaction: Math.round((Math.random() * 15 + 85) * 10) / 10,
          })),
          monthly: Array.from({ length: 6 }, (_, i) => ({
            month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN', { month: 'short' }),
            volume: Math.floor(Math.random() * 200) + 300,
            quality: Math.round((Math.random() * 1 + 4) * 10) / 10,
          })),
        },
        topIssues: [
          { issue: '登录问题', count: 89, avgResolutionTime: 1.2, satisfactionRate: 92.1 },
          { issue: '支付异常', count: 67, avgResolutionTime: 2.8, satisfactionRate: 88.5 },
          { issue: '功能咨询', count: 54, avgResolutionTime: 0.8, satisfactionRate: 95.3 },
          { issue: '数据同步', count: 43, avgResolutionTime: 3.2, satisfactionRate: 85.7 },
          { issue: '权限设置', count: 32, avgResolutionTime: 1.5, satisfactionRate: 90.6 },
        ],
        staffPerformance: [
          { name: '张小明', resolved: 156, avgResponseTime: 1.8, satisfactionRate: 94.2, efficiency: 92.5 },
          { name: '李小红', resolved: 142, avgResponseTime: 2.1, satisfactionRate: 91.8, efficiency: 89.3 },
          { name: '王小强', resolved: 134, avgResponseTime: 1.5, satisfactionRate: 96.1, efficiency: 95.2 },
          { name: '赵小美', resolved: 128, avgResponseTime: 2.3, satisfactionRate: 88.7, efficiency: 87.1 },
          { name: '刘小刚', resolved: 119, avgResponseTime: 1.9, satisfactionRate: 92.4, efficiency: 90.8 },
        ],
      };
      
      setData(mockData);
    } catch (error) {
      console.error('获取分析数据失败:', error);
      setError('获取数据失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 更新日期范围
  const updateDateRange = (preset: DateRange['preset']) => {
    const now = new Date();
    let start: Date;
    
    if (preset === 'custom') {
      return;
    }
    
    const days = DATE_PRESETS[preset].days;
    start = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0],
      preset,
    });
  };

  // 导出报告
  const exportReport = async () => {
    try {
      // 模拟导出
      const reportData = {
        dateRange,
        data,
        generatedAt: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics_report_${dateRange.start}_${dateRange.end}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出报告失败:', error);
    }
  };

  // 渲染概览卡片
  const renderOverviewCards = () => {
    if (!data) return null;
    
    const cards = [
      {
        title: '总联系数',
        value: data.overview.totalContacts.toLocaleString(),
        icon: MessageSquare,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        change: '+12.5%',
        changeType: 'positive' as const,
      },
      {
        title: '总反馈数',
        value: data.overview.totalFeedbacks.toLocaleString(),
        icon: Star,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        change: '+8.3%',
        changeType: 'positive' as const,
      },
      {
        title: '平均评分',
        value: data.overview.avgRating.toFixed(1),
        icon: Award,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        change: '+0.2',
        changeType: 'positive' as const,
      },
      {
        title: '平均响应时间',
        value: `${data.overview.responseTime}h`,
        icon: Clock,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        change: '-15.2%',
        changeType: 'positive' as const,
      },
      {
        title: '解决率',
        value: `${data.overview.resolutionRate}%`,
        icon: Target,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        change: '+3.1%',
        changeType: 'positive' as const,
      },
      {
        title: '满意度',
        value: `${data.overview.satisfactionRate}%`,
        icon: TrendingUp,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        change: '+2.8%',
        changeType: 'positive' as const,
      },
    ];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <div className="flex items-center mt-2">
                  {card.changeType === 'positive' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs 上期</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染趋势图表
  const renderTrendsCharts = () => {
    if (!data) return null;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 联系趋势 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">联系趋势</h3>
          <div className="h-64 flex items-end justify-between gap-1">
            {data.trends.contacts.slice(-14).map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${(item.count / 50) * 100}%` }}
                  title={`${item.date}: ${item.count}条`}
                />
                <span className="text-xs text-gray-500 mt-1 transform rotate-45 origin-left">
                  {new Date(item.date).getDate()}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* 反馈趋势 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">反馈趋势</h3>
          <div className="h-64 flex items-end justify-between gap-1">
            {data.trends.feedbacks.slice(-14).map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col">
                  <div
                    className="w-full bg-yellow-500 rounded-t transition-all hover:bg-yellow-600"
                    style={{ height: `${(item.count / 30) * 80}%` }}
                    title={`${item.date}: ${item.count}条反馈`}
                  />
                  <div
                    className="w-full bg-green-500 transition-all hover:bg-green-600"
                    style={{ height: `${(item.avgRating / 5) * 20}%` }}
                    title={`平均评分: ${item.avgRating}`}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1 transform rotate-45 origin-left">
                  {new Date(item.date).getDate()}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>反馈数量</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>平均评分</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染分类统计
  const renderCategoryStats = () => {
    if (!data) return null;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 联系分类 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">联系分类分布</h3>
          <div className="space-y-4">
            {data.categories.contacts.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length] }}
                  />
                  <span className="text-sm font-medium text-gray-900">{category.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{category.count}</span>
                  <span className="text-sm font-medium text-gray-900">{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 反馈分类 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">反馈分类评分</h3>
          <div className="space-y-4">
            {data.categories.feedbacks.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{category.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{category.count}条</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= category.avgRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium text-gray-900 ml-1">
                        {category.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${(category.avgRating / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 渲染性能分析
  const renderPerformanceAnalysis = () => {
    if (!data) return null;
    
    return (
      <div className="space-y-6">
        {/* 热门问题 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">热门问题分析</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">问题类型</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">数量</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">平均解决时间</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">满意度</th>
                </tr>
              </thead>
              <tbody>
                {data.topIssues.map((issue, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{issue.issue}</td>
                    <td className="py-3 px-4 text-gray-600">{issue.count}</td>
                    <td className="py-3 px-4 text-gray-600">{issue.avgResolutionTime}h</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        issue.satisfactionRate >= 90
                          ? 'bg-green-100 text-green-800'
                          : issue.satisfactionRate >= 80
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {issue.satisfactionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 员工绩效 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">员工绩效排行</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">姓名</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">解决数量</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">平均响应时间</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">满意度</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">效率评分</th>
                </tr>
              </thead>
              <tbody>
                {data.staffPerformance.map((staff, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {staff.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-gray-900">{staff.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{staff.resolved}</td>
                    <td className="py-3 px-4 text-gray-600">{staff.avgResponseTime}h</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        staff.satisfactionRate >= 90
                          ? 'bg-green-100 text-green-800'
                          : staff.satisfactionRate >= 80
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {staff.satisfactionRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${staff.efficiency}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{staff.efficiency}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题和控制 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">数据分析仪表板</h1>
              <p className="text-gray-600">全面了解业务数据和性能指标</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={exportReport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                导出报告
              </button>
              
              <button
                onClick={fetchAnalyticsData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                刷新数据
              </button>
            </div>
          </div>
          
          {/* 日期范围选择 */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">时间范围:</span>
              </div>
              
              <div className="flex items-center gap-2">
                {Object.entries(DATE_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => updateDateRange(key as DateRange['preset'])}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      dateRange.preset === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              
              {dateRange.preset === 'custom' && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span className="text-gray-500">至</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'overview', label: '概览', icon: BarChart3 },
                { key: 'trends', label: '趋势', icon: TrendingUp },
                { key: 'performance', label: '性能', icon: Target },
                { key: 'insights', label: '洞察', icon: Eye },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 内容区域 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">加载数据中...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              重试
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {renderOverviewCards()}
                {renderCategoryStats()}
              </div>
            )}
            
            {activeTab === 'trends' && (
              <div className="space-y-6">
                {renderTrendsCharts()}
              </div>
            )}
            
            {activeTab === 'performance' && (
              <div className="space-y-6">
                {renderPerformanceAnalysis()}
              </div>
            )}
            
            {activeTab === 'insights' && (
              <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">智能洞察</h3>
                <p className="text-gray-600">基于AI的数据洞察功能正在开发中...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}