import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/database';

const registerSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  phone: z.string().optional(),
  role: z.enum(['user', 'hr', 'admin']).optional().default('user'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // 检查邮箱是否已存在
    const existingUser = await db.getUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: '邮箱已被注册',
          message: '该邮箱地址已被其他用户使用'
        },
        { status: 400 }
      );
    }

    // 创建新用户
    const user = await db.createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      phone: validatedData.phone,
      role: validatedData.role,
    });

    return NextResponse.json({
      success: true,
      data: user,
      message: '注册成功'
    });
  } catch (error) {
    console.error('用户注册失败:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: '数据验证失败',
          details: error.issues,
          message: '请检查输入数据'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '注册失败',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}