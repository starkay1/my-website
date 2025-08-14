'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Content {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  type: 'page' | 'post' | 'service' | 'case_study' | 'news';
  locale: 'en' | 'zh-CN' | 'th';
  featuredImage?: string;
  tags: string[];
  categories: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

interface ContentListProps {
  onEdit?: (content: Content) => void;
  onView?: (content: Content) => void;
}

const statusLabels = {
  draft: '草稿',
  published: '已发布',
  archived: '已归档',
};

const statusColors = {
  draft: 'secondary',
  published: 'default',
  archived: 'outline',
} as const;

const typeLabels = {
  page: '页面',
  post: '文章',
  service: '服务',
  case_study: '案例研究',
  news: '新闻',
};

const localeLabels = {
  en: 'English',
  'zh-CN': '中文',
  th: 'ไทย',
};

export default function ContentList({ onEdit, onView }: ContentListProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [localeFilter, setLocaleFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();

  const itemsPerPage = 10;

  useEffect(() => {
    loadContents();
  }, [currentPage, searchTerm, statusFilter, typeFilter, localeFilter]);

  const loadContents = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(localeFilter !== 'all' && { locale: localeFilter }),
      });

      const response = await fetch(`/api/cms/content?${params}`);
      if (response.ok) {
        const data = await response.json();
        setContents(data.contents);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      } else {
        setError('加载内容失败');
      }
    } catch (err) {
      setError('加载内容失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个内容吗？此操作不可撤销。')) {
      return;
    }

    try {
      const response = await fetch(`/api/cms/content/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadContents(); // 重新加载列表
      } else {
        setError('删除失败');
      }
    } catch (err) {
      setError('删除失败');
    }
  };

  const handleEdit = (content: Content) => {
    if (onEdit) {
      onEdit(content);
    } else {
      router.push(`/admin/cms/content/${content.id}`);
    }
  };

  const handleView = (content: Content) => {
    if (onView) {
      onView(content);
    } else {
      // 根据内容类型和语言构建预览 URL
      const baseUrl = content.locale === 'en' ? '' : `/${content.locale}`;
      const typeUrl = content.type === 'page' ? '' : `/${content.type}`;
      window.open(`${baseUrl}${typeUrl}/${content.slug}`, '_blank');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setLocaleFilter('all');
    setCurrentPage(1);
  };

  if (loading && contents.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">内容管理</h1>
          <p className="text-gray-600 mt-1">
            共 {totalCount} 个内容项
          </p>
        </div>
        <Button onClick={() => router.push('/admin/cms/content/new')}>
          <Plus className="w-4 h-4 mr-2" />
          创建内容
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 搜索和过滤器 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            搜索和过滤
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索标题、内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="published">已发布</SelectItem>
                <SelectItem value="archived">已归档</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有类型</SelectItem>
                <SelectItem value="page">页面</SelectItem>
                <SelectItem value="post">文章</SelectItem>
                <SelectItem value="service">服务</SelectItem>
                <SelectItem value="case_study">案例研究</SelectItem>
                <SelectItem value="news">新闻</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={localeFilter} onValueChange={setLocaleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="语言" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有语言</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh-CN">中文</SelectItem>
                <SelectItem value="th">ไทย</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={resetFilters}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 内容列表 */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>语言</TableHead>
                <TableHead>作者</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{content.title}</div>
                      {content.excerpt && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {content.excerpt}
                        </div>
                      )}
                      {content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {content.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {content.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{content.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {typeLabels[content.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[content.status]}>
                      {statusLabels[content.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {localeLabels[content.locale]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{content.author.name}</div>
                      <div className="text-gray-500">{content.author.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(content.updatedAt).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {content.status === 'published' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(content)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(content)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(content.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {contents.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">没有找到内容</div>
              <Button onClick={() => router.push('/admin/cms/content/new')}>
                <Plus className="w-4 h-4 mr-2" />
                创建第一个内容
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            显示第 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} 项，共 {totalCount} 项
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="px-2">...</span>
                  <Button
                    variant={currentPage === totalPages ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}