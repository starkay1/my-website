import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesList from '@/components/services/ServicesList';
import ProcessSection from '@/components/services/ProcessSection';
import PricingSection from '@/components/services/PricingSection';
import TestimonialsSection from '@/components/services/TestimonialsSection';
import ContactCTA from '@/components/services/ContactCTA';

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