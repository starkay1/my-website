import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import CaseDetailHero from '@/components/cases/CaseDetailHero';
import CaseOverview from '@/components/cases/CaseOverview';
import ChallengesSolution from '@/components/cases/ChallengesSolution';
import ResultsMetrics from '@/components/cases/ResultsMetrics';
import ProcessTimeline from '@/components/cases/ProcessTimeline';
import TestimonialQuote from '@/components/cases/TestimonialQuote';
import RelatedCases from '@/components/cases/RelatedCases';
import ContactCTA from '@/components/services/ContactCTA';
// 获取案例详情数据
async function getCaseData(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/cases/${slug}`, {
      cache: 'no-store' // 确保获取最新数据
    });
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('获取案例数据失败:', error);
    return null;
  }
}

interface CaseDetailPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// 生成页面元数据
export async function generateMetadata(
  { params }: CaseDetailPageProps
): Promise<Metadata> {
  const caseData = await getCaseData(params.slug);
  
  if (!caseData) {
    return {
      title: '案例未找到 - SpacePlus',
      description: '抱歉，您访问的案例页面不存在。'
    };
  }

  return {
    title: `${caseData.title} - SpacePlus案例`,
    description: caseData.excerpt,
    keywords: Array.isArray(caseData.tags) ? caseData.tags.join(', ') : '',
    openGraph: {
      title: caseData.title,
      description: caseData.excerpt,
      type: 'article',
      images: [caseData.coverImage],
      locale: params.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: caseData.title,
      description: caseData.excerpt,
      images: [caseData.coverImage],
    },
  };
}

// 案例详情页面组件
export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const caseData = await getCaseData(params.slug);
  
  // 如果案例不存在，返回404
  if (!caseData) {
    notFound();
  }

  // 相关案例已经在API中获取
  const relatedCases = caseData.relatedCases || [];

  return (
    <main className="min-h-screen">
      {/* 案例英雄区域 */}
      <CaseDetailHero caseData={caseData} />
      
      {/* 案例概述 */}
      <CaseOverview 
        overview={{
          challenge: caseData.overviewChallenge || '',
          solution: caseData.overviewSolution || '',
          results: caseData.overviewResults || ''
        }}
        gallery={Array.isArray(caseData.gallery) ? caseData.gallery : []}
      />
      
      {/* 挑战与解决方案 - 暂时隐藏，等待数据结构完善 */}
      {/* <ChallengesSolution 
        challenges={caseData.challenges}
        solutions={caseData.solutions}
      /> */}
      
      {/* 项目流程 - 暂时隐藏，等待数据结构完善 */}
      {/* <ProcessTimeline process={caseData.process} /> */}
      
      {/* 结果与成效 - 暂时隐藏，等待数据结构完善 */}
      {/* <ResultsMetrics results={caseData.results} /> */}
      
      {/* 客户评价 - 暂时隐藏，等待数据结构完善 */}
      {/* <TestimonialQuote testimonial={caseData.testimonial} /> */}
      
      {/* 相关案例 */}
      <RelatedCases cases={relatedCases} />
      
      {/* 联系CTA */}
      <ContactCTA />
    </main>
  );
}

// 生成静态路径
export async function generateStaticParams() {
  // 在静态构建时返回空数组，避免API调用
  if (process.env.GITHUB_PAGES === 'true') {
    return [];
  }
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/cases`);
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    const cases = result.success ? result.data.items : [];
    
    return cases.map((caseItem: any) => ({
      slug: caseItem.slug,
    }));
  } catch (error) {
    console.error('生成静态路径失败:', error);
    return [];
  }
}