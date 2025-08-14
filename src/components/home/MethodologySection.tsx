'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, Palette, Rocket, GraduationCap, RotateCcw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface MethodologySectionProps extends ComponentProps {}

const MethodologySection = ({ className }: MethodologySectionProps = {}) => {
  const t = useTranslations('home.methodology');

  const steps = [
    {
      icon: Search,
      title: '诊断',
      subtitle: 'Diagnosis',
      description: '深度分析现状，识别核心问题与机会点，制定精准改进方向。',
      details: [
        '品牌现状评估',
        '市场竞争分析',
        '运营数据诊断',
        '团队能力评估',
      ],
      color: 'primary',
    },
    {
      icon: Palette,
      title: '设计',
      subtitle: 'Design',
      description: '基于诊断结果，设计个性化解决方案与实施路径。',
      details: [
        '策略方案设计',
        '品牌视觉升级',
        '运营流程优化',
        '培训体系搭建',
      ],
      color: 'secondary',
    },
    {
      icon: Rocket,
      title: '落地',
      subtitle: 'Implementation',
      description: '专业团队驻场执行，确保方案高质量落地实施。',
      details: [
        '驻店团队部署',
        '系统工具导入',
        '流程标准执行',
        '实时监控调整',
      ],
      color: 'primary',
    },
    {
      icon: GraduationCap,
      title: '培训',
      subtitle: 'Training',
      description: '全面培训本地团队，建立可持续的运营能力。',
      details: [
        '管理层培训',
        '员工技能提升',
        '标准化操作',
        '文化价值传递',
      ],
      color: 'secondary',
    },
    {
      icon: RotateCcw,
      title: '复盘',
      subtitle: 'Review',
      description: '定期复盘总结，持续优化改进，确保长期成功。',
      details: [
        '数据效果分析',
        '问题识别改进',
        '最佳实践总结',
        '持续优化升级',
      ],
      color: 'primary',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-neutral-900 aspect-mobile lg:aspect-16-9">
      <div className="responsive-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-700 bg-clip-text text-transparent">工作方法论</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto font-medium">
            经过数百个项目验证的五步工作法，确保每个项目都能实现预期目标
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary transform -translate-y-1/2" />
            
            {/* Steps */}
            <div className="grid grid-cols-5 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    {/* Step Number & Icon */}
                    <div className="relative z-10 mx-auto w-20 h-20 mb-6">
                      <div
                        className={`w-full h-full rounded-2xl flex items-center justify-center shadow-lg border ${
                          step.color === 'primary'
                            ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white border-primary-300'
                            : 'bg-gradient-to-br from-secondary-500 to-secondary-700 text-white border-secondary-300'
                        } group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}
                      >
                        <Icon size={32} />
                      </div>
                      {/* Step Number */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md border border-neutral-200 dark:border-neutral-600">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{step.title}</h3>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4 font-medium">{step.subtitle}</p>
                      <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed mb-4">
                        {step.description}
                      </p>
                      
                      {/* Details */}
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-center">
                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              step.color === 'primary' ? 'bg-primary-500' : 'bg-secondary-500'
                            }`} />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Arrow */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-10 -right-4 z-20">
                        <ArrowRight className="text-neutral-600" size={20} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-ios-elevated"
              >
                <div className="flex items-start space-x-4">
                  {/* Icon & Number */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border ${
                        step.color === 'primary'
                          ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white border-primary-300'
                          : 'bg-gradient-to-br from-secondary-500 to-secondary-700 text-white border-secondary-300'
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md border border-neutral-200 dark:border-neutral-600">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      {step.title}
                      <span className="text-neutral-500 dark:text-neutral-400 text-sm font-medium ml-2">
                        {step.subtitle}
                      </span>
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Details */}
                    <ul className="grid grid-cols-2 gap-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center space-x-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              step.color === 'primary' ? 'bg-primary-500' : 'bg-secondary-500'
                            }`}
                          />
                          <span className="text-neutral-600 dark:text-neutral-400 text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center"
        >
          <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-2">5</div>
            <div className="text-neutral-600 dark:text-neutral-300 text-sm font-medium">标准化步骤</div>
          </div>
          <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-700 bg-clip-text text-transparent mb-2">2-8</div>
            <div className="text-neutral-600 dark:text-neutral-300 text-sm font-medium">周完成周期</div>
          </div>
          <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-2">95%</div>
            <div className="text-neutral-600 dark:text-neutral-300 text-sm font-medium">项目成功率</div>
          </div>
          <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-700 bg-clip-text text-transparent mb-2">24/7</div>
            <div className="text-neutral-600 dark:text-neutral-300 text-sm font-medium">持续支持</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MethodologySection;