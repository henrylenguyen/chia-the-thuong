/**
 * JapaneseText Component
 * UI thuần túy - chỉ nhận props và render
 */

import React from 'react';
import { JapaneseTextProps } from './types';

export const JapaneseText: React.FC<JapaneseTextProps> = ({
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

export default JapaneseText;
