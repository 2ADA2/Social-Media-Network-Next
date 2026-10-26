import {initUserStore, logout, setCredentials, userReducer} from '@/entities/user/model/user-slice';
import {userQueries} from '@/features/auth/me';
import {queryClient} from '@/shared/api/queryClient';
import {configureStore} from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

if (token) {
  (async () => {
    try {
      const user = await queryClient.fetchQuery(userQueries.me());
      store.dispatch(setCredentials({user, token}));
      store.dispatch(initUserStore());
    } catch {
      store.dispatch(logout());
      store.dispatch(initUserStore());
    }
  })();
} else {
  store.dispatch(initUserStore());
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
