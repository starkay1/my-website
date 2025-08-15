'use client';

import { useEffect, useState } from 'react';

// 移动端优化 Hook
export function useMobileOptimization() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return { isMobile, isTablet, orientation };
}

// 触摸优化组件
interface TouchOptimizedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export function TouchOptimizedButton({ 
  children, 
  onClick, 
  className = '', 
  disabled = false 
}: TouchOptimizedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => setIsPressed(true);
  const handleTouchEnd = () => setIsPressed(false);
  const handleTouchCancel = () => setIsPressed(false);

  return (
    <button
      className={`
        ${className}
        ${isPressed ? 'scale-95' : 'scale-100'}
        transition-transform duration-150 ease-out
        touch-manipulation
        select-none
        min-h-[44px] min-w-[44px]
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      disabled={disabled}
      style={{
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {children}
    </button>
  );
}

// 懒加载图片组件
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number;
  height?: number;
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjY2NjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=',
  width,
  height
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imgRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef);
    return () => observer.disconnect();
  }, [imgRef]);

  return (
    <img
      ref={setImgRef}
      src={isInView ? src : placeholder}
      alt={alt}
      className={`
        ${className}
        transition-opacity duration-300
        ${isLoaded ? 'opacity-100' : 'opacity-0'}
      `}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
    />
  );
}

// 性能监控组件
export function PerformanceMonitor() {
  useEffect(() => {
    // 监控 Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      // First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime);
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        console.log('CLS:', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        observer.disconnect();
        lcpObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  return null;
}

// 预加载关键资源
export function PreloadCriticalResources() {
  useEffect(() => {
    // 预加载关键字体
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = '/fonts/geist-sans.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);

    // 预连接到外部域名
    const preconnectGA = document.createElement('link');
    preconnectGA.rel = 'preconnect';
    preconnectGA.href = 'https://www.googletagmanager.com';
    document.head.appendChild(preconnectGA);

    const preconnectSentry = document.createElement('link');
    preconnectSentry.rel = 'preconnect';
    preconnectSentry.href = 'https://sentry.io';
    document.head.appendChild(preconnectSentry);

    return () => {
      document.head.removeChild(fontLink);
      document.head.removeChild(preconnectGA);
      document.head.removeChild(preconnectSentry);
    };
  }, []);

  return null;
}