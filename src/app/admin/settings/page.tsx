'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  Users,
  Shield,
  Database,
  Bell,
  Globe,
  Palette,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  AlertTriangle,
  Info,
  Upload,
  Download
} from 'lucide-react';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    dateFormat: string;
    maintenanceMode: boolean;
    maintenanceMessage: string;
  };
  email: {
    provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    smtpSecure: boolean;
    fromName: string;
    fromEmail: string;
    replyToEmail: string;
    testEmail: string;
  };
  security: {
    enableTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    passwordMinLength: number;
    passwordRequireSpecial: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireUppercase: boolean;
    enableCaptcha: boolean;
    captchaProvider: 'recaptcha' | 'hcaptcha';
    captchaSiteKey: string;
    captchaSecretKey: string;
  };
  notifications: {
    enableEmailNotifications: boolean;
    enableSmsNotifications: boolean;
    enablePushNotifications: boolean;
    notifyOnNewContact: boolean;
    notifyOnNewFeedback: boolean;
    notifyOnSystemError: boolean;
    dailyReportTime: string;
    weeklyReportDay: number;
    monthlyReportDay: number;
  };
  api: {
    enableRateLimit: boolean;
    rateLimitRequests: number;
    rateLimitWindow: number;
    enableApiKeys: boolean;
    enableWebhooks: boolean;
    webhookSecret: string;
    corsOrigins: string[];
    enableLogging: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
  };
  storage: {
    provider: 'local' | 's3' | 'cloudinary' | 'azure';
    maxFileSize: number;
    allowedFileTypes: string[];
    s3Bucket: string;
    s3Region: string;
    s3AccessKey: string;
    s3SecretKey: string;
    cloudinaryCloudName: string;
    cloudinaryApiKey: string;
    cloudinaryApiSecret: string;
  };
}

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  userCount: number;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'admin.read', name: '查看管理面板', category: '管理' },
  { id: 'admin.write', name: '修改系统设置', category: '管理' },
  { id: 'users.read', name: '查看用户', category: '用户管理' },
  { id: 'users.write', name: '管理用户', category: '用户管理' },
  { id: 'users.delete', name: '删除用户', category: '用户管理' },
  { id: 'contacts.read', name: '查看联系记录', category: '联系管理' },
  { id: 'contacts.write', name: '处理联系记录', category: '联系管理' },
  { id: 'contacts.delete', name: '删除联系记录', category: '联系管理' },
  { id: 'feedback.read', name: '查看反馈', category: '反馈管理' },
  { id: 'feedback.write', name: '处理反馈', category: '反馈管理' },
  { id: 'feedback.delete', name: '删除反馈', category: '反馈管理' },
  { id: 'analytics.read', name: '查看分析数据', category: '数据分析' },
  { id: 'reports.read', name: '查看报告', category: '报告' },
  { id: 'reports.export', name: '导出报告', category: '报告' },
];

const TIMEZONES = [
  { value: 'Asia/Shanghai', label: '中国标准时间 (UTC+8)' },
  { value: 'Asia/Tokyo', label: '日本标准时间 (UTC+9)' },
  { value: 'America/New_York', label: '美国东部时间 (UTC-5)' },
  { value: 'America/Los_Angeles', label: '美国西部时间 (UTC-8)' },
  { value: 'Europe/London', label: '英国时间 (UTC+0)' },
  { value: 'Europe/Paris', label: '欧洲中部时间 (UTC+1)' },
];

const LANGUAGES = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁体中文' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'ja-JP', label: '日本語' },
  { value: 'ko-KR', label: '한국어' },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'email' | 'security' | 'notifications' | 'api' | 'storage' | 'roles'>('general');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // 获取设置数据
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟设置数据
      const mockSettings: SystemSettings = {
        general: {
          siteName: 'SpacePlus',
          siteDescription: '专业的太空服务平台',
          siteUrl: 'https://spaceplus.com',
          adminEmail: 'admin@spaceplus.com',
          timezone: 'Asia/Shanghai',
          language: 'zh-CN',
          dateFormat: 'YYYY-MM-DD',
          maintenanceMode: false,
          maintenanceMessage: '系统维护中，请稍后访问',
        },
        email: {
          provider: 'smtp',
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUser: 'noreply@spaceplus.com',
          smtpPassword: '********',
          smtpSecure: true,
          fromName: 'SpacePlus',
          fromEmail: 'noreply@spaceplus.com',
          replyToEmail: 'support@spaceplus.com',
          testEmail: 'test@example.com',
        },
        security: {
          enableTwoFactor: true,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          lockoutDuration: 15,
          passwordMinLength: 8,
          passwordRequireSpecial: true,
          passwordRequireNumbers: true,
          passwordRequireUppercase: true,
          enableCaptcha: true,
          captchaProvider: 'recaptcha',
          captchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
          captchaSecretKey: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
        },
        notifications: {
          enableEmailNotifications: true,
          enableSmsNotifications: false,
          enablePushNotifications: true,
          notifyOnNewContact: true,
          notifyOnNewFeedback: true,
          notifyOnSystemError: true,
          dailyReportTime: '09:00',
          weeklyReportDay: 1,
          monthlyReportDay: 1,
        },
        api: {
          enableRateLimit: true,
          rateLimitRequests: 100,
          rateLimitWindow: 15,
          enableApiKeys: true,
          enableWebhooks: true,
          webhookSecret: 'webhook_secret_key',
          corsOrigins: ['https://spaceplus.com', 'https://app.spaceplus.com'],
          enableLogging: true,
          logLevel: 'info',
        },
        storage: {
          provider: 'local',
          maxFileSize: 10,
          allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
          s3Bucket: '',
          s3Region: 'us-east-1',
          s3AccessKey: '',
          s3SecretKey: '',
          cloudinaryCloudName: '',
          cloudinaryApiKey: '',
          cloudinaryApiSecret: '',
        },
      };
      
      // 模拟角色数据
      const mockRoles: UserRole[] = [
        {
          id: '1',
          name: '超级管理员',
          description: '拥有所有权限的系统管理员',
          permissions: AVAILABLE_PERMISSIONS.map(p => p.id),
          isSystem: true,
          userCount: 2,
        },
        {
          id: '2',
          name: '管理员',
          description: '拥有大部分管理权限',
          permissions: [
            'admin.read',
            'users.read',
            'users.write',
            'contacts.read',
            'contacts.write',
            'feedback.read',
            'feedback.write',
            'analytics.read',
            'reports.read',
          ],
          isSystem: false,
          userCount: 5,
        },
        {
          id: '3',
          name: '客服',
          description: '处理客户联系和反馈',
          permissions: [
            'contacts.read',
            'contacts.write',
            'feedback.read',
            'feedback.write',
          ],
          isSystem: false,
          userCount: 12,
        },
        {
          id: '4',
          name: '分析师',
          description: '查看和分析数据',
          permissions: [
            'analytics.read',
            'reports.read',
            'reports.export',
            'contacts.read',
            'feedback.read',
          ],
          isSystem: false,
          userCount: 3,
        },
      ];
      
      setSettings(mockSettings);
      setRoles(mockRoles);
    } catch (error) {
      console.error('获取设置失败:', error);
      setError('获取设置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 保存设置
  const saveSettings = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('设置保存成功');
      
      // 3秒后清除成功消息
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('保存设置失败:', error);
      setError('保存设置失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 测试邮件配置
  const testEmailConfig = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // 模拟发送测试邮件
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('测试邮件发送成功，请检查收件箱');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('测试邮件失败:', error);
      setError('测试邮件发送失败');
    } finally {
      setSaving(false);
    }
  };

  // 更新设置
  const updateSettings = (section: keyof SystemSettings, field: string, value: any) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value,
      },
    }));
  };

  // 切换密码显示
  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // 保存角色
  const saveRole = async (role: UserRole) => {
    try {
      setSaving(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (role.id) {
        // 更新现有角色
        setRoles(prev => prev.map(r => r.id === role.id ? role : r));
      } else {
        // 创建新角色
        const newRole = { ...role, id: Date.now().toString() };
        setRoles(prev => [...prev, newRole]);
      }
      
      setShowRoleModal(false);
      setEditingRole(null);
      setSuccess('角色保存成功');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('保存角色失败:', error);
      setError('保存角色失败');
    } finally {
      setSaving(false);
    }
  };

  // 删除角色
  const deleteRole = async (roleId: string) => {
    if (!confirm('确定要删除这个角色吗？')) return;
    
    try {
      setSaving(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRoles(prev => prev.filter(r => r.id !== roleId));
      setSuccess('角色删除成功');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('删除角色失败:', error);
      setError('删除角色失败');
    } finally {
      setSaving(false);
    }
  };

  // 导出设置
  const exportSettings = () => {
    if (!settings) return;
    
    const exportData = {
      settings,
      roles,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `settings_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // 导入设置
  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.settings) {
          setSettings(data.settings);
        }
        
        if (data.roles) {
          setRoles(data.roles);
        }
        
        setSuccess('设置导入成功');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('导入设置失败:', error);
        setError('导入设置失败，文件格式不正确');
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  // 渲染通用设置
  const renderGeneralSettings = () => {
    if (!settings) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              网站名称
            </label>
            <input
              type="text"
              value={settings.general.siteName}
              onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              网站URL
            </label>
            <input
              type="url"
              value={settings.general.siteUrl}
              onChange={(e) => updateSettings('general', 'siteUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            网站描述
          </label>
          <textarea
            value={settings.general.siteDescription}
            onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              管理员邮箱
            </label>
            <input
              type="email"
              value={settings.general.adminEmail}
              onChange={(e) => updateSettings('general', 'adminEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              时区
            </label>
            <select
              value={settings.general.timezone}
              onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              语言
            </label>
            <select
              value={settings.general.language}
              onChange={(e) => updateSettings('general', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              日期格式
            </label>
            <select
              value={settings.general.dateFormat}
              onChange={(e) => updateSettings('general', 'dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="YYYY-MM-DD">2024-01-01</option>
              <option value="DD/MM/YYYY">01/01/2024</option>
              <option value="MM/DD/YYYY">01/01/2024</option>
              <option value="DD-MM-YYYY">01-01-2024</option>
            </select>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">维护模式</h3>
              <p className="text-sm text-gray-600">启用后，网站将显示维护页面</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.general.maintenanceMode}
                onChange={(e) => updateSettings('general', 'maintenanceMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {settings.general.maintenanceMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                维护消息
              </label>
              <textarea
                value={settings.general.maintenanceMessage}
                onChange={(e) => updateSettings('general', 'maintenanceMessage', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染邮件设置
  const renderEmailSettings = () => {
    if (!settings) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮件服务商
            </label>
            <select
              value={settings.email.provider}
              onChange={(e) => updateSettings('email', 'provider', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="smtp">SMTP</option>
              <option value="sendgrid">SendGrid</option>
              <option value="mailgun">Mailgun</option>
              <option value="ses">Amazon SES</option>
            </select>
          </div>
        </div>
        
        {settings.email.provider === 'smtp' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP主机
                </label>
                <input
                  type="text"
                  value={settings.email.smtpHost}
                  onChange={(e) => updateSettings('email', 'smtpHost', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP端口
                </label>
                <input
                  type="number"
                  value={settings.email.smtpPort}
                  onChange={(e) => updateSettings('email', 'smtpPort', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP用户名
                </label>
                <input
                  type="text"
                  value={settings.email.smtpUser}
                  onChange={(e) => updateSettings('email', 'smtpUser', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP密码
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.smtpPassword ? 'text' : 'password'}
                    value={settings.email.smtpPassword}
                    onChange={(e) => updateSettings('email', 'smtpPassword', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('smtpPassword')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.smtpPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="smtpSecure"
                checked={settings.email.smtpSecure}
                onChange={(e) => updateSettings('email', 'smtpSecure', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="smtpSecure" className="ml-2 text-sm text-gray-700">
                使用SSL/TLS加密
              </label>
            </div>
          </div>
        )}
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">发件人信息</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                发件人姓名
              </label>
              <input
                type="text"
                value={settings.email.fromName}
                onChange={(e) => updateSettings('email', 'fromName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                发件人邮箱
              </label>
              <input
                type="email"
                value={settings.email.fromEmail}
                onChange={(e) => updateSettings('email', 'fromEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              回复邮箱
            </label>
            <input
              type="email"
              value={settings.email.replyToEmail}
              onChange={(e) => updateSettings('email', 'replyToEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">邮件测试</h3>
          
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                测试邮箱
              </label>
              <input
                type="email"
                value={settings.email.testEmail}
                onChange={(e) => updateSettings('email', 'testEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入测试邮箱地址"
              />
            </div>
            
            <button
              onClick={testEmailConfig}
              disabled={saving || !settings.email.testEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '发送中...' : '发送测试邮件'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 渲染角色管理
  const renderRoleManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">用户角色管理</h3>
            <p className="text-sm text-gray-600">管理系统用户角色和权限</p>
          </div>
          
          <button
            onClick={() => {
              setEditingRole({
                id: '',
                name: '',
                description: '',
                permissions: [],
                isSystem: false,
                userCount: 0,
              });
              setShowRoleModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加角色
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{role.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                </div>
                
                {!role.isSystem && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingRole(role);
                        setShowRoleModal(true);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => deleteRole(role.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">用户数量:</span>
                  <span className="font-medium text-gray-900">{role.userCount}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">权限数量:</span>
                  <span className="font-medium text-gray-900">{role.permissions.length}</span>
                </div>
                
                {role.isSystem && (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-600">系统角色</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* 角色编辑模态框 */}
        {showRoleModal && editingRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingRole.id ? '编辑角色' : '添加角色'}
                </h3>
                
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setEditingRole(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      角色名称
                    </label>
                    <input
                      type="text"
                      value={editingRole.name}
                      onChange={(e) => setEditingRole(prev => ({ ...prev!, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    角色描述
                  </label>
                  <textarea
                    value={editingRole.description}
                    onChange={(e) => setEditingRole(prev => ({ ...prev!, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    权限设置
                  </label>
                  
                  <div className="space-y-4">
                    {Object.entries(
                      AVAILABLE_PERMISSIONS.reduce((acc, permission) => {
                        if (!acc[permission.category]) {
                          acc[permission.category] = [];
                        }
                        acc[permission.category].push(permission);
                        return acc;
                      }, {} as Record<string, typeof AVAILABLE_PERMISSIONS>)
                    ).map(([category, permissions]) => (
                      <div key={category} className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                        
                        <div className="space-y-2">
                          {permissions.map((permission) => (
                            <label key={permission.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={editingRole.permissions.includes(permission.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditingRole(prev => ({
                                      ...prev!,
                                      permissions: [...prev!.permissions, permission.id],
                                    }));
                                  } else {
                                    setEditingRole(prev => ({
                                      ...prev!,
                                      permissions: prev!.permissions.filter(p => p !== permission.id),
                                    }));
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{permission.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setEditingRole(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                
                <button
                  onClick={() => saveRole(editingRole)}
                  disabled={saving || !editingRole.name.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">加载设置中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">系统设置</h1>
              <p className="text-gray-600">管理系统配置和用户权限</p>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                导入设置
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={exportSettings}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                导出设置
              </button>
              
              <button
                onClick={saveSettings}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? '保存中...' : '保存设置'}
              </button>
            </div>
          </div>
          
          {/* 消息提示 */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 mb-4">
              <Check className="w-5 h-5" />
              {success}
            </div>
          )}
        </div>

        {/* 标签页导航 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'general', label: '通用', icon: Settings },
                { key: 'email', label: '邮件', icon: Mail },
                { key: 'security', label: '安全', icon: Shield },
                { key: 'notifications', label: '通知', icon: Bell },
                { key: 'api', label: 'API', icon: Globe },
                { key: 'storage', label: '存储', icon: Database },
                { key: 'roles', label: '角色', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 设置内容 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'email' && renderEmailSettings()}
          {activeTab === 'roles' && renderRoleManagement()}
          
          {/* 其他标签页的占位内容 */}
          {['security', 'notifications', 'api', 'storage'].includes(activeTab) && (
            <div className="text-center py-12">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{activeTab} 设置</h3>
              <p className="text-gray-600">此功能正在开发中...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}