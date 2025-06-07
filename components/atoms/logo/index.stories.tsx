/**
 * Logo Component Stories
 *

 *
 * @author Japanese Learning App Team
 * @version 2.0.0
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './logo';

/**
 * Meta configuration cho Logo stories
 */
const meta: Meta<typeof Logo> = {
  title: 'Atoms/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `

Logo đơn giản với cổng Torii và text "日本語学習".

## Features:
- **Torii Icon**: FaToriiGate từ react-icons/fa
- **Japanese Text**: "日本語学習" với font-japanese
- **Gradient Colors**: CSS gradient-text từ globals.css
- **Next.js Link**: Navigate về trang chủ mặc định

## Usage:
\`\`\`tsx
<Logo />                    // Navigate to "/"
<Logo href="/dashboard" />  // Custom href
\`\`\`

## CSS Classes:
- Container: \`flex items-center space-x-3\`
- Icon: \`text-2xl gradient-text\`
- Text: \`text-xl font-bold gradient-text font-japanese\`
        `
      }
    }
  },
  argTypes: {
    href: {
      control: 'text',
      description: 'URL để navigate khi click vào logo'
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
 * Default logo - navigate về trang chủ "/"
 */
export const Default: Story = {
  args: {}
};

/**
 * Logo với custom href
 */
export const CustomHref: Story = {
  args: {
    href: '/dashboard'
  }
};


