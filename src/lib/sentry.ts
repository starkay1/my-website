import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',
  
  // 性能监控
  integrations: [
    // 使用正确的导入方式
    ...(typeof window !== 'undefined' ? [Sentry.browserTracingIntegration({
      tracePropagationTargets: [
        'localhost',
        'spaceplusworldwide.club',
        /^https:\/\/spaceplusworldwide\.club\/api/,
      ],
    })] : []),
  ],
  
  // 错误过滤
  beforeSend(event: Sentry.Event, hint: Sentry.EventHint) {
    // 过滤掉一些不重要的错误
    if (event.exception) {
      const error = hint.originalException;
      
      // 过滤网络错误
      if (error && (error as Error).message && (error as Error).message.includes('Network Error')) {
        return null;
      }
      
      // 过滤取消的请求
      if (error && (error as Error).name === 'AbortError') {
        return null;
      }
    }
    
    return event;
  },
  
  // 用户上下文
  initialScope: {
    tags: {
      component: 'spaceplus-frontend',
    },
  },
});

// 导出 Sentry 实例
export { Sentry };

// 错误报告辅助函数
export const reportError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope: Sentry.Scope) => {
    if (context) {
      Object.keys(context).forEach((key) => {
        scope.setContext(key, context[key]);
      });
    }
    Sentry.captureException(error);
  });
};

// 性能监控辅助函数
export const startTransaction = (name: string, op: string) => {
  return Sentry.startTransaction({ name, op });
};

// 用户信息设置
export const setUser = (user: { id: string; email?: string; username?: string }) => {
  Sentry.setUser(user);
};

// 清除用户信息
export const clearUser = () => {
  Sentry.setUser(null);
};

// 添加面包屑
export const addBreadcrumb = (message: string, category?: string, level?: Sentry.SeverityLevel) => {
  Sentry.addBreadcrumb({
    message,
    category: category || 'custom',
    level: level || 'info',
    timestamp: Date.now() / 1000,
  });
};

// 设置标签
export const setTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

// 设置上下文
export const setContext = (key: string, context: Record<string, any>) => {
  Sentry.setContext(key, context);
};