/**
 * App Store - Global application state
 * Quản lý theme, navigation, và global UI state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export interface AppState {
  // Theme management
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // Navigation state
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // UI state
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme management
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      // Navigation state
      currentPage: 'home',
      setCurrentPage: (page) => set({ currentPage: page }),
      
      // UI state
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      
      // Loading states
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Error handling
      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'japanese-app-store',
      partialize: (state) => ({
        theme: state.theme,
        currentPage: state.currentPage,
      }),
    }
  )
);
