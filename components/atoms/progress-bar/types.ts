/**
 * Progress Bar Component Types
 * 
 * Định nghĩa các interface và type cho ProgressBar component
 * Bao gồm props, variants, sizes và các trạng thái khác nhau
 * 
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import { HTMLAttributes } from 'react';

/**
 * Kích thước progress bar có thể sử dụng
 */
export type ProgressBarSize = 'small' | 'medium' | 'large' | 'extra-large';

/**
 * Kiểu hiển thị progress bar
 */
export type ProgressBarVariant =
  | 'primary'           // Gradient chính (blue to purple)
  | 'success'           // Xanh lá (correct answers)
  | 'warning'           // Vàng (warnings)
  | 'error'             // Đỏ (errors)
  | 'info'              // Xanh dương (info)
  | 'neutral';          // Xám (neutral)

/**
 * Props cho ProgressBar component
 */
export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Giá trị hiện tại
   * @default 0
   */
  value?: number;

  /**
   * Giá trị tối đa
   * @default 100
   */
  max?: number;

  /**
   * Kiểu hiển thị progress bar
   * @default 'primary'
   */
  variant?: ProgressBarVariant;

  /**
   * Kích thước progress bar
   * @default 'medium'
   */
  size?: ProgressBarSize;

  /**
   * Hiển thị label không
   * @default true
   */
  showLabel?: boolean;

  /**
   * Hiển thị phần trăm không
   * @default true
   */
  showPercentage?: boolean;

  /**
   * Label tùy chỉnh
   */
  label?: string;

  /**
   * Có animation không
   * @default true
   */
  animated?: boolean;

  /**
   * Có pattern striped không
   * @default false
   */
  striped?: boolean;

  /**
   * CSS class tùy chỉnh
   * @default ''
   */
  className?: string;
}

/**
 * Props cho useProgressBar hook
 */
export interface UseProgressBarProps {
  value: number;
  max: number;
  variant: ProgressBarVariant;
  size: ProgressBarSize;
  animated: boolean;
  striped: boolean;
  className: string;
}

/**
 * Return type của useProgressBar hook
 */
export interface UseProgressBarReturn {
  /**
   * CSS classes cho progress bar container
   */
  progressBarClasses: string;

  /**
   * CSS classes cho progress fill
   */
  progressFillClasses: string;

  /**
   * CSS classes cho label
   */
  labelClasses: string;

  /**
   * Phần trăm hiện tại (0-100)
   */
  percentage: number;

  /**
   * Giá trị hiển thị (rounded)
   */
  displayValue: number;

  /**
   * Progress có hoàn thành không
   */
  isComplete: boolean;

  /**
   * Aria label cho accessibility
   */
  ariaLabel: string;
}

/**
 * Mapping kích thước progress bar với CSS classes
 */
export const PROGRESS_BAR_SIZE_CLASSES: Record<ProgressBarSize, {
  container: string;
  bar: string;
  label: string;
}> = {
  small: {
    container: 'text-xs',
    bar: 'h-2',
    label: 'text-xs'
  },
  medium: {
    container: 'text-sm',
    bar: 'h-3',
    label: 'text-sm'
  },
  large: {
    container: 'text-base',
    bar: 'h-4',
    label: 'text-base'
  },
  'extra-large': {
    container: 'text-lg',
    bar: 'h-6',
    label: 'text-lg'
  }
};

/**
 * Mapping variant progress bar với CSS classes (với dark mode support)
 */
export const PROGRESS_BAR_VARIANT_CLASSES: Record<ProgressBarVariant, {
  fill: string;
  glow?: string;
}> = {
  primary: {
    fill: 'bg-gradient-to-r from-primary-blue to-primary-purple',
    glow: 'shadow-lg shadow-primary-blue/30 dark:shadow-primary-blue-light/20'
  },
  success: {
    fill: 'bg-gradient-to-r from-success-green to-success-light',
    glow: 'shadow-lg shadow-success-green/30 dark:shadow-success-green/20'
  },
  warning: {
    fill: 'bg-gradient-to-r from-warning-yellow to-warning-light',
    glow: 'shadow-lg shadow-warning-yellow/30 dark:shadow-warning-yellow/20'
  },
  error: {
    fill: 'bg-gradient-to-r from-error-red to-error-light',
    glow: 'shadow-lg shadow-error-red/30 dark:shadow-error-red/20'
  },
  info: {
    fill: 'bg-gradient-to-r from-info-blue to-info-light',
    glow: 'shadow-lg shadow-info-blue/30 dark:shadow-info-blue/20'
  },
  neutral: {
    fill: 'bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600'
  }
};
