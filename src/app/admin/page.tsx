'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Briefcase, 
  MessageSquare,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart3,
  PieChart,
  Activity,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import DataVisualization from '@/components/admin/DataVisualization';

interface DashboardStats {
  totalNews: number;
  totalCases: number;
  totalJobs: number;
  totalApplications: number;
  totalContacts: number;
  totalFeedback: number;
  monthlyViews: number;
  activeJobs: number;
  pendingApplications: number;
  avgRating: number;
}

interface RecentActivity {
  id: string;
  type: 'news' | 'case' | 'job' | 'application' | 'contact';
  title: string;
  time: string;
  status?: string;
}

interface QuickAction {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    href: '/admin/news/create',
    title: '发布新闻',
    description: '创建新的新闻文章',
    icon: FileText,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    href: '/admin/cases/create',
    title: '添加案例',
    description: '创建新的项目案例',
    icon: Plus,
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    href: '/admin/jobs/create',
    title: '发布职位',
    description: '创建新的招聘职位',
    icon: Briefcase,
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    href: '/admin/applications',
    title: '处理申请',
    description: '查看待处理的申请',
    icon: Users,
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    href: '/admin/feedback',
    title: '查看反馈',
    description: '管理用户反馈和评价',
    icon: Star,
    color: 'bg-yellow-500 hover:bg-yellow-600'
  }
];

export default function AdminHomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    totalCases: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalContacts: 0,
    totalFeedback: 0,
    avgRating: 0,
    monthlyViews: 0,
    activeJobs: 0,
    pendingApplications: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据加载
    const loadDashboardData = async () => {
      try {
        // 这里应该调用实际的API
        setStats({
          totalNews: 24,
          totalCases: 18,
          totalJobs: 12,
          totalApplications: 156,
          totalContacts: 89,
          totalFeedback: 45,
          avgRating: 4.2,
          monthlyViews: 12450,
          activeJobs: 8,
          pendingApplications: 23
        });
        
        setRecentActivity([
          {
            id: '1',
            type: 'application',
            title: '新的职位申请 - 前端开发工程师',
            time: '2分钟前',
            status: 'pending'
          },
          {
            id: '2',
            type: 'contact',
            title: '新的联系表单提交',
            time: '15分钟前'
          },
          {
            id: '3',
            type: 'news',
            title: '新闻文章已发布 - 夜生活行业趋势分析',
            time: '1小时前',
            status: 'published'
          },
          {
            id: '4',
            type: 'job',
            title: '职位已更新 - 品牌设计师',
            time: '2小时前'
          },
          {
            id: '5',
            type: 'case',
            title: '案例已添加 - 上海某知名夜店改造项目',
            time: '3小时前'
          }
        ]);
      } catch (error) {
        console.error('加载仪表板数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: '总新闻数',
      value: stats.totalNews,
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: '总案例数',
      value: stats.totalCases,
      change: '+8%',
      trend: 'up',
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: '活跃职位',
      value: stats.activeJobs,
      change: '+5%',
      trend: 'up',
      icon: Briefcase,
      color: 'text-purple-600'
    },
    {
      title: '待处理申请',
      value: stats.pendingApplications,
      change: '-3%',
      trend: 'down',
      icon: Users,
      color: 'text-orange-600'
    },
    {
      title: '月度浏览量',
      value: stats.monthlyViews.toLocaleString(),
      change: '+15%',
      trend: 'up',
      icon: Activity,
      color: 'text-indigo-600'
    },
    {
      title: '联系表单',
      value: stats.totalContacts,
      change: '+7%',
      trend: 'up',
      icon: MessageSquare,
      color: 'text-pink-600'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 欢迎信息 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">欢迎回来，管理员！</h1>
        <p className="text-blue-100">今天是 {new Date().toLocaleDateString('zh-CN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        })}</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {isPositive ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        isPositive ? "text-green-600" : "text-red-600"
                      )}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs 上月</span>
                    </div>
                  </div>
                  <div className={cn("p-3 rounded-full bg-gray-50", stat.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 数据可视化 */}
      <DataVisualization />

      {/* 快速操作和最近活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* 快速操作 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>快速操作</span>
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  
                  return (
                    <Link key={index} href={action.href}>
                      <div className="group p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "p-2 rounded-lg text-white transition-colors",
                            action.color
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-500">{action.description}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 最近活动 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>最近活动</span>
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const getActivityIcon = (type: string) => {
                  switch (type) {
                    case 'news': return FileText;
                    case 'case': return Eye;
                    case 'job': return Briefcase;
                    case 'application': return Users;
                    case 'contact': return MessageSquare;
                    default: return Activity;
                  }
                };
                
                const Icon = getActivityIcon(activity.type);
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        {activity.status && (
                          <Badge 
                            variant="secondary"
                            className={`text-xs ${activity.status === 'pending' ? 'bg-red-100 text-red-800' : ''}`}
                          >
                            {activity.status === 'pending' ? '待处理' : 
                             activity.status === 'published' ? '已发布' : activity.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link href="/admin/activity">
                <Button variant="ghost" className="w-full text-sm">
                  查看所有活动
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 管理模块 */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>管理模块</span>
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: '/admin/contacts', title: '联系表单', desc: '查看与管理用户咨询', count: stats.totalContacts },
              { href: '/admin/news', title: '新闻资讯', desc: '发布、编辑、删除新闻', count: stats.totalNews },
              { href: '/admin/social-media', title: '社交媒体', desc: '管理社交媒体内容抓取', count: 0 },
              { href: '/admin/cases', title: '案例管理', desc: '管理项目案例与展示', count: stats.totalCases },
              { href: '/admin/jobs', title: '招聘职位', desc: '维护职位与投递', count: stats.totalJobs },
              { href: '/admin/applications', title: '申请管理', desc: '查看与处理职位申请', count: stats.totalApplications },
            ].map((module, index) => (
              <Link key={index} href={module.href}>
                <div className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                      {module.title}
                    </h3>
                    {module.count > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {module.count}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{module.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}