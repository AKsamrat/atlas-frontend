import api from "../../lib/api";

// ── Auth API ──
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "customer";
  avatar?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>("/auth/login", { email, password }),

  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ) =>
    api.post<LoginResponse>("/auth/register", {
      name,
      email,
      password,
      password_confirmation,
    }),

  logout: () => api.post("/auth/logout"),

  profile: () => api.get<AuthUser>("/auth/profile"),

  updateProfile: (data: { name?: string; email?: string; avatar?: File }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return api.post<AuthUser>("/auth/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
