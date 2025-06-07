/**
 * Logo Component - Biểu tượng chính của ứng dụng học tiếng Nhật
 *
 * Component hiển thị logo đơn giản với cổng Torii và text "日本語学習"
 * Icon và text cùng màu gradient, không có animation loading
 *
 * @author Japanese Learning App Team
 * @version 2.0.0
 */

import Link from 'next/link';
import React from 'react';
import { FaToriiGate } from 'react-icons/fa';

/**
 * Hiển thị logo đơn giản với cổng Torii và text "日本語学習"
 * Sử dụng Next.js Link để navigate về trang chủ
 * 
 *
 * @param props - Thuộc tính của Logo component
 * @returns JSX.Element
 */
export const Logo: React.FC<{
  href?: string;
  className?: string;
}> = ({
  href = '/',
  className = '',
  ...props
}) => {
    return (
      <Link
        href={href}
        className={`flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all duration-300 ${className}`}
        aria-label="Logo ứng dụng học tiếng Nhật - Về trang chủ"
        {...props}
      >
        <FaToriiGate
          className="text-2xl text-primary-blue dark:text-primary-blue-light"
          aria-hidden="true"
        />
        <h1 className="text-xl font-bold gradient-text font-japanese" aria-hidden="true">
          日本語学習
        </h1>
      </Link>
    );
  };

export default Logo;
