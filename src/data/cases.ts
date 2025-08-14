import type { Case } from '@/types';

// 案例数据
export const casesData: Case[] = [
  {
    id: 'shanghai-luxury-club',
    slug: 'shanghai-luxury-club',
    title: '上海顶级夜店品牌重塑',
    subtitle: '传统夜店的现代化转型之路',
    excerpt: '通过全面的品牌重塑和运营优化，帮助传统夜店实现现代化转型，营收增长200%',
    client: 'Luxe Club Shanghai',
    industry: '夜生活娱乐',
    location: '上海, 中国',
    duration: '8个月',
    teamSize: '12人',
    budget: '¥2,000,000',
    status: 'completed',
    featured: true,
    publishedAt: '2024-01-15',
    coverImage: '/cases/case-1.jpg',
    gallery: [
      '/cases/shanghai-club-1.jpg',
      '/cases/shanghai-club-2.jpg',
      '/cases/shanghai-club-3.jpg',
      '/cases/shanghai-club-4.jpg'
    ],
    tags: ['品牌重塑', '运营优化', '现代化转型', '夜店管理'],
    category: 'brand-transformation',
    overview: {
      challenge: '客户是一家经营15年的传统夜店，面临客流下降、品牌老化、竞争激烈等问题。疫情后恢复缓慢，急需全面转型。',
      solution: '我们制定了全方位的品牌重塑策略，包括视觉形象升级、空间重新设计、服务流程优化、营销策略革新等。',
      results: '8个月内实现营收增长200%，客户满意度提升至92%，成为上海夜生活地标之一。'
    },
    challenges: [
      {
        title: '品牌老化严重',
        description: '15年的品牌形象已经过时，无法吸引年轻消费群体，客流量持续下降。',
        impact: '月客流量从5000人降至2000人，营收下滑60%'
      },
      {
        title: '竞争环境激烈',
        description: '周边新开业的现代化夜店抢占市场份额，传统经营模式难以应对。',
        impact: '市场份额从30%降至12%'
      },
      {
        title: '服务体验落后',
        description: '服务流程陈旧，员工培训不足，客户体验与现代标准差距较大。',
        impact: '客户投诉率高达15%，复购率仅25%'
      }
    ],
    solutions: [
      {
        title: '品牌视觉重塑',
        description: '全新的品牌标识设计，现代化的视觉语言，打造年轻时尚的品牌形象。',
        implementation: [
          '品牌标识重新设计',
          '视觉识别系统建立',
          '空间装修升级',
          '宣传物料更新'
        ]
      },
      {
        title: '服务流程优化',
        description: '建立标准化服务流程，提升员工专业素养，打造卓越客户体验。',
        implementation: [
          'SOP标准制定',
          '员工培训体系',
          '服务质量监控',
          '客户反馈机制'
        ]
      },
      {
        title: '数字化营销',
        description: '构建全渠道营销体系，精准触达目标客群，提升品牌知名度。',
        implementation: [
          '社交媒体运营',
          '会员体系建立',
          '活动策划执行',
          '数据分析优化'
        ]
      }
    ],
    results: {
      metrics: [
        {
          label: '营收增长',
          value: '200%',
          description: '8个月内月营收从300万增长至900万',
          trend: 'up'
        },
        {
          label: '客流量提升',
          value: '150%',
          description: '月客流量从2000人增长至5000人',
          trend: 'up'
        },
        {
          label: '客户满意度',
          value: '92%',
          description: '客户满意度从65%提升至92%',
          trend: 'up'
        },
        {
          label: '复购率',
          value: '75%',
          description: '客户复购率从25%提升至75%',
          trend: 'up'
        }
      ],
      achievements: [
        '获得上海夜生活最佳体验奖',
        '成为抖音网红打卡地',
        '月度营收突破1000万',
        '员工满意度达到88%'
      ]
    },
    process: [
      {
        phase: '诊断分析',
        duration: '2周',
        description: '深度调研现状，分析问题根源',
        deliverables: ['现状分析报告', '竞争对手分析', '客户调研报告'],
        color: 'primary'
      },
      {
        phase: '策略制定',
        duration: '3周',
        description: '制定全面转型策略方案',
        deliverables: ['品牌策略方案', '运营优化计划', '营销推广策略'],
        color: 'secondary'
      },
      {
        phase: '实施执行',
        duration: '4个月',
        description: '分阶段实施各项改进措施',
        deliverables: ['品牌形象升级', '服务流程优化', '营销活动执行'],
        color: 'accent'
      },
      {
        phase: '效果评估',
        duration: '1个月',
        description: '评估改进效果，持续优化',
        deliverables: ['效果评估报告', '优化建议', '后续规划'],
        color: 'primary'
      }
    ],
    testimonial: {
      quote: 'SpacePlus团队的专业能力超出了我们的预期。他们不仅帮助我们重塑了品牌形象，更重要的是改变了我们的经营理念。现在我们的夜店已经成为上海夜生活的新地标。',
      author: '张明',
      position: '总经理',
      company: 'Luxe Club Shanghai',
      avatar: '/avatars/zhang-ming.jpg',
      rating: 5
    },
    relatedCases: ['beijing-bar-chain', 'shenzhen-lounge-design']
  },
  {
    id: 'beijing-bar-chain',
    slug: 'beijing-bar-chain',
    title: '北京连锁酒吧品牌孵化',
    subtitle: '从单店到连锁的品牌扩张之路',
    excerpt: '帮助独立酒吧建立连锁品牌体系，成功开设5家分店，实现品牌标准化运营',
    client: 'Urban Bar Beijing',
    industry: '餐饮娱乐',
    location: '北京, 中国',
    duration: '12个月',
    teamSize: '15人',
    budget: '¥3,500,000',
    status: 'completed',
    featured: true,
    publishedAt: '2023-11-20',
    coverImage: '/cases/case-2.jpg',
    gallery: [
      '/cases/beijing-bar-1.jpg',
      '/cases/beijing-bar-2.jpg',
      '/cases/beijing-bar-3.jpg'
    ],
    tags: ['品牌孵化', '连锁扩张', '标准化运营', '酒吧管理'],
    category: 'brand-incubation',
    overview: {
      challenge: '客户拥有一家成功的独立酒吧，希望扩张为连锁品牌，但缺乏标准化运营经验和品牌管理能力。',
      solution: '我们为客户建立了完整的连锁品牌体系，包括品牌标准、运营手册、培训体系、质量控制等。',
      results: '12个月内成功开设5家分店，建立了标准化的连锁运营体系，总营收增长400%。'
    },
    challenges: [
      {
        title: '缺乏标准化体系',
        description: '单店运营经验无法直接复制，缺乏标准化的运营流程和管理体系。',
        impact: '扩张计划受阻，无法保证服务质量一致性'
      },
      {
        title: '品牌识别度不足',
        description: '品牌形象不够突出，缺乏独特的品牌定位和视觉识别系统。',
        impact: '难以在竞争激烈的市场中建立品牌优势'
      }
    ],
    solutions: [
      {
        title: '品牌体系建立',
        description: '建立完整的品牌识别系统和品牌管理体系。',
        implementation: [
          '品牌定位策略',
          '视觉识别系统',
          '品牌手册制定',
          '品牌传播策略'
        ]
      },
      {
        title: '标准化运营',
        description: '制定详细的运营标准和管理流程。',
        implementation: [
          '运营手册编写',
          '服务标准制定',
          '质量控制体系',
          '培训体系建立'
        ]
      }
    ],
    results: {
      metrics: [
        {
          label: '门店数量',
          value: '5家',
          description: '从1家店扩张至6家店（含原店）',
          trend: 'up'
        },
        {
          label: '总营收增长',
          value: '400%',
          description: '连锁体系总营收较原单店增长400%',
          trend: 'up'
        },
        {
          label: '品牌知名度',
          value: '85%',
          description: '在目标区域的品牌知名度达到85%',
          trend: 'up'
        }
      ],
      achievements: [
        '获得北京最佳连锁酒吧奖',
        '建立完善的加盟体系',
        '培训超过100名员工',
        '客户满意度保持90%以上'
      ]
    },
    process: [
      {
        phase: '品牌策划',
        duration: '6周',
        description: '制定品牌战略和视觉识别系统',
        deliverables: ['品牌策略', '视觉识别', '品牌手册'],
        color: 'primary'
      },
      {
        phase: '标准化建立',
        duration: '8周',
        description: '建立运营标准和管理体系',
        deliverables: ['运营手册', '培训体系', '质控标准'],
        color: 'secondary'
      },
      {
        phase: '试点开店',
        duration: '3个月',
        description: '开设首家标准化分店',
        deliverables: ['分店开业', '运营验证', '标准优化'],
        color: 'accent'
      },
      {
        phase: '规模扩张',
        duration: '5个月',
        description: '快速复制扩张模式',
        deliverables: ['4家分店', '团队培训', '品牌推广'],
        color: 'primary'
      }
    ],
    testimonial: {
      quote: '与SpacePlus的合作让我们从一家小酒吧发展成为知名连锁品牌。他们的专业指导和标准化体系为我们的快速扩张奠定了坚实基础。',
      author: '李华',
      position: '创始人',
      company: 'Urban Bar Beijing',
      avatar: '/avatars/li-hua.jpg',
      rating: 5
    },
    relatedCases: ['shanghai-luxury-club', 'shenzhen-lounge-design']
  },
  {
    id: 'shenzhen-lounge-design',
    slug: 'shenzhen-lounge-design',
    title: '深圳高端酒廊空间设计',
    subtitle: '现代奢华与东方美学的完美融合',
    excerpt: '为高端商务人群打造的奢华酒廊，融合现代设计与东方美学，成为深圳新地标',
    client: 'Platinum Lounge Shenzhen',
    industry: '高端娱乐',
    location: '深圳, 中国',
    duration: '6个月',
    teamSize: '10人',
    budget: '¥1,800,000',
    status: 'completed',
    featured: false,
    publishedAt: '2023-09-10',
    coverImage: '/cases/case-3.jpg',
    gallery: [
      '/cases/shenzhen-lounge-1.jpg',
      '/cases/shenzhen-lounge-2.jpg',
      '/cases/shenzhen-lounge-3.jpg'
    ],
    tags: ['空间设计', '高端定位', '东方美学', '商务娱乐'],
    category: 'space-design',
    overview: {
      challenge: '客户希望打造一个面向高端商务人群的奢华酒廊，要求在现代设计中融入东方文化元素。',
      solution: '我们设计了独特的空间布局和装饰方案，将现代奢华与东方美学完美结合，创造出独特的文化氛围。',
      results: '酒廊开业后迅速成为深圳高端商务人群的聚集地，月营收达到500万，获得多项设计奖项。'
    },
    challenges: [
      {
        title: '文化融合难题',
        description: '如何在现代奢华设计中自然融入东方文化元素，避免生硬拼接。',
        impact: '设计理念需要反复推敲和调整'
      },
      {
        title: '高端定位要求',
        description: '目标客群对空间品质和服务体验要求极高，容错率很低。',
        impact: '每个细节都需要精益求精'
      }
    ],
    solutions: [
      {
        title: '文化融合设计',
        description: '巧妙融合现代与传统元素，创造独特的空间美学。',
        implementation: [
          '东方元素提取',
          '现代材料运用',
          '空间层次设计',
          '灯光氛围营造'
        ]
      },
      {
        title: '精品化服务',
        description: '打造超越期待的服务体验和空间品质。',
        implementation: [
          '私密空间设计',
          '个性化服务',
          '高端设备配置',
          '细节品质把控'
        ]
      }
    ],
    results: {
      metrics: [
        {
          label: '月营收',
          value: '500万',
          description: '开业首月即达到500万营收',
          trend: 'up'
        },
        {
          label: '客户满意度',
          value: '96%',
          description: '高端客户满意度达到96%',
          trend: 'up'
        },
        {
          label: '设计奖项',
          value: '3项',
          description: '获得3项国际设计大奖',
          trend: 'up'
        }
      ],
      achievements: [
        '获得亚洲室内设计大奖',
        '入选深圳十大设计地标',
        '成为商务人群首选聚会场所',
        '被多家媒体专题报道'
      ]
    },
    process: [
      {
        phase: '概念设计',
        duration: '4周',
        description: '确定设计理念和整体风格',
        deliverables: ['设计概念', '风格定位', '空间规划'],
        color: 'primary'
      },
      {
        phase: '深化设计',
        duration: '6周',
        description: '详细设计和材料选择',
        deliverables: ['施工图纸', '材料方案', '灯光设计'],
        color: 'secondary'
      },
      {
        phase: '施工监理',
        duration: '3个月',
        description: '施工过程监督和质量控制',
        deliverables: ['施工监理', '质量验收', '调试优化'],
        color: 'accent'
      },
      {
        phase: '开业筹备',
        duration: '2周',
        description: '开业前的最终准备和调试',
        deliverables: ['设备调试', '员工培训', '试营业'],
        color: 'primary'
      }
    ],
    testimonial: {
      quote: 'SpacePlus的设计团队真正理解了我们的需求，创造出的空间既有现代感又不失文化底蕴。客户们都对这个环境赞不绝口。',
      author: '王总',
      position: '总经理',
      company: 'Platinum Lounge Shenzhen',
      avatar: '/avatars/wang-zong.jpg',
      rating: 5
    },
    relatedCases: ['shanghai-luxury-club', 'beijing-bar-chain']
  }
];

// 根据slug获取案例数据
export const getCaseBySlug = (slug: string): Case | undefined => {
  return casesData.find(caseItem => caseItem.slug === slug);
};

// 获取相关案例
export const getRelatedCases = (currentCaseId: string, limit: number = 3): Case[] => {
  return casesData
    .filter(caseItem => caseItem.id !== currentCaseId)
    .slice(0, limit);
};

// 获取特色案例
export const getFeaturedCases = (limit: number = 6): Case[] => {
  return casesData
    .filter(caseItem => caseItem.featured)
    .slice(0, limit);
};

// 根据分类获取案例
export const getCasesByCategory = (category: string): Case[] => {
  if (category === 'all') {
    return casesData;
  }
  return casesData.filter(caseItem => caseItem.category === category);
};

// 获取所有案例分类
export const getCaseCategories = () => {
  const categories = Array.from(new Set(casesData.map(caseItem => caseItem.category)));
  return [
    { value: 'all', label: '全部案例' },
    { value: 'brand-transformation', label: '品牌重塑' },
    { value: 'brand-incubation', label: '品牌孵化' },
    { value: 'space-design', label: '空间设计' },
    { value: 'management', label: '运营管理' }
  ];
};