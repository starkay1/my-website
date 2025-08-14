'use client';

import { motion } from 'framer-motion';
import { Send, User, Mail, Phone, Building, MessageSquare, FileText, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Button, Card, CardContent } from '@/components/ui';
import type { ComponentProps } from '@/types';

import { contactApi } from '@/lib/api';
import type { ContactFormData } from '@/types';

interface ContactFormProps extends ComponentProps {}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  agreement: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactForm({ className }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: '',
    agreement: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    { value: 'project-management', label: '项目托管管理' },
    { value: 'brand-consulting', label: '品牌战略顾问' },
    { value: 'brand-incubation', label: '品牌孵化服务' },
    { value: 'digital-transformation', label: '数字化转型' },
    { value: 'marketing-strategy', label: '营销策略' },
    { value: 'other', label: '其他服务' }
  ];

  const budgetRanges = [
    { value: '10k-50k', label: '1万 - 5万' },
    { value: '50k-100k', label: '5万 - 10万' },
    { value: '100k-500k', label: '10万 - 50万' },
    { value: '500k+', label: '50万以上' },
    { value: 'discuss', label: '面议' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入您的姓名';
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '请输入联系电话';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的电话号码';
    }

    if (!formData.service) {
      newErrors.service = '请选择服务类型';
    }

    if (!formData.message.trim()) {
      newErrors.message = '请描述您的需求';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = '需求描述至少需要10个字符';
    }

    if (!formData.agreement) {
      newErrors.agreement = '请同意隐私政策';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 将表单数据转换为 ContactFormData 格式
      const contactData: ContactFormData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        privacyConsent: formData.agreement,
      };

      // 调用实际的 API
      const response = await contactApi.submit(contactData);
      
      if (response.success) {
        setIsSubmitted(true);
        
        // Reset form after success
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            service: '',
            budget: '',
            message: '',
            agreement: false
          });
          setIsSubmitted(false);
        }, 3000);
      } else {
        // 处理 API 错误
        setErrors({ submit: response.message || '提交失败，请稍后重试' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: '网络错误，请检查连接后重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={ANIMATION_CONFIG.smooth}
        className={className}
      >
        <Card variant="elevated" className="text-center p-12">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            提交成功！
          </h3>
          <p className="text-gray-600 mb-6">
            感谢您的咨询，我们的专业顾问将在2个工作小时内与您联系。
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              💡 在等待期间，您可以浏览我们的案例研究或下载相关资料
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={ANIMATION_CONFIG.smooth}
      viewport={{ once: true }}
      className={className}
    >
      <Card variant="elevated">
        <CardContent className="p-8">
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              开始您的项目
            </h2>
            <p className="text-gray-600">
              填写下方表单，我们的专业顾问将为您提供定制化解决方案
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓名 *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={cn(
                      'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300',
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    )}
                    placeholder="请输入您的姓名"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱 *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={cn(
                      'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300',
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    )}
                    placeholder="请输入邮箱地址"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Phone & Company Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  联系电话 *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={cn(
                      'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300',
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    )}
                    placeholder="请输入联系电话"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司名称
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="请输入公司名称（可选）"
                  />
                </div>
              </div>
            </div>

            {/* Service & Budget Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  服务类型 *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => handleInputChange('service', e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300',
                    errors.service ? 'border-red-500' : 'border-gray-300'
                  )}
                >
                  <option value="">请选择服务类型</option>
                  {services.map(service => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.service}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  预算范围
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">请选择预算范围（可选）</option>
                  {budgetRanges.map(budget => (
                    <option key={budget.value} value={budget.value}>
                      {budget.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                需求描述 *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className={cn(
                    'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none',
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  )}
                  placeholder="请详细描述您的项目需求、目标和期望..."
                />
              </div>
              {errors.message && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.message}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.message.length}/500 字符
              </p>
            </div>

            {/* Agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreement"
                checked={formData.agreement}
                onChange={(e) => handleInputChange('agreement', e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="agreement" className="ml-3 text-sm text-gray-600">
                我已阅读并同意
                <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline mx-1">
                  隐私政策
                </a>
                和
                <a href="/terms" className="text-blue-600 hover:text-blue-800 underline ml-1">
                  服务条款
                </a>
              </label>
            </div>
            {errors.agreement && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.agreement}
              </p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  提交中...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Send className="w-5 h-5 mr-2" />
                  提交咨询
                </div>
              )}
            </Button>

            {/* Help Text */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    提交后会发生什么？
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 我们会在2小时内回复您的咨询</li>
                    <li>• 专业顾问将与您电话沟通具体需求</li>
                    <li>• 为您制定定制化的解决方案</li>
                    <li>• 提供详细的项目报价和时间安排</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}