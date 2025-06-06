/**
 * Button Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button Component',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Button Disabled',
    disabled: true,
  },
};
