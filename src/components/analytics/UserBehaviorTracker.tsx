'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface UserBehaviorEvent {
  type: 'page_view' | 'click' | 'scroll' | 'form_submit' | 'search' | 'download' | 'contact';
  element?: string;
  value?: string | number;
  metadata?: Record<string, any>;
}

interface UserBehaviorTrackerProps {
  userId?: string;
  sessionId?: string;
  enableHeatmap?: boolean;
  enableScrollTracking?: boolean;
  enableClickTracking?: boolean;
}

export default function UserBehaviorTracker({
  userId,
  sessionId,
  enableHeatmap = true,
  enableScrollTracking = true,
  enableClickTracking = true,
}: UserBehaviorTrackerProps) {
  const pathname = usePathname();
  const scrollDepthRef = useRef(0);
  const sessionStartRef = useRef(Date.now());
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';

  // 发送事件到分析服务
  const trackEvent = async (event: UserBehaviorEvent) => {
    if (!isEnabled) return;

    const eventData = {
      ...event,
      timestamp: Date.now(),
      pathname,
      userId,
      sessionId: sessionId || generateSessionId(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      referrer: document.referrer,
    };

    try {
      // 发送到内部API
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      // 发送到Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', event.type, {
          event_category: 'User Behavior',
          event_label: event.element || pathname,
          value: typeof event.value === 'number' ? event.value : undefined,
          custom_parameter_1: event.metadata ? JSON.stringify(event.metadata) : undefined,
        });
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  // 生成会话ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // 页面浏览跟踪
  useEffect(() => {
    trackEvent({
      type: 'page_view',
      metadata: {
        sessionStart: sessionStartRef.current,
        timeOnPreviousPage: Date.now() - sessionStartRef.current,
      },
    });

    sessionStartRef.current = Date.now();
  }, [pathname]);

  // 滚动深度跟踪
  useEffect(() => {
    if (!enableScrollTracking) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

      // 记录最大滚动深度
      if (scrollPercent > scrollDepthRef.current) {
        scrollDepthRef.current = scrollPercent;

        // 在特定滚动深度点发送事件
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          trackEvent({
            type: 'scroll',
            value: scrollPercent,
            metadata: {
              maxScrollDepth: scrollDepthRef.current,
            },
          });
        }
      }
    };

    const throttledScroll = throttle(handleScroll, 1000);
    window.addEventListener('scroll', throttledScroll);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [enableScrollTracking, pathname]);

  // 点击跟踪
  useEffect(() => {
    if (!enableClickTracking) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      // 获取元素信息
      const elementInfo = {
        tagName: target.tagName.toLowerCase(),
        className: target.className,
        id: target.id,
        text: target.textContent?.slice(0, 100) || '',
        href: target.getAttribute('href'),
      };

      // 特殊元素跟踪
      let eventType: UserBehaviorEvent['type'] = 'click';
      let metadata: Record<string, any> = elementInfo;

      // 链接点击
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.closest('a') || target;
        metadata.linkType = link.getAttribute('href')?.startsWith('http') ? 'external' : 'internal';
        metadata.href = link.getAttribute('href');
      }

      // 按钮点击
      if (target.tagName === 'BUTTON' || (target as HTMLInputElement).type === 'submit') {
        metadata.buttonType = (target as HTMLInputElement).type || 'button';
      }

      // 表单提交
      if ((target as HTMLInputElement).type === 'submit' || target.closest('form')) {
        eventType = 'form_submit';
        const form = target.closest('form');
        if (form) {
          metadata.formId = form.id;
          metadata.formAction = form.action;
        }
      }

      // 下载链接
      if (target.getAttribute('download') || 
          target.getAttribute('href')?.match(/\.(pdf|doc|docx|xls|xlsx|zip|rar)$/i)) {
        eventType = 'download';
        metadata.fileName = target.getAttribute('href')?.split('/').pop();
      }

      trackEvent({
        type: eventType,
        element: `${elementInfo.tagName}${elementInfo.id ? '#' + elementInfo.id : ''}${elementInfo.className ? '.' + elementInfo.className.split(' ')[0] : ''}`,
        metadata,
      });
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [enableClickTracking]);

  // 页面离开时发送会话数据
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - sessionStartRef.current;
      
      // 使用 sendBeacon 确保数据发送
      if (navigator.sendBeacon) {
        const eventData = {
          type: 'session_end',
          value: sessionDuration,
          metadata: {
            maxScrollDepth: scrollDepthRef.current,
            pathname,
          },
        };

        navigator.sendBeacon(
          '/api/analytics/events',
          JSON.stringify(eventData)
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null; // 这是一个无UI的跟踪组件
}

// 节流函数
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// 扩展 Window 接口
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}