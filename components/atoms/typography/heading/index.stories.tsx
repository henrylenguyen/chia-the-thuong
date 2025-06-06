/**
 * Heading Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './heading';

const meta: Meta<typeof Heading> = {
  title: 'Components/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Heading Component',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Heading Disabled',
    disabled: true,
  },
};
