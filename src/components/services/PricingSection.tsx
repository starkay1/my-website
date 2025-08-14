'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent, Button } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface PricingSectionProps extends ComponentProps {}

export default function PricingSection({ className }: PricingSectionProps = {}) {
  const t = useTranslations('services.pricing');

  const pricingPlans = [
    {
      id: 'basic',
      name: t('basic.name', { default: '基础版' }),
      description: t('basic.description', { default: '适合初创企业和小型项目' }),
      price: '¥29,800',
      period: t('period', { default: '/项目' }),
      popular: false,
      features: [
        '项目现状分析',
        '基础策略制定',
        '1个月执行支持',
        '周报进度汇报',
        '邮件技术支持',
        '基础培训资料',
        '项目交付报告'
      ],
      color: 'blue',
      icon: Zap
    },
    {
      id: 'professional',
      name: t('professional.name', { default: '专业版' }),
      description: t('professional.description', { default: '适合成长期企业和中型项目' }),
      price: '¥68,800',
      period: t('period', { default: '/项目' }),
      popular: true,
      features: [
        '深度业务分析',
        '定制化策略方案',
        '3个月执行支持',
        '专属项目经理',
        '实时沟通支持',
        '团队现场培训',
        '月度优化建议',
        '详细数据报告',
        '后续咨询支持'
      ],
      color: 'purple',
      icon: Star
    },
    {
      id: 'enterprise',
      name: t('enterprise.name', { default: '企业版' }),
      description: t('enterprise.description', { default: '适合大型企业和复杂项目' }),
      price: t('enterprise.price', { default: '定制报价' }),
      period: '',
      popular: false,
      features: [
        '全方位业务诊断',
        '战略级解决方案',
        '6个月+长期支持',
        '高级顾问团队',
        '7x24小时支持',
        '高管层培训',
        '定制化工具开发',
        '行业对标分析',
        '长期合作伙伴',
        '优先技术支持'
      ],
      color: 'gold',
      icon: Crown
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
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-blue-600 text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            {t('badge', { default: '服务定价' })}
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="block text-gray-900 mb-2">
              {t('title.line1', { default: '透明合理的' })}
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('title.line2', { default: '服务定价' })}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle', { default: '根据项目规模和需求，选择最适合您的服务方案' })}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            
            return (
              <motion.div
                key={plan.id}
                variants={itemVariants}
                className="relative"
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      {t('popular', { default: '最受欢迎' })}
                    </div>
                  </div>
                )}

                <Card 
                  variant={plan.popular ? 'elevated' : 'default'}
                  className={cn(
                    'h-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl',
                    plan.popular && 'ring-2 ring-purple-500 scale-105 lg:scale-110'
                  )}
                >
                  {/* Background Gradient */}
                  <div className={cn(
                    'absolute inset-0 opacity-5',
                    plan.color === 'blue' && 'bg-gradient-to-br from-blue-500 to-blue-600',
                    plan.color === 'purple' && 'bg-gradient-to-br from-purple-500 to-pink-500',
                    plan.color === 'gold' && 'bg-gradient-to-br from-yellow-500 to-orange-500'
                  )} />

                  <CardContent className="p-8 relative">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div className={cn(
                        'w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center',
                        plan.color === 'blue' && 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
                        plan.color === 'purple' && 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
                        plan.color === 'gold' && 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white'
                      )}>
                        <Icon className="w-8 h-8" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-gray-600 ml-2">
                            {plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Check className={cn(
                            'w-5 h-5 flex-shrink-0 mt-0.5',
                            plan.color === 'blue' && 'text-blue-500',
                            plan.color === 'purple' && 'text-purple-500',
                            plan.color === 'gold' && 'text-yellow-500'
                          )} />
                          <span className="text-gray-700 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      size="lg"
                      className={cn(
                        'w-full group',
                        plan.popular && 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      )}
                    >
                      {plan.id === 'enterprise' 
                        ? t('contact_sales', { default: '联系销售' })
                        : t('get_started', { default: '立即开始' })
                      }
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('guarantee.title', { default: '服务保障' })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {t('guarantee.satisfaction.title', { default: '满意保证' })}
                </h4>
                <p className="text-sm text-gray-600">
                  {t('guarantee.satisfaction.description', { default: '30天内不满意全额退款' })}
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {t('guarantee.quality.title', { default: '质量承诺' })}
                </h4>
                <p className="text-sm text-gray-600">
                  {t('guarantee.quality.description', { default: '专业团队，标准化流程' })}
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {t('guarantee.support.title', { default: '持续支持' })}
                </h4>
                <p className="text-sm text-gray-600">
                  {t('guarantee.support.description', { default: '项目完成后6个月免费咨询' })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}