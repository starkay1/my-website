import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// GET /api/cases - 获取案例列表（前台）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') || '1';
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    
    const skip = (parseInt(page) - 1) * pageSize;
    
    // 构建查询条件
    const where: any = {
      // 只返回已发布的案例
      publishedAt: {
        lte: new Date()
      }
    };
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    // 获取案例列表
    const cases = await prisma.case.findMany({
      where,
      orderBy: {
        publishedAt: 'desc'
      },
      skip: limit ? 0 : skip,
      take: limit ? parseInt(limit) : pageSize,
      select: {
        id: true,
        slug: true,
        title: true,
        subtitle: true,
        excerpt: true,
        client: true,
        industry: true,
        location: true,
        duration: true,
        status: true,
        featured: true,
        publishedAt: true,
        coverImage: true,
        tags: true,
        category: true
      }
    });
    
    // 如果不是限制数量的请求，还需要返回总数
    let total = 0;
    if (!limit) {
      total = await prisma.case.count({ where });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        items: cases,
        total,
        page: parseInt(page),
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
    
  } catch (error) {
    console.error('获取案例列表失败:', error);
    return NextResponse.json(
      { success: false, message: '获取案例列表失败' },
      { status: 500 }
    );
  }
}