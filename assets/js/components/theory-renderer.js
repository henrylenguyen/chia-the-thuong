/**
 * TheoryRenderer - Renders theory content dynamically from JSON data
 */
export class TheoryRenderer {
  constructor() {
    this.theoryData = null;
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
   * Initialize with theory data
   * @param {Object} theoryData - Theory data from JSON
   * @param {Object} exerciseDefinitions - Exercise definitions from JSON
   * @param {Object} questionsData - Questions data for counting
   */
  init(theoryData, exerciseDefinitions, questionsData = null) {
    this.theoryData = theoryData;
    this.exerciseDefinitions = exerciseDefinitions;
    this.questionsData = questionsData;
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
   * Render theory content for all exercises
   */
  renderTheoryContent() {
    const container = document.querySelector('#theory-page .grid');
    if (!container) {
      console.warn('Theory container not found');
      return;
    }

    // Check if required data is available
    if (!this.exerciseDefinitions) {
      console.warn('Exercise definitions not available for theory rendering');
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
        ${exercises.map(exercise => this.createTheoryCard(exercise)).join('')}
      </div>
    `;

    return section;
  }

  /**
   * Create theory card for an exercise
   * @param {Object} exercise - Exercise data
   * @returns {string} HTML string
   */
  createTheoryCard(exercise) {
    const theory = this.theoryData[exercise.key];
    if (!theory) {
      return `
        <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">${exercise.title}</h3>
          <p class="text-gray-600 dark:text-gray-400">Lý thuyết chưa được cập nhật</p>
        </div>
      `;
    }

    // Get random style for this exercise
    const style = this.getRandomStyle(exercise.key);
    const { colorScheme, icon, estimatedTime } = style;

    return `
      <div class="bg-white border ${colorScheme.border} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="text-2xl ${colorScheme.icon} group-hover:scale-110 transition-transform duration-300">
              ${icon}
            </div>
            <h3 class="text-lg font-bold ${colorScheme.text}">${exercise.title}</h3>
          </div>
          <span class="bg-gradient-to-r ${colorScheme.bg} ${colorScheme.text} px-3 py-1 rounded-full text-sm font-medium">
            ${this.getQuestionCount(exercise.key)} câu
          </span>
        </div>

        <div class="mb-4">
          <h4 class="font-semibold mb-2 ${colorScheme.text}">${theory.title}</h4>
          <p class="text-sm text-gray-600 mb-3 leading-relaxed">${exercise.instruction || 'Luyện tập chuyển đổi thể thường'}</p>
        </div>

        <div class="mb-4">
          <h5 class="font-medium mb-2 text-sm ${colorScheme.text}">📋 Quy tắc chuyển đổi:</h5>
          <ul class="text-xs space-y-1 text-gray-600">
            ${theory.rules.slice(0, 3).map(rule => `<li class="flex items-start"><span class="${colorScheme.text} mr-2">•</span><span>${rule}</span></li>`).join('')}
            ${theory.rules.length > 3 ? '<li class="text-gray-400 ml-3">...</li>' : ''}
          </ul>
        </div>

        <div class="mb-4">
          <h5 class="font-medium mb-2 text-sm ${colorScheme.text}">💡 Ví dụ:</h5>
          <ul class="text-xs space-y-1 text-gray-600">
            ${theory.examples.slice(0, 2).map(example => `<li class="flex items-start"><span class="${colorScheme.text} mr-2">•</span><span class="font-mono">${example}</span></li>`).join('')}
            ${theory.examples.length > 2 ? '<li class="text-gray-400 ml-3">...</li>' : ''}
          </ul>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div class="flex items-center space-x-2 text-xs text-gray-500">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
            </svg>
            <span>Ước tính: ${Math.ceil(this.getQuestionCount(exercise.key) * 0.5)} phút</span>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-400 mb-1">Độ khó</div>
            <div class="text-xs ${colorScheme.text} font-medium">${exercise.difficulty === 'beginner' ? 'Cơ bản' : exercise.difficulty === 'intermediate' ? 'Trung bình' : 'Nâng cao'}</div>
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

  /**
   * Get color class for exercise
   * @param {string} color - Color name
   * @returns {string} CSS classes
   */
  getColorClass(color) {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600 text-white',
      green: 'from-green-500 to-green-600 text-white',
      red: 'from-red-500 to-red-600 text-white',
      purple: 'from-purple-500 to-purple-600 text-white',
      orange: 'from-orange-500 to-orange-600 text-white',
      gray: 'from-gray-500 to-gray-600 text-white',
      yellow: 'from-yellow-500 to-yellow-600 text-white',
      pink: 'from-pink-500 to-pink-600 text-white',
      indigo: 'from-indigo-500 to-indigo-600 text-white',
      teal: 'from-teal-500 to-teal-600 text-white'
    };
    return colorClasses[color] || colorClasses.blue;
  }

  /**
   * Get difficulty badge
   * @param {string} difficulty - Difficulty level
   * @returns {string} Badge HTML
   */
  getDifficultyBadge(difficulty) {
    const badges = {
      beginner: '<span class="bg-white/20 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">Cơ bản</span>',
      intermediate: '<span class="bg-white/20 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">Trung bình</span>',
      advanced: '<span class="bg-white/20 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">Nâng cao</span>'
    };
    return badges[difficulty] || badges.beginner;
  }

  /**
   * Render detailed theory for a specific exercise
   * @param {string} exerciseKey - Exercise key
   * @returns {string} Detailed theory HTML
   */
  renderDetailedTheory(exerciseKey) {
    const theory = this.theoryData[exerciseKey];
    const exercise = this.exerciseDefinitions[exerciseKey];
    
    if (!theory || !exercise) {
      return '<p class="text-gray-600">Lý thuyết không tìm thấy</p>';
    }

    return `
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div class="flex items-center mb-4">
          <i class="${exercise.icon} text-2xl mr-3 text-${exercise.color}-500"></i>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">${exercise.title}</h2>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">${theory.title}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">${exercise.instruction}</p>
        </div>

        <div class="mb-6">
          <h4 class="font-semibold mb-3 text-gray-700 dark:text-gray-300">📋 Quy tắc chuyển đổi:</h4>
          <ul class="space-y-2">
            ${theory.rules.map(rule => `
              <li class="flex items-start">
                <span class="text-${exercise.color}-500 mr-2">•</span>
                <span class="text-gray-600 dark:text-gray-400">${rule}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="mb-6">
          <h4 class="font-semibold mb-3 text-gray-700 dark:text-gray-300">💡 Ví dụ minh họa:</h4>
          <ul class="space-y-2">
            ${theory.examples.map(example => `
              <li class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <span class="text-gray-700 dark:text-gray-300 font-mono">${example}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }
}
