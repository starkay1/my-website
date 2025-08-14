// 全局类型定义

// 语言相关类型
export type Locale = 'zh-CN' | 'en' | 'th';

export interface Language {
  code: Locale;
  name: string;
  flag: string;
}

// 导航相关类型
export interface NavigationItem {
  name: string;
  href: string;
  children?: NavigationItem[];
}

// 案例相关类型
export interface CaseItem {
  id: number;
  title: string;
  slug: string;
  country: string;
  city: string;
  type: string;
  cover: string;
  kpi: string;
  description: string;
  tags: string[];
  category?: string;
  location?: string;
  date?: string;
  image?: string;
}

// 案例详情类型
export interface Case {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  client: string;
  industry: string;
  location: string;
  duration: string;
  teamSize: string;
  budget: string;
  status: string;
  featured: boolean;
  publishedAt: string;
  coverImage: string;
  gallery: string[];
  tags: string[];
  category: string;
  overview: {
    challenge: string;
    solution: string;
    results: string;
  };
  challenges: {
    title: string;
    description: string;
    impact: string;
  }[];
  solutions: {
    title: string;
    description: string;
    implementation: string[];
  }[];
  results: {
    metrics: {
      label: string;
      value: string;
      description: string;
      trend: string;
    }[];
    achievements: string[];
  };
  process: {
    phase: string;
    duration: string;
    description: string;
    deliverables: string[];
    color: string;
  }[];
  testimonial: {
    quote: string;
    author: string;
    position: string;
    company: string;
    avatar: string;
    rating: number;
  };
  relatedCases: string[];
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 客户logo类型
export interface ClientLogo {
  name: string;
  logo: string;
  alt?: string;
}

// 媒体徽章类型
export interface PressBadge {
  name: string;
  logo: string;
  alt?: string;
}

// 表单相关类型
export interface LeadFormData {
  name: string;
  country: string;
  contact: string;
  projectStage: string;
  message: string;
  privacyConsent: boolean;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
  privacyConsent: boolean;
}

// 服务相关类型
export interface ServiceStep {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  color: 'primary' | 'secondary' | 'accent';
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 组件Props类型
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ComponentProps {
  className?: string;
}

export interface PageProps {
  params: {
    locale: Locale;
    slug?: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

// 动画相关类型
export interface AnimationVariants {
  hidden: any;
  visible: any;
}

// SEO相关类型
export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// 状态类型
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

// 主题相关类型
export type ThemeMode = 'light' | 'dark' | 'system';

// 设备类型
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// 统计数据类型
export interface StatItem {
  value: string;
  label: string;
  color?: string;
}

// 团队成员类型
export interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar: string;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

// 新闻文章类型
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  readTime: number;
}

// 职位类型
export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  requirements: string[];
  responsibilities?: string[];
  benefits: string[];
  salary?: string;
  experience?: string;
  isUrgent?: boolean;
  isRemote?: boolean;
  deadline?: string;
  status: 'draft' | 'published' | 'closed';
  postedAt: string;
  createdAt: string;
  updatedAt: string;
}

// 配置类型
export interface AppConfig {
  siteName: string;
  siteUrl: string;
  defaultLocale: Locale;
  supportedLocales: Locale[];
  contactEmail: string;
  socialLinks: {
    wechat?: string;
    whatsapp?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}