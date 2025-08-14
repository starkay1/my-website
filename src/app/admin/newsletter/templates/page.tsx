'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Send, 
  Eye, 
  Power, 
  PowerOff,
  Calendar,
  User,
  Mail,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import EmailTemplateEditor from '@/components/admin/EmailTemplateEditor';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'newsletter' | 'welcome' | 'notification' | 'promotional';
  variables: string[];
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  updatedBy: {
    id: string;
    name: string;
    email: string;
  };
}

interface TemplateStats {
  total: number;
  active: number;
  inactive: number;
  byType: Record<string, number>;
}

const TEMPLATE_TYPES = [
  { value: 'all', label: '全部类型' },
  { value: 'newsletter', label: '新闻通讯' },
  { value: 'welcome', label: '欢迎邮件' },
  { value: 'notification', label: '通知邮件' },
  { value: 'promotional', label: '推广邮件' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: '全部状态' },
  { value: 'active', label: '已启用' },
  { value: 'inactive', label: '已禁用' },
];

/**
 * 邮件模板管理页面
 */
export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [stats, setStats] = useState<TemplateStats>({
    total: 0,
    active: 0,
    inactive: 0,
    byType: {},
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  // 获取模板列表
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        search: searchQuery,
        type: typeFilter === 'all' ? '' : typeFilter,
        status: statusFilter === 'all' ? '' : statusFilter,
      });

      const response = await fetch(`/api/admin/newsletter/templates?${params}`);
      const data = await response.json();

      if (data.success) {
        setTemplates(data.data.templates);
        setStats(data.data.stats);
        setTotalPages(Math.ceil(data.data.pagination.total / pageSize));
      } else {
        console.error('Failed to fetch templates:', data.message);
      }
    } catch (error) {
      console.error('Fetch templates error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 创建/更新模板
  const handleSaveTemplate = async (templateData: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    try {
      const url = editingTemplate 
        ? `/api/admin/newsletter/templates/${editingTemplate.id}`
        : '/api/admin/newsletter/templates';
      
      const method = editingTemplate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      const data = await response.json();

      if (data.success) {
        setShowEditor(false);
        setEditingTemplate(undefined);
        fetchTemplates();
      } else {
        alert(`保存失败：${data.message}`);
      }
    } catch (error) {
      console.error('Save template error:', error);
      alert('保存模板失败');
    }
  };

  // 删除模板
  const handleDeleteTemplate = async (id: string) => {
    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/newsletter/templates/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setShowDeleteConfirm(null);
        fetchTemplates();
      } else {
        alert(`删除失败：${data.message}`);
      }
    } catch (error) {
      console.error('Delete template error:', error);
      alert('删除模板失败');
    } finally {
      setActionLoading(null);
    }
  };

  // 切换模板状态
  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/newsletter/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      const data = await response.json();

      if (data.success) {
        fetchTemplates();
      } else {
        alert(`操作失败：${data.message}`);
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      alert('操作失败');
    } finally {
      setActionLoading(null);
    }
  };

  // 复制模板
  const handleCopyTemplate = async (template: EmailTemplate) => {
    const newTemplate = {
      ...template,
      name: `${template.name} - 副本`,
      isActive: false,
    };
    delete (newTemplate as any).id;
    delete (newTemplate as any).createdAt;
    delete (newTemplate as any).updatedAt;
    delete (newTemplate as any).createdBy;
    delete (newTemplate as any).updatedBy;
    
    await handleSaveTemplate(newTemplate);
  };

  // 批量操作
  const handleBatchAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedTemplates.length === 0) {
      alert('请选择要操作的模板');
      return;
    }

    const confirmMessage = {
      activate: '确定要启用选中的模板吗？',
      deactivate: '确定要禁用选中的模板吗？',
      delete: '确定要删除选中的模板吗？此操作不可恢复！',
    }[action];

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/newsletter/templates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          templateIds: selectedTemplates,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedTemplates([]);
        fetchTemplates();
      } else {
        alert(`操作失败：${data.message}`);
      }
    } catch (error) {
      console.error('Batch action error:', error);
      alert('批量操作失败');
    }
  };

  // 获取类型标签
  const getTypeLabel = (type: string) => {
    const typeOption = TEMPLATE_TYPES.find(t => t.value === type);
    return typeOption ? typeOption.label : type;
  };

  // 获取类型颜色
  const getTypeColor = (type: string) => {
    const colors = {
      newsletter: 'bg-blue-100 text-blue-800',
      welcome: 'bg-green-100 text-green-800',
      notification: 'bg-yellow-100 text-yellow-800',
      promotional: 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    fetchTemplates();
  }, [currentPage, searchQuery, typeFilter, statusFilter]);

  if (showEditor) {
    return (
      <EmailTemplateEditor
        template={editingTemplate}
        onSave={handleSaveTemplate}
        onCancel={() => {
          setShowEditor(false);
          setEditingTemplate(undefined);
        }}
        className="h-screen"
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">邮件模板管理</h1>
          <p className="text-neutral-600 mt-1">管理和编辑邮件模板</p>
        </div>
        
        <button
          onClick={() => {
            setEditingTemplate(undefined);
            setShowEditor(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          创建模板
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">总模板数</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">已启用</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">已禁用</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">新闻通讯</p>
              <p className="text-2xl font-bold text-blue-600">{stats.byType.newsletter || 0}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索模板名称、主题或描述..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {TEMPLATE_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* 批量操作 */}
        {selectedTemplates.length > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-200">
            <span className="text-sm text-neutral-600">
              已选择 {selectedTemplates.length} 个模板
            </span>
            <button
              onClick={() => handleBatchAction('activate')}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              批量启用
            </button>
            <button
              onClick={() => handleBatchAction('deactivate')}
              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              批量禁用
            </button>
            <button
              onClick={() => handleBatchAction('delete')}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              批量删除
            </button>
            <button
              onClick={() => setSelectedTemplates([])}
              className="px-3 py-1 text-sm bg-neutral-600 text-white rounded hover:bg-neutral-700"
            >
              取消选择
            </button>
          </div>
        )}
      </div>

      {/* 模板列表 */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">暂无模板</h3>
            <p className="text-neutral-600 mb-4">还没有创建任何邮件模板</p>
            <button
              onClick={() => {
                setEditingTemplate(undefined);
                setShowEditor(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              创建第一个模板
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedTemplates.length === templates.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTemplates(templates.map(t => t.id));
                          } else {
                            setSelectedTemplates([]);
                          }
                        }}
                        className="rounded border-neutral-300 text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-900">模板信息</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-900">类型</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-900">状态</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-900">创建信息</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-900">更新信息</th>
                    <th className="w-24 px-4 py-3 text-sm font-medium text-neutral-900">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {templates.map((template) => (
                    <tr key={template.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedTemplates.includes(template.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTemplates(prev => [...prev, template.id]);
                            } else {
                              setSelectedTemplates(prev => prev.filter(id => id !== template.id));
                            }
                          }}
                          className="rounded border-neutral-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <h3 className="font-medium text-neutral-900">{template.name}</h3>
                          <p className="text-sm text-neutral-600 mt-1">{template.subject}</p>
                          {template.description && (
                            <p className="text-xs text-neutral-500 mt-1">{template.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getTypeColor(template.type)
                        )}>
                          {getTypeLabel(template.type)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            template.isActive ? 'bg-green-500' : 'bg-red-500'
                          )} />
                          <span className={cn(
                            'text-sm font-medium',
                            template.isActive ? 'text-green-700' : 'text-red-700'
                          )}>
                            {template.isActive ? '已启用' : '已禁用'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="text-neutral-900">{template.createdBy.name}</p>
                          <p className="text-neutral-500">
                            {new Date(template.createdAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="text-neutral-900">{template.updatedBy.name}</p>
                          <p className="text-neutral-500">
                            {new Date(template.updatedAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingTemplate(template);
                              setShowEditor(true);
                            }}
                            className="p-1 text-neutral-600 hover:text-blue-600 transition-colors"
                            title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleCopyTemplate(template)}
                            className="p-1 text-neutral-600 hover:text-green-600 transition-colors"
                            title="复制"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleToggleStatus(template.id, template.isActive)}
                            disabled={actionLoading === template.id}
                            className={cn(
                              'p-1 transition-colors',
                              template.isActive
                                ? 'text-neutral-600 hover:text-red-600'
                                : 'text-neutral-600 hover:text-green-600'
                            )}
                            title={template.isActive ? '禁用' : '启用'}
                          >
                            {actionLoading === template.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : template.isActive ? (
                              <PowerOff className="w-4 h-4" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => setShowDeleteConfirm(template.id)}
                            className="p-1 text-neutral-600 hover:text-red-600 transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200">
                <div className="text-sm text-neutral-600">
                  第 {currentPage} 页，共 {totalPages} 页
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 删除确认弹窗 */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900">确认删除</h3>
                  <p className="text-sm text-neutral-600">此操作不可恢复</p>
                </div>
              </div>
              
              <p className="text-neutral-700 mb-6">
                确定要删除这个邮件模板吗？删除后将无法恢复。
              </p>
              
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDeleteTemplate(showDeleteConfirm)}
                  disabled={actionLoading === showDeleteConfirm}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {actionLoading === showDeleteConfirm ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}