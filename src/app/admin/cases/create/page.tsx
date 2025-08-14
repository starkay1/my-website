'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, Button, Input, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils';

interface CaseFormData {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  client: string;
  industry: string;
  location: string;
  duration: string;
  teamSize: string;
  budget: string;
  status: string;
  featured: boolean;
  coverImage: string;
  gallery: string[];
  tags: string[];
  category: string;
  overviewChallenge: string;
  overviewSolution: string;
  overviewResults: string;
}

const initialFormData: CaseFormData = {
  slug: '',
  title: '',
  subtitle: '',
  excerpt: '',
  client: '',
  industry: '',
  location: '',
  duration: '',
  teamSize: '',
  budget: '',
  status: 'draft',
  featured: false,
  coverImage: '',
  gallery: [],
  tags: [],
  category: '',
  overviewChallenge: '',
  overviewSolution: '',
  overviewResults: ''
};

const statusOptions = [
  { value: 'draft', label: '草稿' },
  { value: 'in-progress', label: '进行中' },
  { value: 'completed', label: '已完成' }
];

const categoryOptions = [
  { value: 'brand-transformation', label: '品牌重塑' },
  { value: 'brand-incubation', label: '品牌孵化' },
  { value: 'space-design', label: '空间设计' },
  { value: 'management', label: '运营管理' }
];

export default function CreateCasePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CaseFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');

  // 生成slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // 处理表单字段变化
  const handleInputChange = (field: keyof CaseFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // 自动生成slug
      if (field === 'title' && value) {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  // 添加标签
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 添加图库图片
  const addGalleryImage = () => {
    if (galleryInput.trim() && !formData.gallery.includes(galleryInput.trim())) {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, galleryInput.trim()]
      }));
      setGalleryInput('');
    }
  };

  // 删除图库图片
  const removeGalleryImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(image => image !== imageToRemove)
    }));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.client || !formData.category) {
      alert('请填写必填字段：标题、客户、分类');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        router.push('/admin/cases');
      } else {
        alert('创建失败: ' + result.message);
      }
    } catch (error) {
      console.error('创建案例失败:', error);
      alert('创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-4">
        <Link href="/admin/cases">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">创建案例</h1>
          <p className="text-gray-600 mt-1">添加新的项目案例</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  案例标题 *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="输入案例标题"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL别名
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="自动生成或手动输入"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  副标题
                </label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="输入副标题"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  案例摘要
                </label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="简要描述案例内容"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 客户信息 */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">客户信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  客户名称 *
                </label>
                <Input
                  value={formData.client}
                  onChange={(e) => handleInputChange('client', e.target.value)}
                  placeholder="输入客户名称"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所属行业
                </label>
                <Input
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  placeholder="输入行业类型"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  项目地点
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="输入项目地点"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  项目周期
                </label>
                <Input
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="如：6个月"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  团队规模
                </label>
                <Input
                  value={formData.teamSize}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                  placeholder="如：8人"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  项目预算
                </label>
                <Input
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="如：¥500,000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 分类和状态 */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">分类和状态</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  案例分类 *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">选择分类</option>
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  项目状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">设为精选案例</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 图片管理 */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">图片管理</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  封面图片
                </label>
                <Input
                  value={formData.coverImage}
                  onChange={(e) => handleInputChange('coverImage', e.target.value)}
                  placeholder="输入图片URL或上传图片"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  图库
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                    placeholder="输入图片URL"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                  />
                  <Button type="button" onClick={addGalleryImage} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.gallery.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.gallery.map((image, index) => (
                      <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                        <span className="truncate max-w-32">{image}</span>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(image)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 标签管理 */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">标签管理</h2>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="输入标签"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 案例概述 */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">案例概述</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  面临挑战
                </label>
                <Textarea
                  value={formData.overviewChallenge}
                  onChange={(e) => handleInputChange('overviewChallenge', e.target.value)}
                  placeholder="描述客户面临的主要挑战"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  解决方案
                </label>
                <Textarea
                  value={formData.overviewSolution}
                  onChange={(e) => handleInputChange('overviewSolution', e.target.value)}
                  placeholder="描述我们提供的解决方案"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  项目成果
                </label>
                <Textarea
                  value={formData.overviewResults}
                  onChange={(e) => handleInputChange('overviewResults', e.target.value)}
                  placeholder="描述项目取得的成果"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 提交按钮 */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/cases">
            <Button type="button" variant="outline">
              取消
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? '创建中...' : '创建案例'}
          </Button>
        </div>
      </form>
    </div>
  );
}