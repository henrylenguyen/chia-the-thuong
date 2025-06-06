/**
 * JapaneseInput Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { JapaneseInput } from './japaneseinput';

const meta: Meta<typeof JapaneseInput> = {
  title: 'Components/JapaneseInput',
  component: JapaneseInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'JapaneseInput Component',
  },
};

export const Disabled: Story = {
  args: {
    children: 'JapaneseInput Disabled',
    disabled: true,
  },
};
