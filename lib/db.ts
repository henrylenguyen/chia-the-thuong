/**
 * Dexie.js Database Setup
 * IndexedDB cho 2000+ câu hỏi N5 Japanese Learning
 */

import Dexie, { Table } from 'dexie';

// Types cho database
export interface Question {
  id?: number;
  form: 'te' | 'ta' | 'nai' | 'ru';
  polite: string;        // Thể lịch sự: たべます
  casual: string;        // Thể thường: たべる
  verb_type: 'ichidan' | 'godan' | 'irregular';
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: string;      // daily_life, work, family, etc.
  created_at: Date;
}

export interface UserProgress {
  id?: number;
  question_id: number;
  correct: boolean;
  attempts: number;
  last_attempt: Date;
  next_review: Date;     // Spaced repetition
  streak: number;
}

export interface Statistics {
  id?: number;
  form: 'te' | 'ta' | 'nai' | 'ru';
  total_questions: number;
  correct_answers: number;
  accuracy_rate: number;
  average_time: number;
  last_updated: Date;
}

export interface GrammarRule {
  id?: number;
  form: 'te' | 'ta' | 'nai' | 'ru';
  title: string;
  description: string;
  examples: Array<{
    polite: string;
    casual: string;
    explanation: string;
  }>;
  difficulty: number;
}

export interface UserSettings {
  id?: number;
  theme: 'light' | 'dark' | 'system';
  language: 'vi' | 'en';
  daily_goal: number;
  notifications: boolean;
  spaced_repetition: boolean;
}

export interface ReviewQueue {
  id?: number;
  question_id: number;
  priority: number;      // 1-5, higher = more urgent
  due_date: Date;
  review_count: number;
}

// Database class
export class JapaneseLearningDB extends Dexie {
  questions!: Table<Question>;
  user_progress!: Table<UserProgress>;
  statistics!: Table<Statistics>;
  grammar_rules!: Table<GrammarRule>;
  user_settings!: Table<UserSettings>;
  review_queue!: Table<ReviewQueue>;

  constructor() {
    super('JapaneseLearningDB');
    
    this.version(1).stores({
      // Indexes cho performance với large dataset
      questions: '++id, form, verb_type, difficulty, category',
      user_progress: '++id, question_id, correct, last_attempt, next_review',
      statistics: '++id, form, last_updated',
      grammar_rules: '++id, form, difficulty',
      user_settings: '++id',
      review_queue: '++id, question_id, priority, due_date'
    });
  }
}

// Database instance
export const db = new JapaneseLearningDB();

// Helper functions cho large dataset
export class DatabaseHelpers {
  
  /**
   * Get questions với pagination cho performance
   */
  static async getQuestionsPaginated(
    form: 'te' | 'ta' | 'nai' | 'ru',
    page: number = 1,
    limit: number = 50
  ) {
    const offset = (page - 1) * limit;
    
    return await db.questions
      .where('form')
      .equals(form)
      .offset(offset)
      .limit(limit)
      .toArray();
  }

  /**
   * Get random questions cho quiz
   */
  static async getRandomQuestions(
    form: 'te' | 'ta' | 'nai' | 'ru',
    count: number = 10
  ) {
    const totalQuestions = await db.questions
      .where('form')
      .equals(form)
      .count();
    
    const randomIds = Array.from(
      { length: count }, 
      () => Math.floor(Math.random() * totalQuestions)
    );
    
    return await db.questions
      .where('form')
      .equals(form)
      .offset(randomIds[0])
      .limit(count)
      .toArray();
  }

  /**
   * Bulk insert questions (cho 2000+ records)
   */
  static async bulkInsertQuestions(questions: Omit<Question, 'id'>[]) {
    try {
      await db.transaction('rw', db.questions, async () => {
        await db.questions.bulkAdd(questions);
      });
      console.log(`✅ Inserted ${questions.length} questions successfully`);
    } catch (error) {
      console.error('❌ Error inserting questions:', error);
      throw error;
    }
  }

  /**
   * Get statistics summary
   */
  static async getStatisticsSummary() {
    const stats = await db.statistics.toArray();
    const totalProgress = await db.user_progress.count();
    
    return {
      total_questions: await db.questions.count(),
      total_progress_records: totalProgress,
      forms_stats: stats,
      last_updated: new Date()
    };
  }

  /**
   * Clear all data (reset function)
   */
  static async clearAllData() {
    await db.transaction('rw', [
      db.questions,
      db.user_progress, 
      db.statistics,
      db.review_queue
    ], async () => {
      await db.questions.clear();
      await db.user_progress.clear();
      await db.statistics.clear();
      await db.review_queue.clear();
    });
  }

  /**
   * Export data cho backup
   */
  static async exportData() {
    const data = {
      questions: await db.questions.toArray(),
      user_progress: await db.user_progress.toArray(),
      statistics: await db.statistics.toArray(),
      user_settings: await db.user_settings.toArray(),
      exported_at: new Date().toISOString()
    };
    
    return data;
  }

  /**
   * Import data từ backup
   */
  static async importData(data: any) {
    await db.transaction('rw', [
      db.questions,
      db.user_progress,
      db.statistics,
      db.user_settings
    ], async () => {
      if (data.questions) await db.questions.bulkPut(data.questions);
      if (data.user_progress) await db.user_progress.bulkPut(data.user_progress);
      if (data.statistics) await db.statistics.bulkPut(data.statistics);
      if (data.user_settings) await db.user_settings.bulkPut(data.user_settings);
    });
  }
}

// Initialize database
export const initializeDatabase = async () => {
  try {
    await db.open();
    console.log('✅ Database initialized successfully');
    
    // Check if we have questions data
    const questionCount = await db.questions.count();
    console.log(`📊 Current questions in DB: ${questionCount}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    return false;
  }
};
