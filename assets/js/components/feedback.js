/**
 * Feedback Component
 * Renders feedback messages for quiz answers with Tailwind CSS
 */

export class Feedback {
  constructor() {
    this.feedbackTypes = {
      correct: {
        icon: 'fas fa-check-circle',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-700',
        textColor: 'text-green-700 dark:text-green-300',
        iconColor: 'text-green-500'
      },
      incorrect: {
        icon: 'fas fa-times-circle',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-700',
        textColor: 'text-red-700 dark:text-red-300',
        iconColor: 'text-red-500'
      },
      hint: {
        icon: 'fas fa-lightbulb',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-700',
        textColor: 'text-yellow-700 dark:text-yellow-300',
        iconColor: 'text-yellow-500'
      },
      info: {
        icon: 'fas fa-info-circle',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-700',
        textColor: 'text-blue-700 dark:text-blue-300',
        iconColor: 'text-blue-500'
      },
      warning: {
        icon: 'fas fa-exclamation-triangle',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-700',
        textColor: 'text-orange-700 dark:text-orange-300',
        iconColor: 'text-orange-500'
      }
    };
  }

  /**
   * Render feedback for quiz answer
   */
  render(data) {
    const {
      isCorrect,
      correctAnswer,
      userAnswer,
      explanation,
      showUserAnswer = true,
      animated = true
    } = data;

    const type = isCorrect ? 'correct' : 'incorrect';
    const config = this.feedbackTypes[type];
    const animationClass = animated ? 'animate-in slide-in-from-bottom-2 duration-300' : '';

    return `
          <div class="feedback-container ${animationClass}">
              <div class="${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-xl p-4 ${animationClass}">
                  <div class="flex items-start gap-3">
                      <div class="flex-shrink-0 mt-0.5">
                          <i class="${config.icon} ${config.iconColor} text-lg"></i>
                      </div>
                      
                      <div class="flex-1 min-w-0">
                          <div class="font-semibold mb-2">
                              ${isCorrect ? 'Chính xác!' : 'Chưa đúng!'}
                          </div>
                          
                          <div class="space-y-2">
                              <div class="flex items-center gap-2">
                                  <span class="text-sm font-medium">Đáp án đúng:</span>
                                  <span class="font-bold font-japanese text-base bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                                      ${this.escapeHtml(correctAnswer)}
                                  </span>
                              </div>
                              
                              ${showUserAnswer && !isCorrect ? `
                                  <div class="flex items-center gap-2">
                                      <span class="text-sm font-medium">Bạn đã nhập:</span>
                                      <span class="font-japanese text-base bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-dashed">
                                          "${this.escapeHtml(userAnswer)}"
                                      </span>
                                  </div>
                              ` : ''}
                              
                              ${explanation ? `
                                  <div class="mt-3 pt-3 border-t ${config.borderColor} border-opacity-50">
                                      <div class="text-sm font-medium mb-1">Giải thích:</div>
                                      <div class="text-sm opacity-90 leading-relaxed">
                                          ${this.escapeHtml(explanation)}
                                      </div>
                                  </div>
                              ` : ''}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      `;
  }

  /**
   * Render hint feedback
   */
  renderHint(hintText, options = {}) {
    const { title = 'Gợi ý', animated = true } = options;
    const config = this.feedbackTypes.hint;
    const animationClass = animated ? 'animate-in slide-in-from-bottom-2 duration-300' : '';

    return `
          <div class="feedback-container ${animationClass}">
              <div class="${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-xl p-4">
                  <div class="flex items-start gap-3">
                      <div class="flex-shrink-0 mt-0.5">
                          <i class="${config.icon} ${config.iconColor} text-lg"></i>
                      </div>
                      
                      <div class="flex-1 min-w-0">
                          <div class="font-semibold mb-2">${title}</div>
                          <div class="text-sm leading-relaxed">
                              ${this.escapeHtml(hintText)}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      `;
  }

  /**
   * Render notification banner
   */
  renderNotification(message, type = 'info', options = {}) {
    const {
      title,
      actions = [],
      dismissible = true,
      autoHide = false,
      duration = 5000,
      position = 'top'
    } = options;

    const config = this.feedbackTypes[type] || this.feedbackTypes.info;
    const positionClasses = {
      top: 'top-4',
      bottom: 'bottom-4',
      center: 'top-1/2 -translate-y-1/2'
    };

    const notificationId = `notification-${Date.now()}`;

    const html = `
          <div id="${notificationId}" 
               class="fixed ${positionClasses[position]} right-4 z-50 max-w-md w-full transform transition-all duration-300 ease-out animate-in slide-in-from-right-full">
              <div class="${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-lg shadow-lg p-4">
                  <div class="flex items-start gap-3">
                      <div class="flex-shrink-0 mt-0.5">
                          <i class="${config.icon} ${config.iconColor} text-lg"></i>
                      </div>
                      
                      <div class="flex-1 min-w-0">
                          ${title ? `
                              <div class="font-semibold mb-1">${this.escapeHtml(title)}</div>
                          ` : ''}
                          <div class="text-sm leading-relaxed">
                              ${this.escapeHtml(message)}
                          </div>
                          
                          ${actions.length > 0 ? `
                              <div class="flex gap-2 mt-3">
                                  ${actions.map(action => `
                                      <button class="px-3 py-1 text-xs font-medium rounded border hover:bg-opacity-20 transition-colors"
                                              onclick="${action.onclick}">
                                          ${action.label}
                                      </button>
                                  `).join('')}
                              </div>
                          ` : ''}
                      </div>
                      
                      ${dismissible ? `
                          <button class="flex-shrink-0 p-1 hover:bg-opacity-20 rounded transition-colors"
                                  onclick="this.closest('[id^=notification-]').remove()">
                              <i class="fas fa-times text-sm opacity-60"></i>
                          </button>
                      ` : ''}
                  </div>
              </div>
          </div>
      `;

    // Auto-hide if specified
    if (autoHide) {
      setTimeout(() => {
        const element = document.getElementById(notificationId);
        if (element) {
          element.classList.add('animate-out', 'slide-out-to-right-full');
          setTimeout(() => element.remove(), 300);
        }
      }, duration);
    }

    return html;
  }

  /**
   * Render achievement notification
   */
  renderAchievement(achievement, options = {}) {
    const { animated = true, autoHide = true } = options;
    const animationClass = animated ? 'animate-in zoom-in-50 duration-500' : '';

    return `
          <div class="achievement-notification fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ${animationClass}">
              <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl shadow-2xl p-6 max-w-sm mx-auto text-center border-4 border-yellow-300">
                  <div class="text-4xl mb-3">🏆</div>
                  <div class="text-xl font-bold mb-2">Thành Tựu Mới!</div>
                  <div class="text-lg font-semibold mb-3">${achievement.name}</div>
                  <div class="text-sm opacity-90">${achievement.description}</div>
                  
                  <button class="mt-4 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm font-medium transition-colors"
                          onclick="this.closest('.achievement-notification').remove()">
                      <i class="fas fa-check mr-2"></i>Tuyệt vời!
                  </button>
              </div>
          </div>
      `;
  }

  /**
   * Render loading feedback
   */
  renderLoading(message = 'Đang xử lý...', options = {}) {
    const { showSpinner = true, size = 'medium' } = options;
    const config = this.feedbackTypes.info;

    const spinnerSizes = {
      small: 'w-4 h-4',
      medium: 'w-5 h-5',
      large: 'w-6 h-6'
    };

    return `
          <div class="feedback-container">
              <div class="${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-xl p-4">
                  <div class="flex items-center justify-center gap-3">
                      ${showSpinner ? `
                          <div class="${spinnerSizes[size]} animate-spin">
                              <svg class="w-full h-full" viewBox="0 0 24 24" fill="none">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="32" stroke-dashoffset="32">
                                      <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                                  </circle>
                              </svg>
                          </div>
                      ` : ''}
                      <span class="text-sm font-medium">${this.escapeHtml(message)}</span>
                  </div>
              </div>
          </div>
      `;
  }

  /**
   * Render progress feedback
   */
  renderProgress(current, total, options = {}) {
    const { showPercentage = true, message, color = 'blue' } = options;
    const percentage = (current / total) * 100;

    return `
          <div class="feedback-container">
              <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div class="space-y-3">
                      ${message ? `
                          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
                              ${this.escapeHtml(message)}
                          </div>
                      ` : ''}
                      
                      <div class="flex items-center gap-3">
                          <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div class="bg-${color}-500 h-2 rounded-full transition-all duration-300" 
                                   style="width: ${percentage}%"></div>
                          </div>
                          
                          ${showPercentage ? `
                              <span class="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[3rem] text-right">
                                  ${Math.round(percentage)}%
                              </span>
                          ` : ''}
                      </div>
                      
                      <div class="text-xs text-gray-500 dark:text-gray-500 text-center">
                          ${current} / ${total} hoàn thành
                      </div>
                  </div>
              </div>
          </div>
      `;
  }

  /**
   * Show notification in DOM
   */
  showNotification(message, type = 'info', options = {}) {
    const html = this.renderNotification(message, type, options);
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const notification = temp.firstElementChild;

    document.body.appendChild(notification);

    return notification;
  }

  /**
   * Show achievement in DOM
   */
  showAchievement(achievement, options = {}) {
    const html = this.renderAchievement(achievement, options);
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const achievementEl = temp.firstElementChild;

    document.body.appendChild(achievementEl);

    // Auto remove after 5 seconds
    if (options.autoHide !== false) {
      setTimeout(() => {
        if (achievementEl.parentNode) {
          achievementEl.classList.add('animate-out', 'zoom-out-50');
          setTimeout(() => achievementEl.remove(), 300);
        }
      }, 5000);
    }

    return achievementEl;
  }

  /**
   * Render inline feedback
   */
  renderInline(message, type = 'info', options = {}) {
    const { size = 'small', icon = true } = options;
    const config = this.feedbackTypes[type] || this.feedbackTypes.info;

    const sizeClasses = {
      small: 'text-xs px-2 py-1',
      medium: 'text-sm px-3 py-2',
      large: 'text-base px-4 py-3'
    };

    return `
          <div class="inline-flex items-center gap-2 ${config.bgColor} ${config.textColor} rounded-lg ${sizeClasses[size]}">
              ${icon ? `<i class="${config.icon} ${config.iconColor}"></i>` : ''}
              <span class="font-medium">${this.escapeHtml(message)}</span>
          </div>
      `;
  }

  /**
   * Render tooltip feedback
   */
  renderTooltip(message, options = {}) {
    const { position = 'top', maxWidth = '200px' } = options;

    const positions = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2',
      right: 'left-full ml-2'
    };

    return `
          <div class="absolute ${positions[position]} left-1/2 -translate-x-1/2 z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-normal"
               style="max-width: ${maxWidth}">
              ${this.escapeHtml(message)}
              <div class="absolute w-2 h-2 bg-gray-900 rotate-45 ${position === 'top' ? 'top-full -mt-1' : 'bottom-full -mb-1'} left-1/2 -translate-x-1/2"></div>
          </div>
      `;
  }

  /**
   * Remove all notifications
   */
  clearNotifications() {
    const notifications = document.querySelectorAll('[id^="notification-"]');
    notifications.forEach(notification => {
      notification.classList.add('animate-out', 'slide-out-to-right-full');
      setTimeout(() => notification.remove(), 300);
    });
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Create feedback with custom styling
   */
  renderCustom(content, options = {}) {
    const {
      bgColor = 'bg-white dark:bg-gray-800',
      borderColor = 'border-gray-200 dark:border-gray-700',
      textColor = 'text-gray-700 dark:text-gray-300',
      rounded = 'rounded-xl',
      padding = 'p-4',
      shadow = 'shadow-sm',
      className = ''
    } = options;

    return `
          <div class="feedback-container">
              <div class="${bgColor} ${borderColor} ${textColor} border ${rounded} ${padding} ${shadow} ${className}">
                  ${content}
              </div>
          </div>
      `;
  }
}