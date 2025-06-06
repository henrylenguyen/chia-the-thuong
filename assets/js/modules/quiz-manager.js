/**
 * Quiz Manager Module
 * Handles quiz logic, state management, and user interactions
 */

import { Feedback } from '../components/feedback.js';
import { QuizCard } from '../components/quiz-card.js';
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
    this.exerciseDefinitions = dependencies.exerciseDefinitions;
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
      container: document.getElementById('quiz-container'),
      title: document.getElementById('quiz-title'),
      progressBar: document.getElementById('quiz-progress-bar'),
      progressText: document.getElementById('quiz-progress-text'),
      closeBtn: document.getElementById('back-to-selection'),
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
      const exerciseTitle = this.exerciseDefinitions?.[exerciseType]?.title || exerciseType;
      showError(`Không tìm thấy dữ liệu cho bài tập "${exerciseTitle}"`);
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
      title: this.exerciseDefinitions?.[exerciseType]?.title || exerciseType,
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
   * Show quiz as full page
   */
  showQuiz() {
    // Hide all pages first
    document.querySelectorAll('.page').forEach(page => {
      page.classList.add('hidden');
    });

    // Hide navigation
    const header = document.querySelector('header');
    if (header) {
      header.classList.add('hidden');
    }

    // Show quiz container as full page
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
      quizContainer.classList.remove('hidden');
      quizContainer.classList.add('quiz-active');
    }

    // Update title
    const quizTitle = document.getElementById('quiz-title');
    if (quizTitle) {
      quizTitle.textContent = this.currentQuiz.title;
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    console.log('📱 Quiz shown as full page');
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
      const input = document.getElementById('answer-input');
      if (input) {
        input.focus();
      }
    }, 100);
  }

  /**
   * Update progress bar with smooth animations
   */
  updateProgress() {
    const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    const currentQuestion = this.currentQuestionIndex + 1;
    const totalQuestions = this.questions.length;

    // Animate progress bar
    if (this.elements.progressBar) {
      this.elements.progressBar.style.transition = 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      this.elements.progressBar.style.width = `${progress}%`;

      // Add pulse effect when reaching milestones
      if (progress === 25 || progress === 50 || progress === 75 || progress === 100) {
        this.elements.progressBar.classList.add('animate-pulse');
        setTimeout(() => {
          this.elements.progressBar.classList.remove('animate-pulse');
        }, 1000);
      }
    }

    // Animate progress text with count-up effect
    if (this.elements.progressText) {
      const currentText = this.elements.progressText.textContent;
      const newText = `${currentQuestion}/${totalQuestions}`;

      if (currentText !== newText) {
        // Fade out old text
        this.elements.progressText.style.transition = 'opacity 0.2s ease';
        this.elements.progressText.style.opacity = '0';

        // Update and fade in new text
        setTimeout(() => {
          this.elements.progressText.textContent = newText;
          this.elements.progressText.style.opacity = '1';
        }, 200);
      }
    }

    // Update quiz title with question number
    const quizTitle = document.getElementById('quiz-title');
    if (quizTitle && this.currentQuiz) {
      const baseTitle = this.currentQuiz.title;
      const questionInfo = ` - Câu ${currentQuestion}`;

      // Only update if different
      if (!quizTitle.textContent.includes(questionInfo)) {
        quizTitle.style.transition = 'opacity 0.3s ease';
        quizTitle.style.opacity = '0.7';

        setTimeout(() => {
          quizTitle.textContent = baseTitle + questionInfo;
          quizTitle.style.opacity = '1';
        }, 150);
      }
    }
  }

  /**
   * Render question card with enhanced animations
   */
  renderQuestionCard(question) {
    // Add slide-out animation to current content
    const questionCard = document.querySelector('#quiz-container .bg-white');
    if (questionCard) {
      questionCard.classList.add('animate-slide-out');

      // Wait for slide-out to complete, then update content
      setTimeout(() => {
        this.updateQuestionContent(question);
        questionCard.classList.remove('animate-slide-out');
        questionCard.classList.add('animate-slide-in');

        // Remove animation class after completion
        setTimeout(() => {
          questionCard.classList.remove('animate-slide-in');
        }, 300);
      }, 150);
    } else {
      // Fallback if no animation container found
      this.updateQuestionContent(question);
    }
  }

  /**
   * Update question content
   */
  updateQuestionContent(question) {
    // Update question text
    const questionTextEl = document.getElementById('question-text');
    if (questionTextEl) {
      questionTextEl.textContent = 'Chuyển câu sau sang thể thường:';
    }

    // Update Japanese sentence with fade-in
    const japaneseSentenceEl = document.getElementById('japanese-sentence');
    if (japaneseSentenceEl) {
      japaneseSentenceEl.style.opacity = '0';
      japaneseSentenceEl.textContent = question.question;
      this.fadeIn(japaneseSentenceEl, 200);
    }

    // Update Vietnamese meaning with fade-in
    const vietnameseMeaningEl = document.getElementById('vietnamese-meaning');
    if (vietnameseMeaningEl) {
      vietnameseMeaningEl.style.opacity = '0';
      vietnameseMeaningEl.textContent = question.meaning;
      this.fadeIn(vietnameseMeaningEl, 300);
    }

    // Update sentence prefix with fade-in
    const sentencePrefixEl = document.getElementById('sentence-prefix');
    if (sentencePrefixEl) {
      sentencePrefixEl.style.opacity = '0';
      sentencePrefixEl.textContent = question.prefix || this.extractPrefix(question.question);
      this.fadeIn(sentencePrefixEl, 400);
    }

    // Reset answer input with enhanced styling
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
      answerInput.value = '';
      answerInput.disabled = false;
      answerInput.classList.remove('correct', 'incorrect', 'animate-shake', 'animate-pulse-success');
      answerInput.style.transform = 'scale(1)';
      answerInput.style.transition = 'all 0.3s ease';
    }

    // Reset buttons with smooth transitions
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');

    if (checkBtn) {
      checkBtn.style.display = 'inline-flex';
      checkBtn.style.opacity = '0';
      this.fadeIn(checkBtn, 500);
    }

    if (nextBtn) {
      nextBtn.style.display = 'none';
      nextBtn.style.opacity = '0';
    }

    // Clear feedback with fade-out
    const feedbackEl = document.getElementById('feedback');
    if (feedbackEl) {
      this.fadeOut(feedbackEl, 100, () => {
        feedbackEl.innerHTML = '';
      });
    }

    // Setup card event listeners
    this.setupQuestionCardListeners();
  }

  /**
   * Setup question card event listeners
   */
  setupQuestionCardListeners() {
    const submitBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const input = document.getElementById('answer-input');

    if (submitBtn) {
      // Remove existing listeners
      submitBtn.replaceWith(submitBtn.cloneNode(true));
      const newSubmitBtn = document.getElementById('check-btn');
      newSubmitBtn.addEventListener('click', () => this.handleSubmitAnswer());
    }

    if (nextBtn) {
      // Remove existing listeners
      nextBtn.replaceWith(nextBtn.cloneNode(true));
      const newNextBtn = document.getElementById('next-btn');
      newNextBtn.addEventListener('click', () => this.nextQuestion());
    }

    if (input) {
      // Remove existing listeners
      input.replaceWith(input.cloneNode(true));
      const newInput = document.getElementById('answer-input');
      newInput.addEventListener('keydown', (e) => {
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

    const input = document.getElementById('answer-input');
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
    const feedbackContainer = document.getElementById('feedback');
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
   * Update question UI after answer with enhanced animations
   */
  updateQuestionUI(isCorrect) {
    const submitBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const input = document.getElementById('answer-input');

    // Animate input based on correctness
    if (input) {
      input.disabled = true;

      if (isCorrect) {
        // Success animation
        input.classList.add('correct', 'animate-pulse-success');
        input.style.transform = 'scale(1.02)';

        // Add celebration effect
        this.showCelebrationEffect();
      } else {
        // Error animation
        input.classList.add('incorrect', 'animate-shake');

        // Gentle shake effect
        setTimeout(() => {
          input.classList.remove('animate-shake');
        }, 600);
      }
    }

    // Smooth button transitions
    if (submitBtn) {
      this.fadeOut(submitBtn, 200, () => {
        submitBtn.style.display = 'none';
      });
    }

    if (nextBtn) {
      setTimeout(() => {
        nextBtn.style.display = 'inline-flex';
        nextBtn.style.opacity = '0';
        this.fadeIn(nextBtn, 300);

        // Focus with delay for better UX
        setTimeout(() => {
          nextBtn.focus();
        }, 100);
      }, 250);
    }
  }

  /**
   * Animation helper methods
   */
  fadeIn(element, delay = 0) {
    setTimeout(() => {
      element.style.transition = 'opacity 0.3s ease';
      element.style.opacity = '1';
    }, delay);
  }

  fadeOut(element, delay = 0, callback = null) {
    setTimeout(() => {
      element.style.transition = 'opacity 0.3s ease';
      element.style.opacity = '0';

      if (callback) {
        setTimeout(callback, 300);
      }
    }, delay);
  }

  typeText(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;

    const typeInterval = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;

      if (i >= text.length) {
        clearInterval(typeInterval);
      }
    }, speed);
  }

  showCelebrationEffect() {
    // Create celebration particles
    const questionCard = document.querySelector('#quiz-container .bg-white');
    if (!questionCard) return;

    // Add celebration class for CSS animation
    questionCard.classList.add('celebrate');

    // Remove after animation
    setTimeout(() => {
      questionCard.classList.remove('celebrate');
    }, 1000);

    // Create floating success icon
    const successIcon = document.createElement('div');
    successIcon.className = 'success-float';
    successIcon.innerHTML = '<i class="fas fa-check-circle text-4xl text-green-500"></i>';
    successIcon.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      animation: floatUp 1s ease-out forwards;
      pointer-events: none;
    `;

    questionCard.style.position = 'relative';
    questionCard.appendChild(successIcon);

    // Remove after animation
    setTimeout(() => {
      if (successIcon.parentNode) {
        successIcon.parentNode.removeChild(successIcon);
      }
    }, 1000);
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
   * Show results modal with enhanced animations
   */
  showResults(results) {
    const resultsModal = document.getElementById('results-modal');
    if (!resultsModal) return;

    const { correct, total, accuracy, wrongAnswers } = results;

    // Create enhanced results HTML with animations
    const resultHTML = `
      <div class="text-center animate-bounce-in">
        <!-- Animated Achievement Icon -->
        <div class="text-8xl mb-6 animate-bounce-in" style="animation-delay: 0.2s;">
          ${this.getAchievementIcon(accuracy)}
        </div>

        <!-- Title with gradient -->
        <h2 class="text-4xl font-bold mb-4 gradient-text animate-slide-up" style="animation-delay: 0.4s;">
          ${this.getResultTitle(accuracy)}
        </h2>

        <!-- Main Score with count-up animation -->
        <div class="text-5xl font-bold mb-3 animate-slide-up" style="animation-delay: 0.6s;" id="animated-score">
          0/${total}
        </div>

        <!-- Result Message -->
        <div class="text-lg text-gray-600 dark:text-gray-400 mb-8 animate-fade-in" style="animation-delay: 0.8s;">
          ${this.getResultMessage(accuracy)}
        </div>

        <!-- Enhanced Stats Grid -->
        <div class="grid grid-cols-3 gap-6 mb-8">
          <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl animate-slide-up" style="animation-delay: 1s;">
            <div class="text-3xl font-bold text-green-500 mb-1" id="correct-count-animated">0</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Câu Đúng</div>
            <div class="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mt-2">
              <div class="bg-green-500 h-2 rounded-full transition-all duration-1000" style="width: ${(correct / total) * 100}%"></div>
            </div>
          </div>

          <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl animate-slide-up" style="animation-delay: 1.2s;">
            <div class="text-3xl font-bold text-red-500 mb-1" id="wrong-count-animated">0</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Câu Sai</div>
            <div class="w-full bg-red-200 dark:bg-red-800 rounded-full h-2 mt-2">
              <div class="bg-red-500 h-2 rounded-full transition-all duration-1000" style="width: ${(results.wrong / total) * 100}%"></div>
            </div>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl animate-slide-up" style="animation-delay: 1.4s;">
            <div class="text-3xl font-bold text-blue-500 mb-1" id="accuracy-animated">0%</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Độ Chính Xác</div>
            <div class="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
              <div class="bg-blue-500 h-2 rounded-full transition-all duration-1000" style="width: ${accuracy}%"></div>
            </div>
          </div>
        </div>

        <!-- Action Buttons with staggered animation -->
        <div class="flex flex-col sm:flex-row gap-4 animate-fade-in" style="animation-delay: 1.6s;">
          <button onclick="window.app.quiz.retryQuiz()"
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <i class="fas fa-redo mr-2"></i>Làm Lại
          </button>

          <button onclick="window.app.quiz.closeResults()"
                  class="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <i class="fas fa-arrow-left mr-2"></i>Quay Lại
          </button>

          ${wrongAnswers.length > 0 ? `
            <button onclick="window.app.quiz.reviewWrongAnswers()"
                    class="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <i class="fas fa-book mr-2"></i>Ôn ${wrongAnswers.length} Câu Sai
            </button>
          ` : ''}
        </div>
      </div>
    `;

    // Update modal content
    const modalContent = resultsModal.querySelector('div.bg-white');
    if (modalContent) {
      modalContent.innerHTML = resultHTML;
    }

    // Hide quiz container with fade-out
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
      quizContainer.style.transition = 'opacity 0.3s ease';
      quizContainer.style.opacity = '0';

      setTimeout(() => {
        quizContainer.classList.add('hidden');
        quizContainer.classList.remove('quiz-active');
        quizContainer.style.opacity = '1';
      }, 300);
    }

    // Show results modal with animation
    resultsModal.classList.remove('hidden');
    resultsModal.style.opacity = '0';
    resultsModal.style.transition = 'opacity 0.3s ease';

    setTimeout(() => {
      resultsModal.style.opacity = '1';

      // Start count-up animations
      this.animateCountUp('animated-score', 0, correct, total, 1000);
      this.animateCountUp('correct-count-animated', 0, correct, null, 1200);
      this.animateCountUp('wrong-count-animated', 0, results.wrong, null, 1400);
      this.animateCountUp('accuracy-animated', 0, accuracy, '%', 1600);
    }, 100);
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
   * Get achievement icon based on accuracy
   */
  getAchievementIcon(accuracy) {
    if (accuracy >= 95) return '🏆';
    if (accuracy >= 90) return '🎉';
    if (accuracy >= 80) return '⭐';
    if (accuracy >= 70) return '👍';
    if (accuracy >= 60) return '😊';
    if (accuracy >= 50) return '🤔';
    return '💪';
  }

  /**
   * Get result title based on accuracy
   */
  getResultTitle(accuracy) {
    if (accuracy >= 95) return 'Hoàn Hảo!';
    if (accuracy >= 90) return 'Xuất Sắc!';
    if (accuracy >= 80) return 'Rất Tốt!';
    if (accuracy >= 70) return 'Tốt!';
    if (accuracy >= 60) return 'Khá Tốt!';
    if (accuracy >= 50) return 'Hoàn Thành!';
    return 'Cần Cố Gắng!';
  }

  /**
   * Animate count-up effect
   */
  animateCountUp(elementId, start, end, suffix = null, delay = 0) {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const duration = 1000;
      const startTime = Date.now();
      const range = end - start;

      const updateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (range * easeOut));

        if (suffix === null) {
          element.textContent = current;
        } else if (typeof suffix === 'string') {
          element.textContent = current + suffix;
        } else {
          element.textContent = `${current}/${suffix}`;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      updateCount();
    }, delay);
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

    // Show navigation again
    const header = document.querySelector('header');
    if (header) {
      header.classList.remove('hidden');
    }

    // Show practice page again
    const practicePage = document.getElementById('practice-page');
    if (practicePage) {
      practicePage.classList.remove('hidden');
    }

    // Restore body scroll
    document.body.style.overflow = '';

    // Dispatch event to notify app
    document.dispatchEvent(new CustomEvent('quiz:closed'));
  }



  /**
   * Close quiz
   */
  closeQuiz() {
    console.log('❌ Closing quiz');

    // Hide quiz container
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
      quizContainer.classList.add('hidden');
      quizContainer.classList.remove('quiz-active');
    }

    // Show navigation again
    const header = document.querySelector('header');
    if (header) {
      header.classList.remove('hidden');
    }

    // Show practice page again
    const practicePage = document.getElementById('practice-page');
    if (practicePage) {
      practicePage.classList.remove('hidden');
    }

    // Restore body scroll
    document.body.style.overflow = '';

    // Mark as inactive
    this.isQuizActive = false;

    // Reset state
    this.currentQuiz = null;
    this.questions = [];
    this.currentQuestionIndex = 0;

    // Dispatch event to notify app
    document.dispatchEvent(new CustomEvent('quiz:closed'));
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