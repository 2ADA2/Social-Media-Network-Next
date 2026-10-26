'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { MuiThemeProvider } from './mui-theme-provider';
import { ThemeProvider } from './theme-provider';
import { NotificationsProvider } from './notifications-provider';
import { I18nProvider } from './i18-next-provider';
import { ReduxProvider } from './redux-provider';
import { QueryProvider } from './query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <I18nProvider>
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
      </I18nProvider>
    </AppRouterCacheProvider>
  );
}