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
import { getCookie } from "@/shared/lib/get-cookie";
import { fetchMe } from "@/features/auth/me";

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
          const user = await fetchMe();
          store.dispatch(setCredentials({ user, token }));
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
