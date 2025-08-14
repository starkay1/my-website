'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  Lightbulb,
  Users,
  Globe,
  Rocket,
  Heart,
  Star,
  Target,
  Award,
  TrendingUp,
  Building,
  Zap,
  Shield
} from 'lucide-react';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

// CompanyStory Props接口
export interface CompanyStoryProps extends ComponentProps {
  // 可以添加自定义属性
}

// CompanyStory组件
export const CompanyStory: React.FC<CompanyStoryProps> = ({ className }) => {
  const t = useTranslations('about');

  // 公司故事章节
  const storyChapters = [
    {
      year: '2018',
      title: '梦想起航',
      icon: Lightbulb,
      description: '三位志同道合的设计师在一间小工作室里开始了他们的创业之旅，怀着改变传统空间设计的梦想。',
      highlights: [
        '成立SpacePlus工作室',
        '完成首个住宅设计项目',
        '确立"以人为本"的设计理念',
        '获得第一批忠实客户'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      year: '2019',
      title: '团队壮大',
      icon: Users,
      description: '随着项目的增多和客户的认可，我们开始扩大团队，吸引了更多优秀的设计师和工程师加入。',
      highlights: [
        '团队扩展至15人',
        '完成50+设计项目',
        '建立标准化设计流程',
        '获得行业设计奖项'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      year: '2020',
      title: '技术创新',
      icon: Rocket,
      description: '疫情期间，我们加大了对数字化技术的投入，开发了VR设计展示系统和智能空间管理平台。',
      highlights: [
        '推出VR设计展示系统',
        '开发智能空间管理平台',
        '实现远程协作设计',
        '获得技术创新奖'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      year: '2021',
      title: '市场拓展',
      icon: Globe,
      description: '我们开始向全国市场扩展，在多个城市设立分公司，为更多客户提供专业的空间设计服务。',
      highlights: [
        '在5个城市设立分公司',
        '服务客户超过500家',
        '建立全国服务网络',
        '获得行业领军企业称号'
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      year: '2022',
      title: '可持续发展',
      icon: Heart,
      description: '我们开始关注环保和可持续发展，推出绿色设计理念，致力于创造更环保、更健康的空间环境。',
      highlights: [
        '推出绿色设计标准',
        '获得环保认证',
        '减少碳排放30%',
        '成为可持续发展先锋'
      ],
      color: 'from-teal-500 to-green-500'
    },
    {
      year: '2023',
      title: '智能未来',
      icon: Zap,
      description: '我们全面拥抱AI和IoT技术，推出智能空间解决方案，为客户打造真正的智慧空间。',
      highlights: [
        '推出AI设计助手',
        '集成IoT智能系统',
        '实现空间自动化管理',
        '引领行业数字化转型'
      ],
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  // 核心价值观详细说明
  const values = [
    {
      icon: Target,
      title: '专业专注',
      description: '我们专注于空间设计领域，不断提升专业技能，为客户提供最优质的服务。',
      features: ['专业团队', '精湛技艺', '持续学习', '品质保证']
    },
    {
      icon: Lightbulb,
      title: '创新驱动',
      description: '我们始终保持创新精神，积极探索新技术、新材料、新工艺，引领行业发展。',
      features: ['技术创新', '设计创新', '服务创新', '模式创新']
    },
    {
      icon: Heart,
      title: '以人为本',
      description: '我们始终将人的需求放在首位，关注用户体验，创造温暖、舒适的空间环境。',
      features: ['用户至上', '人性化设计', '情感关怀', '生活品质']
    },
    {
      icon: Shield,
      title: '诚信负责',
      description: '我们坚持诚信经营，对每个项目负责到底，建立长期的信任关系。',
      features: ['诚信经营', '质量保证', '售后服务', '长期合作']
    }
  ];

  // 成就数据
  const achievements = [
    {
      icon: Building,
      number: '1000+',
      label: '完成项目',
      description: '累计完成各类空间设计项目'
    },
    {
      icon: Users,
      number: '500+',
      label: '专业团队',
      description: '汇聚全球优秀设计人才'
    },
    {
      icon: Award,
      number: '50+',
      label: '获得奖项',
      description: '荣获国内外设计大奖'
    },
    {
      icon: Globe,
      number: '20+',
      label: '服务城市',
      description: '业务覆盖全国主要城市'
    }
  ];

  return (
    <section id="company-story" className={`py-20 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={ANIMATION_CONFIG.smooth}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            我们的故事
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            从一个小工作室到行业领军企业，我们用专业和创新书写着空间设计的新篇章
          </p>
        </motion.div>

        {/* 发展历程 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
          className="mb-20"
        >
          <div className="relative">
            {/* 时间线 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            
            <div className="space-y-16">
              {storyChapters.map((chapter, index) => {
                const IconComponent = chapter.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={chapter.year}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      ...ANIMATION_CONFIG.smooth, 
                      delay: 0.2 + index * 0.1 
                    }}
                    className={`flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* 内容卡片 */}
                    <div className={`w-5/12 ${isEven ? 'pr-8' : 'pl-8'}`}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${chapter.color} rounded-xl flex items-center justify-center mr-4`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {chapter.year}
                            </div>
                            <div className="text-lg font-semibold text-gray-700">
                              {chapter.title}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {chapter.description}
                        </p>
                        
                        <ul className="space-y-2">
                          {chapter.highlights.map((highlight, highlightIndex) => (
                            <li key={highlightIndex} className="flex items-center text-sm text-gray-700">
                              <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                    
                    {/* 中心节点 */}
                    <div className="w-2/12 flex justify-center">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className={`w-16 h-16 bg-gradient-to-r ${chapter.color} rounded-full flex items-center justify-center shadow-lg z-10`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </motion.div>
                    </div>
                    
                    {/* 空白区域 */}
                    <div className="w-5/12" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* 核心价值观 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              核心价值观
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              这些价值观指引着我们的每一个决策，塑造着我们的企业文化
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.3 + index * 0.1 
                  }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {value.description}
                  </p>
                  <div className="space-y-1">
                    {value.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 成就展示 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              我们的成就
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              用数字见证我们的成长历程和专业实力
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.4 + index * 0.1 
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 mb-1">
                    {achievement.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {achievement.description}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CompanyStory;