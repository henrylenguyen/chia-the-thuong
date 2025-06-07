/**
 * Loading Component Types
 * Local TypeScript interfaces cho Loading component
 * 
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import { HTMLAttributes } from 'react';

/**
 * Kiểu hiển thị loading
 */
export type LoadingVariant = 'full-screen' | 'inline' | 'minimal';

/**
 * Props cho Loading component
 */
export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Kiểu hiển thị loading
   * @default 'full-screen'
   */
  variant?: LoadingVariant;

  /**
   * CSS class tùy chỉnh
   * @default ''
   */
  className?: string;

  /**
   * Text hiển thị bên dưới loading
   * @default 'Đang tải dữ liệu'
   */
  text?: string;

  /**
   * Có hiển thị text không
   * @default true
   */
  showText?: boolean;

  /**
   * Progress percentage (0-100)
   * @default undefined
   */
  progress?: number;

  /**
   * Có hiển thị progress bar không
   * @default true
   */
  showProgress?: boolean;

  /**
   * Có hiển thị full screen overlay không
   * @default true
   */
  isFullScreen?: boolean;
}

/**
 * Props cho useLoading hook
 */
export interface UseLoadingProps {
  variant: LoadingVariant;
  className: string;
  text: string;
  showText: boolean;
  progress?: number;
  showProgress: boolean;
  isFullScreen: boolean;
}

/**
 * Return type của useLoading hook
 */
export interface UseLoadingReturn {
  /**
   * CSS classes cho container loading
   */
  containerClasses: string;

  /**
   * Text hiển thị
   */
  displayText: string;

  /**
   * Progress percentage formatted
   */
  progressPercentage: number;
}

/**
 * Mapping variant loading với CSS classes
 */
export const LOADING_VARIANT_CLASSES: Record<LoadingVariant, string> = {
  'full-screen': 'fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50',
  'inline': 'flex flex-col items-center justify-center p-8',
  'minimal': 'flex items-center justify-center p-4'
};

/**
 * Default loading texts
 */
export const LOADING_TEXTS = {
  default: 'Đang tải dữ liệu...',
  theory: 'Đang tải lý thuyết...',
  exercise: 'Đang tải bài tập...',
  progress: 'Đang xử lý...',
  saving: 'Đang lưu dữ liệu...'
} as const;
