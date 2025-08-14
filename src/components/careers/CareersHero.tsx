'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  Users, 
  MapPin, 
  Briefcase, 
  TrendingUp,
  Heart,
  Award,
  Globe,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

// CareersHero Props接口
export interface CareersHeroProps extends ComponentProps {
  // 可以添加自定义属性
}

// CareersHero组件
export const CareersHero: React.FC<CareersHeroProps> = ({ className }) => {
  const t = useTranslations('careers');

  // 公司统计数据
  const stats = [
    {
      icon: Users,
      number: '200+',
      label: '团队成员',
      description: '来自全球的优秀人才'
    },
    {
      icon: MapPin,
      number: '15+',
      label: '办公城市',
      description: '覆盖亚太主要市场'
    },
    {
      icon: Briefcase,
      number: '50+',
      label: '开放职位',
      description: '多元化职业发展机会'
    },
    {
      icon: TrendingUp,
      number: '95%',
      label: '员工满意度',
      description: '优质的工作体验'
    }
  ];

  // 公司价值观
  const values = [
    {
      icon: Heart,
      title: '以人为本',
      description: '关注每一位员工的成长与发展'
    },
    {
      icon: Award,
      title: '追求卓越',
      description: '在每个项目中都力求完美'
    },
    {
      icon: Globe,
      title: '全球视野',
      description: '拥抱多元文化，放眼世界'
    },
    {
      icon: Zap,
      title: '创新驱动',
      description: '持续创新，引领行业发展'
    }
  ];

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
      
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/5 to-transparent rounded-full" />
      </div>

      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* 主内容区域 */}
        <div className="text-center mb-20">
          {/* 标题区域 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ANIMATION_CONFIG.smooth}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              加入我们
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                共创未来
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              在Spaceplus，我们相信每个人都有无限的潜能。
              <br className="hidden md:block" />
              加入我们的团队，一起打造全球领先的夜生活品牌管理平台。
            </p>
          </motion.div>

          {/* CTA按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              查看开放职位
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm transition-all duration-300"
            >
              了解公司文化
            </Button>
          </motion.div>
        </div>

        {/* 统计数据 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
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
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center group hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-white mb-2">
                  {stat.label}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 公司价值观 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              我们的价值观
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              这些核心价值观指导着我们的每一个决策，塑造着我们独特的企业文化
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.6 + index * 0.1 
                  }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-secondary-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                    <IconComponent className="w-10 h-10 text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span>正在招聘中</span>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CareersHero;