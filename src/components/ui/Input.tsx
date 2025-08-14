'use client';

import React, { useState, useId } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/types';

// 输入框变体类型
type InputVariant = 'default' | 'filled' | 'outline';
type InputSize = 'sm' | 'md' | 'lg';
type InputState = 'default' | 'error' | 'success' | 'warning';

interface BaseInputProps extends ComponentProps {
  variant?: InputVariant;
  size?: InputSize;
  state?: InputState;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

interface InputProps extends BaseInputProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';
}

interface TextareaProps extends BaseInputProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  rows?: number;
  resize?: boolean;
}

// 样式配置
const inputVariants: Record<InputVariant, string> = {
  default: cn(
    'border border-neutral-300 bg-white',
    'focus:border-primary-500 focus:ring-primary-500'
  ),
  filled: cn(
    'border-0 bg-neutral-100',
    'focus:bg-white focus:ring-primary-500'
  ),
  outline: cn(
    'border-2 border-neutral-200 bg-transparent',
    'focus:border-primary-500 focus:ring-0'
  ),
};

const inputSizes: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

const inputStates: Record<InputState, string> = {
  default: '',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
  warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500',
};

const stateIcons: Record<Exclude<InputState, 'default'>, React.ReactNode> = {
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  success: <Check className="w-5 h-5 text-green-500" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
};

// 输入框组件
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      state = 'default',
      type = 'text',
      label,
      placeholder,
      helperText,
      errorMessage,
      required = false,
      disabled = false,
      readOnly = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id || generatedId;
    
    const isPassword = type === 'password';
    const actualType = isPassword && showPassword ? 'text' : type;
    
    const hasError = state === 'error' || !!errorMessage;
    const actualState = hasError ? 'error' : state;
    
    const displayHelperText = errorMessage || helperText;
    
    const inputClasses = cn(
      // 基础样式
      'w-full rounded-lg transition-all duration-200',
      'placeholder:text-neutral-400',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'read-only:bg-neutral-50 read-only:cursor-default',
      // 变体
      inputVariants[variant],
      // 尺寸
      inputSizes[size],
      // 状态
      inputStates[actualState],
      // 图标间距
      leftIcon && 'pl-12',
      (rightIcon || isPassword || actualState !== 'default') && 'pr-12',
      // 全宽
      fullWidth && 'w-full',
      className
    );

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {/* 标签 */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-2',
              hasError ? 'text-red-700' : 'text-neutral-700',
              disabled && 'opacity-50'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* 输入框容器 */}
        <div className="relative">
          {/* 左侧图标 */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}

          {/* 输入框 */}
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            className={inputClasses}
            {...props}
          />

          {/* 右侧图标区域 */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {/* 状态图标 */}
            {actualState !== 'default' && stateIcons[actualState]}
            
            {/* 密码显示切换 */}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
            
            {/* 自定义右侧图标 */}
            {rightIcon && !isPassword && actualState === 'default' && (
              <div className="text-neutral-400">{rightIcon}</div>
            )}
          </div>
        </div>

        {/* 帮助文本 */}
        {displayHelperText && (
          <p
            className={cn(
              'mt-2 text-sm',
              hasError ? 'text-red-600' : 'text-neutral-500'
            )}
          >
            {displayHelperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// 文本域组件
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'default',
      size = 'md',
      state = 'default',
      label,
      placeholder,
      helperText,
      errorMessage,
      required = false,
      disabled = false,
      readOnly = false,
      fullWidth = false,
      rows = 4,
      resize = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    
    const hasError = state === 'error' || !!errorMessage;
    const actualState = hasError ? 'error' : state;
    
    const displayHelperText = errorMessage || helperText;

    const textareaClasses = cn(
      // 基础样式
      'w-full rounded-lg transition-all duration-200',
      'placeholder:text-neutral-400',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'read-only:bg-neutral-50 read-only:cursor-default',
      // 变体
      inputVariants[variant],
      // 尺寸
      inputSizes[size],
      // 状态
      inputStates[actualState],
      // 调整大小
      resize ? 'resize-y' : 'resize-none',
      // 全宽
      fullWidth && 'w-full',
      className
    );

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {/* 标签 */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'block text-sm font-medium mb-2',
              hasError ? 'text-red-700' : 'text-neutral-700',
              disabled && 'opacity-50'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* 文本域容器 */}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            rows={rows}
            className={textareaClasses}
            {...props}
          />

          {/* 状态图标 */}
          {actualState !== 'default' && (
            <div className="absolute right-3 top-3 text-neutral-400">
              {stateIcons[actualState]}
            </div>
          )}
        </div>

        {/* 帮助文本 */}
        {displayHelperText && (
          <p
            className={cn(
              'mt-2 text-sm',
              hasError ? 'text-red-600' : 'text-neutral-500'
            )}
          >
            {displayHelperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// 输入框组
interface InputGroupProps extends ComponentProps {
  children: React.ReactNode;
  label?: string;
  required?: boolean;
  errorMessage?: string;
  helperText?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({
  children,
  label,
  required = false,
  errorMessage,
  helperText,
  className,
}) => {
  const hasError = !!errorMessage;
  const displayHelperText = errorMessage || helperText;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          className={cn(
            'block text-sm font-medium',
            hasError ? 'text-red-700' : 'text-neutral-700'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex space-x-2">
        {children}
      </div>
      
      {displayHelperText && (
        <p
          className={cn(
            'text-sm',
            hasError ? 'text-red-600' : 'text-neutral-500'
          )}
        >
          {displayHelperText}
        </p>
      )}
    </div>
  );
};

export { Input, Textarea, InputGroup };
export type { InputProps, TextareaProps, InputGroupProps, InputVariant, InputSize, InputState };