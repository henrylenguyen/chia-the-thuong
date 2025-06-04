/**
 * Quiz UI Manager
 * Handles all quiz-related UI interactions and updates
 */

export class QuizUI {
  constructor() {
    this.currentQuestion = null;
    this.currentAnswer = null;
    this.isAnswerChecked = false;
  }

  /**
   * Display a question in the quiz interface
   * @param {Object} question - Question object
   * @param {Object} answer - Answer object
   * @param {number} currentIndex - Current question index
   * @param {number} totalQuestions - Total number of questions
   */
  displayQuestion(question, answer, currentIndex, totalQuestions) {
    this.currentQuestion = question;
    this.currentAnswer = answer;
    this.isAnswerChecked = false;

    // Update question content
    this.updateQuestionContent(question, currentIndex, totalQuestions);
    
    // Reset UI state
    this.resetQuestionUI();
    
    // Focus on input
    this.focusAnswerInput();
  }

  /**
   * Update question content in the UI
   * @param {Object} question - Question object
   * @param {number} currentIndex - Current question index
   * @param {number} totalQuestions - Total number of questions
   */
  updateQuestionContent(question, currentIndex, totalQuestions) {
    // Update question text
    const questionElement = document.getElementById('question-text');
    if (questionElement) {
      questionElement.innerHTML = this.formatQuestionText(question);
    }

    // Update meaning
    const meaningElement = document.getElementById('question-meaning');
    if (meaningElement) {
      meaningElement.textContent = question.meaning || '';
    }

    // Update progress
    const progressElement = document.getElementById('question-progress');
    if (progressElement) {
      progressElement.textContent = `${currentIndex + 1}/${totalQuestions}`;
    }

    // Update progress bar
    const progressBar = document.querySelector('#quiz-progress .bg-blue-500');
    if (progressBar) {
      const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }
  }

  /**
   * Format question text with highlighting
   * @param {Object} question - Question object
   * @returns {string} Formatted HTML
   */
  formatQuestionText(question) {
    if (!question.prefix) {
      return question.question;
    }

    const prefix = question.prefix;
    const fullText = question.question;
    const afterPrefix = fullText.substring(prefix.length);

    return `${prefix}<span class="underline decoration-2 decoration-blue-500 decoration-wavy">${afterPrefix}</span>`;
  }

  /**
   * Reset UI state for new question
   */
  resetQuestionUI() {
    // Clear answer input
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
      answerInput.value = '';
      answerInput.disabled = false;
    }

    // Clear feedback
    const feedback = document.getElementById('feedback');
    if (feedback) {
      feedback.innerHTML = '';
    }

    // Reset buttons
    this.showCheckButton();
    this.hideNextButton();
  }

  /**
   * Focus on answer input
   */
  focusAnswerInput() {
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
      setTimeout(() => answerInput.focus(), 100);
    }
  }

  /**
   * Get user's answer from input
   * @returns {string} User's answer
   */
  getUserAnswer() {
    const answerInput = document.getElementById('answer-input');
    return answerInput ? answerInput.value.trim() : '';
  }

  /**
   * Display feedback for answer
   * @param {boolean} isCorrect - Whether answer is correct
   * @param {string} userAnswer - User's answer
   * @param {string} correctAnswer - Correct answer
   * @param {string} explanation - Explanation text
   */
  displayFeedback(isCorrect, userAnswer, correctAnswer, explanation) {
    const feedback = document.getElementById('feedback');
    if (!feedback) return;

    const feedbackClass = isCorrect ? 'correct' : 'incorrect';
    const icon = isCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle';
    const color = isCorrect ? 'text-green-600' : 'text-red-600';
    const bgColor = isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';

    feedback.innerHTML = `
      <div class="p-4 rounded-lg border-2 ${bgColor} ${feedbackClass}">
        <div class="flex items-center mb-2">
          <i class="${icon} ${color} text-xl mr-2"></i>
          <span class="font-bold ${color}">
            ${isCorrect ? 'Chính xác!' : 'Chưa đúng!'}
          </span>
        </div>
        
        ${!isCorrect ? `
          <div class="mb-2">
            <span class="text-sm text-gray-600">Câu trả lời của bạn: </span>
            <span class="font-mono bg-gray-100 px-2 py-1 rounded">${userAnswer}</span>
          </div>
          <div class="mb-2">
            <span class="text-sm text-gray-600">Đáp án đúng: </span>
            <span class="font-mono bg-green-100 px-2 py-1 rounded text-green-800">${correctAnswer}</span>
          </div>
        ` : ''}
        
        ${explanation ? `
          <div class="mt-2 text-sm text-gray-700 bg-blue-50 p-2 rounded">
            <strong>Giải thích:</strong> ${explanation}
          </div>
        ` : ''}
      </div>
    `;

    // Disable input
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
      answerInput.disabled = true;
    }

    // Update buttons
    this.hideCheckButton();
    this.showNextButton();
    
    this.isAnswerChecked = true;
  }

  /**
   * Show check button
   */
  showCheckButton() {
    const checkBtn = document.getElementById('check-btn');
    if (checkBtn) {
      checkBtn.classList.remove('hidden');
    }
  }

  /**
   * Hide check button
   */
  hideCheckButton() {
    const checkBtn = document.getElementById('check-btn');
    if (checkBtn) {
      checkBtn.classList.add('hidden');
    }
  }

  /**
   * Show next button
   */
  showNextButton() {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      nextBtn.classList.remove('hidden');
    }
  }

  /**
   * Hide next button
   */
  hideNextButton() {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      nextBtn.classList.add('hidden');
    }
  }

  /**
   * Show quiz results modal
   * @param {Object} results - Quiz results
   */
  showResults(results) {
    const modal = document.getElementById('results-modal');
    if (!modal) return;

    // Update results content
    this.updateResultsContent(results);
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Add animation
    const modalContent = modal.querySelector('.bg-white');
    if (modalContent) {
      modalContent.classList.add('animate-slide-up');
    }
  }

  /**
   * Update results modal content
   * @param {Object} results - Quiz results
   */
  updateResultsContent(results) {
    const { correct, total, accuracy, streak, timeSpent } = results;

    // Update stats
    const elements = {
      'result-correct': correct,
      'result-total': total,
      'result-accuracy': `${accuracy}%`,
      'result-streak': streak,
      'result-time': this.formatTime(timeSpent)
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });

    // Update performance message
    const messageElement = document.getElementById('result-message');
    if (messageElement) {
      messageElement.textContent = this.getPerformanceMessage(accuracy);
    }

    // Update performance icon
    const iconElement = document.getElementById('result-icon');
    if (iconElement) {
      const { icon, color } = this.getPerformanceIcon(accuracy);
      iconElement.className = `${icon} text-6xl ${color}`;
    }
  }

  /**
   * Format time in seconds to readable format
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time
   */
  formatTime(seconds) {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  /**
   * Get performance message based on accuracy
   * @param {number} accuracy - Accuracy percentage
   * @returns {string} Performance message
   */
  getPerformanceMessage(accuracy) {
    if (accuracy >= 90) return 'Xuất sắc! Bạn đã thành thạo phần này!';
    if (accuracy >= 80) return 'Tốt lắm! Hãy tiếp tục luyện tập!';
    if (accuracy >= 70) return 'Khá tốt! Bạn đang tiến bộ!';
    if (accuracy >= 60) return 'Cần cải thiện thêm. Đừng bỏ cuộc!';
    return 'Hãy ôn lại lý thuyết và thử lại nhé!';
  }

  /**
   * Get performance icon based on accuracy
   * @param {number} accuracy - Accuracy percentage
   * @returns {Object} Icon and color
   */
  getPerformanceIcon(accuracy) {
    if (accuracy >= 90) return { icon: 'fas fa-trophy', color: 'text-yellow-500' };
    if (accuracy >= 80) return { icon: 'fas fa-medal', color: 'text-blue-500' };
    if (accuracy >= 70) return { icon: 'fas fa-thumbs-up', color: 'text-green-500' };
    if (accuracy >= 60) return { icon: 'fas fa-star', color: 'text-orange-500' };
    return { icon: 'fas fa-redo', color: 'text-gray-500' };
  }

  /**
   * Hide results modal
   */
  hideResults() {
    const modal = document.getElementById('results-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  /**
   * Update session stats display
   * @param {Object} stats - Session statistics
   */
  updateSessionStats(stats) {
    const elements = {
      'session-correct': stats.correct,
      'session-total': stats.total,
      'session-streak': stats.streak
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }
}
