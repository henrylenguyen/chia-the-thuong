# 🎯 Simplified Dynamic Configuration Proposal

## 📋 **NGUYÊN TẮC**
- **Dynamic**: Những gì user/admin cần thay đổi
- **Static**: Những gì là technical constants
- **Maintainable**: Dễ hiểu, dễ bảo trì

---

## ✅ **GIỮ LẠI (Thực sự cần dynamic)**

### **1. messages.json** - UI Text & Internationalization
```json
{
  "ui": {
    "buttons": { "start": "Bắt đầu", "check": "Kiểm tra" },
    "labels": { "correct": "Câu đúng", "total": "Tổng câu" },
    "titles": { "theory": "Lý thuyết", "practice": "Thực hành" }
  },
  "feedback": {
    "correct": ["Chính xác!", "Tuyệt vời!", "Hoàn hảo!"],
    "incorrect": ["Chưa đúng!", "Thử lại!", "Gần đúng rồi!"]
  },
  "errors": {
    "dataLoad": "Không thể tải dữ liệu",
    "networkError": "Lỗi kết nối mạng"
  }
}
```

### **2. app-config.json** - App Settings & Features
```json
{
  "app": {
    "name": "Japanese Learning App",
    "version": "1.0.0",
    "defaultLanguage": "vi"
  },
  "features": {
    "achievements": true,
    "darkMode": true,
    "sound": false,
    "hints": true
  },
  "categories": {
    "verbs": { "name": "Động Từ", "icon": "fas fa-running", "color": "blue" },
    "adjectives": { "name": "Tính Từ", "icon": "fas fa-palette", "color": "purple" }
  }
}
```

### **3. exercise-definitions.json** - Exercise Content
```json
{
  "verbs-present": {
    "title": "Động Từ - Hiện Tại",
    "description": "Luyện tập chuyển đổi động từ",
    "category": "verbs",
    "difficulty": "beginner",
    "enabled": true,
    "theory": { "content": "...", "examples": [...] }
  }
}
```

---

## ❌ **XÓA BỎ (Không cần dynamic)**

### **1. dom-selectors.json** ❌
**Lý do**: DOM IDs là technical constants, không cần thay đổi
```javascript
// Thay vì dynamic
const inputId = getElementId('answerInput');

// Giữ hardcode
const inputId = 'answer-input'; // Clear và đơn giản
```

### **2. animations.json** ❌  
**Lý do**: Animation values là design decisions, ít khi thay đổi
```javascript
// Thay vì dynamic
const duration = getAnimationDuration('normal');

// Giữ hardcode
const ANIMATION_DURATION = 300; // Clear constant
```

### **3. keyboard-shortcuts.json** ❌
**Lý do**: Keyboard codes là browser standards
```javascript
// Thay vì dynamic
const enterKey = getShortcutKey('quiz', 'checkAnswer');

// Giữ hardcode
if (e.key === 'Enter') { ... } // Standard và clear
```

### **4. settings.json** (Một phần) ❌
**Lý do**: Performance settings là developer concerns
```javascript
// Thay vì dynamic
const debounceDelay = getSetting('performance.debounceDelay');

// Giữ hardcode
const DEBOUNCE_DELAY = 300; // Performance constant
```

---

## 🔧 **SIMPLIFIED CONFIG MANAGER**

### **Chỉ quản lý 3 file JSON:**
```javascript
export class ConfigManager {
  constructor() {
    this.messages = null;
    this.appConfig = null;
    this.exercises = null;
  }

  async init() {
    await Promise.all([
      this.loadMessages(),
      this.loadAppConfig(), 
      this.loadExercises()
    ]);
  }

  // Simple helpers
  getMessage(path, params = {}) { ... }
  getAppConfig(path) { ... }
  isFeatureEnabled(feature) { ... }
  getCategory(key) { ... }
}
```

### **Helper functions đơn giản:**
```javascript
// Chỉ export những gì cần thiết
export function getMessage(path, params = {}) { ... }
export function isFeatureEnabled(feature) { ... }
export function getCategory(key) { ... }
export function getFeedback(type) { ... }
```

---

## 🎯 **CONSTANTS.JS SIMPLIFIED**

```javascript
// Technical constants - giữ hardcode
export const DOM_IDS = {
  ANSWER_INPUT: 'answer-input',
  QUESTION_TEXT: 'question-text',
  FEEDBACK: 'feedback',
  NEXT_BTN: 'next-btn'
};

export const CSS_CLASSES = {
  HIDDEN: 'hidden',
  ACTIVE: 'active',
  BTN_PRIMARY: 'btn-primary',
  ANIMATE_FADE_IN: 'animate-fade-in'
};

export const TIMING = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  AUTO_FOCUS_DELAY: 100,
  AUTO_HIDE_DELAY: 2000
};

export const KEYBOARD = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight'
};

// Storage keys
export const STORAGE_KEYS = {
  GLOBAL_STATS: 'globalStats',
  WRONG_ANSWERS: 'wrongAnswers',
  USER_PREFERENCES: 'userPreferences'
};
```

---

## 💡 **USAGE EXAMPLES**

### **Dynamic (User-configurable):**
```javascript
// UI Text - có thể thay đổi cho đa ngôn ngữ
const buttonText = getMessage('ui.buttons.start');
const feedback = getMessage('feedback.correct');

// Features - admin có thể bật/tắt
if (isFeatureEnabled('achievements')) {
  showAchievements();
}

// Categories - có thể thêm/sửa
const category = getCategory('verbs');
```

### **Static (Technical constants):**
```javascript
// DOM - cố định trong code
const input = document.getElementById(DOM_IDS.ANSWER_INPUT);
input.classList.add(CSS_CLASSES.HIDDEN);

// Timing - performance constants
setTimeout(() => input.focus(), TIMING.AUTO_FOCUS_DELAY);

// Keyboard - browser standards  
if (e.key === KEYBOARD.ENTER) {
  checkAnswer();
}
```

---

## ✅ **BENEFITS**

### **🎯 Clarity:**
- Rõ ràng cái gì dynamic, cái gì static
- Code dễ đọc và hiểu
- Ít confusion cho developers

### **🔧 Maintainability:**
- Ít file JSON để quản lý
- Technical constants ở một chỗ
- Không over-engineering

### **⚡ Performance:**
- Ít network requests
- Faster initialization
- Smaller bundle size

### **👥 Developer Experience:**
- Auto-completion tốt hơn
- Type safety
- Clear separation of concerns

---

## 🚀 **MIGRATION PLAN**

### **1. Giữ lại:**
- ✅ `messages.json`
- ✅ `app-config.json` 
- ✅ `exercise-definitions.json`

### **2. Xóa bỏ:**
- ❌ `dom-selectors.json`
- ❌ `animations.json`
- ❌ `keyboard-shortcuts.json`
- ❌ `settings.json` (phần performance)

### **3. Refactor:**
- 🔧 Simplified `ConfigManager`
- 🔧 Clear constants in `constants.js`
- 🔧 Remove over-abstraction

---

## 🎉 **RESULT**

**BEFORE**: 7 JSON files, complex abstraction, over-engineering
**AFTER**: 3 JSON files, clear separation, maintainable

**Rule**: Dynamic cho user-configurable, Static cho technical constants!
