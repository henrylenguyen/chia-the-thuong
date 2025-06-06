/**
 * SearchInput Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './searchinput';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'SearchInput Component',
  },
};

export const Disabled: Story = {
  args: {
    children: 'SearchInput Disabled',
    disabled: true,
  },
};
