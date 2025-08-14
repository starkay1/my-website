'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Mail, Check, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsletterSubscriptionProps {
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
  showPreferences?: boolean;
}

interface SubscriptionState {
  email: string;
  name: string;
  preferences: string[];
}

const PREFERENCE_OPTIONS = [
  { id: 'industry_news', label: '行业资讯' },
  { id: 'case_studies', label: '案例分享' },
  { id: 'company_updates', label: '公司动态' },
  { id: 'events', label: '活动信息' },
  { id: 'tips', label: '专业建议' },
];

/**
 * 新闻订阅组件
 * 支持邮箱订阅、偏好设置和状态反馈
 */
export default function NewsletterSubscription({
  className,
  variant = 'default',
  showPreferences = false,
}: NewsletterSubscriptionProps) {
  const t = useTranslations();
  const [state, setState] = useState<SubscriptionState>({
    email: '',
    name: '',
    preferences: [],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof SubscriptionState, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handlePreferenceToggle = (preferenceId: string) => {
    setState(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preferenceId)
        ? prev.preferences.filter(id => id !== preferenceId)
        : [...prev.preferences, preferenceId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.email.trim()) {
      setError('请输入邮箱地址');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: state.email.trim(),
          name: state.name.trim() || undefined,
          preferences: state.preferences.length > 0 ? state.preferences : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setState({ email: '', name: '', preferences: [] });
      } else {
        setError(data.message || '订阅失败，请稍后重试');
      }
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError(null);
    setState({ email: '', name: '', preferences: [] });
  };

  // 紧凑版本
  if (variant === 'compact') {
    return (
      <div className={cn('w-full max-w-md', className)}>
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 dark:text-green-200 font-medium">
                订阅成功！
              </p>
              <p className="text-green-600 dark:text-green-300 text-sm mt-1">
                确认邮件已发送到您的邮箱
              </p>
              <button
                onClick={resetForm}
                className="text-green-600 hover:text-green-700 text-sm mt-2 underline"
              >
                订阅其他邮箱
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <div className="flex gap-2">
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="输入您的邮箱"
                  className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !state.email.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 内联版本
  if (variant === 'inline') {
    return (
      <div className={cn('w-full', className)}>
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
            >
              <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                订阅成功！
              </h3>
              <p className="text-green-600 dark:text-green-300 mb-4">
                感谢您的订阅，确认邮件已发送到您的邮箱。
              </p>
              <button
                onClick={resetForm}
                className="text-green-600 hover:text-green-700 font-medium underline"
              >
                订阅其他邮箱
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
            >
              <div className="text-center mb-6">
                <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  订阅我们的新闻
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  获取最新的行业资讯和专业洞察
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={state.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="输入您的邮箱地址"
                    className="flex-1 px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !state.email.trim()}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      '订阅'
                    )}
                  </button>
                </div>
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 默认完整版本
  return (
    <div className={cn('w-full max-w-lg', className)}>
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
          >
            <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-3">
              订阅成功！
            </h3>
            <p className="text-green-600 dark:text-green-300 mb-6">
              感谢您的订阅，我们已向您的邮箱发送了确认邮件。
              您将定期收到我们精心准备的内容。
            </p>
            <button
              onClick={resetForm}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              订阅其他邮箱
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-neutral-900 rounded-xl p-8 border border-neutral-200 dark:border-neutral-700 shadow-lg"
          >
            <div className="text-center mb-8">
              <Mail className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                订阅我们的新闻
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                获取最新的行业资讯、案例分享和专业洞察，
                让您始终保持领先优势。
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    邮箱地址 *
                  </label>
                  <input
                    type="email"
                    value={state.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="输入您的邮箱地址"
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    姓名（可选）
                  </label>
                  <input
                    type="text"
                    value={state.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="输入您的姓名"
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                
                {showPreferences && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                      订阅偏好（可选）
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {PREFERENCE_OPTIONS.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={state.preferences.includes(option.id)}
                            onChange={() => handlePreferenceToggle(option.id)}
                            className="rounded border-neutral-300 text-primary focus:ring-primary"
                            disabled={loading}
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading || !state.email.trim()}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    订阅中...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    立即订阅
                  </>
                )}
              </button>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </motion.div>
              )}
              
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                订阅即表示您同意接收我们的邮件通讯。
                您可以随时取消订阅。
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}