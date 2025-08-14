'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Button, Badge } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface CaseData {
  id: string;
  title: string;
  subtitle: string;
  client: string;
  industry: string;
  location: string;
  duration: string;
  teamSize: string;
  budget: string;
  coverImage: string;
  tags: string[];
}

interface CaseDetailHeroProps extends ComponentProps {
  caseData: CaseData;
}

export default function CaseDetailHero({ caseData, className }: CaseDetailHeroProps) {
  const projectDetails = [
    {
      icon: Calendar,
      label: '项目周期',
      value: caseData.duration
    },
    {
      icon: MapPin,
      label: '项目地点',
      value: caseData.location
    },
    {
      icon: Users,
      label: '团队规模',
      value: caseData.teamSize
    },
    {
      icon: DollarSign,
      label: '项目预算',
      value: caseData.budget
    }
  ];

  return (
    <section className={cn('relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden', className)}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src={caseData.coverImage}
          alt={caseData.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={ANIMATION_CONFIG.smooth}
          >
            {/* Back Button */}
            <div className="mb-8">
              <Link href="/cases">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回案例列表
                </Button>
              </Link>
            </div>

            {/* Industry Badge */}
            <div className="mb-6">
              <Badge 
                variant="outline" 
                className="bg-blue-500/20 text-blue-300 border-blue-500/30 backdrop-blur-sm"
              >
                {caseData.industry}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="block text-white mb-2">
                {caseData.title}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-blue-300 mb-8 font-medium">
              {caseData.subtitle}
            </p>

            {/* Client */}
            <div className="mb-8">
              <p className="text-gray-300 mb-2">客户</p>
              <p className="text-2xl font-bold text-white">
                {caseData.client}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {caseData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-white/10 text-white border-white/20 backdrop-blur-sm"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                联系我们
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm"
              >
                下载案例详情
              </Button>
            </div>
          </motion.div>

          {/* Project Details Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, ...ANIMATION_CONFIG.smooth }}
            className="lg:justify-self-end w-full max-w-md"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                项目详情
              </h3>
              
              <div className="space-y-6">
                {projectDetails.map((detail, index) => {
                  const Icon = detail.icon;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, ...ANIMATION_CONFIG.smooth }}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-300" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          {detail.label}
                        </p>
                        <p className="text-white font-semibold">
                          {detail.value}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">
                      300%
                    </div>
                    <div className="text-xs text-gray-400">
                      业务增长
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">
                      95%
                    </div>
                    <div className="text-xs text-gray-400">
                      客户满意度
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, ...ANIMATION_CONFIG.smooth }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center space-y-2">
            <p className="text-gray-400 text-sm">
              向下滚动查看详情
            </p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}