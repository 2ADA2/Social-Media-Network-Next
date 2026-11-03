import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => {
          return (state.theme === "light") ?  { theme: "dark" } : { theme: "light" };
        }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'theme-storage' },
  ),
);
