import axios from "axios";

/**
 * Shared axios instance. `withCredentials` is required so the http-only
 * auth cookie is sent on admin requests. Vite's dev proxy forwards /api to
 * the Express server, so no base URL is needed in development; set
 * VITE_API_URL in production if the API is on a different origin.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ?? error?.message ?? "Something went wrong";
    return Promise.reject(new Error(message));
  }
);
