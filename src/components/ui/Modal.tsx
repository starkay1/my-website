'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useKeyboard, useClickOutside } from '@/hooks';
import type { ComponentProps } from '@/types';
import { Button } from './Button';

// 模态框尺寸类型
type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ModalPosition = 'center' | 'top' | 'bottom';

interface BaseModalProps extends ComponentProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  position?: ModalPosition;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  preventScroll?: boolean;
  destroyOnClose?: boolean;
  zIndex?: number;
}

interface ModalProps extends BaseModalProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

interface ModalHeaderProps extends ComponentProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

interface ModalContentProps extends ComponentProps {
  children: React.ReactNode;
}

interface ModalFooterProps extends ComponentProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

interface ConfirmModalProps extends Omit<BaseModalProps, 'children'> {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

// 样式配置
const modalSizes: Record<ModalSize, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

const modalPositions: Record<ModalPosition, string> = {
  center: 'items-center justify-center',
  top: 'items-start justify-center pt-16',
  bottom: 'items-end justify-center pb-16',
};

// 主模态框组件
const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      size = 'md',
      position = 'center',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      preventScroll = true,
      destroyOnClose = false,
      zIndex = 50,
      children,
      title,
      description,
      className,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // 键盘事件处理
    useEffect(() => {
      if (!open || !closeOnEscape) return;
      
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, closeOnEscape, onClose]);

    // 点击外部关闭
    useClickOutside(modalRef, closeOnOverlayClick ? () => onClose() : () => {});

    // 防止滚动
    useEffect(() => {
      if (!preventScroll) return;

      if (open) {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = originalStyle;
        };
      }
    }, [open, preventScroll]);

    // 焦点管理
    useEffect(() => {
      if (open && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        if (firstElement) {
          firstElement.focus();
        }
      }
    }, [open]);

    if (!open && destroyOnClose) {
      return null;
    }

    const modalContent = (
      <div
        ref={overlayRef}
        className={cn(
          'fixed inset-0 bg-black/50 flex transition-all duration-300',
          modalPositions[position],
          open ? 'opacity-100 visible' : 'opacity-0 invisible',
        )}
        style={{ zIndex }}
        aria-hidden={!open}
      >
        <div
          ref={modalRef}
          className={cn(
            'relative bg-white rounded-lg shadow-xl transition-all duration-300 max-h-[90vh] overflow-hidden',
            modalSizes[size],
            open ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
          {...props}
        >
          {/* 默认头部 */}
          {(title || description || showCloseButton) && (
            <ModalHeader
              title={title}
              description={description}
              onClose={onClose}
              showCloseButton={showCloseButton}
            />
          )}

          {/* 内容区域 */}
          <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
            {children}
          </div>
        </div>
      </div>
    );

    // 使用 Portal 渲染到 body
    if (typeof window !== 'undefined') {
      return createPortal(modalContent, document.body);
    }

    return null;
  }
);

Modal.displayName = 'Modal';

// 模态框头部组件
const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  (
    {
      children,
      title,
      description,
      onClose,
      showCloseButton = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between p-6 border-b border-neutral-200',
          className
        )}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <h2
              id="modal-title"
              className="text-lg font-semibold text-neutral-900 mb-1"
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              id="modal-description"
              className="text-sm text-neutral-600"
            >
              {description}
            </p>
          )}
          {children}
        </div>

        {showCloseButton && onClose && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'ml-4 p-2 rounded-lg text-neutral-400 hover:text-neutral-600',
              'hover:bg-neutral-100 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500'
            )}
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

// 模态框内容组件
const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalContent.displayName = 'ModalContent';

// 模态框底部组件
const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  (
    {
      children,
      actions,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end space-x-3 p-6 border-t border-neutral-200 bg-neutral-50',
          className
        )}
        {...props}
      >
        {children || actions}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';

// 确认对话框组件
const ConfirmModal = React.forwardRef<HTMLDivElement, ConfirmModalProps>(
  (
    {
      open,
      onClose,
      title = '确认操作',
      message,
      confirmText = '确认',
      cancelText = '取消',
      confirmVariant = 'primary',
      onConfirm,
      onCancel,
      loading = false,
      ...props
    },
    ref
  ) => {
    const handleConfirm = () => {
      if (!loading) {
        onConfirm();
      }
    };

    const handleCancel = () => {
      if (!loading) {
        if (onCancel) {
          onCancel();
        } else {
          onClose();
        }
      }
    };

    return (
      <Modal
        ref={ref}
        open={open}
        onClose={onClose}
        size="sm"
        closeOnOverlayClick={!loading}
        closeOnEscape={!loading}
        showCloseButton={false}
        {...props}
      >
        <ModalHeader title={title} showCloseButton={false} />
        
        <ModalContent>
          <p className="text-neutral-700">{message}</p>
        </ModalContent>
        
        <ModalFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant === 'danger' ? 'secondary' : 'primary'}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
);

ConfirmModal.displayName = 'ConfirmModal';

// Hook: 模态框状态管理
interface UseModalReturn {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

const useModal = (initialOpen = false): UseModalReturn => {
  const [open, setOpen] = React.useState(initialOpen);

  const openModal = React.useCallback(() => setOpen(true), []);
  const closeModal = React.useCallback(() => setOpen(false), []);
  const toggleModal = React.useCallback(() => setOpen(prev => !prev), []);

  return {
    open,
    openModal,
    closeModal,
    toggleModal,
  };
};

export {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ConfirmModal,
  useModal,
};

export type {
  ModalProps,
  ModalHeaderProps,
  ModalContentProps,
  ModalFooterProps,
  ConfirmModalProps,
  ModalSize,
  ModalPosition,
  UseModalReturn,
};