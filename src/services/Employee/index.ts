import api from "../../lib/api";

// ── Employees API ──

export interface EmployeeData {
  id: number;
  user_id: number | null;
  name: string;
  image: string | null;
  email: string;
  phone: string | null;
  department: string;
  role: string;
  salary: number;
  status: "active" | "on_leave" | "inactive";
  join_date: string;
  address: string | null;
  emergency_contact: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmployeeStats {
  total_employees: number;
  active_employees: number;
  on_leave: number;
  departments: number;
  avg_salary: number;
  total_payroll: number;
}

export interface PaginatedEmployees {
  data: EmployeeData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreateEmployeePayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  department: string;
  role: string;
  salary: number;
  status?: "active" | "on_leave" | "inactive";
  join_date?: string;
  address?: string;
  emergency_contact?: string;
  image?: File | null;
}

export const employeesApi = {
  getAll: (params?: Record<string, string | number>) =>
    api.get<PaginatedEmployees>("/employees", { params }),

  getOne: (id: number) => api.get<EmployeeData>(`/employees/${id}`),

  create: (data: CreateEmployeePayload) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return api.post<{
      employee: EmployeeData;
      credentials: { email: string; password: string } | null;
    }>("/employees", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: (id: number, data: Partial<CreateEmployeePayload>) => {
    const formData = new FormData();
    formData.append("_method", "PUT");
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value === "") {
          // skip empty strings for optional fields
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return api.post<EmployeeData>(`/employees/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: (id: number) => api.delete(`/employees/${id}`),

  stats: () => api.get<EmployeeStats>("/employees/stats"),
};
