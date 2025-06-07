/**
 * Components Main Barrel Exports
 * 
 * Tập trung export tất cả components từ atoms, molecules, organisms
 * Usage: 
 * - import { Button, JapaneseInput } from 'components';
 * - import { Button } from 'atoms';
 * - import { TheoryCard } from 'molecules';
 * 
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

// Re-export all atoms
export * from './atoms';

// Re-export all molecules  
export * from './molecules';

// Re-export all organisms (commented out until implemented)
// export * from './organisms';

// Convenient grouped exports
export type {
  // Button types
  ButtonProps,
  ButtonSize,
  ButtonVariant, InputSize,
  InputState,
  // Input types
  JapaneseInputProps,
  // Loading types
  LoadingProps,
  LoadingVariant,

  // Progress Bar types
  ProgressBarProps,
  ProgressBarSize,
  ProgressBarVariant
} from './atoms';

export type {
  DifficultyLevel,
  // Exercise Card types from molecules
  Exercise, ExerciseCardProps,
  ExerciseCardSize,
  ExerciseCardVariant, ExerciseProgress, ExerciseStatus, FeedbackType, GrammarPattern, QuestionType, QuizCardProps,
  QuizCardSize,
  QuizCardVariant,
  // Quiz Card types from molecules
  QuizQuestion,
  QuizState, StudyProgress,
  StudyStatus,
  // Theory Card types from molecules
  TheoryCardProps,
  TheoryCardSize,
  TheoryCardVariant
} from './molecules';

