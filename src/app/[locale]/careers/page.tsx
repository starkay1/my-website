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
  const t = await getTranslations('careers');
  
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
  const t = await getTranslations('careers');
  
  return (
    <main className="min-h-screen">
      {/* 英雄区域 */}
      <CareersHero />
      
      {/* 职位列表 */}
      <JobsList searchParams={searchParams} />
      
      {/* 公司文化 */}
      <CompanyCulture />
      
      {/* 福利待遇 */}
      <Benefits />
      
      {/* 申请流程 */}
      <ApplicationProcess />
    </main>
  );
}