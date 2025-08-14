'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, DollarSign, Clock, Briefcase, Filter, ChevronRight, Star } from 'lucide-react';
import { Card, CardContent, Button, Input } from '@/components/ui';
import type { JobPosition } from '@/types';

const CareersPage: React.FC = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // 获取职位列表
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jobs');
        
        if (!response.ok) {
          throw new Error('获取职位列表失败');
        }
        
        const data = await response.json();
        if (data.success) {
          setJobs(data.data || []);
        } else {
          throw new Error(data.message || '获取职位列表失败');
        }
      } catch (err) {
        console.error('获取职位列表失败:', err);
        setError(err instanceof Error ? err.message : '获取职位列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // 筛选职位
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !selectedDepartment || job.department === selectedDepartment;
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesType = !selectedType || job.type === selectedType;
    
    return matchesSearch && matchesDepartment && matchesLocation && matchesType;
  });

  // 获取所有部门
  const departments = Array.from(new Set(jobs.map(job => job.department))).sort();
  
  // 获取所有地点
  const locations = Array.from(new Set(jobs.map(job => job.location))).sort();
  
  // 获取所有类型
  const types = Array.from(new Set(jobs.map(job => job.type))).sort();

  // 格式化薪资
  const formatSalary = (salary: string) => {
    if (!salary) return '面议';
    return salary;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天发布';
    if (diffDays === 1) return '昨天发布';
    if (diffDays < 7) return `${diffDays}天前发布`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前发布`;
    return date.toLocaleDateString('zh-CN');
  };

  // 获取职位类型标签颜色
  const getTypeColor = (type: string) => {
    const colors = {
      '全职': 'bg-blue-100 text-blue-800',
      '兼职': 'bg-green-100 text-green-800',
      '实习': 'bg-purple-100 text-purple-800',
      '合同': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // 清除所有筛选
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedLocation('');
    setSelectedType('');
  };

  // 跳转到职位详情
  const goToJobDetail = (jobId: string) => {
    router.push(`/careers/${jobId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
            重新加载
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">加入我们</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              寻找优秀的人才，共同创造美好的未来。在这里，您将找到理想的职业发展机会。
            </p>
          </div>
          
          {/* 搜索和筛选 */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="搜索职位、部门或关键词..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              
              {/* 筛选按钮 */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6"
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>
            
            {/* 筛选选项 */}
            {showFilters && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">部门</label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">所有部门</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">地点</label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">所有地点</option>
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">所有类型</option>
                        {types.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full"
                      >
                        清除筛选
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* 职位列表 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 结果统计 */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              共找到 <span className="font-semibold text-gray-900">{filteredJobs.length}</span> 个职位
            </p>
          </div>

          {/* 职位卡片 */}
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无匹配职位</h3>
                <p className="text-gray-600 mb-4">请尝试调整搜索条件或筛选选项</p>
                <Button variant="outline" onClick={clearFilters}>
                  清除所有筛选
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => goToJobDetail(job.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          {job.isUrgent && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                              急招
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                            {job.isRemote && <span className="text-green-600">(可远程)</span>}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary ? formatSalary(job.salary) : '薪资面议'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(job.createdAt)}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {job.description.length > 150 
                            ? `${job.description.substring(0, 150)}...` 
                            : job.description
                          }
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(job.type)}`}>
                            {job.type}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            {job.experience}
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex items-center">
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareersPage;