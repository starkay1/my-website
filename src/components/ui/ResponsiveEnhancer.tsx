'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveEnhancerProps {
  children: React.ReactNode;
  className?: string;
  enablePerformanceOptimization?: boolean;
  enableMobileOptimization?: boolean;
}

/**
 * 响应式增强组件
 * 提供移动端优化、性能优化和响应式设计增强
 */
export default function ResponsiveEnhancer({
  children,
  className,
  enablePerformanceOptimization = true,
  enableMobileOptimization = true
}: ResponsiveEnhancerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
      setViewportHeight(height);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  useEffect(() => {
    if (enablePerformanceOptimization) {
      // 启用硬件加速
      document.documentElement.style.setProperty('--enable-hardware-acceleration', 'translateZ(0)');
      
      // 优化滚动性能
      document.documentElement.style.setProperty('scroll-behavior', 'smooth');
      
      // 减少重绘
      if (isMobile) {
        document.documentElement.style.setProperty('--mobile-optimization', 'true');
      }
    }
  }, [enablePerformanceOptimization, isMobile]);

  useEffect(() => {
    if (enableMobileOptimization && isMobile) {
      // 移动端视口优化
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }

      // 移动端触摸优化
      document.body.style.setProperty('-webkit-tap-highlight-color', 'transparent');
      document.body.style.setProperty('-webkit-touch-callout', 'none');
      document.body.style.setProperty('-webkit-user-select', 'none');
      document.body.style.setProperty('user-select', 'none');
      
      // iOS Safari 地址栏高度适配
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setVH();
      window.addEventListener('resize', setVH);
      
      return () => {
        window.removeEventListener('resize', setVH);
      };
    }
  }, [enableMobileOptimization, isMobile]);

  const containerClasses = cn(
    'responsive-enhancer',
    {
      'mobile-optimized': isMobile && enableMobileOptimization,
      'tablet-optimized': isTablet,
      'touch-optimized': isTouch,
      'performance-optimized': enablePerformanceOptimization,
    },
    className
  );

  return (
    <div 
      className={containerClasses}
      style={{
        '--viewport-height': `${viewportHeight}px`,
        '--is-mobile': isMobile ? '1' : '0',
        '--is-tablet': isTablet ? '1' : '0',
        '--is-touch': isTouch ? '1' : '0',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

// 响应式断点 Hook
export function useResponsiveBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop' | 'wide'>('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else if (width < 1920) {
        setBreakpoint('desktop');
      } else {
        setBreakpoint('wide');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

// 移动端检测 Hook
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const ios = /iPad|iPhone|iPod/.test(userAgent);
    const android = /Android/.test(userAgent);

    setIsMobile(mobile);
    setIsIOS(ios);
    setIsAndroid(android);
  }, []);

  return { isMobile, isIOS, isAndroid };
}

// 触摸设备检测 Hook
export function useTouchDetection() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouch();
  }, []);

  return isTouch;
}

// 网络状态检测 Hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    const updateConnectionType = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown');
      }
    };

    updateOnlineStatus();
    updateConnectionType();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnectionType);
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      if (connection) {
        connection.removeEventListener('change', updateConnectionType);
      }
    };
  }, []);

  return { isOnline, connectionType };
}