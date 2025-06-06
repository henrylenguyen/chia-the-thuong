/**
 * SearchInput Component Types
 * Local TypeScript interfaces
 */

import { ReactNode } from 'react';

export interface SearchInputProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface SearchInputHookProps {
  // Hook props here
}

export interface SearchInputHookReturn {
  isLoading: boolean;
  error: string | null;
  handleAction: () => void;
}
