'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade' | 'slide' | 'scale' | 'blur' | 'flip';
  duration?: number;
  delay?: number;
}

/**
 * 页面过渡动画组件
 * 提供多种过渡效果和流畅的页面切换体验
 */
export default function PageTransition({
  children,
  className,
  variant = 'fade',
  duration = 0.3,
  delay = 0
}: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  // 动画变体配置
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 }
    },
    blur: {
      initial: { opacity: 0, filter: 'blur(10px)' },
      animate: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(10px)' }
    },
    flip: {
      initial: { opacity: 0, rotateX: -90 },
      animate: { opacity: 1, rotateX: 0 },
      exit: { opacity: 0, rotateX: 90 }
    }
  };

  const transition = {
    duration,
    delay,
    ease: [0.25, 0.46, 0.45, 0.94] // Apple-style easing
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={variants[variant].initial}
        animate={variants[variant].animate}
        exit={variants[variant].exit}
        transition={transition}
        className={cn('page-transition', className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// 加载指示器组件
export function LoadingIndicator({ 
  isLoading, 
  variant = 'spinner',
  className 
}: { 
  isLoading: boolean; 
  variant?: 'spinner' | 'dots' | 'bar' | 'pulse';
  className?: string;
}) {
  if (!isLoading) return null;

  const indicators = {
    spinner: (
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    ),
    dots: (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    ),
    bar: (
      <div className="w-32 h-1 bg-neutral-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-pulse" />
      </div>
    ),
    pulse: (
      <div className="w-8 h-8 bg-primary rounded-full animate-ping opacity-75" />
    )
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50',
        'flex items-center justify-center',
        'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm',
        'rounded-2xl p-6 shadow-apple-lg',
        className
      )}
    >
      {indicators[variant]}
    </motion.div>
  );
}

// 页面切换进度条
export function PageProgress({ isLoading }: { isLoading: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 100);

      return () => clearInterval(timer);
    } else {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (progress === 0) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-secondary"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </motion.div>
  );
}

// 页面切换 Hook
export function usePageTransition() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousPath, setPreviousPath] = useState('');

  useEffect(() => {
    if (pathname !== previousPath) {
      setIsTransitioning(true);
      setPreviousPath(pathname);
      
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pathname, previousPath]);

  return { isTransitioning, pathname, previousPath };
}

// 滚动恢复组件
export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // 保存当前滚动位置
    const saveScrollPosition = () => {
      sessionStorage.setItem(`scroll-${pathname}`, window.scrollY.toString());
    };

    // 恢复滚动位置
    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem(`scroll-${pathname}`);
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
      } else {
        window.scrollTo(0, 0);
      }
    };

    // 页面加载完成后恢复滚动位置
    const timer = setTimeout(restoreScrollPosition, 100);

    // 页面卸载前保存滚动位置
    window.addEventListener('beforeunload', saveScrollPosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, [pathname]);

  return null;
}

// 预加载组件
export function Preloader({ 
  routes = [],
  priority = 'low'
}: { 
  routes?: string[];
  priority?: 'low' | 'high';
}) {
  useEffect(() => {
    if (routes.length === 0) return;

    const preloadRoute = (route: string) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      link.as = 'document';
      if (priority === 'high') {
        link.setAttribute('importance', 'high');
      }
      document.head.appendChild(link);
    };

    // 延迟预加载以避免影响当前页面性能
    const timer = setTimeout(() => {
      routes.forEach(preloadRoute);
    }, 2000);

    return () => clearTimeout(timer);
  }, [routes, priority]);

  return null;
}