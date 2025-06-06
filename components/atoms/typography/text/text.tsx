/**
 * Text Component
 * UI thuần túy - chỉ nhận props và render
 */

import React from 'react';
import { TextProps } from './types';

export const Text: React.FC<TextProps> = ({
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

export default Text;
