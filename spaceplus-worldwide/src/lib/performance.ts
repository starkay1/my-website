// 性能优化工具函数

// 图片优化配置
export const imageOptimization = {
  // 支持的图片格式
  formats: ['image/webp', 'image/avif', 'image/jpeg'],
  
  // 图片质量设置
  quality: {
    high: 90,
    medium: 75,
    low: 60
  },
  
  // 响应式图片尺寸
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    large: 1280
  }
};

// 字体优化
export const fontOptimization = {
  // 字体预加载
  preloadFonts: [
    '/fonts/geist-sans.woff2',
    '/fonts/geist-mono.woff2'
  ],
  
  // 字体显示策略
  fontDisplay: 'swap' as const
};

// 资源预加载
export const resourcePreloading = {
  // 关键CSS
  criticalCSS: [
    '/styles/critical.css'
  ],
  
  // 预连接域名
  preconnectDomains: [
    'https://www.googletagmanager.com',
    'https://sentry.io',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ],
  
  // DNS预解析
  dnsPrefetch: [
    'https://www.google-analytics.com'
  ]
};

// 代码分割配置
export const codeSplitting = {
  // 动态导入的组件
  dynamicComponents: [
    'ContactForm',
    'TeamSection',
    'PartnersSection'
  ],
  
  // 路由级别的代码分割
  routeChunks: {
    home: ['hero', 'stats', 'contact'],
    about: ['team', 'history'],
    services: ['features', 'pricing']
  }
};

// 缓存策略
export const cacheStrategy = {
  // 静态资源缓存时间（秒）
  staticAssets: {
    images: 31536000, // 1年
    fonts: 31536000,  // 1年
    css: 2592000,     // 30天
    js: 2592000       // 30天
  },
  
  // API缓存策略
  api: {
    contact: 0,       // 不缓存
    content: 3600,    // 1小时
    static: 86400     // 24小时
  }
};

// 性能监控阈值
export const performanceThresholds = {
  // Core Web Vitals
  coreWebVitals: {
    LCP: 2500,  // Largest Contentful Paint (ms)
    FID: 100,   // First Input Delay (ms)
    CLS: 0.1    // Cumulative Layout Shift
  },
  
  // 其他性能指标
  metrics: {
    FCP: 1800,  // First Contentful Paint (ms)
    TTI: 3800,  // Time to Interactive (ms)
    TBT: 300    // Total Blocking Time (ms)
  }
};

// 懒加载配置
export const lazyLoadConfig = {
  // Intersection Observer 配置
  rootMargin: '50px',
  threshold: 0.1,
  
  // 懒加载的元素类型
  elements: {
    images: true,
    videos: true,
    iframes: true
  }
};

// 压缩配置
export const compressionConfig = {
  // Gzip压缩
  gzip: {
    enabled: true,
    level: 6,
    threshold: 1024 // 1KB
  },
  
  // Brotli压缩
  brotli: {
    enabled: true,
    quality: 6,
    threshold: 1024 // 1KB
  }
};

// 预取策略
export const prefetchStrategy = {
  // 链接预取
  linkPrefetch: {
    enabled: true,
    hoverDelay: 65, // ms
    touchStartDelay: 0
  },
  
  // 路由预取
  routePrefetch: {
    enabled: true,
    priority: ['/', '/about', '/services']
  }
};

// 性能优化工具函数
export class PerformanceOptimizer {
  // 测量性能指标
  static measurePerformance() {
    if (typeof window === 'undefined') return;
    
    // 使用 Performance Observer API
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration}ms`);
      });
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  }
  
  // 优化图片加载
  static optimizeImageLoading() {
    if (typeof window === 'undefined') return;
    
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach((img) => imageObserver.observe(img));
  }
  
  // 预加载关键资源
  static preloadCriticalResources() {
    if (typeof window === 'undefined') return;
    
    // 预加载字体
    fontOptimization.preloadFonts.forEach((fontUrl) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontUrl;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
    
    // 预连接外部域名
    resourcePreloading.preconnectDomains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
  }
  
  // 启用服务工作者
  static enableServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  }
}

// 导出默认配置
const performanceConfig = {
  imageOptimization,
  fontOptimization,
  resourcePreloading,
  codeSplitting,
  cacheStrategy,
  performanceThresholds,
  lazyLoadConfig,
  compressionConfig,
  prefetchStrategy,
  PerformanceOptimizer
};

export default performanceConfig;