// 内容管理系统核心功能
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

// 内容类型定义
export const ContentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, '标题不能为空'),
  slug: z.string().min(1, 'URL 别名不能为空'),
  content: z.string().min(1, '内容不能为空'),
  excerpt: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  type: z.enum(['page', 'post', 'service', 'case_study', 'news']),
  locale: z.enum(['en', 'zh-CN', 'th']).default('en'),
  featuredImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  publishedAt: z.date().optional(),
  authorId: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type Content = z.infer<typeof ContentSchema>;

// 媒体文件类型定义
export const MediaSchema = z.object({
  id: z.string().optional(),
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  uploadedBy: z.string(),
  uploadedAt: z.date().default(new Date()),
});

export type Media = z.infer<typeof MediaSchema>;

// 内容管理类
export class CMSManager {
  // 创建内容
  static async createContent(data: Omit<Content, 'id'>) {
    try {
      const validatedData = ContentSchema.omit({ id: true }).parse(data);
      
      // 检查 slug 是否唯一
      const existingContent = await prisma.content.findFirst({
        where: {
          slug: validatedData.slug,
          locale: validatedData.locale,
          type: validatedData.type,
        },
      });

      if (existingContent) {
        throw new Error('URL 别名已存在');
      }

      const content = await prisma.content.create({
        data: {
          ...validatedData,
          publishedAt: validatedData.status === 'published' ? new Date() : null,
        },
      });

      return { success: true, data: content };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '创建失败' };
    }
  }

  // 更新内容
  static async updateContent(id: string, data: Partial<Content>) {
    try {
      const validatedData = ContentSchema.partial().parse(data);
      
      // 如果更新 slug，检查唯一性
      if (validatedData.slug) {
        const existingContent = await prisma.content.findFirst({
          where: {
            slug: validatedData.slug,
            locale: validatedData.locale || undefined,
            type: validatedData.type || undefined,
            NOT: { id },
          },
        });

        if (existingContent) {
          throw new Error('URL 别名已存在');
        }
      }

      // 如果状态改为已发布，设置发布时间
      if (validatedData.status === 'published') {
        validatedData.publishedAt = new Date();
      }

      const content = await prisma.content.update({
        where: { id },
        data: validatedData,
      });

      return { success: true, data: content };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '更新失败' };
    }
  }

  // 删除内容
  static async deleteContent(id: string) {
    try {
      await prisma.content.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '删除失败' };
    }
  }

  // 获取内容列表
  static async getContentList({
    type,
    locale,
    status,
    page = 1,
    limit = 10,
    search,
  }: {
    type?: string;
    locale?: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    try {
      const where: any = {};
      
      if (type) where.type = type;
      if (locale) where.locale = locale;
      if (status) where.status = status;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [contents, total] = await Promise.all([
        prisma.content.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            author: {
              select: { id: true, name: true, email: true },
            },
          },
        }),
        prisma.content.count({ where }),
      ]);

      return {
        success: true,
        data: {
          contents,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '获取失败' };
    }
  }

  // 根据 ID 获取内容
  static async getContentById(id: string) {
    try {
      const content = await prisma.content.findUnique({
        where: { id },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!content) {
        throw new Error('内容不存在');
      }

      return { success: true, data: content };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '获取失败' };
    }
  }

  // 根据 slug 获取内容
  static async getContentBySlug(slug: string, locale: string = 'en', type?: string) {
    try {
      const where: any = {
        slug,
        locale,
        status: 'published',
      };
      
      if (type) where.type = type;

      const content = await prisma.content.findFirst({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!content) {
        throw new Error('内容不存在');
      }

      return { success: true, data: content };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '获取失败' };
    }
  }

  // 媒体文件管理
  static async uploadMedia(data: Omit<Media, 'id'>) {
    try {
      const validatedData = MediaSchema.omit({ id: true }).parse(data);
      
      const media = await prisma.media.create({
        data: validatedData,
      });

      return { success: true, data: media };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '上传失败' };
    }
  }

  static async getMediaList({
    page = 1,
    limit = 20,
    mimeType,
  }: {
    page?: number;
    limit?: number;
    mimeType?: string;
  }) {
    try {
      const where: any = {};
      if (mimeType) where.mimeType = { startsWith: mimeType };

      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where,
          orderBy: { uploadedAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.media.count({ where }),
      ]);

      return {
        success: true,
        data: {
          media,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '获取失败' };
    }
  }

  static async deleteMedia(id: string) {
    try {
      await prisma.media.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '删除失败' };
    }
  }

  // 生成唯一的 slug
  static async generateUniqueSlug(title: string, locale: string, type: string, excludeId?: string) {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.content.findFirst({
        where: {
          slug,
          locale,
          type,
          ...(excludeId && { NOT: { id: excludeId } }),
        },
      });

      if (!existing) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}

// 内容状态管理
export const ContentStatus = {
  DRAFT: 'draft' as const,
  PUBLISHED: 'published' as const,
  ARCHIVED: 'archived' as const,
};

// 内容类型
export const ContentType = {
  PAGE: 'page' as const,
  POST: 'post' as const,
  SERVICE: 'service' as const,
  CASE_STUDY: 'case_study' as const,
  NEWS: 'news' as const,
};

// 支持的语言
export const SupportedLocales = {
  EN: 'en' as const,
  ZH_CN: 'zh-CN' as const,
  TH: 'th' as const,
};

export default CMSManager;