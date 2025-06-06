/**
 * Dynamic Exercise Renderer
 * Renders exercises dynamically based on configuration
 */

export class DynamicRenderer {
  constructor(dataLoader) {
    this.dataLoader = dataLoader;
    this.config = null;
    this.exerciseDefinitions = null;
  }

  /**
   * Initialize renderer with config
   */
  async init() {
    this.config = await this.dataLoader.loadAppConfig();
    this.exerciseDefinitions = await this.dataLoader.loadExerciseDefinitions();
    console.log('🎨 Dynamic renderer initialized');
  }

  /**
   * Render exercise cards dynamically
   */
  async renderExerciseCards(container) {
    if (!this.config || !this.exerciseDefinitions) {
      await this.init();
    }

    const exercises = await this.dataLoader.getAvailableExercises();

    // Clear container
    container.innerHTML = '';

    // Group exercises by category
    const groupedExercises = this.groupExercisesByCategory(exercises);

    // Render each category
    for (const [categoryKey, categoryExercises] of Object.entries(groupedExercises)) {
      const categorySection = this.renderCategorySection(categoryKey, categoryExercises);
      container.appendChild(categorySection);
    }

    console.log(`🎯 Rendered ${exercises.length} exercises in ${Object.keys(groupedExercises).length} categories`);
  }

  /**
   * Group exercises by category
   */
  groupExercisesByCategory(exercises) {
    return exercises.reduce((groups, exercise) => {
      const category = exercise.category?.name || exercise.category || 'Khác';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(exercise);
      return groups;
    }, {});
  }

  /**
   * Render category section
   */
  renderCategorySection(categoryName, exercises) {
    const section = document.createElement('div');
    section.className = 'mb-8';

    // Category header
    const header = document.createElement('div');
    header.className = 'flex items-center mb-4';

    const categoryInfo = Object.values(this.config.categories || {})
      .find(cat => cat.name === categoryName) || {};

    header.innerHTML = `
      <i class="${categoryInfo.icon || 'fas fa-folder'} text-2xl text-${categoryInfo.color || 'gray'}-500 mr-3"></i>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">${categoryName}</h2>
      <span class="ml-3 px-2 py-1 bg-${categoryInfo.color || 'gray'}-100 text-${categoryInfo.color || 'gray'}-600 rounded-full text-sm">
        ${exercises.length} bài
      </span>
    `;

    // Exercise cards grid
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

    exercises.forEach(exercise => {
      const card = this.renderExerciseCard(exercise);
      grid.appendChild(card);
    });

    section.appendChild(header);
    section.appendChild(grid);
    return section;
  }

  /**
   * Render individual exercise card
   */
  renderExerciseCard(exercise) {
    const card = document.createElement('div');

    // Simple card design like the reference image
    const colorClasses = {
      'blue': 'from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700',
      'green': 'from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700',
      'red': 'from-red-50 to-red-100 border-red-200 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-700',
      'purple': 'from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700',
      'yellow': 'from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-700'
    };

    const iconColors = {
      'blue': 'text-blue-600 dark:text-blue-400',
      'green': 'text-green-600 dark:text-green-400',
      'red': 'text-red-600 dark:text-red-400',
      'purple': 'text-purple-600 dark:text-purple-400',
      'yellow': 'text-yellow-600 dark:text-yellow-400'
    };

    const color = exercise.color || 'blue';
    const colorClass = colorClasses[color] || colorClasses.blue;
    const iconColor = iconColors[color] || iconColors.blue;

    card.className = `bg-gradient-to-br ${colorClass} rounded-xl border-2 p-6 cursor-pointer
                     hover:shadow-lg transition-all duration-300 hover:scale-[1.02] transform`;

    card.dataset.exerciseId = exercise.id;

    card.innerHTML = `
      <!-- Header with icon and title -->
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-8 h-8 ${iconColor} text-xl flex items-center justify-center">
          <i class="${exercise.icon || 'fas fa-book'}"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${exercise.title}</h3>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        ${exercise.description}
      </p>

      <!-- Rules (simplified) -->
      ${exercise.rules && exercise.rules.length > 0 ? `
        <div class="mb-4">
          <div class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Quy tắc chuyển đổi ${exercise.title.toLowerCase()}:</div>
          <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            ${exercise.rules.slice(0, 3).map(rule => `<li>• ${rule}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Progress -->
      <div class="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
        <span>Tiến độ</span>
        <span class="exercise-progress-text">0/25 câu</span>
      </div>

      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div class="exercise-progress-bar bg-${color}-500 h-1.5 rounded-full transition-all duration-300"
             style="width: 0%"></div>
      </div>
    `;

    // Add click event
    card.addEventListener('click', () => {
      this.handleExerciseClick(exercise);
    });

    return card;
  }

  /**
   * Handle exercise card click
   */
  handleExerciseClick(exercise) {
    // Dispatch custom event for exercise selection
    const event = new CustomEvent('exerciseSelected', {
      detail: { exercise }
    });
    document.dispatchEvent(event);

    console.log(`🎯 Exercise selected: ${exercise.title} (${exercise.id})`);
  }

  /**
   * Update exercise progress
   */
  updateExerciseProgress(exerciseId, progress, completed = 0, total = 25) {
    const card = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
    if (!card) return;

    const progressBar = card.querySelector('.exercise-progress-bar');
    const progressText = card.querySelector('.exercise-progress-text');

    if (progressBar && progressText) {
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${completed}/${total} câu`;
    }
  }

  /**
   * Render theory content dynamically
   */
  renderTheoryContent(exercise, container) {
    if (!exercise.theory) {
      container.innerHTML = '<p class="text-gray-500">Không có lý thuyết cho bài tập này.</p>';
      return;
    }

    const theory = exercise.theory;
    container.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
          <i class="fas fa-book-open mr-2 text-blue-500"></i>
          ${theory.title}
        </h3>

        ${theory.content ? `
          <div class="mb-6">
            <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3">Quy tắc:</h4>
            <ul class="space-y-2">
              ${theory.content.map(rule => `
                <li class="flex items-start">
                  <i class="fas fa-arrow-right text-blue-500 mr-2 mt-1"></i>
                  <span class="text-gray-600 dark:text-gray-300">${rule}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        ${theory.examples ? `
          <div>
            <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3">Ví dụ:</h4>
            <div class="space-y-3">
              ${theory.examples.map(example => `
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span class="text-xs text-gray-500 uppercase tracking-wide">Thể lịch sự</span>
                      <p class="text-lg font-japanese text-gray-800 dark:text-white">${example.formal}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500 uppercase tracking-wide">Thể thường</span>
                      <p class="text-lg font-japanese text-blue-600 dark:text-blue-400">${example.casual}</p>
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">${example.meaning}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Render statistics dynamically
   */
  renderStatistics(stats, container) {
    const categories = Object.keys(this.config.categories || {});

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${categories.map(categoryKey => {
      const category = this.config.categories[categoryKey];
      const categoryStats = stats[categoryKey] || { completed: 0, total: 0, accuracy: 0 };

      return `
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div class="flex items-center mb-4">
                <i class="${category.icon} text-2xl text-${category.color}-500 mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${category.name}</h3>
              </div>

              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Hoàn thành:</span>
                  <span class="font-semibold">${categoryStats.completed}/${categoryStats.total}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Độ chính xác:</span>
                  <span class="font-semibold text-${category.color}-600">${categoryStats.accuracy}%</span>
                </div>

                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div class="bg-${category.color}-500 h-2 rounded-full transition-all duration-300"
                       style="width: ${(categoryStats.completed / categoryStats.total) * 100 || 0}%"></div>
                </div>
              </div>
            </div>
          `;
    }).join('')}
      </div>
    `;
  }
}
