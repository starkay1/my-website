'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  Building,
  MapPin,
  Coffee,
  Wifi,
  Car,
  Utensils,
  Gamepad2,
  Dumbbell,
  BookOpen,
  Music,
  Monitor,
  Sofa,
  TreePine,
  Sun,
  Wind,
  Zap,
  Shield,
  Heart,
  Users,
  Camera,
  Play,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Star,
  Clock,
  Award,
  Smile
} from 'lucide-react';
import { Button } from '@/components/ui';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

// OfficeEnvironment Props接口
export interface OfficeEnvironmentProps extends ComponentProps {
  // 可以添加自定义属性
}

// 办公室数据接口
interface Office {
  id: number;
  name: string;
  location: string;
  address: string;
  area: string;
  capacity: number;
  established: string;
  description: string;
  images: string[];
  features: string[];
  facilities: {
    icon: React.ComponentType<any>;
    name: string;
    description: string;
  }[];
  highlights: {
    icon: React.ComponentType<any>;
    title: string;
    value: string;
    description: string;
  }[];
}

// 环境特色数据接口
interface EnvironmentFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  details: string[];
}

// OfficeEnvironment组件
export const OfficeEnvironment: React.FC<OfficeEnvironmentProps> = ({ className }) => {
  const t = useTranslations('about');
  const [selectedOffice, setSelectedOffice] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // 办公室数据
  const offices: Office[] = [
    {
      id: 1,
      name: '北京总部',
      location: '北京',
      address: '北京市朝阳区建国门外大街1号',
      area: '2,500㎡',
      capacity: 200,
      established: '2018',
      description: '我们的总部位于北京CBD核心区域，拥有现代化的办公环境和完善的配套设施。开放式的设计理念营造了自由、创新的工作氛围。',
      images: [
        '/images/office/beijing-1.jpg',
        '/images/office/beijing-2.jpg',
        '/images/office/beijing-3.jpg',
        '/images/office/beijing-4.jpg',
        '/images/office/beijing-5.jpg'
      ],
      features: ['开放式办公区', '独立会议室', '创意讨论区', '休闲咖啡厅', '健身房', '图书角'],
      facilities: [
        { icon: Coffee, name: '咖啡厅', description: '24小时免费咖啡和茶饮' },
        { icon: Wifi, name: '高速网络', description: '千兆光纤网络覆盖' },
        { icon: Car, name: '停车场', description: '地下停车场，员工免费使用' },
        { icon: Utensils, name: '餐厅', description: '员工餐厅，营养健康餐食' },
        { icon: Dumbbell, name: '健身房', description: '专业健身设备和瑜伽室' },
        { icon: Gamepad2, name: '娱乐区', description: '游戏室和休闲娱乐设施' }
      ],
      highlights: [
        { icon: Users, title: '员工容量', value: '200+', description: '可容纳员工数量' },
        { icon: Building, title: '办公面积', value: '2,500㎡', description: '总办公面积' },
        { icon: Star, title: '满意度', value: '98%', description: '员工环境满意度' },
        { icon: Award, title: '获得认证', value: 'LEED金级', description: '绿色建筑认证' }
      ]
    },
    {
      id: 2,
      name: '上海分部',
      location: '上海',
      address: '上海市浦东新区陆家嘴环路1000号',
      area: '1,800㎡',
      capacity: 150,
      established: '2019',
      description: '上海分部位于陆家嘴金融中心，享有黄浦江美景。现代简约的设计风格，为团队提供了舒适高效的工作环境。',
      images: [
        '/images/office/shanghai-1.jpg',
        '/images/office/shanghai-2.jpg',
        '/images/office/shanghai-3.jpg',
        '/images/office/shanghai-4.jpg'
      ],
      features: ['江景办公区', '多功能会议室', '创新实验室', '屋顶花园', '员工休息室'],
      facilities: [
        { icon: Coffee, name: '精品咖啡', description: '专业咖啡师现场制作' },
        { icon: TreePine, name: '屋顶花园', description: '绿色生态办公环境' },
        { icon: Monitor, name: '智能设备', description: '最新科技办公设备' },
        { icon: Sofa, name: '休息区', description: '舒适的休息和交流空间' },
        { icon: BookOpen, name: '图书馆', description: '专业书籍和学习资源' },
        { icon: Music, name: '音响系统', description: '背景音乐和会议音响' }
      ],
      highlights: [
        { icon: Users, title: '员工容量', value: '150+', description: '可容纳员工数量' },
        { icon: Building, title: '办公面积', value: '1,800㎡', description: '总办公面积' },
        { icon: Sun, title: '采光率', value: '95%', description: '自然采光覆盖率' },
        { icon: Heart, title: '绿化率', value: '30%', description: '办公区绿化覆盖' }
      ]
    },
    {
      id: 3,
      name: '深圳研发中心',
      location: '深圳',
      address: '深圳市南山区科技园南区深南大道9988号',
      area: '2,000㎡',
      capacity: 180,
      established: '2020',
      description: '深圳研发中心专注于技术创新，配备了最先进的研发设施和实验室。开放创新的环境激发团队的创造力。',
      images: [
        '/images/office/shenzhen-1.jpg',
        '/images/office/shenzhen-2.jpg',
        '/images/office/shenzhen-3.jpg'
      ],
      features: ['研发实验室', '产品展示厅', '技术讨论区', '创客空间', 'VR体验室'],
      facilities: [
        { icon: Zap, name: '实验室', description: '专业技术研发实验室' },
        { icon: Monitor, name: '展示厅', description: '产品展示和演示空间' },
        { icon: Gamepad2, name: 'VR体验', description: 'VR/AR技术体验中心' },
        { icon: Coffee, name: '创意咖啡', description: '激发灵感的咖啡空间' },
        { icon: Wind, name: '新风系统', description: '智能空气净化系统' },
        { icon: Shield, name: '安全系统', description: '先进的安防监控系统' }
      ],
      highlights: [
        { icon: Users, title: '研发人员', value: '120+', description: '专业研发团队' },
        { icon: Zap, title: '实验室', value: '8个', description: '专业实验室数量' },
        { icon: Award, title: '专利数量', value: '50+', description: '已申请专利数量' },
        { icon: Clock, title: '创新效率', value: '200%', description: '相比传统办公提升' }
      ]
    }
  ];

  // 环境特色数据
  const environmentFeatures: EnvironmentFeature[] = [
    {
      id: 'design',
      title: '现代设计',
      description: '简约现代的设计风格，营造舒适的工作氛围',
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      details: [
        '开放式办公布局，促进团队协作',
        '自然采光设计，减少眼部疲劳',
        '人体工学家具，保护员工健康',
        '色彩搭配科学，提升工作效率'
      ]
    },
    {
      id: 'technology',
      title: '智能科技',
      description: '先进的智能办公系统，提升工作效率',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      details: [
        '智能会议室预订系统',
        '无线投屏和视频会议设备',
        '智能照明和温控系统',
        '高速稳定的网络环境'
      ]
    },
    {
      id: 'wellness',
      title: '健康环保',
      description: '关注员工健康，打造绿色办公环境',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      details: [
        '新风系统保证空气质量',
        '绿植装饰净化空气',
        '健身房和瑜伽室',
        '健康餐饮和饮水设施'
      ]
    },
    {
      id: 'culture',
      title: '文化氛围',
      description: '营造积极向上的企业文化氛围',
      icon: Smile,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      details: [
        '团队活动和聚会空间',
        '图书角和学习区域',
        '艺术作品和文化展示',
        '员工休息和交流区域'
      ]
    }
  ];

  const currentOffice = offices[selectedOffice];

  const nextOffice = () => {
    setSelectedOffice((prev) => (prev + 1) % offices.length);
    setSelectedImageIndex(0);
  };

  const prevOffice = () => {
    setSelectedOffice((prev) => (prev - 1 + offices.length) % offices.length);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % currentOffice.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + currentOffice.images.length) % currentOffice.images.length);
  };

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
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
            办公环境
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们致力于为员工创造舒适、现代、充满活力的工作环境，让每个人都能在这里发挥最大潜能
          </p>
        </motion.div>

        {/* 办公室选择 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              {offices.map((office, index) => {
                const isActive = index === selectedOffice;
                
                return (
                  <motion.button
                    key={office.id}
                    onClick={() => {
                      setSelectedOffice(index);
                      setSelectedImageIndex(0);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center p-6 rounded-2xl transition-all duration-300 min-w-[160px] ${
                      isActive 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Building className={`w-8 h-8 mb-3 ${
                      isActive ? 'text-white' : 'text-blue-500'
                    }`} />
                    <span className="text-lg font-semibold text-center">
                      {office.name}
                    </span>
                    <span className="text-sm opacity-80 text-center">
                      {office.location}
                    </span>
                    <span className="text-xs opacity-70 text-center mt-1">
                      {office.area}
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
              onClick={prevOffice}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextOffice}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* 办公室详情 */}
        <motion.div
          key={selectedOffice}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        >
          {/* 左侧：图片展示 */}
          <div>
            {/* 主图片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
              className="relative mb-6"
            >
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-200 relative group cursor-pointer"
                   onClick={() => openGallery(selectedImageIndex)}>
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-white" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              
              {/* 图片导航 */}
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="bg-white/90 hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="bg-white/90 hover:bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* 缩略图 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
              className="grid grid-cols-5 gap-2"
            >
              {currentOffice.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImageIndex(index);
                    openGallery(index);
                  }}
                  className={`aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    index === selectedImageIndex 
                      ? 'border-blue-500 scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </button>
              ))}
            </motion.div>
          </div>

          {/* 右侧：办公室信息 */}
          <div>
            {/* 基本信息 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 mb-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {currentOffice.name}
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>{currentOffice.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Building className="w-5 h-5 mr-3" />
                  <span>建立于 {currentOffice.established} 年</span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {currentOffice.description}
              </p>
            </motion.div>

            {/* 亮点数据 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.3 }}
              className="grid grid-cols-2 gap-4 mb-6"
            >
              {currentOffice.highlights.map((highlight, index) => {
                const IconComponent = highlight.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <IconComponent className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{highlight.title}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {highlight.value}
                    </div>
                    <div className="text-xs text-gray-600">
                      {highlight.description}
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* 特色功能 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.4 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                特色功能区域
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentOffice.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 配套设施 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.5 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            配套设施
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentOffice.facilities.map((facility, index) => {
              const IconComponent = facility.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.6 + index * 0.1 
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {facility.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {facility.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 环境特色 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.7 }}
          className="bg-gray-50 rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              环境特色
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              我们的办公环境融合了现代设计、智能科技、健康理念和企业文化
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {environmentFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              const isSelected = selectedFeature === feature.id;
              
              return (
                <motion.button
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.8 + index * 0.1 
                  }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedFeature(isSelected ? null : feature.id)}
                  className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
                    isSelected 
                      ? 'bg-white border-blue-500 shadow-lg' 
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* 特色详情 */}
          {selectedFeature && (() => {
            const feature = environmentFeatures.find(f => f.id === selectedFeature);
            if (!feature) return null;
            
            return (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={ANIMATION_CONFIG.smooth}
                className="bg-white rounded-2xl p-6 border border-gray-200"
              >
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title} - 详细介绍
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feature.details.map((detail, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        ...ANIMATION_CONFIG.smooth, 
                        delay: index * 0.1 
                      }}
                      className="flex items-start"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })()}
        </motion.div>

        {/* 图片画廊模态框 */}
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeGallery}
          >
            <div className="relative max-w-4xl w-full">
              <button
                onClick={closeGallery}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors duration-300 z-10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-800">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <Camera className="w-24 h-24 text-white" />
                </div>
              </div>
              
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {selectedImageIndex + 1} / {currentOffice.images.length}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default OfficeEnvironment;