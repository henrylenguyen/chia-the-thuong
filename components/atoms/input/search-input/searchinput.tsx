/**
 * SearchInput Component
 * UI thuần túy - chỉ nhận props và render
 */

import React from 'react';
import { SearchInputProps } from './types';

export const SearchInput: React.FC<SearchInputProps> = ({
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

export default SearchInput;
