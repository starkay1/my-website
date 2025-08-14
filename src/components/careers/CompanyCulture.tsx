'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { 
  Users, 
  Heart, 
  Lightbulb, 
  Target,
  Coffee,
  Gamepad2,
  Music,
  Plane,
  Award,
  BookOpen,
  Zap,
  Globe
} from 'lucide-react';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

// CompanyCulture Props接口
export interface CompanyCultureProps extends ComponentProps {
  // 可以添加自定义属性
}

// CompanyCulture组件
export const CompanyCulture: React.FC<CompanyCultureProps> = ({ className }) => {
  const t = useTranslations('careers');

  // 文化特色
  const cultureFeatures = [
    {
      icon: Heart,
      title: '关爱文化',
      description: '我们关心每一位员工的身心健康，提供全方位的关怀和支持',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Lightbulb,
      title: '创新驱动',
      description: '鼓励创新思维，支持员工提出新想法和解决方案',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Target,
      title: '目标导向',
      description: '明确的目标设定，帮助员工实现个人和团队的成功',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: '团队协作',
      description: '倡导开放沟通，建立高效协作的团队文化',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  // 办公环境特色
  const officeFeatures = [
    {
      icon: Coffee,
      title: '咖啡吧台',
      description: '免费咖啡和茶饮，随时补充能量'
    },
    {
      icon: Gamepad2,
      title: '游戏区域',
      description: '放松身心的游戏娱乐空间'
    },
    {
      icon: Music,
      title: '音乐角落',
      description: '激发创意的音乐创作空间'
    },
    {
      icon: BookOpen,
      title: '学习图书馆',
      description: '丰富的学习资源和安静的阅读环境'
    }
  ];

  // 团队活动
  const teamActivities = [
    {
      title: '团队建设',
      description: '定期组织团建活动，增进团队感情',
      image: '/images/culture/team-building.jpg'
    },
    {
      title: '技能培训',
      description: '专业技能培训和个人发展课程',
      image: '/images/culture/training.jpg'
    },
    {
      title: '创新大赛',
      description: '内部创新竞赛，激发创意潜能',
      image: '/images/culture/innovation.jpg'
    },
    {
      title: '文化交流',
      description: '多元文化交流活动，拓展国际视野',
      image: '/images/culture/culture-exchange.jpg'
    }
  ];

  // 员工故事
  const employeeStories = [
    {
      name: '张小明',
      position: '高级设计师',
      avatar: '/images/team/zhang-xiaoming.jpg',
      story: '在Spaceplus的三年里，我不仅提升了专业技能，更重要的是找到了志同道合的伙伴。公司的创新文化让我能够自由发挥创意，每个项目都是新的挑战和成长机会。',
      tags: ['创意自由', '团队协作', '专业成长']
    },
    {
      name: '李小红',
      position: '项目经理',
      avatar: '/images/team/li-xiaohong.jpg',
      story: '从实习生到项目经理，公司给了我很多学习和发展的机会。导师制度让我快速成长，扁平化的管理结构让我能够直接参与重要决策。',
      tags: ['快速成长', '导师制度', '职业发展']
    },
    {
      name: '王小强',
      position: '技术总监',
      avatar: '/images/team/wang-xiaoqiang.jpg',
      story: '技术团队的氛围非常好，大家互相学习，共同进步。公司投入大量资源支持技术创新，让我们能够使用最前沿的技术来解决实际问题。',
      tags: ['技术创新', '学习氛围', '资源支持']
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
            我们的文化
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            在Spaceplus，我们相信优秀的文化是成功的基石。
            我们致力于创造一个充满活力、创新和关爱的工作环境。
          </p>
        </motion.div>

        {/* 文化特色 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {cultureFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
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
                className="text-center group"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 办公环境 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.3 }}
          className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              舒适的办公环境
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              我们精心设计了现代化的办公空间，为员工提供舒适、高效的工作环境
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {officeFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.4 + index * 0.1 
                  }}
                  className="text-center bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* 办公室图片展示 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  ...ANIMATION_CONFIG.smooth, 
                  delay: 0.5 + index * 0.1 
                }}
                whileHover={{ scale: 1.05 }}
                className="relative h-64 rounded-2xl overflow-hidden shadow-lg"
              >
                <Image
                  src={`/images/office/office-${index}.jpg`}
                  alt={`办公环境 ${index}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-semibold">办公区域 {index}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 团队活动 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              丰富的团队活动
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              我们定期组织各种活动，促进团队交流，丰富员工的工作和生活体验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamActivities.map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  ...ANIMATION_CONFIG.smooth, 
                  delay: 0.5 + index * 0.1 
                }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4 shadow-lg">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {activity.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {activity.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 员工故事 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              员工心声
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              听听我们的同事分享他们在Spaceplus的成长故事和工作感受
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {employeeStories.map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  ...ANIMATION_CONFIG.smooth, 
                  delay: 0.6 + index * 0.1 
                }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* 员工信息 */}
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src={story.avatar}
                      alt={story.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {story.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {story.position}
                    </p>
                  </div>
                </div>

                {/* 故事内容 */}
                <p className="text-gray-700 leading-relaxed mb-6">
                  {story.story}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CompanyCulture;