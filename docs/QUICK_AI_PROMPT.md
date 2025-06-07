# 🎯 Quick AI Prompt - Japanese Learning App

## 📋 **Current Status**
- ✅ **Next.js 14 + TypeScript** project setup complete
- ✅ **4 Atomic components** done (Button, Input, Logo, Progress Bar)
- ✅ **Theory Card** molecule component COMPLETED
- ✅ **Exercise Card** molecule component COMPLETED
- ✅ **Quiz Card** molecule component JUST COMPLETED
- ✅ **Storybook 8.6** working: http://localhost:6006
- ✅ **React Icons** integrated (FaToriiGate, IoIcons)
- ✅ **Responsive design** system established

## 🎯 **NEXT TASK: Stats Card Component**

### **Create:**
```
components/molecules/cards/stats-card/
├── stats-card.tsx             # UI component
├── useStatsCard.tsx           # Logic hook
├── types.ts                   # TypeScript types
├── index.stories.tsx          # Storybook stories
└── index.test.tsx             # Unit tests
```

### **Features Required:**
- ✅ Statistics visualization interface
- ✅ Progress charts (accuracy, completion rate)
- ✅ Performance metrics display
- ✅ Time tracking visualization
- ✅ Achievement badges/indicators
- ✅ Comparison charts (before/after)
- ✅ Interactive data points

### **Technical Requirements:**
- ✅ **React Icons** - Use `react-icons/io5` (IoPlayCircleOutline, IoStarOutline, etc.)
- ✅ **Responsive width** - Use `useResponsiveCardSize()` hook
- ✅ **Gradient effects** - Apply `.gradient-text`, `.gradient-bg` classes
- ✅ **TypeScript strict** - Run `npx tsc --noEmit --skipLibCheck` after changes
- ✅ **ESLint check** - Run `npm run lint` after changes
- ✅ **Vietnamese JSDoc** - All comments in Vietnamese

### **Data Structure:**
```typescript
interface UserStats {
  id: string;
  totalQuestions: number;           // 2500
  correctAnswers: number;           // 2100
  accuracy: number;                 // 84%
  totalTime: number;                // 1200 minutes
  averageTime: number;              // 0.48 minutes per question
  streak: number;                   // 15 days
  level: number;                    // 12
  experience: number;               // 8500 XP
}

interface PerformanceData {
  date: string;                     // "2024-12-19"
  accuracy: number;                 // 85%
  questionsAnswered: number;        // 50
  timeSpent: number;                // 25 minutes
  form: 'te' | 'ta' | 'nai' | 'ru';
}

interface Achievement {
  id: string;
  title: string;                    // "Te Form Master"
  description: string;              // "Complete 100 te form questions"
  icon: string;                     // "trophy"
  unlocked: boolean;                // true
  progress: number;                 // 100%
}
```

### **Component Pattern (Follow Quiz Card):**
```typescript
// stats-card.tsx - UI ONLY
export const StatsCard: React.FC<StatsCardProps> = ({
  userStats, performanceData, achievements, onViewDetails, ...props
}) => {
  const { cardClasses, chartData, ... } = useStatsCard({ ... });
  const { cardWidth } = useResponsiveCardSize();

  return (
    <div className={`${cardClasses} ${cardWidth}`}>
      {/* Header với user level + experience */}
      {/* Stats overview (accuracy, streak, time) */}
      {/* Performance charts (line/bar charts) */}
      {/* Achievement badges */}
      {/* Action buttons (View Details/Export) */}
    </div>
  );
};

// useStatsCard.tsx - LOGIC ONLY
export const useStatsCard = ({ userStats, performanceData, ... }) => {
  const chartData = useMemo(() => { ... }, [...]);
  const cardClasses = useMemo(() => { ... }, [...]);
  return { cardClasses, chartData, ... };
};
```

## ⚡ **Quality Checklist:**
1. [ ] Create component files
2. [ ] Implement UI với React Icons
3. [ ] Implement logic hook
4. [ ] Run `npx tsc --noEmit --skipLibCheck` ✅
5. [ ] Run `npm run lint` ✅
6. [ ] Create Storybook stories
7. [ ] Test responsive behavior
8. [ ] Write unit tests

## 🎨 **Design Reference:**
Copy Theory Card pattern but for exercise selection:
- Same responsive width system
- Same gradient effects
- Same React Icons approach
- Same TypeScript + ESLint compliance

---

**🎌 Build Stats Card following Quiz Card pattern! Check TypeScript + ESLint at every step!**
