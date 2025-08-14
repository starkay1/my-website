import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { db } from '@/lib/database';
import { authenticateRequest } from '@/lib/auth';

// 为静态导出生成参数 - 文件下载API不需要静态生成
export async function generateStaticParams() {
  return [];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id;

    // 验证用户身份（可选，根据需求决定是否需要认证）
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
    // 例如：只有文件上传者或管理员可以下载
    
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

    // 读取文件
    const fileBuffer = await readFile(file.path);

    // 设置响应头
    const headers = new Headers();
    headers.set('Content-Type', file.mimeType);
    headers.set('Content-Length', file.size.toString());
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`);
    headers.set('Cache-Control', 'private, max-age=3600'); // 缓存1小时

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('文件下载失败:', error);

    return NextResponse.json(
      {
        success: false,
        error: '下载失败',
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