/**
 * LoadingSpinner Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './loadingspinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'LoadingSpinner Component',
  },
};

export const Disabled: Story = {
  args: {
    children: 'LoadingSpinner Disabled',
    disabled: true,
  },
};
