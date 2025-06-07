/**
 * useButton Hook
 *
 * Custom hook quản lý logic cho Button component
 * Xử lý CSS classes, event handlers, và states
 *
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import { useCallback, useMemo } from 'react';
import {
  BUTTON_SIZE_CLASSES,
  BUTTON_VARIANT_CLASSES,
  UseButtonProps,
  UseButtonReturn
} from './types';

/**
 * Custom hook cho Button component
 *
 * Quản lý tất cả logic liên quan đến button:
 * - CSS classes dựa trên props
 * - Event handlers
 * - Disabled states
 * - Accessibility
 *
 * @param props - Thuộc tính từ Button component
 * @returns Object chứa các giá trị và functions cần thiết
 */
export const useButton = ({
  variant,
  size,
  disabled,
  loading,
  fullWidth,
  className,
  onClick
}: UseButtonProps): UseButtonReturn => {

  /**
   * Xác định button có bị disabled không
   * Bao gồm cả trạng thái loading
   */
  const isDisabled = useMemo(() => {
    return disabled || loading;
  }, [disabled, loading]);

  /**
   * Tạo CSS classes cho button element
   */
  const buttonClasses = useMemo(() => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none border';

    // Size classes
    const sizeClasses = BUTTON_SIZE_CLASSES[size].button;

    // Variant classes
    const variantClasses = BUTTON_VARIANT_CLASSES[variant];
    const variantClass = `${variantClasses.base} ${variantClasses.hover} ${variantClasses.focus} ${variantClasses.disabled}`;

    // Full width
    const widthClasses = fullWidth ? 'w-full' : '';

    // Loading state
    const loadingClasses = loading ? 'relative' : '';

    return `${baseClasses} ${sizeClasses} ${variantClass} ${widthClasses} ${loadingClasses} ${className}`.trim();
  }, [variant, size, fullWidth, loading, className]);

  /**
   * Tạo CSS classes cho content wrapper
   */
  const contentClasses = useMemo(() => {
    const baseClasses = 'flex items-center justify-center gap-2';
    const loadingClasses = loading ? 'relative' : '';

    return `${baseClasses} ${loadingClasses}`.trim();
  }, [loading]);

  /**
   * Handler cho click event
   */
  const handleClick = useCallback(() => {
    if (!isDisabled && onClick) {
      onClick();
    }
  }, [isDisabled, onClick]);

  /**
   * Aria label cho accessibility
   */
  const ariaLabel = useMemo(() => {
    if (loading) {
      return 'Đang xử lý...';
    }
    return undefined;
  }, [loading]);

  return {
    buttonClasses,
    contentClasses,
    handleClick,
    isDisabled,
    ariaLabel
  };
};
