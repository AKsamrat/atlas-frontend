import api from "../../lib/api";

// ── Users API (Admin Management) ──

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: "admin" | "staff" | "user";
  phone: string | null;
  avatar: string | null;
  status: "active" | "inactive" | "suspended";
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  admins: number;
  new_this_month: number;
}

export interface PaginatedUsers {
  data: UserData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "staff" | "user";
  phone?: string;
  status?: "active" | "inactive" | "suspended";
}

export const usersApi = {
  /** List users (admin) */
  getAll: (params?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) => api.get<PaginatedUsers>("/users", { params }),

  /** Get single user */
  getOne: (id: number) => api.get<UserData>(`/users/${id}`),

  /** Create user */
  create: (data: CreateUserPayload) => api.post<UserData>("/users", data),

  /** Update user */
  update: (id: number, data: Partial<CreateUserPayload>) =>
    api.put<UserData>(`/users/${id}`, data),

  /** Delete user */
  delete: (id: number) => api.delete(`/users/${id}`),

  /** Dashboard stats */
  stats: () => api.get<UserStats>("/users/stats"),
};
