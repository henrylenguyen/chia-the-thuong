# 🎌 Japanese Learning App - Next.js 14

> **Modern Japanese N5 Grammar Learning Application**

Ứng dụng học tiếng Nhật N5 được xây dựng với Next.js 14, TypeScript, và Atomic Design pattern.

## 🎯 Tính năng chính

- ✅ **4 Grammar Forms**: Te (て), Ta (た), Nai (ない), Ru (る) forms
- ✅ **4200+ Questions**: Comprehensive question database
- ✅ **Interactive Quiz**: Real-time feedback và progress tracking
- ✅ **Theory Pages**: Detailed grammar explanations
- ✅ **Statistics**: Progress analytics và performance tracking
- ✅ **Review System**: Spaced repetition cho wrong answers
- ✅ **IndexedDB Storage**: Large dataset support
- ✅ **Mobile Optimized**: Responsive design cho mobile learning

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework với App Router |
| **TypeScript** | Type safety và developer experience |
| **Tailwind CSS** | Utility-first CSS framework |
| **Radix UI** | Accessible component primitives |
| **Zustand** | State management |
| **IndexedDB (Dexie)** | Client-side database |
| **Framer Motion** | Animations và transitions |
| **Storybook** | Component development và documentation |
| **Jest + RTL** | Testing framework |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm hoặc yarn

### Installation
```bash
# Clone repository
git clone <repository-url>
cd japanese-app

# Install dependencies
npm install

# Run development server
npm run dev
```

### Available Scripts
```bash
# Development
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run storybook    # Start Storybook (http://localhost:6006)

# Testing
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode

# Build
npm run build        # Build for production
npm run start        # Start production server
```

## 📁 Project Structure

```
japanese-app/
├── app/                    # Next.js App Router
│   ├── (pages)/           # Page routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Atomic Design components
│   ├── atoms/            # Basic components
│   ├── molecules/        # Composite components
│   └── organisms/        # Complex components
├── features/             # Client-side features
├── stores/               # Zustand stores
├── types/                # TypeScript definitions
├── utils/                # Utility functions
└── lib/                  # External library configs
```

## 📚 Documentation

- [`chuyen-doi.md`](./chuyen-doi.md) - Migration plan và progress tracking
- [`STORYBOOK_SETUP.md`](./STORYBOOK_SETUP.md) - Storybook setup guide
- [`AI-PROMPT.md`](./AI-PROMPT.md) - AI context và prompts
- [`QUICK-PROMPT.md`](./QUICK-PROMPT.md) - Quick reference

## 🎨 Component Development

### Storybook
```bash
npm run storybook
```
- Browse components: http://localhost:6006
- Interactive documentation với autodocs
- Test component variants và states

### Component Structure
```
components/atoms/button/
├── button.tsx           # UI component
├── useButton.tsx        # Logic hooks
├── types.ts            # Local types
├── index.stories.tsx   # Storybook stories
├── index.test.tsx      # Tests
└── index.ts            # Exports
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test button.test.tsx
```

## 📊 Current Progress

### ✅ Phase 1: Project Setup & Architecture (COMPLETED)
- ✅ Next.js 14 project với TypeScript
- ✅ Atomic Design structure
- ✅ Storybook 8.6 với autodocs
- ✅ Development tools setup

### 🚧 Phase 2: Core Infrastructure & Data Layer (IN PROGRESS)
- [ ] IndexedDB setup với Dexie
- [ ] Zustand store architecture
- [ ] TypeScript definitions
- [ ] JSON data structure

### 📋 Next Steps
1. **Complete data layer** - IndexedDB + Zustand stores
2. **Molecule components** - Cards, forms, navigation
3. **Page implementation** - Theory, Practice, Review, Statistics
4. **API routes** - Data management endpoints

## 🤝 Contributing

1. Follow Atomic Design principles
2. Write comprehensive tests
3. Document components trong Storybook
4. Use TypeScript với strict mode
5. Follow naming conventions trong project

## 📄 License

MIT License - see LICENSE file for details.

---

**🎌 Happy Learning Japanese! がんばって！**
