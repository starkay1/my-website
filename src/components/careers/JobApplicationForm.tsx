'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Send, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, Button, Input } from '@/components/ui';
import { jobsApi } from '@/lib/api';
import type { JobPosition } from '@/types';

interface JobApplicationFormProps {
  job: JobPosition;
  onClose?: () => void;
  className?: string;
}

interface ApplicationFormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
  coverLetter: string;
  expectedSalary: string;
  availableDate: string;
  resume: File | null;
}

interface FormErrors {
  [key: string]: string;
}

export const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  job,
  onClose,
  className = ''
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    coverLetter: '',
    expectedSalary: '',
    availableDate: '',
    resume: null
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // 处理输入变化
  const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 处理文件上传
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 验证文件类型
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, resume: '请上传PDF或Word文档格式的简历' }));
        return;
      }
      
      // 验证文件大小（5MB）
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: '简历文件大小不能超过5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, resume: file }));
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  // 移除文件
  const removeFile = () => {
    setFormData(prev => ({ ...prev, resume: null }));
    setErrors(prev => ({ ...prev, resume: '' }));
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) newErrors.name = '请输入姓名';
    if (!formData.email.trim()) newErrors.email = '请输入邮箱';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    if (!formData.phone.trim()) newErrors.phone = '请输入电话号码';
    if (!formData.experience.trim()) newErrors.experience = '请输入工作经验';
    if (!formData.education.trim()) newErrors.education = '请输入教育背景';
    if (!formData.resume) newErrors.resume = '请上传简历文件';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交申请
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // 创建FormData
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'resume' && value instanceof File) {
          submitData.append(key, value);
        } else if (typeof value === 'string') {
          submitData.append(key, value);
        }
      });
      
      const response = await jobsApi.apply(job.id, submitData);
      
      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage('申请提交成功！我们会尽快与您联系。');
        // 3秒后关闭表单
        setTimeout(() => {
          onClose?.();
        }, 3000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(response.message || '提交失败，请重试');
      }
    } catch (error) {
      console.error('提交申请失败:', error);
      setSubmitStatus('error');
      setSubmitMessage('提交失败，请检查网络连接后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 如果提交成功，显示成功消息
  if (submitStatus === 'success') {
    return (
      <Card className={`max-w-2xl mx-auto ${className}`}>
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">申请提交成功！</h3>
          <p className="text-gray-600 mb-4">{submitMessage}</p>
          <p className="text-sm text-gray-500">页面将自动关闭...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`max-w-4xl mx-auto ${className}`}>
      <CardContent className="p-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">申请职位</h2>
            <p className="text-gray-600 mt-1">{job.title} - {job.department}</p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* 错误提示 */}
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{submitMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名 <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="请输入您的姓名"
                className={errors.name ? 'border-red-300' : ''}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="请输入您的邮箱"
                className={errors.email ? 'border-red-300' : ''}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                电话 <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="请输入您的电话号码"
                className={errors.phone ? 'border-red-300' : ''}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                期望薪资
              </label>
              <Input
                value={formData.expectedSalary}
                onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                placeholder="如：15-20K"
              />
            </div>
          </div>

          {/* 工作经验 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              工作经验 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="请简要描述您的工作经验..."
              rows={4}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.experience ? 'border-red-300' : ''}`}
            />
            {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
          </div>

          {/* 教育背景 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              教育背景 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              placeholder="请描述您的教育背景..."
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.education ? 'border-red-300' : ''}`}
            />
            {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education}</p>}
          </div>

          {/* 求职信 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              求职信
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => handleInputChange('coverLetter', e.target.value)}
              placeholder="请写一封简短的求职信，说明您为什么适合这个职位..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 可入职时间 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              可入职时间
            </label>
            <Input
              type="date"
              value={formData.availableDate}
              onChange={(e) => handleInputChange('availableDate', e.target.value)}
            />
          </div>

          {/* 简历上传 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              简历上传 <span className="text-red-500">*</span>
            </label>
            
            {!formData.resume ? (
              <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${errors.resume ? 'border-red-300' : ''}`}>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">点击上传简历</p>
                <p className="text-sm text-gray-500">支持 PDF、Word 格式，文件大小不超过 5MB</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">{formData.resume.name}</p>
                    <p className="text-sm text-gray-500">
                      {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume}</p>}
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  提交中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  提交申请
                </>
              )}
            </Button>
            
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-8"
              >
                取消
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobApplicationForm;