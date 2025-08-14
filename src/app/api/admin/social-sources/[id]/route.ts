import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { socialScheduler } from '@/lib/social-scheduler';
import { socialScraper } from '@/lib/social-scraper';

interface RouteParams {
  params: {
    id: string;
  };
}

// 为静态导出生成参数 - 管理API不需要静态生成
export async function generateStaticParams() {
  return [];
}

// GET /api/admin/social-sources/[id] - 获取单个社交媒体源详情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    const source = await prisma.socialSource.findUnique({
      where: { id },
      include: {
        posts: {
          orderBy: { publishedAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            posts: true
          }
        }
      }
    });
    
    if (!source) {
      return NextResponse.json(
        { success: false, message: '社交媒体源不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: source
    });
    
  } catch (error) {
    console.error('获取社交媒体源详情失败:', error);
    return NextResponse.json(
      { success: false, message: '获取社交媒体源详情失败' },
      { status: 500 }
    );
  }
}

// POST /api/admin/social-sources/[id]/sync - 手动同步社交媒体源
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    const source = await prisma.socialSource.findUnique({
      where: { id }
    });
    
    if (!source) {
      return NextResponse.json(
        { success: false, message: '社交媒体源不存在' },
        { status: 404 }
      );
    }
    
    switch (action) {
      case 'sync':
        // 手动同步
        const result = await socialScheduler.triggerScraping(id);
        
        // 更新最后同步时间
        await prisma.socialSource.update({
          where: { id },
          data: { lastSync: new Date() }
        });
        
        return NextResponse.json({
          success: result.success,
          message: result.message
        });
        
      case 'test':
        // 测试连接
        const testResult = await socialScraper.scrapeSource(source);
        
        return NextResponse.json({
          success: testResult.success,
          message: testResult.success 
            ? `测试成功，找到 ${testResult.posts.length} 条内容` 
            : testResult.error,
          data: testResult.success ? {
            postsCount: testResult.posts.length,
            samplePosts: testResult.posts.slice(0, 3)
          } : null
        });
        
      case 'convert':
        // 转换未处理的帖子为新闻
        const unprocessedPosts = await prisma.socialPost.findMany({
          where: {
            sourceId: id,
            isProcessed: false
          },
          take: 10
        });
        
        let convertedCount = 0;
        for (const post of unprocessedPosts) {
          const newsId = await socialScraper.convertToNews(post.id);
          if (newsId) {
            convertedCount++;
          }
        }
        
        return NextResponse.json({
          success: true,
          message: `成功转换 ${convertedCount} 条帖子为新闻`,
          data: { convertedCount }
        });
        
      default:
        return NextResponse.json(
          { success: false, message: '不支持的操作' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('社交媒体源操作失败:', error);
    return NextResponse.json(
      { success: false, message: '操作失败' },
      { status: 500 }
    );
  }
}