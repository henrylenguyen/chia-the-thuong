# 🎯 AI PROMPT - Japanese Learning App Project

## 📋 **Project Overview**

### **Application Purpose**
Japanese N5 learning app focused on **verb conjugation practice** from polite form (です/ます) to casual forms:
- **Te Form (て形)**: たべます → たべて
- **Ta Form (た形)**: たべました → たべた
- **Nai Form (ない形)**: たべません → たべない
- **Ru Form (る形)**: たべます → たべる

### **Key Statistics**
- **Total Questions**: 4200+
- **Grammar Patterns**: 47 patterns across 4 forms
- **N5 Verbs**: 121 verbs (Ichidan, Godan, Irregular)
- **Target Users**: Vietnamese speakers learning Japanese N5
- **Language**: Vietnamese UI with Japanese content

### **UI Design & Localization**
- **Primary Language**: Vietnamese (tất cả UI, giải thích, JSDoc)
- **Color Scheme**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Design Trend**: 2025 ethereal tones & sea-to-sky gradient
- **Mobile-First**: Optimized for Vietnamese mobile users

## 🏗️ **Technical Architecture**

### **Tech Stack**
```
Framework: Next.js 14 + TypeScript
State: Zustand + React Context (for nested components >3 levels)
Database: IndexedDB (Dexie.js) - REQUIRED for 4000+ questions
UI: Tailwind CSS + Radix UI
Testing: Jest + React Testing Library
Animations: Framer Motion
```

### **Why IndexedDB is MANDATORY**
```
4000+ questions × ~500 bytes = ~2MB+ questions data
+ User progress (4000+ records)
+ Statistics (47 patterns)
+ Spaced repetition data
= 20-100MB total storage

localStorage (5-10MB limit) → INSUFFICIENT ❌
IndexedDB (GB capacity) → REQUIRED ✅
```

### **Project Structure**
```
japanese-app/
├── app/
│   ├── (pages)/           # Next.js 14 pages
│   │   ├── home/
│   │   ├── theory/
│   │   ├── practice/
│   │   ├── review/
│   │   └── statistics/
│   ├── api/              # Server-side API routes
│   └── layout.tsx
├── components/           # Atomic Design
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── features/            # Client components
├── stores/              # Zustand stores
├── lib/                 # Database & utilities
└── data/               # JSON data files
```

## 📊 **Data Structure - 4000+ Questions Breakdown**

### **Te Form (て形) - 1200 questions**
**17 Grammar Patterns:**
- てください (120), てもいいです (100), てはいけません (100)
- ています (120), てから (80), てあげます (70)
- てくれます (70), てもらいます (70), ていただけませんか (60)
- てあります (60), てしまいます (60), ておきます (60)
- てみます (60), てきます (50), ても (50)
- Sequential actions (80), てかまいません (40)

### **Ta Form (た形) - 1000 questions**
**8 Grammar Patterns:**
- たことがあります (200), たことがありません (150)
- たほうがいいです (150), たばかりです (120)
- たあとで (120), たり...たりします (150)
- た + Noun modifier (100), たら conditional (100)

### **Nai Form (ない形) - 980 questions**
**10 Grammar Patterns:**
- ないでください (120), なくてはいけません (150)
- なければならない (100), なくてもいいです (120)
- ないで (80), ないと (100), なくて (80)
- ないほうがいいです (100), ないことがあります (80)
- ないでいる (50)

### **Ru Form (る形) - 1020 questions**
**12 Grammar Patterns:**
- つもりです (100), 予定です (80), ことができます (120)
- ことがあります (80), 前に (100), 時 (80)
- のが好きです (100), のが上手です (80), のが下手です (60)
- ために (80), と思います (80), でしょう (60)

## 🎯 **Component Architecture Rules**

### **Atomic Design Structure**
```
atoms/button/
├── button.tsx          # UI only (props → render)
├── useButton.tsx       # Logic only (handlers, state)
├── types.ts           # Local TypeScript definitions
├── index.stories.tsx   # Storybook stories
├── index.test.tsx      # Tests from Storybook
└── index.ts           # Exports
```

### **State Management Guidelines**
- **Zustand**: Global app state (theme, navigation, quiz state)
- **React Context**: Nested components >3 levels (Quiz, Theory interfaces)
- **Props**: Simple 1-2 level passing

### **Page Structure (Next.js 14)**
```
app/(pages)/home/page.tsx     # SSR + SEO → calls HomeClient
features/HomeClient.tsx       # "use client" + CSR logic
```

## 💾 **Database Schema (IndexedDB)**

### **Core Tables**
```typescript
interface Question {
  id: number;
  form: 'te' | 'ta' | 'nai' | 'ru';
  pattern: string;           // 'te_kudasai', 'ta_koto_ga_arimasu', etc.
  polite: string;           // たべます
  casual: string;           // たべて
  verb_type: 'ichidan' | 'godan' | 'irregular';
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: string;
  explanation: string;
}

interface UserProgress {
  id: number;
  question_id: number;
  correct: boolean;
  attempts: number;
  last_attempt: Date;
  next_review: Date;        // Spaced repetition
}
```

### **Performance Indexes**
```javascript
questions: '++id, form, pattern, verb_type, difficulty'
user_progress: '++id, question_id, next_review'
```

## 🔍 **Key Implementation Notes**

### **Context Usage Examples**
```typescript
// Quiz Context - for nested quiz components
<QuizProvider>
  <QuestionDisplay />      // Level 1
  <AnswerInput />         // Level 2  
  <FeedbackPanel />       // Level 3
  <ProgressTracker />     // Level 4 → Use Context!
</QuizProvider>

// Theory Context - for nested theory content
<TheoryProvider>
  <GrammarExplanation />  // Level 1
  <ExamplesList />        // Level 2
  <PracticeSection />     // Level 3 → Use Context!
</TheoryProvider>
```

### **Database Query Examples**
```javascript
// Random questions for quiz
const questions = await db.questions
  .where(['form', 'pattern'])
  .equals(['te', 'te_kudasai'])
  .limit(20)
  .toArray();

// Spaced repetition
const dueQuestions = await db.user_progress
  .where('next_review')
  .below(new Date())
  .limit(10)
  .toArray();
```

## 📋 **Current Status & Next Steps**

### **✅ Completed**
- Next.js 14 project setup
- Atomic Design folder structure  
- Basic components (Button, Input, Typography)
- HomeClient with grammar cards
- AppStore (Zustand)
- Database schema design (Dexie.js)

### **🚧 In Progress**
- JSON data structure (4000+ questions)
- Grammar patterns implementation

### **❌ TODO Priority**
1. **Fix useQuizStore import error** (HomeClient imports non-existent store)
2. **Create QuizStore with IndexedDB integration**
3. **Generate 4000+ questions JSON data**
4. **Implement API routes for data management**
5. **Create Practice, Theory, Review, Statistics pages**
6. **Setup Context for nested components**

## 🎯 **AI Assistant Guidelines**

### **When Working on This Project:**
1. **Always consider IndexedDB** for data operations (not localStorage)
2. **Use React Context** for components nested >3 levels
3. **Follow Atomic Design** structure strictly
4. **Separate UI and Logic** (component.tsx vs useComponent.tsx)
5. **Consider 4200+ questions scale** in all implementations
6. **Mobile-first approach** for UI components
7. **TypeScript strict mode** - always define interfaces
8. **Vietnamese-first localization** - all UI text, explanations, JSDoc in Vietnamese

## 📱🖥️ **Complete UI Design Specifications**

### **🎨 Logo & Loading Animation**
- **Logo Icon**: Torii gate (⛩️) symbol representing Japanese culture
- **Logo Text**: "日本語学習" (Japanese Learning)
- **Layout**: Torii icon + text horizontal layout
- **Loading Animation**: Bouncing torii + text effect - ONLY during initial page load
- **Normal State**: Static logo without animation after loading complete
- **Implementation**: Torii bounces first, then each text character with 0.1s delay

### **🎯 Exercise-Focused UI Patterns**
**App Purpose**: Grammar practice/exercise ONLY (not vocabulary learning)
- **Primary Interface**: Cloze deletion (fill-in-the-blank) quiz
- **Question Format**: Japanese sentence with `___` gap
- **Input Method**: Type answer with IME support
- **Feedback**: Immediate visual response (correct/incorrect)
- **Progressive Hints**: Space bar → hint → full translation

### **📱 Mobile UI Layout (375px - 768px)**

#### **🏠 Home Page Mobile:**
```
┌─────────────────────────────────┐
│ [🏮] 日本語学習    [🌙] Theme    │ ← Header với logo (static after load)
├─────────────────────────────────┤
│     📊 Progress Overview        │ ← Circular progress cho 4 forms
│   Te: 45%  Ta: 30%  Nai: 20%   │
│         Ru: 15%                 │
├─────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐      │ ← 2x2 Grid cho 4 forms
│  │ Te Form │  │ Ta Form │      │
│  │  て形   │  │  た形   │      │
│  │ 120 câu │  │ 100 câu │      │
│  └─────────┘  └─────────┘      │
│  ┌─────────┐  ┌─────────┐      │
│  │Nai Form │  │ Ru Form │      │
│  │ ない形  │  │  る形   │      │
│  │ 98 câu  │  │ 102 câu │      │
│  └─────────┘  └─────────┘      │
├─────────────────────────────────┤
│ [📚] [🎯] [📊] [⚙️]           │ ← Bottom nav
│ Lý  Luyện Thống  Cài           │
│ thuyết tập  kê   đặt           │
└─────────────────────────────────┘
```

#### **🎯 Quiz Interface Mobile:**
```
┌─────────────────────────────────┐
│ [←] Te Form - Câu 15/50  [🔄]  │ ← Progress header
├─────────────────────────────────┤
│                                 │
│    家具を買うなら、この         │ ← Japanese sentence
│    お店_______。                │   Large, clear font (20px)
│                                 │
│  ┌─────────────────────────────┐ │
│  │ [Nhập câu trả lời...]      │ │ ← Input field với IME
│  └─────────────────────────────┘ │
│                                 │
│  💡 Hint: "nothing better than" │ ← Hint system
│                                 │
│  ┌─────────────────────────────┐ │
│  │        [Kiểm tra]          │ │ ← Submit button
│  └─────────────────────────────┘ │
│                                 │
│ ████████████░░░░░░░░░░░░░░░░░░░ │ ← Progress bar
│ 15/50 câu (30%)                │
└─────────────────────────────────┘
```

### **🖥️ Desktop UI Layout (1440px+)**

#### **📐 Two-Column Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ [🏮] 日本語学習                           [🌙] Theme Toggle │ ← Header (80px)
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────────┐ │
│ │   SIDEBAR       │ │         MAIN CONTENT                │ │
│ │   (320px)       │ │         (1120px)                    │ │
│ │                 │ │                                     │ │
│ │ 📚 Lý thuyết    │ │  ┌─────────────────────────────────┐ │ │
│ │ 🎯 Luyện tập    │ │  │        QUIZ INTERFACE           │ │ │
│ │ 📊 Thống kê     │ │  │                                 │ │ │
│ │ ⚙️ Cài đặt      │ │  │                                 │ │ │
│ │                 │ │  └─────────────────────────────────┘ │ │
│ │ ─────────────── │ │                                     │ │
│ │ 📈 Progress     │ │  ┌─────────────────────────────────┐ │ │
│ │ Te: ████░░ 80%  │ │  │      SECONDARY CONTENT          │ │ │
│ │ Ta: ███░░░ 60%  │ │  │                                 │ │ │
│ │ Nai: ██░░░ 40%  │ │  └─────────────────────────────────┘ │ │
│ │ Ru: █░░░░ 20%   │ │                                     │ │
│ └─────────────────┘ └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### **🎯 Desktop Quiz Interface:**
```
┌─────────────────────────────────────────────────────────────┐
│                    MAIN CONTENT AREA (1120px)              │
├─────────────────────────────────────────────────────────────┤
│              家具を買うなら、このお店_______。                │ ← Large Japanese text (32px)
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                [Nhập câu trả lời...]                   │ │ ← Centered input (400px)
│  └─────────────────────────────────────────────────────────┘ │
│              💡 Hint: "nothing better than"                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    [Kiểm tra]                          │ │ ← Submit button (200px)
│  └─────────────────────────────────────────────────────────┘ │
│  ████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░ │ ← Progress bar
│                    15/50 câu (30%)                         │
└─────────────────────────────────────────────────────────────┘
```

### **Vietnamese Localization Requirements**
- **UI Language**: 100% Vietnamese interface
- **Grammar Explanations**: Vietnamese explanations for all Japanese patterns
- **JSDoc Comments**: Write all code documentation in Vietnamese
- **Error Messages**: Vietnamese error messages and user feedback
- **Examples**: Provide Vietnamese translations for Japanese examples
- **Cultural Context**: Explain Japanese concepts in Vietnamese cultural context

### **🎨 UI Component Specifications**

#### **💫 Loading Animation (Initial Load Only):**
```css
.logo-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-loading .torii-icon {
  animation: bounce 2s infinite;
  animation-delay: 0s;
  font-size: 24px;
}

.logo-loading .text-char:nth-child(1) { animation-delay: 0.1s; }  /* 日 */
.logo-loading .text-char:nth-child(2) { animation-delay: 0.2s; }  /* 本 */
.logo-loading .text-char:nth-child(3) { animation-delay: 0.3s; }  /* 語 */
.logo-loading .text-char:nth-child(4) { animation-delay: 0.4s; }  /* 学 */
.logo-loading .text-char:nth-child(5) { animation-delay: 0.5s; }  /* 習 */

.logo-loading .text-char {
  animation: bounce 2s infinite;
  display: inline-block;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* Static logo after loading */
.logo-static {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-static .torii-icon,
.logo-static .text-char {
  animation: none;
  transform: translateY(0);
}
```

#### **🎯 Quiz Feedback Animations:**
```css
/* Correct Answer */
.correct-feedback {
  background: linear-gradient(135deg, #10b981, #6ee7b7);
  color: white;
  animation: successPulse 0.6s ease-out;
}

/* Incorrect Answer */
.incorrect-feedback {
  background: linear-gradient(135deg, #ef4444, #f87171);
  color: white;
  animation: errorShake 0.4s ease-out;
}

@keyframes successPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

### **📐 Responsive Breakpoints:**
```css
/* Mobile First Approach */
.container {
  padding: 16px;
  max-width: 100%;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    max-width: 768px;
    margin: 0 auto;
  }

  .form-cards {
    display: grid;
    grid-template-columns: 1fr 1fr; /* 2 columns */
    gap: 24px;
  }
}

/* Desktop Small (1024px+) */
@media (min-width: 1024px) {
  .app-layout {
    display: grid;
    grid-template-columns: 320px 1fr; /* Sidebar + Main */
    min-height: 100vh;
  }

  .form-cards {
    grid-template-columns: repeat(3, 1fr); /* 3 columns */
  }
}

/* Desktop Large (1440px+) */
@media (min-width: 1440px) {
  .container {
    max-width: 1440px;
    padding: 32px;
  }

  .quiz-interface {
    max-width: 800px; /* Center quiz content */
    margin: 0 auto;
  }

  .form-cards {
    grid-template-columns: repeat(4, 1fr); /* 4 columns */
  }
}
```

### **Complete UI Color Palette (2025 Trends)**

#### **Primary Colors**
```css
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--primary-blue: #667eea;
--primary-purple: #764ba2;
--primary-blue-light: #8a9eff;
--primary-blue-dark: #4c5fd7;
--primary-purple-light: #9168c4;
--primary-purple-dark: #5d3a8a;
```

#### **Secondary Colors**
```css
--secondary-teal: #00cfc8;        /* Complementary to purple */
--secondary-orange: #ff8a50;      /* Complementary to blue */
--secondary-mint: #7fffd4;        /* Accent color */
--secondary-coral: #ff6b6b;       /* Warm accent */
```

#### **Neutral Colors**
```css
--neutral-white: #ffffff;
--neutral-gray-50: #f8fafc;
--neutral-gray-100: #f1f5f9;
--neutral-gray-200: #e2e8f0;
--neutral-gray-300: #cbd5e1;
--neutral-gray-400: #94a3b8;
--neutral-gray-500: #64748b;
--neutral-gray-600: #475569;
--neutral-gray-700: #334155;
--neutral-gray-800: #1e293b;
--neutral-gray-900: #0f172a;
--neutral-black: #000000;
```

#### **Semantic Colors**
```css
--success-green: #10b981;
--success-light: #6ee7b7;
--success-dark: #047857;
--warning-yellow: #f59e0b;
--warning-light: #fbbf24;
--warning-dark: #d97706;
--error-red: #ef4444;
--error-light: #f87171;
--error-dark: #dc2626;
--info-blue: #3b82f6;
--info-light: #60a5fa;
--info-dark: #1d4ed8;
```

#### **Background Variations**
```css
--bg-primary: var(--neutral-white);
--bg-secondary: var(--neutral-gray-50);
--bg-tertiary: var(--neutral-gray-100);
--bg-gradient: var(--primary-gradient);
--bg-overlay: rgba(102, 126, 234, 0.1);
```

#### **Text Colors**
```css
--text-primary: var(--neutral-gray-900);
--text-secondary: var(--neutral-gray-600);
--text-tertiary: var(--neutral-gray-400);
--text-inverse: var(--neutral-white);
--text-accent: var(--primary-blue);
```

#### **Border & Shadow**
```css
--border-light: var(--neutral-gray-200);
--border-medium: var(--neutral-gray-300);
--border-dark: var(--neutral-gray-400);
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-gradient: 0 4px 15px 0 rgba(102, 126, 234, 0.3);
```

#### **Design Psychology & Usage**
- **Primary Blue (#667eea)**: Trust, reliability, professionalism
- **Primary Purple (#764ba2)**: Creativity, wisdom, learning
- **Gradient**: Modern, dynamic, engaging for learning apps
- **Neutrals**: Clean, accessible, Vietnamese-friendly typography
- **Semantics**: Clear feedback for quiz results and progress

#### **🔧 Desktop-Specific Components:**
```css
/* Sidebar Navigation */
.sidebar {
  width: 320px;
  background: var(--neutral-white);
  border-right: 1px solid var(--border-light);
  padding: 24px;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.sidebar-nav-item:hover {
  background: var(--bg-overlay);
}

.sidebar-nav-item.active {
  background: var(--primary-gradient);
  color: white;
}

/* Desktop Quiz Layout */
.quiz-container-desktop {
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 24px;
}

.quiz-question-desktop {
  font-size: 32px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 48px;
  color: var(--text-primary);
}

.quiz-input-desktop {
  width: 400px;
  margin: 0 auto 24px;
  font-size: 20px;
  padding: 16px 24px;
  border-radius: 12px;
  border: 2px solid var(--border-medium);
  text-align: center;
}
```

#### **📱 Mobile-Specific Components:**
```css
/* Mobile Quiz Interface */
.quiz-question-mobile {
  font-size: 20px;
  line-height: 1.6;
  margin-bottom: 24px;
  text-align: center;
  padding: 0 16px;
}

.quiz-input-mobile {
  font-size: 18px;
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  margin-bottom: 16px;
}

.submit-button-mobile {
  height: 48px; /* Minimum touch target */
  font-size: 16px;
  border-radius: 12px;
  width: 100%;
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: var(--neutral-white);
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  min-width: 60px;
}

.bottom-nav-item.active {
  color: var(--primary-blue);
  border-bottom: 2px solid var(--primary-blue);
}
```

#### **Implementation Guidelines**
1. **CSS Variables**: Use CSS custom properties for all colors
2. **Tailwind Config**: Extend Tailwind with custom color palette
3. **Dark Mode**: Prepare neutral variations for future dark theme
4. **Accessibility**: Ensure 4.5:1 contrast ratio for text
5. **Consistency**: Use semantic colors for consistent UX
6. **Mobile**: Test gradient performance on mobile devices
7. **Loading Animation**: Only trigger bouncing on initial page load
8. **Static Logo**: Remove animation after loading complete

#### **Usage Examples**
```css
/* Primary actions */
.btn-primary { background: var(--primary-gradient); }

/* Success states */
.quiz-correct { color: var(--success-green); }

/* Error states */
.quiz-incorrect { color: var(--error-red); }

/* Text hierarchy */
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }

/* Loading state */
.logo-container.loading .logo-text {
  animation: bounce 2s infinite;
}

/* Loaded state */
.logo-container.loaded .logo-text {
  animation: none;
}
```

### **🎯 Key UX Principles for Exercise-Focused App:**
1. **Single Focus**: Một câu hỏi per screen, không distraction
2. **Immediate Feedback**: Instant response với clear visual cues
3. **Progress Transparency**: Always show where user stands
4. **Error Recovery**: Easy retry mechanism
5. **Context Preservation**: Sentences feel natural, not artificial
6. **Loading States**: Bouncing logo ONLY on initial load
7. **Static Interface**: Clean, distraction-free after loading

### **📋 Component Priority Implementation:**

#### **Phase 1 - Core Quiz Interface:**
1. **QuizCard** - Main exercise interface với cloze deletion
2. **ProgressBar** - Visual progress tracking
3. **FeedbackPanel** - Answer feedback với animations
4. **InputField** - Japanese IME support
5. **LoadingScreen** - Bouncing logo animation

#### **Phase 2 - Navigation & Stats:**
1. **FormCard** - 4 grammar form cards (Te/Ta/Nai/Ru)
2. **StatsCircle** - Circular progress indicators
3. **HeatmapCalendar** - Activity tracking
4. **BottomNav** - Mobile navigation
5. **Sidebar** - Desktop navigation

#### **Phase 3 - Advanced Features:**
1. **HintSystem** - Progressive hint revealing
2. **StreakCounter** - Gamification elements
3. **ThemeToggle** - FAB theme switcher
4. **ExportData** - Progress backup

### **🔄 Navigation Differences:**

#### **Mobile Navigation:**
- Bottom tab bar (4 tabs: Lý thuyết, Luyện tập, Thống kê, Cài đặt)
- FAB cho theme toggle
- Swipe gestures cho quiz navigation

#### **Desktop Navigation:**
- Left sidebar (always visible)
- Top header với logo và theme toggle
- Breadcrumb navigation
- Hover states cho better UX
- Keyboard shortcuts support

### **📐 Layout Grid System:**

#### **Mobile (375px):**
- Single Column, Full Width, 16px padding
- 2x2 grid cho 4 grammar forms
- Bottom navigation (80px height)

#### **Tablet (768px):**
- Two Column Grid, 24px padding, 24px gap
- 2x2 grid maintained cho consistency

#### **Desktop (1440px):**
- Sidebar (320px) + Main Content (1120px)
- 4-column grid cho grammar forms
- Enhanced typography và spacing

### **Common Patterns to Implement:**
- Pagination for large datasets (50 questions/page)
- Spaced repetition algorithm
- Progress tracking across 47 grammar patterns
- Random question selection with difficulty weighting
- Offline-first data synchronization
- Cloze deletion quiz interface
- Progressive hint system
- Immediate visual feedback

### **Performance Considerations:**
- Lazy loading for large question sets
- Virtual scrolling for long lists
- Background data preloading
- Memory-efficient state management
- IndexedDB transaction optimization
- Animation performance on mobile
- Responsive image loading

---

## 🎯 **Final Implementation Notes**

### **🚀 Key Features Summary:**
- **Exercise-Only Focus**: Grammar practice app, NOT vocabulary learning
- **4200+ Questions**: Te (1200), Ta (1000), Nai (980), Ru (1020) forms
- **Cloze Deletion Interface**: Fill-in-the-blank với Japanese sentences
- **Progressive Hints**: Space bar → hint → full translation
- **Responsive Design**: Mobile-first với desktop enhancements
- **Loading Animation**: Bouncing "日本語学習" characters ONLY on initial load
- **Static Logo**: Clean interface after loading complete
- **Vietnamese UI**: 100% Vietnamese interface với Japanese content

### **🎨 Visual Identity:**
- **Color Scheme**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Typography**: Noto Sans JP (Japanese) + Inter (Vietnamese)
- **Animation**: Subtle, purposeful, performance-optimized
- **Accessibility**: WCAG 2.1 AA compliance

### **📱 Platform Priorities:**
1. **Mobile-First**: Primary target platform
2. **Desktop Enhancement**: Sidebar navigation, larger content areas
3. **Tablet Support**: Responsive grid layouts
4. **Cross-Browser**: Modern browser support

---

**Remember**: This is a production-ready Japanese grammar exercise app targeting 4200+ questions with complex patterns. Every decision should consider scalability, performance, and user experience at this scale. The app is specifically for PRACTICE/EXERCISE only, not vocabulary learning, which influences all UI pattern choices.
