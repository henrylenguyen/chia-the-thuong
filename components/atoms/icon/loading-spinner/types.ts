/**
 * LoadingSpinner Component Types
 * Local TypeScript interfaces
 */

import { ReactNode } from 'react';

export interface LoadingSpinnerProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface LoadingSpinnerHookProps {
  // Hook props here
}

export interface LoadingSpinnerHookReturn {
  isLoading: boolean;
  error: string | null;
  handleAction: () => void;
}
