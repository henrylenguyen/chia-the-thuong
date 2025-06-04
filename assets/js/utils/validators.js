/**
 * Validation Utilities
 * Functions for validating data, forms, and user input
 */

import { REGEX_PATTERNS, JAPANESE_CHARS } from './constants.js';

/**
 * Basic Validation Functions
 */

/**
 * Check if value is required (not empty)
 */
export function isRequired(value, message = 'Trường này là bắt buộc') {
  const isEmpty = value == null ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0);

  return {
    isValid: !isEmpty,
    message: isEmpty ? message : null
  };
}

/**
 * Check minimum length
 */
export function minLength(value, min, message = null) {
  const length = value ? value.toString().length : 0;
  const isValid = length >= min;

  return {
    isValid,
    message: isValid ? null : (message || `Tối thiểu ${min} ký tự`)
  };
}

/**
 * Check maximum length
 */
export function maxLength(value, max, message = null) {
  const length = value ? value.toString().length : 0;
  const isValid = length <= max;

  return {
    isValid,
    message: isValid ? null : (message || `Tối đa ${max} ký tự`)
  };
}

/**
 * Check if number is in range
 */
export function numberRange(value, min, max, message = null) {
  const num = parseFloat(value);
  const isValid = !isNaN(num) && num >= min && num <= max;

  return {
    isValid,
    message: isValid ? null : (message || `Giá trị phải từ ${min} đến ${max}`)
  };
}

/**
 * Japanese Text Validators
 */

/**
 * Validate hiragana input
 */
export function validateHiragana(text, options = {}) {
  const { allowEmpty = false, message = 'Chỉ được nhập hiragana' } = options;

  if (allowEmpty && (!text || text.trim() === '')) {
    return { isValid: true, message: null };
  }

  if (!text || text.trim() === '') {
    return { isValid: false, message: 'Vui lòng nhập hiragana' };
  }

  const cleanText = text.replace(/\s+/g, ''); // Remove spaces
  const isValid = REGEX_PATTERNS.HIRAGANA.test(cleanText);

  return {
    isValid,
    message: isValid ? null : message,
    cleanText
  };
}

/**
 * Validate katakana input
 */
export function validateKatakana(text, options = {}) {
  const { allowEmpty = false, message = 'Chỉ được nhập katakana' } = options;

  if (allowEmpty && (!text || text.trim() === '')) {
    return { isValid: true, message: null };
  }

  if (!text || text.trim() === '') {
    return { isValid: false, message: 'Vui lòng nhập katakana' };
  }

  const cleanText = text.replace(/\s+/g, '');
  const isValid = REGEX_PATTERNS.KATAKANA.test(cleanText);

  return {
    isValid,
    message: isValid ? null : message,
    cleanText
  };
}

/**
 * Validate Japanese text (hiragana, katakana, kanji)
 */
export function validateJapanese(text, options = {}) {
  const {
    allowEmpty = false,
    allowSpaces = true,
    message = 'Chỉ được nhập ký tự tiếng Nhật'
  } = options;

  if (allowEmpty && (!text || text.trim() === '')) {
    return { isValid: true, message: null };
  }

  if (!text || text.trim() === '') {
    return { isValid: false, message: 'Vui lòng nhập văn bản tiếng Nhật' };
  }

  let testText = text;
  if (!allowSpaces) {
    testText = text.replace(/\s+/g, '');
  }

  const isValid = REGEX_PATTERNS.JAPANESE.test(testText);

  return {
    isValid,
    message: isValid ? null : message,
    cleanText: testText
  };
}

/**
 * Check if text contains only valid Japanese characters
 */
export function containsOnlyJapanese(text) {
  if (!text) return false;

  // Remove common punctuation and spaces
  const cleanText = text.replace(/[\s。、！？「」『』〜ー・]/g, '');

  return REGEX_PATTERNS.JAPANESE.test(cleanText);
}

/**
 * Quiz Answer Validators
 */

/**
 * Validate quiz answer
 */
export function validateQuizAnswer(userAnswer, correctAnswer, options = {}) {
  const {
    caseSensitive = false,
    normalizeSpaces = true,
    normalizeMarks = true,
    allowPartial = false
  } = options;

  if (!userAnswer || userAnswer.trim() === '') {
    return {
      isValid: false,
      message: 'Vui lòng nhập đáp án',
      score: 0
    };
  }

  let normalizedUser = userAnswer;
  let normalizedCorrect = correctAnswer;

  // Normalize case
  if (!caseSensitive) {
    normalizedUser = normalizedUser.toLowerCase();
    normalizedCorrect = normalizedCorrect.toLowerCase();
  }

  // Normalize spaces
  if (normalizeSpaces) {
    normalizedUser = normalizedUser.replace(/\s+/g, '');
    normalizedCorrect = normalizedCorrect.replace(/\s+/g, '');
  }

  // Normalize Japanese marks
  if (normalizeMarks) {
    normalizedUser = normalizedUser.replace(/[ー]/g, '').replace(/[っ]/g, 'つ');
    normalizedCorrect = normalizedCorrect.replace(/[ー]/g, '').replace(/[っ]/g, 'つ');
  }

  const isExactMatch = normalizedUser === normalizedCorrect;

  if (isExactMatch) {
    return {
      isValid: true,
      message: null,
      score: 1.0
    };
  }

  if (allowPartial) {
    const similarity = calculateSimilarity(normalizedUser, normalizedCorrect);
    const isPartialMatch = similarity >= 0.8; // 80% similarity threshold

    return {
      isValid: isPartialMatch,
      message: isPartialMatch ? 'Gần đúng!' : 'Chưa chính xác',
      score: isPartialMatch ? similarity : 0,
      similarity
    };
  }

  return {
    isValid: false,
    message: 'Chưa chính xác',
    score: 0
  };
}

/**
 * Calculate string similarity (Levenshtein distance based)
 */
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Calculate Levenshtein distance
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Data Structure Validators
 */

/**
 * Validate question data structure
 */
export function validateQuestionData(questionData) {
  const errors = [];

  // Required fields
  const requiredFields = ['question', 'meaning', 'prefix'];
  requiredFields.forEach(field => {
    if (!questionData[field] || questionData[field].trim() === '') {
      errors.push(`Thiếu trường bắt buộc: ${field}`);
    }
  });

  // Validate Japanese text in question
  if (questionData.question) {
    const validation = validateJapanese(questionData.question);
    if (!validation.isValid) {
      errors.push(`Câu hỏi không hợp lệ: ${validation.message}`);
    }
  }

  // Validate meaning (should not be empty)
  if (questionData.meaning && questionData.meaning.trim().length < 3) {
    errors.push('Nghĩa của câu quá ngắn');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate answer data structure
 */
export function validateAnswerData(answerData) {
  const errors = [];

  // Required answer field
  if (!answerData.answer || answerData.answer.trim() === '') {
    errors.push('Thiếu đáp án');
  }

  // Validate Japanese text in answer
  if (answerData.answer) {
    const validation = validateJapanese(answerData.answer);
    if (!validation.isValid) {
      errors.push(`Đáp án không hợp lệ: ${validation.message}`);
    }
  }

  // Optional explanation validation
  if (answerData.explanation && answerData.explanation.trim().length < 5) {
    errors.push('Giải thích quá ngắn');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate exercise data consistency
 */
export function validateExerciseConsistency(questionsData, answersData) {
  const errors = [];

  Object.keys(questionsData).forEach(category => {
    const questions = questionsData[category];
    const answers = answersData[category];

    if (!answers) {
      errors.push(`Thiếu đáp án cho danh mục: ${category}`);
      return;
    }

    if (questions.length !== answers.length) {
      errors.push(`Số lượng câu hỏi (${questions.length}) không khớp với số lượng đáp án (${answers.length}) trong danh mục: ${category}`);
    }

    // Validate each question-answer pair
    questions.forEach((question, index) => {
      const answer = answers[index];

      const questionValidation = validateQuestionData(question);
      if (!questionValidation.isValid) {
        errors.push(`Câu hỏi ${index + 1} trong ${category}: ${questionValidation.errors.join(', ')}`);
      }

      if (answer) {
        const answerValidation = validateAnswerData(answer);
        if (!answerValidation.isValid) {
          errors.push(`Đáp án ${index + 1} trong ${category}: ${answerValidation.errors.join(', ')}`);
        }
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Form Validators
 */

/**
 * Validate form data
 */
export function validateForm(formData, rules) {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];

    for (const rule of fieldRules) {
      const result = rule(value);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });

  return {
    isValid,
    errors
  };
}

/**
 * Create validation rule
 */
export function createRule(validator, ...args) {
  return (value) => validator(value, ...args);
}

/**
 * Combine multiple validators
 */
export function combineValidators(...validators) {
  return (value) => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true, message: null };
  };
}

/**
 * File Validators
 */

/**
 * Validate JSON file content
 */
export function validateJsonFile(content) {
  try {
    const parsed = JSON.parse(content);
    return {
      isValid: true,
      data: parsed,
      message: null
    };
  } catch (error) {
    return {
      isValid: false,
      data: null,
      message: `JSON không hợp lệ: ${error.message}`
    };
  }
}

/**
 * Validate file size
 */
export function validateFileSize(file, maxSizeBytes, message = null) {
  const isValid = file.size <= maxSizeBytes;
  const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1);

  return {
    isValid,
    message: isValid ? null : (message || `File quá lớn. Tối đa ${maxSizeMB}MB`)
  };
}

/**
 * Validate file type
 */
export function validateFileType(file, allowedTypes, message = null) {
  const isValid = allowedTypes.includes(file.type);

  return {
    isValid,
    message: isValid ? null : (message || `Loại file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`)
  };
}

/**
 * Settings Validators
 */

/**
 * Validate user preferences
 */
export function validatePreferences(preferences) {
  const errors = [];

  // Theme validation
  if (preferences.theme && !['light', 'dark', 'auto'].includes(preferences.theme)) {
    errors.push('Theme không hợp lệ');
  }

  // Font size validation
  if (preferences.fontSize && !['small', 'medium', 'large'].includes(preferences.fontSize)) {
    errors.push('Kích thước font không hợp lệ');
  }

  // Boolean settings validation
  const booleanSettings = ['autoFocus', 'soundEnabled', 'animationsEnabled', 'showExplanations', 'shuffleQuestions'];
  booleanSettings.forEach(setting => {
    if (preferences[setting] !== undefined && typeof preferences[setting] !== 'boolean') {
      errors.push(`Cài đặt ${setting} phải là true/false`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Statistics Validators
 */

/**
 * Validate statistics data
 */
export function validateStatsData(stats) {
  const errors = [];

  // Required numeric fields
  const numericFields = ['totalQuestions', 'totalCorrect', 'totalWrong', 'maxStreak'];
  numericFields.forEach(field => {
    if (stats[field] !== undefined) {
      const value = Number(stats[field]);
      if (isNaN(value) || value < 0) {
        errors.push(`${field} phải là số không âm`);
      }
    }
  });

  // Logical consistency checks
  if (stats.totalCorrect + stats.totalWrong !== stats.totalQuestions) {
    errors.push('Tổng câu đúng + sai không khớp với tổng câu hỏi');
  }

  if (stats.totalCorrect > stats.totalQuestions) {
    errors.push('Số câu đúng không thể lớn hơn tổng số câu');
  }

  // Date validation
  if (stats.lastAccessed && isNaN(Date.parse(stats.lastAccessed))) {
    errors.push('Ngày truy cập cuối không hợp lệ');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Custom Validators
 */

/**
 * Create custom validator
 */
export function createCustomValidator(validatorFn, defaultMessage = 'Giá trị không hợp lệ') {
  return (value, customMessage = null) => {
    try {
      const isValid = validatorFn(value);
      return {
        isValid,
        message: isValid ? null : (customMessage || defaultMessage)
      };
    } catch (error) {
      return {
        isValid: false,
        message: 'Lỗi khi kiểm tra dữ liệu'
      };
    }
  };
}

/**
 * Async validator wrapper
 */
export function createAsyncValidator(asyncValidatorFn) {
  return async (value) => {
    try {
      const result = await asyncValidatorFn(value);
      return result;
    } catch (error) {
      return {
        isValid: false,
        message: 'Lỗi khi kiểm tra dữ liệu'
      };
    }
  };
}

/**
 * Utility Functions
 */

/**
 * Check if all validations pass
 */
export function allValid(...validationResults) {
  return validationResults.every(result => result.isValid);
}

/**
 * Get first error message from validation results
 */
export function getFirstError(...validationResults) {
  for (const result of validationResults) {
    if (!result.isValid && result.message) {
      return result.message;
    }
  }
  return null;
}

/**
 * Collect all error messages
 */
export function collectErrors(...validationResults) {
  return validationResults
    .filter(result => !result.isValid && result.message)
    .map(result => result.message);
}