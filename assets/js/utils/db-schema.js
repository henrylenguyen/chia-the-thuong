/**
 * Database Schema Definition for Japanese Learning App
 * Defines IndexedDB structure, stores, and indexes
 */

export const DB_SCHEMA = {
  name: 'JapaneseLearningApp',
  version: 1,
  stores: {
    // Global user statistics
    userStats: {
      keyPath: 'id',
      indexes: {
        lastUpdated: 'lastUpdated',
        totalQuestions: 'totalQuestions',
        accuracy: 'accuracy'
      }
    },

    // Progress tracking per exercise
    exerciseProgress: {
      keyPath: 'exerciseKey',
      indexes: {
        category: 'category',
        lastAccessed: 'lastAccessed',
        accuracy: 'accuracy',
        masteryLevel: 'masteryLevel',
        timeSpent: 'timeSpentTotal'
      }
    },

    // Wrong answers for review system
    wrongAnswers: {
      keyPath: 'id',
      autoIncrement: true,
      indexes: {
        exerciseKey: 'exerciseKey',
        timestamp: 'timestamp',
        difficulty: 'difficulty',
        reviewCount: 'reviewCount',
        mastered: 'masteredAt'
      }
    },

    // Achievement system
    achievements: {
      keyPath: 'id',
      indexes: {
        unlockedAt: 'unlockedAt',
        category: 'category',
        type: 'type'
      }
    },

    // Daily streak tracking
    streakHistory: {
      keyPath: 'date', // YYYY-MM-DD format
      indexes: {
        streakCount: 'streakCount',
        month: 'month',
        year: 'year',
        questionsAnswered: 'questionsAnswered'
      }
    },

    // User preferences and settings
    userPreferences: {
      keyPath: 'key'
    },

    // Offline data caching
    offlineData: {
      keyPath: 'key',
      indexes: {
        lastUpdated: 'lastUpdated',
        size: 'size',
        type: 'type'
      }
    },

    // Learning session history
    sessionHistory: {
      keyPath: 'id',
      autoIncrement: true,
      indexes: {
        date: 'date',
        exerciseKey: 'exerciseKey',
        duration: 'duration',
        accuracy: 'accuracy',
        questionsAnswered: 'questionsAnswered'
      }
    }
  }
};

/**
 * Data Models - TypeScript-like interfaces for documentation
 */

export const DATA_MODELS = {
  // Global statistics model
  UserStats: {
    id: 'global', // Always 'global' for singleton
    totalCorrect: 0,
    totalQuestions: 0,
    accuracy: 0.0, // Calculated field
    maxStreak: 0,
    currentStreak: 0,
    totalTimeSpent: 0, // seconds
    exercisesCompleted: 0,
    lastUpdated: new Date(),
    createdAt: new Date()
  },

  // Exercise progress tracking
  ExerciseProgress: {
    exerciseKey: 'verbs-present', // Primary key
    category: 'verbs',
    title: 'Present Tense Verbs',
    totalAttempts: 0,
    correctAnswers: 0,
    accuracy: 0.0,
    averageTime: 0.0, // seconds per question
    lastAccessed: new Date(),
    firstAccessed: new Date(),
    streakData: [], // Array of last 10 attempts (1=correct, 0=incorrect)
    difficultyRating: 'beginner', // beginner, intermediate, advanced
    masteryLevel: 0.0, // 0.0 to 1.0
    timeSpentTotal: 0, // seconds
    mistakePatterns: [], // Array of common mistake types
    isCompleted: false,
    completedAt: null
  },

  // Wrong answer for review
  WrongAnswer: {
    id: null, // Auto-increment
    exerciseKey: 'verbs-present',
    category: 'verbs',
    question: '食べる',
    userAnswer: '食べます',
    correctAnswer: '食べる',
    explanation: 'Present form, not polite form',
    timestamp: new Date(),
    reviewCount: 0,
    lastReviewed: null,
    masteredAt: null, // When user finally got it right
    difficulty: 'medium', // easy, medium, hard
    tags: ['present-tense', 'verbs'],
    context: {
      questionIndex: 5,
      totalQuestions: 20,
      sessionAccuracy: 0.8
    }
  },

  // Achievement/Badge
  Achievement: {
    id: 'first_perfect_score',
    title: 'Perfect Score!',
    description: 'Got 100% on your first exercise',
    icon: '🏆',
    category: 'accuracy',
    type: 'milestone', // milestone, streak, mastery, time
    unlockedAt: new Date(),
    progress: 1.0, // 0.0 to 1.0
    requirement: {
      type: 'accuracy',
      value: 1.0,
      exerciseCount: 1
    }
  },

  // Daily streak record
  StreakHistory: {
    date: '2024-01-15', // YYYY-MM-DD
    streakCount: 5,
    questionsAnswered: 25,
    accuracy: 0.85,
    timeSpent: 1800, // seconds
    exercisesCompleted: ['verbs-present', 'adjectives-i'],
    month: '2024-01',
    year: '2024',
    isActive: true
  },

  // User preference
  UserPreference: {
    key: 'theme',
    value: 'dark',
    type: 'string', // string, number, boolean, object
    lastUpdated: new Date()
  },

  // Offline cached data
  OfflineData: {
    key: 'questions-verbs-present',
    data: {}, // The actual cached data
    lastUpdated: new Date(),
    size: 1024, // bytes
    type: 'questions', // questions, answers, theory, exercises
    version: '1.0',
    expiresAt: new Date()
  },

  // Learning session record
  SessionHistory: {
    id: null, // Auto-increment
    date: new Date(),
    exerciseKey: 'verbs-present',
    category: 'verbs',
    duration: 900, // seconds
    questionsAnswered: 20,
    correctAnswers: 16,
    accuracy: 0.8,
    averageTimePerQuestion: 45, // seconds
    streakAchieved: 8,
    mistakeCount: 4,
    completedAt: new Date(),
    deviceType: 'mobile', // mobile, desktop, tablet
    sessionType: 'practice' // practice, review, test
  }
};

/**
 * Migration mappings from localStorage to IndexedDB
 */
export const MIGRATION_MAPPING = {
  // localStorage key -> IndexedDB store and transformation
  'globalStats': {
    store: 'userStats',
    key: 'global',
    transform: (data) => ({
      id: 'global',
      totalCorrect: data.totalCorrect || 0,
      totalQuestions: data.totalQuestions || 0,
      accuracy: data.totalQuestions > 0 ? data.totalCorrect / data.totalQuestions : 0,
      maxStreak: data.maxStreak || 0,
      currentStreak: 0, // Reset on migration
      totalTimeSpent: 0, // New field
      exercisesCompleted: Object.keys(data.exerciseProgress || {}).length,
      lastUpdated: new Date(),
      createdAt: new Date(data.lastAccessed || Date.now())
    })
  },

  'wrongAnswers': {
    store: 'wrongAnswers',
    transform: (data) => data.map((answer, index) => ({
      id: index + 1, // Simple ID assignment
      exerciseKey: answer.exercise || 'unknown',
      category: answer.exercise ? answer.exercise.split('-')[0] : 'unknown',
      question: answer.question || '',
      userAnswer: answer.userAnswer || '',
      correctAnswer: answer.correctAnswer || '',
      explanation: '', // New field
      timestamp: new Date(answer.timestamp || Date.now()),
      reviewCount: 0,
      lastReviewed: null,
      masteredAt: null,
      difficulty: 'medium', // Default
      tags: [],
      context: {}
    }))
  },

  'exerciseProgress': {
    store: 'exerciseProgress',
    transform: (data) => Object.entries(data).map(([key, progress]) => ({
      exerciseKey: key,
      category: key.split('-')[0],
      title: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      totalAttempts: progress || 0,
      correctAnswers: Math.floor((progress || 0) * 0.8), // Estimate
      accuracy: 0.8, // Default estimate
      averageTime: 30, // Default estimate
      lastAccessed: new Date(),
      firstAccessed: new Date(),
      streakData: [],
      difficultyRating: 'beginner',
      masteryLevel: Math.min((progress || 0) / 100, 1.0),
      timeSpentTotal: (progress || 0) * 30, // Estimate
      mistakePatterns: [],
      isCompleted: (progress || 0) >= 100,
      completedAt: (progress || 0) >= 100 ? new Date() : null
    }))
  }
};

/**
 * Default data for fresh installations
 */
export const DEFAULT_DATA = {
  userStats: {
    id: 'global',
    totalCorrect: 0,
    totalQuestions: 0,
    accuracy: 0,
    maxStreak: 0,
    currentStreak: 0,
    totalTimeSpent: 0,
    exercisesCompleted: 0,
    lastUpdated: new Date(),
    createdAt: new Date()
  },

  userPreferences: [
    { key: 'theme', value: 'light', type: 'string', lastUpdated: new Date() },
    { key: 'language', value: 'vi', type: 'string', lastUpdated: new Date() },
    { key: 'soundEnabled', value: true, type: 'boolean', lastUpdated: new Date() },
    { key: 'animationsEnabled', value: true, type: 'boolean', lastUpdated: new Date() },
    { key: 'autoAdvance', value: false, type: 'boolean', lastUpdated: new Date() }
  ]
};

/**
 * Utility functions for schema operations
 */
export const SCHEMA_UTILS = {
  /**
   * Get all store names
   */
  getStoreNames() {
    return Object.keys(DB_SCHEMA.stores);
  },

  /**
   * Get store configuration
   */
  getStoreConfig(storeName) {
    return DB_SCHEMA.stores[storeName];
  },

  /**
   * Validate data against model
   */
  validateData(storeName, data) {
    const model = DATA_MODELS[this.getModelName(storeName)];
    if (!model) return true; // No validation if no model

    // Basic validation - check required fields exist
    const requiredFields = Object.keys(model);
    const dataFields = Object.keys(data);
    
    return requiredFields.every(field => 
      dataFields.includes(field) || model[field] === null
    );
  },

  /**
   * Get model name from store name
   */
  getModelName(storeName) {
    const mapping = {
      userStats: 'UserStats',
      exerciseProgress: 'ExerciseProgress',
      wrongAnswers: 'WrongAnswer',
      achievements: 'Achievement',
      streakHistory: 'StreakHistory',
      userPreferences: 'UserPreference',
      offlineData: 'OfflineData',
      sessionHistory: 'SessionHistory'
    };
    return mapping[storeName];
  }
};
