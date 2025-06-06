/**
 * JapaneseInput Component
 * UI thuần túy - chỉ nhận props và render
 */

import React from 'react';
import { JapaneseInputProps } from './types';

export const JapaneseInput: React.FC<JapaneseInputProps> = ({
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

export default JapaneseInput;
