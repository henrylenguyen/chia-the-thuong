/**
 * JapaneseInput Component Types
 * Local TypeScript interfaces
 */

import { ReactNode } from 'react';

export interface JapaneseInputProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface JapaneseInputHookProps {
  // Hook props here
}

export interface JapaneseInputHookReturn {
  isLoading: boolean;
  error: string | null;
  handleAction: () => void;
}
