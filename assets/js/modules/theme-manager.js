/**
 * Theme Manager Module
 * Handles dark/light theme switching and user preferences
 */

import { StorageManager } from './storage-manager.js';

export class ThemeManager {
  constructor() {
    this.storageManager = new StorageManager();
    this.currentTheme = 'light';
    this.systemTheme = this.getSystemTheme();
    this.themeToggleBtn = null;
    this.observers = [];
  }

  /**
   * Initialize theme manager
   */
  init() {
    console.log('🎨 Initializing Theme Manager...');

    // Cache theme toggle button
    this.themeToggleBtn = document.getElementById('theme-toggle');

    // Load saved theme or detect system preference
    this.loadTheme();

    // Setup event listeners
    this.setupEventListeners();

    // Listen for system theme changes
    this.watchSystemTheme();

    console.log(`✅ Theme Manager initialized with theme: ${this.currentTheme}`);
  }

  /**
   * Get system theme preference
   */
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Load theme from storage or system preference
   */
  loadTheme() {
    const preferences = this.storageManager.getPreferences();
    const savedTheme = preferences.theme;

    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto')) {
      this.setTheme(savedTheme);
    } else {
      // Use system preference as default
      this.setTheme('auto');
    }
  }

  /**
   * Save theme preference
   */
  saveTheme() {
    this.storageManager.savePreferences({ theme: this.currentTheme });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Theme toggle button
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => {
        this.toggle();
      });
    }

    // Keyboard shortcut (T key)
    document.addEventListener('keydown', (e) => {
      if (e.key === 't' || e.key === 'T') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.toggle();
        }
      }
    });

    // Custom theme change events
    document.addEventListener('theme:change', (e) => {
      this.setTheme(e.detail.theme);
    });
  }

  /**
   * Watch for system theme changes
   */
  watchSystemTheme() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      mediaQuery.addEventListener('change', (e) => {
        this.systemTheme = e.matches ? 'dark' : 'light';
        console.log(`🌓 System theme changed to: ${this.systemTheme}`);

        // Update if using auto theme
        if (this.currentTheme === 'auto') {
          this.applyTheme(this.systemTheme);
        }

        this.notifyObservers();
      });
    }
  }

  /**
   * Set theme
   */
  setTheme(theme) {
    const oldTheme = this.currentTheme;
    this.currentTheme = theme;

    let actualTheme = theme;
    if (theme === 'auto') {
      actualTheme = this.systemTheme;
    }

    this.applyTheme(actualTheme);
    this.updateToggleButton(actualTheme);
    this.saveTheme();

    // Dispatch theme change event
    document.dispatchEvent(new CustomEvent('theme:changed', {
      detail: {
        theme: this.currentTheme,
        actualTheme,
        oldTheme
      }
    }));

    this.notifyObservers();

    console.log(`🎨 Theme changed: ${oldTheme} → ${this.currentTheme} (applied: ${actualTheme})`);
  }

  /**
   * Apply theme to DOM
   */
  applyTheme(theme) {
    const html = document.documentElement;

    // Remove existing theme classes
    html.classList.remove('light', 'dark');

    // Add new theme class
    html.classList.add(theme);

    // Update data attribute for CSS
    html.setAttribute('data-theme', theme);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);

    // Trigger CSS transitions
    this.triggerThemeTransition();
  }

  /**
   * Update meta theme color for mobile browsers
   */
  updateMetaThemeColor(theme) {
    let themeColor = theme === 'dark' ? '#1a202c' : '#ffffff';

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.content = themeColor;
  }

  /**
   * Trigger smooth theme transition
   */
  triggerThemeTransition() {
    const body = document.body;

    // Add transition class
    body.classList.add('theme-transitioning');

    // Remove after transition completes
    setTimeout(() => {
      body.classList.remove('theme-transitioning');
    }, 300);
  }

  /**
   * Update theme toggle button
   */
  updateToggleButton(actualTheme) {
    if (!this.themeToggleBtn) return;

    const icon = this.themeToggleBtn.querySelector('i');
    if (!icon) return;

    // Update icon
    icon.className = actualTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    // Update aria-label for accessibility
    this.themeToggleBtn.setAttribute('aria-label',
      actualTheme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'
    );

    // Add animation
    icon.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      icon.style.transform = '';
    }, 300);
  }

  /**
   * Toggle theme between light and dark
   */
  toggle() {
    let newTheme;

    if (this.currentTheme === 'auto') {
      // If auto, switch to opposite of current system theme
      newTheme = this.systemTheme === 'dark' ? 'light' : 'dark';
    } else {
      // Toggle between light and dark
      newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    }

    this.setTheme(newTheme);
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return {
      preference: this.currentTheme,
      actual: this.currentTheme === 'auto' ? this.systemTheme : this.currentTheme,
      system: this.systemTheme
    };
  }

  /**
   * Check if dark theme is active
   */
  isDarkTheme() {
    const actualTheme = this.currentTheme === 'auto' ? this.systemTheme : this.currentTheme;
    return actualTheme === 'dark';
  }

  /**
   * Add theme change observer
   */
  addObserver(callback) {
    this.observers.push(callback);
  }

  /**
   * Remove theme change observer
   */
  removeObserver(callback) {
    this.observers = this.observers.filter(obs => obs !== callback);
  }

  /**
   * Notify all observers of theme change
   */
  notifyObservers() {
    const themeInfo = this.getCurrentTheme();
    this.observers.forEach(callback => {
      try {
        callback(themeInfo);
      } catch (error) {
        console.error('Error in theme observer:', error);
      }
    });
  }

  /**
   * Get theme colors for dynamic styling
   */
  getThemeColors() {
    const isDark = this.isDarkTheme();

    return {
      primary: isDark ? '#667eea' : '#667eea',
      secondary: isDark ? '#f093fb' : '#f093fb',
      background: isDark ? '#1a202c' : '#ffffff',
      surface: isDark ? '#2d3748' : '#f7fafc',
      text: isDark ? '#f7fafc' : '#2d3748',
      textSecondary: isDark ? '#e2e8f0' : '#4a5568',
      border: isDark ? '#4a5568' : '#e2e8f0',
      success: isDark ? '#48bb78' : '#48bb78',
      warning: isDark ? '#ed8936' : '#ed8936',
      error: isDark ? '#f56565' : '#f56565'
    };
  }

  /**
   * Apply custom theme colors
   */
  applyCustomColors(colors) {
    const root = document.documentElement;

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    console.log('🎨 Custom colors applied:', colors);
  }

  /**
   * Reset to default theme colors
   */
  resetColors() {
    const root = document.documentElement;
    const themeColors = this.getThemeColors();

    Object.keys(themeColors).forEach(key => {
      root.style.removeProperty(`--color-${key}`);
    });

    console.log('🎨 Colors reset to defaults');
  }

  /**
   * Create theme selector UI
   */
  createThemeSelector() {
    const selector = document.createElement('div');
    selector.className = 'theme-selector';
    selector.innerHTML = `
            <div class="theme-options">
                <button class="theme-option" data-theme="light">
                    <i class="fas fa-sun"></i>
                    <span>Sáng</span>
                </button>
                <button class="theme-option" data-theme="dark">
                    <i class="fas fa-moon"></i>
                    <span>Tối</span>
                </button>
                <button class="theme-option" data-theme="auto">
                    <i class="fas fa-adjust"></i>
                    <span>Tự động</span>
                </button>
            </div>
        `;

    // Add event listeners
    selector.addEventListener('click', (e) => {
      const option = e.target.closest('.theme-option');
      if (option) {
        const theme = option.dataset.theme;
        this.setTheme(theme);
        this.updateThemeSelector(selector);
      }
    });

    this.updateThemeSelector(selector);
    return selector;
  }

  /**
   * Update theme selector UI
   */
  updateThemeSelector(selector) {
    const options = selector.querySelectorAll('.theme-option');
    options.forEach(option => {
      option.classList.toggle('active', option.dataset.theme === this.currentTheme);
    });
  }

  /**
   * Preload theme assets
   */
  preloadThemeAssets() {
    // Preload theme-specific images or fonts if needed
    const isDark = this.isDarkTheme();
    const assets = isDark ? [] : []; // Add theme-specific assets here

    assets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }

  /**
   * Clean up theme manager
   */
  destroy() {
    // Remove event listeners
    if (this.themeToggleBtn) {
      this.themeToggleBtn.removeEventListener('click', this.toggle);
    }

    // Clear observers
    this.observers = [];

    console.log('🗑️ Theme Manager destroyed');
  }
}