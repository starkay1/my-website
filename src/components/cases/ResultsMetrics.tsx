'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface ResultsMetricsProps extends ComponentProps {
  results: {
    label: string;
    before: string;
    after: string;
    improvement: string;
    color: 'green' | 'blue' | 'purple' | 'orange';
  }[];
}

export default function ResultsMetrics({ results, className }: ResultsMetricsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: ANIMATION_CONFIG.smooth
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'from-green-500 to-emerald-500',
          text: 'text-green-600',
          bgLight: 'bg-green-50',
          borderLight: 'border-green-200'
        };
      case 'blue':
        return {
          bg: 'from-blue-500 to-blue-600',
          text: 'text-blue-600',
          bgLight: 'bg-blue-50',
          borderLight: 'border-blue-200'
        };
      case 'purple':
        return {
          bg: 'from-purple-500 to-purple-600',
          text: 'text-purple-600',
          bgLight: 'bg-purple-50',
          borderLight: 'border-purple-200'
        };
      case 'orange':
        return {
          bg: 'from-orange-500 to-orange-600',
          text: 'text-orange-600',
          bgLight: 'bg-orange-50',
          borderLight: 'border-orange-200'
        };
      default:
        return {
          bg: 'from-gray-500 to-gray-600',
          text: 'text-gray-600',
          bgLight: 'bg-gray-50',
          borderLight: 'border-gray-200'
        };
    }
  };

  const isImprovement = (improvement: string) => {
    return improvement.startsWith('+') || (!improvement.startsWith('-') && improvement !== '0%');
  };

  return (
    <section className={cn('py-20 lg:py-32 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-full text-green-600 text-sm font-medium mb-6">
            <BarChart3 className="w-4 h-4 mr-2" />
            项目成果
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="block text-gray-900 mb-2">
              数据说话
            </span>
            <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              成果显著
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            通过关键指标的对比，直观展示项目实施前后的显著变化
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16"
        >
          {results.map((metric, index) => {
            const colors = getColorClasses(metric.color);
            const isPositive = isImprovement(metric.improvement);
            
            return (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    {/* Icon */}
                    <div className={cn(
                      'w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br',
                      colors.bg
                    )}>
                      <Target className="w-8 h-8 text-white" />
                    </div>

                    {/* Label */}
                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                      {metric.label}
                    </h3>

                    {/* Before/After Comparison */}
                    <div className="space-y-4 mb-6">
                      {/* Before */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">项目前</p>
                        <p className="text-lg font-bold text-gray-700">
                          {metric.before}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center">
                        {isPositive ? (
                          <TrendingUp className="w-6 h-6 text-green-500" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-500" />
                        )}
                      </div>

                      {/* After */}
                      <div className={cn(
                        'rounded-lg p-3 border-2',
                        colors.bgLight,
                        colors.borderLight
                      )}>
                        <p className="text-xs text-gray-500 mb-1">项目后</p>
                        <p className={cn('text-lg font-bold', colors.text)}>
                          {metric.after}
                        </p>
                      </div>
                    </div>

                    {/* Improvement */}
                    <div className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-bold',
                      isPositive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    )}>
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {metric.improvement}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-2xl p-8 lg:p-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              项目总体成效
            </h3>
            <p className="text-gray-600">
              综合各项指标，项目取得了显著的成效
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ROI */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">ROI</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                450%
              </div>
              <p className="text-gray-600 text-sm">
                投资回报率
              </p>
            </div>

            {/* Timeline */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">6M</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                按时交付
              </div>
              <p className="text-gray-600 text-sm">
                项目周期
              </p>
            </div>

            {/* Satisfaction */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">95%</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                客户满意
              </div>
              <p className="text-gray-600 text-sm">
                满意度评分
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              关键洞察
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              通过数据分析，我们发现了推动成功的关键因素
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                持续增长
              </h4>
              <p className="text-gray-600 text-sm">
                建立了可持续的增长机制，确保长期发展
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                精准执行
              </h4>
              <p className="text-gray-600 text-sm">
                通过精准的策略执行，实现了预期目标
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                数据驱动
              </h4>
              <p className="text-gray-600 text-sm">
                基于数据分析的决策，确保了项目的成功
              </p>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}