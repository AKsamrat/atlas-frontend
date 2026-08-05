import api from "../../lib/api";

// ── Departments API ──

export interface DepartmentData {
  id: number;
  name: string;
  head: string | null;
  members: number;
  budget: number;
  spent: number;
  performance: number;
  projects: number;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface DepartmentStats {
  total_departments: number;
  total_members: number;
  total_budget: number;
  total_spent: number;
  avg_performance: number;
  total_projects: number;
}

export interface PaginatedDepartments {
  data: DepartmentData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreateDepartmentPayload {
  name: string;
  head?: string;
  members?: number;
  budget?: number;
  spent?: number;
  performance?: number;
  projects?: number;
  color?: string;
}

export const departmentsApi = {
  getAll: (params?: Record<string, string | number>) =>
    api.get<PaginatedDepartments>("/departments", { params }),

  getOne: (id: number) => api.get<DepartmentData>(`/departments/${id}`),

  create: (data: CreateDepartmentPayload) =>
    api.post<DepartmentData>("/departments", data),

  update: (id: number, data: Partial<CreateDepartmentPayload>) =>
    api.put<DepartmentData>(`/departments/${id}`, data),

  delete: (id: number) => api.delete(`/departments/${id}`),

  stats: () => api.get<DepartmentStats>("/departments/stats"),
};
