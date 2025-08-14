import * as cron from 'node-cron';
import { prisma } from './prisma';
import { socialScraper } from './social-scraper';

export class SocialScheduler {
  private static instance: SocialScheduler;
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  private isRunning = false;

  public static getInstance(): SocialScheduler {
    if (!SocialScheduler.instance) {
      SocialScheduler.instance = new SocialScheduler();
    }
    return SocialScheduler.instance;
  }

  /**
   * 启动调度器
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('社交媒体调度器已在运行中');
      return;
    }

    console.log('启动社交媒体调度器...');
    this.isRunning = true;

    // 加载所有活跃的社交媒体源
    await this.loadActiveSources();

    // 设置主调度任务（每小时检查一次）
    const mainTask = cron.schedule('0 * * * *', async () => {
      console.log('执行定时社交媒体抓取任务');
      await this.runScheduledScraping();
    });

    mainTask.start();
    this.tasks.set('main', mainTask);

    console.log('社交媒体调度器启动成功');
  }

  /**
   * 停止调度器
   */
  stop(): void {
    console.log('停止社交媒体调度器...');
    
    this.tasks.forEach((task, key) => {
      task.stop();
      task.destroy();
    });
    
    this.tasks.clear();
    this.isRunning = false;
    
    console.log('社交媒体调度器已停止');
  }

  /**
   * 加载活跃的社交媒体源
   */
  private async loadActiveSources(): Promise<void> {
    try {
      const sources = await prisma.socialSource.findMany({
        where: { isActive: true }
      });

      console.log(`加载了 ${sources.length} 个活跃的社交媒体源`);

      // 为每个源创建独立的调度任务
      for (const source of sources) {
        await this.scheduleSource(source);
      }
    } catch (error) {
      console.error('加载社交媒体源失败:', error);
    }
  }

  /**
   * 为特定源创建调度任务
   */
  private async scheduleSource(source: any): Promise<void> {
    const taskKey = `source_${source.id}`;
    
    // 如果已存在任务，先停止
    if (this.tasks.has(taskKey)) {
      const existingTask = this.tasks.get(taskKey)!;
      existingTask.stop();
      existingTask.destroy();
    }

    // 计算cron表达式（基于同步间隔）
    const cronExpression = this.generateCronExpression(source.syncInterval);
    
    const task = cron.schedule(cronExpression, async () => {
      console.log(`执行源 ${source.name} 的抓取任务`);
      await this.scrapeSource(source.id);
    });

    task.start();
    this.tasks.set(taskKey, task);
    
    console.log(`为源 ${source.name} 创建了调度任务，间隔: ${source.syncInterval}秒`);
  }

  /**
   * 执行定时抓取任务
   */
  private async runScheduledScraping(): Promise<void> {
    try {
      const sources = await prisma.socialSource.findMany({
        where: {
          isActive: true,
          OR: [
            { lastSync: null },
            {
              lastSync: {
                lt: new Date(Date.now() - 60 * 60 * 1000) // 1小时前
              }
            }
          ]
        }
      });

      console.log(`找到 ${sources.length} 个需要同步的源`);

      for (const source of sources) {
        await this.scrapeSource(source.id);
        
        // 更新最后同步时间
        await prisma.socialSource.update({
          where: { id: source.id },
          data: { lastSync: new Date() }
        });
      }
    } catch (error) {
      console.error('定时抓取任务执行失败:', error);
    }
  }

  /**
   * 抓取特定源的内容
   */
  private async scrapeSource(sourceId: string): Promise<void> {
    try {
      const source = await prisma.socialSource.findUnique({
        where: { id: sourceId }
      });

      if (!source || !source.isActive) {
        console.log(`源 ${sourceId} 不存在或未激活`);
        return;
      }

      console.log(`开始抓取源: ${source.name} (${source.platform})`);
      
      const result = await socialScraper.scrapeSource(source);
      
      if (result.success) {
        console.log(`成功抓取 ${result.posts.length} 条内容`);
        
        // 保存抓取的内容
        await socialScraper.savePosts(source.id, source.platform, result.posts);
        
        // 自动转换为新闻（如果配置了自动转换）
        const config = source.config as any;
        if (config?.autoConvertToNews) {
          await this.autoConvertPosts(source.id);
        }
        
        console.log(`源 ${source.name} 抓取完成`);
      } else {
        console.error(`源 ${source.name} 抓取失败:`, result.error);
      }
    } catch (error) {
      console.error(`抓取源 ${sourceId} 时发生错误:`, error);
    }
  }

  /**
   * 自动转换未处理的帖子为新闻
   */
  private async autoConvertPosts(sourceId: string): Promise<void> {
    try {
      const unprocessedPosts = await prisma.socialPost.findMany({
        where: {
          sourceId,
          isProcessed: false
        },
        take: 10 // 限制每次处理的数量
      });

      console.log(`找到 ${unprocessedPosts.length} 条未处理的帖子`);

      for (const post of unprocessedPosts) {
        const newsId = await socialScraper.convertToNews(post.id);
        if (newsId) {
          console.log(`帖子 ${post.id} 已转换为新闻 ${newsId}`);
        }
      }
    } catch (error) {
      console.error('自动转换帖子为新闻失败:', error);
    }
  }

  /**
   * 手动触发源的抓取
   */
  async triggerScraping(sourceId: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.scrapeSource(sourceId);
      return {
        success: true,
        message: '抓取任务已完成'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '抓取失败'
      };
    }
  }

  /**
   * 重新加载源的调度任务
   */
  async reloadSource(sourceId: string): Promise<void> {
    try {
      const source = await prisma.socialSource.findUnique({
        where: { id: sourceId }
      });

      if (source && source.isActive) {
        await this.scheduleSource(source);
      } else {
        // 移除任务
        const taskKey = `source_${sourceId}`;
        if (this.tasks.has(taskKey)) {
          const task = this.tasks.get(taskKey)!;
          task.stop();
          task.destroy();
          this.tasks.delete(taskKey);
        }
      }
    } catch (error) {
      console.error(`重新加载源 ${sourceId} 失败:`, error);
    }
  }

  /**
   * 生成cron表达式
   */
  private generateCronExpression(intervalSeconds: number): string {
    if (intervalSeconds < 60) {
      // 小于1分钟，每分钟执行
      return '* * * * *';
    } else if (intervalSeconds < 3600) {
      // 小于1小时，按分钟间隔
      const minutes = Math.floor(intervalSeconds / 60);
      return `*/${minutes} * * * *`;
    } else if (intervalSeconds < 86400) {
      // 小于1天，按小时间隔
      const hours = Math.floor(intervalSeconds / 3600);
      return `0 */${hours} * * *`;
    } else {
      // 1天或更长，每天执行
      return '0 0 * * *';
    }
  }

  /**
   * 获取调度器状态
   */
  getStatus(): {
    isRunning: boolean;
    activeTasks: number;
    taskList: string[];
  } {
    return {
      isRunning: this.isRunning,
      activeTasks: this.tasks.size,
      taskList: Array.from(this.tasks.keys())
    };
  }
}

export const socialScheduler = SocialScheduler.getInstance();

// 在应用启动时自动启动调度器（非测试环境且非静态构建）
if (process.env.NODE_ENV !== 'test' && process.env.GITHUB_PAGES !== 'true') {
  // 延迟启动，确保数据库连接已建立
  setTimeout(() => {
    socialScheduler.start().catch(console.error);
  }, 5000);
}

// 优雅关闭
process.on('SIGINT', () => {
  console.log('收到SIGINT信号，正在关闭社交媒体调度器...');
  socialScheduler.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在关闭社交媒体调度器...');
  socialScheduler.stop();
  process.exit(0);
});