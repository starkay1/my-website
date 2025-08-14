'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface Challenge {
  title: string;
  description: string;
  impact: string;
}

interface Solution {
  title: string;
  description: string;
  implementation: string[];
}

interface ChallengesSolutionProps extends ComponentProps {
  challenges: Challenge[];
  solutions: Solution[];
}

export default function ChallengesSolution({ challenges, solutions, className }: ChallengesSolutionProps) {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: ANIMATION_CONFIG.smooth
    }
  };

  return (
    <section className={cn('py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={ANIMATION_CONFIG.smooth}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="block text-gray-900 mb-2">
              挑战与
            </span>
            <span className="block bg-gradient-to-r from-red-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              解决方案
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            深入分析项目面临的核心挑战，以及我们如何制定针对性的解决方案
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Challenges Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  面临挑战
                </h3>
              </div>
              <p className="text-gray-600 mb-8">
                项目启动前，客户面临的主要问题和挑战
              </p>
            </div>

            <div className="space-y-6">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-3">
                            {challenge.title}
                          </h4>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {challenge.description}
                          </p>
                          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <div className="flex items-start space-x-2">
                              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-red-800 mb-1">
                                  影响
                                </p>
                                <p className="text-sm text-red-700">
                                  {challenge.impact}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solutions Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  解决方案
                </h3>
              </div>
              <p className="text-gray-600 mb-8">
                针对每个挑战制定的具体解决方案和实施步骤
              </p>
            </div>

            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-3">
                            {solution.title}
                          </h4>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {solution.description}
                          </p>
                          
                          {/* Action Items */}
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            <div className="flex items-start space-x-2 mb-3">
                              <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm font-medium text-blue-800">
                                实施步骤
                              </p>
                            </div>
                            <div className="space-y-2">
                              {solution.implementation.map((action, actionIndex) => (
                                <div key={actionIndex} className="flex items-center space-x-2">
                                  <ArrowRight className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                  <span className="text-sm text-blue-700">
                                    {action}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Transformation Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, ...ANIMATION_CONFIG.smooth }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-20"
        >
          <div className="bg-gradient-to-r from-red-500 via-blue-500 to-green-500 rounded-2xl p-1">
            <div className="bg-white rounded-xl p-8 lg:p-12">
              <div className="text-center">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  从挑战到成功的转变
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  {/* Before */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      项目前
                    </h4>
                    <p className="text-gray-600 text-sm">
                      多重挑战阻碍发展
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex justify-center">
                    <ArrowRight className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  {/* After */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      项目后
                    </h4>
                    <p className="text-gray-600 text-sm">
                      问题解决，目标达成
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}