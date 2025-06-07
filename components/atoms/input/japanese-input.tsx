/**
 * Japanese Input Component - Input field cho tiếng Nhật với IME support
 * 
 * Component input chuyên dụng cho việc nhập tiếng Nhật
 * Hỗ trợ IME, validation và quiz interface
 * 
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import React from 'react';
import { JapaneseInputProps } from './types';
import { useJapaneseInput } from './useJapaneseInput';

/**
 * Japanese Input Component
 * 
 * Input field tối ưu cho việc nhập tiếng Nhật
 * Hỗ trợ IME, auto-focus, validation
 * 
 * @param props - Thuộc tính của JapaneseInput component
 * @returns JSX.Element
 */
export const JapaneseInput: React.FC<JapaneseInputProps> = ({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Nhập câu trả lời...',
  disabled = false,
  loading = false,
  error = false,
  success = false,
  autoFocus = true,
  size = 'medium',
  fullWidth = true,
  className = '',
  maxLength,
  hint,
  showCharCount = false,
  ...props
}) => {
  const {
    inputRef,
    inputClasses,
    wrapperClasses,
    handleChange,
    handleKeyDown,
    handleFocus,
    handleBlur,
    isFocused,
    charCount,
    isValid
  } = useJapaneseInput({
    value,
    onChange,
    onSubmit,
    disabled,
    loading,
    error,
    success,
    size,
    fullWidth,
    className,
    maxLength,
    autoFocus
  });

  return (
    <div className={wrapperClasses}>
      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled || loading}
        maxLength={maxLength}
        className={inputClasses}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        lang="ja"
        inputMode="text"
        aria-invalid={error}
        aria-describedby={hint ? 'input-hint' : undefined}
        {...props}
      />

      {/* Status Icons - Centered properly */}
      {(loading || success || error) && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-primary-blue"
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
          )}

          {success && !loading && (
            <svg
              className="h-5 w-5 text-success-green"
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
          )}

          {error && !loading && (
            <svg
              className="h-5 w-5 text-error-red"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
      )}

      {/* Hint Text */}
      {hint && (
        <p
          id="input-hint"
          className={`mt-2 text-sm ${error ? 'text-error-red' : 'text-secondary'
            }`}
        >
          {hint}
        </p>
      )}

      {/* Character Count */}
      {showCharCount && maxLength && (
        <p className="mt-1 text-xs text-muted text-right">
          {charCount}/{maxLength}
        </p>
      )}
    </div>
  );
};

export default JapaneseInput;
