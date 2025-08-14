'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Settings, TrendingUp, Rocket, Users, BarChart3, Lightbulb, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent, Button } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface ServicesListProps extends ComponentProps {}

export default function ServicesList({ className }: ServicesListProps = {}) {
  const t = useTranslations('services.list');

  const services = [
    {
      id: 'management',
      icon: Settings,
      title: t('management.title', { default: '项目托管管理' }),
      description: t('management.description', { default: '专业团队全方位管理您的夜生活项目，确保运营效率和盈利能力' }),
      features: [
        '专业驻店团队管理',
        '数据驱动决策支持',
        '标准化运营流程',
        '实时监控与报告',
        '成本控制优化',
        '客户体验提升'
      ],
      benefits: [
        '降低运营成本 30%',
        '提升营收 150%+',
        '优化团队效率',
        '建立标准体系'
      ],
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'consulting',
      icon: TrendingUp,
      title: t('consulting.title', { default: '品牌战略顾问' }),
      description: t('consulting.description', { default: '深度品牌诊断与策略咨询，助力品牌在竞争中脱颖而出' }),
      features: [
        '深度品牌诊断分析',
        '市场竞争环境研究',
        '策略方案设计制定',
        '品牌定位与差异化',
        '营销策略规划',
        '培训体系搭建'
      ],
      benefits: [
        '品牌价值提升 200%+',
        '市场份额增长',
        '客户忠诚度提高',
        '竞争优势建立'
      ],
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'incubation',
      icon: Rocket,
      title: t('incubation.title', { default: '品牌孵化服务' }),
      description: t('incubation.description', { default: '从零到一打造夜生活品牌，提供全链条孵化支持' }),
      features: [
        '品牌命名与定位',
        '视觉识别系统设计',
        '空间设计与装修',
        '运营模式设计',
        '团队招募培训',
        '市场推广策略'
      ],
      benefits: [
        '快速品牌建立',
        '降低创业风险',
        '专业团队支持',
        '成功率提升 80%+'
      ],
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600'
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('title', { default: '专业服务体系' })}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle', { default: '三大核心服务，覆盖夜生活娱乐空间的全生命周期' })}
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12 lg:space-y-20"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className={cn(
                  'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center',
                  !isEven && 'lg:grid-flow-col-dense'
                )}
              >
                {/* Content */}
                <div className={cn('space-y-6', !isEven && 'lg:col-start-2')}>
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center',
                      `bg-gradient-to-br ${service.gradient} text-white shadow-lg`
                    )}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mt-2">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {t('features_title', { default: '服务内容' })}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className={cn('w-5 h-5', `text-${service.color}-500`)} />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {t('benefits_title', { default: '预期成果' })}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-3">
                          <BarChart3 className={cn('w-5 h-5', `text-${service.color}-500`)} />
                          <span className="text-gray-700 font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className={cn(`bg-gradient-to-r ${service.gradient} hover:opacity-90`)}
                  >
                    {t('learn_more', { default: '了解详情' })}
                  </Button>
                </div>

                {/* Visual */}
                <div className={cn('relative', !isEven && 'lg:col-start-1')}>
                  <Card variant="elevated" className="p-8 bg-white">
                    <CardContent className="space-y-6">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <div className={cn('text-2xl font-bold', `text-${service.color}-600`)}>
                            {index === 0 ? '150%+' : index === 1 ? '200%+' : '80%+'}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {index === 0 ? '营收提升' : index === 1 ? '品牌价值' : '成功率'}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <div className={cn('text-2xl font-bold', `text-${service.color}-600`)}>
                            {index === 0 ? '30%' : index === 1 ? '100+' : '6个月'}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {index === 0 ? '成本降低' : index === 1 ? '成功案例' : '孵化周期'}
                          </div>
                        </div>
                      </div>

                      {/* Process Steps */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900">
                          {t('process_title', { default: '服务流程' })}
                        </h5>
                        <div className="space-y-2">
                          {['需求分析', '方案设计', '实施执行', '效果评估'].map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-center space-x-3">
                              <div className={cn(
                                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white',
                                `bg-${service.color}-500`
                              )}>
                                {stepIndex + 1}
                              </div>
                              <span className="text-gray-700">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}