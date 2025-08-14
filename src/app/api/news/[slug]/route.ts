import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// GET /api/news/[slug] - 获取新闻详情（前台）
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // 获取新闻详情
    const newsData = await prisma.news.findUnique({
      where: {
        slug,
        // 只返回已发布的新闻
        publishedAt: {
          lte: new Date()
        }
      }
    });
    
    if (!newsData) {
      return NextResponse.json(
        { success: false, message: '新闻不存在' },
        { status: 404 }
      );
    }
    
    // 增加浏览量
    await prisma.news.update({
      where: { id: newsData.id },
      data: { views: newsData.views + 1 }
    });
    
    // 获取相关新闻（同分类的其他新闻）
    const relatedNews = await prisma.news.findMany({
      where: {
        category: newsData.category,
        id: {
          not: newsData.id
        },
        publishedAt: {
          lte: new Date()
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        image: true,
        category: true,
        publishedAt: true,
        readTime: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        ...newsData,
        views: newsData.views + 1, // 返回更新后的浏览量
        relatedNews
      }
    });
    
  } catch (error) {
    console.error('获取新闻详情失败:', error);
    return NextResponse.json(
      { success: false, message: '获取新闻详情失败' },
      { status: 500 }
    );
  }
}