/**
 * Button Component Tests
 * Import từ Storybook stories
 */

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './index.stories';

const { Default, Disabled } = composeStories(stories);

describe('Button Component', () => {
  it('renders default story correctly', () => {
    render(<Default />);
    expect(screen.getByText('Button Component')).toBeInTheDocument();
  });

  it('renders disabled story correctly', () => {
    render(<Disabled />);
    expect(screen.getByText('Button Disabled')).toBeInTheDocument();
  });
});
