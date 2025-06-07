/**
 * useLoading Hook
 *
 * Custom hook quản lý logic cho Loading component
 * Xử lý CSS classes và progress calculation cho loading screen đẹp
 *
 * @author Japanese Learning App Team
 * @version 2.0.0
 */

import { useMemo } from 'react';
import {
  LOADING_VARIANT_CLASSES,
  UseLoadingProps,
  UseLoadingReturn
} from './types';

/**
 * Custom hook cho Loading component
 *
 * Quản lý tất cả logic liên quan đến loading:
 * - CSS classes dựa trên props
 * - Progress calculation
 * - Text formatting
 *
 * @param props - Thuộc tính từ Loading component
 * @returns Object chứa các giá trị và functions cần thiết
 */
export const useLoading = ({
  variant,
  className,
  text,
  showText,
  progress,
  showProgress,
  isFullScreen
}: UseLoadingProps): UseLoadingReturn => {

  /**
   * Tạo CSS classes cho container loading
   */
  const containerClasses = useMemo(() => {
    const variantClasses = LOADING_VARIANT_CLASSES[variant];

    return `${variantClasses} ${className}`.trim();
  }, [variant, className]);

  /**
   * Text hiển thị
   */
  const displayText = useMemo(() => text, [text]);

  /**
   * Progress percentage được format
   */
  const progressPercentage = useMemo(() => {
    if (typeof progress !== 'number') return 0;
    return Math.max(0, Math.min(100, progress));
  }, [progress]);

  return {
    containerClasses,
    displayText,
    progressPercentage
  };
};

export default useLoading;
