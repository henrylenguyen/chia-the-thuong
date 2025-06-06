/**
 * TextInput Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './textinput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'TextInput Component',
  },
};

export const Disabled: Story = {
  args: {
    children: 'TextInput Disabled',
    disabled: true,
  },
};
