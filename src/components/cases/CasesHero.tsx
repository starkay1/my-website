'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function CasesHero() {
  const t = useTranslations('cases');

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t('title', { default: '精彩案例' })}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('subtitle', { default: '探索我们的创意作品，每个项目都是独特的艺术表达' })}
          </p>
        </motion.div>
      </div>
    </section>
  );
}