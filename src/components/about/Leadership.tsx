'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  User,
  Mail,
  Linkedin,
  Twitter,
  Award,
  GraduationCap,
  Building,
  Calendar,
  Quote,
  ChevronLeft,
  ChevronRight,
  Users,
  Target,
  TrendingUp,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

// Leadership Props接口
export interface LeadershipProps extends ComponentProps {
  // 可以添加自定义属性
}

// 领导者数据接口
interface Leader {
  id: number;
  name: string;
  position: string;
  department: string;
  avatar: string;
  bio: string;
  quote: string;
  experience: string;
  education: string;
  achievements: string[];
  specialties: string[];
  social: {
    email?: string;
    linkedin?: string;
    twitter?: string;
  };
  joinDate: string;
  previousRoles: string[];
}

// Leadership组件
export const Leadership: React.FC<LeadershipProps> = ({ className }) => {
  const t = useTranslations('about');
  const [selectedLeader, setSelectedLeader] = useState(0);

  // 领导团队数据
  const leaders: Leader[] = [
    {
      id: 1,
      name: '张明华',
      position: '创始人兼CEO',
      department: '执行管理',
      avatar: '/images/team/ceo.jpg',
      bio: '拥有15年空间设计和企业管理经验，曾在多家知名设计公司担任高级职位。致力于推动设计行业的数字化转型和可持续发展。',
      quote: '设计不仅仅是美学，更是解决问题的艺术。我们要用设计改变世界，让每个空间都充满生命力。',
      experience: '15年',
      education: '清华大学建筑学硕士',
      achievements: [
        '荣获"年度杰出企业家"称号',
        '入选"设计行业领军人物"',
        '获得"创新创业先锋"奖项',
        '担任多个行业协会理事'
      ],
      specialties: ['战略规划', '团队管理', '商业模式创新', '行业趋势分析'],
      social: {
        email: 'zhang@spaceplus.com',
        linkedin: 'https://linkedin.com/in/zhangminghua',
        twitter: 'https://twitter.com/zhangminghua'
      },
      joinDate: '2018-01',
      previousRoles: [
        '某知名设计公司设计总监',
        '国际建筑事务所高级合伙人',
        '设计咨询公司创始人'
      ]
    },
    {
      id: 2,
      name: '李雅婷',
      position: '首席设计官',
      department: '设计创新',
      avatar: '/images/team/cdo.jpg',
      bio: '国际知名设计师，拥有12年高端空间设计经验。擅长将前沿设计理念与实用功能完美结合，作品多次获得国际设计大奖。',
      quote: '好的设计应该是无声的诗歌，它能够触动人心，改善生活，创造美好的体验。',
      experience: '12年',
      education: '米兰理工大学设计学硕士',
      achievements: [
        '获得红点设计大奖',
        '作品入选威尼斯建筑双年展',
        '荣获"年度最佳设计师"',
        '出版设计专著《空间的诗意》'
      ],
      specialties: ['概念设计', '空间规划', '材料创新', '可持续设计'],
      social: {
        email: 'li@spaceplus.com',
        linkedin: 'https://linkedin.com/in/liyating'
      },
      joinDate: '2018-03',
      previousRoles: [
        '国际设计工作室主创设计师',
        '知名建筑事务所设计总监',
        '独立设计师'
      ]
    },
    {
      id: 3,
      name: '王志强',
      position: '首席技术官',
      department: '技术研发',
      avatar: '/images/team/cto.jpg',
      bio: '技术专家，专注于AI、VR/AR和IoT技术在空间设计中的应用。领导团队开发了多项行业领先的技术产品。',
      quote: '技术是设计的翅膀，让创意飞得更高更远。我们要用科技赋能设计，创造无限可能。',
      experience: '10年',
      education: '斯坦福大学计算机科学博士',
      achievements: [
        '获得"科技创新领军人才"称号',
        '拥有技术专利20+项',
        '荣获"AI应用创新奖"',
        '担任多个技术标准制定委员'
      ],
      specialties: ['人工智能', 'VR/AR技术', '物联网', '大数据分析'],
      social: {
        email: 'wang@spaceplus.com',
        linkedin: 'https://linkedin.com/in/wangzhiqiang',
        twitter: 'https://twitter.com/wangzhiqiang'
      },
      joinDate: '2019-01',
      previousRoles: [
        '硅谷科技公司技术总监',
        '知名互联网公司架构师',
        '技术创业公司联合创始人'
      ]
    },
    {
      id: 4,
      name: '陈美玲',
      position: '首席运营官',
      department: '运营管理',
      avatar: '/images/team/coo.jpg',
      bio: '运营管理专家，拥有丰富的企业运营和项目管理经验。致力于优化业务流程，提升运营效率和客户满意度。',
      quote: '卓越的运营是企业成功的基石。我们要用精细化管理创造最大价值，为客户提供完美体验。',
      experience: '13年',
      education: '北京大学MBA',
      achievements: [
        '荣获"杰出运营管理者"奖',
        '获得PMP项目管理认证',
        '入选"商业精英100强"',
        '多次获得公司最佳员工奖'
      ],
      specialties: ['运营管理', '项目管理', '流程优化', '团队建设'],
      social: {
        email: 'chen@spaceplus.com',
        linkedin: 'https://linkedin.com/in/chenmeiling'
      },
      joinDate: '2018-06',
      previousRoles: [
        '跨国公司运营总监',
        '咨询公司高级经理',
        '制造业运营专家'
      ]
    },
    {
      id: 5,
      name: '刘建国',
      position: '首席财务官',
      department: '财务管理',
      avatar: '/images/team/cfo.jpg',
      bio: '资深财务专家，拥有丰富的企业财务管理和投资经验。负责公司财务战略规划和风险控制，推动企业健康发展。',
      quote: '财务不仅是数字游戏，更是企业发展的战略支撑。我们要用专业的财务管理为企业创造更大价值。',
      experience: '16年',
      education: '上海财经大学金融学硕士',
      achievements: [
        '获得CPA注册会计师资格',
        '荣获"优秀CFO"称号',
        '成功主导多轮融资',
        '建立完善的财务管理体系'
      ],
      specialties: ['财务规划', '投资分析', '风险控制', '资本运作'],
      social: {
        email: 'liu@spaceplus.com',
        linkedin: 'https://linkedin.com/in/liujianguo'
      },
      joinDate: '2019-03',
      previousRoles: [
        '上市公司财务总监',
        '投资银行高级经理',
        '会计师事务所合伙人'
      ]
    },
    {
      id: 6,
      name: '赵文静',
      position: '首席人力资源官',
      department: '人力资源',
      avatar: '/images/team/chro.jpg',
      bio: '人力资源专家，专注于人才发展和企业文化建设。致力于打造学习型组织，激发员工潜能，推动企业与员工共同成长。',
      quote: '人才是企业最宝贵的资产。我们要创造最好的环境，让每个人都能发挥最大潜能，实现个人与企业的双赢。',
      experience: '11年',
      education: '中国人民大学人力资源管理硕士',
      achievements: [
        '获得SHRM高级认证',
        '荣获"最佳HR领导者"奖',
        '建立完善的人才培养体系',
        '员工满意度提升至98%'
      ],
      specialties: ['人才发展', '企业文化', '绩效管理', '员工关系'],
      social: {
        email: 'zhao@spaceplus.com',
        linkedin: 'https://linkedin.com/in/zhaowenjing'
      },
      joinDate: '2019-08',
      previousRoles: [
        '知名企业HR总监',
        '人力资源咨询顾问',
        '培训机构高级讲师'
      ]
    }
  ];

  const currentLeader = leaders[selectedLeader];

  const nextLeader = () => {
    setSelectedLeader((prev) => (prev + 1) % leaders.length);
  };

  const prevLeader = () => {
    setSelectedLeader((prev) => (prev - 1 + leaders.length) % leaders.length);
  };

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
            领导团队
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们的领导团队汇聚了来自不同领域的专业人才，共同引领公司走向成功
          </p>
        </motion.div>

        {/* 领导者导航 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              {leaders.map((leader, index) => {
                const isActive = index === selectedLeader;
                
                return (
                  <motion.button
                    key={leader.id}
                    onClick={() => setSelectedLeader(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 min-w-[120px] ${
                      isActive 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full overflow-hidden mb-3 border-4 ${
                      isActive ? 'border-white' : 'border-gray-300'
                    }`}>
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-center">
                      {leader.name}
                    </span>
                    <span className="text-xs opacity-80 text-center">
                      {leader.position}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* 导航按钮 */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevLeader}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextLeader}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* 领导者详情 */}
        <motion.div
          key={selectedLeader}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* 左侧：基本信息 */}
          <div>
            {/* 头像和基本信息 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-8"
            >
              <div className="flex items-start mb-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden mr-6 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentLeader.name}
                  </h3>
                  <p className="text-lg text-blue-600 font-semibold mb-2">
                    {currentLeader.position}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {currentLeader.department}
                  </p>
                  
                  {/* 社交链接 */}
                  <div className="flex space-x-3">
                    {currentLeader.social.email && (
                      <a
                        href={`mailto:${currentLeader.social.email}`}
                        className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors duration-300"
                      >
                        <Mail className="w-5 h-5 text-blue-600" />
                      </a>
                    )}
                    {currentLeader.social.linkedin && (
                      <a
                        href={currentLeader.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors duration-300"
                      >
                        <Linkedin className="w-5 h-5 text-blue-600" />
                      </a>
                    )}
                    {currentLeader.social.twitter && (
                      <a
                        href={currentLeader.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors duration-300"
                      >
                        <Twitter className="w-5 h-5 text-blue-600" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* 关键信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">工作经验</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {currentLeader.experience}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center mb-2">
                    <GraduationCap className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">教育背景</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {currentLeader.education}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 个人简介 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                个人简介
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {currentLeader.bio}
              </p>
            </motion.div>
          </div>

          {/* 右侧：详细信息 */}
          <div className="space-y-8">
            {/* 个人格言 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-200"
            >
              <div className="flex items-start">
                <Quote className="w-8 h-8 text-blue-500 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    个人格言
                  </h4>
                  <p className="text-gray-700 italic leading-relaxed">
                    "{currentLeader.quote}"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 专业领域 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 text-blue-500 mr-2" />
                专业领域
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentLeader.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 主要成就 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.4 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 text-yellow-500 mr-2" />
                主要成就
              </h4>
              <ul className="space-y-3">
                {currentLeader.achievements.map((achievement, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      ...ANIMATION_CONFIG.smooth, 
                      delay: 0.5 + index * 0.1 
                    }}
                    className="flex items-start text-gray-700"
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    {achievement}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* 职业经历 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.5 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 text-green-500 mr-2" />
                职业经历
              </h4>
              <div className="space-y-3">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                    <span className="text-sm font-medium text-green-700">
                      {currentLeader.joinDate} - 至今
                    </span>
                  </div>
                  <div className="text-gray-900 font-semibold">
                    SpacePlus - {currentLeader.position}
                  </div>
                </div>
                
                {currentLeader.previousRoles.map((role, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full mr-2" />
                      <span className="text-sm text-gray-600">曾任</span>
                    </div>
                    <div className="text-gray-700">{role}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 团队统计 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.6 }}
          className="mt-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              领导团队实力
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              我们的领导团队拥有丰富的行业经验和卓越的专业能力
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '6', label: '核心领导', description: '资深管理团队' },
              { icon: TrendingUp, value: '80+', label: '平均经验', description: '年工作经验总和' },
              { icon: Award, value: '50+', label: '获得荣誉', description: '个人及团队奖项' },
              { icon: Heart, value: '100%', label: '团队凝聚力', description: '共同愿景与目标' }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.7 + index * 0.1 
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-200 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stat.description}
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

export default Leadership;