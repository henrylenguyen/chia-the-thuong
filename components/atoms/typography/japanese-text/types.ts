/**
 * JapaneseText Component Types
 * Local TypeScript interfaces
 */

import { ReactNode } from 'react';

export interface JapaneseTextProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface JapaneseTextHookProps {
  // Hook props here
}

export interface JapaneseTextHookReturn {
  isLoading: boolean;
  error: string | null;
  handleAction: () => void;
}
