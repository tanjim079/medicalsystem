import { useAuthStore } from '../store/useAuthStore';

let refreshPromise: Promise<string | null> | null = null;
let isRedirecting = false;

const refreshAccessToken = async (): Promise<string | null> => {
  const storedAuth = localStorage.getItem('auth-storage');
  if (!storedAuth) return null;

  let refreshToken: string | null = null;
  try {
    const parsed = JSON.parse(storedAuth);
    refreshToken = parsed.state?.refreshToken;
  } catch (e) {
    console.error('Error parsing auth storage for refresh', e);
    return null;
  }

  if (!refreshToken) return null;

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Refresh failed');
    }

    const data = await response.json();
    const newAccessToken = data.session?.access_token;
    const newRefreshToken = data.session?.refresh_token || refreshToken;

    if (newAccessToken) {
      useAuthStore.getState().setToken(newAccessToken, newRefreshToken);
      return newAccessToken;
    }
  } catch (err) {
    console.warn('Session refresh failed:', err);
  }

  return null;
};

export const fetchAuth = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const getStoredToken = () => {
    const storedAuth = localStorage.getItem('auth-storage');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        return parsed.state?.token || null;
      } catch (e) {
        console.error('Error parsing auth token', e);
      }
    }
    return null;
  };

  const token = getStoredToken();
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(input, { ...init, headers });

  const urlString =
    typeof input === 'string'
      ? input
      : input instanceof URL
      ? input.toString()
      : (input as Request).url;

  const isAuthRoute =
    urlString.includes('/auth/login') ||
    urlString.includes('/auth/signup') ||
    urlString.includes('/auth/refresh');

  if (response.status === 401 && !isAuthRoute) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;

    if (newToken) {
      const retryHeaders = new Headers(init?.headers);
      retryHeaders.set('Authorization', `Bearer ${newToken}`);
      return fetch(input, { ...init, headers: retryHeaders });
    }

    if (!isRedirecting) {
      isRedirecting = true;
      console.warn('Unauthorized or expired session - clearing storage and redirecting to login');
      useAuthStore.getState().logout();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
  }

  return response;
};
