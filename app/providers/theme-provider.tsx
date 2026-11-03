'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/app/store/theme-store';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [theme]);

  return <>{children}</>;
};