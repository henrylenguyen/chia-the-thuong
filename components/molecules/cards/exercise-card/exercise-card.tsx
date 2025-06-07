/**
 * Exercise Card Component - Card Design Demo Implementation với Tailwind CSS
 *
 * Component card hiển thị thông tin exercise theo design demo
 * Sử dụng Tailwind CSS và atomic design pattern
 *
 * @author Japanese Learning App Team
 * @version 3.0.0 - Card Design Demo Implementation với Tailwind CSS
 */

import React from 'react';
import { ExerciseCardProps } from './types';
import { useExerciseCard } from './useExerciseCard';

/**
 * Exercise Card Component - Pure UI Component
 *
 * Card hiển thị thông tin exercise với Tailwind CSS
 * Logic được tách ra useExerciseCard hook theo atomic design pattern
 *
 * @param props - Thuộc tính của ExerciseCard component
 * @returns JSX.Element
 */
export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  progress,
  variant = 'default',
  disabled = false,
  loading = false,
  showProgress = true,
  showDifficulty = true,
  showQuestionCount = true,
  showEstimatedTime = true,
  onClick,
  onStartExercise,
  onContinueExercise,
  onReviewExercise,
  className = '',
  ...props
}) => {
  // Sử dụng hook để quản lý logic
  const {
    progressPercentage,
    actionButton,
    statusBadge,
    difficultyStars,
    cardClasses,
    handleCardClick,
    handleKeyDown,
    handleActionClick,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp
  } = useExerciseCard({
    exercise,
    progress,
    disabled,
    loading,
    variant,
    onClick,
    onStartExercise,
    onContinueExercise,
    onReviewExercise
  });

  // Render loading skeleton
  if (loading) {
    return (
      <div className={`min-w-[350px] max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden loading-card ${className}`} {...props}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
          </div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4 animate-pulse" />

        <div className="flex gap-4 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
        </div>

        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${cardClasses} ${className}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      role="button"
      tabIndex={disabled || loading ? -1 : 0}
      aria-label={`${exercise.title} - ${exercise.description}`}
      aria-disabled={disabled || loading}
      {...props}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {exercise.title}
          </h3>
          <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full uppercase">
            {exercise.form}
          </span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
        {exercise.description}
        {disabled && ' (Chưa mở khóa)'}
      </p>

      {/* Exercise Stats */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Difficulty Stars */}
        {showDifficulty && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex gap-1">
              {difficultyStars.map(({ filled, key }) => (
                <span
                  key={key}
                  className={`text-sm ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span>({exercise.difficulty}/5)</span>
          </div>
        )}

        {/* Question Count */}
        {showQuestionCount && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-blue-500">📝</span>
            <span>{exercise.questionCount} câu</span>
          </div>
        )}

        {/* Estimated Time */}
        {showEstimatedTime && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-blue-500">⏱️</span>
            <span>~{exercise.estimatedTime} phút</span>
          </div>
        )}
      </div>

      {/* Progress Section */}
      {showProgress && progress && progress.status !== 'not-started' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tiến độ</span>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
          {statusBadge.text}
        </span>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${actionButton.disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5'
            }`}
          onClick={handleActionClick}
          disabled={actionButton.disabled}
        >
          {actionButton.text}
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;
