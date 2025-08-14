'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent, Button } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface ContactCTAProps extends ComponentProps {}

export default function ContactCTA({ className }: ContactCTAProps = {}) {
  const t = useTranslations('services.contact');

  const contactMethods = [
    {
      id: 'phone',
      icon: Phone,
      title: t('phone.title', { default: '电话咨询' }),
      description: t('phone.description', { default: '立即与我们的专家通话' }),
      value: '+86 400-123-4567',
      action: t('phone.action', { default: '立即拨打' }),
      color: 'blue',
      href: 'tel:+8640012345678'
    },
    {
      id: 'email',
      icon: Mail,
      title: t('email.title', { default: '邮件联系' }),
      description: t('email.description', { default: '发送详细需求给我们' }),
      value: 'hello@spaceplus.com',
      action: t('email.action', { default: '发送邮件' }),
      color: 'purple',
      href: 'mailto:hello@spaceplus.com'
    },
    {
      id: 'wechat',
      icon: MessageCircle,
      title: t('wechat.title', { default: '微信咨询' }),
      description: t('wechat.description', { default: '扫码添加专属顾问' }),
      value: 'SpacePlus-Service',
      action: t('wechat.action', { default: '添加微信' }),
      color: 'green',
      href: '#wechat'
    },
    {
      id: 'meeting',
      icon: Calendar,
      title: t('meeting.title', { default: '预约会议' }),
      description: t('meeting.description', { default: '安排一对一深度沟通' }),
      value: t('meeting.value', { default: '30分钟免费咨询' }),
      action: t('meeting.action', { default: '预约时间' }),
      color: 'orange',
      href: '#booking'
    }
  ];

  const benefits = [
    {
      title: t('benefits.free.title', { default: '免费咨询' }),
      description: t('benefits.free.description', { default: '30分钟专业咨询，无任何费用' })
    },
    {
      title: t('benefits.response.title', { default: '快速响应' }),
      description: t('benefits.response.description', { default: '2小时内专业回复' })
    },
    {
      title: t('benefits.custom.title', { default: '定制方案' }),
      description: t('benefits.custom.description', { default: '根据您的需求量身定制' })
    }
  ];

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

  return (
    <section className={cn('py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden', className)}>
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
            <Sparkles className="w-4 h-4 mr-2" />
            {t('badge', { default: '联系我们' })}
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="block text-white mb-2">
              {t('title.line1', { default: '准备好开始' })}
            </span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('title.line2', { default: '您的项目了吗？' })}
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('subtitle', { default: '选择最适合您的联系方式，我们的专家团队随时为您服务' })}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Contact Methods */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactMethods.map((method) => {
                const Icon = method.icon;
                
                return (
                  <motion.div key={method.id} variants={itemVariants}>
                    <Card 
                      variant="elevated" 
                      className="h-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                            method.color === 'blue' && 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
                            method.color === 'purple' && 'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
                            method.color === 'green' && 'bg-gradient-to-br from-green-500 to-green-600 text-white',
                            method.color === 'orange' && 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                          )}>
                            <Icon className="w-6 h-6" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white mb-1">
                              {method.title}
                            </h3>
                            <p className="text-gray-300 text-sm mb-3">
                              {method.description}
                            </p>
                            <div className="text-gray-400 text-sm mb-4 font-mono">
                              {method.value}
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-white border-white/30 hover:bg-white/10 group-hover:border-white/50 transition-all"
                              href={method.href}
                            >
                              {method.action}
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Benefits & CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, ...ANIMATION_CONFIG.smooth }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Card variant="elevated" className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-white/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  {t('benefits_title', { default: '为什么选择我们？' })}
                </h3>
                
                <div className="space-y-6 mb-8">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">
                          {benefit.title}
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group"
                  >
                    {t('primary_cta', { default: '立即开始项目' })}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full text-white border-white/30 hover:bg-white/10"
                  >
                    {t('secondary_cta', { default: '下载服务手册' })}
                  </Button>
                </div>
                
                {/* Trust Indicators */}
                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">2小时</div>
                      <div className="text-xs text-gray-400">平均响应时间</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">98%</div>
                      <div className="text-xs text-gray-400">客户满意度</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">
              {t('urgent_title', { default: '紧急项目？' })}
            </h3>
            <p className="text-gray-300 mb-6">
              {t('urgent_description', { default: '我们提供7x24小时紧急响应服务，确保您的项目不受影响' })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                {t('urgent_cta', { default: '紧急联系' })}
              </Button>
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                {t('normal_cta', { default: '常规咨询' })}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}