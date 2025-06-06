/**
 * LoadingSpinner Component
 * UI thuần túy - chỉ nhận props và render
 */

import React from 'react';
import { LoadingSpinnerProps } from './types';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

export default LoadingSpinner;
