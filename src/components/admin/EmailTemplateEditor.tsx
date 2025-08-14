'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Eye, 
  Send, 
  Code, 
  Type, 
  Image, 
  Link, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Undo,
  Redo,
  X,
  Plus,
  Trash2,
  Copy,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailTemplate {
  id?: string;
  name: string;
  subject: string;
  content: string;
  type: 'newsletter' | 'welcome' | 'notification' | 'promotional';
  variables: string[];
  isActive: boolean;
  description?: string;
}

interface EmailTemplateEditorProps {
  template?: EmailTemplate;
  onSave: (template: EmailTemplate) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

const TEMPLATE_TYPES = [
  { value: 'newsletter', label: '新闻通讯' },
  { value: 'welcome', label: '欢迎邮件' },
  { value: 'notification', label: '通知邮件' },
  { value: 'promotional', label: '推广邮件' },
];

const COMMON_VARIABLES = [
  { name: 'name', label: '用户姓名', example: '张三' },
  { name: 'email', label: '用户邮箱', example: 'user@example.com' },
  { name: 'company', label: '公司名称', example: 'SpacePlus' },
  { name: 'date', label: '当前日期', example: '2024年1月20日' },
  { name: 'unsubscribe_url', label: '取消订阅链接', example: 'https://example.com/unsubscribe' },
];

const PRESET_TEMPLATES = {
  newsletter: {
    subject: '{{company}} - 最新资讯 {{date}}',
    content: `
<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <header style="background: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #007bff;">
    <h1 style="margin: 0; color: #007bff;">{{company}}</h1>
    <p style="margin: 5px 0 0; color: #666;">最新资讯与动态</p>
  </header>
  
  <main style="padding: 30px 20px;">
    <h2 style="color: #333; margin-bottom: 20px;">您好，{{name}}！</h2>
    
    <p>感谢您订阅我们的新闻通讯。以下是本期的精彩内容：</p>
    
    <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-left: 4px solid #007bff;">
      <h3 style="margin-top: 0; color: #007bff;">本期亮点</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li>行业最新动态分析</li>
        <li>成功案例分享</li>
        <li>专业技术洞察</li>
      </ul>
    </div>
    
    <p>如果您有任何问题或建议，请随时联系我们。</p>
  </main>
  
  <footer style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
    <p style="margin: 0; color: #666; font-size: 14px;">
      © 2024 {{company}}. 保留所有权利。
    </p>
    <p style="margin: 10px 0 0; font-size: 12px;">
      <a href="{{unsubscribe_url}}" style="color: #666; text-decoration: none;">取消订阅</a>
    </p>
  </footer>
</div>
    `,
  },
  welcome: {
    subject: '欢迎加入 {{company}}！',
    content: `
<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
    <h1 style="margin: 0; font-size: 28px;">欢迎加入我们！</h1>
    <p style="margin: 10px 0 0; opacity: 0.9;">感谢您的信任与支持</p>
  </header>
  
  <main style="padding: 40px 20px;">
    <h2 style="color: #333; margin-bottom: 20px;">您好，{{name}}！</h2>
    
    <p>欢迎加入 {{company}} 大家庭！我们很高兴您选择订阅我们的新闻通讯。</p>
    
    <div style="background: #f8f9fa; padding: 25px; margin: 25px 0; border-radius: 8px;">
      <h3 style="margin-top: 0; color: #667eea;">您将收到：</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li>最新的行业资讯和趋势分析</li>
        <li>独家的案例研究和成功故事</li>
        <li>专业的技术洞察和最佳实践</li>
        <li>公司最新动态和产品更新</li>
      </ul>
    </div>
    
    <p>我们承诺为您提供有价值的内容，帮助您在行业中保持领先。</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="#" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">访问我们的网站</a>
    </div>
  </main>
  
  <footer style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
    <p style="margin: 0; color: #666; font-size: 14px;">
      © 2024 {{company}}. 保留所有权利。
    </p>
    <p style="margin: 10px 0 0; font-size: 12px;">
      <a href="{{unsubscribe_url}}" style="color: #666; text-decoration: none;">取消订阅</a>
    </p>
  </footer>
</div>
    `,
  },
};

/**
 * 邮件模板编辑器组件
 * 提供可视化的邮件模板编辑功能
 */
export default function EmailTemplateEditor({
  template,
  onSave,
  onCancel,
  className,
}: EmailTemplateEditorProps) {
  const [formData, setFormData] = useState<EmailTemplate>({
    name: '',
    subject: '',
    content: '',
    type: 'newsletter',
    variables: [],
    isActive: true,
    description: '',
    ...template,
  });
  
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showVariables, setShowVariables] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '模板名称不能为空';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = '邮件主题不能为空';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = '邮件内容不能为空';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存模板
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Save template error:', error);
    } finally {
      setSaving(false);
    }
  };

  // 插入变量
  const insertVariable = (variable: string) => {
    const placeholder = `{{${variable}}}`;
    setFormData(prev => ({
      ...prev,
      content: prev.content + placeholder,
    }));
    
    if (!formData.variables.includes(variable)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, variable],
      }));
    }
  };

  // 应用预设模板
  const applyPreset = (type: keyof typeof PRESET_TEMPLATES) => {
    const preset = PRESET_TEMPLATES[type];
    if (preset) {
      setFormData(prev => ({
        ...prev,
        subject: preset.subject,
        content: preset.content,
        type: type as EmailTemplate['type'],
        variables: COMMON_VARIABLES.map(v => v.name),
      }));
      setShowPresets(false);
    }
  };

  // 发送测试邮件
  const handleSendTest = async () => {
    if (!testEmail.trim()) {
      alert('请输入测试邮箱地址');
      return;
    }

    setSendingTest(true);
    try {
      // 这里调用发送测试邮件的 API
      const response = await fetch(`/api/admin/newsletter/templates/${template?.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          variables: {},
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('测试邮件发送成功！');
      } else {
        alert(`发送失败：${data.message}`);
      }
    } catch (error) {
      console.error('Send test email error:', error);
      alert('发送测试邮件失败');
    } finally {
      setSendingTest(false);
    }
  };

  // 渲染预览内容
  const renderPreview = () => {
    let previewContent = formData.content;
    
    // 替换变量为示例值
    COMMON_VARIABLES.forEach(variable => {
      const placeholder = `{{${variable.name}}}`;
      previewContent = previewContent.replace(
        new RegExp(placeholder, 'g'),
        variable.example
      );
    });

    return (
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200">
          <p className="text-sm text-neutral-600">
            <strong>主题：</strong> {formData.subject.replace(/{{(\w+)}}/g, (match, key) => {
              const variable = COMMON_VARIABLES.find(v => v.name === key);
              return variable ? variable.example : match;
            })}
          </p>
        </div>
        <div 
          className="p-4 min-h-[400px]"
          dangerouslySetInnerHTML={{ __html: previewContent }}
        />
      </div>
    );
  };

  return (
    <div className={cn('bg-white rounded-xl border border-neutral-200 shadow-lg', className)}>
      {/* 头部工具栏 */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-neutral-900">
            {template ? '编辑模板' : '创建模板'}
          </h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('edit')}
              className={cn(
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                activeTab === 'edit'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Code className="w-4 h-4 mr-1 inline" />
              编辑
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={cn(
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                activeTab === 'preview'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Eye className="w-4 h-4 mr-1 inline" />
              预览
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {template && (
            <div className="flex items-center gap-2 mr-4">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="测试邮箱"
                className="px-3 py-1 border border-neutral-300 rounded text-sm"
              />
              <button
                onClick={handleSendTest}
                disabled={sendingTest}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {sendingTest ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                测试
              </button>
            </div>
          )}
          
          <button
            onClick={onCancel}
            className="px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            保存
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* 侧边栏 */}
        <div className="w-80 border-r border-neutral-200 bg-neutral-50">
          <div className="p-4 space-y-4">
            {/* 基本信息 */}
            <div className="space-y-3">
              <h3 className="font-medium text-neutral-900">基本信息</h3>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  模板名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={cn(
                    'w-full px-3 py-2 border rounded-lg text-sm',
                    errors.name ? 'border-red-300' : 'border-neutral-300'
                  )}
                  placeholder="输入模板名称"
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  模板类型
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as EmailTemplate['type'] }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                >
                  {TEMPLATE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  描述
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                  rows={2}
                  placeholder="模板描述（可选）"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-neutral-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-neutral-700">
                  启用模板
                </label>
              </div>
            </div>
            
            {/* 预设模板 */}
            <div className="space-y-3">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="flex items-center justify-between w-full text-left font-medium text-neutral-900"
              >
                预设模板
                <Plus className={cn('w-4 h-4 transition-transform', showPresets && 'rotate-45')} />
              </button>
              
              <AnimatePresence>
                {showPresets && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <button
                      onClick={() => applyPreset('newsletter')}
                      className="w-full text-left px-3 py-2 text-sm bg-white border border-neutral-200 rounded hover:bg-neutral-50"
                    >
                      新闻通讯模板
                    </button>
                    <button
                      onClick={() => applyPreset('welcome')}
                      className="w-full text-left px-3 py-2 text-sm bg-white border border-neutral-200 rounded hover:bg-neutral-50"
                    >
                      欢迎邮件模板
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* 变量库 */}
            <div className="space-y-3">
              <button
                onClick={() => setShowVariables(!showVariables)}
                className="flex items-center justify-between w-full text-left font-medium text-neutral-900"
              >
                变量库
                <Plus className={cn('w-4 h-4 transition-transform', showVariables && 'rotate-45')} />
              </button>
              
              <AnimatePresence>
                {showVariables && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {COMMON_VARIABLES.map(variable => (
                      <button
                        key={variable.name}
                        onClick={() => insertVariable(variable.name)}
                        className="w-full text-left px-3 py-2 text-sm bg-white border border-neutral-200 rounded hover:bg-neutral-50"
                      >
                        <div className="font-medium">{variable.label}</div>
                        <div className="text-xs text-neutral-500">{`{{${variable.name}}}`}</div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 主编辑区域 */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'edit' ? (
            <div className="flex-1 p-6 space-y-4">
              {/* 邮件主题 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  邮件主题 *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg',
                    errors.subject ? 'border-red-300' : 'border-neutral-300'
                  )}
                  placeholder="输入邮件主题"
                />
                {errors.subject && (
                  <p className="text-red-600 text-sm mt-1">{errors.subject}</p>
                )}
              </div>
              
              {/* 邮件内容 */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  邮件内容 *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className={cn(
                    'w-full h-full min-h-[400px] px-4 py-3 border rounded-lg font-mono text-sm',
                    errors.content ? 'border-red-300' : 'border-neutral-300'
                  )}
                  placeholder="输入邮件HTML内容"
                />
                {errors.content && (
                  <p className="text-red-600 text-sm mt-1">{errors.content}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 p-6">
              {renderPreview()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}