/**
 * useDeviceDetection Hook
 * 
 * Custom hook để detect device type và screen size
 * Hỗ trợ responsive design và adaptive UI
 * 
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { isMobile, isTablet, isDesktop, isBrowser } from 'react-device-detect';

export interface DeviceInfo {
  /**
   * Có phải mobile device không
   */
  isMobile: boolean;

  /**
   * Có phải tablet device không
   */
  isTablet: boolean;

  /**
   * Có phải desktop device không
   */
  isDesktop: boolean;

  /**
   * Có phải browser environment không
   */
  isBrowser: boolean;

  /**
   * Screen width hiện tại
   */
  screenWidth: number;

  /**
   * Screen height hiện tại
   */
  screenHeight: number;

  /**
   * Breakpoint hiện tại (sm, md, lg, xl, 2xl)
   */
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  /**
   * Có phải touch device không
   */
  isTouchDevice: boolean;

  /**
   * Orientation hiện tại
   */
  orientation: 'portrait' | 'landscape';
}

/**
 * Custom hook cho device detection
 * 
 * @returns DeviceInfo object với thông tin device
 */
export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isBrowser: true,
    screenWidth: 1024,
    screenHeight: 768,
    breakpoint: 'lg',
    isTouchDevice: false,
    orientation: 'landscape'
  });

  useEffect(() => {
    if (!isBrowser) return;

    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Xác định breakpoint dựa trên Tailwind CSS breakpoints
      let breakpoint: DeviceInfo['breakpoint'] = 'xs';
      if (width >= 1536) breakpoint = '2xl';
      else if (width >= 1280) breakpoint = 'xl';
      else if (width >= 1024) breakpoint = 'lg';
      else if (width >= 768) breakpoint = 'md';
      else if (width >= 640) breakpoint = 'sm';

      // Detect touch device
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Detect orientation
      const orientation = width > height ? 'landscape' : 'portrait';

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isBrowser,
        screenWidth: width,
        screenHeight: height,
        breakpoint,
        isTouchDevice,
        orientation
      });
    };

    // Initial update
    updateDeviceInfo();

    // Listen for resize events
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};

/**
 * Hook để get responsive card size dựa trên device
 */
export const useResponsiveCardSize = () => {
  const { breakpoint, isMobile, isTablet } = useDeviceDetection();

  const getCardSize = () => {
    if (isMobile) return 'small';
    if (isTablet) return 'medium';
    
    switch (breakpoint) {
      case 'xs':
      case 'sm':
        return 'small';
      case 'md':
        return 'medium';
      case 'lg':
      case 'xl':
      case '2xl':
        return 'large';
      default:
        return 'medium';
    }
  };

  const getCardWidth = () => {
    if (isMobile) return 'w-full';
    if (isTablet) return 'w-full max-w-md';
    
    switch (breakpoint) {
      case 'xs':
      case 'sm':
        return 'w-full max-w-sm';
      case 'md':
        return 'w-full max-w-md';
      case 'lg':
        return 'w-full max-w-lg';
      case 'xl':
      case '2xl':
        return 'w-full max-w-xl';
      default:
        return 'w-full max-w-md';
    }
  };

  const getGridCols = () => {
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-2';
    
    switch (breakpoint) {
      case 'xs':
      case 'sm':
        return 'grid-cols-1';
      case 'md':
        return 'grid-cols-2';
      case 'lg':
        return 'grid-cols-2 xl:grid-cols-3';
      case 'xl':
      case '2xl':
        return 'grid-cols-3';
      default:
        return 'grid-cols-2';
    }
  };

  return {
    cardSize: getCardSize(),
    cardWidth: getCardWidth(),
    gridCols: getGridCols(),
    breakpoint,
    isMobile,
    isTablet
  };
};
