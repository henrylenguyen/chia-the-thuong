/**
 * JapaneseText Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { JapaneseText } from './japanesetext';

const meta: Meta<typeof JapaneseText> = {
  title: 'Components/JapaneseText',
  component: JapaneseText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'JapaneseText Component',
  },
};

export const Disabled: Story = {
  args: {
    children: 'JapaneseText Disabled',
    disabled: true,
  },
};
