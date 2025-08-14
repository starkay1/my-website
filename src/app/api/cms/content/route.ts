import { NextRequest, NextResponse } from 'next/server';
import { CMSManager } from '@/lib/cms';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// GET /api/cms/content - 获取内容列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const locale = searchParams.get('locale') || undefined;
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;

    const result = await CMSManager.getContentList({
      type,
      locale,
      status,
      page,
      limit,
      search,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('获取内容列表失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// POST /api/cms/content - 创建新内容
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    // 检查用户权限
    const userRole = (session.user as any).role;
    if (!['admin', 'editor'].includes(userRole)) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    const body = await request.json();
    
    // 添加作者信息
    const contentData = {
      ...body,
      authorId: (session.user as any).id,
    };

    const result = await CMSManager.createContent(contentData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('创建内容失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}