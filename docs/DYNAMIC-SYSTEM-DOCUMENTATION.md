# 🚀 Dynamic Configuration System Documentation

## 📋 **TỔNG QUAN**

Hệ thống Japanese Learning App đã được chuyển đổi hoàn toàn từ **hardcoded values** sang **dynamic loading** từ các file JSON. Điều này cho phép:

- ✅ **Thay đổi nội dung** mà không cần code
- ✅ **Dễ dàng bảo trì** và mở rộng
- ✅ **Đa ngôn ngữ** và themes
- ✅ **Cấu hình linh hoạt** cho từng tính năng

---

## 📁 **CẤU TRÚC FILE JSON**

### **1. app-config.json** - Cấu hình ứng dụng chính
```json
{
  "app": { "name", "version", "description" },
  "categories": { "verbs", "adjectives", "nouns", "grammar" },
  "features": { "achievements", "statistics", "darkMode" },
  "ui": { "themes", "animations", "layout" }
}
```

### **2. messages.json** - Tất cả text và messages
```json
{
  "ui": { "navigation", "buttons", "labels", "titles" },
  "feedback": { "correct", "incorrect" },
  "errors": { "dataLoad", "networkError" },
  "success": { "dataLoaded", "progressSaved" },
  "quiz": { "instructions", "progress", "results" }
}
```

### **3. settings.json** - Cấu hình chi tiết
```json
{
  "performance": { "debounceDelay", "animationDuration" },
  "limits": { "maxWrongAnswers", "maxHistoryLength" },
  "defaults": { "theme", "language", "autoFocus" },
  "features": { "achievements", "sound", "animations" },
  "quiz": { "defaultQuestionTime", "shuffleQuestions" }
}
```

### **4. dom-selectors.json** - DOM elements và selectors
```json
{
  "ids": { "exerciseGrid", "answerInput", "questionText" },
  "classes": { "page", "hidden", "active", "btn" },
  "selectors": { "allPages", "allCards", "allButtons" },
  "attributes": { "dataExercise", "ariaLabel" },
  "events": { "click", "keydown", "exerciseSelected" }
}
```

### **5. animations.json** - Animation configuration
```json
{
  "durations": { "fast": 150, "normal": 300, "slow": 500 },
  "delays": { "autoFocus": 100, "autoHide": 2000 },
  "classes": { "fadeIn", "slideUp", "bounceIn" },
  "sequences": { "modalOpen", "pageTransition" }
}
```

### **6. keyboard-shortcuts.json** - Phím tắt
```json
{
  "navigation": { "theory": "1", "practice": "2" },
  "quiz": { "checkAnswer": "Enter", "exitQuiz": "Escape" },
  "general": { "search": "/", "help": "?" },
  "combinations": { "saveProgress": ["ctrl", "s"] }
}
```

### **7. exercise-definitions.json** - Định nghĩa bài tập
```json
{
  "exercise-id": {
    "title", "description", "category", "difficulty",
    "theory": { "content", "examples" },
    "enabled": true, "order": 1
  }
}
```

---

## 🔧 **CONFIG MANAGER**

### **Khởi tạo**
```javascript
import { ConfigManager } from './modules/config-manager.js';
const configManager = new ConfigManager();
await configManager.init();
```

### **Sử dụng cơ bản**
```javascript
// Lấy text
const buttonText = configManager.getMessage('ui.buttons.start');
const errorMsg = configManager.getErrorMessage('dataLoad', { error: 'timeout' });

// Lấy settings
const theme = configManager.getSetting('defaults.theme');
const isEnabled = configManager.isFeatureEnabled('achievements');

// Lấy DOM selectors
const elementId = configManager.getElementId('answerInput');
const cssClass = configManager.getCSSClass('btnPrimary');

// Lấy animations
const duration = configManager.getAnimationDuration('normal');
const animClass = configManager.getAnimationClass('fadeIn');

// Lấy keyboard shortcuts
const shortcut = configManager.getShortcutKey('quiz', 'checkAnswer');
```

---

## 🎯 **HELPER FUNCTIONS**

### **Import helpers**
```javascript
import { 
  getMessage, getSetting, isFeatureEnabled,
  getElementId, getCSSClass, getAnimationDuration,
  getShortcutKey, initializeConfig
} from './utils/constants.js';
```

### **Sử dụng helpers**
```javascript
// Text và messages
const title = getMessage('ui.titles.practice');
const feedback = getMessage('feedback.correct.messages');

// Settings và features
const autoFocus = getSetting('defaults.autoFocus');
if (isFeatureEnabled('darkMode')) { /* enable dark mode */ }

// DOM và animations
const inputId = getElementId('answerInput');
const fadeClass = getAnimationClass('fadeIn');
const duration = getAnimationDuration('normal');

// Keyboard shortcuts
const enterKey = getShortcutKey('quiz', 'checkAnswer');
```

---

## 🔄 **MIGRATION GUIDE**

### **Trước (Hardcoded)**
```javascript
// ❌ Hardcoded
const BUTTON_TEXT = 'Bắt đầu';
const ANIMATION_DURATION = 300;
const ELEMENT_ID = 'answer-input';
setTimeout(() => {}, 100);
```

### **Sau (Dynamic)**
```javascript
// ✅ Dynamic
const buttonText = getMessage('ui.buttons.start');
const duration = getAnimationDuration('normal');
const elementId = getElementId('answerInput');
const delay = getAnimationDelay('autoFocus');
setTimeout(() => {}, delay);
```

---

## 🎨 **CUSTOMIZATION**

### **Thay đổi text**
```json
// messages.json
{
  "ui": {
    "buttons": {
      "start": "Bắt đầu ngay!" // Thay đổi text button
    }
  }
}
```

### **Thêm animation mới**
```json
// animations.json
{
  "classes": {
    "customFade": "animate-custom-fade"
  },
  "durations": {
    "superFast": 100
  }
}
```

### **Cấu hình phím tắt mới**
```json
// keyboard-shortcuts.json
{
  "general": {
    "quickSave": {
      "key": "s",
      "modifiers": ["ctrl"],
      "action": "quickSave"
    }
  }
}
```

---

## 🚀 **ADVANCED FEATURES**

### **Message interpolation**
```javascript
// JSON: "errors": { "dataLoad": "Không thể tải {file}: {error}" }
const error = getMessage('errors.dataLoad', { 
  file: 'questions.json', 
  error: 'Network timeout' 
});
// Result: "Không thể tải questions.json: Network timeout"
```

### **Random messages**
```javascript
// JSON: "feedback": { "correct": { "messages": ["Tuyệt!", "Xuất sắc!"] } }
const randomFeedback = configManager.getRandomMessage('feedback.correct.messages');
```

### **Nested configuration**
```javascript
const layoutConfig = configManager.get('ui.layout.cardsPerRow');
// Returns: { "mobile": 1, "tablet": 2, "desktop": 3 }
```

### **Feature flags**
```javascript
if (isFeatureEnabled('achievements')) {
  // Show achievements system
}

if (isFeatureEnabled('sound')) {
  // Enable sound effects
}
```

---

## 🔧 **DEVELOPMENT WORKFLOW**

### **1. Thêm tính năng mới**
1. Thêm config vào `settings.json`
2. Thêm text vào `messages.json`
3. Thêm DOM selectors vào `dom-selectors.json`
4. Sử dụng helpers trong code

### **2. Testing**
```bash
# Mở test file
open test-dynamic.html

# Kiểm tra console logs
# Verify tất cả config được load thành công
```

### **3. Debugging**
```javascript
// Xem tất cả config
console.log(configManager.getAll());

// Kiểm tra specific config
console.log(configManager.get('features.achievements'));
console.log(configManager.getMessage('ui.buttons.start'));
```

---

## ✅ **BENEFITS**

### **🎯 Maintainability**
- Tách biệt data và logic
- Dễ dàng thay đổi mà không cần code
- Centralized configuration

### **🌍 Internationalization**
- Dễ dàng thêm ngôn ngữ mới
- Chỉ cần thay đổi messages.json

### **🎨 Theming**
- Dynamic theme switching
- Customizable animations
- Flexible UI configuration

### **⚡ Performance**
- Caching để tránh load lại
- Lazy loading khi cần
- Optimized bundle size

### **🔧 Developer Experience**
- Type-safe với JSDoc
- Auto-completion
- Clear API surface

---

## 🎉 **KẾT QUẢ**

✅ **100% Dynamic** - Không còn hardcode nào trong JavaScript
✅ **Flexible** - Có thể thay đổi mọi thứ qua JSON
✅ **Maintainable** - Dễ dàng bảo trì và mở rộng
✅ **Scalable** - Sẵn sàng cho tính năng mới
✅ **User-friendly** - Dễ dàng customize cho end users
