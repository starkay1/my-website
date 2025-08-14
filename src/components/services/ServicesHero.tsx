'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Button } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface ServicesHeroProps extends ComponentProps {}

export default function ServicesHero({ className }: ServicesHeroProps = {}) {
  const t = useTranslations('services.hero');

  const sectionClasses = cn(
    'relative min-h-screen flex items-center justify-center overflow-hidden',
    'bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900',
    className
  );

  return (
    <section className={sectionClasses}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ANIMATION_CONFIG.smooth}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, ...ANIMATION_CONFIG.smooth }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 rounded-full text-primary-300 text-sm font-medium backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t('badge', { default: '专业服务' })}
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="block text-white mb-2">
              {t('title.line1', { default: '全方位' })}
            </span>
            <span className="block bg-gradient-to-r from-primary-400 via-secondary-400 to-pink-400 bg-clip-text text-transparent">
              {t('title.line2', { default: '夜生活解决方案' })}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t('subtitle', { default: '从项目托管到品牌孵化，我们提供专业的夜生活娱乐空间管理与品牌建设服务' })}
          </p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...ANIMATION_CONFIG.smooth }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 text-gray-300">
              <Target className="w-6 h-6 text-blue-400" />
              <span className="font-medium">{t('feature1', { default: '精准定位' })}</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-300">
              <Zap className="w-6 h-6 text-purple-400" />
              <span className="font-medium">{t('feature2', { default: '快速执行' })}</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-300">
              <Sparkles className="w-6 h-6 text-pink-400" />
              <span className="font-medium">{t('feature3', { default: '卓越成果' })}</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, ...ANIMATION_CONFIG.smooth }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {t('cta.primary', { default: '立即咨询' })}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              {t('cta.secondary', { default: '查看案例' })}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, ...ANIMATION_CONFIG.smooth }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}