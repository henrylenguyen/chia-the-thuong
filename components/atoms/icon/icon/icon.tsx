/**
 * Icon Component
 * UI thuần túy - chỉ nhận props và render
 */

import React from 'react';
import { IconProps } from './types';

export const Icon: React.FC<IconProps> = ({
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

export default Icon;
