import { NextRequest, NextResponse } from 'next/server';
import { socialScheduler } from '@/lib/social-scheduler';
import { prisma } from '@/lib/prisma';

// GET /api/admin/social-scheduler - 获取调度器状态
export async function GET(request: NextRequest) {
  try {
    const status = socialScheduler.getStatus();
    
    // 获取统计信息
    const [totalSources, activeSources, totalPosts, unprocessedPosts] = await Promise.all([
      prisma.socialSource.count(),
      prisma.socialSource.count({ where: { isActive: true } }),
      prisma.socialPost.count(),
      prisma.socialPost.count({ where: { isProcessed: false } })
    ]);
    
    // 获取最近的同步记录
    const recentSyncs = await prisma.socialSource.findMany({
      where: { lastSync: { not: null } },
      orderBy: { lastSync: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        platform: true,
        lastSync: true,
        isActive: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        scheduler: status,
        statistics: {
          totalSources,
          activeSources,
          totalPosts,
          unprocessedPosts
        },
        recentSyncs
      }
    });
    
  } catch (error) {
    console.error('获取调度器状态失败:', error);
    return NextResponse.json(
      { success: false, message: '获取调度器状态失败' },
      { status: 500 }
    );
  }
}

// POST /api/admin/social-scheduler - 控制调度器
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    switch (action) {
      case 'start':
        await socialScheduler.start();
        return NextResponse.json({
          success: true,
          message: '调度器已启动'
        });
        
      case 'stop':
        socialScheduler.stop();
        return NextResponse.json({
          success: true,
          message: '调度器已停止'
        });
        
      case 'restart':
        socialScheduler.stop();
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
        await socialScheduler.start();
        return NextResponse.json({
          success: true,
          message: '调度器已重启'
        });
        
      case 'sync_all':
        // 手动触发所有活跃源的同步
        const activeSources = await prisma.socialSource.findMany({
          where: { isActive: true },
          select: { id: true, name: true }
        });
        
        const syncResults = [];
        for (const source of activeSources) {
          try {
            const result = await socialScheduler.triggerScraping(source.id);
            syncResults.push({
              sourceId: source.id,
              sourceName: source.name,
              success: result.success,
              message: result.message
            });
            
            // 更新最后同步时间
            await prisma.socialSource.update({
              where: { id: source.id },
              data: { lastSync: new Date() }
            });
          } catch (error) {
            syncResults.push({
              sourceId: source.id,
              sourceName: source.name,
              success: false,
              message: error instanceof Error ? error.message : '同步失败'
            });
          }
        }
        
        const successCount = syncResults.filter(r => r.success).length;
        
        return NextResponse.json({
          success: true,
          message: `完成同步，成功: ${successCount}/${activeSources.length}`,
          data: {
            totalSources: activeSources.length,
            successCount,
            results: syncResults
          }
        });
        
      default:
        return NextResponse.json(
          { success: false, message: '不支持的操作' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('调度器操作失败:', error);
    return NextResponse.json(
      { success: false, message: '调度器操作失败' },
      { status: 500 }
    );
  }
}