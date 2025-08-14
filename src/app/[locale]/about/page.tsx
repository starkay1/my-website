import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import type { Locale } from '@/types';

// 动态导入所有组件以避免 SSR 问题
const AboutHero = dynamic(() => import('@/components/about').then(mod => ({ default: mod.AboutHero })), { ssr: false });
const CompanyStory = dynamic(() => import('@/components/about').then(mod => ({ default: mod.CompanyStory })), { ssr: false });
const TeamSection = dynamic(() => import('@/components/about').then(mod => ({ default: mod.TeamSection })), { ssr: false });
const CompanyValues = dynamic(() => import('@/components/about').then(mod => ({ default: mod.CompanyValues })), { ssr: false });
const Achievements = dynamic(() => import('@/components/about').then(mod => ({ default: mod.Achievements })), { ssr: false });
const Timeline = dynamic(() => import('@/components/about').then(mod => ({ default: mod.Timeline })), { ssr: false });
const Leadership = dynamic(() => import('@/components/about').then(mod => ({ default: mod.Leadership })), { ssr: false });
const OfficeTour = dynamic(() => import('@/components/about').then(mod => ({ default: mod.OfficeTour })), { ssr: false });

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

  // 在静态构建时使用固定语言环境
  const staticLocale = process.env.GITHUB_PAGES === 'true' ? 'zh-CN' : locale;
  const t = await getTranslations({ locale: staticLocale, namespace: 'about' });

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