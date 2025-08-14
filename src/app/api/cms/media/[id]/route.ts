import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

// 为静态导出生成参数 - 管理API不需要静态生成
export async function generateStaticParams() {
  return [];
}

// GET /api/cms/media/[id] - 获取单个媒体文件
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const media = await prisma.media.findUnique({
      where: { id: params.id },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!media) {
      return NextResponse.json(
        { error: '媒体文件不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ media });
  } catch (error) {
    console.error('获取媒体文件失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// PUT /api/cms/media/[id] - 更新媒体文件信息
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { altText, title } = body;

    // 检查媒体文件是否存在
    const existingMedia = await prisma.media.findUnique({
      where: { id: params.id },
    });

    if (!existingMedia) {
      return NextResponse.json(
        { error: '媒体文件不存在' },
        { status: 404 }
      );
    }

    // 检查权限：只有管理员或文件上传者可以编辑
    if (
      (session.user as any).role !== 'admin' &&
      existingMedia.uploadedBy !== (session.user as any).id
    ) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    const updatedMedia = await prisma.media.update({
      where: { id: params.id },
      data: {
        alt: altText,
        caption: title,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ media: updatedMedia });
  } catch (error) {
    console.error('更新媒体文件失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/media/[id] - 删除媒体文件
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 检查媒体文件是否存在
    const existingMedia = await prisma.media.findUnique({
      where: { id: params.id },
    });

    if (!existingMedia) {
      return NextResponse.json(
        { error: '媒体文件不存在' },
        { status: 404 }
      );
    }

    // 检查权限：只有管理员或文件上传者可以删除
    if (
      (session.user as any).role !== 'admin' &&
      existingMedia.uploadedBy !== (session.user as any).id
    ) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    // 删除物理文件
    try {
      const filePath = join(process.cwd(), 'public', 'uploads', existingMedia.filename);
      await unlink(filePath);
    } catch (fileError) {
      console.warn('删除物理文件失败:', fileError);
      // 继续删除数据库记录，即使物理文件删除失败
    }

    // 删除数据库记录
    await prisma.media.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: '媒体文件删除成功' });
  } catch (error) {
    console.error('删除媒体文件失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}