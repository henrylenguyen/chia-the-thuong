/**
 * Logo Component Tests
 *
 * Simple tests để verify Logo component hoạt động
 *
 * @author Japanese Learning App Team
 * @version 2.0.0
 */

import { render, screen } from '@testing-library/react';
import { Logo } from './logo';

// Mock CSS imports
jest.mock('@/app/globals.css', () => ({}));

describe('Logo Component', () => {
  it('should render logo with default props', () => {
    render(<Logo />);

    // Kiểm tra Torii icon có hiển thị
    const toriiIcon = screen.getByLabelText('Cổng Torii - Biểu tượng Nhật Bản');
    expect(toriiIcon).toBeInTheDocument();

    // Kiểm tra text tiếng Nhật có hiển thị
    expect(screen.getByText('日本語学習')).toBeInTheDocument();
  });

  it('should render static logo without animation', () => {
    const { container } = render(<Logo />);

    expect(container.firstChild).not.toHaveClass('animate-bounce');
    expect(screen.getByText('日本語学習')).toBeInTheDocument();
  });

  it('should render as Link with default href', () => {
    render(<Logo />);

    const logo = screen.getByRole('link');
    expect(logo).toHaveAttribute('href', '/');
    expect(logo).toHaveAttribute('aria-label', 'Logo ứng dụng học tiếng Nhật - Về trang chủ');
  });

  it('should render different sizes', () => {
    const { container } = render(<Logo size="large" />);
    expect(container.firstChild).toHaveClass('gap-3');
  });

  it('should render different variants', () => {
    const { container } = render(<Logo variant="vertical" />);
    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('should apply gradient classes to icon and text', () => {
    render(<Logo />);

    const toriiIcon = screen.getByLabelText('Cổng Torii - Biểu tượng Nhật Bản');
    expect(toriiIcon).toHaveClass('gradient-text');

    const text = screen.getByText('日本語学習');
    expect(text).toHaveClass('gradient-text');
  });

  it('should render with custom href', () => {
    render(<Logo href="/dashboard" />);

    const logo = screen.getByRole('link');
    expect(logo).toHaveAttribute('href', '/dashboard');
  });

  it('should always render as Link element', () => {
    render(<Logo />);

    const logo = screen.getByRole('link');
    expect(logo).toBeInTheDocument();
    expect(logo.tagName).toBe('A');
  });
});
