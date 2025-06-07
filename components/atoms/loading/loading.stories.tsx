/**
 * Loading Component Stories
 * Storybook stories cho Loading component với design đẹp từ index(1).html
 *
 * @author Japanese Learning App Team
 * @version 2.0.0
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Loading } from './loading';
import { LOADING_TEXTS } from './types';

const meta: Meta<typeof Loading> = {
  title: 'Atoms/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Loading Component

Component hiển thị loading screen đẹp với design từ index(1).html.

## Features
- 🎯 **Beautiful Design**: Torii bouncing + dual spinner + Japanese characters
- 🌀 **Dual Spinner**: Blue và purple spinner quay ngược chiều
- 📝 **Loading Dots**: Text với animation dots (...)
- 📊 **Progress Bar**: Gradient progress bar với smooth animation
- 🎌 **Japanese Characters**: Bouncing animation cho "日本語学習"
- 🌙 **Dark Mode**: Hỗ trợ dark/light theme
- ♿ **Accessibility**: ARIA labels và live regions

## Usage
\`\`\`tsx
// Full screen loading
<Loading />

// With progress
<Loading progress={75} />

// Custom text
<Loading text="Đang tải bài tập" />

// Inline loading
<Loading variant="inline" />
\`\`\`
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['full-screen', 'inline', 'minimal'],
      description: 'Kiểu hiển thị loading'
    },
    text: {
      control: 'text',
      description: 'Text hiển thị bên dưới loading'
    },
    showText: {
      control: 'boolean',
      description: 'Có hiển thị text không'
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress percentage (0-100)'
    },
    showProgress: {
      control: 'boolean',
      description: 'Có hiển thị progress bar không'
    },
    isFullScreen: {
      control: 'boolean',
      description: 'Có hiển thị full screen overlay không'
    },
    className: {
      control: 'text',
      description: 'CSS class tùy chỉnh'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default full-screen loading
 */
export const Default: Story = {
  args: {
    variant: 'inline',
    text: LOADING_TEXTS.default,
    showText: true,
    showProgress: true
  }
};

/**
 * Loading với progress
 */
export const WithProgress: Story = {
  args: {
    variant: 'inline',
    text: 'Đang tải dữ liệu',
    showText: true,
    showProgress: true,
    progress: 65
  }
};

/**
 * Loading cho theory
 */
export const TheoryLoading: Story = {
  args: {
    variant: 'inline',
    text: LOADING_TEXTS.theory,
    showText: true,
    showProgress: true,
    progress: 30
  }
};

/**
 * Loading cho exercise
 */
export const ExerciseLoading: Story = {
  args: {
    variant: 'inline',
    text: LOADING_TEXTS.exercise,
    showText: true,
    showProgress: true,
    progress: 80
  }
};

/**
 * Full Screen Loading (for app initialization)
 */
export const FullScreen: Story = {
  args: {
    variant: 'full-screen',
    text: 'Đang khởi tạo ứng dụng...',
    showText: true,
    showProgress: true,
    progress: 45
  },
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Inline loading variant
 */
export const InlineLoading: Story = {
  args: {
    variant: 'inline',
    text: 'Đang tải nội dung...',
    showText: true,
    showProgress: true,
    progress: 50
  },
  parameters: {
    layout: 'centered'
  }
};



/**
 * Tất cả variants
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Full Screen</h3>
        <div className="relative h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          <Loading variant="full-screen" text="Full screen loading" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Inline</h3>
        <Loading variant="inline" text="Inline loading" />
      </div>

    </div>
  ),
  parameters: {
    layout: 'centered'
  }
};

/**
 * Without text
 */
export const WithoutText: Story = {
  args: {
    variant: 'inline',
    showText: false,
    showProgress: true,
    progress: 75
  },
  parameters: {
    layout: 'centered'
  }
};

/**
 * Dark theme showcase
 */
export const DarkTheme: Story = {
  args: {
    variant: 'inline',
    text: 'Đang tải trong dark mode...',
    showText: true,
    showProgress: true,
    progress: 60
  },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' }
  }
};
