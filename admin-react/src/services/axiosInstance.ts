import axios from 'axios';
import type { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError } from 'axios';
import type { RefreshTokenResponse } from '../features/auth/authTypes';

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

/**
 * Axios instance pre-configured with base URL and default headers.
 * Centralizes API connection settings for the entire application.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

/**
 * Processes the queue of failed requests that occurred while token was being refreshed.
 * @param error - Error encountered if refresh fails.
 * @param token - New access token if refresh succeeds.
 */
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

/**
 * Clears authentication data and redirects the user to the login page.
 * Triggered upon session expiration or invalid refresh tokens.
 */
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  // Using globalThis for better compatibility and to satisfy some linting rules
  globalThis.location.href = '/login';
};

/**
 * Global Request Interceptor:
 * Attaches the Bearer token to every outgoing request if it exists in local storage.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    throw error;
  }
);

/**
 * Global Response Interceptor:
 * Handles responses and implements silent token refresh logic for 401 Unauthorized errors.
 * Queues concurrent requests during refresh to prevent multiple refresh calls.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!originalRequest) {
      throw error;
    }

    // Check if error is 401 and request hasn't been retried yet (excluding auth routes)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      // If refresh is already in progress, queue the request
      if (isRefreshing) {
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        } catch (err) {
          console.log(err);
          throw err;
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      // Logout if no refresh token is available
      if (!refreshToken) {
        isRefreshing = false;
        processQueue(error, null);
        handleLogout();
        throw error;
      }

      try {
        // Attempt to refresh the access token
        const response = await axios.post<RefreshTokenResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { data } = response;

        if (data.success) {
          // Store new tokens and retry original request
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          }

          processQueue(null, data.accessToken);
          return apiClient(originalRequest);
        }

        processQueue(error, null);
        handleLogout();
        throw error;
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);

export default apiClient;
