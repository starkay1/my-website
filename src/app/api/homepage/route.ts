import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

// GET /api/homepage - 获取主页配置
export async function GET(request: NextRequest) {
  try {
    // 获取主页配置
    const homepage = await prisma.homepage.findFirst({
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // 如果没有配置，返回默认配置
    if (!homepage) {
      const defaultConfig = {
        id: 'default',
        heroSection: {
          title: '全球夜生活品牌管理与孵化平台',
          subtitle: '提供夜店项目托管、品牌顾问、品牌孵化与授权服务，帮助项目高效起盘与稳定增长',
          backgroundType: 'gradient',
          backgroundImage: '',
          backgroundVideo: '',
          overlayOpacity: 0.6,
          ctaText: '获取方案',
          ctaSecondaryText: 'WhatsApp联系',
          showCta: true,
          showSecondaryCta: true
        },
        aboutSection: {
          title: '关于我们',
          content: 'SpacePlus Worldwide 是全球领先的夜生活品牌管理与孵化平台...',
          showSection: true
        },
        servicesSection: {
          title: '我们的服务',
          subtitle: '专业的夜生活品牌解决方案',
          showSection: true
        },
        casesSection: {
          title: '成功案例',
          subtitle: '我们的项目成果',
          showSection: true,
          featuredOnly: true,
          maxItems: 6
        },
        clientsSection: {
          title: '合作伙伴',
          showSection: true
        },
        contactSection: {
          title: '联系我们',
          subtitle: '开始您的项目',
          showSection: true
        },
        seoSettings: {
          title: 'SpacePlus Worldwide - 全球夜生活品牌管理平台',
          description: '专业的夜生活品牌管理与孵化服务，提供项目托管、品牌顾问、品牌孵化与授权服务',
          keywords: ['夜生活', '品牌管理', '项目孵化', '夜店管理']
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        data: defaultConfig
      });
    }

    return NextResponse.json({
      success: true,
      data: homepage
    });

  } catch (error) {
    console.error('获取主页配置失败:', error);
    return NextResponse.json(
      { success: false, message: '获取主页配置失败' },
      { status: 500 }
    );
  }
}

// PUT /api/homepage - 更新主页配置
export async function PUT(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await authenticateRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: '权限不足' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // 验证必要字段
    if (!body.heroSection || !body.heroSection.title) {
      return NextResponse.json(
        { success: false, message: '缺少必要的配置信息' },
        { status: 400 }
      );
    }

    // 查找现有配置
    const existingHomepage = await prisma.homepage.findFirst();

    let homepage;
    if (existingHomepage) {
      // 更新现有配置
      homepage = await prisma.homepage.update({
        where: { id: existingHomepage.id },
        data: {
          heroSection: body.heroSection,
          aboutSection: body.aboutSection,
          servicesSection: body.servicesSection,
          casesSection: body.casesSection,
          clientsSection: body.clientsSection,
          contactSection: body.contactSection,
          seoSettings: body.seoSettings,
          isActive: body.isActive ?? true,
          updatedAt: new Date()
        }
      });
    } else {
      // 创建新配置
      homepage = await prisma.homepage.create({
        data: {
          heroSection: body.heroSection,
          aboutSection: body.aboutSection,
          servicesSection: body.servicesSection,
          casesSection: body.casesSection,
          clientsSection: body.clientsSection,
          contactSection: body.contactSection,
          seoSettings: body.seoSettings,
          isActive: body.isActive ?? true
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: homepage,
      message: '主页配置更新成功'
    });

  } catch (error) {
    console.error('更新主页配置失败:', error);
    return NextResponse.json(
      { success: false, message: '更新主页配置失败' },
      { status: 500 }
    );
  }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}