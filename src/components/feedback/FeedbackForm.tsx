'use client';

import React, { useState } from 'react';
import { Star, Send, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackFormProps {
  contactId?: string;
  variant?: 'default' | 'compact' | 'modal';
  onSubmit?: (feedback: FeedbackData) => void;
  onClose?: () => void;
}

interface FeedbackData {
  contactId?: string;
  rating: number;
  comment: string;
  category: string;
  email?: string;
  name?: string;
}

const FEEDBACK_CATEGORIES = [
  { value: 'service_quality', label: '服务质量' },
  { value: 'response_time', label: '响应速度' },
  { value: 'problem_resolution', label: '问题解决' },
  { value: 'staff_attitude', label: '服务态度' },
  { value: 'website_experience', label: '网站体验' },
  { value: 'other', label: '其他' },
];

const RATING_LABELS = {
  1: '非常不满意',
  2: '不满意',
  3: '一般',
  4: '满意',
  5: '非常满意',
};

export default function FeedbackForm({ 
  contactId, 
  variant = 'default', 
  onSubmit, 
  onClose 
}: FeedbackFormProps) {
  const [formData, setFormData] = useState<FeedbackData>({
    contactId,
    rating: 0,
    comment: '',
    category: '',
    email: '',
    name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.rating === 0) {
      newErrors.rating = '请选择评分';
    }

    if (!formData.category) {
      newErrors.category = '请选择反馈类别';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = '请填写反馈内容';
    } else if (formData.comment.length < 10) {
      newErrors.comment = '反馈内容至少需要10个字符';
    } else if (formData.comment.length > 1000) {
      newErrors.comment = '反馈内容不能超过1000个字符';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        onSubmit?.(formData);
        
        // 3秒后自动关闭或重置
        setTimeout(() => {
          if (onClose) {
            onClose();
          } else {
            setIsSubmitted(false);
            setFormData({
              contactId,
              rating: 0,
              comment: '',
              category: '',
              email: '',
              name: '',
            });
          }
        }, 3000);
      } else {
        setErrors({ submit: result.message || '提交失败，请重试' });
      }
    } catch (error) {
      console.error('提交反馈失败:', error);
      setErrors({ submit: '网络错误，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FeedbackData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderRatingStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`p-1 transition-colors ${
              star <= (hoveredRating || formData.rating)
                ? 'text-yellow-400'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleInputChange('rating', star)}
          >
            <Star 
              className="w-8 h-8" 
              fill={star <= (hoveredRating || formData.rating) ? 'currentColor' : 'none'}
            />
          </button>
        ))}
        {(hoveredRating || formData.rating) > 0 && (
          <span className="ml-2 text-sm text-gray-600">
            {RATING_LABELS[(hoveredRating || formData.rating) as keyof typeof RATING_LABELS]}
          </span>
        )}
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className={`
        ${variant === 'modal' ? 'bg-white p-6 rounded-lg shadow-lg' : ''}
        ${variant === 'compact' ? 'p-4' : 'p-6'}
      `}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            感谢您的反馈！
          </h3>
          <p className="text-gray-600 mb-4">
            您的宝贵意见将帮助我们不断改进服务质量。
          </p>
          {variant === 'modal' && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              关闭
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`
      ${variant === 'modal' ? 'bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto' : ''}
      ${variant === 'compact' ? 'p-4' : 'p-6'}
    `}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h2 className={`font-semibold text-gray-900 ${
            variant === 'compact' ? 'text-lg' : 'text-xl'
          }`}>
            服务反馈
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          您的反馈对我们很重要，请花一分钟时间分享您的体验。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 评分 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            整体满意度 <span className="text-red-500">*</span>
          </label>
          {renderRatingStars()}
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* 反馈类别 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            反馈类别 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">请选择反馈类别</option>
            {FEEDBACK_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* 反馈内容 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            详细反馈 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            placeholder="请详细描述您的体验和建议..."
            rows={variant === 'compact' ? 3 : 4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              errors.comment ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.comment ? (
              <p className="text-sm text-red-600">{errors.comment}</p>
            ) : (
              <p className="text-sm text-gray-500">
                {formData.comment.length}/1000 字符
              </p>
            )}
          </div>
        </div>

        {/* 联系信息（可选） */}
        {variant !== 'compact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名（可选）
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="您的姓名"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱（可选）
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
        )}

        {/* 提交按钮 */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                提交反馈
              </>
            )}
          </button>
          
          {variant === 'modal' && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          )}
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}
      </form>

      {/* 隐私说明 */}
      {variant !== 'compact' && (
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>隐私保护：</strong>您的反馈将用于改进我们的服务质量。我们承诺保护您的隐私，不会将您的个人信息用于其他用途。
          </p>
        </div>
      )}
    </div>
  );
}