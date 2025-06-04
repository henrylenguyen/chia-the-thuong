/**
 * Helper Utilities
 * Common utility functions used throughout the application
 */

import { APP_CONFIG, ERROR_MESSAGES, REGEX_PATTERNS } from './constants.js';

/**
 * DOM Utilities
 */

/**
 * Get element by ID with null check
 */
export function getElement(id) {
  const element = document.getElementById(id);
  if (!element && APP_CONFIG.DEBUG) {
    console.warn(`Element with ID "${id}" not found`);
  }
  return element;
}

/**
 * Create element with attributes and content
 */
export function createElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element.setAttribute(key, value);
    }
  });

  if (content) {
    if (typeof content === 'string') {
      element.innerHTML = content;
    } else {
      element.appendChild(content);
    }
  }

  return element;
}

/**
 * Toggle element visibility with animation
 */
export function toggleElement(element, show = null, useAnimation = true) {
  if (!element) return;

  const isHidden = element.classList.contains('hidden');
  const shouldShow = show !== null ? show : isHidden;

  if (shouldShow) {
    element.classList.remove('hidden');
    if (useAnimation) {
      element.classList.add('animate-in', 'fade-in', 'duration-300');
    }
  } else {
    if (useAnimation) {
      element.classList.add('animate-out', 'fade-out', 'duration-300');
      setTimeout(() => {
        element.classList.add('hidden');
        element.classList.remove('animate-out', 'fade-out');
      }, 300);
    } else {
      element.classList.add('hidden');
    }
  }
}

/**
 * Add click outside listener
 */
export function addClickOutside(element, callback, excludeSelectors = []) {
  function handleClick(e) {
    if (!element.contains(e.target)) {
      // Check if click is on excluded elements
      const isExcluded = excludeSelectors.some(selector =>
        e.target.closest(selector)
      );

      if (!isExcluded) {
        callback(e);
      }
    }
  }

  document.addEventListener('click', handleClick);

  // Return cleanup function
  return () => document.removeEventListener('click', handleClick);
}

/**
 * Array Utilities
 */

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random items from array
 */
export function getRandomItems(array, count) {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Group array items by property
 */
export function groupBy(array, keyFn) {
  return array.reduce((groups, item) => {
    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
    (groups[key] = groups[key] || []).push(item);
    return groups;
  }, {});
}

/**
 * Remove duplicates from array
 */
export function uniqueArray(array, keyFn = null) {
  if (!keyFn) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * String Utilities
 */

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Truncate string with ellipsis
 */
export function truncateString(str, maxLength, suffix = '...') {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Convert string to kebab-case
 */
export function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert string to camelCase
 */
export function toCamelCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^[A-Z]/, char => char.toLowerCase());
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Time Utilities
 */

/**
 * Format milliseconds to readable time
 */
export function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  } else if (minutes > 0) {
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Format date to Vietnamese format
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };

  return new Intl.DateTimeFormat('vi-VN', defaultOptions).format(new Date(date));
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} ngày trước`;
  if (hours > 0) return `${hours} giờ trước`;
  if (minutes > 0) return `${minutes} phút trước`;
  return 'Vừa xong';
}

/**
 * Debounce function
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * Throttle function
 */
export function throttle(func, wait) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

/**
 * Japanese Text Utilities
 */

/**
 * Check if text contains hiragana
 */
export function hasHiragana(text) {
  return REGEX_PATTERNS.HIRAGANA.test(text);
}

/**
 * Check if text contains katakana
 */
export function hasKatakana(text) {
  return REGEX_PATTERNS.KATAKANA.test(text);
}

/**
 * Check if text contains kanji
 */
export function hasKanji(text) {
  return REGEX_PATTERNS.KANJI.test(text);
}

/**
 * Convert katakana to hiragana
 */
export function katakanaToHiragana(text) {
  return text.replace(/[ァ-ヶ]/g, (match) => {
    const code = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(code);
  });
}

/**
 * Convert hiragana to katakana
 */
export function hiraganaToKatakana(text) {
  return text.replace(/[あ-ん]/g, (match) => {
    const code = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(code);
  });
}

/**
 * Clean Japanese text (remove spaces, normalize)
 */
export function cleanJapaneseText(text) {
  return text
    .replace(/\s+/g, '') // Remove spaces
    .replace(/[ー]/g, '') // Remove long vowel marks
    .replace(/[っ]/g, 'つ') // Normalize small tsu
    .trim();
}

/**
 * Number Utilities
 */

/**
 * Clamp number between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate random number between min and max
 */
export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Round to specific decimal places
 */
export function roundTo(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Storage Utilities
 */

/**
 * Safe JSON parse
 */
export function safeJsonParse(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return defaultValue;
  }
}

/**
 * Safe JSON stringify
 */
export function safeJsonStringify(obj, defaultValue = '{}') {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.warn('Failed to stringify JSON:', error);
    return defaultValue;
  }
}

/**
 * URL Utilities
 */

/**
 * Get URL parameters as object
 */
export function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

/**
 * Update URL without reload
 */
export function updateUrl(params, replace = false) {
  const url = new URL(window.location);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });

  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }
}

/**
 * UI Utilities
 */

/**
 * Show loading screen
 */
export function showLoading(message = 'Đang tải...') {
  const loadingScreen = getElement('loading-screen');
  if (loadingScreen) {
    const loadingText = loadingScreen.querySelector('.loading-text');
    if (loadingText) {
      loadingText.textContent = message;
    }
    loadingScreen.classList.remove('hidden');
  }
}

/**
 * Hide loading screen
 */
export function hideLoading() {
  const loadingScreen = getElement('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('opacity-0');
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      loadingScreen.classList.remove('opacity-0');
    }, 300);
  }
}

/**
 * Show error modal
 */
export function showError(message, title = 'Lỗi') {
  const errorModal = createElement('div', {
    className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300'
  });

  const modalContent = createElement('div', {
    className: 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-300'
  }, `
        <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <i class="fas fa-exclamation-triangle text-2xl text-red-500"></i>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">${escapeHtml(title)}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-line leading-relaxed">${escapeHtml(message)}</p>
            <button class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium">
                <i class="fas fa-times mr-2"></i>Đóng
            </button>
        </div>
    `);

  const closeBtn = modalContent.querySelector('button');
  const closeModal = () => {
    errorModal.classList.add('animate-out', 'fade-out', 'duration-300');
    setTimeout(() => errorModal.remove(), 300);
  };

  closeBtn.addEventListener('click', closeModal);
  errorModal.addEventListener('click', (e) => {
    if (e.target === errorModal) closeModal();
  });

  errorModal.appendChild(modalContent);
  document.body.appendChild(errorModal);

  // Auto close after 10 seconds
  setTimeout(closeModal, 10000);

  return errorModal;
}

/**
 * Show success notification
 */
export function showSuccess(message, duration = 3000) {
  const notification = createElement('div', {
    className: 'fixed top-4 right-4 z-50 max-w-md bg-green-500 text-white rounded-lg shadow-lg p-4 animate-in slide-in-from-right-full duration-300'
  }, `
        <div class="flex items-center gap-3">
            <i class="fas fa-check-circle text-lg"></i>
            <span class="font-medium">${escapeHtml(message)}</span>
            <button class="ml-auto p-1 hover:bg-green-600 rounded transition-colors">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `);

  const closeBtn = notification.querySelector('button');
  const removeNotification = () => {
    notification.classList.add('animate-out', 'slide-out-to-right-full', 'duration-300');
    setTimeout(() => notification.remove(), 300);
  };

  closeBtn.addEventListener('click', removeNotification);
  document.body.appendChild(notification);

  // Auto remove
  setTimeout(removeNotification, duration);

  return notification;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    showSuccess('Đã sao chép vào clipboard!');
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    showError('Không thể sao chép vào clipboard');
    return false;
  }
}

/**
 * Download data as file
 */
export function downloadFile(data, filename, type = 'application/json') {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Performance Utilities
 */

/**
 * Measure function execution time
 */
export function measureTime(fn, ...args) {
  const start = performance.now();
  const result = fn(...args);
  const end = performance.now();
  console.log(`Function executed in ${end - start} milliseconds`);
  return result;
}

/**
 * Request animation frame with fallback
 */
export function requestFrame(callback) {
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  } else {
    return setTimeout(callback, 16); // ~60fps
  }
}

/**
 * Cancel animation frame with fallback
 */
export function cancelFrame(id) {
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Device Detection
 */

/**
 * Check if device is mobile
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device is iOS
 */
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Check if device supports touch
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get device pixel ratio
 */
export function getPixelRatio() {
  return window.devicePixelRatio || 1;
}

/**
 * Validation Helpers
 */

/**
 * Check if value is empty
 */
export function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Deep clone object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
}

/**
 * Compare two objects for equality
 */
export function isEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => isEqual(a[key], b[key]));
  }

  return false;
}

/**
 * Sleep function
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}