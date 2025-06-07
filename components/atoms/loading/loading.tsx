/**
 * Loading Component - Component hiển thị trạng thái loading
 *
 * Component hiển thị loading screen đẹp với design từ index(1).html
 * Bao gồm: Torii bouncing, dual spinner, loading dots, progress bar, Japanese characters
 *
 * @author Japanese Learning App Team
 * @version 2.0.0
 */

import React from 'react';
import { FaToriiGate } from 'react-icons/fa';
import { LoadingProps } from './types';
import { useLoading } from './useLoading';

/**
 * Loading Component
 *
 * Hiển thị loading screen đẹp với animation phong phú
 *
 * @param props - Thuộc tính của Loading component
 * @returns JSX.Element
 */
export const Loading: React.FC<LoadingProps> = ({
  variant = 'full-screen',
  className = '',
  text = 'Đang tải dữ liệu',
  showText = true,
  progress,
  showProgress = true,
  isFullScreen = true,
  ...props
}) => {
  const {
    containerClasses,
    displayText,
    progressPercentage
  } = useLoading({
    variant,
    className,
    text,
    showText,
    progress,
    showProgress,
    isFullScreen
  });

  return (
    <div
      className={containerClasses}
      role="status"
      aria-live="polite"
      aria-label={displayText}
      {...props}
    >
      {/* Logo Animation - Torii Bouncing */}
      <div className="mb-8">
        <FaToriiGate
          className="text-6xl animate-bounce text-primary-blue"
          aria-label="Cổng Torii - Đang tải"
        />
      </div>

      {/* Dual Spinner */}
      <div className="relative mb-6">
        {/* Outer spinner - Primary Blue */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-blue border-t-transparent"></div>
        {/* Inner spinner - Primary Purple, reverse direction */}
        <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-primary-purple border-b-transparent animate-spin reverse-spin"></div>
      </div>

      {/* Loading Text with Dots Animation */}
      {showText && (
        <div className="text-xl font-medium mb-2 text-text-primary">
          <span className="loading-dots">{displayText}</span>
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-64 bg-neutral-gray-200 dark:bg-neutral-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full animate-pulse slow-pulse transition-all duration-300 bg-primary-gradient"
            style={{ width: progress ? `${progressPercentage}%` : '100%' }}
          />
        </div>
      )}

      {/* Japanese Characters Animation */}
      <div className="mt-6 text-2xl font-japanese text-text-primary">
        <span className="inline-block animate-bounce bounce-delay-0">日</span>
        <span className="inline-block animate-bounce bounce-delay-1">本</span>
        <span className="inline-block animate-bounce bounce-delay-2">語</span>
        <span className="inline-block animate-bounce bounce-delay-3">学</span>
        <span className="inline-block animate-bounce bounce-delay-4">習</span>
      </div>
    </div>
  );
};

export default Loading;
