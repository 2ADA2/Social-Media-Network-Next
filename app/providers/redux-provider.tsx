"use client";

import { Provider } from "react-redux";
import { useRef, useEffect } from "react";
import { makeStore, type AppStore } from "@/app/store/user-store";
import {
  initUserStore,
  logout,
  setCredentials,
} from "@/entities/user/model/user-slice";
import updateToken from "@/shared/lib/update-token";
import { apiClient } from "@/shared/api/api-client";
import { UserResponse, mapUser } from "@/entities/user";
import { getCookie } from "@/shared/lib/get-cookie";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const store = storeRef.current;
    if (!store) return;

    const token = getCookie("token");

    if (token) {
      (async () => {
        try {
          const response = await apiClient.get<UserResponse>("/api/me");
          const user = mapUser(response.data);
          store.dispatch(setCredentials({ user, token }));
          updateToken(token);
        } catch {
          store.dispatch(logout());
          updateToken("");
        } finally {
          store.dispatch(initUserStore());
        }
      })();
    } else {
      store.dispatch(initUserStore());
      updateToken("");
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
