'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Check, X, Mail, Phone, Calendar, FileText, User } from 'lucide-react';
import { Card, CardContent, Button, Input, Badge } from '@/components/ui';

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  applicantName: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
  coverLetter: string;
  expectedSalary: string;
  availableDate: string;
  resumeUrl: string;
  status: 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected';
  appliedAt: string;
  updatedAt: string;
}

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  // 模拟数据
  useEffect(() => {
    const mockApplications: JobApplication[] = [
      {
        id: '1',
        jobId: '1',
        jobTitle: '前端开发工程师',
        department: '技术部',
        applicantName: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138001',
        experience: '3年前端开发经验，熟悉React、Vue等框架',
        education: '本科，计算机科学与技术专业',
        coverLetter: '我对贵公司的前端开发职位非常感兴趣...',
        expectedSalary: '15-20K',
        availableDate: '2024-02-01',
        resumeUrl: '/uploads/resumes/zhangsan_resume.pdf',
        status: 'pending',
        appliedAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        jobId: '2',
        jobTitle: 'UI/UX设计师',
        department: '设计部',
        applicantName: '李四',
        email: 'lisi@example.com',
        phone: '13800138002',
        experience: '5年UI设计经验，擅长移动端和Web设计',
        education: '本科，视觉传达设计专业',
        coverLetter: '我有丰富的设计经验，希望能加入贵公司...',
        expectedSalary: '12-18K',
        availableDate: '2024-01-25',
        resumeUrl: '/uploads/resumes/lisi_resume.pdf',
        status: 'reviewing',
        appliedAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-16T09:15:00Z'
      },
      {
        id: '3',
        jobId: '1',
        jobTitle: '前端开发工程师',
        department: '技术部',
        applicantName: '王五',
        email: 'wangwu@example.com',
        phone: '13800138003',
        experience: '2年前端开发经验，熟悉React、TypeScript',
        education: '本科，软件工程专业',
        coverLetter: '我对前端技术充满热情，希望能在贵公司发展...',
        expectedSalary: '10-15K',
        availableDate: '2024-02-15',
        resumeUrl: '/uploads/resumes/wangwu_resume.pdf',
        status: 'interviewed',
        appliedAt: '2024-01-13T16:45:00Z',
        updatedAt: '2024-01-18T11:30:00Z'
      }
    ];
    
    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  // 筛选申请
  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchTerm || 
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || app.status === selectedStatus;
    const matchesDepartment = !selectedDepartment || app.department === selectedDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // 获取所有部门
  const departments = Array.from(new Set(applications.map(app => app.department))).sort();

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'reviewing': 'bg-blue-100 text-blue-800',
      'interviewed': 'bg-purple-100 text-purple-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const texts = {
      'pending': '待处理',
      'reviewing': '审核中',
      'interviewed': '已面试',
      'accepted': '已录用',
      'rejected': '已拒绝'
    };
    return texts[status as keyof typeof texts] || status;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 更新申请状态
  const updateApplicationStatus = (id: string, newStatus: JobApplication['status']) => {
    setApplications(prev => prev.map(app => 
      app.id === id 
        ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
        : app
    ));
  };

  // 清除筛选
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedDepartment('');
  };

  // 下载简历
  const downloadResume = (resumeUrl: string, applicantName: string) => {
    // 模拟下载
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = `${applicantName}_简历.pdf`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">申请管理</h1>
          <p className="text-gray-600">管理和处理职位申请</p>
        </div>

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="搜索申请人、职位或邮箱..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* 筛选按钮 */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>
            
            {/* 筛选选项 */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">所有状态</option>
                    <option value="pending">待处理</option>
                    <option value="reviewing">审核中</option>
                    <option value="interviewed">已面试</option>
                    <option value="accepted">已录用</option>
                    <option value="rejected">已拒绝</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">部门</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">所有部门</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    清除筛选
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
              <div className="text-sm text-gray-600">总申请</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(app => app.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">待处理</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {applications.filter(app => app.status === 'reviewing').length}
              </div>
              <div className="text-sm text-gray-600">审核中</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {applications.filter(app => app.status === 'interviewed').length}
              </div>
              <div className="text-sm text-gray-600">已面试</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'accepted').length}
              </div>
              <div className="text-sm text-gray-600">已录用</div>
            </CardContent>
          </Card>
        </div>

        {/* 申请列表 */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无申请</h3>
                <p className="text-gray-600">没有找到匹配的申请记录</p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {application.applicantName}
                        </h3>
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusText(application.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span className="font-medium">申请职位:</span>
                            <span>{application.jobTitle}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="font-medium">邮箱:</span>
                            <span>{application.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span className="font-medium">电话:</span>
                            <span>{application.phone}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">申请时间:</span>
                            <span>{formatDate(application.appliedAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">期望薪资:</span>
                            <span>{application.expectedSalary || '面议'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">可入职时间:</span>
                            <span>{application.availableDate ? new Date(application.availableDate).toLocaleDateString('zh-CN') : '随时'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium">工作经验:</span> {application.experience}
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-6 flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        查看详情
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadResume(application.resumeUrl, application.applicantName)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        下载简历
                      </Button>
                      
                      {application.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => updateApplicationStatus(application.id, 'reviewing')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                            className="text-red-600 border-red-300 hover:bg-red-50 px-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 申请详情模态框 */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">申请详情</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedApplication(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">申请人</label>
                    <p className="text-gray-900">{selectedApplication.applicantName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">申请职位</label>
                    <p className="text-gray-900">{selectedApplication.jobTitle}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <p className="text-gray-900">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                    <p className="text-gray-900">{selectedApplication.phone}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">工作经验</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedApplication.experience}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">教育背景</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedApplication.education}</p>
                </div>
                
                {selectedApplication.coverLetter && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">求职信</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                  </div>
                )}
                
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => downloadResume(selectedApplication.resumeUrl, selectedApplication.applicantName)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    查看简历
                  </Button>
                  
                  <div className="flex gap-2">
                    <select
                      value={selectedApplication.status}
                      onChange={(e) => {
                        updateApplicationStatus(selectedApplication.id, e.target.value as JobApplication['status']);
                        setSelectedApplication(prev => prev ? { ...prev, status: e.target.value as JobApplication['status'] } : null);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">待处理</option>
                      <option value="reviewing">审核中</option>
                      <option value="interviewed">已面试</option>
                      <option value="accepted">已录用</option>
                      <option value="rejected">已拒绝</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;