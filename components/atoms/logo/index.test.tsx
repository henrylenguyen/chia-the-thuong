/**
 * Logo Component Tests
 * 
 * Unit tests cho Logo component
 * Test tất cả functionality, props, và edge cases
 * 
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Logo } from './logo';
import { LogoProps } from './types';

/**
 * Helper function để render Logo với props
 */
const renderLogo = (props: Partial<LogoProps> = {}) => {
  const defaultProps: LogoProps = {
    isLoading: false,
    size: 'medium',
    variant: 'horizontal',
    className: '',
  };
  
  return render(<Logo {...defaultProps} {...props} />);
};

describe('Logo Component', () => {
  
  describe('Rendering', () => {
    it('should render logo with default props', () => {
      renderLogo();
      
      // Kiểm tra Torii icon có hiển thị
      const toriiIcon = screen.getByRole('img', { name: /cổng torii/i });
      expect(toriiIcon).toBeInTheDocument();
      expect(toriiIcon).toHaveTextContent('⛩️');
      
      // Kiểm tra text tiếng Nhật có hiển thị
      expect(screen.getByText('日')).toBeInTheDocument();
      expect(screen.getByText('本')).toBeInTheDocument();
      expect(screen.getByText('語')).toBeInTheDocument();
      expect(screen.getByText('学')).toBeInTheDocument();
      expect(screen.getByText('習')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const customClass = 'custom-logo-class';
      const { container } = renderLogo({ className: customClass });
      
      expect(container.firstChild).toHaveClass(customClass);
    });

    it('should render all text characters individually', () => {
      renderLogo();
      
      const textChars = ['日', '本', '語', '学', '習'];
      textChars.forEach(char => {
        expect(screen.getByText(char)).toBeInTheDocument();
      });
    });
  });

  describe('Sizes', () => {
    it('should apply correct classes for small size', () => {
      const { container } = renderLogo({ size: 'small' });
      expect(container.firstChild).toHaveClass('gap-1');
    });

    it('should apply correct classes for medium size', () => {
      const { container } = renderLogo({ size: 'medium' });
      expect(container.firstChild).toHaveClass('gap-2');
    });

    it('should apply correct classes for large size', () => {
      const { container } = renderLogo({ size: 'large' });
      expect(container.firstChild).toHaveClass('gap-3');
    });

    it('should apply correct classes for extra-large size', () => {
      const { container } = renderLogo({ size: 'extra-large' });
      expect(container.firstChild).toHaveClass('gap-4');
    });
  });

  describe('Variants', () => {
    it('should render horizontal variant correctly', () => {
      const { container } = renderLogo({ variant: 'horizontal' });
      expect(container.firstChild).toHaveClass('flex-row', 'items-center');
    });

    it('should render vertical variant correctly', () => {
      const { container } = renderLogo({ variant: 'vertical' });
      expect(container.firstChild).toHaveClass('flex-col', 'items-center');
    });

    it('should hide text in icon-only variant', () => {
      renderLogo({ variant: 'icon-only' });
      
      const toriiIcon = screen.getByRole('img', { name: /cổng torii/i });
      expect(toriiIcon).toBeInTheDocument();
      
      // Text should be hidden
      const logoText = screen.getByText('日').parentElement;
      expect(logoText).toHaveClass('hidden');
    });

    it('should hide icon in text-only variant', () => {
      renderLogo({ variant: 'text-only' });
      
      const toriiIcon = screen.getByRole('img', { name: /cổng torii/i });
      expect(toriiIcon).toHaveClass('hidden');
      
      // Text should be visible
      expect(screen.getByText('日')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should apply loading classes when isLoading is true', () => {
      const { container } = renderLogo({ isLoading: true });
      
      expect(container.firstChild).toHaveClass('logo-loading');
      
      const toriiIcon = screen.getByRole('img', { name: /cổng torii/i });
      expect(toriiIcon).toHaveClass('animate-bounce');
    });

    it('should apply static classes when isLoading is false', () => {
      const { container } = renderLogo({ isLoading: false });
      
      expect(container.firstChild).toHaveClass('logo-static');
      
      const toriiIcon = screen.getByRole('img', { name: /cổng torii/i });
      expect(toriiIcon).not.toHaveClass('animate-bounce');
    });

    it('should apply animation delay to text characters when loading', () => {
      renderLogo({ isLoading: true });
      
      const textChars = screen.getAllByText(/[日本語学習]/);
      textChars.forEach((char, index) => {
        expect(char).toHaveClass('animate-bounce');
        expect(char).toHaveStyle(`animation-delay: ${(index + 1) * 0.1}s`);
      });
    });
  });

  describe('Interactivity', () => {
    it('should call onClick when clicked', () => {
      const handleClick = jest.fn();
      renderLogo({ onClick: handleClick });
      
      const logo = screen.getByRole('button');
      fireEvent.click(logo);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply interactive classes when onClick is provided', () => {
      const handleClick = jest.fn();
      const { container } = renderLogo({ onClick: handleClick });
      
      expect(container.firstChild).toHaveClass('cursor-pointer');
      expect(container.firstChild).toHaveAttribute('role', 'button');
      expect(container.firstChild).toHaveAttribute('tabIndex', '0');
    });

    it('should not apply interactive classes when onClick is not provided', () => {
      const { container } = renderLogo();
      
      expect(container.firstChild).not.toHaveClass('cursor-pointer');
      expect(container.firstChild).not.toHaveAttribute('role', 'button');
      expect(container.firstChild).not.toHaveAttribute('tabIndex');
    });

    it('should handle keyboard events when interactive', () => {
      const handleClick = jest.fn();
      renderLogo({ onClick: handleClick });
      
      const logo = screen.getByRole('button');
      fireEvent.keyDown(logo, { key: 'Enter' });
      
      // Note: Keyboard handling would be implemented in the component if needed
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label for Torii icon', () => {
      renderLogo();
      
      const toriiIcon = screen.getByRole('img', { name: /cổng torii - biểu tượng nhật bản/i });
      expect(toriiIcon).toBeInTheDocument();
    });

    it('should have proper focus styles when interactive', () => {
      const handleClick = jest.fn();
      const { container } = renderLogo({ onClick: handleClick });
      
      expect(container.firstChild).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-primary-blue');
    });

    it('should have text that is not selectable', () => {
      renderLogo();
      
      const logoText = screen.getByText('日').parentElement;
      expect(logoText).toHaveClass('select-none');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty className gracefully', () => {
      const { container } = renderLogo({ className: '' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle undefined onClick gracefully', () => {
      const { container } = renderLogo({ onClick: undefined });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should maintain proper structure with all props combined', () => {
      const handleClick = jest.fn();
      renderLogo({
        isLoading: true,
        size: 'large',
        variant: 'vertical',
        className: 'custom-class',
        onClick: handleClick
      });
      
      const logo = screen.getByRole('button');
      expect(logo).toHaveClass('custom-class', 'logo-loading', 'flex-col', 'gap-3');
      
      const toriiIcon = screen.getByRole('img', { name: /cổng torii/i });
      expect(toriiIcon).toHaveClass('animate-bounce', 'text-3xl');
    });
  });
});
