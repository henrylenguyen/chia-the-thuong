/**
 * Configuration Manager
 * Handles loading and managing all configuration from JSON files
 */

export class ConfigManager {
  constructor() {
    this.config = null;
    this.messages = null;
    this.settings = null;
    this.cache = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize configuration manager
   */
  async init() {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('🔧 Initializing Configuration Manager...');

      // Load only essential configuration files
      await Promise.all([
        this.loadAppConfig(),
        this.loadMessages(),
        this.loadSettings()
      ]);

      this.isInitialized = true;
      console.log('✅ Configuration Manager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Configuration Manager:', error);
      this.loadDefaults();
    }
  }

  /**
   * Load app configuration
   */
  async loadAppConfig() {
    try {
      this.config = await this.loadJSON('./app-config.json');
      console.log('📋 App config loaded');
    } catch (error) {
      console.warn('⚠️ Using default app config');
      this.config = this.getDefaultAppConfig();
    }
  }

  /**
   * Load messages/text content
   */
  async loadMessages() {
    try {
      this.messages = await this.loadJSON('./messages.json');
      console.log('💬 Messages loaded');
    } catch (error) {
      console.warn('⚠️ Using default messages');
      this.messages = this.getDefaultMessages();
    }
  }

  /**
   * Load settings
   */
  async loadSettings() {
    try {
      this.settings = await this.loadJSON('./settings.json');
      console.log('⚙️ Settings loaded');
    } catch (error) {
      console.warn('⚠️ Using default settings');
      this.settings = this.getDefaultSettings();
    }
  }

  /**
   * Generic JSON loader
   * @param url
   */
  async loadJSON(url) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status}`);
    }

    const data = await response.json();
    this.cache.set(url, data);
    return data;
  }

  /**
   * Get configuration value with dot notation
   * @param path
   * @param defaultValue
   */
  get(path, defaultValue = null) {
    return this.getNestedValue(this.config, path, defaultValue);
  }

  /**
   * Get message/text with interpolation
   * @param path
   * @param params
   */
  getMessage(path, params = {}) {
    const message = this.getNestedValue(this.messages, path, path);
    return this.interpolateMessage(message, params);
  }

  /**
   * Get setting value
   * @param path
   * @param defaultValue
   */
  getSetting(path, defaultValue = null) {
    return this.getNestedValue(this.settings, path, defaultValue);
  }

  /**
   * Get nested value using dot notation
   * @param obj
   * @param path
   * @param defaultValue
   */
  getNestedValue(obj, path, defaultValue = null) {
    if (!obj || !path) return defaultValue;

    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return defaultValue;
      }
      current = current[key];
    }

    return current;
  }

  /**
   * Interpolate message with parameters
   * @param message
   * @param params
   */
  interpolateMessage(message, params) {
    if (typeof message !== 'string') return message;

    return message.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * Get random message from array
   * @param path
   */
  getRandomMessage(path) {
    const messages = this.getNestedValue(this.messages, path, []);
    if (Array.isArray(messages) && messages.length > 0) {
      return messages[Math.floor(Math.random() * messages.length)];
    }
    return path;
  }

  /**
   * Get UI text
   * @param key
   */
  getUIText(key) {
    return this.getMessage(`ui.${key}`, key);
  }

  /**
   * Get button text
   * @param key
   */
  getButtonText(key) {
    return this.getMessage(`ui.buttons.${key}`, key);
  }

  /**
   * Get label text
   * @param key
   */
  getLabelText(key) {
    return this.getMessage(`ui.labels.${key}`, key);
  }

  /**
   * Get error message
   * @param key
   * @param params
   */
  getErrorMessage(key, params = {}) {
    return this.getMessage(`errors.${key}`, params);
  }

  /**
   * Get success message
   * @param key
   */
  getSuccessMessage(key) {
    return this.getMessage(`success.${key}`);
  }

  /**
   * Get feedback message
   * @param type
   * @param subtype
   */
  getFeedbackMessage(type, subtype = 'messages') {
    return this.getRandomMessage(`feedback.${type}.${subtype}`);
  }

  /**
   * Check if feature is enabled
   * @param feature
   */
  isFeatureEnabled(feature) {
    return this.getSetting(`features.${feature}`, false);
  }

  /**
   * Get theme configuration
   */
  getThemeConfig() {
    return {
      current: this.getSetting('defaults.theme', 'light'),
      available: this.getSetting('ui.themes', ['light', 'dark']),
      animations: this.getSetting('ui.animations', {})
    };
  }

  /**
   * Get quiz configuration
   */
  getQuizConfig() {
    return this.getSetting('quiz', {});
  }

  /**
   * Get performance settings
   */
  getPerformanceConfig() {
    return this.getSetting('performance', {});
  }

  /**
   * Load default configurations if files fail to load
   */
  loadDefaults() {
    this.config = this.getDefaultAppConfig();
    this.messages = this.getDefaultMessages();
    this.settings = this.getDefaultSettings();
    this.isInitialized = true;
  }

  /**
   * Default app configuration
   */
  getDefaultAppConfig() {
    return {
      app: {
        name: "Japanese Learning App",
        version: "1.0.0",
        defaultLanguage: "vi"
      },
      categories: {
        verbs: { name: "Động Từ", icon: "fas fa-running", color: "blue" },
        adjectives: { name: "Tính Từ", icon: "fas fa-palette", color: "purple" },
        nouns: { name: "Danh Từ", icon: "fas fa-cube", color: "indigo" },
        grammar: { name: "Ngữ Pháp", icon: "fas fa-book", color: "orange" }
      },
      features: {
        achievements: true,
        statistics: true,
        darkMode: true,
        hints: true,
        reviewMode: true,
        progressTracking: true
      }
    };
  }

  /**
   * Default messages
   */
  getDefaultMessages() {
    return {
      ui: {
        buttons: {
          start: "Bắt đầu",
          check: "Kiểm Tra",
          next: "Tiếp Theo",
          back: "Quay Lại"
        },
        labels: {
          correct: "Câu Đúng",
          total: "Tổng Câu",
          accuracy: "Độ Chính Xác"
        }
      },
      feedback: {
        correct: { messages: ["Chính xác!"] },
        incorrect: { messages: ["Chưa chính xác"] }
      },
      errors: {
        dataLoad: "Không thể tải dữ liệu",
        exerciseNotFound: "Không tìm thấy bài tập"
      }
    };
  }

  /**
   * Default settings
   */
  getDefaultSettings() {
    return {
      performance: {
        debounceDelay: 300,
        animationDuration: 300,
        autoSaveInterval: 30000
      },
      defaults: {
        theme: "light",
        language: "vi",
        autoFocus: true,
        soundEnabled: false,
        animationsEnabled: true
      },
      features: {
        achievements: true,
        statistics: true,
        darkMode: true,
        hints: true
      }
    };
  }

  /**
   * Reload configuration
   */
  async reload() {
    this.cache.clear();
    this.isInitialized = false;
    await this.init();
  }

  /**
   * Get all configuration
   */
  getAll() {
    return {
      config: this.config,
      messages: this.messages,
      settings: this.settings
    };
  }
}
