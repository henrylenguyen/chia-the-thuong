/**
 * Button Component Types
 * Local TypeScript interfaces
 */

import { ReactNode } from 'react';

export interface ButtonProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface ButtonHookProps {
  // Hook props here
}

export interface ButtonHookReturn {
  isLoading: boolean;
  error: string | null;
  handleAction: () => void;
}
