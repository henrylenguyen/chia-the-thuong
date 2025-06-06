/**
 * JapaneseInput Component Tests
 * Import từ Storybook stories
 */

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './index.stories';

const { Default, Disabled } = composeStories(stories);

describe('JapaneseInput Component', () => {
  it('renders default story correctly', () => {
    render(<Default />);
    expect(screen.getByText('JapaneseInput Component')).toBeInTheDocument();
  });

  it('renders disabled story correctly', () => {
    render(<Disabled />);
    expect(screen.getByText('JapaneseInput Disabled')).toBeInTheDocument();
  });
});
