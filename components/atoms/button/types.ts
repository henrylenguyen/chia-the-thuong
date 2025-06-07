/**
 * Button Component Types
 *
 * Định nghĩa các interface và type cho Button component
 * Bao gồm props, variants, sizes và các trạng thái khác nhau
 *
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Kích thước button có thể sử dụng
 */
export type ButtonSize = 'small' | 'medium' | 'large' | 'extra-large';

/**
 * Kiểu hiển thị button
 */
export type ButtonVariant =
  | 'primary'           // Gradient chính
  | 'secondary'         // Outline
  | 'success'           // Xanh lá (correct answer)
  | 'error'             // Đỏ (incorrect answer)
  | 'warning'           // Vàng (warning)
  | 'info'              // Xanh dương (info)
  | 'ghost'             // Trong suốt
  | 'link';             // Như link

/**
 * Props cho Button component
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /**
   * Nội dung bên trong button
   */
  children: ReactNode;

  /**
   * Callback khi click button
   */
  onClick?: () => void;

  /**
   * Kiểu hiển thị button
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Kích thước button
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Button có bị disable không
   * @default false
   */
  disabled?: boolean;

  /**
   * Button có đang loading không
   * @default false
   */
  loading?: boolean;

  /**
   * Button có chiếm full width không
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon bên trái
   */
  leftIcon?: ReactNode;

  /**
   * Icon bên phải
   */
  rightIcon?: ReactNode;

  /**
   * CSS class tùy chỉnh
   * @default ''
   */
  className?: string;

  /**
   * Type của button
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Props cho useButton hook
 */
export interface UseButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  loading: boolean;
  fullWidth: boolean;
  className: string;
  onClick?: () => void;
}

/**
 * Return type của useButton hook
 */
export interface UseButtonReturn {
  /**
   * CSS classes cho button element
   */
  buttonClasses: string;

  /**
   * CSS classes cho content wrapper
   */
  contentClasses: string;

  /**
   * Handler cho click event
   */
  handleClick: () => void;

  /**
   * Button có bị disabled không (bao gồm loading state)
   */
  isDisabled: boolean;

  /**
   * Aria label cho accessibility
   */
  ariaLabel?: string;
}

/**
 * Mapping kích thước button với CSS classes
 */
export const BUTTON_SIZE_CLASSES: Record<ButtonSize, {
  button: string;
  icon: string;
}> = {
  small: {
    button: 'px-3 py-1.5 text-sm',
    icon: 'h-4 w-4'
  },
  medium: {
    button: 'px-4 py-2 text-base',
    icon: 'h-5 w-5'
  },
  large: {
    button: 'px-6 py-3 text-lg',
    icon: 'h-6 w-6'
  },
  'extra-large': {
    button: 'px-8 py-4 text-xl',
    icon: 'h-7 w-7'
  }
};

/**
 * Mapping variant button với CSS classes (với dark mode support)
 */
export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, {
  base: string;
  hover: string;
  focus: string;
  disabled: string;
}> = {
  primary: {
    base: 'bg-gradient-to-r from-primary-blue to-primary-purple text-white border-transparent',
    hover: 'hover:from-primary-blue-dark hover:to-primary-purple-dark',
    focus: 'focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
  },
  secondary: {
    base: 'bg-transparent text-primary-blue dark:text-primary-blue-light border-2 border-primary-blue dark:border-primary-blue-light',
    hover: 'hover:bg-primary-blue hover:text-white dark:hover:bg-primary-blue-light dark:hover:text-gray-900',
    focus: 'focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50 dark:focus:ring-primary-blue-light',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
  },
  success: {
    base: 'bg-success-green text-white border-transparent',
    hover: 'hover:bg-success-dark',
    focus: 'focus:ring-2 focus:ring-success-green focus:ring-opacity-50',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
  },
  error: {
    base: 'bg-error-red text-white border-transparent',
    hover: 'hover:bg-error-dark',
    focus: 'focus:ring-2 focus:ring-error-red focus:ring-opacity-50',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
  },
  warning: {
    base: 'bg-warning-yellow text-white border-transparent',
    hover: 'hover:bg-warning-dark',
    focus: 'focus:ring-2 focus:ring-warning-yellow focus:ring-opacity-50',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
  },
  info: {
    base: 'bg-info-blue text-white border-transparent',
    hover: 'hover:bg-info-dark',
    focus: 'focus:ring-2 focus:ring-info-blue focus:ring-opacity-50',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
  },
  ghost: {
    base: 'bg-transparent text-text-secondary border-transparent',
    hover: 'hover:bg-neutral-gray-100 dark:hover:bg-neutral-gray-800',
    focus: 'focus:ring-2 focus:ring-neutral-gray-500 focus:ring-opacity-50',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
  },
  link: {
    base: 'bg-transparent text-primary-blue dark:text-primary-blue-light border-transparent underline',
    hover: 'hover:text-primary-blue-dark dark:hover:text-primary-blue',
    focus: 'focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50 dark:focus:ring-primary-blue-light',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
  }
};

export interface ButtonHookReturn {
  isLoading: boolean;
  error: string | null;
  handleAction: () => void;
}
