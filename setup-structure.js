#!/usr/bin/env node

/**
 * Setup script cho Japanese Learning App - Next.js 14
 * Tạo toàn bộ folder structure theo migration plan
 */

const fs = require('fs');
const path = require('path');

// Màu sắc cho console
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Cấu trúc thư mục theo migration plan
const folderStructure = {
  'app/(pages)': {
    'home': {},
    'theory': {
      '[form]': {}
    },
    'practice': {},
    'review': {},
    'statistics': {}
  },
  'app/api': {
    'theory': {
      '[form]': {}
    },
    'exercises': {
      '[form]': {},
      'random': {}
    },
    'progress': {
      'stats': {}
    },
    'export': {},
    'import': {},
    'reset': {}
  },
  'components': {
    'atoms': {
      'button': {},
      'input': {
        'text-input': {},
        'japanese-input': {},
        'search-input': {}
      },
      'typography': {
        'heading': {},
        'text': {},
        'japanese-text': {}
      },
      'icon': {
        'icon': {},
        'loading-spinner': {}
      }
    },
    'molecules': {
      'cards': {
        'theory-card': {},
        'exercise-card': {},
        'quiz-card': {},
        'stats-card': {}
      },
      'forms': {
        'quiz-form': {},
        'search-form': {}
      },
      'navigation': {
        'nav-item': {},
        'breadcrumb': {}
      }
    },
    'organisms': {
      'header': {},
      'quiz-interface': {},
      'theory-display': {}
    }
  },
  'features': {},
  'stores': {
    'app': {},
    'quiz': {},
    'progress': {},
    'user': {}
  },
  'types': {},
  'utils': {},
  'lib': {},
  'hooks': {},
  'styles': {}
};

// Template files cho atomic components
const componentTemplates = {
  'component.tsx': (name) => `/**
 * ${name} Component
 * UI thuần túy - chỉ nhận props và render
 */

import React from 'react';
import { ${name}Props } from './types';

export const ${name}: React.FC<${name}Props> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={\`\${className}\`} {...props}>
      {children}
    </div>
  );
};

export default ${name};
`,

  'useComponent.tsx': (name) => `/**
 * ${name} Hook
 * Logic và state management
 */

import { useState, useCallback } from 'react';
import { ${name}HookProps, ${name}HookReturn } from './types';

export const use${name} = (props: ${name}HookProps): ${name}HookReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Logic implementation here
      console.log('${name} action triggered');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    handleAction
  };
};
`,

  'types.ts': (name) => `/**
 * ${name} Component Types
 * Local TypeScript interfaces
 */

import { ReactNode } from 'react';

export interface ${name}Props {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface ${name}HookProps {
  // Hook props here
}

export interface ${name}HookReturn {
  isLoading: boolean;
  error: string | null;
  handleAction: () => void;
}
`,

  'index.stories.tsx': (name) => `/**
 * ${name} Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name.toLowerCase()}';

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '${name} Component',
  },
};

export const Disabled: Story = {
  args: {
    children: '${name} Disabled',
    disabled: true,
  },
};
`,

  'index.test.tsx': (name) => `/**
 * ${name} Component Tests
 * Import từ Storybook stories
 */

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './index.stories';

const { Default, Disabled } = composeStories(stories);

describe('${name} Component', () => {
  it('renders default story correctly', () => {
    render(<Default />);
    expect(screen.getByText('${name} Component')).toBeInTheDocument();
  });

  it('renders disabled story correctly', () => {
    render(<Disabled />);
    expect(screen.getByText('${name} Disabled')).toBeInTheDocument();
  });
});
`,

  'index.ts': (name) => `/**
 * ${name} Component Exports
 */

export { ${name}, default } from './${name.toLowerCase()}';
export { use${name} } from './use${name.toLowerCase()}';
export type * from './types';
`
};

// Hàm tạo thư mục đệ quy
function createDirectories(structure, basePath = '') {
  Object.keys(structure).forEach(key => {
    const currentPath = path.join(basePath, key);

    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath, { recursive: true });
      log(`✅ Created: ${currentPath}`, 'green');
    }

    if (typeof structure[key] === 'object' && Object.keys(structure[key]).length > 0) {
      createDirectories(structure[key], currentPath);
    }
  });
}

// Hàm tạo component files
function createComponentFiles(componentPath, componentName) {
  Object.keys(componentTemplates).forEach(templateKey => {
    const fileName = templateKey.replace('component', componentName.toLowerCase());
    const filePath = path.join(componentPath, fileName);

    if (!fs.existsSync(filePath)) {
      const content = componentTemplates[templateKey](componentName);
      fs.writeFileSync(filePath, content);
      log(`📄 Created: ${filePath}`, 'blue');
    }
  });
}

// Hàm tạo atomic components
function createAtomicComponents() {
  const atomicComponents = [
    'components/atoms/button/Button',
    'components/atoms/input/text-input/TextInput',
    'components/atoms/input/japanese-input/JapaneseInput',
    'components/atoms/input/search-input/SearchInput',
    'components/atoms/typography/heading/Heading',
    'components/atoms/typography/text/Text',
    'components/atoms/typography/japanese-text/JapaneseText',
    'components/atoms/icon/icon/Icon',
    'components/atoms/icon/loading-spinner/LoadingSpinner'
  ];

  atomicComponents.forEach(componentPath => {
    const parts = componentPath.split('/');
    const componentName = parts[parts.length - 1];
    const dirPath = parts.slice(0, -1).join('/');

    createComponentFiles(dirPath, componentName);
  });
}

// Main setup function
function setupProjectStructure() {
  log('🚀 Setting up Japanese Learning App - Next.js 14 Structure', 'bold');
  log('================================================', 'yellow');

  // Tạo thư mục structure
  log('\n📁 Creating folder structure...', 'yellow');
  createDirectories(folderStructure);

  // Tạo atomic components
  log('\n🧩 Creating atomic components...', 'yellow');
  createAtomicComponents();

  log('\n✨ Project structure setup completed!', 'green');
  log('================================================', 'yellow');
  log('Next steps:', 'bold');
  log('1. Install additional dependencies', 'blue');
  log('2. Configure Storybook', 'blue');
  log('3. Setup Zustand stores', 'blue');
  log('4. Create API routes', 'blue');
}

// Chạy setup
if (require.main === module) {
  setupProjectStructure();
}

module.exports = { setupProjectStructure };
