import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// 为静态导出生成参数
export async function generateStaticParams() {
  try {
    const cases = await prisma.case.findMany({
      where: {
        publishedAt: {
          lte: new Date()
        }
      },
      select: {
        slug: true
      }
    });
    
    return cases.map((caseItem) => ({
      slug: caseItem.slug
    }));
  } catch (error) {
    console.error('Error generating static params for cases:', error);
    return [];
  }
}

// GET /api/cases/[slug] - 获取案例详情（前台）
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // 获取案例详情
    const caseData = await prisma.case.findUnique({
      where: {
        slug,
        // 只返回已发布的案例
        publishedAt: {
          lte: new Date()
        }
      }
    });
    
    if (!caseData) {
      return NextResponse.json(
        { success: false, message: '案例不存在' },
        { status: 404 }
      );
    }
    
    // 获取相关案例（同分类的其他案例）
    const relatedCases = await prisma.case.findMany({
      where: {
        category: caseData.category,
        id: {
          not: caseData.id
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
        coverImage: true,
        category: true,
        client: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        ...caseData,
        relatedCases
      }
    });
    
  } catch (error) {
    console.error('获取案例详情失败:', error);
    return NextResponse.json(
      { success: false, message: '获取案例详情失败' },
      { status: 500 }
    );
  }
}