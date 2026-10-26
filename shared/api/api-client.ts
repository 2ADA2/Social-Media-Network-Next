import axios from 'axios';
import { store } from '@/app/store/user-store';
import { logout } from '@/entities/user/model/user-slice';
import { refreshRequest } from '@/features/auth/refresh';
import { fetchLogout } from "@/features/auth/logout.ts";

export const apiClient = axios.create({
  baseURL: '/',
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

const getNewToken = (): Promise<string> => {
  refreshPromise ??= refreshRequest()
    .then((data) => {
      localStorage.setItem('token', data.token);
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
    console.error('Logout request failed:', error);
  } finally {
    localStorage.removeItem('token');
    store.dispatch(logout());
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (original._retry) {
      forceLogout();
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const newToken = await getNewToken();
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch {
      forceLogout();
      return Promise.reject(error);
    }
  },
);
