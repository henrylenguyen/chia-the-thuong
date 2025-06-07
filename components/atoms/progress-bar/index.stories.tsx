/**
 * Progress Bar Component Stories
 * 
 * Storybook stories cho Progress Bar component
 * Hiển thị tất cả variants và states của progress bar
 * 
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './progress-bar';

/**
 * Meta configuration cho Progress Bar stories
 */
const meta: Meta<typeof ProgressBar> = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Progress Bar Component

Thanh tiến độ với gradient theme và animation cho Japanese Learning App.

## Tính năng chính:
- **Gradient Fills**: Sử dụng gradient theme chính của app
- **Multiple Variants**: Primary, Success, Warning, Error, Info, Neutral
- **Animation Support**: Smooth transitions và striped patterns
- **Completion Indicators**: Visual feedback khi hoàn thành
- **Accessibility**: ARIA attributes cho screen readers
- **Responsive**: Tự động adapt với container size

## Khi nào sử dụng:
- Quiz progress tracking
- Learning progress display
- Form completion status
- Loading indicators
- Statistics visualization

## Design System:
- Consistent với app gradient theme
- Semantic colors cho different contexts
- Mobile-friendly sizing
        `
      }
    }
  },
  argTypes: {
    value: {
      description: 'Giá trị hiện tại',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' }
      }
    },
    max: {
      description: 'Giá trị tối đa',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '100' }
      }
    },
    variant: {
      options: ['primary', 'success', 'warning', 'error', 'info', 'neutral'],
      description: 'Kiểu hiển thị progress bar',
      table: {
        type: { summary: 'ProgressBarVariant' },
        defaultValue: { summary: 'primary' }
      }
    },
    size: {
      options: ['small', 'medium', 'large', 'extra-large'],
      description: 'Kích thước progress bar',
      table: {
        type: { summary: 'ProgressBarSize' },
        defaultValue: { summary: 'medium' }
      }
    },
    showLabel: {
      description: 'Hiển thị label không',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    showPercentage: {
      description: 'Hiển thị phần trăm không',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    animated: {
      description: 'Có animation không',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    striped: {
      description: 'Có pattern striped không',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default progress bar
 */
export const Default: Story = {
  args: {
    value: 45,
    max: 100,
    variant: 'primary',
    label: 'Tiến độ học tập'
  }
};

/**
 * Tất cả variants
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Primary (Gradient chính)</h3>
        <ProgressBar value={75} variant="primary" label="Te Form Progress" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Success (Hoàn thành)</h3>
        <ProgressBar value={100} variant="success" label="Ta Form Completed" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Warning (Cần cải thiện)</h3>
        <ProgressBar value={35} variant="warning" label="Nai Form Progress" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Error (Cần luyện tập)</h3>
        <ProgressBar value={15} variant="error" label="Ru Form Progress" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Info (Thông tin)</h3>
        <ProgressBar value={60} variant="info" label="Overall Progress" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Neutral (Trung tính)</h3>
        <ProgressBar value={50} variant="neutral" label="Practice Sessions" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tất cả variants của progress bar với use cases trong app học tiếng Nhật.'
      }
    }
  }
};

/**
 * Tất cả kích thước
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Small</h3>
        <ProgressBar value={45} size="small" label="Small progress" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Medium (Default)</h3>
        <ProgressBar value={65} size="medium" label="Medium progress" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Large</h3>
        <ProgressBar value={80} size="large" label="Large progress" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Extra Large</h3>
        <ProgressBar value={90} size="extra-large" label="Extra large progress" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Các kích thước khác nhau của progress bar từ small đến extra-large.'
      }
    }
  }
};

/**
 * Quiz progress example
 */
export const QuizProgress: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Quiz Progress</h3>
        <ProgressBar 
          value={15} 
          max={50} 
          variant="primary" 
          label="Te Form Quiz"
          animated={true}
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Completed Quiz</h3>
        <ProgressBar 
          value={50} 
          max={50} 
          variant="success" 
          label="Ta Form Quiz"
          animated={true}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Ví dụ sử dụng trong quiz interface để hiển thị tiến độ làm bài.'
      }
    }
  }
};

/**
 * Learning statistics
 */
export const LearningStats: Story = {
  render: () => (
    <div className="space-y-4 w-96 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-bold mb-4">📊 Thống kê học tập</h3>
      
      <div className="space-y-3">
        <ProgressBar 
          value={1200} 
          max={1200} 
          variant="success" 
          label="Te Form (て形)"
          showPercentage={true}
        />
        
        <ProgressBar 
          value={850} 
          max={1000} 
          variant="primary" 
          label="Ta Form (た形)"
          showPercentage={true}
        />
        
        <ProgressBar 
          value={420} 
          max={980} 
          variant="warning" 
          label="Nai Form (ない形)"
          showPercentage={true}
        />
        
        <ProgressBar 
          value={180} 
          max={1020} 
          variant="error" 
          label="Ru Form (る形)"
          showPercentage={true}
        />
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <ProgressBar 
          value={2650} 
          max={4200} 
          variant="info" 
          label="Tổng tiến độ"
          size="large"
          showPercentage={true}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Ví dụ dashboard thống kê học tập với multiple progress bars cho 4 grammar forms.'
      }
    }
  }
};

/**
 * Animated và striped
 */
export const AnimatedStriped: Story = {
  args: {
    value: 70,
    variant: 'primary',
    animated: true,
    striped: true,
    label: 'Loading progress...'
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar với animation và striped pattern cho loading states.'
      }
    }
  }
};
