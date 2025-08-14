import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CareersHero from '@/components/careers/CareersHero';
import JobsList from '@/components/careers/JobsList';
import CompanyCulture from '@/components/careers/CompanyCulture';
import Benefits from '@/components/careers/Benefits';
import ApplicationProcess from '@/components/careers/ApplicationProcess';
import type { PageProps } from '@/types';

// 生成页面元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // 在静态构建时使用固定语言环境
  const staticLocale = process.env.GITHUB_PAGES === 'true' ? 'zh-CN' : params.locale;
  const t = await getTranslations({ locale: staticLocale, namespace: 'careers' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      images: ['/og-careers.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
      images: ['/og-careers.jpg'],
    },
  };
}

// 职位页面组件
export default async function CareersPage({ params, searchParams }: PageProps) {
  // 在静态构建时使用固定语言环境
  const staticLocale = process.env.GITHUB_PAGES === 'true' ? 'zh-CN' : params.locale;
  const t = await getTranslations({ locale: staticLocale, namespace: 'careers' });
  
  // 在静态构建时避免使用searchParams
  const staticSearchParams = process.env.GITHUB_PAGES === 'true' ? {} : searchParams;
  
  return (
    <main className="min-h-screen">
      {/* 英雄区域 */}
      <CareersHero />
      
      {/* 职位列表 */}
      <JobsList searchParams={staticSearchParams} />
      
      {/* 公司文化 */}
      <CompanyCulture />
      
      {/* 福利待遇 */}
      <Benefits />
      
      {/* 申请流程 */}
      <ApplicationProcess />
    </main>
  );
}