'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  Users,
  MapPin,
  Calendar,
  Award,
  Heart,
  Coffee,
  Lightbulb,
  Target,
  TrendingUp,
  Globe,
  Star,
  Zap,
  Shield,
  Smile,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

// TeamIntro Props接口
export interface TeamIntroProps extends ComponentProps {
  // 可以添加自定义属性
}

// 团队成员数据接口
interface TeamMember {
  id: number;
  name: string;
  position: string;
  department: string;
  avatar: string;
  bio: string;
  skills: string[];
  hobbies: string[];
  joinDate: string;
  location: string;
  quote: string;
}

// 部门数据接口
interface Department {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

// TeamIntro组件
export const TeamIntro: React.FC<TeamIntroProps> = ({ className }) => {
  const t = useTranslations('about');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // 部门数据
  const departments: Department[] = [
    {
      id: 'all',
      name: '全部团队',
      description: '我们的完整团队',
      memberCount: 48,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'design',
      name: '设计团队',
      description: '创意与美学的践行者',
      memberCount: 18,
      icon: Lightbulb,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'tech',
      name: '技术团队',
      description: '技术创新的引领者',
      memberCount: 15,
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'operation',
      name: '运营团队',
      description: '高效执行的保障者',
      memberCount: 10,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 'support',
      name: '支持团队',
      description: '贴心服务的提供者',
      memberCount: 5,
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  // 团队成员数据
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: '张小雨',
      position: '高级UI设计师',
      department: 'design',
      avatar: '/images/team/member1.jpg',
      bio: '专注于用户界面设计，擅长创造直观美观的用户体验。热爱探索最新的设计趋势和技术。',
      skills: ['UI设计', 'UX设计', 'Figma', 'Adobe Creative Suite'],
      hobbies: ['摄影', '旅行', '咖啡', '音乐'],
      joinDate: '2020-03',
      location: '北京',
      quote: '设计不仅仅是外观，更是体验的艺术。'
    },
    {
      id: 2,
      name: '李明轩',
      position: '前端开发工程师',
      department: 'tech',
      avatar: '/images/team/member2.jpg',
      bio: '前端技术专家，专注于现代Web技术栈。致力于构建高性能、可维护的前端应用。',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      hobbies: ['编程', '游戏', '篮球', '科技'],
      joinDate: '2019-08',
      location: '上海',
      quote: '代码是诗歌，每一行都应该优雅而有意义。'
    },
    {
      id: 3,
      name: '王美丽',
      position: '项目经理',
      department: 'operation',
      avatar: '/images/team/member3.jpg',
      bio: '经验丰富的项目管理专家，擅长协调团队资源，确保项目按时高质量交付。',
      skills: ['项目管理', 'Scrum', '团队协作', '风险控制'],
      hobbies: ['阅读', '瑜伽', '烹饪', '园艺'],
      joinDate: '2018-12',
      location: '深圳',
      quote: '成功的项目源于团队的默契与专业的执行。'
    },
    {
      id: 4,
      name: '陈志华',
      position: '后端开发工程师',
      department: 'tech',
      avatar: '/images/team/member4.jpg',
      bio: '后端架构师，专注于系统设计和性能优化。拥有丰富的大型系统开发经验。',
      skills: ['Node.js', 'Python', 'Docker', '微服务'],
      hobbies: ['登山', '摄影', '读书', '电影'],
      joinDate: '2019-05',
      location: '杭州',
      quote: '好的架构是系统稳定运行的基石。'
    },
    {
      id: 5,
      name: '刘晓燕',
      position: '空间设计师',
      department: 'design',
      avatar: '/images/team/member5.jpg',
      bio: '空间设计专家，擅长将创意理念转化为实际的空间解决方案。注重功能与美学的平衡。',
      skills: ['空间设计', '3D建模', 'AutoCAD', '材料搭配'],
      hobbies: ['艺术', '建筑', '手工', '花艺'],
      joinDate: '2020-01',
      location: '成都',
      quote: '空间是生活的容器，设计是生活的艺术。'
    },
    {
      id: 6,
      name: '赵文强',
      position: '客户成功经理',
      department: 'support',
      avatar: '/images/team/member6.jpg',
      bio: '客户服务专家，致力于为客户提供最优质的服务体验。善于倾听和解决问题。',
      skills: ['客户服务', '沟通技巧', '问题解决', '数据分析'],
      hobbies: ['跑步', '音乐', '电影', '美食'],
      joinDate: '2019-11',
      location: '广州',
      quote: '客户的满意是我们最大的成就。'
    }
  ];

  // 过滤团队成员
  const filteredMembers = selectedDepartment === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.department === selectedDepartment);

  const currentMember = filteredMembers[currentMemberIndex] || teamMembers[0];

  // 自动播放逻辑
  React.useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentMemberIndex(prev => (prev + 1) % filteredMembers.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlay, filteredMembers.length]);

  const nextMember = () => {
    setCurrentMemberIndex(prev => (prev + 1) % filteredMembers.length);
  };

  const prevMember = () => {
    setCurrentMemberIndex(prev => (prev - 1 + filteredMembers.length) % filteredMembers.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

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
            团队介绍
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们是一群充满激情的专业人士，来自不同背景，为了共同的目标而聚集在一起
          </p>
        </motion.div>

        {/* 团队统计 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {[
            { icon: Users, value: '48+', label: '团队成员', color: 'text-blue-600', bgColor: 'bg-blue-100' },
            { icon: Globe, value: '5', label: '办公城市', color: 'text-green-600', bgColor: 'bg-green-100' },
            { icon: Star, value: '95%', label: '员工满意度', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
            { icon: Coffee, value: '∞', label: '咖啡消耗量', color: 'text-orange-600', bgColor: 'bg-orange-100' }
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
                  delay: 0.2 + index * 0.1 
                }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 部门筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {departments.map((dept) => {
              const IconComponent = dept.icon;
              const isActive = selectedDepartment === dept.id;
              
              return (
                <motion.button
                  key={dept.id}
                  onClick={() => {
                    setSelectedDepartment(dept.id);
                    setCurrentMemberIndex(0);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary-500 text-white shadow-lg' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 mr-2 ${
                    isActive ? 'text-white' : dept.color
                  }`} />
                  <span>{dept.name}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : `${dept.bgColor} ${dept.color}`
                  }`}>
                    {dept.memberCount}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* 团队成员展示 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.4 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200"
        >
          {/* 控制按钮 */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevMember}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextMember}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentMemberIndex + 1} / {filteredMembers.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAutoPlay}
              >
                {isAutoPlay ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* 成员详情 */}
          <motion.div
            key={currentMember.id}
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
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 mb-6"
              >
                <div className="flex items-start mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mr-6 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentMember.name}
                    </h3>
                    <p className="text-lg text-blue-600 font-semibold mb-2">
                      {currentMember.position}
                    </p>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{currentMember.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>加入于 {currentMember.joinDate}</span>
                    </div>
                  </div>
                </div>

                {/* 个人简介 */}
                <p className="text-gray-700 leading-relaxed">
                  {currentMember.bio}
                </p>
              </motion.div>

              {/* 个人格言 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-200"
              >
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      个人格言
                    </h4>
                    <p className="text-gray-700 italic">
                      "{currentMember.quote}"
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 右侧：技能和爱好 */}
            <div className="space-y-6">
              {/* 专业技能 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.3 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  专业技能
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentMember.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        ...ANIMATION_CONFIG.smooth, 
                        delay: 0.4 + index * 0.1 
                      }}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* 兴趣爱好 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Smile className="w-5 h-5 text-green-500 mr-2" />
                  兴趣爱好
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentMember.hobbies.map((hobby, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        ...ANIMATION_CONFIG.smooth, 
                        delay: 0.5 + index * 0.1 
                      }}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      {hobby}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* 部门信息 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.5 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                {(() => {
                  const dept = departments.find(d => d.id === currentMember.department);
                  if (!dept) return null;
                  
                  const IconComponent = dept.icon;
                  return (
                    <>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <IconComponent className={`w-5 h-5 ${dept.color} mr-2`} />
                        所属部门
                      </h4>
                      <div className={`${dept.bgColor} rounded-xl p-4`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-lg font-semibold ${dept.color}`}>
                            {dept.name}
                          </span>
                          <span className={`text-sm ${dept.color} opacity-80`}>
                            {dept.memberCount} 人
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {dept.description}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </div>
          </motion.div>

          {/* 成员导航点 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.6 }}
            className="flex justify-center mt-8"
          >
            <div className="flex space-x-2">
              {filteredMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMemberIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentMemberIndex 
                      ? 'bg-blue-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* 团队文化 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.7 }}
          className="mt-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              我们的团队文化
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              开放、创新、协作、成长 - 这些价值观指引着我们前进的方向
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Lightbulb,
                title: '创新思维',
                description: '鼓励创新想法，勇于尝试新技术和方法'
              },
              {
                icon: Users,
                title: '团队协作',
                description: '相互支持，共同成长，追求团队成功'
              },
              {
                icon: TrendingUp,
                title: '持续学习',
                description: '保持好奇心，不断提升专业技能'
              },
              {
                icon: Heart,
                title: '工作热情',
                description: '热爱工作，享受创造价值的过程'
              }
            ].map((culture, index) => {
              const IconComponent = culture.icon;
              return (
                <motion.div
                  key={culture.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.8 + index * 0.1 
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {culture.title}
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {culture.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamIntro;