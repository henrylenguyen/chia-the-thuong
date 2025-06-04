/**
 * Application Constants
 * Central place for all app configuration and constant values
 */

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'Japanese Learning App',
  VERSION: '1.0.0',
  STORAGE_PREFIX: 'japaneseApp_',
  API_BASE_URL: null, // Not using API currently
  DEBUG: true,

  // Performance settings
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 300,
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds

  // Limits
  MAX_WRONG_ANSWERS: 100,
  MAX_HISTORY_LENGTH: 10,
  MAX_NOTIFICATIONS: 5,

  // Default settings
  DEFAULT_THEME: 'light',
  DEFAULT_LANGUAGE: 'vi',

  // File paths
  QUESTIONS_FILE: './questions.json',
  ANSWERS_FILE: './answers.json'
};

// Exercise Definitions
export const EXERCISE_DEFINITIONS = {
  'verbs-present': {
    title: 'Động Từ - Hiện Tại',
    description: 'Luyện tập chuyển đổi động từ hiện tại từ thể lịch sự sang thể thường',
    icon: 'fas fa-play',
    color: 'blue',
    category: 'verbs',
    difficulty: 'beginner',
    estimatedTime: '10-15 phút',
    theory: `
          <h4 class="font-bold mb-2 text-blue-600">Quy tắc chuyển đổi động từ hiện tại:</h4>
          <ul class="space-y-1 text-xs">
              <li>• います → う (Group 1): 書きます → 書く</li>
              <li>• ます → る (Group 2): 食べます → 食べる</li>
              <li>• します → する (Irregular): 勉強します → 勉強する</li>
              <li>• きます → くる (Irregular): 来ます → 来る</li>
          </ul>
      `
  },
  'verbs-past': {
    title: 'Động Từ - Quá Khứ',
    description: 'Luyện tập chuyển đổi động từ quá khứ từ thể lịch sự sang thể thường',
    icon: 'fas fa-history',
    color: 'green',
    category: 'verbs',
    difficulty: 'intermediate',
    estimatedTime: '15-20 phút',
    theory: `
          <h4 class="font-bold mb-2 text-green-600">Quy tắc chuyển đổi động từ quá khứ:</h4>
          <ul class="space-y-1 text-xs">
              <li>• きました → いた: 書きました → 書いた</li>
              <li>• ぎました → いだ: 泳ぎました → 泳いだ</li>
              <li>• しました → した: 話しました → 話した</li>
              <li>• ちました → った: 待ちました → 待った</li>
              <li>• にました → んだ: 死にました → 死んだ</li>
          </ul>
      `
  },
  'verbs-negative': {
    title: 'Động Từ - Phủ Định',
    description: 'Luyện tập chuyển đổi động từ phủ định từ thể lịch sự sang thể thường',
    icon: 'fas fa-times-circle',
    color: 'red',
    category: 'verbs',
    difficulty: 'intermediate',
    estimatedTime: '15-20 phút',
    theory: `
          <h4 class="font-bold mb-2 text-red-600">Quy tắc chuyển đổi động từ phủ định:</h4>
          <ul class="space-y-1 text-xs">
              <li>• きません → かない: 書きません → 書かない</li>
              <li>• ぎません → がない: 泳ぎません → 泳がない</li>
              <li>• しません → さない: 話しません → 話さない</li>
              <li>• ちません → たない: 待ちません → 待たない</li>
              <li>• にません → なない: 死にません → 死なない</li>
          </ul>
      `
  },
  'verbs-past-negative': {
    title: 'Động Từ - Quá Khứ Phủ Định',
    description: 'Luyện tập chuyển đổi động từ quá khứ phủ định từ thể lịch sự sang thể thường',
    icon: 'fas fa-minus-circle',
    color: 'gray',
    category: 'verbs',
    difficulty: 'advanced',
    estimatedTime: '20-25 phút',
    theory: `
          <h4 class="font-bold mb-2 text-gray-600">Quy tắc chuyển đổi động từ quá khứ phủ định:</h4>
          <ul class="space-y-1 text-xs">
              <li>• きませんでした → かなかった</li>
              <li>• ぎませんでした → がなかった</li>
              <li>• しませんでした → さなかった</li>
              <li>• ちませんでした → たなかった</li>
              <li>• にませんでした → ななかった</li>
          </ul>
      `
  },
  'adjectives-i': {
    title: 'Tính Từ い',
    description: 'Luyện tập chuyển đổi tính từ đuôi い từ thể lịch sự sang thể thường',
    icon: 'fas fa-palette',
    color: 'purple',
    category: 'adjectives',
    difficulty: 'beginner',
    estimatedTime: '10-15 phút',
    theory: `
          <h4 class="font-bold mb-2 text-purple-600">Quy tắc chuyển đổi tính từ い:</h4>
          <ul class="space-y-1 text-xs">
              <li>• Hiện tại: おいしいです → おいしい</li>
              <li>• Quá khứ: おいしかったです → おいしかった</li>
              <li>• Phủ định: おいしくないです → おいしくない</li>
              <li>• Quá khứ PĐ: おいしくなかったです → おいしくなかった</li>
              <li>• Đặc biệt: いいです → いい (quá khứ: よかった)</li>
          </ul>
      `
  },
  'adjectives-na': {
    title: 'Tính Từ な',
    description: 'Luyện tập chuyển đổi tính từ đuôi な từ thể lịch sự sang thể thường',
    icon: 'fas fa-star',
    color: 'yellow',
    category: 'adjectives',
    difficulty: 'beginner',
    estimatedTime: '10-15 phút',
    theory: `
          <h4 class="font-bold mb-2 text-yellow-600">Quy tắc chuyển đổi tính từ な:</h4>
          <ul class="space-y-1 text-xs">
              <li>• Hiện tại: きれいです → きれいだ</li>
              <li>• Quá khứ: きれいでした → きれいだった</li>
              <li>• Phủ định: きれいじゃありません → きれいじゃない</li>
              <li>• Quá khứ PĐ: きれいじゃありませんでした → きれいじゃなかった</li>
          </ul>
      `
  },
  'nouns': {
    title: 'Danh Từ',
    description: 'Luyện tập chuyển đổi danh từ từ thể lịch sự sang thể thường',
    icon: 'fas fa-cube',
    color: 'indigo',
    category: 'nouns',
    difficulty: 'beginner',
    estimatedTime: '10-15 phút',
    theory: `
          <h4 class="font-bold mb-2 text-indigo-600">Quy tắc chuyển đổi danh từ:</h4>
          <ul class="space-y-1 text-xs">
              <li>• Hiện tại: 学生です → 学生だ</li>
              <li>• Quá khứ: 学生でした → 学生だった</li>
              <li>• Phủ định: 学生じゃありません → 学生じゃない</li>
              <li>• Quá khứ PĐ: 学生じゃありませんでした → 学生じゃなかった</li>
          </ul>
      `
  },
  'grammar-patterns-must': {
    title: 'Ngữ Pháp - Phải Làm',
    description: 'Luyện tập mẫu なければなりません → なければならない',
    icon: 'fas fa-exclamation-triangle',
    color: 'orange',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '15-20 phút',
    theory: `
          <h4 class="font-bold mb-2 text-orange-600">Mẫu ngữ pháp "phải làm":</h4>
          <ul class="space-y-1 text-xs">
              <li>• なければなりません → なければならない</li>
              <li>• VĐ: 行かなければなりません → 行かなければならない</li>
              <li>• Nghĩa: Phải làm gì đó</li>
          </ul>
      `
  },
  'grammar-patterns-ing': {
    title: 'Ngữ Pháp - Đang Làm',
    description: 'Luyện tập mẫu ています → ている',
    icon: 'fas fa-clock',
    color: 'cyan',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '15-20 phút',
    theory: `
          <h4 class="font-bold mb-2 text-cyan-600">Mẫu ngữ pháp "đang làm":</h4>
          <ul class="space-y-1 text-xs">
              <li>• ています → ている</li>
              <li>• VĐ: 読んでいます → 読んでいる</li>
              <li>• Nghĩa: Đang làm gì đó</li>
          </ul>
      `
  },
  'grammar-patterns-forbidden': {
    title: 'Ngữ Pháp - Không Được',
    description: 'Luyện tập mẫu てはいけません → てはいけない',
    icon: 'fas fa-ban',
    color: 'red',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '15-20 phút',
    theory: `
          <h4 class="font-bold mb-2 text-red-600">Mẫu ngữ pháp "không được":</h4>
          <ul class="space-y-1 text-xs">
              <li>• てはいけません → てはいけない</li>
              <li>• VĐ: 食べてはいけません → 食べてはいけない</li>
              <li>• Nghĩa: Không được làm gì đó</li>
          </ul>
      `
  },
  'grammar-patterns-permission': {
    title: 'Ngữ Pháp - Có Thể Làm',
    description: 'Luyện tập mẫu てもいいです → てもいい',
    icon: 'fas fa-check-circle',
    color: 'green',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '15-20 phút',
    theory: `
          <h4 class="font-bold mb-2 text-green-600">Mẫu ngữ pháp "có thể làm":</h4>
          <ul class="space-y-1 text-xs">
              <li>• てもいいです → てもいい</li>
              <li>• VĐ: 食べてもいいです → 食べてもいい</li>
              <li>• Nghĩa: Có thể làm gì đó</li>
          </ul>
      `
  },
  'grammar-patterns-ability': {
    title: 'Ngữ Pháp - Có Khả Năng',
    description: 'Luyện tập mẫu ことができます → ことができる',
    icon: 'fas fa-medal',
    color: 'amber',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '15-20 phút',
    theory: `
          <h4 class="font-bold mb-2 text-amber-600">Mẫu ngữ pháp "có khả năng":</h4>
          <ul class="space-y-1 text-xs">
              <li>• ことができます → ことができる</li>
              <li>• VĐ: 話すことができます → 話すことができる</li>
              <li>• Nghĩa: Có thể làm gì đó</li>
          </ul>
      `
  },
  'grammar-patterns-experience': {
    title: 'Ngữ Pháp - Đã Từng',
    description: 'Luyện tập mẫu ことがあります → ことがある',
    icon: 'fas fa-history',
    color: 'violet',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '15-20 phút',
    theory: `
          <h4 class="font-bold mb-2 text-violet-600">Mẫu ngữ pháp "đã từng":</h4>
          <ul class="space-y-1 text-xs">
              <li>• ことがあります → ことがある</li>
              <li>• VĐ: 行ったことがあります → 行ったことがある</li>
              <li>• Nghĩa: Đã từng làm gì đó</li>
          </ul>
      `
  },
  'grammar-patterns-alternation': {
    title: 'Ngữ Pháp - Làm Này Làm Kia',
    description: 'Luyện tập mẫu たりします → たりする',
    icon: 'fas fa-exchange-alt',
    color: 'teal',
    category: 'grammar',
    difficulty: 'advanced',
    estimatedTime: '20-25 phút',
    theory: `
          <h4 class="font-bold mb-2 text-teal-600">Mẫu ngữ pháp "làm này làm kia":</h4>
          <ul class="space-y-1 text-xs">
              <li>• たりします → たりする</li>
              <li>• VĐ: 読んだりします → 読んだりする</li>
              <li>• Nghĩa: Làm việc này việc kia</li>
          </ul>
      `
  },
  'grammar-patterns-become': {
    title: 'Ngữ Pháp - Trở Nên',
    description: 'Luyện tập mẫu なります → なる',
    icon: 'fas fa-arrow-up',
    color: 'sky',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '15-20 phút',
    theory: `
          <h4 class="font-bold mb-2 text-sky-600">Mẫu ngữ pháp "trở nên":</h4>
          <ul class="space-y-1 text-xs">
              <li>• なります → なる</li>
              <li>• VĐ: 暖かくなります → 暖かくなる</li>
              <li>• Nghĩa: Trở thành/trở nên</li>
          </ul>
      `
  }
};

// UI Constants
export const UI_CONSTANTS = {
  // Page names
  PAGES: {
    THEORY: 'theory',
    PRACTICE: 'practice',
    REVIEW: 'review',
    STATISTICS: 'statistics'
  },

  // Theme colors
  COLORS: {
    PRIMARY: 'blue',
    SUCCESS: 'green',
    ERROR: 'red',
    WARNING: 'yellow',
    INFO: 'blue'
  },

  // Animation durations (in ms)
  ANIMATIONS: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000
  },

  // Breakpoints (match Tailwind)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536
  },

  // Z-index scale
  Z_INDEX: {
    DROPDOWN: 10,
    STICKY: 20,
    FIXED: 30,
    MODAL_BACKDROP: 40,
    MODAL: 50,
    POPOVER: 60,
    TOOLTIP: 70,
    NOTIFICATION: 80
  }
};

// Quiz Constants
export const QUIZ_CONSTANTS = {
  // Question types
  QUESTION_TYPES: {
    FILL_BLANK: 'fill_blank',
    MULTIPLE_CHOICE: 'multiple_choice',
    TRUE_FALSE: 'true_false',
    MATCHING: 'matching'
  },

  // Scoring
  SCORING: {
    CORRECT_POINTS: 1,
    WRONG_PENALTY: 0,
    STREAK_BONUS: 0.1, // 10% bonus per streak
    TIME_BONUS_THRESHOLD: 5000, // 5 seconds
    TIME_BONUS_POINTS: 0.2
  },

  // Timing
  TIMING: {
    DEFAULT_QUESTION_TIME: 30000, // 30 seconds
    AUTO_ADVANCE_DELAY: 2000, // 2 seconds after correct answer
    HINT_DELAY: 10000, // Show hint after 10 seconds
    FEEDBACK_DISPLAY_TIME: 3000 // 3 seconds
  },

  // Difficulty levels
  DIFFICULTY: {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced'
  }
};

// Achievement Definitions
export const ACHIEVEMENTS = {
  FIRST_CORRECT: {
    id: 'first_correct',
    name: '🎯 Câu Đầu Tiên',
    description: 'Trả lời đúng câu hỏi đầu tiên',
    icon: 'fas fa-bullseye',
    color: 'blue',
    points: 10
  },
  STREAK_5: {
    id: 'streak_5',
    name: '🔥 Streak 5',
    description: 'Trả lời đúng liên tiếp 5 câu',
    icon: 'fas fa-fire',
    color: 'orange',
    points: 25
  },
  STREAK_10: {
    id: 'streak_10',
    name: '⚡ Streak 10',
    description: 'Trả lời đúng liên tiếp 10 câu',
    icon: 'fas fa-bolt',
    color: 'yellow',
    points: 50
  },
  STREAK_25: {
    id: 'streak_25',
    name: '💥 Streak 25',
    description: 'Trả lời đúng liên tiếp 25 câu',
    icon: 'fas fa-explosion',
    color: 'red',
    points: 100
  },
  ACCURACY_90: {
    id: 'accuracy_90',
    name: '🎯 Cao Thủ',
    description: 'Đạt độ chính xác 90%',
    icon: 'fas fa-crosshairs',
    color: 'green',
    points: 75
  },
  COMPLETE_100: {
    id: 'complete_100',
    name: '📚 Học Sinh Chăm Chỉ',
    description: 'Hoàn thành 100 câu hỏi',
    icon: 'fas fa-graduation-cap',
    color: 'blue',
    points: 50
  },
  COMPLETE_500: {
    id: 'complete_500',
    name: '🏆 Chuyên Gia',
    description: 'Hoàn thành 500 câu hỏi',
    icon: 'fas fa-trophy',
    color: 'gold',
    points: 150
  },
  COMPLETE_1000: {
    id: 'complete_1000',
    name: '👑 Bậc Thầy',
    description: 'Hoàn thành 1000 câu hỏi',
    icon: 'fas fa-crown',
    color: 'purple',
    points: 300
  },
  PERFECT_EXERCISE: {
    id: 'perfect_exercise',
    name: '💯 Hoàn Hảo',
    description: 'Hoàn thành một bài tập với 100% độ chính xác',
    icon: 'fas fa-star',
    color: 'yellow',
    points: 40
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: '⚡ Tốc Độ Ánh Sáng',
    description: 'Hoàn thành bài tập trong 5 phút',
    icon: 'fas fa-rocket',
    color: 'blue',
    points: 60
  },
  DEDICATED: {
    id: 'dedicated',
    name: '💪 Kiên Trì',
    description: 'Học 7 ngày liên tiếp',
    icon: 'fas fa-calendar-check',
    color: 'green',
    points: 80
  },
  MASTER: {
    id: 'master',
    name: '🌟 Đại Sư',
    description: 'Hoàn thành tất cả bài tập',
    icon: 'fas fa-medal',
    color: 'gold',
    points: 500
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.',
  FILE_NOT_FOUND: 'Không tìm thấy file dữ liệu. Vui lòng kiểm tra đường dẫn.',
  INVALID_JSON: 'File dữ liệu không hợp lệ. Vui lòng kiểm tra cú pháp JSON.',
  STORAGE_FULL: 'Bộ nhớ đã đầy. Vui lòng xóa một số dữ liệu cũ.',
  PERMISSION_DENIED: 'Không có quyền truy cập. Vui lòng cấp quyền cho ứng dụng.',
  UNKNOWN: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  DATA_LOADED: 'Dữ liệu đã được tải thành công!',
  PROGRESS_SAVED: 'Tiến độ đã được lưu!',
  SETTINGS_UPDATED: 'Cài đặt đã được cập nhật!',
  QUIZ_COMPLETED: 'Bài tập hoàn thành xuất sắc!',
  ACHIEVEMENT_UNLOCKED: 'Bạn đã mở khóa thành tựu mới!'
};

// Japanese Character Sets
export const JAPANESE_CHARS = {
  HIRAGANA: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん',
  KATAKANA: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
  NUMBERS: '一二三四五六七八九十百千万',
  PARTICLES: 'はがをにでとからまでより'
};

// Regex Patterns
export const REGEX_PATTERNS = {
  HIRAGANA: /^[あ-ん]+$/,
  KATAKANA: /^[ア-ン]+$/,
  KANJI: /^[一-龯]+$/,
  JAPANESE: /^[あ-んア-ン一-龯ー々〆〤〜・]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/
};

// Local Storage Keys
export const STORAGE_KEYS = {
  GLOBAL_STATS: 'globalStats',
  EXERCISE_PROGRESS: 'exerciseProgress',
  WRONG_ANSWERS: 'wrongAnswers',
  ACHIEVEMENTS: 'achievements',
  PREFERENCES: 'preferences',
  STREAK_HISTORY: 'streakHistory',
  THEME: 'theme',
  LAST_VISITED: 'lastVisited'
};

// Event Names
export const EVENTS = {
  // Navigation
  NAVIGATE: 'navigate',
  NAVIGATE_TO: 'navigate:to',
  NAVIGATE_BACK: 'navigate:back',

  // Quiz
  QUIZ_START: 'quiz:start',
  QUIZ_SUBMIT: 'quiz:submit',
  QUIZ_NEXT: 'quiz:next',
  QUIZ_COMPLETE: 'quiz:complete',
  QUIZ_CLOSE: 'quiz:close',
  QUIZ_HINT: 'quiz:hint',
  QUIZ_SKIP: 'quiz:skip',

  // Exercise
  EXERCISE_SELECT: 'exercise:select',
  EXERCISE_START: 'exercise:start',
  EXERCISE_RESET: 'exercise:reset',

  // Storage
  STORAGE_UPDATED: 'storage:updated',

  // Theme
  THEME_CHANGE: 'theme:change',
  THEME_CHANGED: 'theme:changed',

  // Achievement
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked'
};

// Default Preferences
export const DEFAULT_PREFERENCES = {
  theme: 'light',
  autoFocus: true,
  soundEnabled: false,
  animationsEnabled: true,
  showExplanations: true,
  shuffleQuestions: true,
  showHints: true,
  autoAdvance: false,
  fontSize: 'medium',
  language: 'vi'
};

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USER: '/user',
  EXERCISES: '/exercises',
  PROGRESS: '/progress',
  LEADERBOARD: '/leaderboard'
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ACHIEVEMENTS: true,
  ENABLE_SOUND: false,
  ENABLE_ANIMATIONS: true,
  ENABLE_HINTS: true,
  ENABLE_TIMER: false,
  ENABLE_LEADERBOARD: false,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_ANALYTICS: false
};