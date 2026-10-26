import type { RootState } from '@/app/store/user-store';

export const selectUser = (state: RootState) => state.user.userData;
export const selectUserId = (state: RootState) => state.user.userData?.id;
export const selectToken = (state: RootState) => state.user.token;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuth;
export const selectIsInit = (state: RootState) => state.user.isInit;
