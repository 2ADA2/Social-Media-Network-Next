import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { refreshRequest } from "@/features/auth/refresh";
import { fetchLogout } from "@/features/auth/logout";
import { redirect } from "next/navigation";
import updateToken from "../lib/update-token";
import { getCookie } from "../lib/get-cookie";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export let onTokenRefreshed: (() => void) | null = null;

export const setTokenRefreshCallback = (callback: () => void) => {
  onTokenRefreshed = callback;
};

export const apiClient = axios.create({
  baseURL: "/",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

const getNewToken = (): Promise<string> => {
  refreshPromise ??= refreshRequest()
    .then((data) => {
      if (typeof window !== "undefined") {
        updateToken(data.token);
        onTokenRefreshed?.();
      }

      return data.token;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

const forceLogout = async () => {
  try {
    await fetchLogout();
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    if (typeof window !== "undefined") {
      updateToken("");
      redirect("/");
    }
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as CustomAxiosRequestConfig;
    const status = error.response?.status;

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (original._retry) {
      await forceLogout();
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const newToken = await getNewToken();
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch {
      await forceLogout();
      return Promise.reject(error);
    }
  },
);
