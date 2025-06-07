/**
 * Button Component Stories
 *
 * Storybook stories cho Button component
 * Hiển thị tất cả variants, sizes và states của button
 *
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

/**
 * Meta configuration cho Button stories
 */
const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Button Component

Button component cơ bản với nhiều variants và states khác nhau.

## Tính năng chính:
- **Multiple Variants**: Primary (gradient), Secondary, Success, Error, Warning, Info, Ghost, Link
- **Multiple Sizes**: Small, Medium, Large, Extra-large
- **Loading State**: Spinner animation khi đang xử lý
- **Icons Support**: Left và right icons
- **Full Width**: Chiếm toàn bộ width container
- **Accessibility**: ARIA labels, keyboard navigation, focus states

## Khi nào sử dụng:
- Submit forms (quiz answers)
- Navigation actions
- Call-to-action buttons
- Confirmation dialogs

## Design System:
- Sử dụng gradient theme chính của app
- Consistent với Japanese learning app branding
- Mobile-first responsive design
        `
      }
    }
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Nội dung hiển thị trong button',
      table: {
        type: { summary: 'ReactNode' }
      }
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info', 'ghost', 'link'],
      description: 'Kiểu hiển thị button',
      table: {
        type: { summary: 'ButtonVariant' },
        defaultValue: { summary: 'primary' }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'extra-large'],
      description: 'Kích thước button',
      table: {
        type: { summary: 'ButtonSize' },
        defaultValue: { summary: 'medium' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Button có bị disable không',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    loading: {
      control: 'boolean',
      description: 'Button có đang loading không',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    fullWidth: {
      control: 'boolean',
      description: 'Button có chiếm full width không',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    onClick: {
      action: 'clicked',
      description: 'Callback khi click button',
      table: {
        type: { summary: '() => void' }
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button state
 */
export const Default: Story = {
  args: {
    children: 'Kiểm tra',
    variant: 'primary',
    size: 'medium'
  }
};

/**
 * Tất cả variants
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Primary (Gradient chính)</h3>
        <Button variant="primary">Luyện tập ngay</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Secondary (Outline)</h3>
        <Button variant="secondary">Xem lý thuyết</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Success (Đúng)</h3>
        <Button variant="success">Chính xác!</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Error (Sai)</h3>
        <Button variant="error">Sai rồi</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Warning (Cảnh báo)</h3>
        <Button variant="warning">Chú ý</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Info (Thông tin)</h3>
        <Button variant="info">Xem thêm</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Ghost (Trong suốt)</h3>
        <Button variant="ghost">Bỏ qua</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Link (Liên kết)</h3>
        <Button variant="link">Tìm hiểu thêm</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tất cả variants của button với use cases cụ thể trong app học tiếng Nhật.'
      }
    }
  }
};

/**
 * Tất cả kích thước
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Small</h3>
        <Button size="small">Nhỏ</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Medium (Default)</h3>
        <Button size="medium">Vừa</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Large</h3>
        <Button size="large">Lớn</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Extra Large</h3>
        <Button size="extra-large">Rất lớn</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Các kích thước khác nhau của button từ small đến extra-large.'
      }
    }
  }
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    children: 'Đang kiểm tra...',
    loading: true,
    variant: 'primary'
  },
  parameters: {
    docs: {
      description: {
        story: 'Button với loading spinner. Text sẽ ẩn và hiển thị spinner animation.'
      }
    }
  }
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    children: 'Không thể click',
    disabled: true,
    variant: 'primary'
  },
  parameters: {
    docs: {
      description: {
        story: 'Button bị disabled. Opacity giảm và không thể click.'
      }
    }
  }
};

/**
 * Full width
 */
export const FullWidth: Story = {
  args: {
    children: 'Nút chiếm toàn bộ width',
    fullWidth: true,
    variant: 'primary'
  },
  parameters: {
    docs: {
      description: {
        story: 'Button chiếm toàn bộ width của container. Thường dùng trong forms mobile.'
      }
    }
  }
};
