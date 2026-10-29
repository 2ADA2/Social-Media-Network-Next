'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { MuiThemeProvider } from './mui-theme-provider';
import { ThemeProvider } from './theme-provider';
import { NotificationsProvider } from './notifications-provider';
import { ReduxProvider } from './redux-provider';
import { QueryProvider } from './query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ReduxProvider>
          <QueryProvider>
            <MuiThemeProvider>
              <ThemeProvider>
                <NotificationsProvider>
                  {children}
                </NotificationsProvider>
              </ThemeProvider>
            </MuiThemeProvider>
          </QueryProvider>
        </ReduxProvider>
    </AppRouterCacheProvider>
  );
}