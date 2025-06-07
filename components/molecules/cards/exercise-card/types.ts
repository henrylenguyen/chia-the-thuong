/**
 * Exercise Card Component Types
 *
 * Định nghĩa các interface và type cho Exercise Card component
 * Bao gồm props, variants, sizes và các trạng thái khác nhau
 *
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import { HTMLAttributes } from 'react';

/**
 * Kích thước exercise card có thể sử dụng
 */
export type ExerciseCardSize = 'small' | 'medium' | 'large';

/**
 * Kiểu hiển thị exercise card
 */
export type ExerciseCardVariant = 'default' | 'compact' | 'detailed';

/**
 * Mức độ khó của exercise
 */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Trạng thái thực hiện exercise
 */
export type ExerciseStatus = 'not-started' | 'in-progress' | 'completed' | 'mastered';

/**
 * Thông tin exercise
 */
export interface Exercise {
  /**
   * ID duy nhất của exercise
   */
  id: string;

  /**
   * Tiêu đề exercise (ví dụ: "Te Form Practice")
   */
  title: string;

  /**
   * Mô tả exercise bằng tiếng Việt (ví dụ: "Luyện tập động từ dạng て")
   */
  description: string;

  /**
   * Form ngữ pháp (te, ta, nai, ru)
   */
  form: 'te' | 'ta' | 'nai' | 'ru';

  /**
   * Số câu hỏi có sẵn
   */
  questionCount: number;

  /**
   * Thời gian ước tính để hoàn thành (phút)
   */
  estimatedTime: number;

  /**
   * Mức độ khó (1-5)
   */
  difficulty: DifficultyLevel;

  /**
   * Danh sách grammar patterns liên quan
   */
  patterns?: string[];

  /**
   * Thông tin bổ sung
   */
  metadata?: {
    category?: string;
    tags?: string[];
    prerequisites?: string[];
  };
}

/**
 * Thông tin tiến độ exercise
 */
export interface ExerciseProgress {
  /**
   * Trạng thái exercise hiện tại
   */
  status: ExerciseStatus;

  /**
   * Số câu đã trả lời
   */
  questionsAnswered: number;

  /**
   * Số câu trả lời đúng
   */
  correctAnswers: number;

  /**
   * Phần trăm hoàn thành (0-100)
   */
  completionPercentage: number;

  /**
   * Độ chính xác (0-100)
   */
  accuracy: number;

  /**
   * Thời gian đã dành (phút)
   */
  timeSpent: number;

  /**
   * Lần thực hiện cuối cùng
   */
  lastAttempted?: Date;

  /**
   * Số lần thực hiện
   */
  attemptCount: number;

  /**
   * Điểm số cao nhất
   */
  bestScore: number;
}

/**
 * Props cho Exercise Card component
 */
export interface ExerciseCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * Thông tin exercise
   */
  exercise: Exercise;

  /**
   * Thông tin tiến độ exercise
   */
  progress?: ExerciseProgress;

  /**
   * Kích thước card
   * @default 'medium'
   */
  size?: ExerciseCardSize;

  /**
   * Kiểu hiển thị card
   * @default 'default'
   */
  variant?: ExerciseCardVariant;

  /**
   * Card bị disabled (locked) không
   * @default false
   */
  disabled?: boolean;

  /**
   * Card đang loading không
   * @default false
   */
  loading?: boolean;

  /**
   * Hiển thị progress bar không
   * @default true
   */
  showProgress?: boolean;

  /**
   * Hiển thị difficulty indicator không
   * @default true
   */
  showDifficulty?: boolean;

  /**
   * Hiển thị question count không
   * @default true
   */
  showQuestionCount?: boolean;

  /**
   * Hiển thị estimated time không
   * @default true
   */
  showEstimatedTime?: boolean;

  /**
   * Hiển thị best score không
   * @default true
   */
  showBestScore?: boolean;

  /**
   * Callback khi click vào card
   */
  onClick?: (exercise: Exercise) => void;

  /**
   * Callback khi click "Bắt đầu"
   */
  onStartExercise?: (exercise: Exercise) => void;

  /**
   * Callback khi click "Tiếp tục"
   */
  onContinueExercise?: (exercise: Exercise) => void;

  /**
   * Callback khi click "Ôn tập"
   */
  onReviewExercise?: (exercise: Exercise) => void;

  /**
   * CSS classes tùy chỉnh
   */
  className?: string;
}

/**
 * Props cho useExerciseCard hook
 */
export interface UseExerciseCardProps {
  exercise: Exercise;
  progress?: ExerciseProgress;
  size: ExerciseCardSize;
  variant: ExerciseCardVariant;
  showProgress: boolean;
  showDifficulty: boolean;
  showQuestionCount: boolean;
  showEstimatedTime: boolean;
  showBestScore: boolean;
  className?: string;
  onClick?: (exercise: Exercise) => void;
  onStartExercise?: (exercise: Exercise) => void;
  onContinueExercise?: (exercise: Exercise) => void;
  onReviewExercise?: (exercise: Exercise) => void;
}

/**
 * Return type cho useExerciseCard hook
 */
export interface UseExerciseCardReturn {
  /**
   * CSS classes cho card container
   */
  cardClasses: string;

  /**
   * CSS classes cho header section
   */
  headerClasses: string;

  /**
   * CSS classes cho content section
   */
  contentClasses: string;

  /**
   * CSS classes cho footer section
   */
  footerClasses: string;

  /**
   * CSS classes cho difficulty indicator
   */
  difficultyClasses: string;

  /**
   * Phần trăm tiến độ (0-100)
   */
  progressPercentage: number;

  /**
   * Text hiển thị cho action button
   */
  actionButtonText: string;

  /**
   * Variant cho action button
   */
  actionButtonVariant: 'primary' | 'secondary' | 'success';

  /**
   * Handler cho click card
   */
  handleCardClick: () => void;

  /**
   * Handler cho action button
   */
  handleActionClick: () => void;

  /**
   * ARIA label cho accessibility
   */
  ariaLabel: string;

  /**
   * Icon cho action button
   */
  actionButtonIcon: React.ComponentType<{ className?: string }>;

  /**
   * Hiển thị difficulty stars
   */
  difficultyStars: number[];
}

/**
 * CSS classes constants cho Exercise Card
 */
export const EXERCISE_CARD_SIZE_CLASSES: Record<ExerciseCardSize, {
  card: string;
  title: string;
  description: string;
  content: string;
}> = {
  small: {
    card: 'p-4',
    title: 'text-lg font-semibold',
    description: 'text-sm',
    content: 'text-sm'
  },
  medium: {
    card: 'p-6',
    title: 'text-xl font-semibold',
    description: 'text-base',
    content: 'text-base'
  },
  large: {
    card: 'p-8',
    title: 'text-2xl font-bold',
    description: 'text-lg',
    content: 'text-lg'
  }
};

/**
 * CSS classes cho difficulty levels (với dark mode support)
 */
export const DIFFICULTY_CLASSES: Record<DifficultyLevel, string> = {
  1: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
  2: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  3: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
  4: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700',
  5: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700'
};

/**
 * CSS classes cho exercise status (với dark mode support)
 */
export const STATUS_CLASSES: Record<ExerciseStatus, string> = {
  'not-started': 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  'in-progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  'completed': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  'mastered': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
};
