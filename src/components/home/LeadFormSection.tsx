'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Phone, Mail, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG, COUNTRIES, PROJECT_STAGES } from '@/lib/constants';
import { Input, Textarea, Button } from '@/components/ui';
import { useFormState } from '@/hooks';
import type { ComponentProps, ContactFormData } from '@/types';
import { contactApi } from '@/lib/api';
import { isValidEmail, isValidPhone } from '@/lib/utils';

interface LeadFormSectionProps extends ComponentProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

interface LeadFormData {
  name: string;
  country: string;
  contact: string;
  projectStage: string;
  message: string;
  privacyConsent: boolean;
}

const LeadFormSection: React.FC<LeadFormSectionProps> = ({
  onSubmit,
  className,
  ...props
}) => {
  const {
    values,
    errors,
    setValue,
    setError,
    reset,
    isValid
  } = useFormState<LeadFormData>({
    name: '',
    country: '',
    contact: '',
    projectStage: '',
    message: '',
    privacyConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 输入框变化处理器
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setValue(name as keyof LeadFormData, type === 'checkbox' ? checked : value);
    
    // Clear error when user starts typing
    if (errors[name as keyof LeadFormData]) {
      setError(name as keyof LeadFormData, null);
    }
  };

  const validateForm = (): boolean => {
    let hasErrors = false;

    // 验证姓名
    if (!values.name.trim()) {
      setError('name', '请输入您的姓名');
      hasErrors = true;
    }

    // 验证国家
    if (!values.country) {
      setError('country', '请选择国家/地区');
      hasErrors = true;
    }

    // 验证联系方式
    if (!values.contact.trim()) {
      setError('contact', '请输入联系方式');
      hasErrors = true;
    } else {
      const contact = values.contact.trim();
      const isEmail = contact.includes('@');
      const isPhone = /^[\d\s\-\+\(\)]+$/.test(contact);
      
      if (isEmail && !isValidEmail(contact)) {
        setError('contact', '请输入有效的邮箱地址');
        hasErrors = true;
      } else if (isPhone && !isValidPhone(contact)) {
        setError('contact', '请输入有效的手机号码');
        hasErrors = true;
      } else if (!isEmail && !isPhone) {
        setError('contact', '请输入有效的邮箱或手机号码');
        hasErrors = true;
      }
    }

    // 验证项目阶段
    if (!values.projectStage) {
      setError('projectStage', '请选择项目阶段');
      hasErrors = true;
    }

    // 验证项目描述
    if (!values.message.trim()) {
      setError('message', '请描述您的项目需求');
      hasErrors = true;
    } else if (values.message.trim().length < 10) {
      setError('message', '项目描述至少需要10个字符');
      hasErrors = true;
    }

    // 验证隐私同意
    if (!values.privacyConsent) {
      setError('privacyConsent', '请同意隐私政策');
      hasErrors = true;
    }

    return !hasErrors;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 验证表单
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 构造 ContactFormData，智能分割联系方式
      const contact = values.contact.trim();
      const isEmail = contact.includes('@');
      
      const contactData: ContactFormData = {
        name: values.name,
        email: isEmail ? contact : '',
        phone: isEmail ? '' : contact,
        message: `项目阶段: ${values.projectStage}\n国家/地区: ${values.country}\n\n${values.message}`,
        privacyConsent: values.privacyConsent,
      };

      // 调用 API
      const response = await contactApi.submit(contactData);
      
      if (response.success) {
        setSubmitStatus('success');
        
        // 重置表单
        setTimeout(() => {
          reset();
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = values.name && values.country && values.contact && values.projectStage && values.privacyConsent;

  return (
    <section 
      className={cn(
        'aspect-mobile lg:aspect-16-9 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center',
        className
      )}
      {...props}
    >
      <div className="responsive-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: ANIMATION_CONFIG.duration.normal,
              ease: ANIMATION_CONFIG.easing.easeOut
            }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                开启您的项目之旅
              </span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
              告诉我们您的项目需求，我们将在 24 小时内为您提供专业的解决方案建议
            </p>

            {/* Contact Methods */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-2xl shadow-lg border border-primary-200 dark:border-primary-700 flex items-center justify-center">
                  <Phone className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">电话咨询</div>
                  <div className="text-neutral-600 dark:text-neutral-300">+65 8888 8888</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900 dark:to-secondary-800 rounded-2xl shadow-lg border border-secondary-200 dark:border-secondary-700 flex items-center justify-center">
                  <MessageSquare className="text-secondary-600 dark:text-secondary-400" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">WhatsApp</div>
                  <div className="text-neutral-600 dark:text-neutral-300">即时沟通，快速响应</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-2xl shadow-lg border border-primary-200 dark:border-primary-700 flex items-center justify-center">
                  <Mail className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">邮件联系</div>
                  <div className="text-neutral-600 dark:text-neutral-300">hello@spaceplus.com</div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">24h</div>
                  <div className="text-neutral-600 dark:text-neutral-300 text-sm font-medium">快速响应</div>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-700 bg-clip-text text-transparent">100%</div>
                  <div className="text-neutral-600 dark:text-neutral-300 text-sm font-medium">信息保密</div>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">免费</div>
                  <div className="text-neutral-600 dark:text-neutral-300 text-sm font-medium">初步咨询</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: ANIMATION_CONFIG.duration.normal, 
              delay: 0.2,
              ease: ANIMATION_CONFIG.easing.easeOut
            }}
            viewport={{ once: true }}
          >
            <div className="card-ios-elevated">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Name */}
                <Input
                  label="姓名"
                  name="name"
                  value={values.name}
                  onChange={handleInputChange}
                  placeholder="请输入您的姓名"
                  required
                  errorMessage={errors.name}
                  fullWidth
                />

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                    国家/地区 *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={values.country}
                    onChange={handleInputChange}
                    required
                    className={cn(
                      'w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl',
                      'focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200',
                      'text-neutral-900 dark:text-white',
                      errors.country && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    )}
                  >
                    <option value="">请选择国家/地区</option>
                    {COUNTRIES.map((country, index) => (
                      <option key={index} value={country}>{country}</option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="mt-2 text-sm text-red-600">{errors.country}</p>
                  )}
                </div>

                {/* Contact */}
                <Input
                  label="联系方式"
                  name="contact"
                  value={values.contact}
                  onChange={handleInputChange}
                  placeholder="手机号码 / 微信号 / 邮箱"
                  required
                  errorMessage={errors.contact}
                  fullWidth
                />

                {/* Project Stage */}
                <div>
                  <label htmlFor="projectStage" className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                    项目阶段 *
                  </label>
                  <select
                    id="projectStage"
                    name="projectStage"
                    value={values.projectStage}
                    onChange={handleInputChange}
                    required
                    className={cn(
                      'w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl',
                      'focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200',
                      'text-neutral-900 dark:text-white',
                      errors.projectStage && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    )}
                  >
                    <option value="">请选择项目阶段</option>
                    {PROJECT_STAGES.map((stage, index) => (
                      <option key={index} value={stage}>{stage}</option>
                    ))}
                  </select>
                  {errors.projectStage && (
                    <p className="mt-2 text-sm text-red-600">{errors.projectStage}</p>
                  )}
                </div>

                {/* Message */}
                <Textarea
                  label="项目描述"
                  name="message"
                  value={values.message}
                  onChange={handleInputChange}
                  placeholder="请简要描述您的项目情况和需求..."
                  rows={4}
                  errorMessage={errors.message}
                  fullWidth
                />

                {/* Privacy Consent */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacyConsent"
                    name="privacyConsent"
                    checked={values.privacyConsent}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-4 h-4 text-primary-600 bg-neutral-50 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label htmlFor="privacyConsent" className="text-sm text-neutral-600 dark:text-neutral-300">
                    我同意 Spaceplus 收集和处理我的个人信息，用于提供咨询服务。我们承诺严格保护您的隐私信息。
                  </label>
                </div>
                {errors.privacyConsent && (
                  <p className="text-sm text-red-600">{errors.privacyConsent}</p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  fullWidth
                  rightIcon={<Send size={16} />}
                >
                  获取专业方案
                </Button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="flex items-center space-x-2 text-green-400 text-sm">
                    <CheckCircle size={16} />
                    <span>提交成功！我们将在 24 小时内与您联系。</span>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    <span>提交失败，请稍后重试或直接联系我们。</span>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LeadFormSection;