'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  Heart, 
  Shield, 
  Plane, 
  GraduationCap,
  Clock,
  Gift,
  Home,
  Car,
  Utensils,
  Dumbbell,
  Baby,
  Stethoscope,
  Coins,
  Trophy,
  Calendar,
  Coffee
} from 'lucide-react';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

// Benefits Props接口
export interface BenefitsProps extends ComponentProps {
  // 可以添加自定义属性
}

// Benefits组件
export const Benefits: React.FC<BenefitsProps> = ({ className }) => {
  const t = useTranslations('careers');

  // 核心福利
  const corebenefits = [
    {
      icon: Shield,
      title: '五险一金',
      description: '完善的社会保险和住房公积金',
      details: ['养老保险', '医疗保险', '失业保险', '工伤保险', '生育保险', '住房公积金'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Coins,
      title: '薪酬福利',
      description: '具有竞争力的薪酬体系',
      details: ['基本工资', '绩效奖金', '年终奖金', '股权激励', '调薪机制', '津贴补助'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Calendar,
      title: '假期制度',
      description: '灵活的休假安排',
      details: ['带薪年假', '病假', '婚假', '产假/陪产假', '丧假', '调休假'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: GraduationCap,
      title: '学习发展',
      description: '全方位的培训和发展机会',
      details: ['新员工培训', '专业技能培训', '管理培训', '外部培训', '学历提升', '职业规划'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  // 生活福利
  const lifeBenefits = [
    {
      icon: Utensils,
      title: '餐饮福利',
      description: '免费工作餐和下午茶',
      value: '每月节省 ¥800+'
    },
    {
      icon: Car,
      title: '交通补贴',
      description: '交通费用补贴',
      value: '每月 ¥500'
    },
    {
      icon: Home,
      title: '住房补贴',
      description: '租房补贴支持',
      value: '每月 ¥1000-3000'
    },
    {
      icon: Dumbbell,
      title: '健身福利',
      description: '健身房会员卡',
      value: '年度 ¥2000'
    },
    {
      icon: Stethoscope,
      title: '健康体检',
      description: '年度健康体检',
      value: '年度 ¥1500'
    },
    {
      icon: Coffee,
      title: '办公福利',
      description: '免费咖啡和零食',
      value: '每月节省 ¥300+'
    }
  ];

  // 特殊福利
  const specialBenefits = [
    {
      icon: Plane,
      title: '旅游福利',
      description: '年度团队旅游和个人旅游补贴',
      features: ['团队旅游', '旅游补贴', '带薪旅游假', '家属旅游']
    },
    {
      icon: Baby,
      title: '家庭关怀',
      description: '关爱员工家庭的各项福利',
      features: ['生育津贴', '子女教育基金', '家属医疗', '节日礼品']
    },
    {
      icon: Gift,
      title: '节日福利',
      description: '丰富的节日庆祝和礼品',
      features: ['生日礼品', '节日礼金', '结婚礼金', '生育礼金']
    },
    {
      icon: Trophy,
      title: '激励奖励',
      description: '多样化的激励和认可机制',
      features: ['优秀员工奖', '创新奖励', '推荐奖金', '长期服务奖']
    }
  ];

  // 工作环境福利
  const workBenefits = [
    {
      title: '弹性工作',
      description: '灵活的工作时间和地点',
      icon: Clock
    },
    {
      title: '现代设备',
      description: '最新的办公设备和软件',
      icon: Coffee
    },
    {
      title: '舒适环境',
      description: '现代化的办公空间设计',
      icon: Home
    },
    {
      title: '团队活动',
      description: '丰富的团建和娱乐活动',
      icon: Heart
    }
  ];

  return (
    <section className={`py-20 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={ANIMATION_CONFIG.smooth}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            福利待遇
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们提供全面的福利体系，让每一位员工都能享受到优质的工作和生活保障
          </p>
        </motion.div>

        {/* 核心福利 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {corebenefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  ...ANIMATION_CONFIG.smooth, 
                  delay: 0.2 + index * 0.1 
                }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {benefit.description}
                </p>
                <ul className="space-y-2">
                  {benefit.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 生活福利 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.3 }}
          className="bg-white rounded-3xl p-8 md:p-12 mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              生活福利
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              全方位的生活保障，让您专注于工作的同时享受高品质的生活
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lifeBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.4 + index * 0.1 
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300 group"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">
                      {benefit.value}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 特殊福利 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              特色福利
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              独特的福利项目，体现我们对员工的特别关怀和重视
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specialBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.5 + index * 0.1 
                  }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 hover:border-blue-200 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    {benefit.description}
                  </p>
                  <ul className="space-y-1">
                    {benefit.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-xs text-gray-500">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 工作环境福利 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              工作环境
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              现代化的办公环境和人性化的工作制度，让工作成为一种享受
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.6 + index * 0.1 
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* 总结 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.7 }}
            className="text-center mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-xl text-gray-300 mb-6">
              我们相信，优秀的福利体系是吸引和留住人才的重要因素
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                关爱员工
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                全面保障
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                激励成长
              </span>
              <span className="flex items-center gap-1">
                <Gift className="w-4 h-4" />
                贴心福利
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;