import { useTranslations } from 'next-intl';
import HeroSection from '@/components/home/HeroSection';
import TrustSection from '@/components/home/TrustSection';
import ServicesOverview from '@/components/home/ServicesOverview';
import FeaturedCases from '@/components/home/FeaturedCases';
import MethodologySection from '@/components/home/MethodologySection';
import LeadFormSection from '@/components/home/LeadFormSection';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection 
        // 背景类型选项: 'gradient' | 'image' | 'video'
        backgroundType="gradient" // 默认渐变背景
        // backgroundType="image" // 使用图片背景
        // backgroundImage="/hero-bg.jpg" // 图片路径
        // backgroundType="video" // 使用视频背景
        // backgroundVideo="/hero-video.mp4" // 视频路径
        // overlayOpacity={0.3} // 覆盖层透明度 (0-1)
      />
      
      {/* Trust Section */}
      <TrustSection />
      
      {/* Services Overview */}
      <ServicesOverview />
      
      {/* Featured Cases */}
      <FeaturedCases />
      
      {/* Methodology Section */}
      <MethodologySection />
      
      {/* Lead Form Section */}
      <LeadFormSection />
    </div>
  );
}

// 为静态导出生成参数
export async function generateStaticParams() {
  return [
    { locale: 'zh-CN' },
    { locale: 'en' },
    { locale: 'th' }
  ];
}