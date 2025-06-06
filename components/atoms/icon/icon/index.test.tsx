/**
 * Icon Component Tests
 * Import từ Storybook stories
 */

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './index.stories';

const { Default, Disabled } = composeStories(stories);

describe('Icon Component', () => {
  it('renders default story correctly', () => {
    render(<Default />);
    expect(screen.getByText('Icon Component')).toBeInTheDocument();
  });

  it('renders disabled story correctly', () => {
    render(<Disabled />);
    expect(screen.getByText('Icon Disabled')).toBeInTheDocument();
  });
});
