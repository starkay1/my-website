'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps, ClientLogo, PressBadge } from '@/types';

interface TrustSectionProps extends ComponentProps {}

const TrustSection = ({ className }: TrustSectionProps = {}) => {
  // Mock client logos data
  const clientLogos: ClientLogo[] = [
    { name: 'Client 1', logo: '/logos/client-1.svg' },
    { name: 'Client 2', logo: '/logos/client-2.svg' },
    { name: 'Client 3', logo: '/logos/client-3.svg' },
    { name: 'Client 4', logo: '/logos/client-4.svg' },
    { name: 'Client 5', logo: '/logos/client-5.svg' },
    { name: 'Client 6', logo: '/logos/client-6.svg' },
  ];

  // Mock press badges data
  const pressBadges: PressBadge[] = [
    { name: 'Forbes', logo: '/press/forbes.svg' },
    { name: 'TechCrunch', logo: '/press/techcrunch.svg' },
    { name: 'Bloomberg', logo: '/press/bloomberg.svg' },
    { name: 'Reuters', logo: '/press/reuters.svg' },
  ];

  return (
    <section className={cn(
      "py-16 lg:py-24 bg-neutral-50 dark:bg-neutral-900 aspect-mobile lg:aspect-16-9",
      className
    )}>
      <div className="responsive-container">
        {/* Client Logos */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: ANIMATION_CONFIG.duration.slow,
              ease: ANIMATION_CONFIG.easing.easeOut
            }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 font-medium">
              全球 <span className="text-primary-600 font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">100+</span> 夜生活品牌的信赖之选
            </p>
          </motion.div>

          {/* Scrolling Logo Strip */}
          <div className="relative overflow-hidden">
            <div className="flex space-x-12 animate-scroll">
              {[...clientLogos, ...clientLogos].map((client, index) => (
                <motion.div
                  key={`${client.name}-${index}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ 
                    duration: ANIMATION_CONFIG.duration.slow, 
                    delay: index * ANIMATION_CONFIG.stagger.items 
                  }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                >
                  {/* Enhanced Client Logo Placeholder */}
                  <div className={cn(
                    "w-24 h-12 bg-gradient-to-br from-neutral-100 to-neutral-200",
                    "dark:from-neutral-800 dark:to-neutral-700 rounded-xl flex items-center justify-center",
                    "shadow-sm border border-neutral-200 dark:border-neutral-700",
                    "hover:shadow-md transition-all duration-300 cursor-pointer"
                  )}>
                    <div className="w-4 h-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-60"></div>
                    <span className="text-neutral-700 dark:text-neutral-300 text-xs font-medium ml-2">
                      {client.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Press Badges */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: ANIMATION_CONFIG.duration.slow,
              ease: ANIMATION_CONFIG.easing.easeOut
            }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 font-medium">媒体报道</p>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {pressBadges.map((press, index) => (
              <motion.div
                key={press.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: ANIMATION_CONFIG.duration.slow, 
                  delay: index * ANIMATION_CONFIG.stagger.items 
                }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-28 h-12 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
              >
                {/* Enhanced Press Logo Placeholder */}
                <div className={cn(
                  "w-24 h-8 bg-gradient-to-br from-secondary-50 to-secondary-100",
                  "dark:from-secondary-900 dark:to-secondary-800 rounded-lg flex items-center justify-center",
                  "shadow-sm border border-secondary-200 dark:border-secondary-700",
                  "hover:shadow-md transition-all duration-300"
                )}>
                  <div className="w-3 h-3 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full opacity-70 mr-2"></div>
                  <span className="text-secondary-700 dark:text-secondary-300 text-xs font-medium">
                    {press.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-2">
              100+
            </div>
            <div className="text-neutral-600 dark:text-neutral-300 font-medium">合作品牌</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-700 bg-clip-text text-transparent mb-2">
              50+
            </div>
            <div className="text-neutral-600 dark:text-neutral-300 font-medium">城市覆盖</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-2">
              200%
            </div>
            <div className="text-neutral-600 dark:text-neutral-300 font-medium">平均增长</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-700 bg-clip-text text-transparent mb-2">
              95%
            </div>
            <div className="text-neutral-600 dark:text-neutral-300 font-medium">客户满意度</div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TrustSection;