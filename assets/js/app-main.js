/**
 * Main Application Class
 * Central controller for the Japanese Learning App
 */

import { ExerciseRenderer } from './components/exercise-renderer.js';
import { PracticeRenderer } from './components/practice-renderer.js';
import { TheoryRenderer } from './components/theory-renderer.js';
import { DataLoader } from './modules/data-loader.js';
import { DynamicRenderer } from './modules/dynamic-renderer.js';
import { Navigation } from './modules/navigation.js';
import { QuizManager } from './modules/quiz-manager.js';
import { StatsManager } from './modules/stats-manager.js';
import { StorageManager } from './modules/storage-manager.js';
import { ThemeManager } from './modules/theme-manager.js';
import { CSS_CLASSES, DOM_IDS, KEYBOARD, STORAGE_KEYS, TIMING, initializeConfig } from './utils/constants.js';

export class JapaneseApp {
  constructor() {
    // Core state
    this.currentExercise = null;
    this.currentQuestionIndex = 0;
    this.sessionStats = { correct: 0, total: 0, streak: 0, wrong: 0 };
    this.currentPage = 'theory';
    this.isDataLoaded = false;

    // Data
    this.questionsData = {};
    this.answersData = {};
    this.wrongAnswers = [];
    this.globalStats = {};

    // Initialize managers
    this.dataLoader = new DataLoader();
    this.dynamicRenderer = new DynamicRenderer(this.dataLoader);
    this.navigation = new Navigation();
    this.quiz = new QuizManager();
    this.stats = new StatsManager();
    this.storage = new StorageManager();
    this.theme = new ThemeManager();
    this.exerciseRenderer = new ExerciseRenderer();
    this.theoryRenderer = new TheoryRenderer();
    this.practiceRenderer = new PracticeRenderer();

    // Initialize review and statistics renderers dynamically
    this.reviewRenderer = null;
    this.statisticsRenderer = null;

    // Bind methods
    this.init = this.init.bind(this);
    this.startExercise = this.startExercise.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.closeQuiz = this.closeQuiz.bind(this);
  }

  async init() {
    try {
      console.log('🚀 Initializing Japanese Learning App...');

      // Initialize configuration first
      await initializeConfig();

      // Initialize managers
      await this.initializeManagers();

      // Setup event listeners
      this.setupEventListeners();

      // Load data
      await this.loadData();

      // Setup keyboard shortcuts
      this.setupKeyboardShortcuts();

      console.log('✅ App initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      this.showError(`Không thể khởi tạo ứng dụng: ${error.message}`);
    }
  }

  async initializeManagers() {
    // Initialize storage and load saved data
    this.wrongAnswers = this.storage.get(STORAGE_KEYS.WRONG_ANSWERS, []);
    this.globalStats = this.storage.get(STORAGE_KEYS.GLOBAL_STATS, {
      totalCorrect: 0,
      totalQuestions: 0,
      maxStreak: 0,
      exerciseProgress: {},
      lastAccessed: new Date().toISOString()
    });

    // Initialize theme
    this.theme.init();

    // Initialize navigation
    this.navigation.init();

    // Listen for navigation events
    document.addEventListener('navigate', (e) => {
      this.handlePageChange(e.detail.page);
    });

    // Listen for dynamic exercise selection
    document.addEventListener('exerciseSelected', (e) => {
      this.startExercise(e.detail.exercise.id);
    });

    // Listen for review quiz start
    document.addEventListener('startReviewQuiz', (e) => {
      this.startReviewQuiz(e.detail.questions);
    });

    // Initialize quiz manager (will be done after data loading)

    // Initialize stats manager
    this.stats.init();
  }

  setupEventListeners() {
    // Quiz controls
    const checkBtn = document.getElementById(DOM_IDS.CHECK_BTN);
    const nextBtn = document.getElementById(DOM_IDS.NEXT_BTN);
    const backBtn = document.getElementById('back-to-selection');
    const retryBtn = document.getElementById('retry-wrong');

    if (checkBtn) checkBtn.addEventListener('click', () => this.checkAnswer());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
    if (backBtn) backBtn.addEventListener('click', () => this.closeQuiz());
    if (retryBtn) retryBtn.addEventListener('click', () => this.retryWrongAnswers());

    // Results modal
    const retryExerciseBtn = document.getElementById('retry-exercise');
    const closeResultsBtn = document.getElementById('close-results');

    if (retryExerciseBtn) retryExerciseBtn.addEventListener('click', () => this.retryCurrentExercise());
    if (closeResultsBtn) closeResultsBtn.addEventListener('click', () => this.closeResults());

    // Answer input
    const answerInput = document.getElementById(DOM_IDS.ANSWER_INPUT);
    if (answerInput) {
      answerInput.addEventListener('keydown', (e) => {
        if (e.key === KEYBOARD.ENTER) {
          e.preventDefault();
          const checkBtn = document.getElementById(DOM_IDS.CHECK_BTN);
          const nextBtn = document.getElementById(DOM_IDS.NEXT_BTN);

          if (checkBtn && !checkBtn.classList.contains(CSS_CLASSES.HIDDEN)) {
            this.checkAnswer();
          } else if (nextBtn && !nextBtn.classList.contains(CSS_CLASSES.HIDDEN)) {
            this.nextQuestion();
          }
        }
      });
    }
  }

  async loadData() {
    try {
      const loadingText = document.querySelector('#loading-screen .text-xl');

      if (loadingText) {
        loadingText.textContent = 'Đang tải dữ liệu...';
      }

      // Load questions and answers
      const data = await this.dataLoader.preloadAll();
      this.questionsData = data.questionsData;
      this.answersData = data.answersData;
      this.theoryData = data.theoryData;
      this.exerciseDefinitions = data.exerciseDefinitions;
      this.isDataLoaded = true;

      if (loadingText) {
        loadingText.textContent = 'Hoàn thành!';
      }

      // Initialize quiz manager with loaded data
      this.quiz.init({
        questionsData: this.questionsData,
        answersData: this.answersData,
        exerciseDefinitions: this.exerciseDefinitions,
        statsManager: this.stats,
        storageManager: this.storage
      });

      console.log('📚 Data loaded successfully:', {
        questions: Object.keys(this.questionsData).length + ' categories',
        answers: Object.keys(this.answersData).length + ' categories',
        theory: Object.keys(this.theoryData).length + ' categories',
        exercises: Object.keys(this.exerciseDefinitions).length + ' definitions'
      });

      // Initialize renderers
      this.theoryRenderer.init(this.theoryData, this.exerciseDefinitions, this.questionsData);
      this.practiceRenderer.init(this.theoryData, this.questionsData, this.answersData, this.exerciseDefinitions);
      this.exerciseRenderer.init(this.exerciseDefinitions);

      // Initialize UI now that data is loaded
      this.initializeUI();

      // Delay content rendering slightly to ensure all data is ready
      setTimeout(() => {
        this.renderTheoryContent();
        this.renderPracticeContent();
      }, TIMING.AUTO_FOCUS_DELAY);

    } catch (error) {
      console.error('❌ Error loading data:', error);
      this.showError(`Không thể tải dữ liệu: ${error.message}`);
    }
  }

  initializeUI() {
    // Update stats display
    this.updateStatsDisplay();

    // Render exercise cards (only if data is loaded)
    if (this.questionsData && Object.keys(this.questionsData).length > 0) {
      this.renderExerciseCards();
    }

    // Hide loading screen
    this.hideLoadingScreen();
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Only handle shortcuts when not typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case KEYBOARD.ESCAPE:
          if (this.currentExercise) {
            this.closeQuiz();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          const pageIndex = parseInt(e.key) - 1;
          const pages = ['theory', 'practice', 'review', 'statistics'];
          if (pages[pageIndex]) {
            this.navigation.showPage(pages[pageIndex]);
          }
          break;
      }
    });
  }

  handlePageChange(page) {
    this.currentPage = page;

    // Load page-specific content
    if (page === 'review') {
      this.loadReviewContent();
    } else if (page === 'statistics') {
      this.loadStatistics();
    }
  }

  handleAnswerResult(result) {
    // Update session stats
    this.sessionStats.total++;
    if (result.correct) {
      this.sessionStats.correct++;
      this.sessionStats.streak++;
    } else {
      this.sessionStats.wrong++;
      this.sessionStats.streak = 0;

      // Add to wrong answers
      this.wrongAnswers.push({
        question: result.question,
        userAnswer: result.userAnswer,
        correctAnswer: result.correctAnswer,
        exercise: this.currentExercise,
        timestamp: new Date().toISOString()
      });
    }

    // Update global stats
    this.stats.updateStats(result);

    // Save data
    this.saveData();
  }

  handleQuizComplete(results) {
    // Update exercise progress
    const exerciseKey = this.currentExercise;
    if (!this.globalStats.exerciseProgress[exerciseKey]) {
      this.globalStats.exerciseProgress[exerciseKey] = 0;
    }
    this.globalStats.exerciseProgress[exerciseKey] += results.correct;

    // Save and update UI
    this.saveData();
    this.updateStatsDisplay();
    this.showResults(results);
  }

  handleStatsUpdate(stats) {
    this.globalStats = { ...this.globalStats, ...stats };
    this.updateStatsDisplay();
  }

  saveData() {
    this.storage.set(STORAGE_KEYS.GLOBAL_STATS, this.globalStats);
    this.storage.set(STORAGE_KEYS.WRONG_ANSWERS, this.wrongAnswers);
    this.storage.set(STORAGE_KEYS.LAST_VISITED, new Date().toISOString());
  }

  // UI Methods
  updateStatsDisplay() {
    const elements = {
      'correct-count': this.globalStats.totalCorrect,
      'total-count': this.globalStats.totalQuestions,
      'streak-count': this.sessionStats.streak
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });

    // Update accuracy
    const accuracy = this.globalStats.totalQuestions > 0
      ? Math.round((this.globalStats.totalCorrect / this.globalStats.totalQuestions) * 100)
      : 0;

    const accuracyElement = document.getElementById('accuracy-rate');
    if (accuracyElement) {
      accuracyElement.textContent = accuracy + '%';
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('opacity-0');
      setTimeout(() => {
        loadingScreen.classList.add(CSS_CLASSES.HIDDEN);
      }, TIMING.ANIMATION_DURATION);
    }
  }

  showError(message) {
    console.error('App Error:', message);
    alert(message); // TODO: Replace with better error UI
  }

  // Exercise Methods
  startExercise(exerciseKey) {
    if (!this.isDataLoaded) {
      this.showError('Dữ liệu chưa được tải. Vui lòng đợi...');
      return;
    }

    const questions = this.questionsData[exerciseKey];
    const answers = this.answersData[exerciseKey];

    if (!questions || !answers) {
      this.showError(`Không tìm thấy dữ liệu cho bài tập: ${exerciseKey}`);
      return;
    }

    this.currentExercise = exerciseKey;
    this.currentQuestionIndex = 0;
    this.sessionStats = { correct: 0, total: 0, streak: 0, wrong: 0 };

    // Start quiz
    this.quiz.startExercise(exerciseKey);

    // Show practice page
    this.navigation.navigateTo('practice');
  }

  checkAnswer() {
    this.quiz.handleSubmitAnswer();
  }

  nextQuestion() {
    this.quiz.nextQuestion();
  }

  closeQuiz() {
    this.quiz.closeQuiz();
    this.currentExercise = null;
    this.navigation.navigateTo('practice');
  }

  retryCurrentExercise() {
    if (this.currentExercise) {
      this.startExercise(this.currentExercise);
    }
  }

  startReviewQuiz(questions) {
    if (!questions || questions.length === 0) {
      this.showError('Không có câu sai để ôn tập!');
      return;
    }

    // Set up review mode
    this.currentExercise = 'review';
    this.currentQuestionIndex = 0;
    this.sessionStats = { correct: 0, total: 0, streak: 0, wrong: 0 };

    // Start quiz with review questions
    this.quiz.startReviewQuiz(questions);

    // Show practice page
    this.navigation.navigateTo('practice');
  }

  retryWrongAnswers() {
    if (this.reviewRenderer) {
      this.reviewRenderer.startReviewQuiz();
    } else {
      console.log('Review renderer not initialized');
    }
  }

  clearWrongAnswers() {
    if (this.reviewRenderer) {
      this.reviewRenderer.clearWrongAnswers();
    }
  }

  removeWrongAnswer(index) {
    if (this.reviewRenderer) {
      this.reviewRenderer.removeWrongAnswer(index);
    }
  }

  exportData() {
    try {
      const data = this.storage.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `japanese-app-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      console.log('📤 Data exported successfully');
    } catch (error) {
      console.error('❌ Export failed:', error);
      alert('Xuất dữ liệu thất bại!');
    }
  }

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            this.storage.importData(data);
            alert('Nhập dữ liệu thành công!');
            location.reload(); // Reload to apply imported data
          } catch (error) {
            console.error('❌ Import failed:', error);
            alert('Nhập dữ liệu thất bại!');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  resetData() {
    if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác!')) {
      this.storage.clear();
      alert('Đã xóa tất cả dữ liệu!');
      location.reload();
    }
  }

  closeResults() {
    const modal = document.getElementById(DOM_IDS.RESULTS_MODAL);
    if (modal) {
      modal.classList.add(CSS_CLASSES.HIDDEN);
    }
  }

  showResults(results) {
    // TODO: Implement results modal
    console.log('Show results:', results);
  }

  // Content loading methods
  async loadReviewContent() {
    try {
      if (!this.reviewRenderer) {
        const { ReviewRenderer } = await import('./components/review-renderer.js');
        this.reviewRenderer = new ReviewRenderer();
        this.reviewRenderer.init(this.storage);
      }
      this.reviewRenderer.renderReviewContent();
      console.log('📖 Review content loaded');
    } catch (error) {
      console.error('❌ Error loading review content:', error);
    }
  }

  async loadStatistics() {
    try {
      if (!this.statisticsRenderer) {
        const { StatisticsRenderer } = await import('./components/statistics-renderer.js');
        this.statisticsRenderer = new StatisticsRenderer();
        this.statisticsRenderer.init(this.storage, this.stats);
      }
      this.statisticsRenderer.renderStatisticsContent();
      console.log('📊 Statistics content loaded');
    } catch (error) {
      console.error('❌ Error loading statistics content:', error);
    }
  }

  async renderExerciseCards() {
    try {
      const container = document.getElementById(DOM_IDS.EXERCISE_CARDS_CONTAINER) ||
        document.querySelector('.exercise-cards') ||
        document.querySelector('#practice .grid');

      if (container) {
        await this.dynamicRenderer.renderExerciseCards(container);
        console.log('🎨 Dynamic exercise cards rendered');
      } else {
        console.warn('⚠️ Exercise cards container not found');
        // Fallback to old renderer
        this.exerciseRenderer.renderExerciseCards(
          this.questionsData,
          this.globalStats,
          (exerciseKey) => this.startExercise(exerciseKey)
        );
      }
    } catch (error) {
      console.error('❌ Error rendering dynamic exercise cards:', error);
      // Fallback to old renderer
      this.exerciseRenderer.renderExerciseCards(
        this.questionsData,
        this.globalStats,
        (exerciseKey) => this.startExercise(exerciseKey)
      );
    }
  }

  renderTheoryContent() {
    if (this.theoryRenderer && this.theoryData && this.exerciseDefinitions && this.questionsData) {
      this.theoryRenderer.renderTheoryContent();
    } else {
      console.warn('Theory content not rendered - missing data:', {
        theoryRenderer: !!this.theoryRenderer,
        theoryData: !!this.theoryData,
        exerciseDefinitions: !!this.exerciseDefinitions,
        questionsData: !!this.questionsData
      });
    }
  }

  renderPracticeContent() {
    if (this.practiceRenderer && this.theoryData && this.questionsData && this.answersData && this.exerciseDefinitions) {
      this.practiceRenderer.renderPracticeContent();
    } else {
      console.warn('Practice content not rendered - missing data:', {
        practiceRenderer: !!this.practiceRenderer,
        theoryData: !!this.theoryData,
        questionsData: !!this.questionsData,
        answersData: !!this.answersData,
        exerciseDefinitions: !!this.exerciseDefinitions
      });
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new JapaneseApp();
  window.app.init();
});
