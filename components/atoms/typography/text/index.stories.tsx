/**
 * Text Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './text';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Text Component',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Text Disabled',
    disabled: true,
  },
};
