'use client';

import { ThemeProvider, createTheme } from '@mui/material';
import { useMemo, type ReactNode } from 'react';
import { useThemeStore } from '../store/theme-store';

const COLOR_ACCENT = '#FF8811';

export const MuiThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useThemeStore((store) => store.theme);

  const muiTheme = useMemo(
    () =>
      createTheme({
        breakpoints: {
          values: { xs: 0, sm: 600, md: 768, lg: 1024, xl: 1280 },
        },
        palette: {
          mode: theme,
          primary: { main: COLOR_ACCENT },
        },
      }),
    [theme],
  );

  return <ThemeProvider theme={ muiTheme }>{ children }</ThemeProvider>;
};