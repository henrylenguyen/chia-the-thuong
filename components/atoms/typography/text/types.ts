/**
 * Text Component Types
 * Local TypeScript interfaces
 */

import { ReactNode } from 'react';

export interface TextProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface TextHookProps {
  // Hook props here
}

export interface TextHookReturn {
  isLoading: boolean;
  error: string | null;
  handleAction: () => void;
}
