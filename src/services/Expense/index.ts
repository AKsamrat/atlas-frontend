import api from "../../lib/api";

// ── Expenses API ──

export interface ExpenseData {
  id: number;
  description: string;
  category: string;
  amount: number;
  payment_method: string | null;
  status: "Approved" | "Pending" | "Rejected";
  receipt: boolean;
  submitted_by: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseStats {
  total_expenses: number;
  approved_total: number;
  pending_total: number;
  approved_count: number;
  pending_count: number;
  total_count: number;
}

export interface PaginatedExpenses {
  data: ExpenseData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreateExpensePayload {
  description: string;
  category: string;
  amount: number;
  payment_method?: string;
  status?: "Approved" | "Pending" | "Rejected";
  receipt?: boolean;
  submitted_by?: string;
  date: string;
}

export const expensesApi = {
  getAll: (params?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) => api.get<PaginatedExpenses>("/expenses", { params }),
  getOne: (id: number) => api.get<ExpenseData>(`/expenses/${id}`),
  create: (data: CreateExpensePayload) =>
    api.post<ExpenseData>("/expenses", data),
  update: (id: number, data: Partial<CreateExpensePayload>) =>
    api.put<ExpenseData>(`/expenses/${id}`, data),
  delete: (id: number) => api.delete(`/expenses/${id}`),
  stats: () => api.get<ExpenseStats>("/expenses/stats"),
};
