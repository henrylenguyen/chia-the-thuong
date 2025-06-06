/**
 * Navigation Module
 * Handles page navigation, routing, and mobile menu
 */

export class Navigation {
  constructor() {
    this.currentPage = 'theory';
    this.pages = ['theory', 'practice', 'review', 'statistics'];
    this.history = [];
    this.maxHistoryLength = 10;

    // DOM elements
    this.navButtons = null;
    this.mobileNavButtons = null;
    this.bottomNavButtons = null;
    this.mobileMenu = null;
    this.mobileMenuBtn = null;
    this.mobileMenuCloseBtn = null;
    this.mobileMenuBackdrop = null;
    this.mobileMenuPanel = null;
    this.pageElements = null;
  }

  /**
   * Initialize navigation
   */
  init() {
    console.log('🧭 Initializing Navigation...');

    // Cache DOM elements
    this.cacheElements();

    // Setup event listeners
    this.setupEventListeners();

    // Setup initial page
    this.setupInitialPage();

    // Setup browser history
    this.setupBrowserHistory();

    console.log(`✅ Navigation initialized with page: ${this.currentPage}`);
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.navButtons = document.querySelectorAll('.nav-btn');
    this.mobileNavButtons = document.querySelectorAll('.mobile-nav-btn');
    this.bottomNavButtons = document.querySelectorAll('.bottom-nav-item');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
    this.mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
    this.mobileMenuPanel = document.querySelector('.mobile-menu-panel');
    this.pageElements = {};

    // Cache page elements
    this.pages.forEach(page => {
      this.pageElements[page] = document.getElementById(`${page}-page`);
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Desktop navigation
    this.navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = btn.dataset.page;
        this.navigateTo(page);
      });
    });

    // Mobile navigation (old dropdown)
    this.mobileNavButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = btn.dataset.page;
        this.navigateTo(page);
        this.closeMobileMenu();
      });
    });

    // Bottom navigation (new mobile nav)
    this.bottomNavButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = btn.dataset.page;
        this.navigateTo(page);
      });
    });

    // Mobile menu toggle
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMobileMenu();
      });
    }

    // Mobile menu close button
    if (this.mobileMenuCloseBtn) {
      this.mobileMenuCloseBtn.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Close mobile menu when clicking backdrop
    if (this.mobileMenuBackdrop) {
      this.mobileMenuBackdrop.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Prevent menu panel clicks from closing menu
    if (this.mobileMenuPanel) {
      this.mobileMenuPanel.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.mobileMenu && !this.mobileMenu.classList.contains('hidden')) {
        if (!e.target.closest('#mobile-menu') && !e.target.closest('#mobile-menu-btn')) {
          this.closeMobileMenu();
        }
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });

    // Browser back/forward
    window.addEventListener('popstate', (e) => {
      this.handlePopState(e);
    });

    // Custom navigation events
    document.addEventListener('navigate:to', (e) => {
      this.navigateTo(e.detail.page, e.detail.options);
    });

    document.addEventListener('navigate:back', () => {
      this.goBack();
    });
  }

  /**
   * Setup initial page based on URL or default
   */
  setupInitialPage() {
    // Check URL hash for initial page
    const hash = window.location.hash.slice(1);
    const initialPage = this.pages.includes(hash) ? hash : 'theory';

    this.navigateTo(initialPage, { addToHistory: false, updateURL: false });
  }

  /**
   * Setup browser history management
   */
  setupBrowserHistory() {
    // Replace current state with initial page
    const state = { page: this.currentPage };
    history.replaceState(state, '', `#${this.currentPage}`);
  }

  /**
   * Navigate to a specific page
   */
  navigateTo(page, options = {}) {
    const opts = {
      addToHistory: true,
      updateURL: true,
      animate: true,
      ...options
    };

    if (!this.pages.includes(page)) {
      console.warn(`⚠️ Invalid page: ${page}`);
      return false;
    }

    if (page === this.currentPage) {
      console.log(`📍 Already on page: ${page}`);
      return true;
    }

    console.log(`🧭 Navigating: ${this.currentPage} → ${page}`);

    const previousPage = this.currentPage;

    // Add to navigation history
    if (opts.addToHistory) {
      this.addToHistory(this.currentPage);
    }

    // Update current page
    this.currentPage = page;

    // Hide all pages
    this.hideAllPages();

    // Show target page
    this.showPage(page, opts.animate);

    // Update navigation UI
    this.updateNavigationUI();

    // Update browser URL
    if (opts.updateURL) {
      this.updateURL(page);
    }

    // Dispatch navigation event
    document.dispatchEvent(new CustomEvent('navigate', {
      detail: {
        page,
        previousPage,
        options: opts
      }
    }));

    console.log(`✅ Navigation completed: ${page}`);
    return true;
  }

  /**
   * Hide all pages
   */
  hideAllPages() {
    Object.values(this.pageElements).forEach(element => {
      if (element) {
        element.classList.remove('active');
        element.classList.add('hidden');
      }
    });
  }

  /**
   * Show specific page
   */
  showPage(page, animate = true) {
    const element = this.pageElements[page];
    if (!element) return;

    // Show page
    element.classList.remove('hidden');

    if (animate) {
      // Add entrance animation
      element.classList.add('page-enter');
      element.classList.add('active');

      // Remove animation class after completion
      setTimeout(() => {
        element.classList.remove('page-enter');
      }, 600);
    } else {
      element.classList.add('active');
    }

    // Scroll to top
    element.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  /**
   * Update navigation UI (highlight active buttons)
   */
  updateNavigationUI() {
    // Update desktop navigation
    this.navButtons.forEach(btn => {
      const isActive = btn.dataset.page === this.currentPage;

      if (isActive) {
        // Active state - modern gradient style
        btn.classList.add('active');
        btn.classList.remove('text-gray-600', 'dark:text-gray-300');
        btn.setAttribute('aria-current', 'page');
      } else {
        // Inactive state
        btn.classList.remove('active');
        btn.classList.add('text-gray-600', 'dark:text-gray-300');
        btn.removeAttribute('aria-current');
      }
    });

    // Update mobile navigation (old dropdown)
    this.mobileNavButtons.forEach(btn => {
      const isActive = btn.dataset.page === this.currentPage;

      if (isActive) {
        // Active state
        btn.classList.remove('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800');
        btn.classList.add('bg-blue-500', 'text-white');
        btn.setAttribute('aria-current', 'page');
      } else {
        // Inactive state
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800');
        btn.removeAttribute('aria-current');
      }
    });

    // Update bottom navigation (new mobile nav)
    this.bottomNavButtons.forEach(btn => {
      const isActive = btn.dataset.page === this.currentPage;

      if (isActive) {
        // Active state
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'page');
      } else {
        // Inactive state
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Update browser URL
   */
  updateURL(page) {
    const state = { page };
    const url = `#${page}`;

    try {
      history.pushState(state, '', url);
    } catch (error) {
      console.warn('⚠️ Failed to update URL:', error);
    }
  }

  /**
   * Handle browser back/forward buttons
   */
  handlePopState(e) {
    const state = e.state;
    const page = state?.page || 'theory';

    console.log('🔙 Browser navigation:', page);
    this.navigateTo(page, { addToHistory: false, updateURL: false });
  }

  /**
   * Add page to navigation history
   */
  addToHistory(page) {
    // Remove page if it already exists (move to front)
    this.history = this.history.filter(p => p !== page);

    // Add to front
    this.history.unshift(page);

    // Limit history length
    if (this.history.length > this.maxHistoryLength) {
      this.history = this.history.slice(0, this.maxHistoryLength);
    }
  }

  /**
   * Go back to previous page
   */
  goBack() {
    if (this.history.length > 0) {
      const previousPage = this.history[0];
      this.navigateTo(previousPage);
    } else {
      console.log('📍 No navigation history');
    }
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(e) {
    // Skip if typing in input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    // Number keys for direct navigation
    const keyToPage = {
      '1': 'theory',
      '2': 'practice',
      '3': 'review',
      '4': 'statistics'
    };

    if (keyToPage[e.key]) {
      e.preventDefault();
      this.navigateTo(keyToPage[e.key]);
      return;
    }

    // Arrow key navigation
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      this.navigateByDirection(e.key === 'ArrowRight' ? 1 : -1);
      return;
    }

    // Escape to close mobile menu
    if (e.key === 'Escape') {
      this.closeMobileMenu();
    }
  }

  /**
   * Navigate by direction (next/previous page)
   */
  navigateByDirection(direction) {
    const currentIndex = this.pages.indexOf(this.currentPage);
    let newIndex = currentIndex + direction;

    // Wrap around
    if (newIndex < 0) {
      newIndex = this.pages.length - 1;
    } else if (newIndex >= this.pages.length) {
      newIndex = 0;
    }

    const newPage = this.pages[newIndex];
    this.navigateTo(newPage);
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    if (!this.mobileMenu) return;

    const isHidden = this.mobileMenu.classList.contains('hidden');

    if (isHidden) {
      this.openMobileMenu();
    } else {
      this.closeMobileMenu();
    }
  }

  /**
   * Open mobile menu with enhanced animations
   */
  openMobileMenu() {
    if (!this.mobileMenu) return;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Show menu
    this.mobileMenu.classList.remove('hidden');

    // Trigger reflow to ensure initial state is applied
    this.mobileMenu.offsetHeight;

    // Add show class for animations
    this.mobileMenu.classList.add('show');

    // Update hamburger button state
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.classList.add('active');
      this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }

    // Animate menu items with stagger
    const menuItems = this.mobileMenu.querySelectorAll('.mobile-nav-btn');
    menuItems.forEach((item, index) => {
      item.style.animationDelay = `${0.1 + (index * 0.05)}s`;
    });

    // Focus first menu item for accessibility (with delay)
    setTimeout(() => {
      const firstMenuItem = this.mobileMenu.querySelector('.mobile-nav-btn');
      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    }, 300);

    console.log('📱 Enhanced mobile menu opened');
  }

  /**
   * Close mobile menu with enhanced animations
   */
  closeMobileMenu() {
    if (!this.mobileMenu) return;

    // Remove show class to trigger close animation
    this.mobileMenu.classList.remove('show');

    // Update hamburger button state
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.classList.remove('active');
      this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }

    // Hide menu after animation completes
    setTimeout(() => {
      this.mobileMenu.classList.add('hidden');

      // Restore body scroll
      document.body.style.overflow = '';

      // Reset menu item animations
      const menuItems = this.mobileMenu.querySelectorAll('.mobile-nav-btn');
      menuItems.forEach(item => {
        item.style.animationDelay = '';
      });
    }, 300);

    console.log('📱 Enhanced mobile menu closed');
  }

  /**
   * Get current page
   */
  getCurrentPage() {
    return this.currentPage;
  }

  /**
   * Get navigation history
   */
  getHistory() {
    return [...this.history];
  }

  /**
   * Check if page exists
   */
  isValidPage(page) {
    return this.pages.includes(page);
  }

  /**
   * Get page title
   */
  getPageTitle(page) {
    const titles = {
      theory: 'Lý Thuyết',
      practice: 'Thực Hành',
      review: 'Ôn Tập',
      statistics: 'Thống Kê'
    };
    return titles[page] || page;
  }

  /**
   * Show page programmatically (external API)
   */
  showPageExternal(page) {
    return this.navigateTo(page);
  }

  /**
   * Create breadcrumb navigation
   */
  createBreadcrumb() {
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');

    const ol = document.createElement('ol');
    ol.className = 'breadcrumb-list';

    // Add home link
    const homeItem = this.createBreadcrumbItem('Trang chủ', '#theory', this.currentPage === 'theory');
    ol.appendChild(homeItem);

    // Add current page if not home
    if (this.currentPage !== 'theory') {
      const currentItem = this.createBreadcrumbItem(this.getPageTitle(this.currentPage), null, true);
      ol.appendChild(currentItem);
    }

    breadcrumb.appendChild(ol);
    return breadcrumb;
  }

  /**
   * Create breadcrumb item
   */
  createBreadcrumbItem(text, href, isCurrent) {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';

    if (isCurrent) {
      li.setAttribute('aria-current', 'page');
      li.textContent = text;
      li.className += ' current';
    } else {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = text;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('theory');
      });
      li.appendChild(link);
    }

    return li;
  }

  /**
   * Clean up navigation
   */
  destroy() {
    // Remove event listeners
    this.navButtons.forEach(btn => {
      btn.removeEventListener('click', this.navigateTo);
    });

    this.mobileNavButtons.forEach(btn => {
      btn.removeEventListener('click', this.navigateTo);
    });

    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.removeEventListener('click', this.toggleMobileMenu);
    }

    window.removeEventListener('popstate', this.handlePopState);

    console.log('🗑️ Navigation destroyed');
  }
}