'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'hr' | 'admin';
  phone?: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  fallback,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // 首先检查localStorage中的用户信息
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (!storedUser || !storedToken) {
        router.push(redirectTo);
        return;
      }

      // 验证token是否有效
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
          
          // 检查权限
          if (requiredRoles.length > 0 && !requiredRoles.includes(data.data.role)) {
            setError('您没有访问此页面的权限');
            return;
          }
        } else {
          // Token无效，清除本地存储并重定向
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          router.push(redirectTo);
        }
      } else {
        // 请求失败，清除本地存储并重定向
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push(redirectTo);
      }
    } catch (error) {
      console.error('认证检查失败:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push(redirectTo);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">正在验证身份...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">正在跳转到登录页面...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook for getting current user
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('解析用户信息失败:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const hasRole = (roles: string[]) => {
    return user ? roles.includes(user.role) : false;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isHROrAdmin = () => {
    return user ? ['hr', 'admin'].includes(user.role) : false;
  };

  return {
    user,
    isLoading,
    logout,
    hasRole,
    isAdmin,
    isHROrAdmin,
  };
}