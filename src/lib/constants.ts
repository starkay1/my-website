import type { AppConfig, Language, Locale } from '@/types';

// 支持的语言配置
export const LANGUAGES: Language[] = [
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
];

// 默认语言
export const DEFAULT_LOCALE: Locale = 'zh-CN';

// 应用配置
export const APP_CONFIG: AppConfig = {
  siteName: 'Spaceplus Worldwide',
  siteUrl: 'https://spaceplus.com',
  defaultLocale: DEFAULT_LOCALE,
  supportedLocales: ['zh-CN', 'en', 'th'],
  contactEmail: 'contact@spaceplus.com',
  socialLinks: {
    wechat: '#',
    whatsapp: '#',
    linkedin: '#',
    facebook: '#',
    instagram: '#',
  },
};

// 国家列表
export const COUNTRIES = [
  '中国', '新加坡', '泰国', '马来西亚', '印度尼西亚', '菲律宾',
  '越南', '韩国', '日本', '阿联酋', '卡塔尔', '沙特阿拉伯',
  '美国', '英国', '澳大利亚', '其他'
];

// 项目阶段
export const PROJECT_STAGES = [
  '筹备阶段',
  '已开业运营',
  '寻求改进',
  '品牌扩张',
  '投资咨询',
  '其他需求'
];

// 案例分类
export const CASE_CATEGORIES = [
  '全部',
  '酒吧设计',
  '夜店设计',
  '复合空间',
  '主题空间'
];

// 服务类型
export const SERVICE_TYPES = [
  '项目托管',
  '战略顾问',
  '品牌孵化',
  '运营优化'
];

// 新闻分类
export const NEWS_CATEGORIES = [
  '新闻',
  '洞察',
  '方法论',
  '活动'
];

// 职位类型
export const JOB_TYPES = [
  'full-time',
  'part-time',
  'contract',
  'internship'
] as const;

// 部门列表
export const DEPARTMENTS = [
  '管理咨询',
  '品牌设计',
  '运营管理',
  '市场营销',
  '技术开发',
  '人力资源'
];

// 动画配置
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
  },
  easing: {
    easeOut: [0.25, 0.46, 0.45, 0.94],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: [0.25, 0.46, 0.45, 0.94],
  },
  stagger: {
    children: 0.1,
    items: 0.05,
  },
  smooth: {
    duration: 0.4,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
};

// 响应式断点
export const BREAKPOINTS = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
} as const;

// API 端点
export const API_ENDPOINTS = {
  contact: '/api/contact',
  newsletter: '/api/newsletter',
  cases: '/api/cases',
  news: '/api/news',
  jobs: '/api/jobs',
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接错误，请稍后重试',
  VALIDATION_ERROR: '请检查输入信息',
  SERVER_ERROR: '服务器错误，请稍后重试',
  NOT_FOUND: '页面未找到',
  UNAUTHORIZED: '未授权访问',
  FORBIDDEN: '访问被拒绝',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: '表单提交成功',
  EMAIL_SENT: '邮件发送成功',
  SUBSCRIPTION_SUCCESS: '订阅成功',
  COPY_SUCCESS: '复制成功',
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  THEME: 'spaceplus-theme',
  LANGUAGE: 'spaceplus-language',
  USER_PREFERENCES: 'spaceplus-preferences',
} as const;

// 主题配置
export const THEME_CONFIG = {
  colors: {
    primary: {
      50: '#E6F3FF',
      100: '#CCE7FF',
      200: '#99CFFF',
      300: '#66B7FF',
      400: '#339FFF',
      500: '#007AFF',
      600: '#0056CC',
      700: '#004299',
      800: '#002E66',
      900: '#001A33',
    },
    secondary: {
      50: '#E8F5EA',
      100: '#D1EBD6',
      200: '#A3D7AD',
      300: '#75C384',
      400: '#54D06F',
      500: '#34C759',
      600: '#2BA047',
      700: '#227935',
      800: '#195223',
      900: '#102B11',
    },
  },
  shadows: {
    apple: '0 4px 16px rgba(0, 0, 0, 0.12)',
    'apple-lg': '0 8px 32px rgba(0, 0, 0, 0.16)',
    'apple-xl': '0 16px 64px rgba(0, 0, 0, 0.2)',
  },
};

// 性能配置
export const PERFORMANCE_CONFIG = {
  imageOptimization: {
    quality: 85,
    formats: ['webp', 'avif'],
    sizes: {
      thumbnail: 300,
      small: 600,
      medium: 1200,
      large: 1920,
    },
  },
  lazyLoading: {
    rootMargin: '50px',
    threshold: 0.1,
  },
  debounceDelay: 300,
  throttleDelay: 100,
};

// SEO 配置
export const SEO_CONFIG = {
  defaultTitle: 'Spaceplus Worldwide｜全球夜生活品牌管理与孵化平台',
  titleTemplate: '%s | Spaceplus Worldwide',
  defaultDescription: '提供夜店项目托管、品牌顾问、品牌孵化与授权服务，帮助项目高效起盘与稳定增长。',
  defaultKeywords: '夜店托管,夜生活品牌管理,夜店顾问,品牌孵化,Spaceplus',
  defaultImage: '/og-cover.jpg',
  twitterHandle: '@spaceplus',
};

// 表单验证规则
export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    required: true,
    pattern: /^[+]?[1-9]\d{1,14}$/,
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
};

// 分页配置
export const PAGINATION_CONFIG = {
  defaultPageSize: 12,
  pageSizeOptions: [6, 12, 24, 48],
  maxPages: 10,
};

// 文件上传配置
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  maxFiles: 5,
};