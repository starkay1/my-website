'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock,
  Car,
  Train,
  Coffee,
  Building,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent, Button } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface ContactMapProps extends ComponentProps {}

interface MapLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  coordinates: [number, number];
  description: string;
  features: string[];
  transportation: {
    subway: string[];
    bus: string[];
    parking: boolean;
  };
  landmarks: string[];
}

export default function ContactMap({ className }: ContactMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>('beijing');

  const locations: MapLocation[] = [
    {
      id: 'beijing',
      name: '北京总部',
      address: '北京市朝阳区建国门外大街1号国贸大厦A座2801',
      phone: '+86 010-8888-9999',
      coordinates: [116.4074, 39.9042],
      description: '位于CBD核心区域，交通便利，周边商务配套完善',
      features: ['总部办公', '会议室', '展示厅', '咖啡厅'],
      transportation: {
        subway: ['地铁1号线国贸站', '地铁10号线国贸站'],
        bus: ['1路', '4路', '37路', '52路'],
        parking: true
      },
      landmarks: ['国贸商城', '中央电视台', '世贸天阶', '银泰中心']
    },
    {
      id: 'shanghai',
      name: '上海分公司',
      address: '上海市浦东新区陆家嘴环路1000号恒生银行大厦15楼',
      phone: '+86 021-6666-7777',
      coordinates: [121.4737, 31.2304],
      description: '坐落于陆家嘴金融区，俯瞰黄浦江美景',
      features: ['分公司', '客户接待', '项目展示', '休息区'],
      transportation: {
        subway: ['地铁2号线陆家嘴站', '地铁14号线陆家嘴站'],
        bus: ['81路', '82路', '85路', '583路'],
        parking: true
      },
      landmarks: ['东方明珠', '上海中心', '金茂大厦', '环球金融中心']
    },
    {
      id: 'shenzhen',
      name: '深圳分公司',
      address: '深圳市南山区深南大道9988号华润大厦北座20楼',
      phone: '+86 0755-8888-6666',
      coordinates: [113.9308, 22.5428],
      description: '位于科技创新中心，毗邻众多科技企业',
      features: ['分公司', '技术中心', '创新实验室', '路演厅'],
      transportation: {
        subway: ['地铁1号线高新园站', '地铁2号线科苑站'],
        bus: ['19路', '21路', '42路', '70路'],
        parking: true
      },
      landmarks: ['深圳湾公园', '腾讯大厦', '阿里中心', '华为总部']
    }
  ];

  const currentLocation = locations.find(loc => loc.id === selectedLocation) || locations[0];

  const directions = [
    {
      icon: Train,
      title: '地铁路线',
      items: currentLocation.transportation.subway,
      color: 'text-blue-600'
    },
    {
      icon: Car,
      title: '公交路线',
      items: currentLocation.transportation.bus,
      color: 'text-green-600'
    },
    {
      icon: Building,
      title: '周边地标',
      items: currentLocation.landmarks,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={ANIMATION_CONFIG.smooth}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          找到我们
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          我们在全国主要城市设有办公室，欢迎您来访交流
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Location Selector */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
          className="lg:col-span-1"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                选择办公室
              </h3>
              
              <div className="space-y-3">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => setSelectedLocation(location.id)}
                    className={cn(
                      'w-full text-left p-4 rounded-lg border-2 transition-all duration-300',
                      selectedLocation === location.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-start">
                      <MapPin className={cn(
                        'w-5 h-5 mr-3 mt-0.5',
                        selectedLocation === location.id ? 'text-blue-600' : 'text-gray-400'
                      )} />
                      <div className="flex-1">
                        <h4 className={cn(
                          'font-semibold mb-1',
                          selectedLocation === location.id ? 'text-blue-900' : 'text-gray-900'
                        )}>
                          {location.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {location.address}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-3 h-3 mr-1" />
                          {location.phone}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  营业时间
                </div>
                <p className="text-sm text-gray-800">
                  周一至周五：9:00 - 18:00<br />
                  周六：10:00 - 16:00<br />
                  周日：休息
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Map Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              {/* Map Placeholder */}
              <div className="relative h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden">
                {/* Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                
                {/* Map Grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-6 h-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-gray-300" />
                    ))}
                  </div>
                </div>

                {/* Location Marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative"
                  >
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rotate-45" />
                    
                    {/* Pulse Animation */}
                    <div className="absolute inset-0 w-12 h-12 bg-red-500 rounded-full animate-ping opacity-20" />
                  </motion.div>
                </div>

                {/* Location Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                    <h4 className="font-bold text-gray-900 mb-1">
                      {currentLocation.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {currentLocation.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentLocation.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 backdrop-blur-sm"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    导航
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 backdrop-blur-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    大图
                  </Button>
                </div>
              </div>

              {/* Location Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {directions.map((direction, index) => {
                    const Icon = direction.icon;
                    return (
                      <div key={index}>
                        <div className="flex items-center mb-3">
                          <Icon className={cn('w-5 h-5 mr-2', direction.color)} />
                          <h4 className="font-semibold text-gray-900">
                            {direction.title}
                          </h4>
                        </div>
                        <ul className="space-y-1">
                          {direction.items.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Button className="flex-1">
                    <Navigation className="w-4 h-4 mr-2" />
                    获取路线
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    电话联系
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Coffee className="w-4 h-4 mr-2" />
                    预约拜访
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={ANIMATION_CONFIG.smooth}
        viewport={{ once: true }}
        className="mt-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Car className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">停车便利</h4>
                <p className="text-sm text-gray-600">
                  所有办公室均提供免费停车位，访客专用车位充足
                </p>
              </div>
              <div className="text-center">
                <Train className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">交通便利</h4>
                <p className="text-sm text-gray-600">
                  地铁直达，多条公交线路，距离机场高铁站便利
                </p>
              </div>
              <div className="text-center">
                <Coffee className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">环境舒适</h4>
                <p className="text-sm text-gray-600">
                  现代化办公环境，配备咖啡厅、会议室等完善设施
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}