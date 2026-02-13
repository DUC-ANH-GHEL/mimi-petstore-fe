import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const getAdminToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');

const clearAdminToken = () => {
  localStorage.removeItem('adminToken');
  sessionStorage.removeItem('adminToken');
};

const isLoginRequest = (url?: string) => {
  if (!url) return false;
  return url.includes('/users/login');
};

const redirectToAdminLogin = () => {
  try {
    const w = window as any;
    if (w.__mimiRedirectingToLogin) return;
    w.__mimiRedirectingToLogin = true;

    const current = `${window.location.pathname}${window.location.search}`;
    const alreadyOnLogin = window.location.pathname.startsWith('/admin/login');
    if (alreadyOnLogin) return;

    window.location.href = `/admin/login?redirect=${encodeURIComponent(current)}`;
  } catch {
    // no-op
  }
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAdminToken();

  if (token) {
    const headers: any = (config.headers ??= {});
    const existing = headers.Authorization ?? headers.authorization;
    if (!existing) headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url as string | undefined;

    if (status === 401 && !isLoginRequest(url)) {
      // Only treat as session-expired when a token exists OR user is on admin routes.
      const hasToken = Boolean(getAdminToken());
      const onAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      if (hasToken || onAdmin) {
        clearAdminToken();
        redirectToAdminLogin();
      }
    }

    return Promise.reject(error);
  },
);
