'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Settings, TrendingUp, Rocket, ArrowRight, Sparkles, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent, Button } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface ServicesOverviewProps extends ComponentProps {}

const ServicesOverview = ({ className }: ServicesOverviewProps = {}) => {
  const t = useTranslations('home.services');

  const services = [
    {
      icon: Settings,
      title: t('management.title', { default: '项目托管' }),
      description: t('management.description', { default: '专业团队全方位管理您的夜生活项目' }),
      href: '/services#management',
      color: 'primary',
      gradient: 'from-primary-500 to-primary-600',
      features: [
        '专业驻店团队',
        '数据驱动决策',
        '标准化流程',
        '实时监控报告',
      ],
    },
    {
      icon: TrendingUp,
      title: t('consulting.title', { default: '品牌顾问' }),
      description: t('consulting.description', { default: '深度品牌诊断与策略咨询服务' }),
      href: '/services#consulting',
      color: 'secondary',
      gradient: 'from-secondary-500 to-secondary-600',
      features: [
        '深度品牌诊断',
        '市场竞争分析',
        '策略方案设计',
        '培训体系搭建',
      ],
    },
    {
      icon: Rocket,
      title: t('brand.title', { default: '品牌孵化' }),
      description: t('brand.description', { default: '从零到一打造夜生活品牌' }),
      href: '/services#incubation',
      color: 'accent',
      gradient: 'from-accent-500 to-accent-600',
      features: [
        '品牌命名设计',
        '视觉系统开发',
        '授权体系建立',
        '品牌管控机制',
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-neutral-900 via-primary-900/5 to-secondary-900/5 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 responsive-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 rounded-full text-primary-300 text-sm font-medium backdrop-blur-sm mb-6"
          >
            <Target className="w-4 h-4 mr-2" />
            核心服务
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="block text-white mb-2">专业服务</span>
            <span className="block bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
              成就卓越品牌
            </span>
          </h2>
          
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            从项目托管到品牌孵化，我们提供全方位的夜生活娱乐空间解决方案
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-primary-500/10">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`relative w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`} />
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-secondary-400 group-hover:bg-clip-text transition-all duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-neutral-300 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, featureIndex) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * featureIndex, duration: 0.4 }}
                          viewport={{ once: true }}
                          className="flex items-center text-neutral-300 text-sm"
                        >
                          <div className={`w-2 h-2 bg-gradient-to-r ${service.gradient} rounded-full mr-3 flex-shrink-0`} />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={service.href}
                        className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${service.gradient} text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group/btn`}
                      >
                        <Zap className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                        了解更多
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 hover:from-primary-600 hover:to-secondary-600 group"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              查看全部服务
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOverview;