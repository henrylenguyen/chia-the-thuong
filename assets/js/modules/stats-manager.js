/**
 * Stats Manager Module
 * Handles user statistics, progress tracking, and achievements
 */

import { StorageManager } from './storage-manager.js';
import { EXERCISE_DEFINITIONS } from '../utils/constants.js';

export class StatsManager {
  constructor() {
    this.storageManager = new StorageManager();
    this.globalStats = this.loadGlobalStats();
    this.sessionStats = this.initSessionStats();
    this.exerciseProgress = this.loadExerciseProgress();
    this.achievements = this.loadAchievements();
    this.streakHistory = this.loadStreakHistory();
  }

  /**
   * Initialize stats manager
   */
  init() {
    console.log('📊 Initializing Stats Manager...');

    // Update last accessed time
    this.globalStats.lastAccessed = new Date().toISOString();
    this.saveGlobalStats();

    console.log('✅ Stats Manager initialized:', {
      totalQuestions: this.globalStats.totalQuestions,
      totalCorrect: this.globalStats.totalCorrect,
      maxStreak: this.globalStats.maxStreak,
      achievements: Object.keys(this.achievements).length
    });
  }

  /**
   * Load global statistics from storage
   */
  loadGlobalStats() {
    const defaultStats = {
      totalQuestions: 0,
      totalCorrect: 0,
      totalWrong: 0,
      maxStreak: 0,
      currentStreak: 0,
      totalTimeSpent: 0, // in milliseconds
      averageAccuracy: 0,
      sessionsCompleted: 0,
      lastAccessed: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    return this.storageManager.get('globalStats', defaultStats);
  }

  /**
   * Save global statistics
   */
  saveGlobalStats() {
    this.storageManager.set('globalStats', this.globalStats);
  }

  /**
   * Initialize session statistics
   */
  initSessionStats() {
    return {
      correct: 0,
      wrong: 0,
      total: 0,
      streak: 0,
      startTime: Date.now(),
      timeSpent: 0,
      questionsPerMinute: 0
    };
  }

  /**
   * Load exercise progress
   */
  loadExerciseProgress() {
    return this.storageManager.get('exerciseProgress', {});
  }

  /**
   * Save exercise progress
   */
  saveExerciseProgress() {
    this.storageManager.set('exerciseProgress', this.exerciseProgress);
  }

  /**
   * Load achievements
   */
  loadAchievements() {
    const defaultAchievements = {
      firstCorrect: { unlocked: false, date: null },
      streak5: { unlocked: false, date: null },
      streak10: { unlocked: false, date: null },
      streak25: { unlocked: false, date: null },
      accuracy90: { unlocked: false, date: null },
      complete100: { unlocked: false, date: null },
      complete500: { unlocked: false, date: null },
      complete1000: { unlocked: false, date: null },
      perfectExercise: { unlocked: false, date: null },
      speedDemon: { unlocked: false, date: null }, // Complete exercise in under 5 minutes
      dedicated: { unlocked: false, date: null }, // 7 days streak
      master: { unlocked: false, date: null } // Complete all exercises
    };

    return this.storageManager.get('achievements', defaultAchievements);
  }

  /**
   * Save achievements
   */
  saveAchievements() {
    this.storageManager.set('achievements', this.achievements);
  }

  /**
   * Load streak history
   */
  loadStreakHistory() {
    return this.storageManager.get('streakHistory', []);
  }

  /**
   * Save streak history
   */
  saveStreakHistory() {
    this.storageManager.set('streakHistory', this.streakHistory);
  }

  /**
   * Update session statistics
   */
  updateSessionStats(results) {
    console.log('📊 Updating session stats:', results);

    const { correct, wrong, total, timeSpent, exerciseType } = results;

    // Update session stats
    this.sessionStats.correct += correct;
    this.sessionStats.wrong += wrong;
    this.sessionStats.total += total;
    this.sessionStats.timeSpent += timeSpent || 0;

    // Update streak
    if (correct === total && total > 0) {
      // Perfect score
      this.sessionStats.streak += total;
    } else if (correct > 0) {
      // Partial correct answers
      this.sessionStats.streak += correct;
    }

    // Calculate questions per minute
    const timeInMinutes = this.sessionStats.timeSpent / (1000 * 60);
    this.sessionStats.questionsPerMinute = timeInMinutes > 0
      ? Math.round((this.sessionStats.total / timeInMinutes) * 10) / 10
      : 0;

    // Update global stats
    this.updateGlobalStats(results);

    // Check for achievements
    this.checkAchievements(results);

    // Save all stats
    this.saveGlobalStats();
    this.saveAchievements();

    console.log('✅ Session stats updated:', this.sessionStats);
  }

  /**
   * Update global statistics
   */
  updateGlobalStats(results) {
    const { correct, wrong, total, timeSpent } = results;

    this.globalStats.totalQuestions += total;
    this.globalStats.totalCorrect += correct;
    this.globalStats.totalWrong += wrong;
    this.globalStats.totalTimeSpent += timeSpent || 0;
    this.globalStats.sessionsCompleted++;

    // Update max streak
    this.globalStats.maxStreak = Math.max(this.globalStats.maxStreak, this.sessionStats.streak);
    this.globalStats.currentStreak = this.sessionStats.streak;

    // Calculate average accuracy
    this.globalStats.averageAccuracy = this.globalStats.totalQuestions > 0
      ? Math.round((this.globalStats.totalCorrect / this.globalStats.totalQuestions) * 100)
      : 0;

    // Record streak in history
    if (this.sessionStats.streak > 0) {
      this.recordStreak(this.sessionStats.streak);
    }
  }

  /**
   * Update exercise progress
   */
  updateExerciseProgress(exerciseType, correctAnswers) {
    if (!exerciseType || exerciseType === 'review') return;

    console.log(`📈 Updating progress for ${exerciseType}: +${correctAnswers}`);

    if (!this.exerciseProgress[exerciseType]) {
      this.exerciseProgress[exerciseType] = 0;
    }

    this.exerciseProgress[exerciseType] += correctAnswers;
    this.saveExerciseProgress();

    // Check if exercise is completed
    const exerciseData = EXERCISE_DEFINITIONS[exerciseType];
    if (exerciseData) {
      console.log(`✅ ${exerciseData.title}: ${this.exerciseProgress[exerciseType]} completed`);
    }
  }

  /**
   * Record streak in history
   */
  recordStreak(streak) {
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = this.streakHistory.find(entry => entry.date === today);

    if (existingEntry) {
      existingEntry.streak = Math.max(existingEntry.streak, streak);
    } else {
      this.streakHistory.push({
        date: today,
        streak: streak,
        timestamp: new Date().toISOString()
      });
    }

    // Keep only last 30 days
    this.streakHistory = this.streakHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30);

    this.saveStreakHistory();
  }

  /**
   * Check and unlock achievements
   */
  checkAchievements(results) {
    const newAchievements = [];

    // First correct answer
    if (!this.achievements.firstCorrect.unlocked && results.correct > 0) {
      this.unlockAchievement('firstCorrect');
      newAchievements.push('firstCorrect');
    }

    // Streak achievements
    const streak = this.sessionStats.streak;
    if (!this.achievements.streak5.unlocked && streak >= 5) {
      this.unlockAchievement('streak5');
      newAchievements.push('streak5');
    }
    if (!this.achievements.streak10.unlocked && streak >= 10) {
      this.unlockAchievement('streak10');
      newAchievements.push('streak10');
    }
    if (!this.achievements.streak25.unlocked && streak >= 25) {
      this.unlockAchievement('streak25');
      newAchievements.push('streak25');
    }

    // Accuracy achievement
    if (!this.achievements.accuracy90.unlocked && this.globalStats.averageAccuracy >= 90) {
      this.unlockAchievement('accuracy90');
      newAchievements.push('accuracy90');
    }

    // Total questions milestones
    const total = this.globalStats.totalQuestions;
    if (!this.achievements.complete100.unlocked && total >= 100) {
      this.unlockAchievement('complete100');
      newAchievements.push('complete100');
    }
    if (!this.achievements.complete500.unlocked && total >= 500) {
      this.unlockAchievement('complete500');
      newAchievements.push('complete500');
    }
    if (!this.achievements.complete1000.unlocked && total >= 1000) {
      this.unlockAchievement('complete1000');
      newAchievements.push('complete1000');
    }

    // Perfect exercise (100% accuracy)
    if (!this.achievements.perfectExercise.unlocked &&
      results.total > 0 && results.correct === results.total) {
      this.unlockAchievement('perfectExercise');
      newAchievements.push('perfectExercise');
    }

    // Speed demon (complete exercise quickly)
    if (!this.achievements.speedDemon.unlocked &&
      results.timeSpent && results.timeSpent < 5 * 60 * 1000 &&
      results.total >= 10) {
      this.unlockAchievement('speedDemon');
      newAchievements.push('speedDemon');
    }

    // Master achievement (complete all exercises)
    if (!this.achievements.master.unlocked && this.checkMasterAchievement()) {
      this.unlockAchievement('master');
      newAchievements.push('master');
    }

    // Show notifications for new achievements
    if (newAchievements.length > 0) {
      this.showAchievementNotifications(newAchievements);
    }
  }

  /**
   * Check if master achievement should be unlocked
   */
  checkMasterAchievement() {
    const exerciseTypes = Object.keys(EXERCISE_DEFINITIONS);
    return exerciseTypes.every(type => {
      const progress = this.exerciseProgress[type] || 0;
      return progress >= 20; // Assume mastery at 20+ questions per exercise
    });
  }

  /**
   * Unlock achievement
   */
  unlockAchievement(achievementId) {
    this.achievements[achievementId] = {
      unlocked: true,
      date: new Date().toISOString()
    };

    console.log(`🏆 Achievement unlocked: ${achievementId}`);
  }

  /**
   * Show achievement notifications
   */
  showAchievementNotifications(achievements) {
    achievements.forEach(achievementId => {
      const notification = this.createAchievementNotification(achievementId);
      document.body.appendChild(notification);

      // Auto remove after 5 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 5000);
    });
  }

  /**
   * Create achievement notification element
   */
  createAchievementNotification(achievementId) {
    const achievementNames = {
      firstCorrect: '🎯 Câu Đầu Tiên',
      streak5: '🔥 Streak 5',
      streak10: '⚡ Streak 10',
      streak25: '💥 Streak 25',
      accuracy90: '🎯 Cao Thủ (90% độ chính xác)',
      complete100: '📚 Học Sinh Chăm Chỉ (100 câu)',
      complete500: '🏆 Chuyên Gia (500 câu)',
      complete1000: '👑 Bậc Thầy (1000 câu)',
      perfectExercise: '💯 Hoàn Hảo',
      speedDemon: '⚡ Tốc Độ Ánh Sáng',
      dedicated: '💪 Kiên Trì',
      master: '🌟 Đại Sư'
    };

    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">
                    <div class="achievement-title">Thành Tựu Mới!</div>
                    <div class="achievement-name">${achievementNames[achievementId]}</div>
                </div>
                <button class="achievement-close" onclick="this.closest('.achievement-notification').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    return notification;
  }

  /**
   * Get global statistics
   */
  getGlobalStats() {
    return {
      ...this.globalStats,
      accuracy: this.globalStats.averageAccuracy
    };
  }

  /**
   * Get session statistics
   */
  getSessionStats() {
    return { ...this.sessionStats };
  }

  /**
   * Get exercise progress
   */
  getExerciseProgress() {
    return { ...this.exerciseProgress };
  }

  /**
   * Get achievements
   */
  getAchievements() {
    return { ...this.achievements };
  }

  /**
   * Get detailed statistics
   */
  getDetailedStats() {
    const totalMinutes = this.globalStats.totalTimeSpent / (1000 * 60);
    const averageSessionTime = this.globalStats.sessionsCompleted > 0
      ? this.globalStats.totalTimeSpent / this.globalStats.sessionsCompleted / (1000 * 60)
      : 0;

    return {
      global: this.globalStats,
      session: this.sessionStats,
      exercises: this.exerciseProgress,
      achievements: this.achievements,
      streakHistory: this.streakHistory,
      computed: {
        totalHours: Math.round(totalMinutes / 60 * 10) / 10,
        averageSessionMinutes: Math.round(averageSessionTime * 10) / 10,
        questionsPerHour: totalMinutes > 0 ? Math.round(this.globalStats.totalQuestions / (totalMinutes / 60)) : 0,
        completedExercises: Object.values(this.exerciseProgress).filter(progress => progress >= 20).length,
        totalExercises: Object.keys(EXERCISE_DEFINITIONS).length,
        unlockedAchievements: Object.values(this.achievements).filter(a => a.unlocked).length,
        totalAchievements: Object.keys(this.achievements).length
      }
    };
  }

  /**
   * Reset session statistics
   */
  resetSessionStats() {
    this.sessionStats = this.initSessionStats();
    console.log('🔄 Session stats reset');
  }

  /**
   * Reset all statistics (for testing or fresh start)
   */
  resetAllStats() {
    if (!confirm('Bạn có chắc muốn xóa tất cả thống kê? Hành động này không thể hoàn tác!')) {
      return false;
    }

    this.globalStats = this.loadGlobalStats();
    this.sessionStats = this.initSessionStats();
    this.exerciseProgress = {};
    this.achievements = this.loadAchievements();
    this.streakHistory = [];

    // Clear from storage
    this.storageManager.remove('globalStats');
    this.storageManager.remove('exerciseProgress');
    this.storageManager.remove('achievements');
    this.storageManager.remove('streakHistory');

    console.log('🗑️ All statistics reset');
    return true;
  }

  /**
   * Export statistics for backup
   */
  exportStats() {
    const data = {
      globalStats: this.globalStats,
      exerciseProgress: this.exerciseProgress,
      achievements: this.achievements,
      streakHistory: this.streakHistory,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Import statistics from backup
   */
  importStats(jsonData) {
    try {
      const data = JSON.parse(jsonData);

      if (data.globalStats) this.globalStats = data.globalStats;
      if (data.exerciseProgress) this.exerciseProgress = data.exerciseProgress;
      if (data.achievements) this.achievements = data.achievements;
      if (data.streakHistory) this.streakHistory = data.streakHistory;

      // Save to storage
      this.saveGlobalStats();
      this.saveExerciseProgress();
      this.saveAchievements();
      this.saveStreakHistory();

      console.log('✅ Statistics imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to import statistics:', error);
      return false;
    }
  }
}