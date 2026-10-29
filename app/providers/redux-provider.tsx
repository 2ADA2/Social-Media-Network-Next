'use client';

import { Provider } from 'react-redux';
import { useRef, useEffect } from 'react';
import { makeStore, type AppStore } from '@/app/store/user-store';
import { initUserStore, logout, setCredentials } from '@/entities/user/model/user-slice';
import { userQueries } from '@/features/auth/me';
import { createQueryClient } from '@/shared/api/queryClient';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(undefined);
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const store = storeRef.current;
    if (!store) return;

    const token = localStorage.getItem('token');

    if (token) {
      (async () => {
        try {
          const user = await createQueryClient().fetchQuery(userQueries.me());
          store.dispatch(setCredentials({ user, token }));
        } catch {
          store.dispatch(logout());
          localStorage.removeItem('token');
        } finally {
          store.dispatch(initUserStore());
        }
      })();
    } else {
      store.dispatch(initUserStore());
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}