'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  ArrowDown,
  Users,
  Globe,
  Award,
  Target,
  Heart,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

// AboutHero Props接口
export interface AboutHeroProps extends ComponentProps {
  // 可以添加自定义属性
}

// AboutHero组件
export const AboutHero: React.FC<AboutHeroProps> = ({ className }) => {
  const t = useTranslations('about');

  // 公司统计数据
  const stats = [
    {
      icon: Users,
      value: '500+',
      label: '专业团队',
      description: '来自全球的优秀人才'
    },
    {
      icon: Globe,
      value: '50+',
      label: '服务城市',
      description: '覆盖全球主要市场'
    },
    {
      icon: Award,
      value: '1000+',
      label: '成功项目',
      description: '累计完成项目数量'
    },
    {
      icon: Target,
      value: '98%',
      label: '客户满意度',
      description: '持续提供优质服务'
    }
  ];

  // 核心价值观
  const coreValues = [
    {
      icon: Heart,
      title: '以人为本',
      description: '关注每一个人的成长与发展'
    },
    {
      icon: Lightbulb,
      title: '创新驱动',
      description: '持续探索前沿技术与解决方案'
    },
    {
      icon: Rocket,
      title: '追求卓越',
      description: '在每个细节中体现专业品质'
    }
  ];

  const scrollToContent = () => {
    const element = document.getElementById('company-story');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={`relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden ${className}`}>
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative container mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* 左侧：主要内容 */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={ANIMATION_CONFIG.smooth}
              className="mb-8"
            >
              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Heart className="w-4 h-4 mr-2" />
                关于我们
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                创造
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  未来
                </span>
                <br />
                空间体验
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                我们是一家专注于空间设计与智能化解决方案的创新公司，
                致力于为客户打造独特、高效、可持续的空间环境。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary-500 to-secondary-600 hover:from-primary-600 hover:to-secondary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={scrollToContent}
              >
                了解更多
                <ArrowDown className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                联系我们
              </Button>
            </motion.div>

            {/* 核心价值观 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {coreValues.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      ...ANIMATION_CONFIG.smooth, 
                      delay: 0.3 + index * 0.1 
                    }}
                    whileHover={{ y: -5 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* 右侧：统计数据 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
            className="relative"
          >
            {/* 主要统计卡片 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  我们的成就
                </h2>
                <p className="text-gray-600">
                  用数字见证我们的专业实力
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        ...ANIMATION_CONFIG.smooth, 
                        delay: 0.4 + index * 0.1 
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-lg font-semibold text-gray-700 mb-1">
                        {stat.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stat.description}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 浮动装饰元素 */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg opacity-80"
            />
            
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl shadow-lg opacity-80"
            />
          </motion.div>
        </div>

        {/* 滚动指示器 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.button
            onClick={scrollToContent}
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
          >
            <span className="text-sm font-medium mb-2">向下滚动</span>
            <ArrowDown className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;