/**
 * Main Application Class
 * Central controller for the Japanese Learning App
 */

import { EXERCISE_DEFINITIONS, APP_CONFIG, STORAGE_KEYS } from './utils/constants.js';
import { DataLoader } from './modules/data-loader.js';
import { Navigation } from './modules/navigation.js';
import { QuizManager } from './modules/quiz-manager.js';
import { StatsManager } from './modules/stats-manager.js';
import { StorageManager } from './modules/storage-manager.js';
import { ThemeManager } from './modules/theme-manager.js';
import { ExerciseRenderer } from './components/exercise-renderer.js';
import { TheoryRenderer } from './components/theory-renderer.js';

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
    this.navigation = new Navigation();
    this.quiz = new QuizManager();
    this.stats = new StatsManager();
    this.storage = new StorageManager();
    this.theme = new ThemeManager();
    this.exerciseRenderer = new ExerciseRenderer();
    this.theoryRenderer = new TheoryRenderer();

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

    // Initialize quiz manager (will be done after data loading)

    // Initialize stats manager
    this.stats.init();
  }

  setupEventListeners() {
    // Quiz controls
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
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
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
      answerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const checkBtn = document.getElementById('check-btn');
          const nextBtn = document.getElementById('next-btn');

          if (checkBtn && !checkBtn.classList.contains('hidden')) {
            this.checkAnswer();
          } else if (nextBtn && !nextBtn.classList.contains('hidden')) {
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
      this.exerciseRenderer.init(this.exerciseDefinitions);

      // Initialize UI now that data is loaded
      this.initializeUI();

      // Delay theory rendering slightly to ensure all data is ready
      setTimeout(() => {
        this.renderTheoryContent();
      }, 100);

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
        case 'Escape':
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
        loadingScreen.classList.add('hidden');
      }, 300);
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
    this.quiz.startQuiz(exerciseKey, questions, answers);
    
    // Show practice page
    this.navigation.navigateTo('practice');
  }

  checkAnswer() {
    this.quiz.checkCurrentAnswer();
  }

  nextQuestion() {
    this.quiz.nextQuestion();
  }

  closeQuiz() {
    this.quiz.endQuiz();
    this.currentExercise = null;
    this.navigation.navigateTo('theory');
  }

  retryCurrentExercise() {
    if (this.currentExercise) {
      this.startExercise(this.currentExercise);
    }
  }

  retryWrongAnswers() {
    // TODO: Implement retry wrong answers functionality
    console.log('Retry wrong answers not implemented yet');
  }

  closeResults() {
    const modal = document.getElementById('results-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  showResults(results) {
    // TODO: Implement results modal
    console.log('Show results:', results);
  }

  // Content loading methods
  loadReviewContent() {
    // TODO: Implement review content loading
    console.log('Loading review content...');
  }

  loadStatistics() {
    // TODO: Implement statistics loading
    console.log('Loading statistics...');
  }

  renderExerciseCards() {
    this.exerciseRenderer.renderExerciseCards(
      this.questionsData,
      this.globalStats,
      (exerciseKey) => this.startExercise(exerciseKey)
    );
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
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new JapaneseApp();
  window.app.init();
});
