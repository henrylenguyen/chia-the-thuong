/**
 * Review Renderer - Renders review content based on old-source.html design
 * Displays wrong answers for review and practice
 */

export class ReviewRenderer {
  constructor() {
    this.wrongAnswers = [];
    this.storageManager = null;
  }

  /**
   * Initialize with dependencies
   */
  init(storageManager) {
    this.storageManager = storageManager;
    this.loadWrongAnswers();
  }

  /**
   * Load wrong answers from storage
   */
  loadWrongAnswers() {
    if (this.storageManager) {
      this.wrongAnswers = this.storageManager.getWrongAnswers();
    }
  }

  /**
   * Render review content exactly like old-source.html
   */
  renderReviewContent() {
    const container = document.getElementById('review-content');
    if (!container) {
      console.warn('Review content container not found');
      return;
    }

    // Reload wrong answers
    this.loadWrongAnswers();

    if (this.wrongAnswers.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
          <h3 class="text-2xl font-bold mb-2">Tuyệt vời!</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Bạn chưa có câu nào sai để ôn tập.</p>
          <button onclick="window.app.navigation.navigateTo('practice')" class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
            Làm Bài Tập Mới
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold">Câu Sai Cần Ôn Tập (${this.wrongAnswers.length})</h3>
        <div class="space-x-3">
          <button onclick="window.app.retryWrongAnswers()" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            <i class="fas fa-play mr-2"></i>Ôn Tập Ngay
          </button>
          <button onclick="window.app.clearWrongAnswers()" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
            <i class="fas fa-trash mr-2"></i>Xóa Tất Cả
          </button>
        </div>
      </div>
      
      <div class="grid gap-4">
        ${this.wrongAnswers.map((item, index) => this.createWrongAnswerCard(item, index)).join('')}
      </div>
    `;
  }

  /**
   * Create wrong answer card exactly like old-source.html
   */
  createWrongAnswerCard(item, index) {
    return `
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <div class="font-japanese text-lg mb-1">${item.question}</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm mb-2">${item.meaning || ''}</div>
            <div class="flex items-center space-x-4 text-sm">
              <span class="text-red-600 dark:text-red-400">
                <i class="fas fa-times mr-1"></i>Bạn trả lời: ${item.userAnswer}
              </span>
              <span class="text-green-600 dark:text-green-400">
                <i class="fas fa-check mr-1"></i>Đáp án đúng: ${item.correctAnswer}
              </span>
            </div>
            ${item.explanation ? `
              <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <i class="fas fa-info-circle mr-1"></i>${item.explanation}
              </div>
            ` : ''}
            <div class="mt-2 text-xs text-gray-400">
              <i class="fas fa-clock mr-1"></i>${this.formatTimestamp(item.timestamp)}
              ${item.exerciseType ? ` • ${this.getExerciseTypeName(item.exerciseType)}` : ''}
            </div>
          </div>
          <button onclick="window.app.removeWrongAnswer(${index})" class="text-gray-400 hover:text-red-500 transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Format timestamp for display
   */
  formatTimestamp(timestamp) {
    if (!timestamp) return 'Không rõ thời gian';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Hôm nay';
      } else if (diffDays === 1) {
        return 'Hôm qua';
      } else if (diffDays < 7) {
        return `${diffDays} ngày trước`;
      } else {
        return date.toLocaleDateString('vi-VN');
      }
    } catch (error) {
      return 'Không rõ thời gian';
    }
  }

  /**
   * Get exercise type display name
   */
  getExerciseTypeName(exerciseType) {
    const names = {
      'verbs-present': 'Động từ hiện tại',
      'verbs-past': 'Động từ quá khứ',
      'verbs-negative': 'Động từ phủ định',
      'verbs-past-negative': 'Động từ quá khứ phủ định',
      'adjectives-i': 'Tính từ い',
      'adjectives-na': 'Tính từ な',
      'nouns': 'Danh từ',
      'review': 'Ôn tập'
    };
    return names[exerciseType] || exerciseType;
  }

  /**
   * Clear all wrong answers
   */
  clearWrongAnswers() {
    if (confirm('Bạn có chắc muốn xóa tất cả câu sai?')) {
      if (this.storageManager) {
        this.storageManager.clearWrongAnswers();
      }
      this.wrongAnswers = [];
      this.renderReviewContent();
    }
  }

  /**
   * Remove specific wrong answer
   */
  removeWrongAnswer(index) {
    if (index >= 0 && index < this.wrongAnswers.length) {
      this.wrongAnswers.splice(index, 1);
      
      if (this.storageManager) {
        this.storageManager.saveWrongAnswers(this.wrongAnswers);
      }
      
      this.renderReviewContent();
    }
  }

  /**
   * Get wrong answers for quiz
   */
  getWrongAnswersForQuiz() {
    return this.wrongAnswers.map(item => ({
      question: item.question,
      answer: item.correctAnswer,
      meaning: item.meaning,
      prefix: item.prefix || this.extractPrefix(item.question),
      explanation: item.explanation,
      originalUserAnswer: item.userAnswer
    }));
  }

  /**
   * Extract prefix from question
   */
  extractPrefix(question) {
    const parts = question.split(' ');
    return parts.slice(0, -1).join(' ');
  }

  /**
   * Start review quiz
   */
  startReviewQuiz() {
    if (this.wrongAnswers.length === 0) {
      alert('Không có câu sai để ôn tập!');
      return;
    }

    // Get quiz questions format
    const quizQuestions = this.getWrongAnswersForQuiz();
    
    // Trigger quiz start event
    document.dispatchEvent(new CustomEvent('startReviewQuiz', {
      detail: { questions: quizQuestions }
    }));
  }

  /**
   * Get review statistics
   */
  getReviewStats() {
    const stats = {
      totalWrongAnswers: this.wrongAnswers.length,
      exerciseTypes: {},
      recentErrors: 0
    };

    // Count by exercise type
    this.wrongAnswers.forEach(item => {
      const type = item.exerciseType || 'unknown';
      stats.exerciseTypes[type] = (stats.exerciseTypes[type] || 0) + 1;
    });

    // Count recent errors (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    stats.recentErrors = this.wrongAnswers.filter(item => {
      if (!item.timestamp) return false;
      return new Date(item.timestamp) > weekAgo;
    }).length;

    return stats;
  }
}
