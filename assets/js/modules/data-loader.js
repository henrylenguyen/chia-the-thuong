/**
 * Data Loader Module
 * Handles loading and caching of JSON data files
 */

import { showError } from '../utils/helpers.js';

export class DataLoader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
  }

  /**
   * Load questions data
   */
  async loadQuestions() {
    return this.loadJSON('./questions.json', 'questions');
  }

  /**
   * Load answers data
   */
  async loadAnswers() {
    return this.loadJSON('./answers.json', 'answers');
  }

  /**
   * Generic JSON loader with caching
   */
  async loadJSON(url, cacheKey) {
    // Return cached data if available
    if (this.cache.has(cacheKey)) {
      console.log(`📋 Using cached data for: ${cacheKey}`);
      return this.cache.get(cacheKey);
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(cacheKey)) {
      console.log(`⏳ Waiting for existing load: ${cacheKey}`);
      return this.loadingPromises.get(cacheKey);
    }

    // Start new loading process
    const loadingPromise = this.fetchJSON(url, cacheKey);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const data = await loadingPromise;

      // Cache the result
      this.cache.set(cacheKey, data);

      // Clean up loading promise
      this.loadingPromises.delete(cacheKey);

      console.log(`✅ Loaded and cached: ${cacheKey}`, {
        url,
        dataKeys: Object.keys(data).length,
        totalItems: Object.values(data).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0)
      });

      return data;

    } catch (error) {
      // Clean up loading promise on error
      this.loadingPromises.delete(cacheKey);
      throw error;
    }
  }

  /**
   * Fetch JSON with proper error handling
   */
  async fetchJSON(url, cacheKey) {
    try {
      this.updateLoadingText(`Đang tải ${cacheKey}...`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate data structure
      this.validateData(data, cacheKey);

      return data;

    } catch (error) {
      console.error(`❌ Failed to load ${url}:`, error);

      if (error instanceof SyntaxError) {
        throw new Error(`File ${url} không phải là JSON hợp lệ`);
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Không thể kết nối đến ${url}. Vui lòng kiểm tra:\n• File có tồn tại không?\n• Server có đang chạy không?\n• Đường dẫn có đúng không?`);
      } else {
        throw new Error(`Không thể tải ${url}: ${error.message}`);
      }
    }
  }

  /**
   * Validate loaded data structure
   */
  validateData(data, cacheKey) {
    if (!data || typeof data !== 'object') {
      throw new Error(`Dữ liệu ${cacheKey} không hợp lệ: phải là object`);
    }

    if (cacheKey === 'questions') {
      this.validateQuestionsData(data);
    } else if (cacheKey === 'answers') {
      this.validateAnswersData(data);
    }
  }

  /**
   * Validate questions data structure
   */
  validateQuestionsData(data) {
    const requiredFields = ['question', 'meaning', 'prefix'];

    for (const [category, questions] of Object.entries(data)) {
      if (!Array.isArray(questions)) {
        throw new Error(`Danh mục "${category}" phải là mảng`);
      }

      questions.forEach((question, index) => {
        requiredFields.forEach(field => {
          if (!question.hasOwnProperty(field)) {
            throw new Error(`Câu hỏi ${index + 1} trong "${category}" thiếu trường "${field}"`);
          }
        });

        if (typeof question.question !== 'string' || !question.question.trim()) {
          throw new Error(`Câu hỏi ${index + 1} trong "${category}" có nội dung không hợp lệ`);
        }
      });
    }

    console.log(`✅ Questions data validated:`, {
      categories: Object.keys(data).length,
      totalQuestions: Object.values(data).reduce((sum, arr) => sum + arr.length, 0)
    });
  }

  /**
   * Validate answers data structure
   */
  validateAnswersData(data) {
    const requiredFields = ['answer'];

    for (const [category, answers] of Object.entries(data)) {
      if (!Array.isArray(answers)) {
        throw new Error(`Danh mục "${category}" phải là mảng`);
      }

      answers.forEach((answer, index) => {
        requiredFields.forEach(field => {
          if (!answer.hasOwnProperty(field)) {
            throw new Error(`Đáp án ${index + 1} trong "${category}" thiếu trường "${field}"`);
          }
        });

        if (typeof answer.answer !== 'string' || !answer.answer.trim()) {
          throw new Error(`Đáp án ${index + 1} trong "${category}" có nội dung không hợp lệ`);
        }
      });
    }

    console.log(`✅ Answers data validated:`, {
      categories: Object.keys(data).length,
      totalAnswers: Object.values(data).reduce((sum, arr) => sum + arr.length, 0)
    });
  }

  /**
   * Update loading screen text
   */
  updateLoadingText(text) {
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
      loadingText.textContent = text;
    }
  }

  /**
   * Check data consistency between questions and answers
   */
  validateDataConsistency(questionsData, answersData) {
    const questionCategories = Object.keys(questionsData);
    const answerCategories = Object.keys(answersData);

    // Check if all question categories have corresponding answers
    const missingAnswerCategories = questionCategories.filter(cat => !answerCategories.includes(cat));
    if (missingAnswerCategories.length > 0) {
      console.warn(`⚠️ Missing answer categories:`, missingAnswerCategories);
    }

    // Check if all answer categories have corresponding questions
    const missingQuestionCategories = answerCategories.filter(cat => !questionCategories.includes(cat));
    if (missingQuestionCategories.length > 0) {
      console.warn(`⚠️ Missing question categories:`, missingQuestionCategories);
    }

    // Check count consistency for each category
    const inconsistentCategories = [];
    questionCategories.forEach(category => {
      const questionCount = questionsData[category]?.length || 0;
      const answerCount = answersData[category]?.length || 0;

      if (questionCount !== answerCount) {
        inconsistentCategories.push({
          category,
          questions: questionCount,
          answers: answerCount
        });
      }
    });

    if (inconsistentCategories.length > 0) {
      console.warn(`⚠️ Inconsistent data counts:`, inconsistentCategories);
      throw new Error(`Số lượng câu hỏi và đáp án không khớp:\n${inconsistentCategories.map(item => `• ${item.category}: ${item.questions} câu hỏi vs ${item.answers} đáp án`).join('\n')}`);
    }

    console.log(`✅ Data consistency validated`);
    return true;
  }

  /**
   * Preload all data
   */
  async preloadAll() {
    try {
      console.log('🚀 Preloading all data...');

      const [questionsData, answersData] = await Promise.all([
        this.loadQuestions(),
        this.loadAnswers()
      ]);

      // Validate consistency
      this.validateDataConsistency(questionsData, answersData);

      console.log('✅ All data preloaded successfully');

      return { questionsData, answersData };

    } catch (error) {
      console.error('❌ Failed to preload data:', error);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  clearCache(cacheKey = null) {
    if (cacheKey) {
      this.cache.delete(cacheKey);
      console.log(`🗑️ Cleared cache for: ${cacheKey}`);
    } else {
      this.cache.clear();
      console.log(`🗑️ Cleared all cache`);
    }
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      loadingPromises: Array.from(this.loadingPromises.keys())
    };
  }

  /**
   * Retry failed loads
   */
  async retryLoad(cacheKey) {
    // Clear any existing cache/promises for this key
    this.cache.delete(cacheKey);
    this.loadingPromises.delete(cacheKey);

    // Determine URL based on cache key
    const urlMap = {
      'questions': './questions.json',
      'answers': './answers.json'
    };

    const url = urlMap[cacheKey];
    if (!url) {
      throw new Error(`Unknown cache key: ${cacheKey}`);
    }

    console.log(`🔄 Retrying load for: ${cacheKey}`);
    return this.loadJSON(url, cacheKey);
  }
}