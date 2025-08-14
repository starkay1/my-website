import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { socialScheduler } from '@/lib/social-scheduler';
import { socialScraper } from '@/lib/social-scraper';

// GET /api/admin/social-sources - 获取社交媒体源列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const platform = searchParams.get('platform');
    const isActive = searchParams.get('isActive');
    
    const skip = (page - 1) * pageSize;
    
    // 构建查询条件
    const where: any = {};
    
    if (platform && platform !== 'all') {
      where.platform = platform;
    }
    
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    
    const [items, total] = await Promise.all([
      prisma.socialSource.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        include: {
          _count: {
            select: {
              posts: true
            }
          }
        }
      }),
      prisma.socialSource.count({ where })
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
    
  } catch (error) {
    console.error('获取社交媒体源列表失败:', error);
    return NextResponse.json(
      { success: false, message: '获取社交媒体源列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/admin/social-sources - 创建社交媒体源
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      platform,
      username,
      accessToken,
      webhookUrl,
      isActive = true,
      syncInterval = 3600,
      config = {}
    } = body;
    
    // 验证必填字段
    if (!name || !platform) {
      return NextResponse.json(
        { success: false, message: '名称和平台为必填字段' },
        { status: 400 }
      );
    }
    
    // 验证平台类型
    const supportedPlatforms = ['instagram', 'wechat', 'weibo', 'twitter'];
    if (!supportedPlatforms.includes(platform.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: `不支持的平台类型: ${platform}` },
        { status: 400 }
      );
    }
    
    const source = await prisma.socialSource.create({
      data: {
        name,
        platform: platform.toLowerCase(),
        username,
        accessToken,
        webhookUrl,
        isActive,
        syncInterval,
        config
      }
    });
    
    // 如果源是活跃的，重新加载调度器
    if (isActive) {
      await socialScheduler.reloadSource(source.id);
    }
    
    return NextResponse.json({
      success: true,
      data: source,
      message: '社交媒体源创建成功'
    });
    
  } catch (error) {
    console.error('创建社交媒体源失败:', error);
    return NextResponse.json(
      { success: false, message: '创建社交媒体源失败' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/social-sources - 更新社交媒体源
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少源ID' },
        { status: 400 }
      );
    }
    
    const source = await prisma.socialSource.update({
      where: { id },
      data: updateData
    });
    
    // 重新加载调度器
    await socialScheduler.reloadSource(source.id);
    
    return NextResponse.json({
      success: true,
      data: source,
      message: '社交媒体源更新成功'
    });
    
  } catch (error) {
    console.error('更新社交媒体源失败:', error);
    return NextResponse.json(
      { success: false, message: '更新社交媒体源失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/social-sources - 删除社交媒体源
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少源ID' },
        { status: 400 }
      );
    }
    
    // 删除源及其相关的帖子
    await prisma.socialSource.delete({
      where: { id }
    });
    
    // 移除调度任务
    await socialScheduler.reloadSource(id);
    
    return NextResponse.json({
      success: true,
      message: '社交媒体源删除成功'
    });
    
  } catch (error) {
    console.error('删除社交媒体源失败:', error);
    return NextResponse.json(
      { success: false, message: '删除社交媒体源失败' },
      { status: 500 }
    );
  }
}