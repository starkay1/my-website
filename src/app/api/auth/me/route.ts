import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function GET(request: NextRequest) {
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
      return NextResponse.json(
        {
          success: false,
          error: '未授权',
          message: '请先登录'
        },
        { status: 401 }
      );
    }

    // 验证JWT令牌
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // 获取用户信息
    const user = await db.getUserById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '用户不存在',
          message: '用户信息未找到'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: '获取用户信息成功'
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        {
          success: false,
          error: '令牌无效',
          message: '请重新登录'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '获取用户信息失败',
        message: '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}