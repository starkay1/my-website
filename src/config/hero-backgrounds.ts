// Hero背景配置文件
// 可以在这里集中管理不同的背景设置

export interface HeroBackgroundConfig {
  type: 'gradient' | 'image' | 'video';
  image?: string;
  video?: string;
  overlayOpacity?: number;
  description?: string;
}

// 预设的背景配置
export const heroBackgroundConfigs: Record<string, HeroBackgroundConfig> = {
  // 默认渐变背景
  default: {
    type: 'gradient',
    overlayOpacity: 0.1,
    description: '默认渐变背景 - 简洁优雅'
  },
  
  // 夜生活主题图片背景
  nightlife: {
    type: 'image',
    image: '/backgrounds/nightlife-hero.jpg',
    overlayOpacity: 0.4,
    description: '夜生活主题背景 - 展现行业特色'
  },
  
  // 城市夜景背景
  cityscape: {
    type: 'image',
    image: '/backgrounds/city-night.jpg',
    overlayOpacity: 0.3,
    description: '城市夜景背景 - 现代都市感'
  },
  
  // 动态视频背景
  dynamic: {
    type: 'video',
    video: '/backgrounds/hero-video.mp4',
    overlayOpacity: 0.5,
    description: '动态视频背景 - 吸引眼球'
  },
  
  // 品牌展示背景
  brand: {
    type: 'image',
    image: '/backgrounds/brand-showcase.jpg',
    overlayOpacity: 0.2,
    description: '品牌展示背景 - 突出专业性'
  }
};

// 获取背景配置的辅助函数
export function getHeroBackgroundConfig(configName: string): HeroBackgroundConfig {
  return heroBackgroundConfigs[configName] || heroBackgroundConfigs.default;
}

// 使用示例:
// import { getHeroBackgroundConfig } from '@/config/hero-backgrounds';
// const bgConfig = getHeroBackgroundConfig('nightlife');
// <HeroSection 
//   backgroundType={bgConfig.type}
//   backgroundImage={bgConfig.image}
//   backgroundVideo={bgConfig.video}
//   overlayOpacity={bgConfig.overlayOpacity}
// />