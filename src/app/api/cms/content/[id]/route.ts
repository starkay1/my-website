import { NextRequest, NextResponse } from 'next/server';
import { CMSManager } from '@/lib/cms';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// 为静态导出生成参数 - 管理API不需要静态生成
export async function generateStaticParams() {
  return [];
}

// GET /api/cms/content/[id] - 获取单个内容
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const result = await CMSManager.getContentById(params.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('获取内容失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// PUT /api/cms/content/[id] - 更新内容
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    // 检查用户权限
    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;
    
    // 获取现有内容以检查权限
    const existingContent = await CMSManager.getContentById(params.id);
    if (!existingContent.success) {
      return NextResponse.json({ error: '内容不存在' }, { status: 404 });
    }

    // 检查是否有权限编辑（管理员或内容作者）
    if (userRole !== 'admin' && existingContent.data?.authorId !== userId) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    const body = await request.json();
    const result = await CMSManager.updateContent(params.id, body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('更新内容失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// DELETE /api/cms/content/[id] - 删除内容
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    // 检查用户权限
    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;
    
    // 获取现有内容以检查权限
    const existingContent = await CMSManager.getContentById(params.id);
    if (!existingContent.success) {
      return NextResponse.json({ error: '内容不存在' }, { status: 404 });
    }

    // 检查是否有权限删除（管理员或内容作者）
    if (userRole !== 'admin' && existingContent.data?.authorId !== userId) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    const result = await CMSManager.deleteContent(params.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除内容失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}