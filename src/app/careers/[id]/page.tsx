'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Calendar, Briefcase, Star, Send } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import { JobApplicationForm } from '@/components/careers/JobApplicationForm';
import { jobsApi } from '@/lib/api';
import type { JobPosition } from '@/types';

const JobDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<JobPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // 获取职位详情
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${jobId}`);
        
        if (!response.ok) {
          throw new Error('职位不存在或已下线');
        }
        
        const data = await response.json();
        if (data.success) {
          setJob(data.data);
        } else {
          throw new Error(data.message || '获取职位信息失败');
        }
      } catch (err) {
        console.error('获取职位详情失败:', err);
        setError(err instanceof Error ? err.message : '获取职位信息失败');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  // 格式化薪资
  const formatSalary = (salary: string) => {
    if (!salary) return '面议';
    return salary;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('zh-CN');
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

  // 获取经验要求标签颜色
  const getExperienceColor = (experience: string) => {
    const colors = {
      '不限': 'bg-gray-100 text-gray-800',
      '1-3年': 'bg-blue-100 text-blue-800',
      '3-5年': 'bg-green-100 text-green-800',
      '5-10年': 'bg-orange-100 text-orange-800',
      '10年以上': 'bg-red-100 text-red-800'
    };
    return colors[experience as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">职位不存在</h2>
          <p className="text-gray-600 mb-6">{error || '该职位可能已下线或不存在'}</p>
          <Button onClick={() => router.push('/careers')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回职位列表
          </Button>
        </div>
      </div>
    );
  }

  // 如果显示申请表单
  if (showApplicationForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <JobApplicationForm
            job={job}
            onClose={() => setShowApplicationForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/careers')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回职位列表
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 职位基本信息 */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                    {job.isUrgent && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        急招
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
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
                    {job.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>截止: {formatDate(job.deadline)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(job.type)}`}>
                      {job.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceColor(job.experience || '')}`}>
                      {job.experience || '经验不限'}
                    </span>
                  </div>
                </div>
                
                <div className="lg:ml-8">
                  <Button
                    onClick={() => setShowApplicationForm(true)}
                    size="lg"
                    className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    立即申请
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 主要内容 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 职位描述 */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">职位描述</h2>
                  <div className="prose prose-gray max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {job.description}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 任职要求 */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">任职要求</h2>
                  <div className="prose prose-gray max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {job.requirements}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 福利待遇 */}
              {job.benefits && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">福利待遇</h2>
                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {job.benefits}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
              {/* 快速申请 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">快速申请</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    对这个职位感兴趣？点击下方按钮开始申请流程。
                  </p>
                  <Button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    立即申请
                  </Button>
                </CardContent>
              </Card>

              {/* 职位信息 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">职位信息</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">职位类型:</span>
                      <span className="font-medium">{job.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">工作经验:</span>
                      <span className="font-medium">{job.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">工作地点:</span>
                      <span className="font-medium">{job.location}</span>
                    </div>
                    {job.isRemote && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">远程工作:</span>
                        <span className="font-medium text-green-600">支持</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">薪资范围:</span>
                      <span className="font-medium">{job.salary ? formatSalary(job.salary) : '薪资面议'}</span>
                    </div>
                    {job.deadline && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">申请截止:</span>
                        <span className="font-medium">{formatDate(job.deadline)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">发布时间:</span>
                      <span className="font-medium">{formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 联系我们 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">联系我们</h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-gray-600">
                      如果您对这个职位有任何疑问，欢迎联系我们的HR团队。
                    </p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-600">邮箱:</span>
                        <span className="ml-2 font-medium">hr@company.com</span>
                      </div>
                      <div>
                        <span className="text-gray-600">电话:</span>
                        <span className="ml-2 font-medium">400-123-4567</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;