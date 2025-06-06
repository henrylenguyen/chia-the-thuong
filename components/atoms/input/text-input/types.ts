/**
 * TextInput Component Types
 * Local TypeScript interfaces
 */

import { ReactNode } from 'react';

export interface TextInputProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface TextInputHookProps {
  // Hook props here
}

export interface TextInputHookReturn {
  isLoading: boolean;
  error: string | null;
  handleAction: () => void;
}
