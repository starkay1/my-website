'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Calendar, MapPin, Briefcase, Users, Filter } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, Button, Input, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { JobPosition } from '@/types';

interface JobsPageState {
  jobs: JobPosition[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedDepartment: string;
  selectedStatus: string;
  selectedType: string;
  selectedJobs: string[];
  showFilters: boolean;
}

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'draft', label: '草稿' },
  { value: 'published', label: '已发布' },
  { value: 'closed', label: '已关闭' }
];

const departmentOptions = [
  { value: 'all', label: '全部部门' },
  { value: '品牌设计', label: '品牌设计' },
  { value: '运营管理', label: '运营管理' },
  { value: '市场营销', label: '市场营销' },
  { value: '技术开发', label: '技术开发' },
  { value: '人力资源', label: '人力资源' },
  { value: '管理咨询', label: '管理咨询' }
];

const typeOptions = [
  { value: 'all', label: '全部类型' },
  { value: 'full-time', label: '全职' },
  { value: 'part-time', label: '兼职' },
  { value: 'contract', label: '合同工' },
  { value: 'internship', label: '实习' }
];

export default function JobsPage() {
  const [state, setState] = useState<JobsPageState>({
    jobs: [],
    loading: true,
    error: null,
    searchTerm: '',
    selectedDepartment: 'all',
    selectedStatus: 'all',
    selectedType: 'all',
    selectedJobs: [],
    showFilters: false
  });

  // 获取职位列表
  const fetchJobs = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const params = new URLSearchParams();
      if (state.searchTerm) params.append('search', state.searchTerm);
      if (state.selectedDepartment !== 'all') params.append('department', state.selectedDepartment);
      if (state.selectedStatus !== 'all') params.append('status', state.selectedStatus);
      if (state.selectedType !== 'all') params.append('type', state.selectedType);
      
      const response = await fetch(`/api/admin/jobs?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          jobs: result.data.items || [], 
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.message || '获取职位列表失败', 
          loading: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: '网络错误，请稍后重试', 
        loading: false 
      }));
    }
  };

  // 删除职位
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个职位吗？')) return;
    
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.success) {
        await fetchJobs();
      } else {
        alert(result.message || '删除失败');
      }
    } catch (error) {
      alert('删除失败，请稍后重试');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (state.selectedJobs.length === 0) {
      alert('请选择要删除的职位');
      return;
    }
    
    if (!confirm(`确定要删除选中的 ${state.selectedJobs.length} 个职位吗？`)) return;
    
    try {
      const response = await fetch('/api/admin/jobs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: state.selectedJobs })
      });
      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({ ...prev, selectedJobs: [] }));
        await fetchJobs();
      } else {
        alert(result.message || '批量删除失败');
      }
    } catch (error) {
      alert('批量删除失败，请稍后重试');
    }
  };

  // 批量更新状态
  const handleBatchStatusUpdate = async (status: string) => {
    if (state.selectedJobs.length === 0) {
      alert('请选择要更新的职位');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/jobs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: state.selectedJobs, status })
      });
      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({ ...prev, selectedJobs: [] }));
        await fetchJobs();
      } else {
        alert(result.message || '批量更新失败');
      }
    } catch (error) {
      alert('批量更新失败，请稍后重试');
    }
  };

  // 选择/取消选择职位
  const handleSelectJob = (id: string) => {
    setState(prev => ({
      ...prev,
      selectedJobs: prev.selectedJobs.includes(id)
        ? prev.selectedJobs.filter(jobId => jobId !== id)
        : [...prev.selectedJobs, id]
    }));
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    setState(prev => ({
      ...prev,
      selectedJobs: prev.selectedJobs.length === prev.jobs.length 
        ? [] 
        : prev.jobs.map(job => job.id)
    }));
  };

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: '草稿', variant: 'secondary' as const },
      published: { label: '已发布', variant: 'success' as const },
      closed: { label: '已关闭', variant: 'error' as const }
    };
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // 获取类型标签
  const getTypeLabel = (type: string) => {
    const typeMap = {
      'full-time': '全职',
      'part-time': '兼职',
      'contract': '合同工',
      'internship': '实习'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  useEffect(() => {
    fetchJobs();
  }, [state.searchTerm, state.selectedDepartment, state.selectedStatus, state.selectedType]);

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">招聘职位管理</h1>
          <p className="text-gray-600 mt-1">管理和发布招聘职位</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/jobs/create">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              发布职位
            </Button>
          </Link>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            {/* 搜索框 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="搜索职位名称、描述或部门..."
                    value={state.searchTerm}
                    onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setState(prev => ({ ...prev, showFilters: !prev.showFilters }))}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                筛选
              </Button>
            </div>

            {/* 筛选器 */}
            {state.showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    状态
                  </label>
                  <select
                    value={state.selectedStatus}
                    onChange={(e) => setState(prev => ({ ...prev, selectedStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    部门
                  </label>
                  <select
                    value={state.selectedDepartment}
                    onChange={(e) => setState(prev => ({ ...prev, selectedDepartment: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {departmentOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    类型
                  </label>
                  <select
                    value={state.selectedType}
                    onChange={(e) => setState(prev => ({ ...prev, selectedType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 批量操作 */}
      {state.selectedJobs.length > 0 && (
        <Card>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-gray-600">
                已选择 {state.selectedJobs.length} 个职位
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBatchStatusUpdate('published')}
                >
                  批量发布
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBatchStatusUpdate('draft')}
                >
                  设为草稿
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBatchStatusUpdate('closed')}
                >
                  关闭职位
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleBatchDelete}
                >
                  批量删除
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 职位列表 */}
      <Card>
        <CardContent>
          {state.loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">加载中...</div>
            </div>
          ) : state.error ? (
            <div className="text-center py-8">
              <div className="text-red-500">{state.error}</div>
              <Button 
                variant="outline" 
                onClick={fetchJobs}
                className="mt-4"
              >
                重试
              </Button>
            </div>
          ) : state.jobs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">暂无职位数据</div>
              <Link href="/admin/jobs/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  发布第一个职位
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 表头 */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={state.selectedJobs.length === state.jobs.length && state.jobs.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                  <div className="md:col-span-2">职位信息</div>
                  <div>部门</div>
                  <div>类型</div>
                  <div>状态</div>
                  <div>操作</div>
                </div>
              </div>

              {/* 职位列表 */}
              {state.jobs.map((job) => (
                <div key={job.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={state.selectedJobs.includes(job.id)}
                    onChange={() => handleSelectJob(job.id)}
                    className="rounded border-gray-300"
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                    {/* 职位信息 */}
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {job.title}
                            {job.isUrgent && (
                              <Badge variant="error" size="sm" className="ml-2">
                                急招
                              </Badge>
                            )}
                            {job.isRemote && (
                              <Badge variant="success" size="sm" className="ml-2">
                                远程
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {job.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <span>💰</span>
                                {job.salary}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(job.postedAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 部门 */}
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{job.department}</span>
                      </div>
                    </div>

                    {/* 类型 */}
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{getTypeLabel(job.type)}</span>
                      </div>
                    </div>

                    {/* 状态 */}
                    <div className="flex items-center">
                      {getStatusBadge(job.status)}
                    </div>

                    {/* 操作 */}
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/jobs/${job.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/careers?job=${job.id}`} target="_blank">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(job.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}