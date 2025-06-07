/**
 * Loading Component Tests
 * Unit tests cho Loading component với design mới
 *
 * @author Japanese Learning App Team
 * @version 2.0.0
 */

import { render, screen } from '@testing-library/react';
import { Loading } from './loading';
import { LOADING_TEXTS } from './types';

describe('Loading Component', () => {
  it('should render default loading', () => {
    render(<Loading />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(LOADING_TEXTS.default)).toBeInTheDocument();
    expect(screen.getByText('日')).toBeInTheDocument();
    expect(screen.getByText('本')).toBeInTheDocument();
    expect(screen.getByText('語')).toBeInTheDocument();
    expect(screen.getByText('学')).toBeInTheDocument();
    expect(screen.getByText('習')).toBeInTheDocument();
  });

  it('should render different variants', () => {
    const { rerender } = render(<Loading variant="full-screen" />);
    expect(screen.getByRole('status')).toHaveClass('fixed', 'inset-0');

    rerender(<Loading variant="inline" />);
    expect(screen.getByRole('status')).toHaveClass('flex', 'flex-col');

    rerender(<Loading variant="minimal" />);
    expect(screen.getByRole('status')).toHaveClass('flex', 'items-center');
  });

  it('should show/hide text', () => {
    const { rerender } = render(<Loading showText={true} text="Custom text" />);
    expect(screen.getByText('Custom text')).toBeInTheDocument();

    rerender(<Loading showText={false} text="Custom text" />);
    expect(screen.queryByText('Custom text')).not.toBeInTheDocument();
  });

  it('should show progress bar', () => {
    render(<Loading showProgress={true} progress={75} />);

    const progressBar = screen.getByRole('status').querySelector('.bg-gradient-to-r');
    expect(progressBar).toHaveStyle('width: 75%');
  });

  it('should handle progress bounds', () => {
    const { rerender } = render(<Loading showProgress={true} progress={150} />);
    let progressBar = screen.getByRole('status').querySelector('.bg-gradient-to-r');
    expect(progressBar).toHaveStyle('width: 100%');

    rerender(<Loading showProgress={true} progress={-10} />);
    progressBar = screen.getByRole('status').querySelector('.bg-gradient-to-r');
    expect(progressBar).toHaveStyle('width: 0%');
  });

  it('should apply custom className', () => {
    const { container } = render(<Loading className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have proper accessibility attributes', () => {
    render(<Loading text="Loading content" />);

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveAttribute('aria-live', 'polite');
    expect(loadingElement).toHaveAttribute('aria-label', 'Loading content');
  });

  it('should render Torii gate icon', () => {
    render(<Loading />);

    const toriiIcon = screen.getByLabelText('Cổng Torii - Đang tải');
    expect(toriiIcon).toBeInTheDocument();
    expect(toriiIcon).toHaveClass('animate-bounce');
  });

  it('should render dual spinner', () => {
    const { container } = render(<Loading />);

    const spinners = container.querySelectorAll('.animate-spin');
    expect(spinners).toHaveLength(2);
    expect(spinners[1]).toHaveClass('reverse-spin');
  });
});
