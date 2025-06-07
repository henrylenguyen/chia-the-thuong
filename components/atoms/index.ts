/**
 * Atoms Components Barrel Exports
 *
 * Tập trung export tất cả atomic components để dễ dàng import
 * Usage: import { Button, JapaneseInput, Logo } from 'atoms';
 *
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

// Button Component
export { Button } from './button/button';
export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  UseButtonProps,
  UseButtonReturn
} from './button/types';
export { useButton } from './button/useComponent';

// Input Components
export { JapaneseInput } from './input/japanese-input';
export type {
  InputSize,
  InputState, JapaneseInputProps, UseJapaneseInputProps,
  UseJapaneseInputReturn
} from './input/types';
export { useJapaneseInput } from './input/useJapaneseInput';

// Logo Component
export { Logo } from './logo/logo';

// Loading Component
export { Loading } from './loading/loading';
export type {
  LoadingProps,
  LoadingVariant,
  UseLoadingProps,
  UseLoadingReturn
} from './loading/types';
export { useLoading } from './loading/useLoading';

// Progress Bar Component
export { ProgressBar } from './progress-bar/progress-bar';
export type {
  ProgressBarProps,
  ProgressBarSize,
  ProgressBarVariant,
  UseProgressBarProps,
  UseProgressBarReturn
} from './progress-bar/types';
export { useProgressBar } from './progress-bar/useProgressBar';

