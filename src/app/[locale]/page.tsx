import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

// 生成静态参数以支持静态导出
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh' },
  ];
}

// 动态导入所有组件以避免 SSR 问题
const HeroSection = dynamic(() => import('@/components/home/HeroSection'), { ssr: false });
const TrustSection = dynamic(() => import('@/components/home/TrustSection'), { ssr: false });
const ServicesOverview = dynamic(() => import('@/components/home/ServicesOverview'), { ssr: false });
const FeaturedCases = dynamic(() => import('@/components/home/FeaturedCases'), { ssr: false });
const MethodologySection = dynamic(() => import('@/components/home/MethodologySection'), { ssr: false });
const LeadFormSection = dynamic(() => import('@/components/home/LeadFormSection'), { ssr: false });

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

// 为静态导出生成参数 - 暂时禁用以避免SSR问题
// export async function generateStaticParams() {
//   return [
//     { locale: 'zh-CN' },
//     { locale: 'en' },
//     { locale: 'th' }
//   ];
// }