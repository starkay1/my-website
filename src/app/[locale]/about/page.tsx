import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { 
  AboutHero,
  CompanyStory,
  TeamSection,
  CompanyValues,
  Achievements,
  Timeline,
  Leadership,
  OfficeTour
} from '@/components/about';
import type { Locale } from '@/types';

// 页面属性接口
interface AboutPageProps {
  params: {
    locale: Locale;
  };
}

// 生成页面元数据
export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = params;
  
  // 验证语言
  if (!['zh', 'en'].includes(locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      locale: locale,
      siteName: 'SpacePlus',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        'zh': '/zh/about',
        'en': '/en/about',
      },
    },
  };
}

// 关于我们页面组件
export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = params;
  
  // 验证语言
  if (!['zh', 'en'].includes(locale)) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* 英雄区域 */}
      <AboutHero />
      
      {/* 公司故事 */}
      <CompanyStory />
      
      {/* 发展历程 */}
      <Timeline />
      
      {/* 公司价值观 */}
      <CompanyValues />
      
      {/* 成就与荣誉 */}
      <Achievements />
      
      {/* 领导团队 */}
      <Leadership />
      
      {/* 团队介绍 */}
      <TeamSection />
      
      {/* 办公环境 */}
      <OfficeTour />
    </main>
  );
}