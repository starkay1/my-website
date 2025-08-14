'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // 生成默认的模糊占位符
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // 处理图片加载错误
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    // 设置默认错误图片
    setImageSrc('/images/placeholder-error.svg');
    onError?.();
  };

  // 响应式图片尺寸配置
  const responsiveSizes = sizes || `
    (max-width: 640px) 100vw,
    (max-width: 768px) 50vw,
    (max-width: 1024px) 33vw,
    25vw
  `;

  // WebP支持检测
  const [supportsWebP, setSupportsWebP] = useState(false);
  
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };
    
    setSupportsWebP(checkWebPSupport());
  }, []);

  // 优化图片URL（如果使用CDN）
  const getOptimizedSrc = (originalSrc: string) => {
    if (hasError) return originalSrc;
    
    // 如果是外部URL，直接返回
    if (originalSrc.startsWith('http')) {
      return originalSrc;
    }
    
    // 本地图片优化逻辑
    const extension = supportsWebP ? 'webp' : 'jpg';
    const optimizedSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, `.${extension}`);
    
    return optimizedSrc;
  };

  const imageProps = {
    src: getOptimizedSrc(imageSrc),
    alt,
    quality,
    priority,
    loading,
    onLoad: handleLoad,
    onError: handleError,
    className: cn(
      'transition-opacity duration-300',
      isLoading && 'opacity-0',
      !isLoading && 'opacity-100',
      className
    ),
    ...(placeholder === 'blur' && {
      placeholder: 'blur' as const,
      blurDataURL: blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined),
    }),
    ...(fill ? {
      fill: true,
      sizes: responsiveSizes,
      style: { objectFit },
    } : {
      width,
      height,
      sizes: responsiveSizes,
    }),
  };

  return (
    <div className={cn('relative overflow-hidden', fill && 'w-full h-full')}>
      {/* 加载状态 */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      
      {/* 错误状态 */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">图片加载失败</p>
          </div>
        </div>
      )}
      
      {/* 实际图片 */}
      <Image {...imageProps} />
    </div>
  );
}

// 预设的图片组件变体
export const HeroImage = (props: Omit<OptimizedImageProps, 'priority' | 'sizes'>) => (
  <OptimizedImage
    {...props}
    priority
    sizes="100vw"
    quality={85}
  />
);

export const ThumbnailImage = (props: Omit<OptimizedImageProps, 'sizes' | 'quality'>) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
    quality={60}
  />
);

export const AvatarImage = (props: Omit<OptimizedImageProps, 'sizes' | 'quality' | 'objectFit'>) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 640px) 20vw, 10vw"
    quality={70}
    objectFit="cover"
  />
);