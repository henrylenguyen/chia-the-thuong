import type { Preview } from '@storybook/react';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f8fafc', // slate-50
        },
        {
          name: 'white',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a', // slate-900
        },
        {
          name: 'gradient-light',
          value: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', // slate gradients
        },
        {
          name: 'gradient-dark',
          value: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', // dark slate gradients
        },
        {
          name: 'gradient-brand',
          value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // brand gradient
        },
      ],
    },
  },
};

export default preview;