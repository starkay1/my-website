'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Plus, Settings, Play, Pause, RefreshCw, Trash2, TestTube, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SocialSource {
  id: string;
  name: string;
  platform: string;
  username?: string;
  isActive: boolean;
  lastSync?: string;
  syncInterval: number;
  config?: any;
  _count: {
    posts: number;
  };
}

interface SocialPost {
  id: string;
  platform: string;
  platformId: string;
  title?: string;
  content: string;
  publishedAt: string;
  isProcessed: boolean;
  newsId?: string;
  source: {
    name: string;
    platform: string;
  };
}

interface SchedulerStatus {
  isRunning: boolean;
  activeTasks: number;
  taskList: string[];
}

export default function SocialSourceManager() {
  const [sources, setSources] = useState<SocialSource[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [schedulerStatus, setSchedulerStatus] = useState<SchedulerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<SocialSource | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('sources');

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    username: '',
    accessToken: '',
    webhookUrl: '',
    isActive: true,
    syncInterval: 3600,
    config: '{}'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSources(),
        loadPosts(),
        loadSchedulerStatus()
      ]);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSources = async () => {
    try {
      const response = await fetch('/api/admin/social-sources');
      const result = await response.json();
      if (result.success) {
        setSources(result.data.items);
      }
    } catch (error) {
      console.error('加载社交媒体源失败:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/admin/social-posts?pageSize=20');
      const result = await response.json();
      if (result.success) {
        setPosts(result.data.items);
      }
    } catch (error) {
      console.error('加载社交媒体帖子失败:', error);
    }
  };

  const loadSchedulerStatus = async () => {
    try {
      const response = await fetch('/api/admin/social-scheduler');
      const result = await response.json();
      if (result.success) {
        setSchedulerStatus(result.data.scheduler);
      }
    } catch (error) {
      console.error('加载调度器状态失败:', error);
    }
  };

  const handleCreateSource = async () => {
    try {
      let config = {};
      try {
        config = JSON.parse(formData.config);
      } catch (e) {
        alert('配置JSON格式错误');
        return;
      }

      const response = await fetch('/api/admin/social-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, config })
      });

      const result = await response.json();
      if (result.success) {
        setIsCreateDialogOpen(false);
        resetForm();
        loadSources();
        alert('社交媒体源创建成功');
      } else {
        alert(result.message || '创建失败');
      }
    } catch (error) {
      console.error('创建社交媒体源失败:', error);
      alert('创建失败');
    }
  };

  const handleUpdateSource = async () => {
    if (!selectedSource) return;

    try {
      let config = {};
      try {
        config = JSON.parse(formData.config);
      } catch (e) {
        alert('配置JSON格式错误');
        return;
      }

      const response = await fetch('/api/admin/social-sources', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedSource.id, ...formData, config })
      });

      const result = await response.json();
      if (result.success) {
        setIsEditDialogOpen(false);
        setSelectedSource(null);
        resetForm();
        loadSources();
        alert('社交媒体源更新成功');
      } else {
        alert(result.message || '更新失败');
      }
    } catch (error) {
      console.error('更新社交媒体源失败:', error);
      alert('更新失败');
    }
  };

  const handleDeleteSource = async (id: string) => {
    if (!confirm('确定要删除这个社交媒体源吗？这将同时删除所有相关的帖子。')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/social-sources?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        loadSources();
        alert('删除成功');
      } else {
        alert(result.message || '删除失败');
      }
    } catch (error) {
      console.error('删除社交媒体源失败:', error);
      alert('删除失败');
    }
  };

  const handleSyncSource = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/social-sources/${id}?action=sync`, {
        method: 'POST'
      });

      const result = await response.json();
      alert(result.message);
      
      if (result.success) {
        loadSources();
        loadPosts();
      }
    } catch (error) {
      console.error('同步失败:', error);
      alert('同步失败');
    }
  };

  const handleTestSource = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/social-sources/${id}?action=test`, {
        method: 'POST'
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('测试失败:', error);
      alert('测试失败');
    }
  };

  const handleConvertPosts = async (postIds: string[]) => {
    try {
      const response = await fetch('/api/admin/social-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'convert_to_news', postIds })
      });

      const result = await response.json();
      alert(result.message);
      
      if (result.success) {
        loadPosts();
      }
    } catch (error) {
      console.error('转换失败:', error);
      alert('转换失败');
    }
  };

  const handleSchedulerAction = async (action: string) => {
    try {
      const response = await fetch('/api/admin/social-scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      const result = await response.json();
      alert(result.message);
      
      if (result.success) {
        loadSchedulerStatus();
        if (action === 'sync_all') {
          loadSources();
          loadPosts();
        }
      }
    } catch (error) {
      console.error('调度器操作失败:', error);
      alert('操作失败');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      platform: '',
      username: '',
      accessToken: '',
      webhookUrl: '',
      isActive: true,
      syncInterval: 3600,
      config: '{}'
    });
  };

  const openEditDialog = (source: SocialSource) => {
    setSelectedSource(source);
    setFormData({
      name: source.name,
      platform: source.platform,
      username: source.username || '',
      accessToken: '', // 出于安全考虑，不显示现有token
      webhookUrl: '',
      isActive: source.isActive,
      syncInterval: source.syncInterval,
      config: JSON.stringify(source.config || {}, null, 2)
    });
    setIsEditDialogOpen(true);
  };

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return 'bg-pink-500';
      case 'wechat': return 'bg-green-500';
      case 'weibo': return 'bg-red-500';
      case 'twitter': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 调度器状态 */}
      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Settings className="h-5 w-5" />
            社交媒体调度器
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            管理自动抓取任务的调度器状态
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={schedulerStatus?.isRunning ? 'default' : 'secondary'}>
                {schedulerStatus?.isRunning ? '运行中' : '已停止'}
              </Badge>
              <span className="text-sm text-gray-600">
                活跃任务: {schedulerStatus?.activeTasks || 0}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSchedulerAction('sync_all')}
              >
                <Download className="h-4 w-4 mr-2" />
                同步所有
              </Button>
              <Button
                size="sm"
                variant={schedulerStatus?.isRunning ? 'secondary' : 'primary'}
                onClick={() => handleSchedulerAction(schedulerStatus?.isRunning ? 'stop' : 'start')}
              >
                {schedulerStatus?.isRunning ? (
                  <><Pause className="h-4 w-4 mr-2" />停止</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" />启动</>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSchedulerAction('restart')}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                重启
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 主要内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sources">社交媒体源</TabsTrigger>
          <TabsTrigger value="posts">抓取内容</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">社交媒体源管理</h3>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  添加源
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>添加社交媒体源</DialogTitle>
                  <DialogDescription>
                    配置新的社交媒体内容源
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">源名称</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="如：公司Instagram"
                      />
                    </div>
                    <div>
                      <Label htmlFor="platform">平台</Label>
                      <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择平台" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="wechat">微信公众号</SelectItem>
                          <SelectItem value="weibo">微博</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">用户名/账号</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="平台用户名"
                      />
                    </div>
                    <div>
                      <Label htmlFor="syncInterval">同步间隔（秒）</Label>
                      <Input
                        id="syncInterval"
                        type="number"
                        value={formData.syncInterval}
                        onChange={(e) => setFormData({ ...formData, syncInterval: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accessToken">访问令牌</Label>
                    <Input
                      id="accessToken"
                      type="password"
                      value={formData.accessToken}
                      onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                      placeholder="API访问令牌"
                    />
                  </div>
                  <div>
                    <Label htmlFor="config">配置（JSON）</Label>
                    <Textarea
                      id="config"
                      value={formData.config}
                      onChange={(e) => setFormData({ ...formData, config: e.target.value })}
                      placeholder='{"autoConvertToNews": true}'
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">启用自动抓取</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleCreateSource}>
                    创建
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {sources.map((source) => (
              <Card key={source.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{source.name}</h4>
                          <Badge className={getPlatformBadgeColor(source.platform)}>
                            {source.platform}
                          </Badge>
                          <Badge variant={source.isActive ? 'default' : 'secondary'}>
                            {source.isActive ? '活跃' : '停用'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          用户名: {source.username || '未设置'} | 
                          帖子数: {source._count.posts} | 
                          同步间隔: {source.syncInterval}秒
                        </p>
                        {source.lastSync && (
                          <p className="text-xs text-gray-500">
                            最后同步: {new Date(source.lastSync).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestSource(source.id)}
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSyncSource(source.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(source)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDeleteSource(source.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">抓取内容管理</h3>
            <Button
              onClick={() => {
                const unprocessedIds = posts
                  .filter(post => !post.isProcessed)
                  .map(post => post.id)
                  .slice(0, 10);
                if (unprocessedIds.length > 0) {
                  handleConvertPosts(unprocessedIds);
                } else {
                  alert('没有未处理的帖子');
                }
              }}
            >
              批量转换为新闻
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>平台</TableHead>
                <TableHead>标题/内容</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>发布时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Badge className={getPlatformBadgeColor(post.platform)}>
                      {post.platform}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium truncate">
                        {post.title || '无标题'}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {post.content.substring(0, 100)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{post.source.name}</TableCell>
                  <TableCell>
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.isProcessed ? 'default' : 'secondary'}>
                      {post.isProcessed ? '已处理' : '未处理'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {!post.isProcessed && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConvertPosts([post.id])}
                      >
                        转换为新闻
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑社交媒体源</DialogTitle>
            <DialogDescription>
              修改社交媒体源配置
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">源名称</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-platform">平台</Label>
                <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="wechat">微信公众号</SelectItem>
                    <SelectItem value="weibo">微博</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-username">用户名/账号</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-syncInterval">同步间隔（秒）</Label>
                <Input
                  id="edit-syncInterval"
                  type="number"
                  value={formData.syncInterval}
                  onChange={(e) => setFormData({ ...formData, syncInterval: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-accessToken">访问令牌（留空保持不变）</Label>
              <Input
                id="edit-accessToken"
                type="password"
                value={formData.accessToken}
                onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                placeholder="留空保持现有令牌不变"
              />
            </div>
            <div>
              <Label htmlFor="edit-config">配置（JSON）</Label>
              <Textarea
                id="edit-config"
                value={formData.config}
                onChange={(e) => setFormData({ ...formData, config: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">启用自动抓取</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdateSource}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}