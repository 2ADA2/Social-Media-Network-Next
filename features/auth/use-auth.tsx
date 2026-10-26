import { useAppSelector, useAppDispatch } from '@/app/store/hooks.ts';
import { selectIsAuthenticated } from '@/entities/user/model/selectors.ts';
import {
  logout as logoutAction,
  setCredentials,
} from '@/entities/user/model/user-slice.ts';
import { signinRequest } from '@/features/auth/signin.ts';
import { signupRequest } from '@/features/auth/signup.ts';
import { userQueries } from '@/features/auth/me.ts';
import { queryClient } from '@/shared/api/queryClient.ts';
import { fetchLogout } from '@/features/auth/logout.ts';

export const useAuth = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  const auth = async (token: string) => {
    const user = await queryClient.fetchQuery(userQueries.me());
    dispatch(setCredentials({ user, token }));
  };

  const signin = async (email: string, password: string) => {
    try {
      const { token } = await signinRequest({ email, password });
      await auth(token);
      localStorage.setItem('token', token);
    } catch (e) {
      localStorage.removeItem('token');
      throw e;
    }
  };

  const signup = async (data: {
    email: string;
    password: string;
    firstName: string;
    secondName: string;
  }) => {
    await signupRequest(data);
    await signin(data.email, data.password);
  };

  const logout = async () => {
    try {
      await fetchLogout();
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      localStorage.removeItem('token');
      dispatch(logoutAction());
      queryClient.clear();
    }
  };

  return {
    isAuth,
    auth,
    logout,
    signin,
    signup,
  };
};
