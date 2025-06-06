/**
 * Statistics Renderer - Renders statistics content based on old-source.html design
 * Displays comprehensive learning statistics and progress
 */

export class StatisticsRenderer {
  constructor() {
    this.storageManager = null;
    this.statsManager = null;
  }

  /**
   * Initialize with dependencies
   */
  init(storageManager, statsManager) {
    this.storageManager = storageManager;
    this.statsManager = statsManager;
  }

  /**
   * Render statistics content exactly like old-source.html
   */
  renderStatisticsContent() {
    const container = document.getElementById('statistics-content');
    if (!container) {
      console.warn('Statistics content container not found');
      return;
    }

    const stats = this.getComprehensiveStats();

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Overall Statistics -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <i class="fas fa-chart-line mr-2 text-blue-500"></i>Thống Kê Tổng Quan
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-500">${stats.totalQuestions}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Tổng Câu Hỏi</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-500">${stats.totalCorrect}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Câu Đúng</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-500">${stats.accuracy}%</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Độ Chính Xác</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-orange-500">${stats.maxStreak}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Chuỗi Dài Nhất</div>
            </div>
          </div>
        </div>

        <!-- Progress by Exercise Type -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <i class="fas fa-tasks mr-2 text-green-500"></i>Tiến Độ Theo Bài Tập
          </h3>
          <div class="space-y-3">
            ${this.renderExerciseProgress(stats.exerciseProgress)}
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <i class="fas fa-clock mr-2 text-purple-500"></i>Hoạt Động Gần Đây
          </h3>
          <div class="space-y-2">
            ${this.renderRecentActivity(stats.recentActivity)}
          </div>
        </div>

        <!-- Learning Streak -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <i class="fas fa-fire mr-2 text-red-500"></i>Chuỗi Học Tập
          </h3>
          <div class="text-center">
            <div class="text-4xl font-bold text-red-500 mb-2">${stats.currentStreak}</div>
            <div class="text-gray-600 dark:text-gray-400">Ngày liên tiếp</div>
            <div class="mt-4 text-sm text-gray-500">
              Chuỗi dài nhất: ${stats.maxStreak} ngày
            </div>
          </div>
        </div>

        <!-- Wrong Answers Summary -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <i class="fas fa-exclamation-triangle mr-2 text-yellow-500"></i>Câu Sai Cần Ôn
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-2xl font-bold text-yellow-500">${stats.wrongAnswers.total}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Tổng Câu Sai</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-red-500">${stats.wrongAnswers.recent}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Câu Sai Tuần Này</div>
            </div>
          </div>
          ${stats.wrongAnswers.total > 0 ? `
            <button onclick="window.app.navigation.navigateTo('review')" class="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors">
              <i class="fas fa-book mr-2"></i>Ôn Tập Ngay
            </button>
          ` : ''}
        </div>

        <!-- Data Management -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <i class="fas fa-database mr-2 text-gray-500"></i>Quản Lý Dữ Liệu
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onclick="window.app.exportData()" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              <i class="fas fa-download mr-2"></i>Xuất Dữ Liệu
            </button>
            <button onclick="window.app.importData()" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
              <i class="fas fa-upload mr-2"></i>Nhập Dữ Liệu
            </button>
            <button onclick="window.app.resetData()" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
              <i class="fas fa-trash mr-2"></i>Xóa Tất Cả
            </button>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            <i class="fas fa-info-circle mr-1"></i>
            Dữ liệu được lưu trữ cục bộ trên thiết bị của bạn
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render exercise progress bars
   */
  renderExerciseProgress(exerciseProgress) {
    if (!exerciseProgress || Object.keys(exerciseProgress).length === 0) {
      return '<div class="text-gray-500 text-center py-4">Chưa có dữ liệu bài tập</div>';
    }

    return Object.entries(exerciseProgress).map(([exerciseKey, progress]) => {
      const exerciseName = this.getExerciseDisplayName(exerciseKey);
      const percentage = Math.min(100, Math.max(0, progress.accuracy || 0));
      const attempts = progress.attempts || 0;
      
      return `
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm font-medium">${exerciseName}</span>
              <span class="text-sm text-gray-500">${percentage}% (${attempts} lần)</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                   style="width: ${percentage}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render recent activity
   */
  renderRecentActivity(recentActivity) {
    if (!recentActivity || recentActivity.length === 0) {
      return '<div class="text-gray-500 text-center py-4">Chưa có hoạt động gần đây</div>';
    }

    return recentActivity.slice(0, 5).map(activity => `
      <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
        <div class="flex items-center space-x-3">
          <i class="fas fa-${this.getActivityIcon(activity.type)} text-blue-500"></i>
          <div>
            <div class="text-sm font-medium">${activity.description}</div>
            <div class="text-xs text-gray-500">${this.formatActivityTime(activity.timestamp)}</div>
          </div>
        </div>
        <div class="text-sm text-gray-500">
          ${activity.score ? `${activity.score}%` : ''}
        </div>
      </div>
    `).join('');
  }

  /**
   * Get comprehensive statistics
   */
  getComprehensiveStats() {
    const globalStats = this.statsManager ? this.statsManager.getGlobalStats() : {};
    const wrongAnswers = this.storageManager ? this.storageManager.getWrongAnswers() : [];
    
    // Calculate wrong answers stats
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentWrongAnswers = wrongAnswers.filter(item => {
      if (!item.timestamp) return false;
      return new Date(item.timestamp) > weekAgo;
    }).length;

    // Get exercise progress
    const exerciseProgress = globalStats.exerciseProgress || {};

    // Generate recent activity (mock data for now)
    const recentActivity = this.generateRecentActivity();

    return {
      totalQuestions: globalStats.totalQuestions || 0,
      totalCorrect: globalStats.totalCorrect || 0,
      accuracy: globalStats.totalQuestions > 0 ? 
        Math.round((globalStats.totalCorrect / globalStats.totalQuestions) * 100) : 0,
      maxStreak: globalStats.maxStreak || 0,
      currentStreak: globalStats.currentStreak || 0,
      exerciseProgress,
      wrongAnswers: {
        total: wrongAnswers.length,
        recent: recentWrongAnswers
      },
      recentActivity
    };
  }

  /**
   * Generate recent activity (placeholder)
   */
  generateRecentActivity() {
    // This would be replaced with actual activity tracking
    return [
      {
        type: 'quiz',
        description: 'Hoàn thành bài tập Động từ hiện tại',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        score: 85
      },
      {
        type: 'review',
        description: 'Ôn tập 5 câu sai',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        score: 100
      }
    ];
  }

  /**
   * Get exercise display name
   */
  getExerciseDisplayName(exerciseKey) {
    const names = {
      'verbs-present': 'Động từ hiện tại',
      'verbs-past': 'Động từ quá khứ',
      'verbs-negative': 'Động từ phủ định',
      'verbs-past-negative': 'Động từ quá khứ phủ định',
      'adjectives-i': 'Tính từ い',
      'adjectives-na': 'Tính từ な',
      'nouns': 'Danh từ'
    };
    return names[exerciseKey] || exerciseKey;
  }

  /**
   * Get activity icon
   */
  getActivityIcon(type) {
    const icons = {
      quiz: 'pencil-alt',
      review: 'book',
      achievement: 'trophy',
      streak: 'fire'
    };
    return icons[type] || 'circle';
  }

  /**
   * Format activity timestamp
   */
  formatActivityTime(timestamp) {
    if (!timestamp) return 'Không rõ thời gian';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} phút trước`;
      } else if (diffHours < 24) {
        return `${diffHours} giờ trước`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} ngày trước`;
      }
    } catch (error) {
      return 'Không rõ thời gian';
    }
  }
}
