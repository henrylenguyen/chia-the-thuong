/**
 * TextInput Component
 * UI thuần túy - chỉ nhận props và render
 */

import React from 'react';
import { TextInputProps } from './types';

export const TextInput: React.FC<TextInputProps> = ({
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

export default TextInput;
