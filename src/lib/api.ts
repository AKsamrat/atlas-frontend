import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor — attach Bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("entra-auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — clear auth on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Always clear stale tokens
      localStorage.removeItem("entra-auth-token");
      localStorage.removeItem("entra-auth-user");

      // Only redirect if the user is currently on a protected route
      // (dashboard, user, or customer panels). Public pages like the
      // landing page, services, and cart should never redirect — the
      // AuthProvider handles setting user=null on its own.
      const path = window.location.pathname;
      const isProtectedRoute =
        path.startsWith("/dashboard") ||
        path.startsWith("/user") ||
        path.startsWith("/customer");

      if (isProtectedRoute && !path.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
