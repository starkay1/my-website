'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, Button, Input, Badge, RichTextEditor } from '@/components/ui';
import type { JobPosition } from '@/types';

interface EditJobState {
  job: JobPosition | null;
  formData: Partial<JobPosition>;
  loading: boolean;
  saving: boolean;
  error: string | null;
  preview: boolean;
}

const departmentOptions = [
  { value: '品牌设计', label: '品牌设计' },
  { value: '运营管理', label: '运营管理' },
  { value: '市场营销', label: '市场营销' },
  { value: '技术开发', label: '技术开发' },
  { value: '人力资源', label: '人力资源' },
  { value: '管理咨询', label: '管理咨询' }
];

const typeOptions = [
  { value: 'full-time', label: '全职' },
  { value: 'part-time', label: '兼职' },
  { value: 'contract', label: '合同工' },
  { value: 'internship', label: '实习' }
];

const experienceOptions = [
  { value: '不限', label: '不限' },
  { value: '1年以下', label: '1年以下' },
  { value: '1-3年', label: '1-3年' },
  { value: '3-5年', label: '3-5年' },
  { value: '5-10年', label: '5-10年' },
  { value: '10年以上', label: '10年以上' }
];

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [state, setState] = useState<EditJobState>({
    job: null,
    formData: {},
    loading: true,
    saving: false,
    error: null,
    preview: false
  });

  // 获取职位详情
  const fetchJob = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`/api/jobs/${params.id}`);
      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          job: result.data,
          formData: { ...result.data },
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.message || '获取职位信息失败', 
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

  // 更新表单数据
  const updateFormData = (field: keyof JobPosition, value: any) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value
      }
    }));
  };

  // 验证表单
  const validateForm = () => {
    const { title, department, location, description, requirements } = state.formData;
    
    if (!title?.trim()) {
      setState(prev => ({ ...prev, error: '请输入职位名称' }));
      return false;
    }
    
    if (!department?.trim()) {
      setState(prev => ({ ...prev, error: '请选择部门' }));
      return false;
    }
    
    if (!location?.trim()) {
      setState(prev => ({ ...prev, error: '请输入工作地点' }));
      return false;
    }
    
    if (!description?.trim()) {
      setState(prev => ({ ...prev, error: '请输入职位描述' }));
      return false;
    }
    
    if (!requirements || requirements.length === 0 || requirements.every(req => !req.trim())) {
      setState(prev => ({ ...prev, error: '请输入任职要求' }));
      return false;
    }
    
    return true;
  };

  // 保存职位
  const handleSave = async (status?: 'draft' | 'published') => {
    if (!validateForm()) return;
    
    setState(prev => ({ ...prev, saving: true, error: null }));
    
    try {
      const jobData = {
        ...state.formData,
        ...(status && { status }),
        updatedAt: new Date().toISOString()
      };
      
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          job: result.data,
          formData: { ...result.data },
          saving: false 
        }));
        
        // 如果是从预览页面保存，返回列表页
        if (state.preview) {
          router.push('/admin/jobs');
        }
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.message || '保存失败', 
          saving: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: '网络错误，请稍后重试', 
        saving: false 
      }));
    }
  };

  // 删除职位
  const handleDelete = async () => {
    if (!confirm('确定要删除这个职位吗？此操作不可恢复。')) return;
    
    try {
      setState(prev => ({ ...prev, saving: true }));
      
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        router.push('/admin/jobs');
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.message || '删除失败', 
          saving: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: '删除失败，请稍后重试', 
        saving: false 
      }));
    }
  };

  // 格式化日期为 YYYY-MM-DD 格式
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
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
    const option = typeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (state.error && !state.job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500">{state.error}</div>
        <Button onClick={fetchJob}>重试</Button>
      </div>
    );
  }

  if (state.preview) {
    return (
      <div className="space-y-6">
        {/* 预览头部 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setState(prev => ({ ...prev, preview: false }))}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回编辑
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">职位预览</h1>
              <div className="flex items-center gap-2 mt-1">
                {state.formData.status && getStatusBadge(state.formData.status)}
                <span className="text-sm text-gray-500">
                  最后更新：{state.job?.updatedAt ? new Date(state.job.updatedAt).toLocaleString('zh-CN') : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleSave('draft')}
              disabled={state.saving}
            >
              保存草稿
            </Button>
            <Button
              onClick={() => handleSave('published')}
              disabled={state.saving}
            >
              {state.saving ? '保存中...' : '发布职位'}
            </Button>
          </div>
        </div>

        {/* 预览内容 */}
        <Card>
          <CardContent>
            <div className="max-w-4xl mx-auto space-y-8">
              {/* 职位标题区域 */}
              <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {state.formData.title}
                </h1>
                <div className="flex justify-center items-center gap-4 text-gray-600">
                  <span>{state.formData.department}</span>
                  <span>•</span>
                  <span>{state.formData.location}</span>
                  <span>•</span>
                  <span>{getTypeLabel(state.formData.type || '')}</span>
                </div>
                <div className="flex justify-center gap-2">
                  {state.formData.isUrgent && (
                    <Badge variant="error">急招</Badge>
                  )}
                  {state.formData.isRemote && (
                    <Badge variant="success">远程工作</Badge>
                  )}
                </div>
              </div>

              {/* 职位信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {state.formData.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        职位描述
                      </h3>
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: state.formData.description }}
                      />
                    </div>
                  )}
                  
                  {state.formData.responsibilities && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        工作职责
                      </h3>
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: state.formData.responsibilities }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  {state.formData.requirements && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        任职要求
                      </h3>
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: state.formData.requirements }}
                      />
                    </div>
                  )}
                  
                  {state.formData.benefits && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        福利待遇
                      </h3>
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: state.formData.benefits }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 其他信息 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  职位信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.formData.salary && (
                    <div>
                      <span className="text-sm text-gray-600">薪资范围：</span>
                      <span className="font-medium">{state.formData.salary}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-600">经验要求：</span>
                    <span className="font-medium">{state.formData.experience}</span>
                  </div>
                  {state.formData.deadline && (
                    <div>
                      <span className="text-sm text-gray-600">截止日期：</span>
                      <span className="font-medium">
                        {new Date(state.formData.deadline).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-600">发布时间：</span>
                    <span className="font-medium">
                      {state.job?.postedAt ? new Date(state.job.postedAt).toLocaleDateString('zh-CN') : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/jobs">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回列表
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">编辑职位</h1>
            <div className="flex items-center gap-2 mt-1">
              {state.formData.status && getStatusBadge(state.formData.status)}
              <span className="text-sm text-gray-500">
                最后更新：{state.job?.updatedAt ? new Date(state.job.updatedAt).toLocaleString('zh-CN') : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setState(prev => ({ ...prev, preview: true }))}
            disabled={!state.formData.title || !state.formData.description}
          >
            <Eye className="w-4 h-4 mr-2" />
            预览
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave()}
            disabled={state.saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {state.saving ? '保存中...' : '保存'}
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={state.saving}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            删除
          </Button>
        </div>
      </div>

      {/* 错误提示 */}
      {state.error && (
        <Card>
          <CardContent>
            <div className="text-red-600 text-sm">{state.error}</div>
          </CardContent>
        </Card>
      )}

      {/* 表单 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主要信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本信息 */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    职位名称 *
                  </label>
                  <Input
                    value={state.formData.title || ''}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    placeholder="请输入职位名称"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      所属部门 *
                    </label>
                    <select
                      value={state.formData.department || ''}
                      onChange={(e) => updateFormData('department', e.target.value)}
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
                      工作地点 *
                    </label>
                    <Input
                      value={state.formData.location || ''}
                      onChange={(e) => updateFormData('location', e.target.value)}
                      placeholder="请输入工作地点"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      工作类型
                    </label>
                    <select
                      value={state.formData.type || ''}
                      onChange={(e) => updateFormData('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {typeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      经验要求
                    </label>
                    <select
                      value={state.formData.experience || ''}
                      onChange={(e) => updateFormData('experience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {experienceOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 职位描述 */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">职位描述 *</h3>
              <RichTextEditor
                value={state.formData.description || ''}
                onChange={(value) => updateFormData('description', value)}
                placeholder="请详细描述职位内容、工作环境等信息..."
                height="200"
              />
            </CardContent>
          </Card>

          {/* 工作职责 */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">工作职责</h3>
              <RichTextEditor
                value={Array.isArray(state.formData.responsibilities) ? state.formData.responsibilities.join('\n') : (state.formData.responsibilities || '')}
                onChange={(value) => updateFormData('responsibilities', value)}
                placeholder="请列出主要的工作职责和任务..."
                height="200"
              />
            </CardContent>
          </Card>

          {/* 任职要求 */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">任职要求 *</h3>
              <RichTextEditor
                value={Array.isArray(state.formData.requirements) ? state.formData.requirements.join('\n') : (state.formData.requirements || '')}
                onChange={(value) => updateFormData('requirements', value)}
                placeholder="请列出学历、技能、经验等要求..."
                height="200"
              />
            </CardContent>
          </Card>

          {/* 福利待遇 */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">福利待遇</h3>
              <RichTextEditor
                value={Array.isArray(state.formData.benefits) ? state.formData.benefits.join('\n') : (state.formData.benefits || '')}
                onChange={(value) => updateFormData('benefits', value)}
                placeholder="请描述薪资福利、发展机会等..."
                height="200"
              />
            </CardContent>
          </Card>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 薪资和截止日期 */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">其他信息</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    薪资范围
                  </label>
                  <Input
                    value={state.formData.salary || ''}
                    onChange={(e) => updateFormData('salary', e.target.value)}
                    placeholder="如：8K-15K，面议等"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    截止日期
                  </label>
                  <Input
    type="text"
                    value={formatDateForInput(state.formData.deadline || '')}
                    onChange={(e) => updateFormData('deadline', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 特殊标记 */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">特殊标记</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={state.formData.isUrgent || false}
                    onChange={(e) => updateFormData('isUrgent', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">急招职位</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={state.formData.isRemote || false}
                    onChange={(e) => updateFormData('isRemote', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">支持远程工作</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* 发布状态 */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">发布状态</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={state.formData.status === 'draft'}
                    onChange={(e) => updateFormData('status', e.target.value)}
                    className="border-gray-300"
                  />
                  <span className="text-sm">草稿</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={state.formData.status === 'published'}
                    onChange={(e) => updateFormData('status', e.target.value)}
                    className="border-gray-300"
                  />
                  <span className="text-sm">已发布</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="status"
                    value="closed"
                    checked={state.formData.status === 'closed'}
                    onChange={(e) => updateFormData('status', e.target.value)}
                    className="border-gray-300"
                  />
                  <span className="text-sm">已关闭</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* 职位统计 */}
          {state.job && (
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">职位统计</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">创建时间：</span>
                    <span>{new Date(state.job.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">发布时间：</span>
                    <span>{new Date(state.job.postedAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">最后更新：</span>
                    <span>{new Date(state.job.updatedAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}