'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

interface PerformanceMonitorProps {
  onMetric?: (metric: { name: string; value: number; id?: string }) => void;
  enableConsoleLog?: boolean;
}

export default function PerformanceMonitor({ 
  onMetric, 
  enableConsoleLog = false 
}: PerformanceMonitorProps) {
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true';
  const sampleRate = parseFloat(process.env.NEXT_PUBLIC_PERFORMANCE_SAMPLE_RATE || '0.1');
  
  useEffect(() => {
    // 检查是否启用性能监控
    if (!isEnabled) return;
    
    // 采样率控制
    if (Math.random() > sampleRate) return;
    // 检查浏览器支持
    if (typeof window === 'undefined' || !('performance' in window)) {
      return;
    }

    const metrics: PerformanceMetrics = {};

    // 发送指标到分析服务
    const sendMetric = (name: string, value: number, id?: string) => {
      const metric = { name, value, id };
      
      // 调用回调函数
      onMetric?.(metric);
      
      // 发送到Google Analytics（如果可用）
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', name, {
          custom_parameter_1: value,
          event_category: 'Web Vitals',
          event_label: id,
          value: Math.round(value),
        });
      }
      
      // 控制台日志（开发环境）
      if (enableConsoleLog) {
        console.log(`Performance Metric - ${name}:`, value, id ? `(${id})` : '');
      }
    };

    // 获取 FCP (First Contentful Paint)
    const observeFCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              metrics.FCP = entry.startTime;
              sendMetric('FCP', entry.startTime);
              observer.disconnect();
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });
      }
    };

    // 获取 LCP (Largest Contentful Paint)
    const observeLCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          metrics.LCP = lastEntry.startTime;
          sendMetric('LCP', lastEntry.startTime, lastEntry.id);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // 在页面隐藏时发送最终值
        const sendFinalLCP = () => {
          if (metrics.LCP) {
            sendMetric('LCP', metrics.LCP);
          }
          observer.disconnect();
        };
        
        document.addEventListener('visibilitychange', sendFinalLCP, { once: true });
        window.addEventListener('beforeunload', sendFinalLCP, { once: true });
      }
    };

    // 获取 FID (First Input Delay)
    const observeFID = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as any;
            metrics.FID = fidEntry.processingStart - fidEntry.startTime;
            sendMetric('FID', metrics.FID, fidEntry.name);
            observer.disconnect();
          }
        });
        observer.observe({ entryTypes: ['first-input'] });
      }
    };

    // 获取 CLS (Cumulative Layout Shift)
    const observeCLS = () => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const clsEntry = entry as any;
            if (!clsEntry.hadRecentInput) {
              clsValue += clsEntry.value;
            }
          }
          metrics.CLS = clsValue;
        });
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // 在页面隐藏时发送最终值
        const sendFinalCLS = () => {
          sendMetric('CLS', clsValue);
          observer.disconnect();
        };
        
        document.addEventListener('visibilitychange', sendFinalCLS, { once: true });
        window.addEventListener('beforeunload', sendFinalCLS, { once: true });
      }
    };

    // 获取 TTFB (Time to First Byte)
    const observeTTFB = () => {
      if ('performance' in window && 'getEntriesByType' in window.performance) {
        const navigationEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          const entry = navigationEntries[0];
          metrics.TTFB = entry.responseStart - entry.requestStart;
          sendMetric('TTFB', metrics.TTFB);
        }
      }
    };

    // 获取其他性能指标
    const observeOtherMetrics = () => {
      if ('performance' in window) {
        // DOM Content Loaded
        const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        sendMetric('DCL', domContentLoaded);
        
        // Load Event
        window.addEventListener('load', () => {
          const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
          sendMetric('Load', loadTime);
        });
        
        // 资源加载时间
        setTimeout(() => {
          const resources = performance.getEntriesByType('resource');
          const slowResources = resources.filter(resource => resource.duration > 1000);
          
          if (slowResources.length > 0) {
            sendMetric('SlowResources', slowResources.length);
          }
        }, 5000);
      }
    };

    // 内存使用情况（如果支持）
    const observeMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        sendMetric('MemoryUsed', memory.usedJSHeapSize);
        sendMetric('MemoryTotal', memory.totalJSHeapSize);
        sendMetric('MemoryLimit', memory.jsHeapSizeLimit);
      }
    };

    // 连接质量（如果支持）
    const observeConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          sendMetric('ConnectionType', connection.effectiveType === '4g' ? 4 : 
                                     connection.effectiveType === '3g' ? 3 : 
                                     connection.effectiveType === '2g' ? 2 : 1);
          sendMetric('Downlink', connection.downlink);
          sendMetric('RTT', connection.rtt);
        }
      }
    };

    // 启动所有观察器
    observeFCP();
    observeLCP();
    observeFID();
    observeCLS();
    observeTTFB();
    observeOtherMetrics();
    observeMemory();
    observeConnection();

    // 清理函数
    return () => {
      // PerformanceObserver 会在组件卸载时自动断开连接
    };
  }, [onMetric, enableConsoleLog, isEnabled, sampleRate]);

  return null; // 这是一个无UI的监控组件
}

// 扩展 Window 接口
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}