import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { selectIsAuthenticated } from "@/entities/user/model/selectors";
import {
  logout as logoutAction,
  setCredentials,
} from "@/entities/user/model/user-slice";
import { signinRequest } from "@/features/auth/signin";
import { signupRequest } from "@/features/auth/signup";
import { userQueries } from "@/features/auth/me";
import { fetchLogout } from "@/features/auth/logout";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import updateToken from "@/shared/lib/update-token";

export const useAuth = () => {
  const router = useRouter();
  const isAuth = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const auth = async (token: string) => {
    const user = await queryClient.fetchQuery(userQueries.me());
    dispatch(setCredentials({ user, token }));
  };

  const signin = async (email: string, password: string) => {
    try {
      const { token } = await signinRequest({ email, password });
      await auth(token);
      updateToken(token);
    } catch (e) {
      updateToken("");
      throw e;
    } finally {
      router.refresh();
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
      console.error("Logout request failed:", err);
    } finally {
      dispatch(logoutAction());
      queryClient.clear();
      updateToken("");
      router.refresh();
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
