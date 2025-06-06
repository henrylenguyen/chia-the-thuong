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
- ✅ Context cho component trees phức tạp
- ✅ `index.test.tsx` - Import từ Storybook (không tạo mới)

#### 📊 **Data Management**
```
stores/
  ├── app/           # Global app state
  ├── quiz/          # Quiz-specific state
  └── progress/      # Progress tracking
```

#### 📝 **TypeScript Organization**
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
- [ ] Create Next.js 14 project với TypeScript
- [ ] Configure `next.config.js` cho app router
- [ ] Setup ESLint + Prettier configuration
- [ ] Configure `tsconfig.json` với strict mode
- [ ] Setup `.gitignore` và environment files

#### 🎨 Task 1.2: Setup Styling & UI Foundation
- [ ] Install và configure Tailwind CSS
- [ ] Setup SCSS support
- [ ] Install Radix UI core packages
- [ ] Configure dark mode với next-themes
- [ ] Create global styles và CSS variables

#### 📁 Task 1.3: Create Atomic Design Structure
- [ ] Setup folder structure: `atoms/`, `molecules/`, `organisms/`
- [ ] Create component templates theo quy tắc:
  - `component.tsx` (UI thuần túy)
  - `useComponent.tsx` (logic hooks)
  - `types.ts` (local TypeScript interfaces)
  - `index.stories.tsx` (Storybook)
  - `index.test.tsx` (test từ Storybook)
  - `index.ts` (barrel exports)
  - `styles.scss` (optional)
- [ ] Setup `features/` folder cho Client components
- [ ] Create `stores/` structure cho Zustand

#### 🛠️ Task 1.4: Setup Development Tools
- [ ] Install và configure Storybook
- [ ] Setup Jest + React Testing Library
- [ ] Configure Framer Motion
- [ ] Setup Zustand store structure
- [ ] Create development scripts

#### 📖 Task 1.5: Create Documentation Templates
- [ ] Create `DEVELOPMENT.md` với phase tracking
- [ ] Create `API.md` template
- [ ] Create `AIPromptContext.md` template
- [ ] Setup component documentation standards

#### ✅ Deliverables Phase 1:
- ✅ Working Next.js 14 project
- ✅ Complete folder structure
- ✅ Development environment ready
- ✅ Documentation framework
### 💾 Phase 2: Core Infrastructure & Data Layer
**Timeline:** 2-3 ngày

#### 🗄️ Task 2.1: IndexedDB Setup
- [ ] Install Dexie.js
- [ ] Design database schema cho N5 grammar
- [ ] Create database models (Progress, Statistics, UserData)
- [ ] Implement CRUD operations
- [ ] Create migration utilities
- [ ] Write database hooks

#### 🏪 Task 2.2: Zustand Store Architecture
- [ ] Create store structure trong `stores/`:
  - `stores/app/` - Global app state (theme, navigation)
  - `stores/progress/` - User progress tracking
  - `stores/quiz/` - Quiz state management
  - `stores/user/` - User preferences & settings
- [ ] Implement store persistence với IndexedDB
- [ ] Create store hooks và selectors
- [ ] Setup store devtools cho development

#### 📝 Task 2.3: TypeScript Definitions
- [ ] Define Grammar types (Te, Ta, Nai, Ru)
- [ ] Define Exercise types
- [ ] Define Progress tracking types
- [ ] Define API response types
- [ ] Create utility types

#### 📋 Task 2.4: JSON Data Structure Design
- [ ] Migrate existing JSON data
- [ ] Optimize data structure
- [ ] Add validation schemas

#### 🔧 Task 2.5: Utility Functions
- [ ] Create validation helpers
- [ ] Create formatting utilities
- [ ] Create Japanese text processing functions
- [ ] Create export/import utilities

#### ✅ Deliverables Phase 2:
- ✅ IndexedDB working với Dexie
- ✅ Zustand stores configured
- ✅ TypeScript definitions complete
- ✅ JSON data structure ready
### 🧩 Phase 3: Atomic Components Development
**Timeline:** 3-4 ngày

#### ⚛️ Task 3.1: Atoms Development

**Button Component**
- [ ] `button.tsx` - Multiple variants
- [ ] `useButton.tsx` - Click handling, loading states
- [ ] `button.stories.tsx` - All variants showcase
- [ ] `button.test.tsx` - Unit tests

**Input Components**
- [ ] `text-input/` - Basic text input
- [ ] `japanese-input/` - IME support
- [ ] `search-input/` - Search functionality

**Typography Components**
- [ ] `heading/` - H1-H6 variants
- [ ] `text/` - Body text variants
- [ ] `japanese-text/` - Japanese-specific styling

**Icon Components**
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

**Quiz Interface**
- [ ] Question display
- [ ] Answer input
- [ ] Feedback system
- [ ] Progress tracking

**Theory Display**
- [ ] Grammar explanation
- [ ] Examples showcase
- [ ] Interactive elements

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