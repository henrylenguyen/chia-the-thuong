/**
 * Input Component Types
 * 
 * Định nghĩa các interface và type cho Input components
 * Bao gồm Japanese input, search input và các variants khác
 * 
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import { InputHTMLAttributes } from 'react';

/**
 * Kích thước input có thể sử dụng
 */
export type InputSize = 'small' | 'medium' | 'large' | 'extra-large';

/**
 * Kiểu input
 */
export type InputVariant = 'default' | 'quiz' | 'search' | 'japanese';

/**
 * Trạng thái input
 */
export type InputState = 'default' | 'focused' | 'error' | 'success' | 'disabled';

/**
 * Props cho Japanese Input component
 */
export interface JapaneseInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onSubmit' | 'size'> {
  /**
   * Giá trị hiện tại của input
   */
  value?: string;

  /**
   * Callback khi giá trị thay đổi
   */
  onChange?: (value: string) => void;

  /**
   * Callback khi submit (Enter key)
   */
  onSubmit?: (value: string) => void;

  /**
   * Placeholder text
   * @default 'Nhập câu trả lời...'
   */
  placeholder?: string;

  /**
   * Input có bị disable không
   * @default false
   */
  disabled?: boolean;

  /**
   * Input có đang loading không
   * @default false
   */
  loading?: boolean;

  /**
   * Input có lỗi không
   * @default false
   */
  error?: boolean;

  /**
   * Input có thành công không
   * @default false
   */
  success?: boolean;

  /**
   * Auto focus khi mount
   * @default true
   */
  autoFocus?: boolean;

  /**
   * Kích thước input
   * @default 'medium'
   */
  size?: InputSize;

  /**
   * Input có chiếm full width không
   * @default true
   */
  fullWidth?: boolean;

  /**
   * CSS class tùy chỉnh
   * @default ''
   */
  className?: string;

  /**
   * Số ký tự tối đa
   */
  maxLength?: number;

  /**
   * Text gợi ý hoặc lỗi
   */
  hint?: string;

  /**
   * Hiển thị số ký tự đã nhập
   * @default false
   */
  showCharCount?: boolean;
}

/**
 * Props cho useJapaneseInput hook
 */
export interface UseJapaneseInputProps {
  value: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  disabled: boolean;
  loading: boolean;
  error: boolean;
  success: boolean;
  size: InputSize;
  fullWidth: boolean;
  className: string;
  maxLength?: number;
  autoFocus: boolean;
}

/**
 * Return type của useJapaneseInput hook
 */
export interface UseJapaneseInputReturn {
  /**
   * Ref cho input element
   */
  inputRef: React.RefObject<HTMLInputElement>;

  /**
   * CSS classes cho input element
   */
  inputClasses: string;

  /**
   * CSS classes cho wrapper
   */
  wrapperClasses: string;

  /**
   * Handler cho change event
   */
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Handler cho keydown event
   */
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  /**
   * Handler cho focus event
   */
  handleFocus: () => void;

  /**
   * Handler cho blur event
   */
  handleBlur: () => void;

  /**
   * Input có đang focused không
   */
  isFocused: boolean;

  /**
   * Số ký tự hiện tại
   */
  charCount: number;

  /**
   * Input có valid không
   */
  isValid: boolean;
}

/**
 * Mapping kích thước input với CSS classes
 */
export const INPUT_SIZE_CLASSES: Record<InputSize, {
  input: string;
  wrapper: string;
}> = {
  small: {
    input: 'px-3 py-2 text-sm',
    wrapper: 'text-sm'
  },
  medium: {
    input: 'px-4 py-3 text-base',
    wrapper: 'text-base'
  },
  large: {
    input: 'px-5 py-4 text-lg',
    wrapper: 'text-lg'
  },
  'extra-large': {
    input: 'px-6 py-5 text-xl',
    wrapper: 'text-xl'
  }
};

/**
 * Base CSS classes cho input (với dark mode support)
 */
export const INPUT_BASE_CLASSES = 'border rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 placeholder-text-muted';

/**
 * CSS classes cho các trạng thái input (với dark mode support)
 */
export const INPUT_STATE_CLASSES: Record<InputState, string> = {
  default: 'border-border-light bg-background text-text-primary focus:border-primary-blue focus:ring-primary-blue dark:border-border-light dark:bg-background dark:text-text-primary',
  focused: 'border-primary-blue ring-2 ring-primary-blue ring-opacity-50 dark:border-primary-blue-light dark:ring-primary-blue-light',
  error: 'border-error-red bg-red-50 dark:bg-red-900/20 text-text-primary focus:border-error-red focus:ring-error-red',
  success: 'border-success-green bg-green-50 dark:bg-green-900/20 text-text-primary focus:border-success-green focus:ring-success-green',
  disabled: 'border-border-light bg-bg-overlay text-text-muted cursor-not-allowed dark:border-border-light dark:bg-bg-overlay dark:text-text-muted'
};
