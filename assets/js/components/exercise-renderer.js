/**
 * Exercise Cards Renderer
 * Handles rendering of exercise cards with progress and styling
 */

import { EXERCISE_DEFINITIONS } from '../utils/constants.js';

export class ExerciseRenderer {
  constructor() {
    // Random color schemes for dynamic assignment
    this.colorSchemes = [
      'from-blue-50 to-blue-100 border-blue-200 text-blue-700 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700 dark:text-blue-300',
      'from-green-50 to-green-100 border-green-200 text-green-700 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700 dark:text-green-300',
      'from-purple-50 to-purple-100 border-purple-200 text-purple-700 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700 dark:text-purple-300',
      'from-orange-50 to-orange-100 border-orange-200 text-orange-700 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-700 dark:text-orange-300',
      'from-red-50 to-red-100 border-red-200 text-red-700 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-700 dark:text-red-300',
      'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700 dark:from-indigo-900/20 dark:to-indigo-800/20 dark:border-indigo-700 dark:text-indigo-300',
      'from-pink-50 to-pink-100 border-pink-200 text-pink-700 dark:from-pink-900/20 dark:to-pink-800/20 dark:border-pink-700 dark:text-pink-300',
      'from-teal-50 to-teal-100 border-teal-200 text-teal-700 dark:from-teal-900/20 dark:to-teal-800/20 dark:border-teal-700 dark:text-teal-300',
      'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-700 dark:text-yellow-300',
      'from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-700 dark:from-cyan-900/20 dark:to-cyan-800/20 dark:border-cyan-700 dark:text-cyan-300'
    ];

    // Random icons for dynamic assignment
    this.icons = [
      'fas fa-play', 'fas fa-history', 'fas fa-times', 'fas fa-ban',
      'fas fa-star', 'fas fa-gem', 'fas fa-cube', 'fas fa-cogs',
      'fas fa-fire', 'fas fa-bolt', 'fas fa-heart', 'fas fa-magic',
      'fas fa-rocket', 'fas fa-crown', 'fas fa-diamond', 'fas fa-leaf'
    ];

    // Store assigned styles to maintain consistency
    this.assignedStyles = new Map();
  }

  /**
   * Initialize with exercise definitions
   * @param {Object} exerciseDefinitions - Exercise definitions from JSON
   */
  init(exerciseDefinitions) {
    this.exerciseDefinitions = exerciseDefinitions || EXERCISE_DEFINITIONS;
    this.assignedStyles.clear(); // Reset assignments
  }

  /**
   * Get random style for an exercise (consistent per exercise)
   * @param {string} exerciseKey - Exercise key
   * @returns {Object} Style object with color and icon
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
      icon
    };

    // Cache the style
    this.assignedStyles.set(exerciseKey, style);
    return style;
  }

  /**
   * Render all exercise cards
   * @param {Object} questionsData - Questions data by category
   * @param {Object} globalStats - Global statistics including progress
   * @param {Function} onExerciseClick - Callback when exercise is clicked
   */
  renderExerciseCards(questionsData, globalStats, onExerciseClick) {
    const container = document.getElementById('exercise-grid');
    if (!container) {
      console.warn('Exercise grid container not found');
      return;
    }

    container.innerHTML = '';

    const definitions = this.exerciseDefinitions || EXERCISE_DEFINITIONS;
    Object.entries(definitions).forEach(([key, exercise]) => {
      const card = this.createExerciseCard(key, exercise, questionsData, globalStats, onExerciseClick);
      container.appendChild(card);
    });
  }

  /**
   * Create a single exercise card
   * @param {string} key - Exercise key
   * @param {Object} exercise - Exercise definition
   * @param {Object} questionsData - Questions data
   * @param {Object} globalStats - Global statistics
   * @param {Function} onExerciseClick - Click callback
   * @returns {HTMLElement} Card element
   */
  createExerciseCard(key, exercise, questionsData, globalStats, onExerciseClick) {
    // Safe access to exerciseProgress
    const exerciseProgress = globalStats?.exerciseProgress || {};
    const progress = exerciseProgress[key] || 0;
    const questions = questionsData[key] || [];
    const total = questions.length;
    const progressPercent = total > 0 ? (progress / total) * 100 : 0;
    const isCompleted = progress >= total && total > 0;

    // Get random style for this exercise
    const style = this.getRandomStyle(key);

    const card = document.createElement('div');
    card.className = `bg-gradient-to-br ${style.colorScheme} p-6 rounded-xl border-2 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 transform group`;
    card.onclick = () => onExerciseClick(key);

    card.innerHTML = this.getCardHTML(exercise, style, progress, total, progressPercent, isCompleted);

    return card;
  }



  /**
   * Get HTML content for exercise card
   * @param {Object} exercise - Exercise definition
   * @param {Object} style - Random style object
   * @param {number} progress - Current progress
   * @param {number} total - Total questions
   * @param {number} progressPercent - Progress percentage
   * @param {boolean} isCompleted - Whether exercise is completed
   * @returns {string} HTML string
   */
  getCardHTML(exercise, style, progress, total, progressPercent, isCompleted) {
    return `
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <i class="${style.icon} text-2xl group-hover:scale-110 transition-transform"></i>
          <h3 class="text-lg font-bold group-hover:text-current">${exercise.title}</h3>
        </div>
        ${isCompleted ? '<i class="fas fa-check-circle text-green-500 text-xl animate-pulse"></i>' : ''}
      </div>

      <p class="text-sm mb-4 opacity-80 group-hover:opacity-100 transition-opacity">${exercise.description}</p>

      <div class="mb-3">
        <div class="flex justify-between text-sm mb-1">
          <span>Tiến độ</span>
          <span>${progress}/${total} câu</span>
        </div>
        <div class="w-full bg-white/50 dark:bg-gray-800/50 rounded-full h-2 overflow-hidden">
          <div class="bg-current h-2 rounded-full transition-all duration-500 relative" style="width: ${progressPercent}%">
            <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between text-xs">
        <span class="opacity-70">${exercise.estimatedTime || '10-15 phút'}</span>
        <span class="opacity-70">${this.getDifficultyBadge(exercise.difficulty)}</span>
      </div>
    `;
  }

  /**
   * Get difficulty badge
   * @param {string} difficulty - Difficulty level
   * @returns {string} Badge HTML
   */
  getDifficultyBadge(difficulty) {
    const badges = {
      beginner: '<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Cơ bản</span>',
      intermediate: '<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Trung bình</span>',
      advanced: '<span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Nâng cao</span>'
    };
    return badges[difficulty] || badges.beginner;
  }

  /**
   * Update progress for a specific exercise card
   * @param {string} exerciseKey - Exercise key
   * @param {number} progress - New progress value
   * @param {number} total - Total questions
   */
  updateExerciseProgress(exerciseKey, progress, total) {
    const card = document.querySelector(`[data-exercise="${exerciseKey}"]`);
    if (!card) return;

    const progressPercent = total > 0 ? (progress / total) * 100 : 0;
    const progressBar = card.querySelector('.bg-current');
    const progressText = card.querySelector('.flex.justify-between span:last-child');
    const completionIcon = card.querySelector('.fa-check-circle');

    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }

    if (progressText) {
      progressText.textContent = `${progress}/${total} câu`;
    }

    // Show/hide completion icon
    if (progress >= total && total > 0) {
      if (!completionIcon) {
        const iconContainer = card.querySelector('.flex.items-center.justify-between');
        if (iconContainer) {
          iconContainer.insertAdjacentHTML('beforeend', 
            '<i class="fas fa-check-circle text-green-500 text-xl animate-pulse"></i>'
          );
        }
      }
    } else if (completionIcon) {
      completionIcon.remove();
    }
  }

  /**
   * Filter exercise cards by category
   * @param {string} category - Category to filter by ('all', 'verbs', 'adjectives', etc.)
   */
  filterExercisesByCategory(category) {
    const cards = document.querySelectorAll('#exercise-grid > div');
    
    cards.forEach(card => {
      const exerciseKey = card.onclick.toString().match(/startExercise\('([^']+)'\)/)?.[1];
      if (!exerciseKey) return;

      const exercise = EXERCISE_DEFINITIONS[exerciseKey];
      if (!exercise) return;

      if (category === 'all' || exercise.category === category) {
        card.style.display = 'block';
        card.classList.add('animate-fade-in');
      } else {
        card.style.display = 'none';
      }
    });
  }

  /**
   * Search exercises by title or description
   * @param {string} searchTerm - Search term
   */
  searchExercises(searchTerm) {
    const cards = document.querySelectorAll('#exercise-grid > div');
    const term = searchTerm.toLowerCase();
    
    cards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const description = card.querySelector('p')?.textContent.toLowerCase() || '';
      
      if (title.includes(term) || description.includes(term)) {
        card.style.display = 'block';
        card.classList.add('animate-fade-in');
      } else {
        card.style.display = 'none';
      }
    });
  }
}
