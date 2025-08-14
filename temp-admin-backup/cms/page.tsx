'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Image, BarChart3, Settings, Plus, Users, Globe } from 'lucide-react';
import ContentList from '@/components/cms/ContentList';
import ContentEditor from '@/components/cms/ContentEditor';
import MediaLibrary from '@/components/cms/MediaLibrary';
import { useRouter } from 'next/navigation';

interface CMSStats {
  totalContents: number;
  publishedContents: number;
  draftContents: number;
  totalMedia: number;
  totalViews: number;
  recentActivity: Array<{
    id: string;
    type: 'content_created' | 'content_updated' | 'content_published';
    title: string;
    timestamp: string;
    user: string;
  }>;
}

export default function CMSAdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [stats, setStats] = useState<CMSStats>({
    totalContents: 0,
    publishedContents: 0,
    draftContents: 0,
    totalMedia: 0,
    totalViews: 0,
    recentActivity: [],
  });
  const router = useRouter();

  const handleEditContent = (content: any) => {
    setEditingContent(content.id);
    setActiveTab('editor');
  };

  const handleCreateNew = () => {
    setEditingContent(null);
    setActiveTab('editor');
  };

  const handleSaveContent = (content: any) => {
    // 保存成功后返回列表
    setActiveTab('contents');
    setEditingContent(null);
  };

  const handleCancelEdit = () => {
    setActiveTab('contents');
    setEditingContent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">内容管理系统</h1>
          <p className="text-gray-600 mt-2">
            管理网站内容、媒体文件和发布设置
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              概览
            </TabsTrigger>
            <TabsTrigger value="contents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              内容管理
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              编辑器
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              媒体库
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              设置
            </TabsTrigger>
          </TabsList>

          {/* 概览页面 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">总内容数</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalContents}</div>
                  <p className="text-xs text-muted-foreground">
                    包含所有类型的内容
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">已发布</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.publishedContents}</div>
                  <p className="text-xs text-muted-foreground">
                    公开可见的内容
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">草稿</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.draftContents}</div>
                  <p className="text-xs text-muted-foreground">
                    待发布的内容
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">媒体文件</CardTitle>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalMedia}</div>
                  <p className="text-xs text-muted-foreground">
                    图片、视频等文件
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>快速操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleCreateNew} className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    创建新内容
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('media')} 
                    className="w-full justify-start"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    管理媒体文件
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('contents')} 
                    className="w-full justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    查看所有内容
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('settings')} 
                    className="w-full justify-start"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    系统设置
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>最近活动</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {activity.type === 'content_created' && (
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            )}
                            {activity.type === 'content_updated' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            )}
                            {activity.type === 'content_published' && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {activity.user} • {new Date(activity.timestamp).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">暂无最近活动</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 内容管理页面 */}
          <TabsContent value="contents">
            <ContentList onEdit={handleEditContent} />
          </TabsContent>

          {/* 编辑器页面 */}
          <TabsContent value="editor">
            <ContentEditor
              contentId={editingContent || undefined}
              onSave={handleSaveContent}
              onCancel={handleCancelEdit}
            />
          </TabsContent>

          {/* 媒体库页面 */}
          <TabsContent value="media">
            <MediaLibrary />
          </TabsContent>

          {/* 设置页面 */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>内容设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        默认语言
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="en">English</option>
                        <option value="zh-CN">中文</option>
                        <option value="th">ไทย</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        默认内容类型
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="post">文章</option>
                        <option value="page">页面</option>
                        <option value="service">服务</option>
                        <option value="case_study">案例研究</option>
                        <option value="news">新闻</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO 设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      默认 SEO 标题模板
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="{title} | SpacePlus"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      默认 SEO 描述
                    </label>
                    <textarea 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="SpacePlus - 专业的太空技术解决方案提供商"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>发布设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="auto-publish" className="rounded" />
                    <label htmlFor="auto-publish" className="text-sm font-medium text-gray-700">
                      自动发布已审核的内容
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="require-review" className="rounded" />
                    <label htmlFor="require-review" className="text-sm font-medium text-gray-700">
                      发布前需要审核
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="enable-comments" className="rounded" />
                    <label htmlFor="enable-comments" className="text-sm font-medium text-gray-700">
                      启用评论功能
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}