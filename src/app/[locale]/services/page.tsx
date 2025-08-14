import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// 动态导入所有组件以避免 SSR 问题
const ServicesHero = dynamic(() => import('@/components/services/ServicesHero'), { ssr: false });
const ServicesList = dynamic(() => import('@/components/services/ServicesList'), { ssr: false });
const ProcessSection = dynamic(() => import('@/components/services/ProcessSection'), { ssr: false });
const PricingSection = dynamic(() => import('@/components/services/PricingSection'), { ssr: false });
const TestimonialsSection = dynamic(() => import('@/components/services/TestimonialsSection'), { ssr: false });
const ContactCTA = dynamic(() => import('@/components/services/ContactCTA'), { ssr: false });

// 生成静态参数以支持静态导出
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh' },
  ];
}

export const metadata: Metadata = {
  title: '专业服务 | Spaceplus Worldwide',
  description: '从项目托管到品牌孵化，我们提供全方位的夜生活娱乐空间解决方案',
  keywords: ['夜生活管理', '品牌孵化', '项目托管', '娱乐空间', '品牌顾问'],
};

export default function ServicesPage() {
  const t = useTranslations('services');

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <ServicesHero />
      
      {/* Services List */}
      <ServicesList />
      
      {/* Process Section */}
      <ProcessSection />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Contact CTA */}
      <ContactCTA />
    </div>
  );
}