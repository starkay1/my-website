'use client';

import { motion } from 'framer-motion';
import { Quote, Star, User } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
  avatar: string;
}

interface TestimonialQuoteProps extends ComponentProps {
  testimonial: Testimonial;
}

export default function TestimonialQuote({ testimonial, className }: TestimonialQuoteProps) {
  return (
    <section className={cn('py-20 lg:py-32 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 relative overflow-hidden', className)}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm mb-6">
            <Star className="w-4 h-4 mr-2" />
            客户评价
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="block text-white mb-2">
              客户的
            </span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              真实反馈
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            听听客户对我们服务的真实评价和项目体验
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <Card variant="elevated" className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center">
                {/* Quote Icon */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, ...ANIMATION_CONFIG.smooth }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <Quote className="w-16 h-16 text-blue-400 mx-auto" />
                </motion.div>

                {/* Quote Text */}
                <motion.blockquote
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, ...ANIMATION_CONFIG.smooth }}
                  viewport={{ once: true }}
                  className="text-2xl lg:text-3xl text-white leading-relaxed mb-8 font-light italic"
                >
                  "{testimonial.quote}"
                </motion.blockquote>

                {/* Rating */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, ...ANIMATION_CONFIG.smooth }}
                  viewport={{ once: true }}
                  className="flex justify-center items-center space-x-1 mb-8"
                >
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-3 text-gray-300 font-medium">
                    5.0 / 5.0
                  </span>
                </motion.div>

                {/* Author Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, ...ANIMATION_CONFIG.smooth }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center space-y-4"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20">
                      {testimonial.avatar ? (
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <User className="w-10 h-10 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Verified Badge */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Author Details */}
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-white mb-1">
                      {testimonial.author}
                    </h4>
                    <p className="text-blue-300 font-medium">
                      {testimonial.title}
                    </p>
                    <p className="text-gray-400">
                      {testimonial.company}
                    </p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                4.9/5.0
              </div>
              <p className="text-gray-300 text-sm">
                平均客户评分
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                98%
              </div>
              <p className="text-gray-300 text-sm">
                客户推荐率
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Quote className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                150+
              </div>
              <p className="text-gray-300 text-sm">
                客户评价
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            想要获得同样的成功？
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            让我们为您提供专业的咨询服务，帮助您的企业实现突破性增长
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              免费咨询
            </button>
            <button className="px-8 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300">
              查看更多案例
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}