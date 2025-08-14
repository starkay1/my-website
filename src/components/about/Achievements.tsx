'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  Award,
  Trophy,
  Medal,
  Star,
  Crown,
  Shield,
  Target,
  TrendingUp,
  Users,
  Globe,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Heart,
  Filter,
  Search
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

// Achievements Props接口
export interface AchievementsProps extends ComponentProps {
  // 可以添加自定义属性
}

// 成就类型
type AchievementCategory = 'design' | 'innovation' | 'business' | 'social' | 'all';

// Achievements组件
export const Achievements: React.FC<AchievementsProps> = ({ className }) => {
  const t = useTranslations('about');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  // 成就分类
  const categories = [
    { id: 'all' as AchievementCategory, name: '全部', icon: Star },
    { id: 'design' as AchievementCategory, name: '设计奖项', icon: Award },
    { id: 'innovation' as AchievementCategory, name: '创新奖项', icon: Trophy },
    { id: 'business' as AchievementCategory, name: '商业成就', icon: TrendingUp },
    { id: 'social' as AchievementCategory, name: '社会责任', icon: Shield }
  ];

  // 成就数据
  const achievements = [
    {
      id: 1,
      title: '国际设计大奖金奖',
      subtitle: 'International Design Awards Gold',
      category: 'design' as AchievementCategory,
      year: '2023',
      organization: '国际设计协会',
      description: '凭借"未来办公空间"项目获得国际设计大奖金奖，展现了我们在空间设计领域的卓越创新能力。',
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      level: 'gold',
      impact: '提升国际知名度，获得更多海外项目机会',
      link: 'https://example.com/award1'
    },
    {
      id: 2,
      title: 'AI创新应用奖',
      subtitle: 'AI Innovation Application Award',
      category: 'innovation' as AchievementCategory,
      year: '2023',
      organization: '中国人工智能学会',
      description: '我们开发的AI辅助设计系统获得行业认可，在提升设计效率和质量方面取得突破性进展。',
      icon: Trophy,
      color: 'from-blue-500 to-purple-500',
      level: 'platinum',
      impact: '引领行业数字化转型，设计效率提升50%',
      link: 'https://example.com/award2'
    },
    {
      id: 3,
      title: '绿色建筑先锋奖',
      subtitle: 'Green Building Pioneer Award',
      category: 'social' as AchievementCategory,
      year: '2022',
      organization: '中国绿色建筑委员会',
      description: '在推广绿色建筑理念和可持续设计方面的杰出贡献，获得行业和社会的广泛认可。',
      icon: Shield,
      color: 'from-green-500 to-teal-500',
      level: 'gold',
      impact: '推动行业环保标准提升，减少碳排放30%',
      link: 'https://example.com/award3'
    },
    {
      id: 4,
      title: '年度最佳雇主',
      subtitle: 'Best Employer of the Year',
      category: 'business' as AchievementCategory,
      year: '2022',
      organization: '人力资源管理协会',
      description: '在员工关怀、企业文化建设和人才发展方面的优秀表现，获得最佳雇主称号。',
      icon: Users,
      color: 'from-indigo-500 to-blue-500',
      level: 'gold',
      impact: '员工满意度98%，人才流失率降至5%',
      link: 'https://example.com/award4'
    },
    {
      id: 5,
      title: '智慧城市建设贡献奖',
      subtitle: 'Smart City Construction Award',
      category: 'innovation' as AchievementCategory,
      year: '2022',
      organization: '智慧城市发展联盟',
      description: '在智慧城市空间规划和智能化改造项目中的突出贡献，推动城市现代化发展。',
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      level: 'platinum',
      impact: '参与10+智慧城市项目，服务人口超100万',
      link: 'https://example.com/award5'
    },
    {
      id: 6,
      title: '设计创新企业奖',
      subtitle: 'Design Innovation Enterprise Award',
      category: 'design' as AchievementCategory,
      year: '2021',
      organization: '中国设计产业协会',
      description: '在设计创新、技术应用和市场拓展方面的综合表现，获得行业权威认可。',
      icon: Award,
      color: 'from-red-500 to-pink-500',
      level: 'gold',
      impact: '设计专利申请20+项，行业影响力显著提升',
      link: 'https://example.com/award6'
    },
    {
      id: 7,
      title: '社会责任企业奖',
      subtitle: 'Corporate Social Responsibility Award',
      category: 'social' as AchievementCategory,
      year: '2021',
      organization: '中国企业社会责任协会',
      description: '在公益事业、社区建设和环境保护方面的积极贡献，体现企业社会责任担当。',
      icon: Heart,
      color: 'from-emerald-500 to-green-500',
      level: 'gold',
      impact: '公益项目投入500万+，受益人群10万+',
      link: 'https://example.com/award7'
    },
    {
      id: 8,
      title: '高新技术企业认证',
      subtitle: 'High-tech Enterprise Certification',
      category: 'innovation' as AchievementCategory,
      year: '2020',
      organization: '科技部',
      description: '通过国家高新技术企业认证，在技术创新和研发投入方面达到国家标准。',
      icon: Target,
      color: 'from-cyan-500 to-blue-500',
      level: 'platinum',
      impact: 'R&D投入占营收15%，技术专利30+项',
      link: 'https://example.com/award8'
    }
  ];

  // 筛选成就
  const filteredAchievements = achievements.filter(achievement => {
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 分页
  const totalPages = Math.ceil(filteredAchievements.length / itemsPerPage);
  const paginatedAchievements = filteredAchievements.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // 重置分页当筛选条件改变时
  React.useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory, searchTerm]);

  // 获取等级颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'platinum': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      default: return 'from-bronze-400 to-bronze-600';
    }
  };

  // 获取等级图标
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'platinum': return Crown;
      case 'gold': return Trophy;
      case 'silver': return Medal;
      default: return Award;
    }
  };

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
            成就与荣誉
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            这些荣誉见证了我们的专业实力和不懈努力，激励我们继续追求卓越
          </p>
        </motion.div>

        {/* 筛选和搜索 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
          className="mb-12"
        >
          {/* 分类筛选 */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isActive = selectedCategory === category.id;
                
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 mr-2 ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`} />
                    {category.name}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* 搜索框 */}
          <div className="flex justify-center">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="搜索成就..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>
          </div>
        </motion.div>

        {/* 成就展示 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
          className="mb-12"
        >
          {paginatedAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedAchievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                const LevelIcon = getLevelIcon(achievement.level);
                
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      ...ANIMATION_CONFIG.smooth, 
                      delay: 0.3 + index * 0.1 
                    }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {/* 头部 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-14 h-14 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center mr-4`}>
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 mr-2">
                              {achievement.title}
                            </h3>
                            <div className={`w-6 h-6 bg-gradient-to-br ${getLevelColor(achievement.level)} rounded-full flex items-center justify-center`}>
                              <LevelIcon className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            {achievement.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 年份和机构 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {achievement.year}
                      </div>
                      <div className="text-sm text-gray-600">
                        {achievement.organization}
                      </div>
                    </div>

                    {/* 描述 */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {achievement.description}
                    </p>

                    {/* 影响 */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        影响与成果
                      </h4>
                      <p className="text-sm text-gray-600">
                        {achievement.impact}
                      </p>
                    </div>

                    {/* 链接 */}
                    {achievement.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center"
                        onClick={() => window.open(achievement.link, '_blank')}
                      >
                        查看详情
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                未找到相关成就
              </h3>
              <p className="text-gray-600">
                请尝试调整筛选条件或搜索关键词
              </p>
            </div>
          )}
        </motion.div>

        {/* 分页 */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.4 }}
            className="flex justify-center items-center space-x-4"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-8 h-8 rounded-lg font-medium transition-all duration-300 ${
                    i === currentPage
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* 统计数据 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.5 }}
          className="mt-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              荣誉统计
            </h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              这些数字展现了我们在各个领域取得的卓越成就
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, value: '50+', label: '获得奖项', description: '国内外权威奖项' },
              { icon: Trophy, value: '15+', label: '金奖数量', description: '最高级别荣誉' },
              { icon: Star, value: '8', label: '年度奖项', description: '2023年获得奖项' },
              { icon: Globe, value: '10+', label: '国际认可', description: '国际组织颁发' }
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
                    delay: 0.6 + index * 0.1 
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
                  <div className="text-lg font-semibold text-blue-100 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-blue-200">
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

export default Achievements;