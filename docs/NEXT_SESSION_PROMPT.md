# 🎯 AI Session Prompt - Japanese Learning App (Next Session)

## 📋 **Current Project Status**

### ✅ **COMPLETED (Phase 1 + Theory Card)**
- ✅ **Next.js 14 Project Setup** - TypeScript, App Router, ESLint
- ✅ **4 Atomic Components** - Button, Input, Logo, Progress Bar (100% complete)
- ✅ **Theory Card Component** - First molecule component (JUST COMPLETED)
- ✅ **Storybook 8.6** - Working với autodocs, no conflicts
- ✅ **React Icons Integration** - FaToriiGate, IoIcons replacing SVG
- ✅ **Responsive Design** - useDeviceDetection hook, adaptive sizing
- ✅ **Gradient Effects** - CSS gradient classes (.gradient-text, .gradient-bg)
- ✅ **TypeScript + ESLint** - Strict compliance, lint checking at every step

### 🎯 **IMMEDIATE NEXT TASKS (Priority Order)**

#### **1. Exercise Card Component** (Next Priority)
```
components/molecules/cards/exercise-card/
├── exercise-card.tsx          # Exercise selection interface
├── useExerciseCard.tsx        # Selection logic, progress display  
├── types.ts                   # Local TypeScript definitions
├── index.stories.tsx          # Storybook stories
├── index.test.tsx             # Unit tests
└── index.ts                   # Exports
```

**Features Required:**
- ✅ **Question count display** - Show total questions available
- ✅ **Completion status** - Progress indicator (not started/in progress/completed)
- ✅ **Difficulty level** - Visual difficulty indicator (1-5 stars)
- ✅ **Exercise type** - Te/Ta/Nai/Ru form indicator
- ✅ **Responsive design** - Same responsive width system as Theory Card
- ✅ **React Icons** - Use react-icons (not SVG)
- ✅ **Gradient effects** - Apply gradient text/background classes
- ✅ **Click handlers** - onStartExercise, onContinueExercise callbacks

#### **2. Quiz Card Component** (After Exercise Card)
- Quiz question presentation interface
- Answer input integration
- Feedback states (correct/incorrect)
- Progress tracking within quiz

#### **3. Stats Card Component** (After Quiz Card)
- Statistics visualization
- Progress charts
- Accuracy metrics display
- Time tracking

## 🛠️ **Technical Requirements**

### **STRICT COMPLIANCE RULES** ⚠️
1. **TypeScript Check** - Run `npx tsc --noEmit --skipLibCheck` after each change
2. **ESLint Check** - Run `npm run lint` after each change  
3. **React Icons Only** - Use react-icons library, NO manual SVG
4. **Responsive Width** - Use useResponsiveCardSize hook like Theory Card
5. **Gradient Classes** - Apply .gradient-text, .gradient-bg, .shimmer effects
6. **Vietnamese Documentation** - All JSDoc comments in Vietnamese

### **Component Architecture Pattern**
```typescript
// exercise-card.tsx - UI ONLY
export const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, progress, onStartExercise, ...props 
}) => {
  const { cardClasses, handleClick, ... } = useExerciseCard({ ... });
  return <div className={cardClasses}>...</div>;
};

// useExerciseCard.tsx - LOGIC ONLY  
export const useExerciseCard = ({ exercise, progress, ... }) => {
  const { cardWidth } = useResponsiveCardSize();
  const handleClick = useCallback(() => { ... }, [...]);
  return { cardClasses, handleClick, ... };
};
```

### **React Icons Usage**
```typescript
// Import from react-icons
import { 
  IoPlayCircleOutline,    // Start exercise
  IoPauseCircleOutline,   // Pause exercise  
  IoCheckmarkCircle,      // Completed
  IoStarOutline,          // Difficulty rating
  IoTimeOutline           // Time estimate
} from 'react-icons/io5';

// Usage in component
<IoPlayCircleOutline className="w-5 h-5 text-blue-500" />
```

### **Responsive Width Integration**
```typescript
// Use existing hook from Theory Card
import { useResponsiveCardSize } from '../../../../hooks/useDeviceDetection';

const { cardWidth } = useResponsiveCardSize();
// Returns: 'w-full max-w-lg' etc. based on screen size
```

## 📊 **Data Structure for Exercise Card**

### **Exercise Interface**
```typescript
interface Exercise {
  id: string;
  title: string;                    // "Te Form Practice"
  description: string;              // "Luyện tập động từ dạng て"
  form: 'te' | 'ta' | 'nai' | 'ru'; // Grammar form type
  questionCount: number;            // Total questions available
  estimatedTime: number;            // Minutes to complete
  difficulty: 1 | 2 | 3 | 4 | 5;   // Difficulty level
  category: string;                 // "Grammar Practice"
}

interface ExerciseProgress {
  exerciseId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'mastered';
  questionsAnswered: number;
  correctAnswers: number;
  lastAttempt: Date;
  completionPercentage: number;
}
```

## 🎨 **Design Specifications**

### **Exercise Card Layout**
```
┌─────────────────────────────────┐
│ [▶️] Te Form Practice    [⭐⭐⭐] │ ← Header với play icon + difficulty
├─────────────────────────────────┤
│ Luyện tập động từ dạng て        │ ← Description
│                                 │
│ 📝 120 câu • ⏱️ ~15 phút       │ ← Question count + time
│                                 │
│ ████████░░░░░░░░░░░░░░░░░░░░░░░ │ ← Progress bar (if in progress)
│ 45/120 câu (37%)                │
│                                 │
│           [Bắt đầu]             │ ← Action button
└─────────────────────────────────┘
```

### **Color Scheme**
- **Not Started**: Blue gradient (`--primary-gradient`)
- **In Progress**: Orange gradient (`--secondary-orange`)  
- **Completed**: Green gradient (`--success`)
- **Mastered**: Purple gradient (`--primary-purple`)

## 🚀 **Development Workflow**

### **Step-by-Step Process**
1. **Create component files** - exercise-card.tsx, useExerciseCard.tsx, types.ts
2. **Implement UI component** - Layout, styling, responsive design
3. **Implement logic hook** - State management, event handlers
4. **Add React Icons** - Replace any SVG with react-icons
5. **Create Storybook stories** - All states showcase
6. **Run TypeScript check** - `npx tsc --noEmit --skipLibCheck`
7. **Run ESLint check** - `npm run lint`
8. **Test in Storybook** - Verify responsive behavior
9. **Write unit tests** - Based on Storybook stories

### **Quality Checklist**
- [ ] TypeScript strict compliance (no errors)
- [ ] ESLint passing (no warnings)
- [ ] React Icons used (no manual SVG)
- [ ] Responsive width working
- [ ] Gradient effects applied
- [ ] Vietnamese JSDoc comments
- [ ] Storybook stories complete
- [ ] Unit tests written

## 📁 **Project Context**

### **Current File Structure**
```
components/
├── atoms/ (4/4 COMPLETED)
│   ├── button/ ✅
│   ├── input/ ✅  
│   ├── logo/ ✅
│   └── progress-bar/ ✅
├── molecules/
│   └── cards/
│       ├── theory-card/ ✅ COMPLETED
│       ├── exercise-card/ 🎯 NEXT TARGET
│       ├── quiz-card/ (after exercise-card)
│       └── stats-card/ (after quiz-card)
```

### **Available Hooks & Utilities**
- ✅ `useResponsiveCardSize()` - Responsive width detection
- ✅ `useDeviceDetection()` - Device type detection  
- ✅ CSS gradient classes - .gradient-text, .gradient-bg, .shimmer
- ✅ React Icons - react-icons/io5, react-icons/fa

## 🎯 **Success Criteria**

### **Exercise Card Must Have:**
1. ✅ **Responsive design** - Works on mobile, tablet, desktop
2. ✅ **React Icons integration** - No manual SVG icons
3. ✅ **Gradient effects** - Consistent with app theme
4. ✅ **TypeScript compliance** - Strict mode, no errors
5. ✅ **ESLint compliance** - No warnings
6. ✅ **Storybook stories** - All states documented
7. ✅ **Vietnamese documentation** - JSDoc comments
8. ✅ **Unit tests** - Based on Storybook stories

### **After Exercise Card Completion:**
- Move to Quiz Card component
- Then Stats Card component  
- Complete all 4 card molecules
- Move to form molecules (Quiz Form, Search Form)

---

**🎌 Ready to build Exercise Card! Focus on TypeScript + ESLint compliance at every step!**
