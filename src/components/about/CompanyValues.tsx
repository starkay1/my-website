'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  Heart,
  Lightbulb,
  Target,
  Shield,
  Users,
  Globe,
  Leaf,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  Award,
  TrendingUp,
  Eye,
  Compass
} from 'lucide-react';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

// CompanyValues Props接口
export interface CompanyValuesProps extends ComponentProps {
  // 可以添加自定义属性
}

// CompanyValues组件
export const CompanyValues: React.FC<CompanyValuesProps> = ({ className }) => {
  const t = useTranslations('about');
  const [activeValue, setActiveValue] = useState(0);

  // 核心价值观数据
  const coreValues = [
    {
      icon: Heart,
      title: '以人为本',
      subtitle: 'People First',
      description: '我们始终将人的需求和体验放在首位，关注每一个细节，创造温暖、舒适的空间环境。',
      principles: [
        '用户体验至上',
        '员工关怀与发展',
        '人性化设计理念',
        '情感化空间营造'
      ],
      examples: [
        '为残障人士设计无障碍空间',
        '关注员工工作环境舒适度',
        '重视客户反馈和建议',
        '提供个性化定制服务'
      ],
      color: 'from-red-500 to-pink-500',
      bgColor: 'from-red-50 to-pink-50'
    },
    {
      icon: Lightbulb,
      title: '创新驱动',
      subtitle: 'Innovation Driven',
      description: '我们持续探索前沿技术和设计理念，用创新思维解决传统问题，引领行业发展方向。',
      principles: [
        '技术创新突破',
        '设计理念革新',
        '服务模式创新',
        '商业模式创新'
      ],
      examples: [
        '开发VR虚拟设计系统',
        '应用AI辅助设计工具',
        '推出智能空间解决方案',
        '创新材料应用研究'
      ],
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50'
    },
    {
      icon: Target,
      title: '追求卓越',
      subtitle: 'Pursuit of Excellence',
      description: '我们在每个项目中都力求完美，不断提升专业水准，为客户提供超越期望的优质服务。',
      principles: [
        '精益求精的工艺',
        '严格的质量标准',
        '持续的专业提升',
        '超越客户期望'
      ],
      examples: [
        '建立严格的质量管控体系',
        '定期进行专业技能培训',
        '客户满意度达到98%',
        '获得多项行业权威认证'
      ],
      color: 'from-blue-500 to-purple-500',
      bgColor: 'from-blue-50 to-purple-50'
    },
    {
      icon: Shield,
      title: '诚信负责',
      subtitle: 'Integrity & Responsibility',
      description: '我们坚持诚信经营，对每个项目负责到底，建立长期稳定的合作关系和信任基础。',
      principles: [
        '诚实守信经营',
        '承诺必须兑现',
        '透明化沟通',
        '长期责任担当'
      ],
      examples: [
        '项目质保期内免费维护',
        '透明的价格体系',
        '及时响应客户需求',
        '建立客户档案管理系统'
      ],
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-50 to-teal-50'
    },
    {
      icon: Users,
      title: '团队协作',
      subtitle: 'Team Collaboration',
      description: '我们相信团队的力量，通过有效协作和知识共享，实现1+1>2的协同效应。',
      principles: [
        '开放式沟通',
        '知识共享文化',
        '跨部门协作',
        '集体智慧决策'
      ],
      examples: [
        '建立跨部门项目小组',
        '定期举办技术分享会',
        '实施导师制培养体系',
        '鼓励创新想法交流'
      ],
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'from-indigo-50 to-blue-50'
    },
    {
      icon: Leaf,
      title: '可持续发展',
      subtitle: 'Sustainable Development',
      description: '我们致力于环保和可持续发展，在设计中融入绿色理念，为未来世代负责。',
      principles: [
        '环保材料优先',
        '节能减排设计',
        '循环利用理念',
        '生态友好方案'
      ],
      examples: [
        '100%使用环保认证材料',
        '推广绿色建筑标准',
        '实施碳中和计划',
        '建立材料回收体系'
      ],
      color: 'from-emerald-500 to-green-500',
      bgColor: 'from-emerald-50 to-green-50'
    }
  ];

  // 企业使命和愿景
  const missionVision = {
    mission: {
      icon: Compass,
      title: '企业使命',
      content: '通过创新设计和智能技术，为每一个空间注入生命力，让人们在美好的环境中生活、工作和成长。',
      keywords: ['创新设计', '智能技术', '美好环境', '生活品质']
    },
    vision: {
      icon: Eye,
      title: '企业愿景',
      content: '成为全球领先的智能空间设计服务商，用设计改变世界，让每个空间都成为人们向往的地方。',
      keywords: ['全球领先', '智能空间', '设计改变世界', '向往的地方']
    }
  };

  // 价值观实践成果
  const achievements = [
    {
      icon: Award,
      title: '行业认可',
      value: '50+',
      description: '获得国内外设计大奖'
    },
    {
      icon: Users,
      title: '客户信任',
      value: '98%',
      description: '客户满意度和推荐率'
    },
    {
      icon: TrendingUp,
      title: '持续成长',
      value: '200%',
      description: '年均业务增长率'
    },
    {
      icon: Globe,
      title: '服务覆盖',
      value: '30+',
      description: '服务城市和地区'
    }
  ];

  return (
    <section className={`py-20 bg-white ${className}`}>
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
            核心价值观
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            这些价值观是我们企业文化的基石，指引着我们的每一个决策和行动
          </p>
        </motion.div>

        {/* 使命愿景 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
        >
          {Object.entries(missionVision).map(([key, item], index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  ...ANIMATION_CONFIG.smooth, 
                  delay: 0.2 + index * 0.1 
                }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {item.content}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map((keyword, keywordIndex) => (
                    <span
                      key={keywordIndex}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 核心价值观展示 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
          className="mb-20"
        >
          {/* 价值观导航 */}
          <div className="flex justify-center mb-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {coreValues.map((value, index) => {
                const IconComponent = value.icon;
                const isActive = index === activeValue;
                
                return (
                  <motion.button
                    key={value.title}
                    onClick={() => setActiveValue(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-br ${value.color} text-white shadow-lg` 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                      isActive 
                        ? 'bg-white/20' 
                        : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        isActive 
                          ? 'text-white' 
                          : 'text-gray-600'
                      }`} />
                    </div>
                    <span className="text-sm font-medium text-center">
                      {value.title}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* 价值观详情 */}
          <motion.div
            key={activeValue}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ANIMATION_CONFIG.smooth}
            className={`bg-gradient-to-br ${coreValues[activeValue].bgColor} rounded-3xl p-8 md:p-12`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* 左侧：价值观介绍 */}
              <div>
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${coreValues[activeValue].color} rounded-2xl flex items-center justify-center mr-4`}>
                    {React.createElement(coreValues[activeValue].icon, {
                      className: 'w-8 h-8 text-white'
                    })}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {coreValues[activeValue].title}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {coreValues[activeValue].subtitle}
                    </p>
                  </div>
                </div>
                
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  {coreValues[activeValue].description}
                </p>
                
                {/* 核心原则 */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    核心原则
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {coreValues[activeValue].principles.map((principle, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          ...ANIMATION_CONFIG.smooth, 
                          delay: index * 0.1 
                        }}
                        className="flex items-center bg-white rounded-xl p-3 shadow-sm"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{principle}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 右侧：实践案例 */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-6">
                  实践案例
                </h4>
                <div className="space-y-4">
                  {coreValues[activeValue].examples.map((example, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        ...ANIMATION_CONFIG.smooth, 
                        delay: 0.2 + index * 0.1 
                      }}
                      whileHover={{ x: 5 }}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
                    >
                      <div className="flex items-start">
                        <div className={`w-8 h-8 bg-gradient-to-br ${coreValues[activeValue].color} rounded-lg flex items-center justify-center mr-4 flex-shrink-0 mt-1`}>
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 leading-relaxed">
                            {example}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 价值观实践成果 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              价值观实践成果
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              我们的价值观不仅是理念，更体现在实际的成果和成就中
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.4 + index * 0.1 
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {achievement.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-200 mb-1">
                    {achievement.title}
                  </div>
                  <div className="text-sm text-gray-400">
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

export default CompanyValues;