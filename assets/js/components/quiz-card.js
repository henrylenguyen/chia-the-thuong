/**
 * Quiz Card Component
 * Renders individual quiz question cards with interactive elements
 */

export class QuizCard {
  constructor() {
    this.currentCardId = null;
    this.isSubmitted = false;
  }

  /**
   * Render quiz card
   */
  render(data) {
    const {
      question,
      meaning,
      prefix,
      questionNumber,
      totalQuestions,
      showHint = true,
      autoFocus = true
    } = data;

    this.currentCardId = `quiz-card-${Date.now()}`;
    this.isSubmitted = false;

    return `
          <div class="quiz-card" id="${this.currentCardId}">
              <!-- Question Header -->
              <div class="quiz-question-header">
                  <div class="question-number">
                      Câu ${questionNumber}/${totalQuestions}
                  </div>
                  <div class="question-instruction">
                      Chuyển câu sau sang thể thường:
                  </div>
              </div>

              <!-- Question Content -->
              <div class="question-box">
                  <div class="japanese-sentence japanese-text">
                      ${this.escapeHtml(question)}
                  </div>
                  
                  <div class="vietnamese-meaning">
                      ${this.escapeHtml(meaning)}
                  </div>
                  
                  <!-- Answer Section -->
                  <div class="answer-section">
                      <span class="sentence-prefix japanese-text">
                          ${this.escapeHtml(prefix)}
                      </span>
                      
                      <span class="answer-blank">
                          _____
                      </span>
                      
                      <span class="sentence-suffix japanese-text">
                          。
                      </span>
                  </div>
                  
                  <!-- Answer Input -->
                  <div class="answer-input-container">
                      <input 
                          type="text" 
                          class="answer-input japanese-text" 
                          placeholder="Nhập đáp án bằng hiragana..."
                          autocomplete="off"
                          autocorrect="off"
                          autocapitalize="off"
                          spellcheck="false"
                          ${autoFocus ? 'autofocus' : ''}
                      >
                      <div class="input-helper">
                          <span class="input-hint">Enter để kiểm tra</span>
                      </div>
                  </div>
              </div>

              <!-- Feedback Area -->
              <div class="quiz-feedback" id="feedback-${this.currentCardId}">
                  <!-- Feedback will be injected here -->
              </div>

              <!-- Action Buttons -->
              <div class="quiz-actions">
                  <button class="btn btn-secondary quiz-hint-btn" ${!showHint ? 'style="display: none;"' : ''}>
                      <i class="fas fa-lightbulb"></i>
                      Gợi ý
                  </button>
                  
                  <button class="btn btn-primary quiz-submit-btn">
                      <i class="fas fa-check"></i>
                      Kiểm tra
                  </button>
                  
                  <button class="btn btn-success quiz-next-btn" style="display: none;">
                      <i class="fas fa-arrow-right"></i>
                      Tiếp theo
                  </button>
              </div>

              <!-- Secondary Actions -->
              <div class="quiz-actions-secondary">
                  <button class="btn btn-ghost quiz-back-btn">
                      <i class="fas fa-arrow-left"></i>
                      Quay lại
                  </button>
                  
                  <button class="btn btn-ghost quiz-skip-btn">
                      <i class="fas fa-forward"></i>
                      Bỏ qua
                  </button>
              </div>
          </div>
      `;
  }

  /**
   * Setup event listeners for the card
   */
  setupEventListeners() {
    if (!this.currentCardId) return;

    const card = document.getElementById(this.currentCardId);
    if (!card) return;

    const input = card.querySelector('.answer-input');
    const submitBtn = card.querySelector('.quiz-submit-btn');
    const nextBtn = card.querySelector('.quiz-next-btn');
    const hintBtn = card.querySelector('.quiz-hint-btn');
    const skipBtn = card.querySelector('.quiz-skip-btn');
    const backBtn = card.querySelector('.quiz-back-btn');

    // Input events
    if (input) {
      input.addEventListener('keydown', (e) => this.handleInputKeydown(e));
      input.addEventListener('input', (e) => this.handleInputChange(e));
      input.addEventListener('paste', (e) => this.handlePaste(e));
    }

    // Button events
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.handleSubmit());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.handleNext());
    }

    if (hintBtn) {
      hintBtn.addEventListener('click', () => this.handleHint());
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.handleSkip());
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => this.handleBack());
    }
  }

  /**
   * Handle input keydown events
   */
  handleInputKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!this.isSubmitted) {
        this.handleSubmit();
      } else {
        this.handleNext();
      }
    }
  }

  /**
   * Handle input change events
   */
  handleInputChange(e) {
    const input = e.target;
    const value = input.value;

    // Auto-convert to hiragana if needed
    const converted = this.convertToHiragana(value);
    if (converted !== value) {
      input.value = converted;
    }

    // Update submit button state
    this.updateSubmitButton();
  }

  /**
   * Handle paste events
   */
  handlePaste(e) {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const converted = this.convertToHiragana(paste);

    const input = e.target;
    input.value = converted;

    this.updateSubmitButton();
  }

  /**
   * Convert text to hiragana (basic conversion)
   */
  convertToHiragana(text) {
    // Basic katakana to hiragana conversion
    return text
      .replace(/[ァ-ヶ]/g, (match) => {
        const code = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(code);
      })
      .replace(/[A-Za-z]/g, '') // Remove Latin characters
      .trim();
  }

  /**
   * Update submit button state
   */
  updateSubmitButton() {
    if (!this.currentCardId) return;

    const card = document.getElementById(this.currentCardId);
    if (!card) return;

    const input = card.querySelector('.answer-input');
    const submitBtn = card.querySelector('.quiz-submit-btn');

    if (input && submitBtn) {
      const hasValue = input.value.trim().length > 0;
      submitBtn.disabled = !hasValue;
      submitBtn.classList.toggle('disabled', !hasValue);
    }
  }

  /**
   * Handle submit button click
   */
  handleSubmit() {
    if (this.isSubmitted) return;

    const card = document.getElementById(this.currentCardId);
    if (!card) return;

    const input = card.querySelector('.answer-input');
    const answer = input ? input.value.trim() : '';

    if (!answer) {
      input?.focus();
      this.showInputError('Vui lòng nhập đáp án');
      return;
    }

    // Dispatch submit event
    document.dispatchEvent(new CustomEvent('quiz:submit', {
      detail: { answer, cardId: this.currentCardId }
    }));

    this.isSubmitted = true;
  }

  /**
   * Handle next button click
   */
  handleNext() {
    document.dispatchEvent(new CustomEvent('quiz:next', {
      detail: { cardId: this.currentCardId }
    }));
  }

  /**
   * Handle hint button click
   */
  handleHint() {
    document.dispatchEvent(new CustomEvent('quiz:hint', {
      detail: { cardId: this.currentCardId }
    }));
  }

  /**
   * Handle skip button click
   */
  handleSkip() {
    if (confirm('Bạn có chắc muốn bỏ qua câu này?')) {
      document.dispatchEvent(new CustomEvent('quiz:skip', {
        detail: { cardId: this.currentCardId }
      }));
    }
  }

  /**
   * Handle back button click
   */
  handleBack() {
    if (confirm('Bạn có chắc muốn thoát khỏi bài tập?')) {
      document.dispatchEvent(new CustomEvent('quiz:close', {
        detail: { cardId: this.currentCardId }
      }));
    }
  }

  /**
   * Show input error message
   */
  showInputError(message) {
    const card = document.getElementById(this.currentCardId);
    if (!card) return;

    const container = card.querySelector('.answer-input-container');
    if (!container) return;

    // Remove existing error
    const existingError = container.querySelector('.input-error');
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.textContent = message;
    container.appendChild(errorDiv);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 3000);
  }

  /**
   * Update card state after answer submission
   */
  updateAfterSubmit(isCorrect) {
    const card = document.getElementById(this.currentCardId);
    if (!card) return;

    const input = card.querySelector('.answer-input');
    const submitBtn = card.querySelector('.quiz-submit-btn');
    const nextBtn = card.querySelector('.quiz-next-btn');
    const hintBtn = card.querySelector('.quiz-hint-btn');
    const skipBtn = card.querySelector('.quiz-skip-btn');

    // Disable input
    if (input) {
      input.disabled = true;
      input.classList.add(isCorrect ? 'correct' : 'incorrect');
    }

    // Update buttons
    if (submitBtn) {
      submitBtn.style.display = 'none';
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.focus();
    }

    if (hintBtn) {
      hintBtn.style.display = 'none';
    }

    if (skipBtn) {
      skipBtn.style.display = 'none';
    }

    // Add visual feedback to card
    card.classList.add(isCorrect ? 'answer-correct' : 'answer-incorrect');
  }

  /**
   * Show hint in the card
   */
  showHint(hintText) {
    const card = document.getElementById(this.currentCardId);
    if (!card) return;

    const feedbackArea = card.querySelector('.quiz-feedback');
    if (!feedbackArea) return;

    feedbackArea.innerHTML = `
          <div class="feedback-hint">
              <div class="feedback-icon">
                  <i class="fas fa-lightbulb"></i>
              </div>
              <div class="feedback-content">
                  <div class="feedback-title">Gợi ý:</div>
                  <div class="feedback-text">${this.escapeHtml(hintText)}</div>
              </div>
          </div>
      `;

    feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Get current answer from input
   */
  getCurrentAnswer() {
    const card = document.getElementById(this.currentCardId);
    if (!card) return '';

    const input = card.querySelector('.answer-input');
    return input ? input.value.trim() : '';
  }

  /**
   * Reset card state
   */
  reset() {
    const card = document.getElementById(this.currentCardId);
    if (!card) return;

    const input = card.querySelector('.answer-input');
    const submitBtn = card.querySelector('.quiz-submit-btn');
    const nextBtn = card.querySelector('.quiz-next-btn');
    const hintBtn = card.querySelector('.quiz-hint-btn');
    const skipBtn = card.querySelector('.quiz-skip-btn');
    const feedbackArea = card.querySelector('.quiz-feedback');

    // Reset input
    if (input) {
      input.disabled = false;
      input.value = '';
      input.classList.remove('correct', 'incorrect');
    }

    // Reset buttons
    if (submitBtn) {
      submitBtn.style.display = 'inline-flex';
      submitBtn.disabled = true;
    }

    if (nextBtn) {
      nextBtn.style.display = 'none';
    }

    if (hintBtn) {
      hintBtn.style.display = 'inline-flex';
    }

    if (skipBtn) {
      skipBtn.style.display = 'inline-flex';
    }

    // Clear feedback
    if (feedbackArea) {
      feedbackArea.innerHTML = '';
    }

    // Reset card classes
    card.classList.remove('answer-correct', 'answer-incorrect');

    this.isSubmitted = false;
  }

  /**
   * Focus input
   */
  focusInput() {
    const card = document.getElementById(this.currentCardId);
    if (!card) return;

    const input = card.querySelector('.answer-input');
    if (input && !input.disabled) {
      input.focus();
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Destroy card and clean up
   */
  destroy() {
    this.currentCardId = null;
    this.isSubmitted = false;
  }
}