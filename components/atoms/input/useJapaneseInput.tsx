/**
 * useJapaneseInput Hook
 * 
 * Custom hook quản lý logic cho Japanese Input component
 * Xử lý IME, validation, keyboard events và CSS classes
 * 
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { 
  UseJapaneseInputProps, 
  UseJapaneseInputReturn, 
  INPUT_SIZE_CLASSES, 
  INPUT_BASE_CLASSES,
  INPUT_STATE_CLASSES,
  InputState
} from './types';

/**
 * Custom hook cho Japanese Input component
 * 
 * Quản lý tất cả logic liên quan đến Japanese input:
 * - IME support
 * - CSS classes dựa trên props và state
 * - Event handlers
 * - Validation
 * - Auto-focus
 * 
 * @param props - Thuộc tính từ JapaneseInput component
 * @returns Object chứa các giá trị và functions cần thiết
 */
export const useJapaneseInput = ({
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
}: UseJapaneseInputProps): UseJapaneseInputReturn => {

  // Refs và state
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  /**
   * Auto focus khi component mount
   */
  useEffect(() => {
    if (autoFocus && inputRef.current && !disabled) {
      // Delay để đảm bảo component đã render xong
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [autoFocus, disabled]);

  /**
   * Xác định trạng thái hiện tại của input
   */
  const currentState: InputState = useMemo(() => {
    if (disabled || loading) return 'disabled';
    if (error) return 'error';
    if (success) return 'success';
    if (isFocused) return 'focused';
    return 'default';
  }, [disabled, loading, error, success, isFocused]);

  /**
   * Tạo CSS classes cho wrapper
   */
  const wrapperClasses = useMemo(() => {
    const baseClasses = 'relative';
    const sizeClasses = INPUT_SIZE_CLASSES[size].wrapper;
    const widthClasses = fullWidth ? 'w-full' : '';
    
    return `${baseClasses} ${sizeClasses} ${widthClasses} ${className}`.trim();
  }, [size, fullWidth, className]);

  /**
   * Tạo CSS classes cho input element
   */
  const inputClasses = useMemo(() => {
    const baseClasses = INPUT_BASE_CLASSES;
    const sizeClasses = INPUT_SIZE_CLASSES[size].input;
    const stateClasses = INPUT_STATE_CLASSES[currentState];
    const widthClasses = fullWidth ? 'w-full' : '';
    const paddingRightClasses = (loading || error || success) ? 'pr-10' : '';
    
    return `${baseClasses} ${sizeClasses} ${stateClasses} ${widthClasses} ${paddingRightClasses}`.trim();
  }, [size, currentState, fullWidth, loading, error, success]);

  /**
   * Đếm số ký tự hiện tại
   */
  const charCount = useMemo(() => {
    return value.length;
  }, [value]);

  /**
   * Kiểm tra input có valid không
   */
  const isValid = useMemo(() => {
    if (maxLength && value.length > maxLength) return false;
    return !error;
  }, [value, maxLength, error]);

  /**
   * Handler cho change event
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Kiểm tra maxLength
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange, maxLength]);

  /**
   * Handler cho keydown event
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Xử lý Enter key để submit
    if (e.key === 'Enter' && !isComposing && onSubmit) {
      e.preventDefault();
      onSubmit(value);
    }
    
    // Xử lý Escape key để clear
    if (e.key === 'Escape') {
      e.preventDefault();
      if (onChange) {
        onChange('');
      }
      inputRef.current?.blur();
    }
  }, [value, onSubmit, onChange, isComposing]);

  /**
   * Handler cho focus event
   */
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  /**
   * Handler cho blur event
   */
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  /**
   * Handler cho composition events (IME)
   */
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleCompositionStart = () => {
      setIsComposing(true);
    };

    const handleCompositionEnd = () => {
      setIsComposing(false);
    };

    input.addEventListener('compositionstart', handleCompositionStart);
    input.addEventListener('compositionend', handleCompositionEnd);

    return () => {
      input.removeEventListener('compositionstart', handleCompositionStart);
      input.removeEventListener('compositionend', handleCompositionEnd);
    };
  }, []);

  return {
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
  };
};
