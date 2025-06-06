/**
 * Icon Component Types
 * Local TypeScript interfaces
 */

import { ReactNode } from 'react';

export interface IconProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface IconHookProps {
  // Hook props here
}

export interface IconHookReturn {
  isLoading: boolean;
  error: string | null;
  handleAction: () => void;
}
