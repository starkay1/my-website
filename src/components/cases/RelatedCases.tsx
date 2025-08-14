'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent, CardMedia, Button } from '@/components/ui';
import type { ComponentProps } from '@/types';

import { casesData } from '@/data/cases';
import type { Case } from '@/types';

interface RelatedCasesProps extends ComponentProps {
  cases: Case[];
}

export default function RelatedCases({ cases, className }: RelatedCasesProps) {
  const filteredCases = cases.slice(0, 3);

  return (
    <section className={cn('py-20 lg:py-32 bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full text-blue-600 text-sm font-medium mb-6">
            <Tag className="w-4 h-4 mr-2" />
            相关案例
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="block text-gray-900 mb-2">
              更多
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              成功案例
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            探索我们为不同行业客户创造的卓越成果
          </p>
        </motion.div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {filteredCases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, ...ANIMATION_CONFIG.smooth }}
              viewport={{ once: true }}
            >
              <Card variant="elevated" className="group hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Case Image */}
                <CardMedia className="relative h-64 overflow-hidden">
                  <Image
                    src={caseItem.coverImage}
                    alt={caseItem.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium rounded-full">
                      {caseItem.category}
                    </span>
                  </div>
                  
                  {/* View Case Button */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white"
                    >
                      查看案例
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardMedia>

                <CardContent className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {caseItem.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {caseItem.publishedAt}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {caseItem.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {caseItem.excerpt}
                  </p>

                  {/* Category */}
                  <div className="mb-6">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-600 text-sm rounded-full">
                      {caseItem.category}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {caseItem.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link href={`/cases/${caseItem.slug}`} className="block">
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                    >
                      查看详情
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Cases CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="text-center mt-16 lg:mt-20"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              探索更多成功案例
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              查看我们为各行业客户创造的更多卓越成果，了解我们如何帮助企业实现突破性增长
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cases">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  查看所有案例
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  开始您的项目
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                50+
              </div>
              <p className="text-gray-600 text-sm">
                成功案例
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                98%
              </div>
              <p className="text-gray-600 text-sm">
                客户满意度
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                15+
              </div>
              <p className="text-gray-600 text-sm">
                服务行业
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                5年
              </div>
              <p className="text-gray-600 text-sm">
                专业经验
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}