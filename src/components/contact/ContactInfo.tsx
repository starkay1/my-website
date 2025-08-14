'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Calendar,
  Users,
  Award,
  Globe,
  Building,
  Car,
  Coffee
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent, Button } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface ContactInfoProps extends ComponentProps {}

interface ContactMethod {
  icon: React.ComponentType<any>;
  title: string;
  value: string;
  description: string;
  action: string;
  color: string;
  gradient: string;
}

interface OfficeInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  features: string[];
  image: string;
}

export default function ContactInfo({ className }: ContactInfoProps) {
  const contactMethods: ContactMethod[] = [
    {
      icon: Phone,
      title: '电话咨询',
      value: '+86 400-123-4567',
      description: '工作日 9:00-18:00 专业顾问在线',
      action: '立即拨打',
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Mail,
      title: '邮件联系',
      value: 'contact@spaceplus.com',
      description: '24小时内回复，详细需求沟通',
      action: '发送邮件',
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageCircle,
      title: '在线客服',
      value: '微信客服',
      description: '扫码添加，即时响应您的咨询',
      action: '添加微信',
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Calendar,
      title: '预约会议',
      value: '视频会议',
      description: '30分钟免费咨询，深度需求分析',
      action: '预约时间',
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const offices: OfficeInfo[] = [
    {
      name: '北京总部',
      address: '北京市朝阳区建国门外大街1号国贸大厦A座2801',
      phone: '+86 010-8888-9999',
      email: 'beijing@spaceplus.com',
      hours: '周一至周五 9:00-18:00',
      features: ['地铁直达', '免费停车', '会议室', '咖啡厅'],
      image: '/images/office-beijing.jpg'
    },
    {
      name: '上海分公司',
      address: '上海市浦东新区陆家嘴环路1000号恒生银行大厦15楼',
      phone: '+86 021-6666-7777',
      email: 'shanghai@spaceplus.com',
      hours: '周一至周五 9:00-18:00',
      features: ['地铁2号线', '访客停车', '展示厅', '休息区'],
      image: '/images/office-shanghai.jpg'
    },
    {
      name: '深圳分公司',
      address: '深圳市南山区深南大道9988号华润大厦北座20楼',
      phone: '+86 0755-8888-6666',
      email: 'shenzhen@spaceplus.com',
      hours: '周一至周五 9:00-18:00',
      features: ['科技园区', '充电桩', '路演厅', '健身房'],
      image: '/images/office-shenzhen.jpg'
    }
  ];

  const businessHours = [
    { day: '周一至周五', time: '9:00 - 18:00', status: 'open' },
    { day: '周六', time: '10:00 - 16:00', status: 'limited' },
    { day: '周日', time: '休息', status: 'closed' }
  ];

  const stats = [
    { label: '平均响应时间', value: '< 2小时', icon: Clock },
    { label: '客户满意度', value: '98.5%', icon: Award },
    { label: '服务覆盖', value: '全国50+城市', icon: Globe },
    { label: '专业顾问', value: '100+人', icon: Users }
  ];

  return (
    <div className={className}>
      {/* Contact Methods */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={ANIMATION_CONFIG.smooth}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            多种联系方式
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            选择最适合您的沟通方式，我们的专业团队随时为您提供支持
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...ANIMATION_CONFIG.smooth, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className={cn(
                      'w-16 h-16 rounded-full bg-gradient-to-r mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300',
                      method.gradient
                    )}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className={cn('font-medium mb-2', method.color)}>
                      {method.value}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      {method.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full group-hover:bg-gray-50 transition-colors duration-300"
                    >
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Office Locations */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={ANIMATION_CONFIG.smooth}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            办公地址
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            我们在全国主要城市设有办公室，为您提供就近服务
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {offices.map((office, index) => (
            <motion.div
              key={office.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{office.name}</h3>
                    <div className="flex items-center text-sm opacity-90">
                      <Building className="w-4 h-4 mr-1" />
                      总部办公
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 font-medium mb-1">地址</p>
                        <p className="text-gray-600 text-sm">{office.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-gray-900 font-medium mb-1">电话</p>
                        <p className="text-blue-600 text-sm font-medium">{office.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-gray-900 font-medium mb-1">邮箱</p>
                        <p className="text-blue-600 text-sm font-medium">{office.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-gray-900 font-medium mb-1">营业时间</p>
                        <p className="text-gray-600 text-sm">{office.hours}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-900 font-medium mb-2">办公设施</p>
                      <div className="flex flex-wrap gap-2">
                        {office.features.map((feature, idx) => {
                          const icons = {
                            '地铁直达': MapPin,
                            '地铁2号线': MapPin,
                            '科技园区': Building,
                            '免费停车': Car,
                            '访客停车': Car,
                            '充电桩': Car,
                            '会议室': Users,
                            '展示厅': Users,
                            '路演厅': Users,
                            '咖啡厅': Coffee,
                            '休息区': Coffee,
                            '健身房': Users
                          };
                          const FeatureIcon = icons[feature as keyof typeof icons] || Building;
                          
                          return (
                            <div key={idx} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                              <FeatureIcon className="w-3 h-3 text-gray-500 mr-1" />
                              <span className="text-xs text-gray-700">{feature}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      查看地图
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Business Hours & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Business Hours */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">
                  营业时间
                </h3>
              </div>
              
              <div className="space-y-4">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-gray-700 font-medium">{schedule.day}</span>
                    <div className="flex items-center">
                      <span className={cn(
                        'text-sm font-medium mr-3',
                        schedule.status === 'open' ? 'text-green-600' :
                        schedule.status === 'limited' ? 'text-orange-600' :
                        'text-gray-500'
                      )}>
                        {schedule.time}
                      </span>
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        schedule.status === 'open' ? 'bg-green-500' :
                        schedule.status === 'limited' ? 'bg-orange-500' :
                        'bg-gray-400'
                      )} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  💡 紧急项目支持：7×24小时在线服务，随时响应您的需求
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Stats */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">
                  服务保障
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  为什么选择我们？
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 10年+行业经验，服务1000+企业客户</li>
                  <li>• ISO 9001质量管理体系认证</li>
                  <li>• 专业团队，平均从业经验8年以上</li>
                  <li>• 全程项目管理，确保按时交付</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}