import api from "../../lib/api";

// ── Payroll API ──

export interface PayrollData {
  id: number;
  employee_id: number;
  account_id: number | null;
  base_salary: number;
  bonus: number;
  deduction: number;
  status: "Paid" | "Pending" | "Processing";
  period: string;
  paid_date: string | null;
  net_salary: number;
  employee: {
    id: number;
    name: string;
    department: string;
    role: string;
  };
  account: {
    id: number;
    name: string;
    type: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface PayrollStats {
  total_records: number;
  total_paid: number;
  total_pending: number;
  total_bonus: number;
  total_deduction: number;
  paid_count: number;
  pending_count: number;
}

export interface PaginatedPayroll {
  data: PayrollData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreatePayrollPayload {
  employee_id: number;
  account_id?: number | null;
  base_salary: number;
  bonus?: number;
  deduction?: number;
  status?: "Paid" | "Pending" | "Processing";
  period: string;
  paid_date?: string;
}

export const payrollApi = {
  getAll: (params?: Record<string, string | number>) =>
    api.get<PaginatedPayroll>("/payroll", { params }),

  getOne: (id: number) => api.get<PayrollData>(`/payroll/${id}`),

  create: (data: CreatePayrollPayload) =>
    api.post<PayrollData>("/payroll", data),

  update: (id: number, data: Partial<CreatePayrollPayload>) =>
    api.put<PayrollData>(`/payroll/${id}`, data),

  delete: (id: number) => api.delete(`/payroll/${id}`),

  stats: () => api.get<PayrollStats>("/payroll/stats"),
};
