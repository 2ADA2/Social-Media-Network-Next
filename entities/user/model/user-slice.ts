import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from './types';

interface UserState {
  userData: User | null;
  token: string | null;
  isAuth: boolean;
  isInit: boolean
}

const initialState: UserState = {
  userData: null,
  token: null,
  isAuth: false,
  isInit: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.userData = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = true;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.userData = action.payload;
    },
    logout: (state) => {
      state.userData = null;
      state.token = null;
      state.isAuth = false;
    },
    initUserStore: (state) => {
      state.isInit = true;
    },
  },
});

export const { setCredentials, setUser, logout, initUserStore } = userSlice.actions;
export const userReducer = userSlice.reducer;
