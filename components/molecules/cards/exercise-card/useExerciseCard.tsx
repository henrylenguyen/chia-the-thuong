/**
 * useExerciseCard Hook - Card Design Demo Implementation
 *
 * Custom hook quản lý logic cho Exercise Card component
 * Xử lý Tailwind CSS classes, event handlers và accessibility
 * Theo atomic design pattern và card-design-demo.html
 *
 * @author Japanese Learning App Team
 * @version 3.0.0 - Card Design Demo Implementation
 */

import { useCallback, useMemo, useState } from 'react';
import { ExerciseCardProps } from './types';

/**
 * Hook interface cho useExerciseCard
 */
interface UseExerciseCardProps extends Pick<ExerciseCardProps,
  'exercise' | 'progress' | 'disabled' | 'loading' | 'variant' |
  'onClick' | 'onStartExercise' | 'onContinueExercise' | 'onReviewExercise'
> { }

/**
 * Custom hook cho Exercise Card component
 *
 * Quản lý tất cả logic liên quan đến exercise card:
 * - Tailwind CSS classes dựa trên props và state
 * - Event handlers với accessibility
 * - Progress calculations
 * - Interactive states (hover, loading, disabled)
 *
 * @param props - Thuộc tính từ ExerciseCard component
 * @returns Object chứa các giá trị và functions cần thiết
 */
export const useExerciseCard = ({
  exercise,
  progress,
  disabled = false,
  loading = false,
  variant = 'default',
  onClick,
  onStartExercise,
  onContinueExercise,
  onReviewExercise
}: UseExerciseCardProps) => {
  // Internal state
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  /**
   * Tính toán phần trăm tiến độ
   */
  const progressPercentage = useMemo(() => {
    if (!progress) return 0;
    return Math.round(progress.completionPercentage);
  }, [progress]);

  /**
   * Xác định action button configuration
   */
  const actionButton = useMemo(() => {
    if (disabled) {
      return {
        text: exercise.metadata?.prerequisites ?
          `Yêu cầu ${exercise.metadata.prerequisites[0]}` :
          '🔒 Chưa mở khóa',
        handler: () => { },
        disabled: true,
        variant: 'disabled' as const
      };
    }

    if (!progress || progress.status === 'not-started') {
      return {
        text: 'Bắt đầu',
        handler: () => onStartExercise?.(exercise),
        disabled: false,
        variant: 'primary' as const
      };
    } else if (progress.status === 'in-progress') {
      return {
        text: 'Tiếp tục',
        handler: () => onContinueExercise?.(exercise),
        disabled: false,
        variant: 'primary' as const
      };
    } else {
      return {
        text: 'Ôn tập',
        handler: () => onReviewExercise?.(exercise),
        disabled: false,
        variant: 'secondary' as const
      };
    }
  }, [disabled, progress, exercise, onStartExercise, onContinueExercise, onReviewExercise]);

  /**
   * Status badge configuration - theo card-design-demo.html
   */
  const statusBadge = useMemo(() => {
    if (disabled) {
      return {
        className: 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        text: '🔒 Chưa mở khóa'
      };
    }

    if (!progress || progress.status === 'not-started') {
      return {
        className: 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        text: 'Chưa bắt đầu'
      };
    } else if (progress.status === 'in-progress') {
      return {
        className: 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        text: 'Đang làm'
      };
    } else if (progress.status === 'mastered') {
      return {
        className: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
        text: 'Đã thành thạo'
      };
    } else {
      // completed status - theo demo: #d1fae5 background, #065f46 text
      return {
        className: 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        text: 'Đã hoàn thành'
      };
    }
  }, [disabled, progress]);

  /**
   * Difficulty stars configuration
   */
  const difficultyStars = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      filled: i < exercise.difficulty,
      key: `star-${i}`
    }));
  }, [exercise.difficulty]);

  /**
   * Tailwind CSS classes cho card container - theo card-design-demo.html
   */
  const cardClasses = useMemo(() => {
    const baseClasses = [
      // Base styling theo demo
      'bg-white dark:bg-slate-800',
      'rounded-2xl', // 16px border-radius
      'p-6', // 1.5rem padding
      'shadow-lg',
      'transition-all duration-300 ease-in-out',
      'cursor-pointer',
      'relative',
      'overflow-hidden',
      // Width theo demo: minmax(350px, 1fr)
      'w-full min-w-[350px] max-w-md',
      // Top gradient border
      'before:content-[""] before:absolute before:top-0 before:left-0 before:right-0 before:h-1',
      'before:bg-gradient-to-r before:from-blue-500 before:to-purple-600'
    ];

    // State-based classes
    if (disabled) {
      baseClasses.push(
        'opacity-60',
        'cursor-not-allowed',
        'grayscale'
      );
    } else {
      baseClasses.push(
        'hover:-translate-y-1',
        'hover:shadow-xl'
      );
    }

    if (loading) {
      baseClasses.push('animate-pulse');
    }

    // Success state styling theo card-design-demo.html
    if (progress?.status === 'completed' || progress?.status === 'mastered') {
      baseClasses.push(
        'border-l-4 border-green-500',
        'bg-gradient-to-br from-green-50 to-emerald-50',
        'dark:from-green-900/20 dark:to-emerald-900/20'
      );
    }

    return baseClasses.join(' ');
  }, [disabled, loading, progress]);

  /**
   * Event handlers
   */
  const handleCardClick = useCallback(() => {
    if (disabled || loading) return;
    if (onClick) {
      onClick(exercise);
    }
  }, [disabled, loading, onClick, exercise]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  const handleActionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!actionButton.disabled) {
      actionButton.handler();
    }
  }, [actionButton]);

  const handleMouseEnter = useCallback(() => {
    if (!disabled && !loading) {
      setIsHovered(true);
    }
  }, [disabled, loading]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!disabled && !loading) {
      setIsPressed(true);
    }
  }, [disabled, loading]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  return {
    // State
    isHovered,
    isPressed,
    progressPercentage,

    // Computed values
    actionButton,
    statusBadge,
    difficultyStars,
    cardClasses,

    // Handlers
    handleCardClick,
    handleKeyDown,
    handleActionClick,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp
  };
};
