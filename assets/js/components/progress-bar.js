/**
 * Progress Bar Component
 * Reusable progress bar with animations and customization options
 */

export class ProgressBar {
  constructor() {
    this.defaultOptions = {
      animated: true,
      showPercentage: true,
      showLabel: false,
      color: 'primary',
      size: 'medium',
      rounded: true,
      striped: false,
      pulse: false
    };
  }

  /**
   * Render progress bar
   */
  render(value, options = {}) {
    const opts = { ...this.defaultOptions, ...options };
    const percentage = Math.max(0, Math.min(100, value));

    const {
      animated,
      showPercentage,
      showLabel,
      color,
      size,
      rounded,
      striped,
      pulse,
      label,
      className,
      id
    } = opts;

    const classes = [
      'progress-bar-container',
      `progress-${size}`,
      `progress-${color}`,
      rounded ? 'progress-rounded' : '',
      animated ? 'progress-animated' : '',
      striped ? 'progress-striped' : '',
      pulse ? 'progress-pulse' : '',
      className || ''
    ].filter(Boolean).join(' ');

    return `
          <div class="${classes}" ${id ? `id="${id}"` : ''}>
              ${showLabel && label ? `
                  <div class="progress-label">
                      <span class="progress-label-text">${label}</span>
                      ${showPercentage ? `
                          <span class="progress-percentage">${Math.round(percentage)}%</span>
                      ` : ''}
                  </div>
              ` : ''}
              
              <div class="progress-track" role="progressbar" 
                   aria-valuenow="${percentage}" 
                   aria-valuemin="0" 
                   aria-valuemax="100"
                   aria-label="${label || `Progress ${Math.round(percentage)}%`}">
                  
                  <div class="progress-fill" 
                       style="width: ${percentage}%"
                       data-value="${percentage}">
                      
                      ${animated ? `
                          <div class="progress-shine"></div>
                      ` : ''}
                      
                      ${showPercentage && !showLabel ? `
                          <span class="progress-text">${Math.round(percentage)}%</span>
                      ` : ''}
                  </div>
              </div>
          </div>
      `;
  }

  /**
   * Render circular progress bar
   */
  renderCircular(value, options = {}) {
    const opts = {
      size: 120,
      strokeWidth: 8,
      showPercentage: true,
      color: 'primary',
      ...options
    };

    const { size, strokeWidth, showPercentage, color, label, className } = opts;
    const percentage = Math.max(0, Math.min(100, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return `
          <div class="circular-progress ${className || ''}" style="width: ${size}px; height: ${size}px;">
              <svg width="${size}" height="${size}" class="circular-progress-svg">
                  <!-- Background circle -->
                  <circle
                      cx="${size / 2}"
                      cy="${size / 2}"
                      r="${radius}"
                      stroke="currentColor"
                      stroke-width="${strokeWidth}"
                      fill="none"
                      class="circular-progress-bg"
                  />
                  
                  <!-- Progress circle -->
                  <circle
                      cx="${size / 2}"
                      cy="${size / 2}"
                      r="${radius}"
                      stroke="currentColor"
                      stroke-width="${strokeWidth}"
                      fill="none"
                      class="circular-progress-fill circular-progress-${color}"
                      style="
                          stroke-dasharray: ${circumference};
                          stroke-dashoffset: ${offset};
                          transform: rotate(-90deg);
                          transform-origin: ${size / 2}px ${size / 2}px;
                      "
                  />
              </svg>
              
              <div class="circular-progress-content">
                  ${showPercentage ? `
                      <span class="circular-progress-percentage">${Math.round(percentage)}%</span>
                  ` : ''}
                  ${label ? `
                      <span class="circular-progress-label">${label}</span>
                  ` : ''}
              </div>
          </div>
      `;
  }

  /**
   * Render multi-step progress bar
   */
  renderSteps(currentStep, totalSteps, options = {}) {
    const opts = {
      showLabels: true,
      color: 'primary',
      size: 'medium',
      ...options
    };

    const { showLabels, color, size, steps, className } = opts;

    return `
          <div class="progress-steps ${className || ''} progress-${size}">
              ${Array.from({ length: totalSteps }, (_, index) => {
      const stepNumber = index + 1;
      const isCompleted = stepNumber < currentStep;
      const isCurrent = stepNumber === currentStep;
      const stepLabel = steps && steps[index] ? steps[index] : `Bước ${stepNumber}`;

      return `
                      <div class="progress-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
                          <div class="step-indicator progress-${color}">
                              ${isCompleted ? '<i class="fas fa-check"></i>' : stepNumber}
                          </div>
                          ${showLabels ? `
                              <div class="step-label">${stepLabel}</div>
                          ` : ''}
                          ${stepNumber < totalSteps ? '<div class="step-connector"></div>' : ''}
                      </div>
                  `;
    }).join('')}
          </div>
      `;
  }

  /**
   * Render skill/level progress bar
   */
  renderSkill(name, value, maxValue = 100, options = {}) {
    const opts = {
      showValue: true,
      color: 'primary',
      ...options
    };

    const percentage = (value / maxValue) * 100;
    const { showValue, color, icon } = opts;

    return `
          <div class="skill-progress">
              <div class="skill-header">
                  <div class="skill-name">
                      ${icon ? `<i class="${icon}"></i>` : ''}
                      ${name}
                  </div>
                  ${showValue ? `
                      <div class="skill-value">${value}/${maxValue}</div>
                  ` : ''}
              </div>
              <div class="skill-bar">
                  <div class="skill-fill progress-${color}" 
                       style="width: ${percentage}%"
                       data-value="${value}">
                  </div>
              </div>
          </div>
      `;
  }

  /**
   * Update existing progress bar
   */
  update(element, newValue, options = {}) {
    if (!element) return;

    const { animated = true, duration = 300 } = options;
    const percentage = Math.max(0, Math.min(100, newValue));

    const fill = element.querySelector('.progress-fill, .skill-fill');
    const text = element.querySelector('.progress-text, .progress-percentage');
    const track = element.querySelector('.progress-track');

    if (fill) {
      if (animated) {
        // Animate the progress change
        fill.style.transition = `width ${duration}ms ease-out`;
        setTimeout(() => {
          fill.style.width = `${percentage}%`;
          fill.setAttribute('data-value', percentage);
        }, 10);
      } else {
        fill.style.width = `${percentage}%`;
        fill.setAttribute('data-value', percentage);
      }
    }

    if (text) {
      text.textContent = `${Math.round(percentage)}%`;
    }

    if (track) {
      track.setAttribute('aria-valuenow', percentage);
    }

    // Trigger completion animation if at 100%
    if (percentage >= 100) {
      this.triggerCompletionAnimation(element);
    }
  }

  /**
   * Update circular progress bar
   */
  updateCircular(element, newValue, options = {}) {
    if (!element) return;

    const { animated = true, duration = 500 } = options;
    const percentage = Math.max(0, Math.min(100, newValue));

    const progressCircle = element.querySelector('.circular-progress-fill');
    const percentageText = element.querySelector('.circular-progress-percentage');

    if (!progressCircle) return;

    // Calculate new offset
    const circumference = parseFloat(progressCircle.style.strokeDasharray || 0);
    const offset = circumference - (percentage / 100) * circumference;

    if (animated) {
      progressCircle.style.transition = `stroke-dashoffset ${duration}ms ease-out`;
    }

    progressCircle.style.strokeDashoffset = offset;

    if (percentageText) {
      // Animate number counting
      this.animateNumber(percentageText, newValue);
    }
  }

  /**
   * Animate number counting
   */
  animateNumber(element, targetValue, duration = 500) {
    const startValue = parseFloat(element.textContent) || 0;
    const increment = (targetValue - startValue) / (duration / 16); // 60 FPS
    let currentValue = startValue;

    const timer = setInterval(() => {
      currentValue += increment;

      if ((increment > 0 && currentValue >= targetValue) ||
        (increment < 0 && currentValue <= targetValue)) {
        currentValue = targetValue;
        clearInterval(timer);
      }

      element.textContent = `${Math.round(currentValue)}%`;
    }, 16);
  }

  /**
   * Trigger completion animation
   */
  triggerCompletionAnimation(element) {
    element.classList.add('progress-complete');

    // Add celebration effect
    const celebration = document.createElement('div');
    celebration.className = 'progress-celebration';
    celebration.innerHTML = '🎉';
    element.appendChild(celebration);

    setTimeout(() => {
      celebration.remove();
    }, 2000);
  }

  /**
   * Set progress bar color theme
   */
  setColor(element, color) {
    const fill = element.querySelector('.progress-fill, .skill-fill, .circular-progress-fill');
    if (fill) {
      // Remove existing color classes
      fill.className = fill.className.replace(/progress-\w+/g, '');
      fill.classList.add(`progress-${color}`);
    }
  }

  /**
   * Add pulse animation
   */
  addPulse(element) {
    element.classList.add('progress-pulse');
  }

  /**
   * Remove pulse animation
   */
  removePulse(element) {
    element.classList.remove('progress-pulse');
  }

  /**
   * Create loading skeleton
   */
  renderSkeleton(options = {}) {
    const { count = 1, showLabel = false } = options;

    return Array.from({ length: count }, (_, index) => `
          <div class="progress-skeleton" key="${index}">
              ${showLabel ? '<div class="skeleton-label"></div>' : ''}
              <div class="skeleton-bar"></div>
          </div>
      `).join('');
  }

  /**
   * Get progress value from element
   */
  getValue(element) {
    const fill = element.querySelector('.progress-fill, .skill-fill');
    if (!fill) return 0;

    const dataValue = fill.getAttribute('data-value');
    if (dataValue) return parseFloat(dataValue);

    const width = fill.style.width || '0%';
    return parseFloat(width.replace('%', ''));
  }

  /**
   * Create multiple progress bars for comparison
   */
  renderComparison(data, options = {}) {
    const { showLabels = true, showValues = true, color = 'primary' } = options;
    const maxValue = Math.max(...data.map(item => item.value));

    return `
          <div class="progress-comparison">
              ${data.map(item => {
      const percentage = (item.value / maxValue) * 100;
      return `
                      <div class="comparison-item">
                          ${showLabels ? `
                              <div class="comparison-label">
                                  ${item.icon ? `<i class="${item.icon}"></i>` : ''}
                                  ${item.label}
                              </div>
                          ` : ''}
                          <div class="comparison-bar">
                              <div class="comparison-fill progress-${item.color || color}" 
                                   style="width: ${percentage}%"></div>
                          </div>
                          ${showValues ? `
                              <div class="comparison-value">${item.value}</div>
                          ` : ''}
                      </div>
                  `;
    }).join('')}
          </div>
      `;
  }

  /**
   * Create interactive progress bar
   */
  renderInteractive(value, options = {}) {
    const { min = 0, max = 100, step = 1, disabled = false } = options;
    const percentage = ((value - min) / (max - min)) * 100;

    return `
          <div class="progress-interactive ${disabled ? 'disabled' : ''}">
              <input type="range" 
                     class="progress-slider"
                     min="${min}" 
                     max="${max}" 
                     step="${step}"
                     value="${value}"
                     ${disabled ? 'disabled' : ''}>
              <div class="progress-track-interactive">
                  <div class="progress-fill-interactive" style="width: ${percentage}%"></div>
              </div>
              <div class="progress-value-display">${value}</div>
          </div>
      `;
  }

  /**
   * Setup interactive progress bar events
   */
  setupInteractive(element, callback) {
    const slider = element.querySelector('.progress-slider');
    const fill = element.querySelector('.progress-fill-interactive');
    const display = element.querySelector('.progress-value-display');

    if (slider && fill && display) {
      slider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        const min = parseFloat(e.target.min);
        const max = parseFloat(e.target.max);
        const percentage = ((value - min) / (max - min)) * 100;

        fill.style.width = `${percentage}%`;
        display.textContent = value;

        if (callback) {
          callback(value);
        }
      });
    }
  }
}