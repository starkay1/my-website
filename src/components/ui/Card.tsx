'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/types';

// 卡片变体类型
type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled';
type CardSize = 'sm' | 'md' | 'lg' | 'xl';
type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface BaseCardProps extends ComponentProps {
  variant?: CardVariant;
  size?: CardSize;
  radius?: CardRadius;
  hoverable?: boolean;
  clickable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface CardProps extends BaseCardProps {
  children: React.ReactNode;
}

interface CardHeaderProps extends ComponentProps {
  children: React.ReactNode;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

interface CardContentProps extends ComponentProps {
  children: React.ReactNode;
}

interface CardFooterProps extends ComponentProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

interface CardMediaProps extends ComponentProps {
  src?: string;
  alt?: string;
  height?: number | string;
  children?: React.ReactNode;
}

// 样式配置
const cardVariants: Record<CardVariant, string> = {
  default: 'bg-white border border-neutral-200',
  outlined: 'bg-white border-2 border-neutral-300',
  elevated: 'bg-white shadow-lg border-0',
  filled: 'bg-neutral-50 border border-neutral-200',
};

const cardSizes: Record<CardSize, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const cardRadius: Record<CardRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

// 主卡片组件
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      size = 'md',
      radius = 'lg',
      hoverable = false,
      clickable = false,
      loading = false,
      disabled = false,
      onClick,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isInteractive = clickable || !!onClick;

    const cardClasses = cn(
      // 基础样式
      'relative overflow-hidden transition-all duration-200',
      // 变体
      cardVariants[variant],
      // 尺寸
      cardSizes[size],
      // 圆角
      cardRadius[radius],
      // 交互状态
      hoverable && 'hover:shadow-md hover:-translate-y-1',
      isInteractive && [
        'cursor-pointer',
        'hover:shadow-lg hover:scale-[1.02]',
        'active:scale-[0.98]',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      ],
      // 禁用状态
      disabled && [
        'opacity-50 cursor-not-allowed',
        'hover:shadow-none hover:transform-none',
      ],
      // 加载状态
      loading && 'animate-pulse',
      className
    );

    const handleClick = () => {
      if (!disabled && !loading && onClick) {
        onClick();
      }
    };

    const cardProps = {
      ref,
      className: cardClasses,
      onClick: isInteractive ? handleClick : undefined,
      role: isInteractive ? 'button' : undefined,
      tabIndex: isInteractive && !disabled ? 0 : undefined,
      'aria-disabled': disabled,
      ...props,
    };

    return (
      <div {...cardProps}>
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// 卡片头部组件
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      children,
      avatar,
      action,
      title,
      subtitle,
      className,
      ...props
    },
    ref
  ) => {
    const hasContent = title || subtitle || children;
    const hasAvatar = !!avatar;
    const hasAction = !!action;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between',
          hasContent && 'mb-4',
          className
        )}
        {...props}
      >
        <div className="flex items-start space-x-4 flex-1 min-w-0">
          {/* 头像 */}
          {hasAvatar && (
            <div className="flex-shrink-0">
              {avatar}
            </div>
          )}

          {/* 内容区域 */}
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-lg font-semibold text-neutral-900 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-neutral-600 mt-1">
                {subtitle}
              </p>
            )}
            {children && (
              <div className={cn(title || subtitle ? 'mt-2' : '')}>
                {children}
              </div>
            )}
          </div>
        </div>

        {/* 操作区域 */}
        {hasAction && (
          <div className="flex-shrink-0 ml-4">
            {action}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// 卡片内容组件
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-neutral-700', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

// 卡片底部组件
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  (
    {
      children,
      actions,
      className,
      ...props
    },
    ref
  ) => {
    const hasActions = !!actions;
    const hasChildren = !!children;

    return (
      <div
        ref={ref}
        className={cn(
          'mt-6',
          hasActions && hasChildren && 'flex items-center justify-between',
          hasActions && !hasChildren && 'flex justify-end',
          className
        )}
        {...props}
      >
        {hasChildren && (
          <div className="flex-1">
            {children}
          </div>
        )}
        
        {hasActions && (
          <div className={cn(
            'flex items-center space-x-2',
            hasChildren && 'ml-4'
          )}>
            {actions}
          </div>
        )}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

// 卡片媒体组件
const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  (
    {
      src,
      alt = '',
      height = 200,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const mediaStyle = {
      height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden bg-neutral-100',
          className
        )}
        style={mediaStyle}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          children
        )}
      </div>
    );
  }
);

CardMedia.displayName = 'CardMedia';

// 卡片分隔线组件
const CardDivider: React.FC<ComponentProps> = ({ className, ...props }) => {
  return (
    <hr
      className={cn(
        'border-0 border-t border-neutral-200 my-4',
        className
      )}
      {...props}
    />
  );
};

// 卡片组合组件
interface CardGroupProps extends ComponentProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

const CardGroup: React.FC<CardGroupProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className,
  ...props
}) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div
      className={cn(
        'grid',
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardMedia,
  CardDivider,
  CardGroup,
};

export type {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
  CardMediaProps,
  CardGroupProps,
  CardVariant,
  CardSize,
  CardRadius,
};