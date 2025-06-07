# 🚀 Japanese Learning App - Migration Plan

> **Chuyển đổi từ Vanilla JS sang Next.js 14 + TypeScript**

## 📋 Tổng quan dự án

### 🎯 Mục tiêu
Nâng cấp ứng dụng học tiếng Nhật hiện tại từ Vanilla JavaScript sang một kiến trúc hiện đại, scalable và professional với Next.js 14.

### 🛠️ Tech Stack

| Công nghệ | Hiện tại | Tương lai |
|-----------|----------|-----------|
| **Framework** | Vanilla JS | Next.js 14 + TypeScript |
| **Styling** | Tailwind CSS | Tailwind CSS + SCSS |
| **Components** | Custom | Radix UI + Custom |
| **State Management** | localStorage | Zustand + React Context |
| **Database** | localStorage | IndexedDB (Dexie.js) |
| **Testing** | Manual | Jest + RTL + Storybook |
| **Animations** | CSS + JS | Framer Motion |
| **3D Graphics** | None | Three.js + R3F |

### 📚 Documentation Structure
- `DEVELOPMENT.md` - Phase tracking với checkmarks
- `API.md` - API routes documentation
- `AIPromptContext.md` - Context summary cho AI

### 📏 Code Standards & Architecture Rules

#### 🏗️ **API Layer (Next.js Server)**
- ✅ Gọi JSON ở tầng server (Next.js API routes)
- ✅ Tận dụng middleware cho error handling, logging
- ✅ Tạo shared utilities cho API calls (error handling, loading states)
- ❌ Không cần custom hooks trong API layer

#### 🧩 **Atomic Design Structure**
```
atoms/
  button/
    ├── button.tsx          # Chỉ hiển thị giao diện (UI thuần túy)
    ├── useButton.tsx       # Logic đem hết qua hooks
    ├── types.ts           # Local TypeScript interfaces
    ├── index.stories.tsx   # Storybook stories
    ├── index.test.tsx      # Test từ Storybook components
    ├── index.ts           # Export components
    └── styles.scss        # Optional - khi UI khó custom
```

#### � **Page Structure (Next.js 14)**
```
app/
  (pages)/
    home/
      └── page.tsx         # SSR + SEO → gọi HomeClient
  features/
    └── HomeClient.tsx     # "use client" + CSR logic
```

#### 🎯 **Component Rules**
- ✅ `*.tsx` - Chỉ nhận props và render UI
- ✅ `use*.tsx` - Tất cả logic (handlers, state, validation)
- ✅ **Context cho component trees phức tạp** - Khi components lồng nhau >3 levels, ưu tiên React Context thay vì prop drilling hoặc state management khác
- ✅ `index.test.tsx` - Import từ Storybook (không tạo mới)

#### 📊 **Data Management**
```
stores/
  ├── app/           # Global app state
  ├── quiz/          # Quiz-specific state
  └── progress/      # Progress tracking
```

**Context Usage Guidelines:**
- ✅ **Quiz Context** - Quiz interface với nhiều nested components (Question → Answer → Feedback → Progress)
- ✅ **Theory Context** - Theory display với nested content (Grammar → Examples → Practice → Navigation)
- ✅ **Theme Context** - Theme state cho deeply nested UI components
- ❌ **Simple prop passing** - Chỉ 1-2 levels, dùng props bình thường

#### � **Context Usage Patterns**
**Khi nào dùng Context:**
- ✅ Component tree có > 3 tầng lồng nhau
- ✅ Nhiều components cùng cần access shared state
- ✅ Quiz interface với nhiều sub-components
- ✅ Theory display với nested content sections

**Context Structure:**
```
contexts/
  ├── QuizContext.tsx        # Quiz session state
  ├── TheoryContext.tsx      # Theory content state
  └── ProgressContext.tsx    # Progress tracking
```

**Ví dụ Context vs Props:**
```typescript
// ❌ Prop drilling (tránh khi > 3 tầng)
<QuizContainer>
  <QuizHeader score={score} />
  <QuizBody>
    <QuizQuestion question={question} onAnswer={onAnswer} />
    <QuizProgress current={current} total={total} />
  </QuizBody>
</QuizContainer>

// ✅ Context pattern (ưu tiên khi phức tạp)
<QuizProvider>
  <QuizContainer>
    <QuizHeader />
    <QuizBody>
      <QuizQuestion />
      <QuizProgress />
    </QuizBody>
  </QuizContainer>
</QuizProvider>
```

#### �📝 **TypeScript Organization**
- ✅ `types/` folder cho shared interfaces (dùng chung nhiều components)
- ✅ `types.ts` trong thư mục component cho local types (chỉ component đó dùng)
- ✅ JSDoc comments bằng tiếng Việt
- ✅ Maximum 500 lines per file
- ✅ Export types từ `index.ts` khi cần share

#### 🔍 **SEO Requirements**
- ✅ Metadata cho mọi page (title, description, keywords)
- ✅ Open Graph tags
- ✅ Structured data
- ✅ Sitemap generation

---

## � Project Structure Overview

```
japanese-app-nextjs/
├── app/
│   ├── (pages)/                    # Page routes
│   │   ├── home/
│   │   │   └── page.tsx           # SSR + SEO → HomeClient
│   │   ├── theory/
│   │   │   ├── page.tsx           # Theory list page
│   │   │   └── [form]/
│   │   │       └── page.tsx       # Dynamic theory detail
│   │   ├── practice/
│   │   │   └── page.tsx           # Practice page
│   │   ├── review/
│   │   │   └── page.tsx           # Review page
│   │   └── statistics/
│   │       └── page.tsx           # Statistics page
│   ├── api/                       # Next.js API routes
│   │   ├── theory/
│   │   ├── exercises/
│   │   └── progress/
│   ├── globals.css
│   ├── layout.tsx                 # Root layout
│   ├── loading.tsx                # Global loading
│   └── error.tsx                  # Global error boundary
├── components/
│   ├── atoms/                     # Atomic components
│   │   ├── button/
│   │   │   ├── button.tsx         # UI component
│   │   │   ├── useButton.tsx      # Logic hooks
│   │   │   ├── types.ts           # Local types
│   │   │   ├── index.stories.tsx  # Storybook
│   │   │   ├── index.test.tsx     # Tests
│   │   │   ├── index.ts           # Exports
│   │   │   └── styles.scss        # Optional
│   │   └── input/
│   ├── molecules/                 # Molecule components
│   └── organisms/                 # Organism components
├── features/                      # Client components
│   ├── HomeClient.tsx
│   ├── TheoryClient.tsx
│   ├── PracticeClient.tsx
│   ├── ReviewClient.tsx
│   └── StatisticsClient.tsx
├── stores/                        # Zustand stores
│   ├── app/
│   ├── quiz/
│   ├── progress/
│   └── user/
├── types/                         # Shared TypeScript types
├── utils/                         # Shared utilities
├── lib/                          # Database & external libs
│   └── db.ts                     # Dexie.js setup
└── public/                       # Static assets
```

---

## �📅 Timeline Overview

**Tổng thời gian:** 18-25 ngày (8 phases)

---

## 📋 Chi tiết các Phase
### 🏗️ Phase 1: Project Setup & Architecture
**Timeline:** 2-3 ngày

#### 📦 Task 1.1: Initialize Next.js 14 Project
- [x] Create Next.js 14 project với TypeScript
- [x] Configure `next.config.js` cho app router
- [x] Setup ESLint + Prettier configuration
- [x] Configure `tsconfig.json` với strict mode
- [x] Setup `.gitignore` và environment files

#### 🎨 Task 1.2: Setup Styling & UI Foundation
- [x] Install và configure Tailwind CSS
- [x] Setup SCSS support
- [x] Install Radix UI core packages
- [x] Configure dark mode với next-themes
- [x] Create global styles và CSS variables

#### 📁 Task 1.3: Create Atomic Design Structure
- [x] Setup folder structure: `atoms/`, `molecules/`, `organisms/`
- [x] Create component templates theo quy tắc:
  - `component.tsx` (UI thuần túy)
  - `useComponent.tsx` (logic hooks)
  - `types.ts` (local TypeScript interfaces)
  - `index.stories.tsx` (Storybook)
  - `index.test.tsx` (test từ Storybook)
  - `index.ts` (barrel exports)
  - `styles.scss` (optional)
- [x] Setup `features/` folder cho Client components
- [x] Create `stores/` structure cho Zustand

#### 🛠️ Task 1.4: Setup Development Tools
- [x] Install và configure Storybook
- [x] Setup Jest + React Testing Library
- [x] Configure Framer Motion
- [x] Setup Zustand store structure
- [x] Create development scripts

#### 📖 Task 1.5: Create Documentation Templates
- [x] Create `DEVELOPMENT.md` với phase tracking
- [x] Create `API.md` template
- [x] Create `AIPromptContext.md` template
- [x] Setup component documentation standards
- [x] Create `STORYBOOK_SETUP.md` với detailed setup guide

#### ✅ Deliverables Phase 1: **COMPLETED** ✅
- ✅ Working Next.js 14 project
- ✅ Complete folder structure
- ✅ Development environment ready
- ✅ Documentation framework
- ✅ Storybook 8.6 với autodocs working
- ✅ 4 atomic components với full documentation
### 🧩 Phase 2: Complete Component Library
**Timeline:** 3-4 ngày (Component-first approach)

#### 🃏 Task 2.1: Molecule Components - Cards
**Theory Card** ✅ **COMPLETED**
- [x] `theory-card.tsx` - Grammar explanation display với responsive width
- [x] `useTheoryCard.tsx` - Expand/collapse logic, navigation
- [x] `theory-card.stories.tsx` - All states showcase với responsive demo
- [x] `theory-card.test.tsx` - Unit tests
- [x] **React Icons integration** - FaToriiGate, IoIcons thay thế SVG
- [x] **Gradient text effects** - CSS gradient classes (.gradient-text, .gradient-bg)
- [x] **Device detection** - useDeviceDetection hook cho responsive behavior
- [x] **Responsive width** - Adaptive card sizing theo screen size

**Exercise Card** ✅ **COMPLETED**
- [x] `exercise-card.tsx` - Exercise selection interface
- [x] `useExerciseCard.tsx` - Selection logic, progress display
- [x] `exercise-card.stories.tsx` - All variants showcase
- [x] `exercise-card.test.tsx` - Unit tests
- [x] **React Icons integration** - IoPlayCircleOutline, IoStar, IoHelpCircleOutline, IoTimeOutline
- [x] **Progress tracking** - Exercise progress display với completion percentage
- [x] **Action buttons** - Bắt đầu/Tiếp tục/Ôn tập based on status
- [x] **Responsive design** - useResponsiveCardSize hook integration
- [x] **Difficulty stars** - Visual difficulty indicator với filled/empty stars

**Quiz Card** ✅ **COMPLETED**
- [x] `quiz-card.tsx` - Quiz question presentation
- [x] `useQuizCard.tsx` - Question logic, answer validation
- [x] `quiz-card.stories.tsx` - Question types showcase
- [x] `quiz-card.test.tsx` - Unit tests
- [x] **Japanese Input integration** - JapaneseInput component với success/error states
- [x] **Multiple question types** - Fill-in, multiple choice, conjugation, translation
- [x] **Timer functionality** - Countdown timer với warning states
- [x] **Feedback system** - Correct/incorrect feedback với explanations
- [x] **Progress tracking** - Question X of Y với progress percentage

**Stats Card**
- [ ] `stats-card.tsx` - Statistics visualization
- [ ] `useStatsCard.tsx` - Data calculation, formatting
- [ ] `stats-card.stories.tsx` - Different metrics showcase
- [ ] `stats-card.test.tsx` - Unit tests

#### 📝 Task 2.2: Molecule Components - Forms
**Quiz Form**
- [ ] `quiz-form.tsx` - Answer submission form
- [ ] `useQuizForm.tsx` - Form validation, submission logic
- [ ] `quiz-form.stories.tsx` - Form states showcase
- [ ] `quiz-form.test.tsx` - Unit tests

**Search Form**
- [ ] `search-form.tsx` - Search functionality
- [ ] `useSearchForm.tsx` - Search logic, filtering
- [ ] `search-form.stories.tsx` - Search scenarios showcase
- [ ] `search-form.test.tsx` - Unit tests

#### 🧭 Task 2.3: Molecule Components - Navigation
**Nav Item**
- [ ] `nav-item.tsx` - Navigation menu item
- [ ] `useNavItem.tsx` - Active state, navigation logic
- [ ] `nav-item.stories.tsx` - All states showcase
- [ ] `nav-item.test.tsx` - Unit tests

**Breadcrumb**
- [ ] `breadcrumb.tsx` - Navigation breadcrumb
- [ ] `useBreadcrumb.tsx` - Path generation, navigation
- [ ] `breadcrumb.stories.tsx` - Different paths showcase
- [ ] `breadcrumb.test.tsx` - Unit tests

#### ✅ Deliverables Phase 2:
- ✅ 8 Molecule components với full documentation
- ✅ Storybook stories cho all molecules
- ✅ Unit tests coverage > 80%
- ✅ Ready for organism composition
### 🦠 Phase 3: Organism Components
**Timeline:** 3-4 ngày

#### ⚛️ Task 3.1: Atoms Development

**Button Component** ✅ **COMPLETED**
- [x] `button.tsx` - Multiple variants (8 variants với gradient theme)
- [x] `useButton.tsx` - Click handling, loading states
- [x] `button.stories.tsx` - All variants showcase với autodocs
- [x] `button.test.tsx` - Unit tests

**Input Components** ✅ **COMPLETED**
- [x] `japanese-input/` - IME support với validation states
- [x] `japanese-input.stories.tsx` - All states showcase với autodocs
- [x] `japanese-input.test.tsx` - Unit tests
- [ ] `text-input/` - Basic text input (if needed)
- [ ] `search-input/` - Search functionality (if needed)

**Logo Component** ✅ **COMPLETED**
- [x] `logo.tsx` - Torii gate + Japanese text với bouncing animation
- [x] `logo.stories.tsx` - All variants showcase với autodocs
- [x] `logo.test.tsx` - Unit tests

**Progress Bar Component** ✅ **COMPLETED**
- [x] `progress-bar.tsx` - Gradient fills với app theme
- [x] `progress-bar.stories.tsx` - All variants showcase với autodocs
- [x] `progress-bar.test.tsx` - Unit tests

**Typography Components** (Next Priority)
- [ ] `heading/` - H1-H6 variants
- [ ] `text/` - Body text variants
- [ ] `japanese-text/` - Japanese-specific styling

**Icon Components** (Next Priority)
- [ ] `icon/` - Icon wrapper
- [ ] `loading-spinner/` - Loading states

#### 🔬 Task 3.2: Molecules Development

**Card Components**
- [ ] `theory-card/` - Theory display
- [ ] `exercise-card/` - Exercise selection
- [ ] `quiz-card/` - Quiz interface
- [ ] `stats-card/` - Statistics display

**Form Components**
- [ ] `quiz-form/` - Quiz answer form
- [ ] `search-form/` - Search functionality

**Navigation Components**
- [ ] `nav-item/` - Navigation item
- [ ] `breadcrumb/` - Breadcrumb navigation

#### 🦠 Task 3.3: Organisms Development

**Header Component**
- [ ] Navigation menu
- [ ] Theme toggle
- [ ] Progress indicator

**Quiz Interface** (với Context cho nested components)
- [ ] Question display
- [ ] Answer input
- [ ] Feedback system
- [ ] Progress tracking
- [ ] **QuizContext** - Share quiz state across deeply nested components

**Theory Display** (với Context cho nested content)
- [ ] Grammar explanation
- [ ] Examples showcase
- [ ] Interactive elements
- [ ] **TheoryContext** - Share theory state và navigation

#### 🧪 Task 3.4: Component Testing & Documentation
- [ ] Write comprehensive tests cho tất cả components
- [ ] Create Storybook stories
- [ ] Add JSDoc documentation tiếng Việt
- [ ] Test responsive behavior

#### ✅ Deliverables Phase 3:
- ✅ Complete atomic component library
- ✅ Storybook documentation
- ✅ Unit tests coverage > 80%
- ✅ Responsive design verified

---

### 📄 Phase 4: Next.js Pages & Features
**Timeline:** 4-5 ngày

#### 🗂️ Task 4.1: App Router Setup
- [ ] Configure app router structure: `app/(pages)/`
- [ ] Create shared layout components (header, footer, navigation)
- [ ] Setup navigation between pages
- [ ] Implement loading states (`loading.tsx`)
- [ ] Create error boundaries (`error.tsx`)
- [ ] Setup SEO metadata cho tất cả pages
- [ ] Configure sitemap generation

#### 📚 Task 4.2: Theory Page Implementation

**Theory Page** (`app/(pages)/theory/page.tsx`)
- [ ] SSR với SEO metadata (title, description, keywords)
- [ ] Fetch grammar list từ API routes
- [ ] Gọi `TheoryClient` component

**Theory Client** (`app/features/TheoryClient.tsx`)
- [ ] "use client" directive
- [ ] Interactive grammar explorer
- [ ] Theory content display
- [ ] Navigation between grammar types
- [ ] Sử dụng Zustand stores cho state management

**Theory Detail** (`app/(pages)/theory/[form]/page.tsx`)
- [ ] Dynamic routing cho Te, Ta, Nai, Ru
- [ ] SSR với dynamic SEO metadata
- [ ] Gọi `TheoryDetailClient` component

#### 🎯 Task 4.3: Practice Page Implementation

**Practice Page** (`app/(pages)/practice/page.tsx`)
- [ ] SSR với SEO metadata
- [ ] Fetch available grammar forms từ API
- [ ] Gọi `PracticeClient` component

**Practice Client** (`app/features/PracticeClient.tsx`)
- [ ] "use client" directive
- [ ] Grammar form selection interface
- [ ] Practice mode selection
- [ ] Quiz interface integration
- [ ] Progress tracking với Zustand stores

**Quiz Components Integration**
- [ ] Question renderer từ atomic components
- [ ] Answer input handler với validation
- [ ] Feedback system với animations
- [ ] Results display với statistics

#### 🔄 Task 4.4: Review Page Implementation

**Review Page** (`app/(pages)/review/page.tsx`)
- [ ] SSR với SEO metadata
- [ ] Fetch wrong answers từ API
- [ ] Gọi `ReviewClient` component

**Review Client** (`app/features/ReviewClient.tsx`)
- [ ] "use client" directive
- [ ] Filter by grammar form interface
- [ ] Spaced repetition logic implementation
- [ ] Review quiz interface với progress tracking

#### 📊 Task 4.5: Statistics Page Implementation

**Statistics Page** (`app/(pages)/statistics/page.tsx`)
- [ ] SSR với SEO metadata
- [ ] Fetch statistics data từ API
- [ ] Gọi `StatisticsClient` component

**Statistics Client** (`app/features/StatisticsClient.tsx`)
- [ ] "use client" directive
- [ ] Interactive progress charts
- [ ] Data management interface
- [ ] Export/Import functionality với validation

#### ✅ Deliverables Phase 4:
- ✅ 4 pages hoạt động đầy đủ
- ✅ Client-side interactivity
- ✅ Navigation flow complete
- ✅ Data persistence working

---

### 🔌 Phase 5: API Routes & Data Management
**Timeline:** 2-3 ngày

#### 📚 Task 5.1: Theory API Routes
- [ ] `app/api/theory/route.ts` - Get all grammar forms
- [ ] `app/api/theory/[form]/route.ts` - Get specific grammar
- [ ] Setup middleware cho error handling, logging
- [ ] Response caching và optimization
- [ ] Create shared API utilities (error handling, loading states)

#### 🎯 Task 5.2: Exercise API Routes
- [ ] `app/api/exercises/[form]/route.ts` - Get exercises by form
- [ ] `app/api/exercises/random/route.ts` - Random exercise selection
- [ ] Exercise filtering và pagination

#### 📊 Task 5.3: Progress API Routes
- [ ] `app/api/progress/route.ts` - CRUD user progress
- [ ] `app/api/progress/stats/route.ts` - Statistics calculation
- [ ] Progress analytics

#### 💾 Task 5.4: Data Management API
- [ ] `app/api/export/route.ts` - Export user data
- [ ] `app/api/import/route.ts` - Import user data
- [ ] `app/api/reset/route.ts` - Clear user data
- [ ] Data validation và sanitization

#### 📖 Task 5.5: API Documentation
- [ ] Complete `API.md` documentation
- [ ] API response examples
- [ ] Error handling documentation

#### ✅ Deliverables Phase 5:
- ✅ Complete API routes
- ✅ Data import/export working
- ✅ API documentation complete
- ✅ Error handling implemented

---

### 🎨 Phase 6: Three.js Mindmap Integration
**Timeline:** 3-4 ngày

#### 🌐 Task 6.1: Three.js Setup
- [ ] Install Three.js và React Three Fiber
- [ ] Create 3D component wrapper
- [ ] Setup responsive 3D canvas
- [ ] Implement basic scene setup

#### 🗺️ Task 6.2: Mindmap Design

**Te-form Mindmap**
- [ ] Verb conjugation tree
- [ ] Interactive nodes
- [ ] Connection animations

**Ta-form Mindmap**
- [ ] Past tense structure
- [ ] Visual connections

**Nai-form Mindmap**
- [ ] Negative form patterns
- [ ] Rule visualization

**Ru-form Mindmap**
- [ ] Dictionary form connections
- [ ] Base form relationships

#### 🎮 Task 6.3: Interactive Features
- [ ] Click navigation
- [ ] Hover effects
- [ ] Zoom và pan controls
- [ ] Mobile touch support

#### 🔗 Task 6.4: Integration với Theory Pages
- [ ] Embed mindmaps trong theory pages
- [ ] Sync mindmap với theory content
- [ ] Performance optimization

#### ✅ Deliverables Phase 6:
- ✅ Interactive 3D mindmaps
- ✅ Mobile-friendly 3D experience
- ✅ Integrated với theory system
### ✨ Phase 7: Advanced Features & Polish
**Timeline:** 3-4 ngày

#### 🎯 Task 7.1: Enhanced Quiz Features
- [ ] Multiple question types
- [ ] Adaptive difficulty system
- [ ] Streak tracking với rewards
- [ ] Audio support preparation
- [ ] Hint system

#### 🎬 Task 7.2: Animations & Transitions
- [ ] Page transitions với Framer Motion
- [ ] Component animations
- [ ] Loading animations
- [ ] Success/error feedback animations
- [ ] Smooth scroll behaviors

#### ⚡ Task 7.3: Performance Optimization
- [ ] Code splitting optimization
- [ ] Image optimization
- [ ] Bundle analysis
- [ ] Lazy loading implementation
- [ ] Memory leak prevention

#### 📊 Task 7.4: Advanced Data Features
- [ ] Backup strategies
- [ ] Data validation
- [ ] Conflict resolution
- [ ] Data migration tools
- [ ] Analytics tracking

#### ♿ Task 7.5: Accessibility & UX
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Focus management
- [ ] Error boundaries

#### ✅ Deliverables Phase 7:
- ✅ Production-ready features
- ✅ Optimized performance
- ✅ Accessible interface
- ✅ Smooth animations

---

### 🚀 Phase 8: Testing & Deployment
**Timeline:** 2-3 ngày

#### 🧪 Task 8.1: Comprehensive Testing
- [ ] Unit tests cho all components
- [ ] Integration tests cho API routes
- [ ] E2E tests cho user flows
- [ ] Performance testing
- [ ] Cross-browser testing

#### 📚 Task 8.2: Documentation Completion
- [ ] Finalize `DEVELOPMENT.md`
- [ ] Complete `API.md`
- [ ] Update `AIPromptContext.md`
- [ ] Create deployment guide
- [ ] User manual

#### 🌐 Task 8.3: Deployment Setup
- [ ] Vercel deployment configuration
- [ ] Environment variables setup
- [ ] Performance monitoring
- [ ] Error tracking setup
- [ ] Analytics integration

#### 🎨 Task 8.4: Final Polish
- [ ] Bug fixes
- [ ] Performance tuning
- [ ] UI/UX refinements
- [ ] Final testing round

#### ✅ Deliverables Phase 8:
- ✅ Fully tested application
- ✅ Deployed to production
- ✅ Complete documentation
- ✅ Monitoring setup

---

## 🎯 Tổng kết

**📅 Tổng thời gian:** 18-25 ngày

**🚀 Kết quả cuối cùng:**
- ✅ Modern Next.js 14 application
- ✅ TypeScript type safety
- ✅ Interactive 3D mindmaps
- ✅ Professional development workflow
- ✅ Production-ready deployment

**💡 Lưu ý:**
- Mỗi phase có thể điều chỉnh timeline tùy theo complexity
- Có thể parallel một số tasks để tối ưu thời gian
- Testing và documentation chạy song song với development

---

*Bạn có muốn điều chỉnh task nào không? Hoặc có task nào cần thêm/bớt/thay đổi priority?* 🤔