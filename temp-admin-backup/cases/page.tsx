'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Calendar, MapPin, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Case {
  id: string;
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
  publishedAt: string;
  coverImage: string;
  gallery: string[];
  tags: string[];
  category: string;
  overviewChallenge: string;
  overviewSolution: string;
  overviewResults: string;
  createdAt: string;
  updatedAt: string;
}

interface CasesResponse {
  success: boolean;
  data: {
    items: Case[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // 获取案例列表
  const fetchCases = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search })
      });
      
      const response = await fetch(`/api/admin/cases?${params}`);
      const result: CasesResponse = await response.json();
      
      if (result.success) {
        setCases(result.data.items);
        setTotal(result.data.total);
        setTotalPages(Math.ceil(result.data.total / pageSize));
        setCurrentPage(result.data.page);
      }
    } catch (error) {
      console.error('获取案例失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除案例
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个案例吗？')) return;
    
    try {
      const response = await fetch(`/api/admin/cases?id=${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        fetchCases(currentPage, searchTerm);
      } else {
        alert('删除失败: ' + result.message);
      }
    } catch (error) {
      console.error('删除案例失败:', error);
      alert('删除失败');
    }
  };

  // 搜索处理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCases(1, searchTerm);
  };

  // 分页处理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCases(page, searchTerm);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">案例管理</h1>
          <p className="text-gray-600 mt-1">管理项目案例和作品展示</p>
        </div>
        <Link href="/admin/cases/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            添加案例
          </Button>
        </Link>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="搜索案例标题、客户或行业..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              搜索
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 案例列表 */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              加载中...
            </div>
          ) : cases.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              暂无案例数据
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">案例信息</th>
                    <th className="text-left p-4 font-medium text-gray-900">客户</th>
                    <th className="text-left p-4 font-medium text-gray-900">行业</th>
                    <th className="text-left p-4 font-medium text-gray-900">状态</th>
                    <th className="text-left p-4 font-medium text-gray-900">发布时间</th>
                    <th className="text-left p-4 font-medium text-gray-900">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((caseItem) => (
                    <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            {caseItem.coverImage ? (
                              <Image
                                src={caseItem.coverImage}
                                alt={caseItem.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Eye className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 line-clamp-1">
                              {caseItem.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                              {caseItem.subtitle}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {caseItem.featured && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  精选
                                </span>
                              )}
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {caseItem.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{caseItem.client}</div>
                          <div className="text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {caseItem.location}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-900">{caseItem.industry}</span>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          caseItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                          caseItem.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        )}>
                          {caseItem.status === 'completed' ? '已完成' :
                           caseItem.status === 'in-progress' ? '进行中' : '草稿'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(caseItem.publishedAt).toLocaleDateString('zh-CN')}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/cases/${caseItem.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              编辑
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(caseItem.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            删除
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            共 {total} 条记录，第 {currentPage} / {totalPages} 页
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              上一页
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}