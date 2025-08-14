import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { uploadResume, uploadImage } from '@/lib/upload';
import { db } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '未授权',
          message: '请先登录'
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string || 'resume';

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: '文件缺失',
          message: '请选择要上传的文件'
        },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (fileType !== 'resume' && fileType !== 'image') {
      return NextResponse.json(
        {
          success: false,
          error: '文件类型错误',
          message: '只支持简历文件(resume)或图片文件(image)'
        },
        { status: 400 }
      );
    }

    // 上传文件
    const uploadResult = fileType === 'resume' 
      ? await uploadResume(file, user.name)
      : await uploadImage(file, 'general');

    if (!uploadResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: '上传失败',
          message: uploadResult.error || '文件上传失败'
        },
        { status: 400 }
      );
    }

    // 保存文件信息到数据库
    const fileRecord = await db.createFile({
      filename: uploadResult.fileName!,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      path: uploadResult.filePath!,
      url: uploadResult.filePath!,
      uploadedBy: user.id,
    });

    return NextResponse.json({
      success: true,
      data: {
        fileId: fileRecord.id,
        fileName: uploadResult.fileName,
        fileSize: file.size,
        mimeType: file.type,
        filePath: uploadResult.filePath,
        downloadUrl: `/api/files/${fileRecord.id}/download`,
        previewUrl: `/api/files/${fileRecord.id}/preview`,
      },
      message: '文件上传成功'
    });
  } catch (error) {
    console.error('文件上传失败:', error);

    return NextResponse.json(
      {
        success: false,
        error: '上传失败',
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