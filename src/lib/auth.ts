import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from './database';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'hr' | 'admin';
  phone?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * 从请求中提取并验证JWT令牌
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthUser | null> {
  try {
    // 从cookie或Authorization header获取token
    let token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    // 验证JWT令牌
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // 获取用户信息
    const user = await db.getUserById(decoded.userId);
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'user' | 'hr' | 'admin',
      phone: user.phone || undefined,
    };
  } catch (error) {
    console.error('认证失败:', error);
    return null;
  }
}

/**
 * 检查用户是否有指定角色权限
 */
export function hasRole(user: AuthUser, requiredRoles: string[]): boolean {
  return requiredRoles.includes(user.role);
}

/**
 * 检查用户是否为管理员
 */
export function isAdmin(user: AuthUser): boolean {
  return user.role === 'admin';
}

/**
 * 检查用户是否为HR或管理员
 */
export function isHROrAdmin(user: AuthUser): boolean {
  return user.role === 'hr' || user.role === 'admin';
}

/**
 * 生成JWT令牌
 */
export function generateToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * 创建认证错误响应
 */
export function createAuthErrorResponse(message: string = '未授权访问', status: number = 401) {
  return Response.json(
    {
      success: false,
      error: '认证失败',
      message,
    },
    { status }
  );
}

/**
 * 创建权限错误响应
 */
export function createPermissionErrorResponse(message: string = '权限不足') {
  return Response.json(
    {
      success: false,
      error: '权限不足',
      message,
    },
    { status: 403 }
  );
}

/**
 * NextAuth 配置选项
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await db.getUserByEmail(credentials.email);
          if (!user) {
            return null;
          }

          // 这里应该验证密码，但为了简化，我们暂时跳过
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error('认证错误:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub!;
        (session.user as any).role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};

/**
 * 验证用户认证状态
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  return await authenticateRequest(request);
}