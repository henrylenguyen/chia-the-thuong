/**
 * Heading Component
 * UI thuần túy - chỉ nhận props và render
 */

import React from 'react';
import { HeadingProps } from './types';

export const Heading: React.FC<HeadingProps> = ({
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

export default Heading;
