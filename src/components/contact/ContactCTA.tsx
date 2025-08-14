'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  ArrowRight, 
  Phone, 
  Mail, 
  MessageCircle, 
  Calendar,
  Star,
  Users,
  Award,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

// ContactCTA Props接口
export interface ContactCTAProps extends ComponentProps {
  // 可以添加自定义属性
}

// ContactCTA组件
export const ContactCTA: React.FC<ContactCTAProps> = ({ className }) => {
  const t = useTranslations('contact');

  // 快速联系方式
  const quickActions = [
    {
      icon: Phone,
      title: '立即致电',
      description: '专业顾问为您服务',
      action: '400-888-8888',
      color: 'bg-blue-500',
      href: 'tel:400-888-8888'
    },
    {
      icon: MessageCircle,
      title: '在线咨询',
      description: '7x24小时在线支持',
      action: '开始对话',
      color: 'bg-green-500',
      href: '#'
    },
    {
      icon: Mail,
      title: '邮件咨询',
      description: '详细需求描述',
      action: '发送邮件',
      color: 'bg-purple-500',
      href: 'mailto:contact@spaceplus.com'
    },
    {
      icon: Calendar,
      title: '预约会议',
      description: '面对面深度交流',
      action: '立即预约',
      color: 'bg-orange-500',
      href: '#'
    }
  ];

  // 服务保障
  const guarantees = [
    {
      icon: Clock,
      title: '快速响应',
      description: '2小时内回复'
    },
    {
      icon: Users,
      title: '专业团队',
      description: '10年行业经验'
    },
    {
      icon: Award,
      title: '品质保证',
      description: 'ISO 9001认证'
    },
    {
      icon: Star,
      title: '客户满意',
      description: '98%满意度'
    }
  ];

  // 成功案例统计
  const stats = [
    { number: '500+', label: '成功项目' },
    { number: '50+', label: '合作城市' },
    { number: '1000+', label: '满意客户' },
    { number: '98%', label: '成功率' }
  ];

  return (
    <section className={`py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden ${className}`}>
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* 主标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={ANIMATION_CONFIG.smooth}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            准备开始您的项目了吗？
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            我们的专业团队随时为您提供咨询服务，让我们一起打造您的成功项目
          </p>
          
          {/* 统计数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  ...ANIMATION_CONFIG.smooth, 
                  delay: index * 0.1 
                }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 快速联系方式 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <motion.a
                key={action.title}
                href={action.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  ...ANIMATION_CONFIG.smooth, 
                  delay: 0.3 + index * 0.1 
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {action.description}
                </p>
                <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">{action.action}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* 服务保障 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              为什么选择我们？
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              专业的团队、丰富的经验、完善的服务体系，为您的项目成功保驾护航
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {guarantees.map((guarantee, index) => {
              const IconComponent = guarantee.icon;
              return (
                <motion.div
                  key={guarantee.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.5 + index * 0.1 
                  }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {guarantee.title}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {guarantee.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* CTA按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.6 }}
            className="text-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              立即开始咨询
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-gray-400 text-sm mt-4">
              免费咨询 • 专业建议 • 快速响应
            </p>
          </motion.div>
        </motion.div>

        {/* 底部信任标识 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.7 }}
          className="text-center mt-12"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span className="text-sm">ISO 9001 认证</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span className="text-sm">5年服务经验</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">1000+ 成功案例</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">98% 客户满意度</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;