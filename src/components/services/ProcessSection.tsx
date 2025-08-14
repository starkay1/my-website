'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, FileText, Cog, Rocket, BarChart3, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface ProcessSectionProps extends ComponentProps {}

export default function ProcessSection({ className }: ProcessSectionProps = {}) {
  const t = useTranslations('services.process');

  const processSteps = [
    {
      id: 'analysis',
      icon: Search,
      title: t('analysis.title', { default: '深度分析' }),
      description: t('analysis.description', { default: '全面了解您的业务现状、市场环境和发展目标' }),
      details: [
        '业务现状评估',
        '市场竞争分析',
        '财务数据审核',
        '团队能力评估',
        '客户群体分析'
      ],
      duration: '1-2周',
      color: 'blue'
    },
    {
      id: 'strategy',
      icon: FileText,
      title: t('strategy.title', { default: '策略制定' }),
      description: t('strategy.description', { default: '基于分析结果，制定个性化的解决方案和实施计划' }),
      details: [
        '策略方案设计',
        '实施路径规划',
        '资源配置方案',
        '风险评估预案',
        '成功指标设定'
      ],
      duration: '1-2周',
      color: 'purple'
    },
    {
      id: 'implementation',
      icon: Cog,
      title: t('implementation.title', { default: '方案实施' }),
      description: t('implementation.description', { default: '专业团队驻场执行，确保方案高质量落地' }),
      details: [
        '团队部署到位',
        '系统工具导入',
        '流程标准执行',
        '实时监控调整',
        '问题快速响应'
      ],
      duration: '2-6个月',
      color: 'emerald'
    },
    {
      id: 'optimization',
      icon: Rocket,
      title: t('optimization.title', { default: '持续优化' }),
      description: t('optimization.description', { default: '基于数据反馈，持续优化和改进运营效果' }),
      details: [
        '数据分析反馈',
        '效果评估报告',
        '优化方案调整',
        '最佳实践总结',
        '经验知识传递'
      ],
      duration: '持续进行',
      color: 'orange'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  return (
    <section className={cn('py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm mb-6">
            <BarChart3 className="w-4 h-4 mr-2" />
            {t('badge', { default: '服务流程' })}
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="block text-white mb-2">
              {t('title.line1', { default: '科学化' })}
            </span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('title.line2', { default: '服务流程' })}
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('subtitle', { default: '标准化的服务流程，确保每个项目都能达到预期效果' })}
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <motion.div
                key={step.id}
                variants={itemVariants}
                className="relative"
              >
                <Card 
                  variant="elevated" 
                  className="h-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg',
                        step.color === 'blue' && 'bg-gradient-to-r from-blue-500 to-blue-600',
                        step.color === 'purple' && 'bg-gradient-to-r from-purple-500 to-purple-600',
                        step.color === 'emerald' && 'bg-gradient-to-r from-emerald-500 to-emerald-600',
                        step.color === 'orange' && 'bg-gradient-to-r from-orange-500 to-orange-600'
                      )}>
                        {index + 1}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className={cn(
                      'w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center',
                      step.color === 'blue' && 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-400',
                      step.color === 'purple' && 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 text-purple-400',
                      step.color === 'emerald' && 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-400',
                      step.color === 'orange' && 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 text-orange-400'
                    )}>
                      <Icon className="w-8 h-8" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Duration */}
                    <div className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4',
                      step.color === 'blue' && 'bg-blue-500/20 text-blue-300',
                      step.color === 'purple' && 'bg-purple-500/20 text-purple-300',
                      step.color === 'emerald' && 'bg-emerald-500/20 text-emerald-300',
                      step.color === 'orange' && 'bg-orange-500/20 text-orange-300'
                    )}>
                      {step.duration}
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center space-x-2 text-xs text-gray-400">
                          <CheckCircle2 className={cn(
                            'w-3 h-3 flex-shrink-0',
                            step.color === 'blue' && 'text-blue-400',
                            step.color === 'purple' && 'text-purple-400',
                            step.color === 'emerald' && 'text-emerald-400',
                            step.color === 'orange' && 'text-orange-400'
                          )} />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Connection Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-white/30 to-white/10 transform -translate-y-1/2" />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-300 mb-6">
            {t('cta_text', { default: '想了解我们如何帮助您的业务？' })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              {t('cta_primary', { default: '免费咨询' })}
            </button>
            <button className="px-8 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300">
              {t('cta_secondary', { default: '下载案例' })}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}