'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/types';

// 按钮变体类型
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: string;
  rel?: string;
}

// 按钮样式配置
const buttonVariants: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-primary-500 hover:bg-primary-600 active:bg-primary-700',
    'text-white border-transparent',
    'shadow-lg hover:shadow-xl active:shadow-md',
    'focus:ring-primary-400'
  ),
  secondary: cn(
    'bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700',
    'text-white border-transparent',
    'shadow-lg hover:shadow-xl active:shadow-md',
    'focus:ring-secondary-400'
  ),
  outline: cn(
    'bg-transparent hover:bg-neutral-50 active:bg-neutral-100',
    'text-neutral-700 hover:text-neutral-900',
    'border-neutral-300 hover:border-neutral-400',
    'focus:ring-neutral-400'
  ),
  ghost: cn(
    'bg-transparent hover:bg-neutral-100 active:bg-neutral-200',
    'text-neutral-700 hover:text-neutral-900',
    'border-transparent',
    'focus:ring-neutral-400'
  ),
  link: cn(
    'bg-transparent hover:bg-transparent',
    'text-primary-600 hover:text-primary-700 active:text-primary-800',
    'border-transparent underline-offset-4 hover:underline',
    'focus:ring-primary-400 shadow-none'
  ),
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      fullWidth = false,
      children,
      leftIcon,
      rightIcon,
      className,
      onClick,
      type = 'button',
      href,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseClasses = cn(
      // 基础样式
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-lg border transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'transform hover:scale-105 active:scale-95',
      // 尺寸
      buttonSizes[size],
      // 变体
      buttonVariants[variant],
      // 全宽
      fullWidth && 'w-full',
      // 禁用状态
      isDisabled && 'pointer-events-none',
      className
    );

    const content = (
      <>
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}
        <span className={cn(loading && 'opacity-0')}>{children}</span>
        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </>
    );

    // 如果提供了 href，渲染为链接
    if (href) {
      return (
        <motion.a
          href={href}
          target={target}
          rel={rel}
          className={baseClasses}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          {...props}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        className={baseClasses}
        whileHover={{ scale: isDisabled ? 1 : 1.05 }}
        whileTap={{ scale: isDisabled ? 1 : 0.95 }}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// 按钮组组件
interface ButtonGroupProps extends ComponentProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'md',
  className,
}) => {
  const spacingClasses = {
    sm: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    md: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
    lg: orientation === 'horizontal' ? 'space-x-6' : 'space-y-6',
  };

  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </div>
  );
};

// 图标按钮组件
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', className, ...props }, ref) => {
    const iconSizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-14 h-14',
    };

    return (
      <Button
        ref={ref}
        size={size}
        className={cn(
          'p-0 rounded-full',
          iconSizes[size],
          className
        )}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { Button, ButtonGroup, IconButton };
export type { ButtonProps, ButtonGroupProps, IconButtonProps, ButtonVariant, ButtonSize };