/**
 * Heading Component Types
 * Local TypeScript interfaces
 */

import { ReactNode } from 'react';

export interface HeadingProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface HeadingHookProps {
  // Hook props here
}

export interface HeadingHookReturn {
  isLoading: boolean;
  error: string | null;
  handleAction: () => void;
}
