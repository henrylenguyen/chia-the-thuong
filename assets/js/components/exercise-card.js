/**
 * Exercise Card Component
 * Renders exercise selection cards with progress and theory information
 */

export class ExerciseCard {
  constructor() {
    this.animationClasses = [
      'animate-fade-in',
      'animate-slide-up',
      'animate-bounce-in'
    ];
  }

  /**
   * Render exercise card
   */
  render(data) {
    const {
      key,
      exercise,
      progress,
      total,
      progressPercent,
      hasData,
      showTheory = true,
      showProgress = true,
      clickable = true
    } = data;

    const isCompleted = progress >= total && total > 0;
    const colorClass = this.getColorClass(exercise.color);

    return `
          <div class="exercise-card ${colorClass} ${!hasData ? 'no-data' : ''}" 
               data-exercise="${key}"
               ${clickable ? 'role="button" tabindex="0"' : ''}
               aria-label="Bài tập ${exercise.title}">
              
              <!-- Card Header -->
              <div class="exercise-header">
                  <div class="exercise-title-section">
                      <div class="exercise-icon">
                          <i class="${exercise.icon}"></i>
                      </div>
                      <h3 class="exercise-title">${exercise.title}</h3>
                  </div>
                  
                  ${isCompleted ? `
                      <div class="exercise-completed-badge">
                          <i class="fas fa-check-circle"></i>
                      </div>
                  ` : ''}
              </div>

              <!-- Card Description -->
              <div class="exercise-description">
                  ${exercise.description}
              </div>

              <!-- Progress Section -->
              ${showProgress ? `
                  <div class="exercise-progress-section">
                      <div class="exercise-progress-header">
                          <span>Tiến độ</span>
                          <span class="progress-text">${progress}/${total} câu</span>
                      </div>
                      <div class="exercise-progress-bar">
                          <div class="exercise-progress-fill" 
                               style="width: ${progressPercent}%"
                               role="progressbar"
                               aria-valuenow="${progressPercent}"
                               aria-valuemin="0"
                               aria-valuemax="100"
                               aria-label="Hoàn thành ${progressPercent}%">
                          </div>
                      </div>
                  </div>
              ` : ''}

              <!-- Theory Section -->
              ${showTheory && exercise.theory ? `
                  <div class="exercise-theory">
                      ${exercise.theory}
                  </div>
              ` : ''}

              <!-- Data Warning -->
              ${!hasData ? `
                  <div class="exercise-warning">
                      <i class="fas fa-exclamation-triangle"></i>
                      Chưa có dữ liệu cho bài tập này
                  </div>
              ` : ''}

              <!-- Quick Stats -->
              ${hasData ? `
                  <div class="exercise-stats">
                      <div class="stat-item">
                          <span class="stat-label">Câu hỏi:</span>
                          <span class="stat-value">${total}</span>
                      </div>
                      <div class="stat-item">
                          <span class="stat-label">Hoàn thành:</span>
                          <span class="stat-value">${Math.round(progressPercent)}%</span>
                      </div>
                      ${progress > 0 ? `
                          <div class="stat-item">
                              <span class="stat-label">Còn lại:</span>
                              <span class="stat-value">${total - progress}</span>
                          </div>
                      ` : ''}
                  </div>
              ` : ''}

              <!-- Action Buttons -->
              ${clickable && hasData ? `
                  <div class="exercise-actions">
                      <button class="btn btn-primary exercise-start-btn" data-exercise="${key}">
                          <i class="fas fa-play"></i>
                          ${progress > 0 ? 'Tiếp tục' : 'Bắt đầu'}
                      </button>
                      
                      ${progress > 0 ? `
                          <button class="btn btn-secondary exercise-reset-btn" data-exercise="${key}">
                              <i class="fas fa-redo"></i>
                              Làm lại
                          </button>
                      ` : ''}
                  </div>
              ` : ''}

              <!-- Hover Effect Overlay -->
              <div class="card-hover-overlay"></div>
          </div>
      `;
  }

  /**
   * Render compact exercise card (for smaller spaces)
   */
  renderCompact(data) {
    const { key, exercise, progress, total, progressPercent, hasData } = data;
    const isCompleted = progress >= total && total > 0;
    const colorClass = this.getColorClass(exercise.color);

    return `
          <div class="exercise-card exercise-card-compact ${colorClass}" 
               data-exercise="${key}"
               role="button" 
               tabindex="0">
              
              <div class="compact-header">
                  <div class="compact-icon">
                      <i class="${exercise.icon}"></i>
                  </div>
                  <div class="compact-info">
                      <h4 class="compact-title">${exercise.title}</h4>
                      <div class="compact-progress">${progress}/${total}</div>
                  </div>
                  ${isCompleted ? `
                      <div class="compact-badge">
                          <i class="fas fa-check"></i>
                      </div>
                  ` : ''}
              </div>

              <div class="compact-progress-bar">
                  <div class="compact-progress-fill" style="width: ${progressPercent}%"></div>
              </div>
          </div>
      `;
  }

  /**
   * Render exercise card grid
   */
  renderGrid(exercises) {
    return `
          <div class="exercise-grid">
              ${exercises.map(exerciseData => this.render(exerciseData)).join('')}
          </div>
      `;
  }

  /**
   * Get color class for exercise type
   */
  getColorClass(color) {
    const colorMap = {
      blue: 'color-blue',
      green: 'color-green',
      red: 'color-red',
      purple: 'color-purple',
      yellow: 'color-yellow',
      indigo: 'color-indigo',
      orange: 'color-orange',
      cyan: 'color-cyan',
      gray: 'color-gray',
      amber: 'color-amber',
      violet: 'color-violet',
      teal: 'color-teal',
      sky: 'color-sky'
    };

    return colorMap[color] || 'color-blue';
  }

  /**
   * Add hover effects to cards
   */
  addHoverEffects(container) {
    const cards = container.querySelectorAll('.exercise-card');

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.onCardHover(card);
      });

      card.addEventListener('mouseleave', () => {
        this.onCardLeave(card);
      });

      card.addEventListener('focus', () => {
        this.onCardFocus(card);
      });

      card.addEventListener('blur', () => {
        this.onCardBlur(card);
      });
    });
  }

  /**
   * Handle card hover
   */
  onCardHover(card) {
    // Add hover class
    card.classList.add('card-hover');

    // Animate progress bar
    const progressFill = card.querySelector('.exercise-progress-fill');
    if (progressFill) {
      progressFill.style.animationName = 'progressPulse';
      progressFill.style.animationDuration = '2s';
      progressFill.style.animationIterationCount = 'infinite';
    }

    // Scale icon
    const icon = card.querySelector('.exercise-icon i');
    if (icon) {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
    }
  }

  /**
   * Handle card leave
   */
  onCardLeave(card) {
    // Remove hover class
    card.classList.remove('card-hover');

    // Reset progress bar animation
    const progressFill = card.querySelector('.exercise-progress-fill');
    if (progressFill) {
      progressFill.style.animationName = '';
    }

    // Reset icon
    const icon = card.querySelector('.exercise-icon i');
    if (icon) {
      icon.style.transform = '';
    }
  }

  /**
   * Handle card focus (for accessibility)
   */
  onCardFocus(card) {
    card.classList.add('card-focus');
  }

  /**
   * Handle card blur
   */
  onCardBlur(card) {
    card.classList.remove('card-focus');
  }

  /**
   * Setup event listeners for exercise cards
   */
  setupEventListeners(container) {
    // Card click events
    container.addEventListener('click', (e) => {
      const card = e.target.closest('.exercise-card');
      if (card && !card.classList.contains('no-data')) {
        const exerciseKey = card.dataset.exercise;
        this.handleCardClick(exerciseKey, card);
      }
    });

    // Keyboard events
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.exercise-card');
        if (card && !card.classList.contains('no-data')) {
          e.preventDefault();
          const exerciseKey = card.dataset.exercise;
          this.handleCardClick(exerciseKey, card);
        }
      }
    });

    // Button events
    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('exercise-start-btn')) {
        e.stopPropagation();
        const exerciseKey = e.target.dataset.exercise;
        this.handleStartClick(exerciseKey);
      }

      if (e.target.classList.contains('exercise-reset-btn')) {
        e.stopPropagation();
        const exerciseKey = e.target.dataset.exercise;
        this.handleResetClick(exerciseKey);
      }
    });

    // Add hover effects
    this.addHoverEffects(container);
  }

  /**
   * Handle card click
   */
  handleCardClick(exerciseKey, cardElement) {
    // Add click animation
    this.addClickAnimation(cardElement);

    // Dispatch event
    document.dispatchEvent(new CustomEvent('exercise:select', {
      detail: { exerciseKey, cardElement }
    }));
  }

  /**
   * Handle start button click
   */
  handleStartClick(exerciseKey) {
    document.dispatchEvent(new CustomEvent('exercise:start', {
      detail: { exerciseKey }
    }));
  }

  /**
   * Handle reset button click
   */
  handleResetClick(exerciseKey) {
    if (confirm('Bạn có chắc muốn làm lại bài tập này? Tiến độ hiện tại sẽ bị xóa.')) {
      document.dispatchEvent(new CustomEvent('exercise:reset', {
        detail: { exerciseKey }
      }));
    }
  }

  /**
   * Add click animation to card
   */
  addClickAnimation(card) {
    card.classList.add('card-click');

    setTimeout(() => {
      card.classList.remove('card-click');
    }, 200);
  }

  /**
   * Update card progress
   */
  updateProgress(cardElement, progress, total) {
    const progressPercent = total > 0 ? (progress / total) * 100 : 0;

    // Update progress text
    const progressText = cardElement.querySelector('.progress-text');
    if (progressText) {
      progressText.textContent = `${progress}/${total} câu`;
    }

    // Update progress bar
    const progressFill = cardElement.querySelector('.exercise-progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progressPercent}%`;
      progressFill.setAttribute('aria-valuenow', progressPercent);
    }

    // Update completion status
    const isCompleted = progress >= total && total > 0;
    if (isCompleted && !cardElement.querySelector('.exercise-completed-badge')) {
      const header = cardElement.querySelector('.exercise-header');
      if (header) {
        const badge = document.createElement('div');
        badge.className = 'exercise-completed-badge';
        badge.innerHTML = '<i class="fas fa-check-circle"></i>';
        header.appendChild(badge);
      }
    }

    // Update button text
    const startBtn = cardElement.querySelector('.exercise-start-btn');
    if (startBtn) {
      startBtn.innerHTML = `
              <i class="fas fa-play"></i>
              ${progress > 0 ? 'Tiếp tục' : 'Bắt đầu'}
          `;
    }
  }

  /**
   * Show loading state
   */
  showLoading(cardElement) {
    cardElement.classList.add('card-loading');

    const actions = cardElement.querySelector('.exercise-actions');
    if (actions) {
      actions.innerHTML = `
              <div class="loading-spinner">
                  <i class="fas fa-spinner fa-spin"></i>
                  Đang tải...
              </div>
          `;
    }
  }

  /**
   * Hide loading state
   */
  hideLoading(cardElement) {
    cardElement.classList.remove('card-loading');
  }

  /**
   * Show error state
   */
  showError(cardElement, message) {
    cardElement.classList.add('card-error');

    const warning = cardElement.querySelector('.exercise-warning') ||
      this.createWarningElement();

    warning.innerHTML = `
          <i class="fas fa-exclamation-triangle"></i>
          ${message}
      `;

    if (!cardElement.contains(warning)) {
      cardElement.appendChild(warning);
    }
  }

  /**
   * Create warning element
   */
  createWarningElement() {
    const warning = document.createElement('div');
    warning.className = 'exercise-warning';
    return warning;
  }

  /**
   * Filter cards by search query
   */
  filterCards(container, query) {
    const cards = container.querySelectorAll('.exercise-card');
    const normalizedQuery = query.toLowerCase().trim();

    cards.forEach(card => {
      const title = card.querySelector('.exercise-title')?.textContent?.toLowerCase() || '';
      const description = card.querySelector('.exercise-description')?.textContent?.toLowerCase() || '';

      const matches = !normalizedQuery ||
        title.includes(normalizedQuery) ||
        description.includes(normalizedQuery);

      card.style.display = matches ? '' : 'none';

      if (matches && normalizedQuery) {
        this.highlightSearchTerms(card, normalizedQuery);
      } else {
        this.removeHighlights(card);
      }
    });
  }

  /**
   * Highlight search terms in card
   */
  highlightSearchTerms(card, query) {
    const elements = card.querySelectorAll('.exercise-title, .exercise-description');

    elements.forEach(element => {
      const text = element.textContent;
      const highlightedText = text.replace(
        new RegExp(`(${query})`, 'gi'),
        '<mark>$1</mark>'
      );
      element.innerHTML = highlightedText;
    });
  }

  /**
   * Remove search highlights
   */
  removeHighlights(card) {
    const marks = card.querySelectorAll('mark');
    marks.forEach(mark => {
      mark.outerHTML = mark.textContent;
    });
  }

  /**
   * Sort cards by criteria
   */
  sortCards(container, criteria = 'name') {
    const cards = Array.from(container.querySelectorAll('.exercise-card'));

    cards.sort((a, b) => {
      switch (criteria) {
        case 'name':
          return this.getCardTitle(a).localeCompare(this.getCardTitle(b));

        case 'progress':
          return this.getCardProgress(b) - this.getCardProgress(a);

        case 'completion':
          const aCompleted = this.isCardCompleted(a);
          const bCompleted = this.isCardCompleted(b);
          if (aCompleted !== bCompleted) {
            return bCompleted - aCompleted;
          }
          return this.getCardTitle(a).localeCompare(this.getCardTitle(b));

        default:
          return 0;
      }
    });

    // Re-append sorted cards
    cards.forEach(card => container.appendChild(card));
  }

  /**
   * Get card title
   */
  getCardTitle(card) {
    return card.querySelector('.exercise-title')?.textContent || '';
  }

  /**
   * Get card progress percentage
   */
  getCardProgress(card) {
    const progressFill = card.querySelector('.exercise-progress-fill');
    if (!progressFill) return 0;

    const width = progressFill.style.width || '0%';
    return parseFloat(width.replace('%', ''));
  }

  /**
   * Check if card is completed
   */
  isCardCompleted(card) {
    return !!card.querySelector('.exercise-completed-badge');
  }
}