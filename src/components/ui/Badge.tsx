'use client';

import React from 'react';
import { clsx } from 'clsx';
import type { ComponentProps } from '@/types';

// Badge变体类型
export type BadgeVariant = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline';

// Badge大小类型
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

// Badge形状类型
export type BadgeShape = 'rounded' | 'pill' | 'square';

// Badge Props接口
export interface BadgeProps extends ComponentProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  dot?: boolean;
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  offset?: [number, number];
  color?: string;
  onClick?: () => void;
}

// Badge组件
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  shape = 'rounded',
  dot = false,
  count,
  maxCount = 99,
  showZero = false,
  offset,
  color,
  className,
  onClick,
}) => {
  // 计算显示的数字
  const displayCount = React.useMemo(() => {
    if (count === undefined) return undefined;
    if (count === 0 && !showZero) return undefined;
    if (count > maxCount) return `${maxCount}+`;
    return count.toString();
  }, [count, maxCount, showZero]);

  // 是否显示徽章
  const shouldShowBadge = dot || displayCount !== undefined;

  // 基础样式类
  const badgeClasses = clsx(
    // 基础样式
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    
    // 变体样式
    {
      // Default
      'bg-gray-100 text-gray-800 border border-gray-200': variant === 'default',
      
      // Primary
      'bg-blue-500 text-white': variant === 'primary',
      
      // Secondary
      'bg-gray-500 text-white': variant === 'secondary',
      
      // Success
      'bg-green-500 text-white': variant === 'success',
      
      // Warning
      'bg-yellow-500 text-white': variant === 'warning',
      
      // Error
      'bg-red-500 text-white': variant === 'error',
      
      // Info
      'bg-cyan-500 text-white': variant === 'info',
      
      // Outline
      'bg-transparent border-2': variant === 'outline',
      'border-gray-300 text-gray-700': variant === 'outline',
    },
    
    // 大小样式
    {
      'text-xs px-1.5 py-0.5 min-w-[16px] h-4': size === 'xs',
      'text-xs px-2 py-1 min-w-[20px] h-5': size === 'sm',
      'text-sm px-2.5 py-1 min-w-[24px] h-6': size === 'md',
      'text-base px-3 py-1.5 min-w-[28px] h-7': size === 'lg',
    },
    
    // 形状样式
    {
      'rounded': shape === 'rounded',
      'rounded-full': shape === 'pill',
      'rounded-none': shape === 'square',
    },
    
    // 点状徽章
    {
      'w-2 h-2 min-w-[8px] p-0': dot && size === 'xs',
      'w-2.5 h-2.5 min-w-[10px] p-0': dot && size === 'sm',
      'w-3 h-3 min-w-[12px] p-0': dot && size === 'md',
      'w-4 h-4 min-w-[16px] p-0': dot && size === 'lg',
    },
    
    // 可点击样式
    {
      'cursor-pointer hover:opacity-80 active:scale-95': onClick,
    },
    
    className
  );

  // 如果没有子元素，直接返回徽章
  if (!children) {
    return (
      <span
        className={badgeClasses}
        style={color ? { backgroundColor: color } : undefined}
        onClick={onClick}
      >
        {dot ? null : displayCount}
      </span>
    );
  }

  // 带子元素的徽章
  return (
    <div className="relative inline-flex">
      {children}
      {shouldShowBadge && (
        <span
          className={clsx(
            'absolute -top-1 -right-1 z-10',
            badgeClasses
          )}
          style={{
            backgroundColor: color,
            transform: offset ? `translate(${offset[0]}px, ${offset[1]}px)` : undefined,
          }}
          onClick={onClick}
        >
          {dot ? null : displayCount}
        </span>
      )}
    </div>
  );
};

// 预设徽章组件
export const StatusBadge: React.FC<{
  status: 'online' | 'offline' | 'busy' | 'away';
  size?: BadgeSize;
  className?: string;
}> = ({ status, size = 'sm', className }) => {
  const statusConfig = {
    online: { color: '#10B981', label: '在线' },
    offline: { color: '#6B7280', label: '离线' },
    busy: { color: '#EF4444', label: '忙碌' },
    away: { color: '#F59E0B', label: '离开' },
  };

  const config = statusConfig[status];

  return (
    <Badge
      dot
      size={size}
      color={config.color}
      className={className}
    >
      {config.label}
    </Badge>
  );
};

// 数字徽章组件
export const CountBadge: React.FC<{
  count: number;
  maxCount?: number;
  showZero?: boolean;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}> = ({ count, maxCount = 99, showZero = false, variant = 'error', size = 'sm', className }) => {
  return (
    <Badge
      count={count}
      maxCount={maxCount}
      showZero={showZero}
      variant={variant}
      size={size}
      className={className}
    >
      {count > maxCount ? `${maxCount}+` : count}
    </Badge>
  );
};

// 新消息徽章组件
export const NewBadge: React.FC<{
  size?: BadgeSize;
  className?: string;
}> = ({ size = 'sm', className }) => {
  return (
    <Badge
      variant="error"
      size={size}
      className={className}
    >
      NEW
    </Badge>
  );
};

// 热门徽章组件
export const HotBadge: React.FC<{
  size?: BadgeSize;
  className?: string;
}> = ({ size = 'sm', className }) => {
  return (
    <Badge
      variant="warning"
      size={size}
      className={className}
    >
      HOT
    </Badge>
  );
};

export default Badge;