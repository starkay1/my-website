'use client';

import { ProtectedRoute, useAuth } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/separator';
import { User, Settings, FileText, Briefcase, LogOut, Shield } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const { user, logout, isAdmin, isHROrAdmin } = useAuth();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'hr':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return '管理员';
      case 'hr':
        return 'HR';
      default:
        return '普通用户';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">用户仪表板</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <Badge variant={getRoleBadgeVariant(user?.role || '')}>
                  {getRoleDisplayName(user?.role || '')}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 用户信息卡片 */}
          <Card>
            <CardHeader>
              <h3 className="flex items-center space-x-2 text-lg font-semibold">
                <User className="h-5 w-5" />
                <span>个人信息</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                查看和管理您的个人资料
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">姓名:</span>
                  <p className="text-sm text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">邮箱:</span>
                  <p className="text-sm text-gray-900">{user?.email}</p>
                </div>
                {user?.phone && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">电话:</span>
                    <p className="text-sm text-gray-900">{user.phone}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-500">角色:</span>
                  <Badge variant={getRoleBadgeVariant(user?.role || '')} className="ml-2">
                    {getRoleDisplayName(user?.role || '')}
                  </Badge>
                </div>
              </div>
              <Separator className="my-4" />
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                编辑资料
              </Button>
            </CardContent>
          </Card>

          {/* 职位管理 */}
          <Card>
            <CardHeader>
              <h3 className="flex items-center space-x-2 text-lg font-semibold">
                <Briefcase className="h-5 w-5" />
                <span>职位管理</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                浏览和申请职位
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/jobs">
                  <Button variant="outline" className="w-full justify-start">
                    <Briefcase className="h-4 w-4 mr-2" />
                    浏览职位
                  </Button>
                </Link>
                <Link href="/my-applications">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    我的申请
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 管理功能 - 仅HR和管理员可见 */}
          {isHROrAdmin() && (
            <Card>
              <CardHeader>
                <h3 className="flex items-center space-x-2 text-lg font-semibold">
                  <Shield className="h-5 w-5" />
                  <span>管理功能</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  系统管理和配置
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/admin">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      管理后台
                    </Button>
                  </Link>
                  {isAdmin() && (
                    <Link href="/admin/users">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        用户管理
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 文件管理 */}
          <Card>
            <CardHeader>
              <h3 className="flex items-center space-x-2 text-lg font-semibold">
                <FileText className="h-5 w-5" />
                <span>文件管理</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                上传和管理您的文件
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  上传简历
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  我的文件
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">快速操作</h3>
              <p className="text-sm text-gray-600 mt-1">
                常用功能快速入口
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start">
                    返回首页
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full justify-start">
                    联系我们
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}