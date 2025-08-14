'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  Calendar,
  MapPin,
  Users,
  Award,
  TrendingUp,
  Building,
  Lightbulb,
  Globe,
  Rocket,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

// Timeline Props接口
export interface TimelineProps extends ComponentProps {
  // 可以添加自定义属性
}

// Timeline组件
export const Timeline: React.FC<TimelineProps> = ({ className }) => {
  const t = useTranslations('about');
  const [currentYear, setCurrentYear] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // 详细时间线数据
  const timelineData = [
    {
      year: '2018',
      quarter: 'Q1',
      title: '公司成立',
      subtitle: '梦想启航',
      description: '三位设计师在上海创立SpacePlus，专注于创新空间设计解决方案。',
      location: '上海',
      teamSize: 3,
      milestone: '获得天使轮投资',
      projects: [
        '完成首个住宅设计项目',
        '建立品牌视觉识别系统',
        '制定公司发展战略'
      ],
      achievements: [
        '注册公司商标',
        '建立设计标准',
        '获得首批客户认可'
      ],
      image: '/images/timeline/2018.jpg',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      year: '2019',
      quarter: 'Q2',
      title: '团队扩张',
      subtitle: '人才汇聚',
      description: '团队快速发展，吸引了来自知名设计公司的优秀人才加入。',
      location: '上海、北京',
      teamSize: 15,
      milestone: '完成A轮融资',
      projects: [
        '完成50+设计项目',
        '建立北京分公司',
        '推出标准化服务流程'
      ],
      achievements: [
        '获得"年度新锐设计公司"奖',
        '建立完整的项目管理体系',
        '客户满意度达到95%'
      ],
      image: '/images/timeline/2019.jpg',
      color: 'from-green-500 to-emerald-500'
    },
    {
      year: '2020',
      quarter: 'Q1',
      title: '数字化转型',
      subtitle: '技术创新',
      description: '疫情推动我们加速数字化转型，开发了多项创新技术产品。',
      location: '全国远程',
      teamSize: 35,
      milestone: '推出VR设计系统',
      projects: [
        '开发VR虚拟展示系统',
        '建立云端协作平台',
        '推出在线设计服务'
      ],
      achievements: [
        '获得"科技创新奖"',
        '专利申请10+项',
        '线上服务覆盖全国'
      ],
      image: '/images/timeline/2020.jpg',
      color: 'from-purple-500 to-pink-500'
    },
    {
      year: '2021',
      quarter: 'Q3',
      title: '全国布局',
      subtitle: '市场拓展',
      description: '在全国主要城市设立分公司，建立完善的服务网络。',
      location: '10个城市',
      teamSize: 120,
      milestone: '完成B轮融资',
      projects: [
        '在10个城市设立分公司',
        '服务客户超过500家',
        '建立供应链管理系统'
      ],
      achievements: [
        '获得"行业领军企业"称号',
        '年营收突破1亿元',
        '建立全国服务网络'
      ],
      image: '/images/timeline/2021.jpg',
      color: 'from-orange-500 to-red-500'
    },
    {
      year: '2022',
      quarter: 'Q2',
      title: '绿色发展',
      subtitle: '可持续设计',
      description: '全面推行绿色设计理念，致力于环保和可持续发展。',
      location: '全国20个城市',
      teamSize: 280,
      milestone: '获得绿色认证',
      projects: [
        '推出绿色设计标准',
        '建立环保材料库',
        '实施碳中和计划'
      ],
      achievements: [
        '获得"绿色设计先锋"奖',
        '减少碳排放30%',
        '100%使用环保材料'
      ],
      image: '/images/timeline/2022.jpg',
      color: 'from-teal-500 to-green-500'
    },
    {
      year: '2023',
      quarter: 'Q4',
      title: '智能未来',
      subtitle: 'AI驱动设计',
      description: '全面拥抱人工智能，推出AI辅助设计系统和智能空间解决方案。',
      location: '全球30个城市',
      teamSize: 500,
      milestone: '推出AI设计助手',
      projects: [
        '开发AI设计助手',
        '集成IoT智能系统',
        '推出智慧空间解决方案'
      ],
      achievements: [
        '获得"AI创新应用奖"',
        '设计效率提升50%',
        '引领行业数字化转型'
      ],
      image: '/images/timeline/2023.jpg',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  // 自动播放功能
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentYear((prev) => (prev + 1) % timelineData.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, timelineData.length]);

  const nextYear = () => {
    setCurrentYear((prev) => (prev + 1) % timelineData.length);
  };

  const prevYear = () => {
    setCurrentYear((prev) => (prev - 1 + timelineData.length) % timelineData.length);
  };

  const currentData = timelineData[currentYear];

  return (
    <section className={`py-20 bg-gradient-to-br from-gray-50 to-white ${className}`}>
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
            发展历程
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            从初创公司到行业领导者，见证我们每一个重要的发展节点
          </p>
        </motion.div>

        {/* 时间线导航 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex justify-center items-center mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevYear}
              className="mr-4"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
              {timelineData.map((item, index) => (
                <motion.button
                  key={item.year}
                  onClick={() => setCurrentYear(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 min-w-[100px] ${
                    index === currentYear
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="text-lg font-bold">{item.year}</div>
                  <div className="text-sm">{item.quarter}</div>
                </motion.button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextYear}
              className="ml-4"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* 自动播放控制 */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="flex items-center"
            >
              {isAutoPlay ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  暂停播放
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  自动播放
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* 详细内容 */}
        <motion.div
          key={currentYear}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* 左侧：详细信息 */}
          <div>
            {/* 年份和标题 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center mb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${currentData.color} rounded-2xl flex items-center justify-center mr-4`}>
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {currentData.year}
                  </div>
                  <div className="text-xl font-semibold text-gray-600">
                    {currentData.subtitle}
                  </div>
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {currentData.title}
              </h3>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {currentData.description}
              </p>
            </motion.div>

            {/* 关键信息 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">服务地区</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {currentData.location}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">团队规模</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {currentData.teamSize}人
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <Award className="w-5 h-5 text-purple-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">重要里程碑</span>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {currentData.milestone}
                </div>
              </div>
            </motion.div>

            {/* 项目成果 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Rocket className="w-5 h-5 text-blue-500 mr-2" />
                  主要项目
                </h4>
                <ul className="space-y-2">
                  {currentData.projects.map((project, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <Star className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      {project}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                  重要成就
                </h4>
                <ul className="space-y-2">
                  {currentData.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <Star className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* 右侧：视觉展示 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
            className="relative"
          >
            {/* 主要展示区域 */}
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
              {/* 装饰性背景 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentData.color} opacity-5 rounded-3xl`} />
              
              {/* 年份大字 */}
              <div className="relative text-center mb-8">
                <div className={`text-8xl font-bold bg-gradient-to-r ${currentData.color} bg-clip-text text-transparent opacity-20`}>
                  {currentData.year}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-24 h-24 bg-gradient-to-r ${currentData.color} rounded-2xl flex items-center justify-center`}>
                    <Building className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              
              {/* 关键数据展示 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {currentData.teamSize}
                  </div>
                  <div className="text-sm text-gray-600">团队成员</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {currentData.projects.length}
                  </div>
                  <div className="text-sm text-gray-600">重要项目</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {currentData.achievements.length}
                  </div>
                  <div className="text-sm text-gray-600">重大成就</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-xl font-bold text-gray-900">
                    {currentData.quarter}
                  </div>
                  <div className="text-sm text-gray-600">季度</div>
                </div>
              </div>
            </div>

            {/* 浮动装饰元素 */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r ${currentData.color} rounded-xl shadow-lg opacity-80`}
            />
            
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className={`absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r ${currentData.color} rounded-lg shadow-lg opacity-60`}
            />
          </motion.div>
        </motion.div>

        {/* 进度指示器 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <div className="flex space-x-2">
            {timelineData.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentYear(index)}
                whileHover={{ scale: 1.2 }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentYear
                    ? 'bg-blue-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;