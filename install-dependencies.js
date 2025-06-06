#!/usr/bin/env node

/**
 * Install dependencies script cho Japanese Learning App - Next.js 14
 * Cài đặt tất cả packages theo migration plan
 */

const { execSync } = require('child_process');

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

const runCommand = (command, description) => {
  log(`\n📦 ${description}...`, 'blue');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed!`, 'green');
  } catch (error) {
    log(`❌ Error in ${description}: ${error.message}`, 'red');
    process.exit(1);
  }
};

// Dependencies theo migration plan
const dependencies = {
  // UI Components & Styling
  ui: [
    '@radix-ui/react-slot',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-toast',
    '@radix-ui/react-progress',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'lucide-react'
  ],

  // State Management & Data
  state: [
    'zustand',
    'dexie',
    'dexie-react-hooks'
  ],

  // Animations
  animations: [
    'framer-motion'
  ],

  // 3D Graphics
  threejs: [
    'three',
    '@react-three/fiber',
    '@react-three/drei'
  ],

  // Development Tools
  dev: [
    '@storybook/react',
    '@storybook/react-vite',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/test',
    'storybook',
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@testing-library/user-event',
    'jest',
    'jest-environment-jsdom',
    '@types/jest',
    '@types/three',
    'sass'
  ]
};

function installDependencies() {
  log('🚀 Installing Japanese Learning App Dependencies', 'bold');
  log('================================================', 'yellow');

  // Install production dependencies
  const prodDeps = [
    ...dependencies.ui,
    ...dependencies.state,
    ...dependencies.animations,
    ...dependencies.threejs
  ].join(' ');

  runCommand(
    `npm install ${prodDeps}`,
    'Installing production dependencies'
  );

  // Install development dependencies
  const devDeps = dependencies.dev.join(' ');

  runCommand(
    `npm install -D ${devDeps}`,
    'Installing development dependencies'
  );

  log('\n✨ All dependencies installed successfully!', 'green');
  log('================================================', 'yellow');
  log('Next steps:', 'bold');
  log('1. Configure Storybook', 'blue');
  log('2. Setup Jest configuration', 'blue');
  log('3. Create Zustand stores', 'blue');
  log('4. Setup Dexie database', 'blue');
}

// Chạy installation
if (require.main === module) {
  installDependencies();
}

module.exports = { installDependencies };
