import axios from 'axios';

// Get the API URL from environment variables, fallback to localhost for dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach the Auth token
api.interceptors.request.use((config) => {
  // Zustand persist stores data in localStorage under 'auth-storage'
  const storedAuth = localStorage.getItem('auth-storage');
  if (storedAuth) {
    try {
      const parsed = JSON.parse(storedAuth);
      const token = parsed.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error parsing auth token', e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage and redirect to login if unauthorized
      console.warn('Unauthorized request - redirecting to login');
      // If you are using useAuthStore, it might be better to call useAuthStore.getState().logout()
      // localStorage.removeItem('auth-storage');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
