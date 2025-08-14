'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Users,
  FileText,
  Briefcase,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface TimeSeriesData {
  date: string;
  value: number;
}

interface VisualizationProps {
  className?: string;
}

// 简单的柱状图组件
function SimpleBarChart({ data, height = 200 }: { data: ChartData[]; height?: number }) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between space-x-2 w-full" style={{ height, minHeight: '200px' }}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * (height - 40);
        
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="text-xs font-medium text-gray-600 mb-1">
              {item.value}
            </div>
            <div 
              className={cn(
                "w-full rounded-t-md transition-all duration-300 hover:opacity-80",
                item.color || "bg-blue-500"
              )}
              style={{ height: barHeight }}
            />
            <div className="text-xs text-gray-500 mt-2 text-center">
              {item.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 简单的饼图组件
function SimplePieChart({ data }: { data: ChartData[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  const colors = [
    'text-blue-500',
    'text-green-500', 
    'text-purple-500',
    'text-orange-500',
    'text-pink-500',
    'text-indigo-500'
  ];
  
  return (
    <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            const pathData = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={`hsl(${index * 60}, 70%, 50%)`}
                className="hover:opacity-80 transition-opacity"
              />
            );
          })}
        </svg>
      </div>
      
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
            />
            <span className="text-sm text-gray-600">{item.name}</span>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 简单的折线图组件
function SimpleLineChart({ data, height = 200 }: { data: TimeSeriesData[]; height?: number }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 80;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="space-y-4">
      <svg className="w-full" style={{ height }} viewBox="0 0 100 100">
        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((item.value - minValue) / range) * 80;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill="#3b82f6"
              className="hover:r-3 transition-all"
            />
          );
        })}
      </svg>
      
      <div className="flex justify-between text-xs text-gray-500">
        {data.map((item, index) => (
          <span key={index}>{item.date}</span>
        ))}
      </div>
    </div>
  );
}

export default function DataVisualization({ className }: VisualizationProps) {
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<TimeSeriesData[]>([]);
  const [categoryData, setCategoryData] = useState<ChartData[]>([]);
  const [departmentData, setDepartmentData] = useState<ChartData[]>([]);
  const [activityData, setActivityData] = useState<ChartData[]>([]);
  
  useEffect(() => {
    // 模拟数据加载
    const loadVisualizationData = async () => {
      try {
        // 模拟月度访问量数据
        setMonthlyData([
          { date: '1月', value: 8500 },
          { date: '2月', value: 9200 },
          { date: '3月', value: 8800 },
          { date: '4月', value: 10500 },
          { date: '5月', value: 11200 },
          { date: '6月', value: 12450 }
        ]);
        
        // 模拟内容分类数据
        setCategoryData([
          { name: '新闻', value: 24, color: 'bg-blue-500' },
          { name: '案例', value: 18, color: 'bg-green-500' },
          { name: '职位', value: 12, color: 'bg-purple-500' },
          { name: '联系', value: 89, color: 'bg-orange-500' }
        ]);
        
        // 模拟部门职位分布
        setDepartmentData([
          { name: '品牌设计', value: 3 },
          { name: '运营管理', value: 4 },
          { name: '市场营销', value: 2 },
          { name: '技术开发', value: 2 },
          { name: '管理咨询', value: 1 }
        ]);
        
        // 模拟活动类型分布
        setActivityData([
          { name: '新闻发布', value: 45 },
          { name: '案例更新', value: 32 },
          { name: '职位申请', value: 156 },
          { name: '用户咨询', value: 89 },
          { name: '系统操作', value: 67 }
        ]);
        
      } catch (error) {
        console.error('加载可视化数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadVisualizationData();
  }, []);
  
  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-6 w-full", className)}>
      {/* 月度访问量趋势 */}
      <Card>
        <CardHeader>
          <h3 className="flex items-center space-x-2 text-lg font-semibold">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>月度访问量趋势</span>
          </h3>
        </CardHeader>
        <CardContent>
          <SimpleLineChart data={monthlyData} height={250} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 内容分类统计 */}
        <Card>
          <CardHeader>
            <h3 className="flex items-center space-x-2 text-lg font-semibold">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span>内容分类统计</span>
            </h3>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={categoryData} height={200} />
          </CardContent>
        </Card>
        
        {/* 部门职位分布 */}
        <Card>
          <CardHeader>
            <h3 className="flex items-center space-x-2 text-lg font-semibold">
              <PieChart className="h-5 w-5 text-purple-600" />
              <span>部门职位分布</span>
            </h3>
          </CardHeader>
          <CardContent>
            <SimplePieChart data={departmentData} />
          </CardContent>
        </Card>
      </div>
      
      {/* 活动类型分析 */}
      <Card>
        <CardHeader>
          <h3 className="flex items-center space-x-2 text-lg font-semibold">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span>活动类型分析</span>
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {activityData.map((activity, index) => {
              const icons = [FileText, Users, Briefcase, MessageSquare, BarChart3];
              const Icon = icons[index] || BarChart3;
              const colors = [
                'text-blue-600 bg-blue-50',
                'text-green-600 bg-green-50',
                'text-purple-600 bg-purple-50',
                'text-orange-600 bg-orange-50',
                'text-pink-600 bg-pink-50'
              ];
              
              return (
                <div key={index} className="text-center">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3",
                    colors[index]
                  )}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{activity.name}</h3>
                  <p className="text-2xl font-bold text-gray-900">{activity.value}</p>
                  <p className="text-sm text-gray-500">本月总计</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* 实时统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '今日新增用户', value: 23, change: '+12%', positive: true },
          { label: '今日页面浏览', value: 1247, change: '+8%', positive: true },
          { label: '今日新申请', value: 5, change: '-2%', positive: false },
          { label: '系统响应时间', value: '245ms', change: '-15%', positive: true }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className={cn(
                  "text-xs font-medium",
                  stat.positive ? "text-green-600" : "text-red-600"
                )}>
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}