# 📚 Storybook Setup Guide - Japanese Learning App

Hướng dẫn setup Storybook 8.6 cho Next.js project với autodocs và CI/CD ready.

## 🎯 Mục tiêu

- ✅ Storybook 8.6.14 stable (tránh version 9.0 có bugs)
- ✅ Autodocs với interactive controls
- ✅ Component documentation bằng tiếng Việt
- ✅ CI/CD ready (no dependency conflicts)
- ✅ Atomic Design structure support

## 📦 Dependencies

### Core Storybook Packages
```json
{
  "devDependencies": {
    "storybook": "8.6.12",
    "@storybook/nextjs": "8.6.12",
    "@storybook/addon-essentials": "8.6.12",
    "@storybook/addon-interactions": "8.6.12",
    "@storybook/addon-links": "8.6.12"
  }
}
```

### Installation Commands
```bash
# Install exact versions để tránh conflicts
npm install --save-dev \
  storybook@8.6.12 \
  @storybook/nextjs@8.6.12 \
  @storybook/addon-essentials@8.6.12 \
  @storybook/addon-interactions@8.6.12 \
  @storybook/addon-links@8.6.12

# Nếu có conflicts, dùng legacy-peer-deps
npm install --legacy-peer-deps
```

## ⚙️ Configuration Files

### 1. `.storybook/main.ts`
```typescript
import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../components/**/*.stories.@(js|jsx|ts|tsx|mdx)"
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions", 
    "@storybook/addon-links"
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  docs: {
    autodocs: true,  // Enable autodocs
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  }
};
export default config;
```

### 2. `.storybook/preview.ts`
```typescript
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
          value: '#ffffff',
        },
        {
          name: 'dark', 
          value: '#1a1a1a',
        },
        {
          name: 'gradient',
          value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      ],
    },
  },
};

export default preview;
```

### 3. `package.json` Scripts
```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

## 📁 Story File Structure

### Component Story Template
```typescript
// components/atoms/button/index.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Button component với gradient theme cho Japanese Learning App.'
      }
    }
  },
  tags: ['autodocs']  // Enable autodocs cho component này
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button Text',
    variant: 'primary',
    size: 'medium'
  }
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="success">Success</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tất cả variants của button component.'
      }
    }
  }
};
```

## 🚀 Running Storybook

```bash
# Development
npm run storybook

# Build for production
npm run build-storybook

# Clear cache nếu có issues
rm -rf node_modules/.cache .storybook-static .next
npm run storybook
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. **Dependency Conflicts**
```bash
# Error: ERESOLVE unable to resolve dependency tree
# Solution: Use exact versions
npm install storybook@8.6.12 --save-dev --legacy-peer-deps
```

#### 2. **Stories Not Found**
```bash
# Error: No story files found
# Check .storybook/main.ts stories pattern
stories: ["../components/**/*.stories.@(js|jsx|ts|tsx|mdx)"]
```

#### 3. **Build Errors**
```bash
# Clear all caches
rm -rf node_modules/.cache .storybook-static .next
npm run storybook
```

#### 4. **Import Errors**
```typescript
// Make sure CSS import path is correct
import '../app/globals.css';  // Adjust path as needed
```

## 📋 Best Practices

### 1. **Story Organization**
```
components/
├── atoms/
│   ├── button/
│   │   ├── button.tsx
│   │   ├── index.stories.tsx  ✅
│   │   └── button.test.tsx
│   └── input/
│       ├── input.tsx
│       ├── index.stories.tsx  ✅
│       └── input.test.tsx
```

### 2. **Documentation Standards**
- ✅ Component description bằng tiếng Việt
- ✅ Story descriptions cho use cases
- ✅ Props documentation với TypeScript
- ✅ Interactive examples với controls

### 3. **Naming Conventions**
- ✅ Stories: `ComponentName.stories.tsx`
- ✅ Story titles: `Atoms/ComponentName`
- ✅ Story names: `Default`, `AllVariants`, `Loading`, etc.

### 4. **Tags Usage**
```typescript
// Enable autodocs
tags: ['autodocs']

// Disable autodocs
tags: []
```

## 🎯 Features Enabled

- ✅ **Autodocs**: Auto-generated documentation
- ✅ **Controls**: Interactive prop testing
- ✅ **Actions**: Event logging
- ✅ **Backgrounds**: Multiple theme testing
- ✅ **Viewport**: Responsive testing
- ✅ **Accessibility**: A11y testing (via essentials)

## 🚀 CI/CD Ready

### GitHub Actions Example
```yaml
# .github/workflows/storybook.yml
name: Build Storybook
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build-storybook
```

## 📚 Resources

- [Storybook 8.6 Documentation](https://storybook.js.org/docs/8.6)
- [Next.js Integration](https://storybook.js.org/docs/8.6/get-started/nextjs)
- [Autodocs Guide](https://storybook.js.org/docs/8.6/writing-docs/autodocs)

---

**Setup completed successfully! 🎉**

Storybook 8.6.14 với autodocs, interactive controls và CI/CD ready cho Japanese Learning App.
