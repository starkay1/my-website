'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent, Button } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface TestimonialsSectionProps extends ComponentProps {}

export default function TestimonialsSection({ className }: TestimonialsSectionProps = {}) {
  const t = useTranslations('services.testimonials');
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: '张明',
      title: 'CEO',
      company: '创新科技有限公司',
      avatar: '/images/avatars/avatar-1.jpg',
      rating: 5,
      content: '与SpacePlus合作是我们公司最明智的决定之一。他们不仅帮助我们重新梳理了业务流程，还大幅提升了我们的运营效率。项目完成后，我们的营收增长了40%。',
      results: [
        '营收增长 40%',
        '运营效率提升 60%',
        '客户满意度 95%'
      ],
      industry: '科技行业',
      projectType: '业务流程优化'
    },
    {
      id: 2,
      name: '李雅婷',
      title: '品牌总监',
      company: '时尚生活品牌',
      avatar: '/images/avatars/avatar-2.jpg',
      rating: 5,
      content: 'SpacePlus团队对品牌的理解令人印象深刻。他们帮助我们重新定位品牌，制定了全新的市场策略。现在我们的品牌知名度和市场份额都有了显著提升。',
      results: [
        '品牌知名度提升 80%',
        '市场份额增长 25%',
        '社交媒体关注度 3倍增长'
      ],
      industry: '时尚零售',
      projectType: '品牌重塑'
    },
    {
      id: 3,
      name: '王建华',
      title: '创始人',
      company: '绿色能源科技',
      avatar: '/images/avatars/avatar-3.jpg',
      rating: 5,
      content: '作为一家初创公司，我们在很多方面都需要专业指导。SpacePlus不仅提供了战略咨询，还帮助我们建立了完整的运营体系。现在我们已经成功完成了A轮融资。',
      results: [
        '成功完成A轮融资',
        '团队规模扩大 200%',
        '产品上线时间缩短 50%'
      ],
      industry: '新能源',
      projectType: '创业孵化'
    },
    {
      id: 4,
      name: '陈美玲',
      title: '运营总监',
      company: '智慧教育集团',
      avatar: '/images/avatars/avatar-4.jpg',
      rating: 5,
      content: 'SpacePlus帮助我们数字化转型的过程非常顺利。他们的专业团队不仅技术过硬，更重要的是能够理解我们的业务需求，提供了切实可行的解决方案。',
      results: [
        '数字化覆盖率 100%',
        '运营成本降低 30%',
        '用户体验评分 4.8/5'
      ],
      industry: '教育科技',
      projectType: '数字化转型'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className={cn('py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-blue-600 text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            {t('badge', { default: '客户评价' })}
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="block text-gray-900 mb-2">
              {t('title.line1', { default: '客户的成功' })}
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('title.line2', { default: '就是我们的成功' })}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle', { default: '听听我们的客户如何评价我们的服务' })}
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          className="mb-12"
        >
          <Card variant="elevated" className="max-w-4xl mx-auto bg-white shadow-2xl">
            <CardContent className="p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Quote and Content */}
                <div className="lg:col-span-2">
                  <Quote className="w-12 h-12 text-blue-500 mb-6" />
                  
                  <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
                    "{currentTestimonial.content}"
                  </blockquote>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-6">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-gray-600 font-medium">
                      {currentTestimonial.rating}.0
                    </span>
                  </div>
                  
                  {/* Author Info */}
                  <div className="border-t pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {currentTestimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {currentTestimonial.name}
                        </h4>
                        <p className="text-gray-600">
                          {currentTestimonial.title} · {currentTestimonial.company}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{currentTestimonial.industry}</span>
                          <span>•</span>
                          <span>{currentTestimonial.projectType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Results */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      {t('results_title', { default: '项目成果' })}
                    </h4>
                    <div className="space-y-3">
                      {currentTestimonial.results.map((result, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                          <span className="text-gray-700 font-medium">
                            {result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <Button
            variant="outline"
            size="sm"
            onClick={prevTestimonial}
            className="p-3"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                )}
              />
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextTestimonial}
            className="p-3"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              98%
            </div>
            <div className="text-gray-600">
              {t('stats.satisfaction', { default: '客户满意度' })}
            </div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              150+
            </div>
            <div className="text-gray-600">
              {t('stats.projects', { default: '成功项目' })}
            </div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              50+
            </div>
            <div className="text-gray-600">
              {t('stats.clients', { default: '合作客户' })}
            </div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              5年
            </div>
            <div className="text-gray-600">
              {t('stats.experience', { default: '行业经验' })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}