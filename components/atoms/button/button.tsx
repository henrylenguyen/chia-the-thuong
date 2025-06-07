/**
 * Button Component - Nút bấm cơ bản cho ứng dụng học tiếng Nhật
 *
 * Component button với nhiều variants, sizes và states khác nhau
 * Hỗ trợ gradient theme, loading states và accessibility
 *
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import React from 'react';
import { ButtonProps } from './types';
import { useButton } from './useComponent';

/**
 * Button Component
 *
 * Nút bấm với nhiều variants và states
 * Sử dụng gradient theme của ứng dụng
 *
 * @param props - Thuộc tính của Button component
 * @returns JSX.Element
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}) => {
  const {
    buttonClasses,
    contentClasses,
    handleClick,
    isDisabled,
    ariaLabel
  } = useButton({
    variant,
    size,
    disabled,
    loading,
    fullWidth,
    className,
    onClick
  });

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      <span className={contentClasses}>
        {/* Left Icon */}
        {leftIcon && !loading && (
          <span className="button-icon-left">
            {leftIcon}
          </span>
        )}

        {/* Loading Spinner */}
        {loading && (
          <span className="button-loading-spinner">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}

        {/* Button Text */}
        <span className={loading ? 'opacity-0' : ''}>
          {children}
        </span>

        {/* Right Icon */}
        {rightIcon && !loading && (
          <span className="button-icon-right">
            {rightIcon}
          </span>
        )}
      </span>
    </button>
  );
};

export default Button;
