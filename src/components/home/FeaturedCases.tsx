'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent, CardMedia, Button } from '@/components/ui';
import { getFeaturedCases } from '@/data/cases';
import type { ComponentProps } from '@/types';

interface FeaturedCasesProps extends ComponentProps {}

const FeaturedCases = ({ className }: FeaturedCasesProps = {}) => {
  const t = useTranslations('home.cases');

  // Get featured cases from data
  const cases = getFeaturedCases(6);

  return (
    <section className="py-16 lg:py-24 bg-neutral-50/50 dark:bg-neutral-900/50 responsive-container">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 mobile-optimized desktop-optimized">
            <span className="text-gradient bg-gradient-to-r from-primary-600 to-secondary-600">成功案例</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mobile-optimized desktop-optimized">
            见证我们与全球顶级夜生活品牌的成功合作，每个案例都是增长的见证
          </p>
        </motion.div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/cases/${caseItem.slug}`}>
                <div className="card-ios-elevated overflow-hidden h-full transition-all duration-500 group-hover:-translate-y-2">
                  {/* Cover Image */}
                  <div className="relative aspect-16-9 mb-6 overflow-hidden rounded-2xl">
                    {/* Enhanced placeholder with better visual design */}
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 via-primary-200 to-secondary-200 dark:from-primary-900/30 dark:via-primary-800/20 dark:to-secondary-900/30 flex items-center justify-center relative">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/30 rounded-full" />
                        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-white/20 rounded-full" />
                        <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-white/25 rounded-full" />
                      </div>
                      
                      {/* Main Content */}
                      <div className="text-center z-10">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-xl">
                          <TrendingUp className="text-white" size={24} />
                        </div>
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm font-semibold">
                          {caseItem.title}
                        </span>
                      </div>
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
                      <ExternalLink className="text-white" size={24} />
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-primary-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
                        {caseItem.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    {/* Location */}
                    <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 text-sm">
                      <MapPin size={16} className="text-primary-500" />
                      <span>{caseItem.location}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors duration-300">
                      {caseItem.title}
                    </h3>

                    {/* Description */}
                    <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                      {caseItem.excerpt}
                    </p>

                    {/* Client */}
                    <div className="flex items-center space-x-2 p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-xl">
                      <TrendingUp size={16} className="text-secondary-600" />
                      <span className="text-secondary-700 dark:text-secondary-400 font-bold text-sm">
                        {caseItem.client}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {caseItem.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href="/cases"
            className="btn-ios-secondary group inline-flex items-center space-x-2 px-8 py-4 text-lg font-semibold"
          >
            <span>查看更多案例</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCases;