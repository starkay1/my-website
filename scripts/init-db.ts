import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据库...');

  try {
    // 创建管理员用户
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.adminUser.upsert({
      where: { email: 'admin@spaceplus.com' },
      update: {},
      create: {
        email: 'admin@spaceplus.com',
        password: adminPassword,
        name: '系统管理员',
        role: 'admin',
      },
    });
    console.log('✓ 管理员用户创建成功:', admin.email);

    // 创建HR用户
    const hrPassword = await bcrypt.hash('hr123', 10);
    const hr = await prisma.user.upsert({
      where: { email: 'hr@spaceplus.com' },
      update: {},
      create: {
        email: 'hr@spaceplus.com',
        password: hrPassword,
        name: 'HR专员',
        role: 'hr',
        phone: '13800138001',
      },
    });
    console.log('✓ HR用户创建成功:', hr.email);

    // 创建普通用户
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        password: userPassword,
        name: '张三',
        role: 'user',
        phone: '13800138002',
      },
    });
    console.log('✓ 普通用户创建成功:', user.email);

    // 创建社交媒体来源
    const socialSources = [
      {
        name: '微信公众号',
        platform: 'wechat',
        isActive: true,
      },
      {
        name: '微博',
        platform: 'weibo',
        isActive: true,
      },
      {
        name: 'LinkedIn',
        platform: 'linkedin',
        isActive: true,
      },
    ];

    for (const source of socialSources) {
      await prisma.socialSource.create({
        data: source,
      });
    }
    console.log('✓ 社交媒体来源创建成功');

    // 创建示例职位
    const jobs = [
      {
        title: '前端开发工程师',
        description: '负责公司前端产品的开发和维护，要求熟悉React、TypeScript等技术栈。',
        requirements: ['本科及以上学历，计算机相关专业', '3年以上前端开发经验', '熟练掌握React、TypeScript、Next.js', '具备良好的代码规范和团队协作能力'],
        location: '北京',
        salary: '15000-25000',
        type: 'full-time',
        experience: 'mid',
        department: '技术部',
        status: 'published',
        postedAt: new Date().toISOString(),
        createdById: hr.id,
      },
      {
        title: '产品经理',
        description: '负责产品规划、需求分析和项目管理，推动产品迭代和优化。',
        requirements: ['本科及以上学历', '3-5年产品管理经验', '具备优秀的逻辑思维和沟通能力', '熟悉互联网产品设计流程'],
        location: '上海',
        salary: '20000-35000',
        type: 'full-time',
        experience: 'senior',
        department: '产品部',
        status: 'published',
        postedAt: new Date().toISOString(),
        createdById: hr.id,
      },
      {
        title: 'UI/UX设计师',
        description: '负责产品界面设计和用户体验优化，参与产品设计全流程。',
        requirements: ['设计相关专业背景', '2年以上UI/UX设计经验', '熟练使用Figma、Sketch等设计工具', '具备良好的审美和创新能力'],
        location: '深圳',
        salary: '12000-20000',
        type: 'full-time',
        experience: 'mid',
        department: '设计部',
        status: 'published',
        postedAt: new Date().toISOString(),
        createdById: hr.id,
      },
    ];

    for (const job of jobs) {
      await prisma.job.create({
        data: job,
      });
    }
    console.log('✓ 示例职位创建成功');

    // 创建示例新闻
    const news = [
      {
        slug: 'company-funding-round',
        title: '公司获得新一轮融资',
        excerpt: '公司完成B轮融资，加速发展步伐。',
        content: '我们很高兴地宣布，公司已成功完成B轮融资，将用于产品研发和市场拓展。',
        category: 'company',
        authorName: '管理员',
        authorTitle: '系统管理员',
        publishedAt: new Date(),
        tags: ['融资', '发展', '公司新闻'],
        featured: true,
      },
      {
        slug: 'new-product-launch',
        title: '新产品发布会成功举办',
        excerpt: '新产品发布会圆满成功，获得广泛关注。',
        content: '昨日，我们在北京成功举办了新产品发布会，吸引了众多行业专家和媒体关注。',
        category: 'product',
        authorName: '管理员',
        authorTitle: '系统管理员',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 昨天
        tags: ['产品', '发布会', '新闻'],
        featured: false,
      },
      {
        slug: 'team-building-activity',
        title: '团队建设活动回顾',
        excerpt: '团队建设活动成功举办，增强团队凝聚力。',
        content: '上周末，公司组织了团队建设活动，增进了同事间的友谊和团队凝聚力。',
        category: 'team',
        authorName: '管理员',
        authorTitle: '系统管理员',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 一周前
        tags: ['团队', '活动', '企业文化'],
        featured: false,
      },
    ];

    for (const newsItem of news) {
      await prisma.news.create({
        data: newsItem,
      });
    }
    console.log('✓ 示例新闻创建成功');

    // 创建示例案例
    const cases = [
      {
        slug: 'ecommerce-platform-refactor',
        title: '电商平台重构项目',
        subtitle: '大型电商平台技术架构重构',
        excerpt: '为某大型电商平台进行技术架构重构，提升系统性能和用户体验。',
        client: '某知名电商平台',
        industry: '电商',
        location: '北京',
        duration: '6个月',
        teamSize: '12人',
        budget: '500万',
        status: 'completed',
        featured: true,
        publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        coverImage: '/images/cases/ecommerce-cover.jpg',
        gallery: ['/images/cases/ecommerce-1.jpg', '/images/cases/ecommerce-2.jpg'],
        tags: ['电商', '重构', '微服务', '性能优化'],
        category: 'web-development',
        overviewChallenge: '客户是一家知名电商平台，随着业务快速发展，原有系统架构已无法满足需求，系统性能瓶颈严重。',
        overviewSolution: '我们采用微服务架构，重新设计了整个系统，包括用户服务、商品服务、订单服务等核心模块。',
        overviewResults: '系统性能提升300%，用户体验显著改善，获得客户高度认可，为后续业务扩展奠定了坚实基础。',
      },
      {
        slug: 'smart-manufacturing-system',
        title: '智能制造管理系统',
        subtitle: '制造业数字化转型解决方案',
        excerpt: '为制造业客户开发智能制造管理系统，实现生产流程数字化。',
        client: '某制造集团',
        industry: '制造业',
        location: '上海',
        duration: '8个月',
        teamSize: '15人',
        budget: '800万',
        status: 'completed',
        featured: true,
        publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        coverImage: '/images/cases/manufacturing-cover.jpg',
        gallery: ['/images/cases/manufacturing-1.jpg', '/images/cases/manufacturing-2.jpg'],
        tags: ['制造业', '数字化', 'IoT', 'AI'],
        category: 'enterprise-software',
        overviewChallenge: '传统制造企业需要数字化转型，提高生产效率和质量管控，但缺乏统一的管理平台。',
        overviewSolution: '开发了包含生产计划、质量管理、设备监控等模块的综合管理系统，集成IoT和AI技术。',
        overviewResults: '生产效率提升40%，质量问题减少60%，为客户创造了显著价值，成为行业数字化转型标杆。',
      },
    ];

    for (const caseItem of cases) {
      await prisma.case.create({
        data: caseItem,
      });
    }
    console.log('✓ 示例案例创建成功');

    console.log('\n🎉 数据库初始化完成！');
    console.log('\n默认账号信息：');
    console.log('管理员: admin@spaceplus.com / admin123');
    console.log('HR: hr@spaceplus.com / hr123');
    console.log('用户: user@example.com / user123');

  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });