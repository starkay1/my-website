import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { db } from '@/lib/database';
import { authenticateRequest } from '@/lib/auth';

// 为静态导出生成参数 - 文件预览API不需要静态生成
export async function generateStaticParams() {
  return [];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id;

    // 验证用户身份（可选）
    const user = await authenticateRequest(request);
    
    // 获取文件信息
    const file = await db.getFileById(fileId);
    
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: '文件不存在',
          message: '请求的文件未找到'
        },
        { status: 404 }
      );
    }

    // 检查文件权限（可选）
    // 如果需要权限控制，可以在这里添加逻辑
    
    // 检查物理文件是否存在
    if (!existsSync(file.path)) {
      return NextResponse.json(
        {
          success: false,
          error: '文件不存在',
          message: '文件已被删除或移动'
        },
        { status: 404 }
      );
    }

    // 检查文件类型是否支持预览
    const previewableTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'text/plain',
    ];

    if (!previewableTypes.includes(file.mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: '不支持预览',
          message: '该文件类型不支持在线预览，请下载后查看'
        },
        { status: 400 }
      );
    }

    // 读取文件
    const fileBuffer = await readFile(file.path);

    // 设置响应头
    const headers = new Headers();
    headers.set('Content-Type', file.mimeType);
    headers.set('Content-Length', file.size.toString());
    headers.set('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalName)}"`);
    headers.set('Cache-Control', 'private, max-age=3600'); // 缓存1小时
    
    // 对于PDF文件，添加特殊的安全头
    if (file.mimeType === 'application/pdf') {
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'SAMEORIGIN');
    }

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('文件预览失败:', error);

    return NextResponse.json(
      {
        success: false,
        error: '预览失败',
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