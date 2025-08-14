import axios from 'axios';
import * as cheerio from 'cheerio';
import { prisma } from './prisma';
import { SocialSource, SocialPost } from '@/generated/prisma';

export interface SocialPostData {
  platformId: string;
  title?: string;
  content: string;
  mediaUrls: string[];
  authorName?: string;
  authorAvatar?: string;
  publishedAt: Date;
  likes?: number;
  comments?: number;
  shares?: number;
  hashtags?: string[];
  location?: string;
}

export interface ScrapingResult {
  success: boolean;
  posts: SocialPostData[];
  error?: string;
}

export class SocialScraper {
  private static instance: SocialScraper;
  
  public static getInstance(): SocialScraper {
    if (!SocialScraper.instance) {
      SocialScraper.instance = new SocialScraper();
    }
    return SocialScraper.instance;
  }

  /**
   * 抓取Instagram内容（基础版本，实际需要Instagram Basic Display API）
   */
  async scrapeInstagram(source: SocialSource): Promise<ScrapingResult> {
    try {
      // 注意：Instagram官方API需要应用审核和访问令牌
      // 这里提供一个基础框架，实际使用需要配置Instagram Basic Display API
      
      if (!source.accessToken) {
        return {
          success: false,
          posts: [],
          error: 'Instagram访问令牌未配置'
        };
      }

      // 使用Instagram Basic Display API获取媒体
      const response = await axios.get(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink&access_token=${source.accessToken}`
      );

      const posts: SocialPostData[] = response.data.data.map((item: any) => ({
        platformId: item.id,
        title: item.caption ? item.caption.substring(0, 100) : undefined,
        content: item.caption || '',
        mediaUrls: item.media_type === 'IMAGE' ? [item.media_url] : 
                  item.media_type === 'VIDEO' ? [item.media_url, item.thumbnail_url] : [],
        publishedAt: new Date(item.timestamp),
        hashtags: this.extractHashtags(item.caption || '')
      }));

      return {
        success: true,
        posts
      };
    } catch (error) {
      console.error('Instagram抓取失败:', error);
      return {
        success: false,
        posts: [],
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 抓取微信公众号内容（模拟版本）
   * 注意：微信公众号没有公开API，这里提供一个框架
   */
  async scrapeWechat(source: SocialSource): Promise<ScrapingResult> {
    try {
      // 微信公众号抓取需要特殊处理，可能需要：
      // 1. 微信公众号平台API（需要认证）
      // 2. RSS订阅（如果有）
      // 3. 第三方服务（如微信公众号文章聚合平台）
      
      // 这里提供一个模拟实现
      const config = source.config as any;
      if (!config?.rssUrl && !config?.apiUrl) {
        return {
          success: false,
          posts: [],
          error: '微信公众号RSS或API地址未配置'
        };
      }

      let posts: SocialPostData[] = [];

      // 如果配置了RSS地址
      if (config.rssUrl) {
        const response = await axios.get(config.rssUrl);
        const $ = cheerio.load(response.data, { xmlMode: true });
        
        $('item').each((index, element) => {
          const $item = $(element);
          const title = $item.find('title').text();
          const description = $item.find('description').text();
          const link = $item.find('link').text();
          const pubDate = $item.find('pubDate').text();
          
          posts.push({
            platformId: link || `wechat_${Date.now()}_${index}`,
            title,
            content: description,
            mediaUrls: this.extractMediaFromContent(description),
            publishedAt: pubDate ? new Date(pubDate) : new Date(),
            hashtags: this.extractHashtags(description)
          });
        });
      }

      return {
        success: true,
        posts
      };
    } catch (error) {
      console.error('微信公众号抓取失败:', error);
      return {
        success: false,
        posts: [],
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 通用抓取方法
   */
  async scrapeSource(source: SocialSource): Promise<ScrapingResult> {
    switch (source.platform.toLowerCase()) {
      case 'instagram':
        return this.scrapeInstagram(source);
      case 'wechat':
        return this.scrapeWechat(source);
      default:
        return {
          success: false,
          posts: [],
          error: `不支持的平台: ${source.platform}`
        };
    }
  }

  /**
   * 保存抓取的内容到数据库
   */
  async savePosts(sourceId: string, platform: string, posts: SocialPostData[]): Promise<void> {
    for (const postData of posts) {
      try {
        // 检查是否已存在
        const existing = await prisma.socialPost.findUnique({
          where: {
            platform_platformId: {
              platform,
              platformId: postData.platformId
            }
          }
        });

        if (!existing) {
          await prisma.socialPost.create({
            data: {
              sourceId,
              platform,
              platformId: postData.platformId,
              title: postData.title,
              content: postData.content,
              mediaUrls: postData.mediaUrls,
              authorName: postData.authorName,
              authorAvatar: postData.authorAvatar,
              publishedAt: postData.publishedAt,
              likes: postData.likes || 0,
              comments: postData.comments || 0,
              shares: postData.shares || 0,
              hashtags: postData.hashtags || [],
              location: postData.location
            }
          });
        }
      } catch (error) {
        console.error('保存社交媒体内容失败:', error);
      }
    }
  }

  /**
   * 自动将社交媒体内容转换为新闻
   */
  async convertToNews(postId: string): Promise<string | null> {
    try {
      const post = await prisma.socialPost.findUnique({
        where: { id: postId },
        include: { source: true }
      });

      if (!post || post.isProcessed) {
        return null;
      }

      // 生成新闻内容
      const slug = this.generateSlug(post.title || post.content);
      const excerpt = this.generateExcerpt(post.content);
      
      const news = await prisma.news.create({
        data: {
          slug,
          title: post.title || this.generateTitle(post.content),
          excerpt,
          content: this.formatContentForNews(post),
          category: 'social',
          authorName: post.authorName || post.source.name,
          authorAvatar: post.authorAvatar,
          publishedAt: post.publishedAt,
          image: post.mediaUrls && Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0 ? (post.mediaUrls as string[])[0] : undefined,
          tags: post.hashtags || [],
          source: post.platform,
          sourceUrl: `https://${post.platform}.com/p/${post.platformId}`,
          sourceId: post.platformId,
          autoGenerated: true
        }
      });

      // 标记为已处理
      await prisma.socialPost.update({
        where: { id: postId },
        data: {
          isProcessed: true,
          newsId: news.id
        }
      });

      return news.id;
    } catch (error) {
      console.error('转换为新闻失败:', error);
      return null;
    }
  }

  // 辅助方法
  private extractHashtags(text: string): string[] {
    const hashtags = text.match(/#[\w\u4e00-\u9fa5]+/g);
    return hashtags ? hashtags.map(tag => tag.substring(1)) : [];
  }

  private extractMediaFromContent(content: string): string[] {
    const mediaUrls: string[] = [];
    const imgMatches = content.match(/<img[^>]+src="([^"]+)"/g);
    if (imgMatches) {
      imgMatches.forEach(match => {
        const srcMatch = match.match(/src="([^"]+)"/);
        if (srcMatch) {
          mediaUrls.push(srcMatch[1]);
        }
      });
    }
    return mediaUrls;
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50) + '-' + Date.now();
  }

  private generateExcerpt(content: string): string {
    return content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
  }

  private generateTitle(content: string): string {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    return cleanContent.length > 50 ? cleanContent.substring(0, 50) + '...' : cleanContent;
  }

  private formatContentForNews(post: SocialPost): string {
    let content = post.content;
    
    // 添加媒体内容
    if (post.mediaUrls && Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0) {
      const mediaUrls = post.mediaUrls as string[];
      content += '\n\n';
      mediaUrls.forEach(url => {
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          content += `<img src="${url}" alt="社交媒体图片" style="max-width: 100%; height: auto;" />\n`;
        }
      });
    }

    // 添加来源信息
    content += `\n\n<p><small>来源：${post.platform} | 发布时间：${post.publishedAt.toLocaleDateString()}</small></p>`;
    
    return content;
  }
}

export const socialScraper = SocialScraper.getInstance();