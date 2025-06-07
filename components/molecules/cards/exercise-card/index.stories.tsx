/**
 * Exercise Card Component Stories - Card Design Demo Implementation
 *
 * Storybook stories cho Exercise Card component theo card-design-demo.html
 * Showcase tất cả variants và states với modern design system
 * Sử dụng Tailwind CSS và atomic design pattern
 *
 * @author Japanese Learning App Team
 * @version 3.0.0 - Card Design Demo Implementation
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ExerciseCard } from './';
import { Exercise, ExerciseProgress } from './types';

// Mock data
const mockExercise: Exercise = {
  id: 'te-form-basic',
  title: 'Te Form Practice',
  description: 'Luyện tập động từ dạng て cơ bản',
  form: 'te',
  questionCount: 120,
  estimatedTime: 15,
  difficulty: 3,
  patterns: ['te_kudasai', 'te_imasu', 'te_mo_ii'],
  metadata: {
    category: 'grammar',
    tags: ['beginner', 'verb-forms'],
    prerequisites: ['hiragana', 'basic-verbs']
  }
};

const mockProgressNotStarted: ExerciseProgress = {
  status: 'not-started',
  questionsAnswered: 0,
  correctAnswers: 0,
  completionPercentage: 0,
  accuracy: 0,
  timeSpent: 0,
  attemptCount: 0,
  bestScore: 0
};

const mockProgressInProgress: ExerciseProgress = {
  status: 'in-progress',
  questionsAnswered: 45,
  correctAnswers: 38,
  completionPercentage: 37.5,
  accuracy: 84,
  timeSpent: 8,
  attemptCount: 1,
  bestScore: 0,
  lastAttempted: new Date('2024-12-19T10:30:00')
};

const mockProgressCompleted: ExerciseProgress = {
  status: 'completed',
  questionsAnswered: 120,
  correctAnswers: 102,
  completionPercentage: 100,
  accuracy: 85,
  timeSpent: 18,
  attemptCount: 2,
  bestScore: 87,
  lastAttempted: new Date('2024-12-19T11:45:00')
};

const mockProgressMastered: ExerciseProgress = {
  status: 'mastered',
  questionsAnswered: 120,
  correctAnswers: 115,
  completionPercentage: 100,
  accuracy: 96,
  timeSpent: 14,
  attemptCount: 3,
  bestScore: 96,
  lastAttempted: new Date('2024-12-19T14:20:00')
};

const meta: Meta<typeof ExerciseCard> = {
  title: 'Molecules/Cards/ExerciseCard',
  component: ExerciseCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        className="p-8 flex justify-center"
        style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh'
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'demo-gradient',
      values: [
        {
          name: 'demo-gradient',
          value: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        },
      ],
    },
    docs: {
      description: {
        component: `
# 🎌 Exercise Card - Card Design Demo Implementation

Exercise Card component theo thiết kế từ **card-design-demo.html** với modern blue-purple gradient theme.

## 🎨 Design Features
- **Width**: \`min-w-[350px] max-w-md\` - theo demo grid \`minmax(350px, 1fr)\`
- **Border Radius**: \`rounded-2xl\` (16px) - modern rounded corners
- **Padding**: \`p-6\` (1.5rem) - consistent spacing
- **Gradient Top Border**: Blue-purple gradient (\`#667eea → #764ba2\`)
- **Shadows**: Enhanced depth với \`shadow-lg\` và hover \`shadow-xl\`
- **Hover Animation**: \`-translate-y-1\` - smooth lift effect

## 📊 Progress States
- **Not Started**: Gray badge "Chưa bắt đầu" với button "Bắt đầu"
- **In Progress**: Blue badge "Đang làm" với progress bar và button "Tiếp tục"
- **Completed**: Green badge "Đã hoàn thành" với success styling và button "Ôn tập"
- **Mastered**: Emerald badge "Đã thành thạo" với enhanced styling

## 🔒 Special States
- **Loading**: Skeleton animation với shimmer effect
- **Disabled**: Opacity 60%, grayscale filter, locked icon
- **Success**: Green gradient background cho completed state

## 🎯 Atomic Design Pattern
- **Hook**: \`useExerciseCard\` - business logic và state management
- **Component**: Pure UI component với props interface
- **Types**: TypeScript definitions cho type safety

## 📱 Responsive Design
- **Mobile**: Single column layout
- **Tablet**: 2-3 columns tùy screen width
- **Desktop**: 3+ columns với auto-fit grid
- **Grid**: \`repeat(auto-fit, minmax(350px, 1fr))\`

## ♿ Accessibility
- Keyboard navigation (Enter, Space)
- ARIA labels và roles
- Screen reader support
- Focus management
- Color contrast compliance

## 🚀 Usage
\`\`\`tsx
import { ExerciseCard } from 'molecules';

<ExerciseCard
  exercise={exercise}
  progress={progress}
  disabled={false}
  loading={false}
  onStartExercise={(exercise) => console.log('Start:', exercise)}
  onContinueExercise={(exercise) => console.log('Continue:', exercise)}
  onReviewExercise={(exercise) => console.log('Review:', exercise)}
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    exercise: {
      description: 'Thông tin exercise',
      control: { type: 'object' }
    },
    progress: {
      description: 'Thông tin tiến độ exercise',
      control: { type: 'object' }
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Kiểu hiển thị card'
    },
    disabled: {
      control: 'boolean',
      description: 'Card bị disabled (locked)'
    },
    loading: {
      control: 'boolean',
      description: 'Card đang loading'
    },
    showProgress: {
      control: 'boolean',
      description: 'Hiển thị progress bar'
    },
    showDifficulty: {
      control: 'boolean',
      description: 'Hiển thị difficulty stars'
    },
    showQuestionCount: {
      control: 'boolean',
      description: 'Hiển thị số câu hỏi'
    },
    showEstimatedTime: {
      control: 'boolean',
      description: 'Hiển thị thời gian ước tính'
    },
    onClick: { action: 'clicked' },
    onStartExercise: { action: 'start exercise' },
    onContinueExercise: { action: 'continue exercise' },
    onReviewExercise: { action: 'review exercise' }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    exercise: mockExercise,
    progress: mockProgressNotStarted
  }
};

// Essential States
export const InProgress: Story = {
  args: {
    exercise: mockExercise,
    progress: mockProgressInProgress
  },
  parameters: {
    docs: {
      description: {
        story: `
**In Progress State** - Exercise đang được thực hiện

- Blue badge "Đang làm"
- Progress bar hiển thị 65% tiến độ
- Button "Tiếp tục" để continue exercise
- Width: \`min-w-[350px] max-w-md\` theo demo design
        `
      }
    }
  }
};

export const Completed: Story = {
  args: {
    exercise: mockExercise,
    progress: mockProgressCompleted
  },
  parameters: {
    docs: {
      description: {
        story: `
**Completed State** - Exercise đã hoàn thành

- Green badge "Đã hoàn thành" với màu \`bg-green-50 text-green-800\`
- Progress bar 100% với green gradient
- Success styling: green gradient background và left border
- Button "Ôn tập" để review exercise
- Theo đúng màu sắc trong card-design-demo.html
        `
      }
    }
  }
};

export const Loading: Story = {
  args: {
    exercise: mockExercise,
    loading: true
  },
  parameters: {
    docs: {
      description: {
        story: `
**Loading State** - Card đang tải dữ liệu

- Skeleton animation với \`animate-pulse\`
- Placeholder elements cho title, badge, stats
- Gray skeleton blocks thay thế content
- Maintains card structure và width
        `
      }
    }
  }
};

export const Disabled: Story = {
  args: {
    exercise: {
      ...mockExercise,
      metadata: {
        ...mockExercise.metadata,
        prerequisites: ['N4']
      }
    },
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: `
**Disabled State** - Card bị khóa do prerequisites

- Opacity 60% và grayscale filter
- Cursor \`not-allowed\`
- Button hiển thị "Yêu cầu N4" requirement
- Không có hover effects
- Maintains accessibility với proper ARIA states
        `
      }
    }
  }
};

// Grid Layout Demo - Multiple cards theo card-design-demo.html
export const GridDemo: Story = {
  render: () => (
    <div
      className="min-h-screen p-8"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h1
          className="text-center text-4xl font-bold mb-12"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          🎌 Exercise Cards - Design Demo
        </h1>

        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}
        >
          {/* Not Started */}
          <ExerciseCard
            exercise={mockExercise}
            progress={mockProgressNotStarted}
          />

          {/* In Progress */}
          <ExerciseCard
            exercise={{
              ...mockExercise,
              id: 'ta-form-basic',
              title: 'Ta Form Practice',
              description: 'Luyện tập động từ dạng た quá khứ',
              form: 'ta',
              questionCount: 95,
              estimatedTime: 12,
              difficulty: 4
            }}
            progress={mockProgressInProgress}
          />

          {/* Completed */}
          <ExerciseCard
            exercise={{
              ...mockExercise,
              id: 'nai-form-basic',
              title: 'Nai Form Practice',
              description: 'Luyện tập động từ dạng ない phủ định',
              form: 'nai',
              questionCount: 80,
              estimatedTime: 10,
              difficulty: 2
            }}
            progress={mockProgressCompleted}
          />

          {/* Disabled */}
          <ExerciseCard
            exercise={{
              ...mockExercise,
              id: 'ru-form-advanced',
              title: 'Ru Form Practice',
              description: 'Luyện tập động từ dạng る cơ bản (Chưa mở khóa)',
              form: 'ru',
              questionCount: 150,
              estimatedTime: 20,
              difficulty: 5,
              metadata: {
                ...mockExercise.metadata,
                prerequisites: ['cấp độ 3']
              }
            }}
            disabled={true}
          />

          {/* Loading */}
          <ExerciseCard
            exercise={mockExercise}
            loading={true}
          />

          {/* Mastered */}
          <ExerciseCard
            exercise={{
              ...mockExercise,
              id: 'te-form-advanced',
              title: 'Te Form Advanced',
              description: 'Luyện tập động từ dạng て nâng cao',
              form: 'te',
              difficulty: 4
            }}
            progress={mockProgressMastered}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    docs: {
      description: {
        story: `
# 🎌 Grid Layout Demo - Card Design Demo Implementation

Responsive grid layout theo **card-design-demo.html** với tất cả states và variants.

## 🎨 CSS Grid Configuration
\`\`\`css
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem; /* 32px */
}
\`\`\`

## 📊 Card States Showcase
1. **Not Started** - Te Form Practice (3/5 difficulty)
2. **In Progress** - Ta Form Practice (4/5 difficulty, 65% progress)
3. **Completed** - Nai Form Practice (2/5 difficulty, 100% complete)
4. **Disabled** - Ru Form Practice (5/5 difficulty, locked)
5. **Loading** - Skeleton animation với shimmer effect
6. **Mastered** - Te Form Advanced (4/5 difficulty, 96% accuracy)

## 📱 Responsive Behavior
- **Mobile (< 640px)**: 1 column layout
- **Tablet (640px - 1024px)**: 2-3 columns tùy screen width
- **Desktop (> 1024px)**: 3+ columns với auto-fit
- **Max Container**: 1200px với center alignment

## 🎯 Design Features
- **Background**: Demo gradient \`#f5f7fa → #c3cfe2\`
- **Card Width**: \`min-w-[350px] max-w-md\`
- **Spacing**: 32px gap giữa cards
- **Hover Effects**: Smooth lift animation
- **Typography**: Gradient title với Japanese theme
        `
      }
    }
  }
};
