'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Button } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface HeroSectionProps extends ComponentProps {
  onCtaClick?: () => void;
  backgroundType?: 'gradient' | 'image' | 'video';
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity?: number;
}

export default function HeroSection({ 
  className, 
  onCtaClick,
  backgroundType = 'gradient',
  backgroundImage,
  backgroundVideo,
  overlayOpacity = 0.1
}: HeroSectionProps = {}) {
  const t = useTranslations('home.hero');

  const sectionClasses = cn(
    'relative min-h-screen flex items-center justify-center overflow-hidden',
    backgroundType === 'gradient' && 'bg-gradient-to-br from-primary-50 via-white to-secondary-50',
    className
  );

  const overlayClasses = `absolute inset-0 bg-gradient-to-r from-primary-600/${Math.round(overlayOpacity * 100)} to-secondary-600/${Math.round(overlayOpacity * 100)}`;

  const renderBackground = () => {
    switch (backgroundType) {
      case 'image':
        return backgroundImage ? (
          <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
            <div className={overlayClasses} />
          </div>
        ) : null;
      
      case 'video':
        return backgroundVideo ? (
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
            <div className={overlayClasses} />
          </div>
        ) : null;
      
      case 'gradient':
      default:
        return <div className={overlayClasses} />;
    }
  };

  return (
    <section className={sectionClasses}>
      {/* Background Elements */}
      {renderBackground()}
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: ANIMATION_CONFIG.duration.slow,
            ease: ANIMATION_CONFIG.easing.easeOut
          }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('slogan', { default: '全球夜生活品牌管理与孵化平台' })}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('subtitle', { default: '提供夜店项目托管、品牌顾问、品牌孵化与授权服务，帮助项目高效起盘与稳定增长' })}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: ANIMATION_CONFIG.duration.slow, 
                delay: 0.6,
                ease: ANIMATION_CONFIG.easing.easeOut
              }}
            >
              <Link href="/contact">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                  onClick={onCtaClick}
                >
                  {t('cta_primary', { default: '立即咨询' })}
                </Button>
              </Link>
              
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Play className="h-5 w-5" />}
              >
                {t('cta_secondary', { default: '了解更多' })}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}