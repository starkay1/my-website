import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { socialScraper } from '@/lib/social-scraper';

// GET /api/admin/social-posts - 获取社交媒体帖子列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sourceId = searchParams.get('sourceId');
    const platform = searchParams.get('platform');
    const isProcessed = searchParams.get('isProcessed');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const skip = (page - 1) * pageSize;
    
    // 构建查询条件
    const where: any = {};
    
    if (sourceId) {
      where.sourceId = sourceId;
    }
    
    if (platform && platform !== 'all') {
      where.platform = platform;
    }
    
    if (isProcessed !== null && isProcessed !== undefined) {
      where.isProcessed = isProcessed === 'true';
    }
    
    if (startDate || endDate) {
      where.publishedAt = {};
      if (startDate) {
        where.publishedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.publishedAt.lte = new Date(endDate);
      }
    }
    
    const [items, total] = await Promise.all([
      prisma.socialPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: pageSize,
        include: {
          source: {
            select: {
              id: true,
              name: true,
              platform: true
            }
          }
        }
      }),
      prisma.socialPost.count({ where })
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
    console.error('获取社交媒体帖子列表失败:', error);
    return NextResponse.json(
      { success: false, message: '获取社交媒体帖子列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/admin/social-posts - 批量操作社交媒体帖子
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, postIds } = body;
    
    if (!action || !postIds || !Array.isArray(postIds)) {
      return NextResponse.json(
        { success: false, message: '缺少操作类型或帖子ID列表' },
        { status: 400 }
      );
    }
    
    switch (action) {
      case 'convert_to_news':
        // 批量转换为新闻
        let convertedCount = 0;
        const results = [];
        
        for (const postId of postIds) {
          try {
            const newsId = await socialScraper.convertToNews(postId);
            if (newsId) {
              convertedCount++;
              results.push({ postId, newsId, success: true });
            } else {
              results.push({ postId, success: false, error: '转换失败或已处理' });
            }
          } catch (error) {
            results.push({ 
              postId, 
              success: false, 
              error: error instanceof Error ? error.message : '未知错误' 
            });
          }
        }
        
        return NextResponse.json({
          success: true,
          message: `成功转换 ${convertedCount}/${postIds.length} 条帖子为新闻`,
          data: {
            convertedCount,
            totalCount: postIds.length,
            results
          }
        });
        
      case 'mark_processed':
        // 标记为已处理
        await prisma.socialPost.updateMany({
          where: {
            id: { in: postIds },
            isProcessed: false
          },
          data: {
            isProcessed: true
          }
        });
        
        return NextResponse.json({
          success: true,
          message: '帖子已标记为已处理'
        });
        
      case 'mark_unprocessed':
        // 标记为未处理
        await prisma.socialPost.updateMany({
          where: {
            id: { in: postIds }
          },
          data: {
            isProcessed: false,
            newsId: null
          }
        });
        
        return NextResponse.json({
          success: true,
          message: '帖子已标记为未处理'
        });
        
      case 'delete':
        // 删除帖子
        await prisma.socialPost.deleteMany({
          where: {
            id: { in: postIds }
          }
        });
        
        return NextResponse.json({
          success: true,
          message: `成功删除 ${postIds.length} 条帖子`
        });
        
      default:
        return NextResponse.json(
          { success: false, message: '不支持的操作类型' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('批量操作社交媒体帖子失败:', error);
    return NextResponse.json(
      { success: false, message: '批量操作失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/social-posts - 删除社交媒体帖子
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少帖子ID' },
        { status: 400 }
      );
    }
    
    // 检查是否已转换为新闻
    const post = await prisma.socialPost.findUnique({
      where: { id },
      select: { newsId: true }
    });
    
    if (post?.newsId) {
      // 如果已转换为新闻，询问是否同时删除新闻
      const deleteNews = searchParams.get('deleteNews') === 'true';
      
      if (deleteNews) {
        await prisma.news.delete({
          where: { id: post.newsId }
        });
      }
    }
    
    await prisma.socialPost.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: '帖子删除成功'
    });
    
  } catch (error) {
    console.error('删除社交媒体帖子失败:', error);
    return NextResponse.json(
      { success: false, message: '删除帖子失败' },
      { status: 500 }
    );
  }
}