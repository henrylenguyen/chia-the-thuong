/**
 * Progress Bar Component - Thanh tiến độ cho quiz và học tập
 * 
 * Component hiển thị tiến độ với gradient theme
 * Hỗ trợ animation, labels và multiple variants
 * 
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import React from 'react';
import { ProgressBarProps } from './types';
import { useProgressBar } from './useProgressBar';

/**
 * Progress Bar Component
 * 
 * Thanh tiến độ với gradient và animation
 * Sử dụng trong quiz, statistics và learning progress
 * 
 * @param props - Thuộc tính của ProgressBar component
 * @returns JSX.Element
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'medium',
  showLabel = true,
  showPercentage = true,
  label,
  animated = true,
  striped = false,
  className = '',
  ...props
}) => {
  const {
    progressBarClasses,
    progressFillClasses,
    labelClasses,
    percentage,
    displayValue,
    isComplete,
    ariaLabel
  } = useProgressBar({
    value,
    max,
    variant,
    size,
    animated,
    striped,
    className
  });

  return (
    <div className={progressBarClasses} {...props}>
      {/* Label và Percentage */}
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {showLabel && (
            <span className={labelClasses}>
              {label || `${displayValue}/${max}`}
            </span>
          )}
          {showPercentage && (
            <span className={`${labelClasses} font-semibold`}>
              {percentage}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        className="relative overflow-hidden bg-neutral-gray-200 dark:bg-neutral-gray-700 rounded-full"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel}
      >
        {/* Progress Fill */}
        <div
          className={progressFillClasses}
          style={{
            width: `${percentage}%`,
            transition: animated ? 'width 0.6s ease-in-out' : 'none'
          }}
        >
          {/* Striped Pattern */}
          {striped && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-white dark:via-neutral-gray-300 via-transparent to-transparent opacity-20 animate-pulse" />
          )}
        </div>

        {/* Completion Indicator */}
        {isComplete && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <svg
              className="h-4 w-4 text-neutral-white dark:text-neutral-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Additional Info */}
      {isComplete && (
        <div className="mt-2 text-center">
          <span className="text-sm text-success-green dark:text-success-light font-medium">
            🎉 Hoàn thành!
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
