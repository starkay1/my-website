"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Input,
  Textarea,
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
} from '@/components/ui';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  User,
  Building,
  Globe,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Target,
} from 'lucide-react';

// 数据类型定义
interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  subject: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'processing' | 'resolved' | 'closed';
  assignedTo?: string;
  source: 'website' | 'email' | 'phone' | 'social' | 'referral';
  customerType: 'individual' | 'business' | 'partner' | 'media';
  tags: string[];
  attachments?: string[];
  replies: ContactReply[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  rating?: number;
  feedback?: string;
}

interface ContactReply {
  id: string;
  contactId: string;
  content: string;
  author: string;
  authorType: 'admin' | 'customer';
  createdAt: string;
  attachments?: string[];
}

interface ContactFilters {
  search: string;
  category: string;
  priority: string;
  status: string;
  assignedTo: string;
  source: string;
  customerType: string;
  dateRange: {
    start: string;
    end: string;
  };
}

interface ContactStats {
  total: number;
  pending: number;
  avgResponseTime: number;
  resolutionRate: number;
  satisfaction: number;
  thisMonth: number;
}

// 预设数据
const categories = [
  { value: 'general', label: '一般咨询', color: 'bg-blue-100 text-blue-800' },
  { value: 'technical', label: '技术支持', color: 'bg-green-100 text-green-800' },
  { value: 'sales', label: '销售咨询', color: 'bg-purple-100 text-purple-800' },
  { value: 'complaint', label: '投诉建议', color: 'bg-red-100 text-red-800' },
  { value: 'partnership', label: '合作洽谈', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'media', label: '媒体采访', color: 'bg-indigo-100 text-indigo-800' },
];

const priorities = [
  { value: 'low', label: '低', color: 'bg-gray-100 text-gray-800', icon: '●' },
  { value: 'medium', label: '中', color: 'bg-blue-100 text-blue-800', icon: '●●' },
  { value: 'high', label: '高', color: 'bg-orange-100 text-orange-800', icon: '●●●' },
  { value: 'urgent', label: '紧急', color: 'bg-red-100 text-red-800', icon: '🔥' },
];

const statuses = [
  { value: 'new', label: '新建', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  { value: 'processing', label: '处理中', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'resolved', label: '已解决', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'closed', label: '已关闭', color: 'bg-gray-100 text-gray-800', icon: UserCheck },
];

const sources = [
  { value: 'website', label: '官网', icon: Globe },
  { value: 'email', label: '邮件', icon: Mail },
  { value: 'phone', label: '电话', icon: Phone },
  { value: 'social', label: '社交媒体', icon: MessageSquare },
  { value: 'referral', label: '推荐', icon: Users },
];

const customerTypes = [
  { value: 'individual', label: '个人客户', icon: User },
  { value: 'business', label: '企业客户', icon: Building },
  { value: 'partner', label: '合作伙伴', icon: Target },
  { value: 'media', label: '媒体机构', icon: Star },
];

const admins = [
  { id: '1', name: '张三', avatar: '/avatars/admin1.jpg' },
  { id: '2', name: '李四', avatar: '/avatars/admin2.jpg' },
  { id: '3', name: '王五', avatar: '/avatars/admin3.jpg' },
];

export default function ContactsPage() {
  // 状态管理
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats>({
    total: 0,
    pending: 0,
    avgResponseTime: 0,
    resolutionRate: 0,
    satisfaction: 0,
    thisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ContactFilters>({
    search: '',
    category: '',
    priority: '',
    status: '',
    assignedTo: '',
    source: '',
    customerType: '',
    dateRange: {
      start: '',
      end: '',
    },
  });
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedContact, setExpandedContact] = useState<string | null>(null);

  // 模拟数据获取
  const fetchContacts = async () => {
    setLoading(true);
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟联系记录数据
      const mockContacts: Contact[] = [
        {
          id: '1',
          name: '张三',
          email: 'zhangsan@example.com',
          phone: '13800138001',
          company: '科技有限公司',
          position: '技术总监',
          subject: '产品技术咨询',
          message: '希望了解贵公司的技术解决方案，特别是在人工智能方面的应用。我们公司正在寻找合适的技术合作伙伴。',
          category: 'technical',
          priority: 'high',
          status: 'processing',
          assignedTo: '1',
          source: 'website',
          customerType: 'business',
          tags: ['AI', '技术合作'],
          replies: [],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T14:20:00Z',
          rating: 5,
        },
        {
          id: '2',
          name: '李四',
          email: 'lisi@example.com',
          subject: '产品价格咨询',
          message: '想了解企业版的价格和功能详情。',
          category: 'sales',
          priority: 'medium',
          status: 'new',
          source: 'email',
          customerType: 'business',
          tags: ['价格', '企业版'],
          replies: [],
          createdAt: '2024-01-14T16:45:00Z',
          updatedAt: '2024-01-14T16:45:00Z',
        },
        {
          id: '3',
          name: '王五',
          email: 'wangwu@example.com',
          phone: '13900139003',
          subject: '服务投诉',
          message: '对上次的服务不满意，希望能够改进。',
          category: 'complaint',
          priority: 'urgent',
          status: 'resolved',
          assignedTo: '2',
          source: 'phone',
          customerType: 'individual',
          tags: ['投诉', '服务质量'],
          replies: [],
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T18:30:00Z',
          resolvedAt: '2024-01-13T18:30:00Z',
          rating: 3,
          feedback: '问题已解决，但响应时间较慢。',
        },
      ];
      
      setContacts(mockContacts);
      setStats({
        total: mockContacts.length,
        pending: mockContacts.filter(c => c.status === 'new' || c.status === 'processing').length,
        avgResponseTime: 2.5,
        resolutionRate: 85,
        satisfaction: 4.2,
        thisMonth: mockContacts.filter(c => new Date(c.createdAt).getMonth() === new Date().getMonth()).length,
      });
    } catch (error) {
      console.error('获取联系记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // 过滤和排序逻辑
  const filteredContacts = useMemo(() => {
    let filtered = contacts.filter(contact => {
      const matchesSearch = !filters.search || 
        contact.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        contact.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        contact.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        contact.message.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = !filters.category || contact.category === filters.category;
      const matchesPriority = !filters.priority || contact.priority === filters.priority;
      const matchesStatus = !filters.status || contact.status === filters.status;
      const matchesAssignedTo = !filters.assignedTo || contact.assignedTo === filters.assignedTo;
      const matchesSource = !filters.source || contact.source === filters.source;
      const matchesCustomerType = !filters.customerType || contact.customerType === filters.customerType;
      
      const matchesDateRange = (!filters.dateRange.start || new Date(contact.createdAt) >= new Date(filters.dateRange.start)) &&
                              (!filters.dateRange.end || new Date(contact.createdAt) <= new Date(filters.dateRange.end));
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus && 
             matchesAssignedTo && matchesSource && matchesCustomerType && matchesDateRange;
    });

    // 排序
    filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof Contact];
      const bValue = b[sortBy as keyof Contact];
      
      // 处理 undefined 值
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [contacts, filters, sortBy, sortOrder]);

  // 分页逻辑
  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredContacts.slice(startIndex, startIndex + pageSize);
  }, [filteredContacts, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredContacts.length / pageSize);

  // 辅助函数
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getPriorityInfo = (priority: string) => {
    return priorities.find(p => p.value === priority) || priorities[0];
  };

  const getStatusInfo = (status: string) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  const getSourceInfo = (source: string) => {
    return sources.find(s => s.value === source) || sources[0];
  };

  const getCustomerTypeInfo = (customerType: string) => {
    return customerTypes.find(ct => ct.value === customerType) || customerTypes[0];
  };

  const getAdminInfo = (adminId: string) => {
    return admins.find(a => a.id === adminId);
  };

  // 联系记录操作
  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === paginatedContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(paginatedContacts.map(c => c.id));
    }
  };

  const handleBatchOperation = async (operation: string) => {
    try {
      // 模拟批量操作
      console.log(`批量操作: ${operation}, 联系记录: ${selectedContacts}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (operation === 'markProcessed') {
        setContacts(prev => prev.map(contact => 
          selectedContacts.includes(contact.id) 
            ? { ...contact, status: 'resolved' as const }
            : contact
        ));
      } else if (operation === 'assign') {
        // 这里应该打开分配对话框
        console.log('打开分配对话框');
      } else if (operation === 'delete') {
        setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact.id)));
      }
      
      setSelectedContacts([]);
    } catch (error) {
      console.error('批量操作失败:', error);
    }
  };

  const handleUpdateStatus = async (contactId: string, newStatus: string) => {
    try {
      setContacts(prev => prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, status: newStatus as any, updatedAt: new Date().toISOString() }
          : contact
      ));
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const handleAssignContact = async (contactId: string, adminId: string) => {
    try {
      setContacts(prev => prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, assignedTo: adminId, updatedAt: new Date().toISOString() }
          : contact
      ));
    } catch (error) {
      console.error('分配联系记录失败:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
    } catch (error) {
      console.error('删除联系记录失败:', error);
    }
  };

  // 导出功能
  const handleExport = () => {
    const csvContent = [
      ['姓名', '邮箱', '电话', '公司', '主题', '分类', '优先级', '状态', '来源', '创建时间'].join(','),
      ...filteredContacts.map(contact => [
        contact.name,
        contact.email || '',
        contact.phone || '',
        contact.company || '',
        contact.subject,
        getCategoryInfo(contact.category).label,
        getPriorityInfo(contact.priority).label,
        getStatusInfo(contact.status).label,
        getSourceInfo(contact.source).label,
        formatTime(contact.createdAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">联系记录管理</h1>
          <p className="text-gray-600">管理和处理客户联系记录</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
          <Button onClick={fetchContacts} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总记录数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">待处理</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均响应时间</p>
                <p className="text-2xl font-bold text-green-600">{stats.avgResponseTime}h</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">解决率</p>
                <p className="text-2xl font-bold text-blue-600">{stats.resolutionRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">满意度</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.satisfaction}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">本月新增</p>
                <p className="text-2xl font-bold text-purple-600">{stats.thisMonth}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索联系记录..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <select 
              value={filters.category} 
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有分类</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select 
              value={filters.priority} 
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有优先级</option>
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
            
            <select 
              value={filters.status} 
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有状态</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                   {status.label}
                 </option>
               ))}
             </select>
            
            <select 
              value={filters.assignedTo} 
              onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有人员</option>
              {admins.map(admin => (
                <option key={admin.id} value={admin.id}>
                  {admin.name}
                </option>
              ))}
            </select>
            
            <select 
              value={filters.source} 
              onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有来源</option>
              {sources.map(source => (
                <option key={source.value} value={source.value}>
                  {source.label}
                </option>
              ))}
            </select>
            
            <select 
              value={filters.customerType} 
              onChange={(e) => setFilters(prev => ({ ...prev, customerType: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有类型</option>
              {customerTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <input
                type="date"
                placeholder="开始日期"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                placeholder="结束日期"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 批量操作 */}
      {selectedContacts.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                已选择 {selectedContacts.length} 条记录
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBatchOperation('markProcessed')}
                >
                  标记为已处理
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBatchOperation('assign')}
                >
                  批量分配
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBatchOperation('delete')}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  批量删除
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 联系记录列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">联系记录列表</h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedContacts.length === paginatedContacts.length && paginatedContacts.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">全选</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">加载中...</span>
            </div>
          ) : paginatedContacts.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">暂无联系记录</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedContacts.map((contact) => {
                const priorityInfo = getPriorityInfo(contact.priority);
                const statusInfo = getStatusInfo(contact.status);
                const categoryInfo = getCategoryInfo(contact.category);
                const sourceInfo = getSourceInfo(contact.source);
                const customerTypeInfo = getCustomerTypeInfo(contact.customerType);
                const assignedAdmin = contact.assignedTo ? getAdminInfo(contact.assignedTo) : null;
                const StatusIcon = statusInfo.icon;
                const SourceIcon = sourceInfo.icon;
                const CustomerTypeIcon = customerTypeInfo.icon;
                
                return (
                  <div key={contact.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => handleSelectContact(contact.id)}
                        className="w-4 h-4"
                      />
                      
                      <div className="flex-1 space-y-3">
                        {/* 联系人信息 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium text-gray-900">{contact.name}</h3>
                            {contact.company && (
                              <span className="text-sm text-gray-600">@ {contact.company}</span>
                            )}
                            {contact.position && (
                              <span className="text-sm text-gray-500">({contact.position})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={priorityInfo.color}>
                              {priorityInfo.icon} {priorityInfo.label}
                            </Badge>
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* 联系方式 */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {contact.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {contact.email}
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                        
                        {/* 主题和内容 */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{contact.subject}</h4>
                          <p className="text-gray-600 text-sm line-clamp-2">{contact.message}</p>
                        </div>
                        
                        {/* 标签和元信息 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={categoryInfo.color}>
                              {categoryInfo.label}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <SourceIcon className="w-3 h-3" />
                              {sourceInfo.label}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <CustomerTypeIcon className="w-3 h-3" />
                              {customerTypeInfo.label}
                            </div>
                            {contact.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatTime(contact.createdAt)}
                            {assignedAdmin && (
                              <>
                                <span>•</span>
                                <User className="w-3 h-3" />
                                {assignedAdmin.name}
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* 评分和反馈 */}
                        {contact.rating && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${
                                    i < contact.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            {contact.feedback && (
                               <span className="text-gray-600">{contact.feedback}</span>
                             )}
                           </div>
                         )}
                       </div>
                       
                       {/* 操作按钮 */}
                       <div className="flex items-center gap-2">
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setExpandedContact(
                             expandedContact === contact.id ? null : contact.id
                           )}
                         >
                           <Eye className="w-4 h-4" />
                         </Button>
                         
                         <div className="relative">
                           <Button 
                             variant="outline" 
                             size="sm"
                             onClick={() => setExpandedContact(expandedContact === contact.id ? null : contact.id)}
                           >
                             <MoreHorizontal className="w-4 h-4" />
                           </Button>
                           {expandedContact === contact.id && (
                             <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                               <button
                                 onClick={() => {
                                   handleUpdateStatus(contact.id, 'processing');
                                   setExpandedContact(null);
                                 }}
                                 className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                               >
                                 <Clock className="w-4 h-4 mr-2" />
                                 标记为处理中
                               </button>
                               <button
                                 onClick={() => {
                                   handleUpdateStatus(contact.id, 'resolved');
                                   setExpandedContact(null);
                                 }}
                                 className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                               >
                                 <CheckCircle className="w-4 h-4 mr-2" />
                                 标记为已解决
                               </button>
                               <button
                                 onClick={() => {
                                   handleUpdateStatus(contact.id, 'closed');
                                   setExpandedContact(null);
                                 }}
                                 className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                               >
                                 <UserCheck className="w-4 h-4 mr-2" />
                                 关闭
                               </button>
                               <hr className="my-1" />
                               {admins.map(admin => (
                                 <button
                                   key={admin.id}
                                   onClick={() => {
                                     handleAssignContact(contact.id, admin.id);
                                     setExpandedContact(null);
                                   }}
                                   className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                 >
                                   <User className="w-4 h-4 mr-2" />
                                   分配给 {admin.name}
                                 </button>
                               ))}
                               <hr className="my-1" />
                               <button
                                 onClick={() => {
                                   handleDeleteContact(contact.id);
                                   setExpandedContact(null);
                                 }}
                                 className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                               >
                                 <Trash2 className="w-4 h-4 mr-2" />
                                 删除
                               </button>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
                     
                     {/* 展开的详细信息 */}
                     {expandedContact === contact.id && (
                       <div className="mt-4 pt-4 border-t">
                         <div className="w-full">
                           <div className="flex border-b">
                             <button
                               onClick={() => setExpandedContact(contact.id + '-details')}
                               className={`px-4 py-2 font-medium ${expandedContact === contact.id + '-details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                             >
                               详细信息
                             </button>
                             <button
                               onClick={() => setExpandedContact(contact.id + '-replies')}
                               className={`px-4 py-2 font-medium ${expandedContact === contact.id + '-replies' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                             >
                               回复记录
                             </button>
                             <button
                               onClick={() => setExpandedContact(contact.id + '-history')}
                               className={`px-4 py-2 font-medium ${expandedContact === contact.id + '-history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                             >
                               操作历史
                             </button>
                           </div>
                           
                           {expandedContact === contact.id + '-details' && (
                             <div className="mt-4 space-y-4">
                               <div className="grid grid-cols-2 gap-4 text-sm">
                                 <div>
                                   <label className="font-medium">完整消息</label>
                                   <p className="mt-1 text-gray-600 whitespace-pre-wrap">{contact.message}</p>
                                 </div>
                                 <div className="space-y-2">
                                   <div>
                                     <label className="font-medium">创建时间</label>
                                     <p className="text-gray-600">{formatTime(contact.createdAt)}</p>
                                   </div>
                                   <div>
                                     <label className="font-medium">更新时间</label>
                                     <p className="text-gray-600">{formatTime(contact.updatedAt)}</p>
                                   </div>
                                   {contact.resolvedAt && (
                                     <div>
                                       <label className="font-medium">解决时间</label>
                                       <p className="text-gray-600">{formatTime(contact.resolvedAt)}</p>
                                     </div>
                                   )}
                                 </div>
                               </div>
                             </div>
                           )}
                           
                           {expandedContact === contact.id + '-replies' && (
                             <div className="mt-4 space-y-4">
                               {contact.replies.length === 0 ? (
                                 <p className="text-gray-600 text-center py-4">暂无回复记录</p>
                               ) : (
                                 contact.replies.map(reply => (
                                   <div key={reply.id} className="border rounded p-3">
                                     <div className="flex items-center justify-between mb-2">
                                       <span className="font-medium">{reply.author}</span>
                                       <span className="text-sm text-gray-500">{formatTime(reply.createdAt)}</span>
                                     </div>
                                     <p className="text-gray-600">{reply.content}</p>
                                   </div>
                                 ))
                               )}
                               
                               {/* 添加回复 */}
                               <div className="border-t pt-4">
                                 <label className="font-medium">添加回复</label>
                                 <Textarea 
                                   placeholder="输入回复内容..."
                                   className="mt-2"
                                 />
                                 <Button className="mt-2" size="sm">
                                   发送回复
                                 </Button>
                               </div>
                             </div>
                           )}
                           
                           {expandedContact === contact.id + '-history' && (
                             <div className="mt-4">
                               <p className="text-gray-600 text-center py-4">操作历史功能开发中...</p>
                             </div>
                           )}
                         </div>
                       </div>
                     )}
                   </div>
                 );
               })}
             </div>
           )}
         </CardContent>
       </Card>

       {/* 分页控制 */}
       {totalPages > 1 && (
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <span className="text-sm text-gray-600">
                   显示 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredContacts.length)} 条，
                   共 {filteredContacts.length} 条记录
                 </span>
                 <select 
                   value={pageSize.toString()} 
                   onChange={(e) => setPageSize(Number(e.target.value))}
                   className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   <option value="10">10</option>
                   <option value="20">20</option>
                   <option value="50">50</option>
                   <option value="100">100</option>
                 </select>
                 <span className="text-sm text-gray-600">条/页</span>
               </div>
               
               <div className="flex items-center gap-2">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => setCurrentPage(1)}
                   disabled={currentPage === 1}
                 >
                   首页
                 </Button>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                   disabled={currentPage === 1}
                 >
                   上一页
                 </Button>
                 <span className="text-sm text-gray-600">
                   第 {currentPage} 页，共 {totalPages} 页
                 </span>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                   disabled={currentPage === totalPages}
                 >
                   下一页
                 </Button>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => setCurrentPage(totalPages)}
                   disabled={currentPage === totalPages}
                 >
                   末页
                 </Button>
               </div>
             </div>
           </CardContent>
         </Card>
       )}
     </div>
   );
 }