'use client';

import { motion } from 'framer-motion';
import { Clock, CheckCircle2, FileText, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent, Badge } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface ProcessTimelineProps extends ComponentProps {
  process: {
    phase: string;
    title: string;
    description: string;
    deliverables: string[];
  }[];
}

export default function ProcessTimeline({ process, className }: ProcessTimelineProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: ANIMATION_CONFIG.smooth
    }
  };

  const getPhaseColor = (index: number) => {
    const colors = [
      { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', bgLight: 'bg-blue-50' },
      { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', bgLight: 'bg-purple-50' },
      { bg: 'from-green-500 to-green-600', text: 'text-green-600', bgLight: 'bg-green-50' },
      { bg: 'from-orange-500 to-orange-600', text: 'text-orange-600', bgLight: 'bg-orange-50' }
    ];
    return colors[index % colors.length];
  };

  return (
    <section className={cn('py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-gray-100', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-blue-600 text-sm font-medium mb-6">
            <Clock className="w-4 h-4 mr-2" />
            项目时间线
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="block text-gray-900 mb-2">
              实施
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              时间线
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            详细展示项目从启动到完成的每个关键阶段和重要里程碑
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 hidden lg:block" />

          <div className="space-y-12 lg:space-y-16">
            {process.map((item, index) => {
              const colors = getPhaseColor(index);
              
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-8 w-4 h-4 rounded-full bg-white border-4 border-current hidden lg:block z-10" 
                       style={{ color: colors.bg.includes('blue') ? '#3b82f6' : colors.bg.includes('purple') ? '#8b5cf6' : colors.bg.includes('green') ? '#10b981' : '#f59e0b' }} />

                  <div className="lg:ml-20">
                    <Card className="group hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Phase Info */}
                          <div className="lg:col-span-1">
                            <Badge 
                              variant="secondary" 
                              className={cn('mb-4', colors.bgLight, colors.text)}
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              {item.phase}
                            </Badge>
                            
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                              {item.title}
                            </h3>
                            
                            <p className="text-gray-600 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Deliverables */}
                          <div className="lg:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                              <FileText className={cn('w-5 h-5', colors.text)} />
                              <h4 className="text-lg font-semibold text-gray-900">
                                主要交付物
                              </h4>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {item.deliverables.map((deliverable, deliverableIndex) => (
                                <motion.div
                                  key={deliverableIndex}
                                  initial={{ opacity: 0, y: 10 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 * deliverableIndex, ...ANIMATION_CONFIG.smooth }}
                                  viewport={{ once: true }}
                                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors"
                                >
                                  <CheckCircle2 className={cn('w-4 h-4 flex-shrink-0', colors.text)} />
                                  <span className="text-gray-700 text-sm font-medium">
                                    {deliverable}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>阶段 {index + 1} / {process.length}</span>
                            <div className="flex space-x-1">
                              {process.map((_, dotIndex) => (
                                <div
                                  key={dotIndex}
                                  className={cn(
                                    'w-2 h-2 rounded-full transition-colors',
                                    dotIndex <= index 
                                      ? cn('bg-gradient-to-r', colors.bg)
                                      : 'bg-gray-300'
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Timeline Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-20"
        >
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-2xl p-1">
            <div className="bg-white rounded-xl p-8 lg:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  项目执行亮点
                </h3>
                <p className="text-gray-600">
                  严格按照时间计划执行，确保项目高质量交付
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    100%
                  </div>
                  <p className="text-gray-600 text-sm">
                    按时交付率
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    15+
                  </div>
                  <p className="text-gray-600 text-sm">
                    关键交付物
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    0
                  </div>
                  <p className="text-gray-600 text-sm">
                    延期里程碑
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    6个月
                  </div>
                  <p className="text-gray-600 text-sm">
                    项目周期
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}