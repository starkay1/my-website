import { NextRequest, NextResponse } from 'next/server';
import { CMSManager } from '@/lib/cms';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET /api/cms/media - 获取媒体文件列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const mimeType = searchParams.get('mimeType') || undefined;

    const result = await CMSManager.getMediaList({
      page,
      limit,
      mimeType,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('获取媒体列表失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// POST /api/cms/media - 上传媒体文件
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string || '';
    const caption = formData.get('caption') as string || '';

    if (!file) {
      return NextResponse.json({ error: '未选择文件' }, { status: 400 });
    }

    // 验证文件类型
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'video/mp4',
      'video/webm',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '不支持的文件类型' }, { status: 400 });
    }

    // 验证文件大小 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: '文件大小超过限制 (10MB)' }, { status: 400 });
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${fileExtension}`;

    // 创建上传目录
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'media');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 保存文件
    const filePath = join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // 生成访问 URL
    const url = `/uploads/media/${filename}`;

    // 保存到数据库
    const mediaData = {
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url,
      alt,
      caption,
      uploadedBy: (session.user as any).id,
      uploadedAt: new Date(),
    };

    const result = await CMSManager.uploadMedia(mediaData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('上传文件失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}