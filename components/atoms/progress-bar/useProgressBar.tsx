/**
 * useProgressBar Hook
 * 
 * Custom hook quản lý logic cho ProgressBar component
 * Xử lý calculations, CSS classes và animations
 * 
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import { useMemo } from 'react';
import {
  PROGRESS_BAR_SIZE_CLASSES,
  PROGRESS_BAR_VARIANT_CLASSES,
  UseProgressBarProps,
  UseProgressBarReturn
} from './types';

/**
 * Custom hook cho ProgressBar component
 * 
 * Quản lý tất cả logic liên quan đến progress bar:
 * - Tính toán percentage
 * - CSS classes dựa trên props
 * - Animation states
 * - Accessibility
 * 
 * @param props - Thuộc tính từ ProgressBar component
 * @returns Object chứa các giá trị và functions cần thiết
 */
export const useProgressBar = ({
  value,
  max,
  variant,
  size,
  animated,
  striped,
  className
}: UseProgressBarProps): UseProgressBarReturn => {

  /**
   * Tính toán phần trăm hiện tại
   */
  const percentage = useMemo(() => {
    if (max <= 0) return 0;
    const percent = Math.min(Math.max((value / max) * 100, 0), 100);
    return Math.round(percent * 10) / 10; // Round to 1 decimal place
  }, [value, max]);

  /**
   * Giá trị hiển thị (rounded)
   */
  const displayValue = useMemo(() => {
    return Math.round(value);
  }, [value]);

  /**
   * Kiểm tra progress có hoàn thành không
   */
  const isComplete = useMemo(() => {
    return percentage >= 100;
  }, [percentage]);

  /**
   * Tạo CSS classes cho container
   */
  const progressBarClasses = useMemo(() => {
    const baseClasses = 'w-full';
    const sizeClasses = PROGRESS_BAR_SIZE_CLASSES[size].container;

    return `${baseClasses} ${sizeClasses} ${className}`.trim();
  }, [size, className]);

  /**
   * Tạo CSS classes cho progress fill
   */
  const progressFillClasses = useMemo(() => {
    const baseClasses = 'transition-all duration-300 ease-in-out rounded-full relative';
    const sizeClasses = PROGRESS_BAR_SIZE_CLASSES[size].bar;
    const variantClasses = PROGRESS_BAR_VARIANT_CLASSES[variant];

    // Animation classes
    const animationClasses = animated ? 'transition-all duration-600 ease-in-out' : '';

    // Striped animation
    const stripedClasses = striped ? 'bg-size-animate' : '';

    // Glow effect for certain variants
    const glowClasses = variantClasses.glow || '';

    return `${baseClasses} ${sizeClasses} ${variantClasses.fill} ${animationClasses} ${stripedClasses} ${glowClasses}`.trim();
  }, [size, variant, animated, striped]);

  /**
   * Tạo CSS classes cho label (với dark mode support)
   */
  const labelClasses = useMemo(() => {
    const baseClasses = 'text-text-primary';
    const sizeClasses = PROGRESS_BAR_SIZE_CLASSES[size].label;

    return `${baseClasses} ${sizeClasses}`.trim();
  }, [size]);

  /**
   * Aria label cho accessibility
   */
  const ariaLabel = useMemo(() => {
    if (isComplete) {
      return `Hoàn thành: ${displayValue} trên ${max}`;
    }
    return `Tiến độ: ${displayValue} trên ${max} (${percentage}%)`;
  }, [displayValue, max, percentage, isComplete]);

  return {
    progressBarClasses,
    progressFillClasses,
    labelClasses,
    percentage,
    displayValue,
    isComplete,
    ariaLabel
  };
};
