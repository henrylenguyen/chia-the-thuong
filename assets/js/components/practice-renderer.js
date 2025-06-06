/**
 * PracticeRenderer - Renders practice content dynamically from JSON data
 * (Copied from current theory-renderer.js content)
 */
class PracticeRenderer {
  constructor() {
    this.theoryData = null;
    this.questionsData = null;
    this.answersData = null;
    this.exerciseDefinitions = null;

    // Predefined color schemes for random assignment (soft colors like old version)
    this.colorSchemes = [
      { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' },
      { bg: 'from-green-50 to-green-100', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-500' },
      { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-500' },
      { bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-500' },
      { bg: 'from-red-50 to-red-100', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' },
      { bg: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200', text: 'text-indigo-700', icon: 'text-indigo-500' },
      { bg: 'from-pink-50 to-pink-100', border: 'border-pink-200', text: 'text-pink-700', icon: 'text-pink-500' },
      { bg: 'from-teal-50 to-teal-100', border: 'border-teal-200', text: 'text-teal-700', icon: 'text-teal-500' },
      { bg: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'text-yellow-600' },
      { bg: 'from-cyan-50 to-cyan-100', border: 'border-cyan-200', text: 'text-cyan-700', icon: 'text-cyan-500' }
    ];

    // Predefined icons for random assignment
    this.icons = [
      'fas fa-play', 'fas fa-history', 'fas fa-times', 'fas fa-ban',
      'fas fa-star', 'fas fa-gem', 'fas fa-cube', 'fas fa-cogs',
      'fas fa-fire', 'fas fa-bolt', 'fas fa-heart', 'fas fa-magic',
      'fas fa-rocket', 'fas fa-crown', 'fas fa-diamond', 'fas fa-leaf'
    ];

    // Store assigned colors/icons to maintain consistency
    this.assignedStyles = new Map();
  }

  /**
   * Load all required data
   */
  async loadData() {
    try {
      // Load all required data
      const [theoryData, questionsData, answersData, exerciseDefinitions] = await Promise.all([
        DataLoader.loadTheory(),
        DataLoader.loadQuestions(),
        DataLoader.loadAnswers(),
        DataLoader.loadExerciseDefinitions()
      ]);

      this.theoryData = theoryData;
      this.questionsData = questionsData;
      this.answersData = answersData;
      this.exerciseDefinitions = exerciseDefinitions;

      return true;
    } catch (error) {
      console.error('Error loading practice data:', error);
      return false;
    }
  }

  /**
   * Initialize with practice data
   * @param {Object} theoryData - Theory data from JSON
   * @param {Object} questionsData - Questions data from JSON
   * @param {Object} answersData - Answers data from JSON
   * @param {Object} exerciseDefinitions - Exercise definitions from JSON
   */
  init(theoryData, questionsData, answersData, exerciseDefinitions) {
    this.theoryData = theoryData;
    this.questionsData = questionsData;
    this.answersData = answersData;
    this.exerciseDefinitions = exerciseDefinitions;
    this.assignedStyles.clear(); // Reset assignments
  }

  /**
   * Get random style for an exercise (consistent per exercise)
   * @param {string} exerciseKey - Exercise key
   * @returns {Object} Style object with color, icon, etc.
   */
  getRandomStyle(exerciseKey) {
    // Return cached style if already assigned
    if (this.assignedStyles.has(exerciseKey)) {
      return this.assignedStyles.get(exerciseKey);
    }

    // Generate new random style
    const colorScheme = this.colorSchemes[Math.floor(Math.random() * this.colorSchemes.length)];
    const icon = this.icons[Math.floor(Math.random() * this.icons.length)];

    const style = {
      colorScheme,
      icon,
      // Generate random estimated time
      estimatedTime: `${Math.floor(Math.random() * 10) + 10}-${Math.floor(Math.random() * 10) + 15} phút`
    };

    // Cache the style
    this.assignedStyles.set(exerciseKey, style);
    return style;
  }

  /**
   * Get color scheme based on exercise category (inspired by old-source.html)
   * @param {string} category - Exercise category
   * @returns {Object} Color scheme configuration
   */
  getCategoryColorScheme(category) {
    const schemes = {
      verbs: {
        gradient: 'from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600',
        border: 'border-blue-500',
        textColor: 'text-blue-700 dark:text-blue-300',
        iconColor: 'text-blue-500',
        descColor: 'text-blue-600/80',
        progressBar: 'bg-blue-500',
        ruleColor: 'text-blue-600'
      },
      adjectives: {
        gradient: 'from-purple-50 to-violet-100 dark:from-gray-700 dark:to-gray-600',
        border: 'border-purple-500',
        textColor: 'text-purple-700 dark:text-purple-300',
        iconColor: 'text-purple-500',
        descColor: 'text-purple-600/80',
        progressBar: 'bg-purple-500',
        ruleColor: 'text-purple-600'
      },
      nouns: {
        gradient: 'from-orange-50 to-amber-100 dark:from-gray-700 dark:to-gray-600',
        border: 'border-orange-500',
        textColor: 'text-orange-700 dark:text-orange-300',
        iconColor: 'text-orange-500',
        descColor: 'text-orange-600/80',
        progressBar: 'bg-orange-500',
        ruleColor: 'text-orange-600'
      },
      grammar: {
        gradient: 'from-green-50 to-emerald-100 dark:from-gray-700 dark:to-gray-600',
        border: 'border-green-500',
        textColor: 'text-green-700 dark:text-green-300',
        iconColor: 'text-green-500',
        descColor: 'text-green-600/80',
        progressBar: 'bg-green-500',
        ruleColor: 'text-green-600'
      }
    };

    // Default to verbs if category not found
    return schemes[category] || schemes.verbs;
  }

  /**
   * Render practice content for all exercises
   */
  renderPracticeContent() {
    const container = document.querySelector('#exercise-cards-container') ||
      document.querySelector('#practice-page .space-y-8');
    if (!container) {
      console.warn('Practice container not found');
      return;
    }

    // Check if required data is available
    if (!this.exerciseDefinitions) {
      console.warn('Exercise definitions not available for practice rendering');
      container.innerHTML = '<div class="col-span-full text-center text-gray-500">Đang tải dữ liệu...</div>';
      return;
    }

    container.innerHTML = '';

    // Group exercises by category
    const categories = this.groupExercisesByCategory();

    Object.entries(categories).forEach(([categoryName, exercises]) => {
      const categorySection = this.createCategorySection(categoryName, exercises);
      container.appendChild(categorySection);
    });
  }

  /**
   * Group exercises by category
   * @returns {Object} Grouped exercises
   */
  groupExercisesByCategory() {
    const categories = {};

    if (!this.exerciseDefinitions) {
      console.warn('Exercise definitions not available for grouping');
      return categories;
    }

    Object.entries(this.exerciseDefinitions).forEach(([key, exercise]) => {
      const category = exercise.category || 'other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({ key, ...exercise });
    });

    return categories;
  }

  /**
   * Create category section
   * @param {string} categoryName - Category name
   * @param {Array} exercises - Exercises in category
   * @returns {HTMLElement} Category section element
   */
  createCategorySection(categoryName, exercises) {
    const section = document.createElement('div');
    section.className = 'col-span-full mb-8';

    const categoryTitle = this.getCategoryTitle(categoryName);
    const categoryColor = this.getCategoryColor(categoryName);

    section.innerHTML = `
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          <i class="${this.getCategoryIcon(categoryName)} mr-2 text-${categoryColor}-500"></i>
          ${categoryTitle}
        </h2>
        <div class="h-1 bg-gradient-to-r from-${categoryColor}-500 to-${categoryColor}-300 rounded-full w-24"></div>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${exercises.map(exercise => this.createPracticeCard(exercise)).join('')}
      </div>
    `;

    return section;
  }

  /**
   * Create practice card for an exercise (inspired by old-source.html design)
   * Uses theory data for card content and questions data for count
   * @param {Object} exercise - Exercise data
   * @returns {string} HTML string
   */
  createPracticeCard(exercise) {
    // Get theory data for card content
    const theoryContent = this.theoryData?.[exercise.key];
    // Get questions data for count
    const questions = this.questionsData?.[exercise.key];

    if (!theoryContent) {
      return `
        <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">${exercise.title}</h3>
          <p class="text-gray-600 dark:text-gray-400">Nội dung chưa được cập nhật</p>
        </div>
      `;
    }

    // Get color scheme based on category
    const colorScheme = this.getCategoryColorScheme(exercise.category);
    const questionCount = this.getQuestionCount(exercise.key);
    const progressPercent = 0; // TODO: Calculate actual progress

    // Use theory data for card content
    const title = theoryContent.title || exercise.title;
    const description = theoryContent.description || exercise.description;
    const rules = theoryContent.rules || [];
    const examples = theoryContent.examples || [];

    return `
      <div class="bg-gradient-to-br ${colorScheme.gradient} p-6 rounded-xl border-2 ${colorScheme.border} cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 transform group" onclick="window.app.startExercise('${exercise.key}')">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <i class="${exercise.icon} text-2xl ${colorScheme.iconColor} group-hover:scale-110 transition-transform"></i>
            <h3 class="text-lg font-bold ${colorScheme.textColor} group-hover:text-current">${title}</h3>
          </div>
          <span class="text-sm font-medium ${colorScheme.textColor}">${questionCount} câu</span>
        </div>

        <p class="text-sm mb-4 ${colorScheme.descColor} group-hover:opacity-100 transition-opacity">${description}</p>

        <div class="mb-3">
          <div class="flex justify-between text-sm mb-1 ${colorScheme.textColor}">
            <span>Tiến độ</span>
            <span>0/${questionCount} câu</span>
          </div>
          <div class="w-full bg-white/50 dark:bg-gray-800/50 rounded-full h-2 overflow-hidden">
            <div class="${colorScheme.progressBar} h-2 rounded-full transition-all duration-500 relative" style="width: ${progressPercent}%">
              <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div class="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-xs opacity-90 group-hover:opacity-100 transition-opacity">
          <h4 class="font-bold mb-2 ${colorScheme.textColor}">Quy tắc chuyển đổi:</h4>
          <ul class="space-y-1 text-xs ${colorScheme.ruleColor}">
            ${rules.slice(0, 3).map(rule => `<li>• ${rule}</li>`).join('')}
            ${rules.length > 3 ? '<li>• ...</li>' : ''}
          </ul>
          ${examples.length > 0 ? `
            <h4 class="font-bold mt-2 mb-1 ${colorScheme.textColor}">Ví dụ:</h4>
            <ul class="space-y-1 text-xs ${colorScheme.ruleColor}">
              ${examples.slice(0, 2).map(ex => `<li>• ${ex.japanese} → ${ex.meaning}</li>`).join('')}
              ${examples.length > 2 ? '<li>• ...</li>' : ''}
            </ul>
          ` : ''}
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-gray-100">
          <div class="flex items-center space-x-1 text-xs text-gray-500">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
            </svg>
            <span>Ước tính: ${Math.ceil(questionCount * 0.5)} phút</span>
          </div>
          <div class="text-xs ${colorScheme.textColor} font-medium">
            ${this.getDifficultyText(theoryContent.difficulty || exercise.difficulty)}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get question count for an exercise
   * @param {string} exerciseKey - Exercise key
   * @returns {number} Number of questions
   */
  getQuestionCount(exerciseKey) {
    if (this.questionsData && this.questionsData[exerciseKey]) {
      return this.questionsData[exerciseKey].length;
    }

    // Fallback if questionsData not available
    const fallbackCounts = {
      'verbs-present': 25,
      'verbs-past': 25,
      'verbs-negative': 25,
      'verbs-past-negative': 25,
      'adjectives-i': 20,
      'adjectives-na': 20,
      'nouns': 20
    };
    return fallbackCounts[exerciseKey] || 15;
  }

  /**
   * Get difficulty text in Vietnamese
   * @param {string} difficulty - Difficulty level
   * @returns {string} Vietnamese difficulty text
   */
  getDifficultyText(difficulty) {
    const difficultyMap = {
      beginner: 'Cơ bản',
      intermediate: 'Trung bình',
      advanced: 'Nâng cao'
    };
    return difficultyMap[difficulty] || 'Cơ bản';
  }

  /**
   * Get category title
   * @param {string} categoryName - Category name
   * @returns {string} Display title
   */
  getCategoryTitle(categoryName) {
    const titles = {
      verbs: 'Động Từ (Verbs)',
      adjectives: 'Tính Từ (Adjectives)',
      nouns: 'Danh Từ (Nouns)',
      grammar: 'Ngữ Pháp (Grammar)',
      other: 'Khác'
    };
    return titles[categoryName] || categoryName;
  }

  /**
   * Get category color
   * @param {string} categoryName - Category name
   * @returns {string} Color name
   */
  getCategoryColor(categoryName) {
    const colors = {
      verbs: 'blue',
      adjectives: 'purple',
      nouns: 'green',
      grammar: 'orange',
      other: 'gray'
    };
    return colors[categoryName] || 'gray';
  }

  /**
   * Get category icon
   * @param {string} categoryName - Category name
   * @returns {string} Icon class
   */
  getCategoryIcon(categoryName) {
    const icons = {
      verbs: 'fas fa-running',
      adjectives: 'fas fa-palette',
      nouns: 'fas fa-cube',
      grammar: 'fas fa-cogs',
      other: 'fas fa-question'
    };
    return icons[categoryName] || 'fas fa-question';
  }
}

// Export the class
export { PracticeRenderer };

