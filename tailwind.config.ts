import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./.storybook/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Background colors
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Primary gradient theme
        'primary-blue': "var(--primary-blue)",
        'primary-purple': "var(--primary-purple)",
        'primary-blue-light': "var(--primary-blue-light)",
        'primary-blue-dark': "var(--primary-blue-dark)",
        'primary-purple-light': "var(--primary-purple-light)",
        'primary-purple-dark': "var(--primary-purple-dark)",

        // Theory colors
        'theory-green': "var(--theory-green)",
        'theory-green-light': "var(--theory-green-light)",
        'theory-green-dark': "var(--theory-green-dark)",
        'theory-bg': "var(--theory-bg)",
        'theory-border': "var(--theory-border)",

        // Semantic colors
        'success-green': "var(--success-green)",
        'success-light': "var(--success-light)",
        'success-dark': "var(--success-dark)",
        'error-red': "var(--error-red)",
        'error-light': "var(--error-light)",
        'error-dark': "var(--error-dark)",
        'warning-yellow': "var(--warning-yellow)",
        'warning-light': "var(--warning-light)",
        'warning-dark': "var(--warning-dark)",
        'info-blue': "var(--info-blue)",
        'info-light': "var(--info-light)",
        'info-dark': "var(--info-dark)",

        // Japanese-inspired accent colors
        'sakura-pink': "var(--sakura-pink)",
        'ocean-blue': "var(--ocean-blue)",
        'sunset-orange': "var(--sunset-orange)",
        'forest-green': "var(--forest-green)",
        'royal-purple': "var(--royal-purple)",
        'cherry-red': "var(--cherry-red)",

        // Neutral colors
        'neutral-white': "var(--neutral-white)",
        'neutral-gray-50': "var(--neutral-gray-50)",
        'neutral-gray-100': "var(--neutral-gray-100)",
        'neutral-gray-200': "var(--neutral-gray-200)",
        'neutral-gray-300': "var(--neutral-gray-300)",
        'neutral-gray-400': "var(--neutral-gray-400)",
        'neutral-gray-500': "var(--neutral-gray-500)",
        'neutral-gray-600': "var(--neutral-gray-600)",
        'neutral-gray-700': "var(--neutral-gray-700)",
        'neutral-gray-800': "var(--neutral-gray-800)",
        'neutral-gray-900': "var(--neutral-gray-900)",

        // Text colors
        'text-primary': "var(--text-primary)",
        'text-secondary': "var(--text-secondary)",
        'text-muted': "var(--text-muted)",
        'text-japanese': "var(--text-japanese)",

        // Border colors
        'border-light': "var(--border-light)",
        'border-medium': "var(--border-medium)",
        'border-dark': "var(--border-dark)",

        // Background overlays
        'bg-overlay': "var(--bg-overlay)",
        'bg-overlay-dark': "var(--bg-overlay-dark)",
        'bg-card': "var(--bg-card)",
        'bg-card-hover': "var(--bg-card-hover)",
      },
      backgroundImage: {
        'primary-gradient': "var(--primary-gradient)",
        'primary-gradient-hover': "var(--primary-gradient-hover)",
        'theory-gradient': "var(--theory-gradient)",
        'success-gradient': "var(--success-gradient)",
        'error-gradient': "var(--error-gradient)",
        'warning-gradient': "var(--warning-gradient)",
        'background-gradient': "var(--background-gradient)",
      },
      boxShadow: {
        'sm': "var(--shadow-sm)",
        'md': "var(--shadow-md)",
        'lg': "var(--shadow-lg)",
        'xl': "var(--shadow-xl)",
        'card-hover': "var(--shadow-card-hover)",
      },
      borderRadius: {
        'sm': "var(--radius-sm)",
        'md': "var(--radius-md)",
        'lg': "var(--radius-lg)",
        'xl': "var(--radius-xl)",
        '2xl': "var(--radius-2xl)",
      },
      animation: {
        'bounce-custom': 'bounce 2s infinite',
        'success-pulse': 'successPulse 0.6s ease-out',
        'error-shake': 'errorShake 0.4s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'card-hover': 'cardHover 0.3s ease',
        'button-hover': 'buttonHover 0.2s ease',
      },
      fontFamily: {
        'noto-jp': ['var(--font-noto-sans-jp)', 'sans-serif'],
        'japanese': ['var(--font-japanese)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
