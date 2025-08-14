'use client';

import { motion } from 'framer-motion';
import { Eye, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/types';

interface CaseOverviewProps extends ComponentProps {
  overview: {
    challenge: string;
    solution: string;
    results: string;
  };
  gallery: string[];
}

export default function CaseOverview({ overview, gallery, className }: CaseOverviewProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <section className={cn('py-20 px-4 sm:px-6 lg:px-8 bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* 项目概述 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">项目概述</h2>
            </div>
            
            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">挑战</h3>
                <p className="mb-4">{overview.challenge}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">解决方案</h3>
                <p className="mb-4">{overview.solution}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">成果</h3>
                <p className="mb-4">{overview.results}</p>
              </div>
            </div>
          </motion.div>

          {/* 项目画廊 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">项目画廊</h2>
            </div>

            {/* 主图片 */}
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={gallery[selectedImage]}
                alt={`项目图片 ${selectedImage + 1}`}
                fill
                className="object-cover"
              />
            </div>

            {/* 缩略图 */}
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'relative aspect-square rounded-lg overflow-hidden transition-all duration-300',
                    selectedImage === index
                      ? 'ring-4 ring-purple-500 shadow-lg'
                      : 'hover:ring-2 hover:ring-purple-300 opacity-70 hover:opacity-100'
                  )}
                >
                  <Image
                    src={image}
                    alt={`缩略图 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}