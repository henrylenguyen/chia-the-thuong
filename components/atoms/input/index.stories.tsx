/**
 * Japanese Input Component Stories
 * 
 * Storybook stories cho Japanese Input component
 * Hiển thị tất cả states và features của input
 * 
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react';
import { JapaneseInput } from './japanese-input';

/**
 * Meta configuration cho Japanese Input stories
 */
const meta: Meta<typeof JapaneseInput> = {
  title: 'Atoms/JapaneseInput',
  component: JapaneseInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Japanese Input Component

Input field chuyên dụng cho việc nhập tiếng Nhật với IME support.

## Tính năng chính:
- **IME Support**: Hỗ trợ nhập tiếng Nhật với Input Method Editor
- **Auto Focus**: Tự động focus khi component mount
- **Validation States**: Success, error, loading states với visual feedback
- **Character Counting**: Đếm ký tự với maxLength support
- **Keyboard Shortcuts**: Enter to submit, Escape to clear
- **Accessibility**: ARIA labels, screen reader support

## Khi nào sử dụng:
- Quiz answer input
- Japanese text input forms
- Search functionality
- Any input requiring Japanese text

## IME Support:
- Composition events handling
- Proper text input for Japanese characters
- Hiragana, Katakana, Kanji input support
        `
      }
    }
  },
  argTypes: {
    value: {
      description: 'Giá trị hiện tại của input',
      table: {
        type: { summary: 'string' }
      }
    },
    placeholder: {
      description: 'Placeholder text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Nhập câu trả lời...' }
      }
    },
    disabled: {
      description: 'Input có bị disable không',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    loading: {
      description: 'Input có đang loading không',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    error: {
      description: 'Input có lỗi không',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    success: {
      description: 'Input có thành công không',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    size: {
      options: ['small', 'medium', 'large', 'extra-large'],
      description: 'Kích thước input',
      table: {
        type: { summary: 'InputSize' },
        defaultValue: { summary: 'medium' }
      }
    },
    maxLength: {
      description: 'Số ký tự tối đa',
      table: {
        type: { summary: 'number' }
      }
    },
    hint: {
      description: 'Text gợi ý hoặc lỗi',
      table: {
        type: { summary: 'string' }
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default input state
 */
export const Default: Story = {
  args: {
    placeholder: 'Nhập câu trả lời tiếng Nhật...',
    value: '',
    onChange: (value: string) => console.log('Input changed:', value)
  }
};

/**
 * Input với giá trị Japanese
 */
export const WithJapaneseText: Story = {
  args: {
    value: 'こんにちは',
    placeholder: 'Nhập tiếng Nhật...',
    onChange: (value: string) => console.log('Input changed:', value)
  },
  parameters: {
    docs: {
      description: {
        story: 'Input với text tiếng Nhật. Hỗ trợ Hiragana, Katakana và Kanji.'
      }
    }
  }
};

/**
 * Tất cả kích thước
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Small</h3>
        <JapaneseInput size="small" placeholder="Small input" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Medium (Default)</h3>
        <JapaneseInput size="medium" placeholder="Medium input" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Large</h3>
        <JapaneseInput size="large" placeholder="Large input" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Extra Large</h3>
        <JapaneseInput size="extra-large" placeholder="Extra large input" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Các kích thước khác nhau của input từ small đến extra-large.'
      }
    }
  }
};

/**
 * States khác nhau
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Success State</h3>
        <JapaneseInput
          success={true}
          value="正解です！"
          hint="Câu trả lời chính xác!"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Error State</h3>
        <JapaneseInput
          error={true}
          value="間違い"
          hint="Câu trả lời không chính xác. Hãy thử lại!"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Loading State</h3>
        <JapaneseInput
          loading={true}
          value="チェック中..."
          hint="Đang kiểm tra câu trả lời..."
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Disabled State</h3>
        <JapaneseInput
          disabled={true}
          value="無効"
          hint="Input bị vô hiệu hóa"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Các trạng thái khác nhau của input: success, error, loading, disabled.'
      }
    }
  }
};

/**
 * Character counting
 */
export const WithCharacterCount: Story = {
  args: {
    value: 'こんにちは世界',
    maxLength: 20,
    showCharCount: true,
    placeholder: 'Tối đa 20 ký tự...',
    hint: 'Nhập câu trả lời ngắn gọn'
  },
  parameters: {
    docs: {
      description: {
        story: 'Input với character counting và maxLength validation.'
      }
    }
  }
};

/**
 * Quiz interface example
 */
export const QuizInterface: Story = {
  render: () => (
    <div className="w-96 p-6 bg-neutral-gray-50 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-primary">Câu hỏi:</h3>
        <p className="text-secondary">
          家具を買うなら、このお店_______。
        </p>
      </div>
      <JapaneseInput
        placeholder="Nhập câu trả lời..."
        autoFocus={true}
        onSubmit={(value) => console.log('Submitted:', value)}
        hint="Nhấn Enter để submit, Escape để xóa"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Ví dụ sử dụng trong quiz interface với Japanese sentence và input field.'
      }
    }
  }
};
