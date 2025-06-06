/**
 * Button Component
 * UI thuần túy - chỉ nhận props và render
 */

import React from 'react';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
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

export default Button;
