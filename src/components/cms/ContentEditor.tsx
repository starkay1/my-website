'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Save, Eye, Upload, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import dynamic from 'next/dynamic';

// 动态导入富文本编辑器
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface ContentEditorProps {
  contentId?: string;
  onSave?: (content: any) => void;
  onCancel?: () => void;
}

interface ContentData {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  type: 'page' | 'post' | 'service' | 'case_study' | 'news';
  locale: 'en' | 'zh-CN' | 'th';
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  categories: string[];
  publishedAt?: string;
}

const initialContent: ContentData = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  status: 'draft',
  type: 'post',
  locale: 'en',
  featuredImage: '',
  seoTitle: '',
  seoDescription: '',
  tags: [],
  categories: [],
};

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

export default function ContentEditor({ contentId, onSave, onCancel }: ContentEditorProps) {
  const [content, setContent] = useState<ContentData>(initialContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const router = useRouter();

  // 加载现有内容
  useEffect(() => {
    if (contentId) {
      loadContent(contentId);
    }
  }, [contentId]);

  // 自动生成 slug
  useEffect(() => {
    if (content.title && !contentId) {
      const slug = generateSlug(content.title);
      setContent(prev => ({ ...prev, slug }));
    }
  }, [content.title, contentId]);

  const loadContent = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cms/content/${id}`);
      if (response.ok) {
        const data = await response.json();
        setContent({
          ...data,
          tags: data.tags || [],
          categories: data.categories || [],
        });
      } else {
        setError('加载内容失败');
      }
    } catch (err) {
      setError('加载内容失败');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSave = async (status?: 'draft' | 'published') => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const saveData = {
        ...content,
        status: status || content.status,
      };

      const url = contentId ? `/api/cms/content/${contentId}` : '/api/cms/content';
      const method = contentId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });

      if (response.ok) {
        const savedContent = await response.json();
        setSuccess(status === 'published' ? '内容已发布' : '内容已保存');
        if (onSave) {
          onSave(savedContent);
        }
        if (!contentId) {
          router.push(`/admin/cms/content/${savedContent.id}`);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || '保存失败');
      }
    } catch (err) {
      setError('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !content.tags.includes(newTag.trim())) {
      setContent(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setContent(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !content.categories.includes(newCategory.trim())) {
      setContent(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setContent(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {contentId ? '编辑内容' : '创建新内容'}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            保存草稿
          </Button>
          <Button
            onClick={() => handleSave('published')}
            disabled={saving}
          >
            <Eye className="w-4 h-4 mr-2" />
            发布
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              取消
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主要内容区域 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">标题 *</Label>
                <Input
                  id="title"
                  value={content.title}
                  onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="输入内容标题"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">URL 别名 *</Label>
                <Input
                  id="slug"
                  value={content.slug}
                  onChange={(e) => setContent(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-slug"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">摘要</Label>
                <Textarea
                  id="excerpt"
                  value={content.excerpt}
                  onChange={(e) => setContent(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="内容摘要"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>内容</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactQuill
                theme="snow"
                value={content.content}
                onChange={(value) => setContent(prev => ({ ...prev, content: value }))}
                modules={quillModules}
                style={{ height: '400px', marginBottom: '50px' }}
              />
            </CardContent>
          </Card>

          <Tabs defaultValue="seo" className="w-full">
            <TabsList>
              <TabsTrigger value="seo">SEO 设置</TabsTrigger>
              <TabsTrigger value="meta">分类标签</TabsTrigger>
            </TabsList>
            
            <TabsContent value="seo">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label htmlFor="seoTitle">SEO 标题</Label>
                    <Input
                      id="seoTitle"
                      value={content.seoTitle || ''}
                      onChange={(e) => setContent(prev => ({ ...prev, seoTitle: e.target.value }))}
                      placeholder="SEO 标题（留空使用内容标题）"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seoDescription">SEO 描述</Label>
                    <Textarea
                      id="seoDescription"
                      value={content.seoDescription || ''}
                      onChange={(e) => setContent(prev => ({ ...prev, seoDescription: e.target.value }))}
                      placeholder="SEO 描述"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="meta">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label>标签</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="添加标签"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button onClick={addTag} size="sm">
                        添加
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {content.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                          <X
                            className="w-3 h-3 ml-1 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>分类</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="添加分类"
                        onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                      />
                      <Button onClick={addCategory} size="sm">
                        添加
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {content.categories.map((category, index) => (
                        <Badge key={index} variant="outline">
                          {category}
                          <X
                            className="w-3 h-3 ml-1 cursor-pointer"
                            onClick={() => removeCategory(category)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>发布设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">状态</Label>
                <Select
                  value={content.status}
                  onValueChange={(value: string) => 
                    setContent(prev => ({ ...prev, status: value as 'draft' | 'published' | 'archived' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="archived">已归档</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">类型</Label>
                <Select
                  value={content.type}
                  onValueChange={(value: string) => 
                    setContent(prev => ({ ...prev, type: value as 'page' | 'post' | 'service' | 'case_study' | 'news' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">页面</SelectItem>
                    <SelectItem value="post">文章</SelectItem>
                    <SelectItem value="service">服务</SelectItem>
                    <SelectItem value="case_study">案例研究</SelectItem>
                    <SelectItem value="news">新闻</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="locale">语言</Label>
                <Select
                  value={content.locale}
                  onValueChange={(value: string) => 
                    setContent(prev => ({ ...prev, language: value as 'en' | 'zh-CN' | 'th' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="zh-CN">中文</SelectItem>
                    <SelectItem value="th">ไทย</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>特色图片</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.featuredImage && (
                  <div className="relative">
                    <img
                      src={content.featuredImage}
                      alt="特色图片"
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => setContent(prev => ({ ...prev, featuredImage: '' }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <Input
                  value={content.featuredImage || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="图片 URL"
                />
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  上传图片
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}