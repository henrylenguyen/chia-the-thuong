/**
 * Japanese Learning App - Main Application
 * Entry point for the application
 */

import { DataLoader } from './modules/data-loader.js';
import { QuizManager } from './modules/quiz-manager.js';
import { StatsManager } from './modules/stats-manager.js';
import { StorageManager } from './modules/storage-manager.js';
import { ThemeManager } from './modules/theme-manager.js';
import { Navigation } from './modules/navigation.js';
import { ExerciseCard } from './components/exercise-card.js';
import { QuizCard } from './components/quiz-card.js';
import { ProgressBar } from './components/progress-bar.js';
import { Feedback } from './components/feedback.js';
import { EXERCISE_DEFINITIONS, APP_CONFIG } from './utils/constants.js';
import { showError, hideLoading, debounce } from './utils/helpers.js';

class JapaneseApp {
  constructor() {
    this.isInitialized = false;
    this.currentPage = 'theory';

    // Initialize managers
    this.dataLoader = new DataLoader();
    this.quizManager = new QuizManager();
    this.statsManager = new StatsManager();
    this.storageManager = new StorageManager();
    this.themeManager = new ThemeManager();
    this.navigation = new Navigation();

    // Initialize components
    this.exerciseCard = new ExerciseCard();
    this.quizCard = new QuizCard();
    this.progressBar = new ProgressBar();
    this.feedback = new Feedback();

    // Data
    this.questionsData = {};
    this.answersData = {};
    this.wrongAnswers = [];

    // Bind methods
    this.init = this.init.bind(this);
    this.handleResize = debounce(this.handleResize.bind(this), 250);
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('🚀 Initializing Japanese Learning App...');

      // Setup event listeners
      this.setupEventListeners();

      // Initialize theme
      this.themeManager.init();

      // Initialize navigation
      this.navigation.init();

      // Load data
      await this.loadAppData();

      // Initialize stats
      this.statsManager.init();

      // Initialize quiz manager
      this.quizManager.init({
        questionsData: this.questionsData,
        answersData: this.answersData,
        statsManager: this.statsManager,
        storageManager: this.storageManager
      });

      // Render initial content
      this.renderTheoryPage();
      this.renderPracticePage();
      this.renderStatsPage();
      this.renderReviewPage();

      // Hide loading screen
      hideLoading();

      // Mark as initialized
      this.isInitialized = true;

      console.log('✅ App initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      showError(`Không thể khởi tạo ứng dụng: ${error.message}`);
      hideLoading();
    }
  }

  /**
   * Load application data
   */
  async loadAppData() {
    try {
      const [questionsData, answersData] = await Promise.all([
        this.dataLoader.loadQuestions(),
        this.dataLoader.loadAnswers()
      ]);

      this.questionsData = questionsData;
      this.answersData = answersData;

      // Load wrong answers from storage
      this.wrongAnswers = this.storageManager.getWrongAnswers();

      console.log('📊 Data loaded:', {
        exerciseTypes: Object.keys(this.questionsData).length,
        totalQuestions: Object.values(this.questionsData).reduce((sum, questions) => sum + questions.length, 0),
        wrongAnswers: this.wrongAnswers.length
      });

    } catch (error) {
      throw new Error(`Không thể tải dữ liệu: ${error.message}`);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Navigation events
    document.addEventListener('navigate', (e) => {
      this.handleNavigation(e.detail.page);
    });

    // Quiz events
    document.addEventListener('quiz:start', (e) => {
      this.handleQuizStart(e.detail);
    });

    document.addEventListener('quiz:complete', (e) => {
      this.handleQuizComplete(e.detail);
    });

    document.addEventListener('quiz:answer', (e) => {
      this.handleQuizAnswer(e.detail);
    });

    // Storage events
    document.addEventListener('storage:updated', () => {
      this.handleStorageUpdate();
    });

    // Window events
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboard.bind(this));

    // Error handling
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
  }

  /**
   * Handle navigation
   */
  handleNavigation(page) {
    if (this.currentPage === page) return;

    this.currentPage = page;

    // Update page content if needed
    if (page === 'statistics') {
      this.renderStatsPage();
    } else if (page === 'review') {
      this.renderReviewPage();
    }
  }

  /**
   * Handle quiz start
   */
  handleQuizStart({ exerciseType, mode = 'normal' }) {
    console.log('🎯 Starting quiz:', { exerciseType, mode });

    if (mode === 'review') {
      this.quizManager.startReviewQuiz(this.wrongAnswers);
    } else {
      this.quizManager.startExercise(exerciseType);
    }
  }

  /**
   * Handle quiz completion
   */
  handleQuizComplete(results) {
    console.log('🏁 Quiz completed:', results);

    // Update stats
    this.statsManager.updateSessionStats(results);

    // Update exercise progress if normal quiz
    if (results.exerciseType !== 'review') {
      this.statsManager.updateExerciseProgress(results.exerciseType, results.correct);
    }

    // Update wrong answers
    if (results.wrongAnswers && results.wrongAnswers.length > 0) {
      this.wrongAnswers = this.storageManager.addWrongAnswers(results.wrongAnswers);
    }

    // Re-render affected pages
    this.renderPracticePage();
    this.renderStatsPage();
    this.renderReviewPage();
  }

  /**
   * Handle quiz answer
   */
  handleQuizAnswer({ isCorrect, wrongAnswer }) {
    if (!isCorrect && wrongAnswer) {
      // Add to wrong answers immediately for retry functionality
      this.wrongAnswers.push(wrongAnswer);
    }
  }

  /**
   * Handle storage updates
   */
  handleStorageUpdate() {
    // Reload data from storage
    this.wrongAnswers = this.storageManager.getWrongAnswers();

    // Re-render affected components
    this.renderStatsPage();
    this.renderReviewPage();
  }

  /**
   * Render theory page
   */
  renderTheoryPage() {
    const theoryGrid = document.getElementById('theory-grid');
    if (!theoryGrid) return;

    const theoryCards = [
      {
        title: 'Thể Thường là gì?',
        icon: 'fas fa-info-circle',
        content: `
                    <p>Thể Thường (普通形) được sử dụng trong:</p>
                    <ul>
                        <li><i class="fas fa-comments text-blue-500"></i> Các tình huống thân mật, không trang trọng</li>
                        <li><i class="fas fa-users text-green-500"></i> Nói chuyện với bạn bè, người thân</li>
                        <li><i class="fas fa-book-open text-purple-500"></i> Văn viết không trang trọng</li>
                        <li><i class="fas fa-link text-orange-500"></i> Kết hợp với các mẫu ngữ pháp đặc biệt</li>
                    </ul>
                `
      },
      {
        title: 'Quy Tắc Chuyển Đổi',
        icon: 'fas fa-exchange-alt',
        content: `
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm border-collapse">
                            <thead>
                                <tr class="border-b-2 border-gray-200">
                                    <th class="text-left py-2">Loại từ</th>
                                    <th class="text-left py-2">Lịch sự</th>
                                    <th class="text-left py-2">Thường</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-b border-gray-100">
                                    <td class="py-2 font-medium">Động từ</td>
                                    <td class="py-2 japanese-text">Vます</td>
                                    <td class="py-2 japanese-text text-blue-600">Vる</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="py-2 font-medium">Tính từ い</td>
                                    <td class="py-2 japanese-text">Aいです</td>
                                    <td class="py-2 japanese-text text-green-600">Aい</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="py-2 font-medium">Tính từ な</td>
                                    <td class="py-2 japanese-text">Aなです</td>
                                    <td class="py-2 japanese-text text-purple-600">Aだ</td>
                                </tr>
                                <tr>
                                    <td class="py-2 font-medium">Danh từ</td>
                                    <td class="py-2 japanese-text">Nです</td>
                                    <td class="py-2 japanese-text text-orange-600">Nだ</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `
      },
      {
        title: 'Mẹo Học Tập',
        icon: 'fas fa-lightbulb',
        content: `
                    <div class="space-y-3">
                        <div class="flex items-start space-x-3">
                            <i class="fas fa-repeat text-blue-500 mt-1"></i>
                            <span>Luyện tập thường xuyên với bạn bè người Nhật</span>
                        </div>
                        <div class="flex items-start space-x-3">
                            <i class="fas fa-film text-red-500 mt-1"></i>
                            <span>Xem anime, drama để nghe thể thường trong thực tế</span>
                        </div>
                        <div class="flex items-start space-x-3">
                            <i class="fas fa-book-reader text-green-500 mt-1"></i>
                            <span>Đọc manga, tin nhắn social media</span>
                        </div>
                        <div class="flex items-start space-x-3">
                            <i class="fas fa-target text-purple-500 mt-1"></i>
                            <span>Đừng sợ sai - học từ sai lầm</span>
                        </div>
                    </div>
                `
      },
      {
        title: 'Ứng Dụng Thực Tế',
        icon: 'fas fa-puzzle-piece',
        content: `
                    <p class="mb-4">Thể thường thường xuất hiện trong các mẫu ngữ pháp:</p>
                    <div class="space-y-2">
                        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                            <strong class="japanese-text text-blue-600">と思います</strong> - tôi nghĩ rằng...
                        </div>
                        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                            <strong class="japanese-text text-green-600">でしょう</strong> - có lẽ, phải không
                        </div>
                        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                            <strong class="japanese-text text-purple-600">かもしれません</strong> - có thể
                        </div>
                        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                            <strong class="japanese-text text-orange-600">時、前に、後で</strong> - khi, trước, sau
                        </div>
                    </div>
                `
      }
    ];

    theoryGrid.innerHTML = theoryCards.map(card => `
            <div class="theory-card">
                <h3 class="theory-card-title">
                    <i class="${card.icon}"></i>
                    ${card.title}
                </h3>
                <div class="theory-card-content">
                    ${card.content}
                </div>
            </div>
        `).join('');
  }

  /**
   * Render practice page
   */
  renderPracticePage() {
    // Render stats dashboard
    this.renderStatsBoard();

    // Render exercise cards
    this.renderExerciseCards();
  }

  /**
   * Render stats board
   */
  renderStatsBoard() {
    const dashboard = document.getElementById('stats-dashboard');
    if (!dashboard) return;

    const stats = this.statsManager.getGlobalStats();
    const sessionStats = this.statsManager.getSessionStats();

    dashboard.innerHTML = `
            <div class="stats-card">
                <div class="stats-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stats-value">${stats.totalCorrect}</div>
                <div class="stats-label">Câu Đúng</div>
            </div>
            <div class="stats-card">
                <div class="stats-icon">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <div class="stats-value">${stats.totalQuestions}</div>
                <div class="stats-label">Tổng Câu</div>
            </div>
            <div class="stats-card">
                <div class="stats-icon">
                    <i class="fas fa-fire"></i>
                </div>
                <div class="stats-value">${sessionStats.streak}</div>
                <div class="stats-label">Streak</div>
            </div>
            <div class="stats-card">
                <div class="stats-icon">
                    <i class="fas fa-percentage"></i>
                </div>
                <div class="stats-value">${stats.accuracy}%</div>
                <div class="stats-label">Độ Chính Xác</div>
            </div>
        `;
  }

  /**
   * Render exercise cards
   */
  renderExerciseCards() {
    const grid = document.getElementById('exercise-grid');
    if (!grid) return;

    const exerciseProgress = this.statsManager.getExerciseProgress();

    grid.innerHTML = Object.entries(EXERCISE_DEFINITIONS).map(([key, exercise]) => {
      const questions = this.questionsData[key] || [];
      const progress = exerciseProgress[key] || 0;
      const total = questions.length;
      const progressPercent = total > 0 ? (progress / total) * 100 : 0;

      return this.exerciseCard.render({
        key,
        exercise,
        progress,
        total,
        progressPercent,
        hasData: total > 0
      });
    }).join('');

    // Add click event listeners
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.exercise-card');
      if (card) {
        const exerciseType = card.dataset.exercise;
        document.dispatchEvent(new CustomEvent('quiz:start', {
          detail: { exerciseType }
        }));
      }
    });
  }

  /**
   * Render statistics page
   */
  renderStatsPage() {
    const container = document.getElementById('exercise-progress');
    if (!container) return;

    const exerciseProgress = this.statsManager.getExerciseProgress();
    const globalStats = this.statsManager.getGlobalStats();

    // Exercise progress list
    const progressHTML = Object.entries(EXERCISE_DEFINITIONS).map(([key, exercise]) => {
      const questions = this.questionsData[key] || [];
      const progress = exerciseProgress[key] || 0;
      const total = questions.length;
      const percentage = total > 0 ? (progress / total) * 100 : 0;

      return `
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div class="flex items-center space-x-3">
                        <i class="${exercise.icon} text-${exercise.color}-500"></i>
                        <div>
                            <div class="font-medium">${exercise.title}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">${total} câu hỏi</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                            <div class="bg-${exercise.color}-500 h-2 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
                        </div>
                        <span class="text-sm text-gray-600 dark:text-gray-400 min-w-[50px] text-right">${progress}/${total}</span>
                        ${percentage >= 100 ? '<i class="fas fa-check-circle text-green-500"></i>' : ''}
                    </div>
                </div>
            `;
    }).join('');

    // Summary stats
    const totalQuestions = Object.keys(this.questionsData).reduce((sum, key) => {
      return sum + (this.questionsData[key]?.length || 0);
    }, 0);

    const completedQuestions = Object.keys(EXERCISE_DEFINITIONS).reduce((sum, key) => {
      return sum + (exerciseProgress[key] || 0);
    }, 0);

    const summaryHTML = `
            <div class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-blue-200 dark:border-gray-600">
                <h4 class="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">📊 Tổng Quan</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${totalQuestions}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Tổng câu hỏi</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">${completedQuestions}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Đã hoàn thành</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">${globalStats.maxStreak}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Streak cao nhất</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">${this.wrongAnswers.length}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Câu cần ôn</div>
                    </div>
                </div>
            </div>
        `;

    container.innerHTML = progressHTML + summaryHTML;
  }

  /**
   * Render review page
   */
  renderReviewPage() {
    const container = document.getElementById('review-content');
    if (!container) return;

    if (this.wrongAnswers.length === 0) {
      container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                    <h3 class="text-2xl font-bold mb-2">Tuyệt vời!</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Bạn chưa có câu nào sai để ôn tập.</p>
                    <button onclick="app.navigation.showPage('practice')" class="btn btn-primary">
                        Làm Bài Tập Mới
                    </button>
                </div>
            `;
      return;
    }

    const actionsHTML = `
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold">Câu Sai Cần Ôn Tập (${this.wrongAnswers.length})</h3>
                <div class="space-x-3">
                    <button onclick="app.startReviewQuiz()" class="btn btn-primary">
                        <i class="fas fa-play mr-2"></i>Ôn Tập Ngay
                    </button>
                    <button onclick="app.clearWrongAnswers()" class="btn btn-danger">
                        <i class="fas fa-trash mr-2"></i>Xóa Tất Cả
                    </button>
                </div>
            </div>
        `;

    const cardsHTML = this.wrongAnswers.map((item, index) => `
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                        <div class="japanese-text text-lg mb-1">${item.question}</div>
                        <div class="text-gray-600 dark:text-gray-400 text-sm mb-2">${item.meaning}</div>
                        <div class="flex items-center space-x-4 text-sm">
                            <span class="text-red-600 dark:text-red-400">
                                <i class="fas fa-times mr-1"></i>Bạn trả lời: ${item.userAnswer}
                            </span>
                            <span class="text-green-600 dark:text-green-400">
                                <i class="fas fa-check mr-1"></i>Đáp án đúng: ${item.correctAnswer}
                            </span>
                        </div>
                        ${item.explanation ? `<div class="text-sm text-gray-500 mt-2">${item.explanation}</div>` : ''}
                    </div>
                    <button onclick="app.removeWrongAnswer(${index})" class="text-gray-400 hover:text-red-500 transition-colors">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');

    container.innerHTML = actionsHTML + `<div class="grid gap-4">${cardsHTML}</div>`;
  }

  /**
   * Start review quiz
   */
  startReviewQuiz() {
    document.dispatchEvent(new CustomEvent('quiz:start', {
      detail: { exerciseType: 'review', mode: 'review' }
    }));
  }

  /**
   * Clear wrong answers
   */
  clearWrongAnswers() {
    if (confirm('Bạn có chắc muốn xóa tất cả câu sai?')) {
      this.storageManager.clearWrongAnswers();
      this.wrongAnswers = [];
      this.renderReviewPage();
    }
  }

  /**
   * Remove specific wrong answer
   */
  removeWrongAnswer(index) {
    this.wrongAnswers.splice(index, 1);
    this.storageManager.saveWrongAnswers(this.wrongAnswers);
    this.renderReviewPage();
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Update layouts if needed
    console.log('🔄 Window resized');
  }

  /**
   * Handle before unload
   */
  handleBeforeUnload(e) {
    // Save any pending data
    this.storageManager.saveAllData();
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case '1':
        this.navigation.showPage('theory');
        break;
      case '2':
        this.navigation.showPage('practice');
        break;
      case '3':
        this.navigation.showPage('review');
        break;
      case '4':
        this.navigation.showPage('statistics');
        break;
      case 't':
        this.themeManager.toggle();
        break;
      case 'Escape':
        this.quizManager.closeQuiz();
        break;
    }
  }

  /**
   * Handle global errors
   */
  handleGlobalError(e) {
    console.error('🚨 Global error:', e.error);
    showError(`Lỗi ứng dụng: ${e.error?.message || 'Lỗi không xác định'}`);
  }

  /**
   * Handle unhandled promise rejections
   */
  handleUnhandledRejection(e) {
    console.error('🚨 Unhandled rejection:', e.reason);
    showError(`Lỗi xử lý: ${e.reason?.message || 'Lỗi không xác định'}`);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new JapaneseApp();
  window.app.init();
});

// Export for use in other modules
export default JapaneseApp;