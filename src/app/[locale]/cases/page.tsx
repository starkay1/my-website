import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CasesHero from '@/components/cases/CasesHero';
import CasesList from '@/components/cases/CasesList';
import CasesFilter from '@/components/cases/CasesFilter';
import ContactCTA from '@/components/services/ContactCTA';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('cases');
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

// 获取案例数据
async function getCasesData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/cases`, {
      cache: 'no-store' // 确保获取最新数据
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch cases');
    }
    
    const result = await response.json();
    return result.success ? result.data.items : [];
  } catch (error) {
    console.error('获取案例数据失败:', error);
    return [];
  }
}

// 获取案例分类
function getCaseCategories(cases: any[]) {
  const categories = [
    { id: 'all', label: '全部', count: cases.length }
  ];
  
  const categoryMap = new Map();
  cases.forEach(caseItem => {
    if (caseItem.category) {
      const count = categoryMap.get(caseItem.category) || 0;
      categoryMap.set(caseItem.category, count + 1);
    }
  });
  
  // 添加具体分类
  const categoryLabels: Record<string, string> = {
    'brand-transformation': '品牌重塑',
    'brand-incubation': '品牌孵化',
    'space-design': '空间设计',
    'management': '运营管理'
  };
  
  categoryMap.forEach((count, category) => {
    categories.push({
      id: category,
      label: categoryLabels[category] || category,
      count
    });
  });
  
  return categories;
}

export default async function CasesPage() {
  const t = await getTranslations('cases');
  const cases = await getCasesData();
  const categories = getCaseCategories(cases);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <CasesHero />
      <CasesFilter categories={categories} />
      <CasesList cases={cases} />
      <ContactCTA />
    </div>
  );
}