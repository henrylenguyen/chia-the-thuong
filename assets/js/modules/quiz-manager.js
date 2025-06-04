/**
 * Quiz Manager Module
 * Handles quiz logic, state management, and user interactions
 */

import { QuizCard } from '../components/quiz-card.js';
import { Feedback } from '../components/feedback.js';
import { EXERCISE_DEFINITIONS } from '../utils/constants.js';
import { showError, shuffleArray } from '../utils/helpers.js';

export class QuizManager {
  constructor() {
    this.currentQuiz = null;
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.sessionStats = this.initSessionStats();
    this.wrongAnswers = [];

    // Dependencies
    this.questionsData = {};
    this.answersData = {};
    this.statsManager = null;
    this.storageManager = null;

    // Components
    this.quizCard = new QuizCard();
    this.feedback = new Feedback();

    // State
    this.isQuizActive = false;
    this.isAnswered = false;
    this.startTime = null;

    // Elements (will be cached)
    this.elements = {};
  }

  /**
   * Initialize the quiz manager
   */
  init(dependencies) {
    console.log('🎯 Initializing Quiz Manager...');

    // Set dependencies
    this.questionsData = dependencies.questionsData;
    this.answersData = dependencies.answersData;
    this.statsManager = dependencies.statsManager;
    this.storageManager = dependencies.storageManager;

    // Cache DOM elements
    this.cacheElements();

    // Setup event listeners
    this.setupEventListeners();

    console.log('✅ Quiz Manager initialized');
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      modal: document.getElementById('quiz-modal'),
      container: document.querySelector('.quiz-container'),
      title: document.querySelector('.quiz-title'),
      progressBar: document.querySelector('.quiz-progress-fill'),
      progressText: document.querySelector('.quiz-progress-text'),
      closeBtn: document.querySelector('.quiz-close'),
      card: document.querySelector('.quiz-card')
    };
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Close quiz events
    if (this.elements.closeBtn) {
      this.elements.closeBtn.addEventListener('click', () => this.closeQuiz());
    }

    // Modal overlay click
    if (this.elements.modal) {
      this.elements.modal.addEventListener('click', (e) => {
        if (e.target === this.elements.modal) {
          this.closeQuiz();
        }
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (!this.isQuizActive) return;

      switch (e.key) {
        case 'Escape':
          this.closeQuiz();
          break;
        case 'Enter':
          if (!this.isAnswered) {
            this.handleSubmitAnswer();
          } else {
            this.nextQuestion();
          }
          break;
        case 'ArrowRight':
          if (this.isAnswered) {
            this.nextQuestion();
          }
          break;
      }
    });

    // Listen for quiz card events
    document.addEventListener('quiz:submit', (e) => {
      this.handleSubmitAnswer(e.detail.answer);
    });

    document.addEventListener('quiz:next', () => {
      this.nextQuestion();
    });
  }

  /**
   * Start exercise quiz
   */
  startExercise(exerciseType) {
    console.log('🚀 Starting exercise:', exerciseType);

    if (!this.questionsData[exerciseType] || !this.answersData[exerciseType]) {
      showError(`Không tìm thấy dữ liệu cho bài tập "${EXERCISE_DEFINITIONS[exerciseType]?.title}"`);
      return;
    }

    const questions = this.questionsData[exerciseType];
    const answers = this.answersData[exerciseType];

    if (questions.length !== answers.length) {
      showError(`Số lượng câu hỏi (${questions.length}) không khớp với số lượng đáp án (${answers.length})`);
      return;
    }

    // Prepare quiz data
    this.currentQuiz = {
      type: exerciseType,
      title: EXERCISE_DEFINITIONS[exerciseType].title,
      mode: 'exercise'
    };

    this.questions = questions.map((question, index) => ({
      ...question,
      answer: answers[index].answer,
      explanation: answers[index].explanation,
      id: question.id || index + 1
    }));

    // Shuffle questions for variety
    this.questions = shuffleArray([...this.questions]);

    // Reset state
    this.resetQuizState();

    // Show quiz
    this.showQuiz();

    // Load first question
    this.loadQuestion();
  }

  /**
   * Start review quiz
   */
  startReviewQuiz(wrongAnswers) {
    console.log('🔄 Starting review quiz:', wrongAnswers.length, 'questions');

    if (!wrongAnswers || wrongAnswers.length === 0) {
      showError('Không có câu sai để ôn tập!');
      return;
    }

    // Prepare quiz data
    this.currentQuiz = {
      type: 'review',
      title: 'Ôn Tập Câu Sai',
      mode: 'review'
    };

    this.questions = wrongAnswers.map((item, index) => ({
      question: item.question,
      meaning: item.meaning,
      prefix: item.prefix || this.extractPrefix(item.question),
      answer: item.correctAnswer,
      explanation: item.explanation,
      id: index + 1,
      originalUserAnswer: item.userAnswer
    }));

    // Shuffle for variety
    this.questions = shuffleArray([...this.questions]);

    // Reset state
    this.resetQuizState();

    // Show quiz
    this.showQuiz();

    // Load first question
    this.loadQuestion();
  }

  /**
   * Extract prefix from question
   */
  extractPrefix(question) {
    const parts = question.split(' ');
    return parts.slice(0, -1).join(' ');
  }

  /**
   * Reset quiz state
   */
  resetQuizState() {
    this.currentQuestionIndex = 0;
    this.sessionStats = this.initSessionStats();
    this.wrongAnswers = [];
    this.isQuizActive = true;
    this.isAnswered = false;
    this.startTime = Date.now();
  }

  /**
   * Initialize session stats
   */
  initSessionStats() {
    return {
      correct: 0,
      wrong: 0,
      total: 0,
      streak: 0,
      timeSpent: 0,
      averageTime: 0
    };
  }

  /**
   * Show quiz modal
   */
  showQuiz() {
    if (!this.elements.modal) return;

    this.elements.modal.classList.remove('hidden');

    // Update title
    if (this.elements.title) {
      this.elements.title.textContent = this.currentQuiz.title;
    }

    // Focus management
    this.elements.modal.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    console.log('📱 Quiz modal shown');
  }

  /**
   * Load current question
   */
  loadQuestion() {
    const question = this.questions[this.currentQuestionIndex];

    if (!question) {
      this.completeQuiz();
      return;
    }

    console.log(`📝 Loading question ${this.currentQuestionIndex + 1}/${this.questions.length}`);

    // Update progress
    this.updateProgress();

    // Render question card
    this.renderQuestionCard(question);

    // Reset answered state
    this.isAnswered = false;

    // Focus on input
    setTimeout(() => {
      const input = document.querySelector('.answer-input');
      if (input) {
        input.focus();
      }
    }, 100);
  }

  /**
   * Update progress bar
   */
  updateProgress() {
    const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;

    if (this.elements.progressBar) {
      this.elements.progressBar.style.width = `${progress}%`;
    }

    if (this.elements.progressText) {
      this.elements.progressText.textContent = `${this.currentQuestionIndex + 1}/${this.questions.length}`;
    }
  }

  /**
   * Render question card
   */
  renderQuestionCard(question) {
    if (!this.elements.card) return;

    const cardHTML = this.quizCard.render({
      question: question.question,
      meaning: question.meaning,
      prefix: question.prefix,
      questionNumber: this.currentQuestionIndex + 1,
      totalQuestions: this.questions.length
    });

    this.elements.card.innerHTML = cardHTML;

    // Setup card event listeners
    this.setupQuestionCardListeners();
  }

  /**
   * Setup question card event listeners
   */
  setupQuestionCardListeners() {
    const submitBtn = document.querySelector('.quiz-submit-btn');
    const nextBtn = document.querySelector('.quiz-next-btn');
    const input = document.querySelector('.answer-input');

    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.handleSubmitAnswer());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextQuestion());
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (!this.isAnswered) {
            this.handleSubmitAnswer();
          } else {
            this.nextQuestion();
          }
        }
      });
    }
  }

  /**
   * Handle answer submission
   */
  handleSubmitAnswer(userAnswer = null) {
    if (this.isAnswered) return;

    const input = document.querySelector('.answer-input');
    const answer = userAnswer || (input ? input.value.trim() : '');

    if (!answer) {
      input?.focus();
      return;
    }

    const question = this.questions[this.currentQuestionIndex];
    const isCorrect = this.checkAnswer(answer, question.answer);

    // Update stats
    this.updateSessionStats(isCorrect, question, answer);

    // Show feedback
    this.showFeedback(isCorrect, question, answer);

    // Update UI state
    this.isAnswered = true;
    this.updateQuestionUI(isCorrect);

    console.log(`💯 Answer ${isCorrect ? 'correct' : 'incorrect'}:`, {
      question: question.question,
      userAnswer: answer,
      correctAnswer: question.answer
    });
  }

  /**
   * Check if answer is correct
   */
  checkAnswer(userAnswer, correctAnswer) {
    const normalize = (str) => str.toLowerCase().trim()
      .replace(/\s+/g, '') // Remove spaces
      .replace(/[ー]/g, '') // Remove long vowel marks
      .replace(/[っ]/g, 'つ'); // Normalize small tsu

    return normalize(userAnswer) === normalize(correctAnswer);
  }

  /**
   * Update session stats
   */
  updateSessionStats(isCorrect, question, userAnswer) {
    this.sessionStats.total++;

    if (isCorrect) {
      this.sessionStats.correct++;
      this.sessionStats.streak++;
    } else {
      this.sessionStats.wrong++;
      this.sessionStats.streak = 0;

      // Add to wrong answers for review
      this.wrongAnswers.push({
        question: question.question,
        meaning: question.meaning,
        prefix: question.prefix,
        userAnswer,
        correctAnswer: question.answer,
        explanation: question.explanation,
        exerciseType: this.currentQuiz.type,
        timestamp: new Date().toISOString()
      });
    }

    // Calculate time spent
    const currentTime = Date.now();
    const questionTime = currentTime - (this.questionStartTime || this.startTime);
    this.sessionStats.timeSpent += questionTime;
    this.sessionStats.averageTime = this.sessionStats.timeSpent / this.sessionStats.total;

    this.questionStartTime = currentTime;
  }

  /**
   * Show feedback
   */
  showFeedback(isCorrect, question, userAnswer) {
    const feedbackContainer = document.querySelector('.quiz-feedback');
    if (!feedbackContainer) return;

    const feedbackHTML = this.feedback.render({
      isCorrect,
      correctAnswer: question.answer,
      userAnswer,
      explanation: question.explanation
    });

    feedbackContainer.innerHTML = feedbackHTML;
    feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Update question UI after answer
   */
  updateQuestionUI(isCorrect) {
    const submitBtn = document.querySelector('.quiz-submit-btn');
    const nextBtn = document.querySelector('.quiz-next-btn');
    const input = document.querySelector('.answer-input');

    if (submitBtn) {
      submitBtn.style.display = 'none';
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.focus();
    }

    if (input) {
      input.disabled = true;
      input.classList.add(isCorrect ? 'correct' : 'incorrect');
    }
  }

  /**
   * Move to next question
   */
  nextQuestion() {
    if (!this.isAnswered) return;

    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      this.completeQuiz();
    } else {
      this.loadQuestion();
    }
  }

  /**
   * Complete quiz
   */
  completeQuiz() {
    console.log('🏁 Quiz completed:', this.sessionStats);

    // Calculate final stats
    const results = {
      ...this.sessionStats,
      exerciseType: this.currentQuiz.type,
      mode: this.currentQuiz.mode,
      accuracy: Math.round((this.sessionStats.correct / this.sessionStats.total) * 100),
      wrongAnswers: this.wrongAnswers,
      totalTime: Date.now() - this.startTime
    };

    // Dispatch completion event
    document.dispatchEvent(new CustomEvent('quiz:complete', {
      detail: results
    }));

    // Show results
    this.showResults(results);

    // Mark quiz as inactive
    this.isQuizActive = false;
  }

  /**
   * Show results modal
   */
  showResults(results) {
    const resultsModal = document.getElementById('results-modal');
    if (!resultsModal) return;

    const { correct, total, accuracy, wrongAnswers } = results;

    const resultHTML = `
            <div class="text-center">
                <div class="text-6xl mb-4">
                    ${accuracy >= 90 ? '🎉' : accuracy >= 70 ? '👍' : accuracy >= 50 ? '😊' : '💪'}
                </div>
                <h2 class="text-3xl font-bold mb-4 text-gradient">Hoàn Thành!</h2>
                <div class="text-4xl font-bold mb-2">${correct}/${total}</div>
                <div class="text-gray-600 dark:text-gray-400 mb-6">
                    ${this.getResultMessage(accuracy)}
                </div>
                
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <div class="text-2xl font-bold text-green-500">${correct}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Đúng</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-red-500">${results.wrong}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Sai</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-blue-500">${accuracy}%</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Độ chính xác</div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <button onclick="app.quizManager.retryQuiz()" class="btn btn-primary">
                        <i class="fas fa-redo mr-2"></i>Làm Lại
                    </button>
                    <button onclick="app.quizManager.closeResults()" class="btn btn-secondary">
                        <i class="fas fa-home mr-2"></i>Trang Chủ
                    </button>
                    ${wrongAnswers.length > 0 ? `
                        <button onclick="app.quizManager.reviewWrongAnswers()" class="btn btn-warning">
                            <i class="fas fa-book mr-2"></i>Ôn ${wrongAnswers.length} Câu Sai
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

    const modalContent = resultsModal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.innerHTML = resultHTML;
    }

    // Hide quiz modal and show results
    this.closeQuiz();
    resultsModal.classList.remove('hidden');
  }

  /**
   * Get result message based on accuracy
   */
  getResultMessage(accuracy) {
    if (accuracy >= 90) return '🎉 Xuất sắc! Bạn đã làm rất tốt!';
    if (accuracy >= 70) return '👍 Tốt lắm! Tiếp tục cố gắng!';
    if (accuracy >= 50) return '😊 Không tệ! Hãy ôn lại và thử lần nữa!';
    return '💪 Đừng nản lòng! Hãy ôn lại lý thuyết và thử lại!';
  }

  /**
   * Retry current quiz
   */
  retryQuiz() {
    this.closeResults();

    if (this.currentQuiz.mode === 'review') {
      // Retry review quiz with same questions
      const wrongAnswers = this.questions.map(q => ({
        question: q.question,
        meaning: q.meaning,
        prefix: q.prefix,
        correctAnswer: q.answer,
        explanation: q.explanation
      }));
      this.startReviewQuiz(wrongAnswers);
    } else {
      // Retry exercise
      this.startExercise(this.currentQuiz.type);
    }
  }

  /**
   * Review wrong answers from current session
   */
  reviewWrongAnswers() {
    this.closeResults();
    this.startReviewQuiz(this.wrongAnswers);
  }

  /**
   * Close results modal
   */
  closeResults() {
    const resultsModal = document.getElementById('results-modal');
    if (resultsModal) {
      resultsModal.classList.add('hidden');
    }
  }

  /**
   * Close quiz
   */
  closeQuiz() {
    console.log('❌ Closing quiz');

    if (this.elements.modal) {
      this.elements.modal.classList.add('hidden');
    }

    // Restore body scroll
    document.body.style.overflow = '';

    // Mark as inactive
    this.isQuizActive = false;

    // Reset state
    this.currentQuiz = null;
    this.questions = [];
    this.currentQuestionIndex = 0;
  }

  /**
   * Get current quiz state
   */
  getQuizState() {
    return {
      isActive: this.isQuizActive,
      currentQuiz: this.currentQuiz,
      currentQuestionIndex: this.currentQuestionIndex,
      totalQuestions: this.questions.length,
      sessionStats: this.sessionStats,
      isAnswered: this.isAnswered
    };
  }
}