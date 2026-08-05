import api from "../../lib/api";

// ── Salary API ──

export interface SalaryData {
  id: number;
  employee: string;
  department: string;
  base_salary: number;
  allowances: number;
  deductions: number;
  bonus: number;
  status: "Paid" | "Pending" | "Processing";
  period: string;
  paid_date: string | null;
  bank_account: string | null;
  net_salary: number;
  created_at: string;
  updated_at: string;
}

export interface SalaryStats {
  total_paid: number;
  total_pending: number;
  total_allowances: number;
  total_deductions: number;
  total_bonus: number;
  total_records: number;
  paid_count: number;
  pending_count: number;
}

export interface PaginatedSalary {
  data: SalaryData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreateSalaryPayload {
  employee: string;
  department: string;
  base_salary: number;
  allowances?: number;
  deductions?: number;
  bonus?: number;
  status?: "Paid" | "Pending" | "Processing";
  period: string;
  paid_date?: string;
  bank_account?: string;
}

export const salaryApi = {
  getAll: (params?: {
    status?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) => api.get<PaginatedSalary>("/salary", { params }),
  getOne: (id: number) => api.get<SalaryData>(`/salary/${id}`),
  create: (data: CreateSalaryPayload) => api.post<SalaryData>("/salary", data),
  update: (id: number, data: Partial<CreateSalaryPayload>) =>
    api.put<SalaryData>(`/salary/${id}`, data),
  delete: (id: number) => api.delete(`/salary/${id}`),
  stats: () => api.get<SalaryStats>("/salary/stats"),
};
