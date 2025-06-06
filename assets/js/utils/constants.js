/**
 * Application Constants - Simplified & Practical
 * Dynamic: User-configurable values from JSON
 * Static: Technical constants that rarely change
 */

import { ConfigManager } from '../modules/config-manager.js';

// Global config manager instance
export const configManager = new ConfigManager();

// Static file paths and app configuration
export const APP_CONFIG = {
  CONFIG_FILE: './app-config.json',
  MESSAGES_FILE: './messages.json',
  SETTINGS_FILE: './settings.json',
  QUESTIONS_FILE: './questions.json',
  ANSWERS_FILE: './answers.json',
  DEBUG: true,
  API_BASE_URL: null
};

// Regular expressions for Japanese text processing
export const REGEX_PATTERNS = {
  HIRAGANA: /[\u3040-\u309F]/,
  KATAKANA: /[\u30A0-\u30FF]/,
  KANJI: /[\u4E00-\u9FAF]/,
  JAPANESE: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/
};

// Error messages for helpers
export const ERROR_MESSAGES = {
  ELEMENT_NOT_FOUND: 'Element not found',
  INVALID_DATA: 'Invalid data provided',
  NETWORK_ERROR: 'Network error occurred'
};

// Technical constants - rarely change, keep hardcoded for clarity
export const DOM_IDS = {
  ANSWER_INPUT: 'answer-input',
  QUESTION_TEXT: 'question-text',
  JAPANESE_SENTENCE: 'japanese-sentence',
  FEEDBACK: 'feedback',
  NEXT_BTN: 'next-btn',
  CHECK_BTN: 'check-btn',
  RESULTS_MODAL: 'results-modal',
  PROGRESS_BAR: 'progress-bar',
  EXERCISE_GRID: 'exercise-grid',
  EXERCISE_CARDS_CONTAINER: 'exercise-cards-container'
};

export const CSS_CLASSES = {
  HIDDEN: 'hidden',
  ACTIVE: 'active',
  DISABLED: 'disabled',
  PAGE: 'page',
  BTN: 'btn',
  BTN_PRIMARY: 'btn-primary',
  BTN_SECONDARY: 'btn-secondary',
  ANIMATE_FADE_IN: 'animate-fade-in',
  ANIMATE_SLIDE_UP: 'animate-slide-up',
  ANIMATE_BOUNCE_IN: 'animate-bounce-in'
};

export const TIMING = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  AUTO_FOCUS_DELAY: 100,
  AUTO_HIDE_DELAY: 2000,
  AUTO_ADVANCE_DELAY: 2000,
  AUTO_SAVE_INTERVAL: 30000
};

export const KEYBOARD = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight'
};

// Storage Keys - these remain static for compatibility
export const STORAGE_KEYS = {
  GLOBAL_STATS: 'globalStats',
  WRONG_ANSWERS: 'wrongAnswers',
  USER_PREFERENCES: 'userPreferences',
  LAST_VISITED: 'lastVisited',
  EXERCISE_PROGRESS: 'exerciseProgress',
  THEME: 'theme',
  LANGUAGE: 'language',
  ACHIEVEMENTS: 'achievements',
  SESSION_DATA: 'sessionData'
};

// Dynamic Configuration Helpers - Only essential ones
// For user-configurable values from JSON

/**
 * Get UI message/text with interpolation
 * @param {string} path - Message path (e.g., 'ui.buttons.start')
 * @param {Object} params - Parameters for interpolation
 * @returns {string} Interpolated message
 */
export function getMessage(path, params = {}) {
  return configManager.getMessage(path, params);
}

/**
 * Get user setting value
 * @param {string} path - Setting path (e.g., 'theme', 'language')
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Setting value
 */
export function getUserSetting(path, defaultValue = null) {
  return configManager.getSetting(`user.${path}`, defaultValue);
}

/**
 * Get quiz setting value
 * @param {string} path - Setting path (e.g., 'shuffleQuestions')
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Setting value
 */
export function getQuizSetting(path, defaultValue = null) {
  return configManager.getSetting(`quiz.${path}`, defaultValue);
}

/**
 * Check if feature is enabled in app config
 * @param {string} feature - Feature name
 * @returns {boolean} True if enabled
 */
export function isFeatureEnabled(feature) {
  return configManager.get(`features.${feature}`, false);
}

/**
 * Get category configuration
 * @param {string} key - Category key
 * @returns {Object|null} Category config
 */
export function getCategory(key) {
  return configManager.get(`categories.${key}`, null);
}

/**
 * Get random feedback message
 * @param {string} type - Feedback type ('correct' or 'incorrect')
 * @returns {string} Random feedback message
 */
export function getRandomFeedback(type) {
  const messages = configManager.getMessage(`feedback.${type}`, []);
  if (Array.isArray(messages) && messages.length > 0) {
    return messages[Math.floor(Math.random() * messages.length)];
  }
  return type === 'correct' ? 'Chính xác!' : 'Chưa đúng!';
}

/**
 * Initialize configuration manager
 * @returns {Promise<void>}
 */
export async function initializeConfig() {
  await configManager.init();
}

// Auto-initialize config when module loads
initializeConfig().catch(error => {
  console.error('❌ Failed to initialize configuration:', error);
});

// DEPRECATED: Old hardcoded constants - kept for backward compatibility
export const EXERCISE_DEFINITIONS = {};
export const UI_CONSTANTS = {};
export const FEEDBACK_MESSAGES = {};
