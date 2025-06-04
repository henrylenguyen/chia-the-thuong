/**
 * Storage Manager Module
 * Handles local storage operations with error handling and data validation
 */

import { APP_CONFIG } from '../utils/constants.js';

export class StorageManager {
  constructor() {
    this.prefix = APP_CONFIG.STORAGE_PREFIX || 'japaneseApp_';
    this.cache = new Map();
    this.isAvailable = this.checkStorageAvailability();

    if (!this.isAvailable) {
      console.warn('⚠️ localStorage not available, using memory cache only');
    }
  }

  /**
   * Check if localStorage is available
   */
  checkStorageAvailability() {
    try {
      const testKey = this.prefix + 'test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.error('❌ localStorage not available:', error);
      return false;
    }
  }

  /**
   * Get full key with prefix
   */
  getKey(key) {
    return this.prefix + key;
  }

  /**
   * Set item in storage
   */
  set(key, value) {
    const fullKey = this.getKey(key);

    try {
      const serialized = JSON.stringify({
        value,
        timestamp: Date.now(),
        version: '1.0'
      });

      // Always update cache
      this.cache.set(key, value);

      // Try to save to localStorage if available
      if (this.isAvailable) {
        localStorage.setItem(fullKey, serialized);
        console.log(`💾 Saved to localStorage: ${key}`);
      } else {
        console.log(`🧠 Saved to memory cache: ${key}`);
      }

      // Dispatch storage update event
      this.dispatchStorageEvent('set', key, value);

      return true;
    } catch (error) {
      console.error(`❌ Failed to save ${key}:`, error);

      if (error.name === 'QuotaExceededError') {
        this.handleQuotaExceeded(key, value);
      }

      return false;
    }
  }

  /**
   * Get item from storage
   */
  get(key, defaultValue = null) {
    // Check cache first
    if (this.cache.has(key)) {
      console.log(`🧠 Retrieved from cache: ${key}`);
      return this.cache.get(key);
    }

    if (!this.isAvailable) {
      console.log(`🧠 localStorage not available, returning default: ${key}`);
      return defaultValue;
    }

    const fullKey = this.getKey(key);

    try {
      const stored = localStorage.getItem(fullKey);

      if (stored === null) {
        console.log(`💾 Not found in localStorage: ${key}`);
        this.cache.set(key, defaultValue);
        return defaultValue;
      }

      const parsed = JSON.parse(stored);
      const value = parsed.value !== undefined ? parsed.value : parsed; // Backward compatibility

      // Update cache
      this.cache.set(key, value);

      console.log(`💾 Retrieved from localStorage: ${key}`);
      return value;

    } catch (error) {
      console.error(`❌ Failed to retrieve ${key}:`, error);

      // Try to remove corrupted data
      this.remove(key);

      return defaultValue;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key) {
    const fullKey = this.getKey(key);

    try {
      // Remove from cache
      this.cache.delete(key);

      // Remove from localStorage if available
      if (this.isAvailable) {
        localStorage.removeItem(fullKey);
        console.log(`🗑️ Removed from localStorage: ${key}`);
      }

      // Dispatch storage update event
      this.dispatchStorageEvent('remove', key);

      return true;
    } catch (error) {
      console.error(`❌ Failed to remove ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  has(key) {
    if (this.cache.has(key)) {
      return true;
    }

    if (!this.isAvailable) {
      return false;
    }

    const fullKey = this.getKey(key);
    return localStorage.getItem(fullKey) !== null;
  }

  /**
   * Clear all app data
   */
  clear() {
    try {
      // Clear cache
      this.cache.clear();

      if (!this.isAvailable) {
        console.log('🗑️ Cleared memory cache');
        return true;
      }

      // Clear localStorage items with our prefix
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      console.log(`🗑️ Cleared ${keysToRemove.length} items from localStorage`);

      // Dispatch storage update event
      this.dispatchStorageEvent('clear');

      return true;
    } catch (error) {
      console.error('❌ Failed to clear storage:', error);
      return false;
    }
  }

  /**
   * Get all keys with our prefix
   */
  getAllKeys() {
    const keys = [];

    // Add cache keys
    keys.push(...this.cache.keys());

    if (!this.isAvailable) {
      return keys;
    }

    // Add localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (fullKey && fullKey.startsWith(this.prefix)) {
        const key = fullKey.substring(this.prefix.length);
        if (!keys.includes(key)) {
          keys.push(key);
        }
      }
    }

    return keys;
  }

  /**
   * Get storage usage information
   */
  getStorageInfo() {
    if (!this.isAvailable) {
      return {
        available: false,
        cacheSize: this.cache.size,
        totalKeys: this.cache.size
      };
    }

    try {
      const keys = this.getAllKeys();
      let totalSize = 0;
      let itemCount = 0;

      keys.forEach(key => {
        const fullKey = this.getKey(key);
        const value = localStorage.getItem(fullKey);
        if (value) {
          totalSize += value.length * 2; // Rough estimate (UTF-16)
          itemCount++;
        }
      });

      return {
        available: true,
        itemCount,
        totalSize,
        totalSizeKB: Math.round(totalSize / 1024 * 100) / 100,
        cacheSize: this.cache.size,
        totalKeys: keys.length
      };
    } catch (error) {
      console.error('❌ Failed to get storage info:', error);
      return {
        available: false,
        error: error.message
      };
    }
  }

  /**
   * Handle quota exceeded error
   */
  handleQuotaExceeded(key, value) {
    console.warn('⚠️ Storage quota exceeded, attempting cleanup...');

    // Try to free up space by removing old data
    const keys = this.getAllKeys();
    const itemsToRemove = [];

    // Get items with timestamps and sort by age
    keys.forEach(k => {
      try {
        const fullKey = this.getKey(k);
        const stored = localStorage.getItem(fullKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.timestamp) {
            itemsToRemove.push({
              key: k,
              timestamp: parsed.timestamp,
              size: stored.length
            });
          }
        }
      } catch (error) {
        // Remove corrupted items
        itemsToRemove.push({
          key: k,
          timestamp: 0,
          size: 0
        });
      }
    });

    // Sort by age (oldest first)
    itemsToRemove.sort((a, b) => a.timestamp - b.timestamp);

    // Remove up to 25% of items or until we can save
    const maxToRemove = Math.max(1, Math.floor(itemsToRemove.length * 0.25));
    let removed = 0;

    for (const item of itemsToRemove) {
      if (removed >= maxToRemove) break;

      this.remove(item.key);
      removed++;

      // Try to save again
      try {
        this.set(key, value);
        console.log(`✅ Saved after removing ${removed} old items`);
        return;
      } catch (error) {
        // Continue removing items
      }
    }

    console.error('❌ Could not free enough space for storage');
  }

  /**
   * Dispatch storage events
   */
  dispatchStorageEvent(action, key, value = null) {
    document.dispatchEvent(new CustomEvent('storage:updated', {
      detail: { action, key, value }
    }));
  }

  // Specialized methods for app data

  /**
   * Get wrong answers
   */
  getWrongAnswers() {
    return this.get('wrongAnswers', []);
  }

  /**
   * Save wrong answers
   */
  saveWrongAnswers(wrongAnswers) {
    return this.set('wrongAnswers', wrongAnswers);
  }

  /**
   * Add wrong answer
   */
  addWrongAnswer(wrongAnswer) {
    const wrongAnswers = this.getWrongAnswers();
    wrongAnswers.push({
      ...wrongAnswer,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });

    // Keep only last 100 wrong answers to prevent storage bloat
    if (wrongAnswers.length > 100) {
      wrongAnswers.splice(0, wrongAnswers.length - 100);
    }

    this.saveWrongAnswers(wrongAnswers);
    return wrongAnswers;
  }

  /**
   * Add multiple wrong answers
   */
  addWrongAnswers(newWrongAnswers) {
    const wrongAnswers = this.getWrongAnswers();

    newWrongAnswers.forEach(answer => {
      wrongAnswers.push({
        ...answer,
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString()
      });
    });

    // Keep only last 100 wrong answers
    if (wrongAnswers.length > 100) {
      wrongAnswers.splice(0, wrongAnswers.length - 100);
    }

    this.saveWrongAnswers(wrongAnswers);
    return wrongAnswers;
  }

  /**
   * Clear wrong answers
   */
  clearWrongAnswers() {
    return this.set('wrongAnswers', []);
  }

  /**
   * Get user preferences
   */
  getPreferences() {
    return this.get('preferences', {
      theme: 'light',
      autoFocus: true,
      soundEnabled: true,
      animationsEnabled: true,
      showExplanations: true,
      shuffleQuestions: true
    });
  }

  /**
   * Save user preferences
   */
  savePreferences(preferences) {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    return this.set('preferences', updated);
  }

  /**
   * Save all data (for app cleanup)
   */
  saveAllData() {
    console.log('💾 Saving all data before exit...');

    // Force save cache to localStorage
    if (this.isAvailable) {
      for (const [key, value] of this.cache.entries()) {
        try {
          const fullKey = this.getKey(key);
          const serialized = JSON.stringify({
            value,
            timestamp: Date.now(),
            version: '1.0'
          });
          localStorage.setItem(fullKey, serialized);
        } catch (error) {
          console.error(`❌ Failed to save ${key} on exit:`, error);
        }
      }
    }

    console.log('✅ All data saved');
  }

  /**
   * Export all app data
   */
  exportData() {
    const keys = this.getAllKeys();
    const data = {};

    keys.forEach(key => {
      data[key] = this.get(key);
    });

    return {
      data,
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        storageInfo: this.getStorageInfo()
      }
    };
  }

  /**
   * Import app data
   */
  importData(exportedData) {
    try {
      if (!exportedData.data) {
        throw new Error('Invalid export format');
      }

      // Clear existing data
      this.clear();

      // Import data
      Object.entries(exportedData.data).forEach(([key, value]) => {
        this.set(key, value);
      });

      console.log(`✅ Imported ${Object.keys(exportedData.data).length} items`);
      return true;
    } catch (error) {
      console.error('❌ Failed to import data:', error);
      return false;
    }
  }
}