import api from "../../lib/api";

// ── Accounts API ──

export interface AccountData {
  id: number;
  name: string;
  type: "Bank" | "Cash" | "Mobile" | "Card";
  balance: number;
  color: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionData {
  id: number;
  account_id: number;
  description: string;
  category: string | null;
  type: "Income" | "Expense" | "Transfer";
  amount: number;
  reference: string | null;
  date: string;
  account?: AccountData;
  created_at: string;
}

export interface AccountStats {
  total_balance: number;
  total_accounts: number;
  active_accounts: number;
  total_income: number;
  total_expenses: number;
}

export interface PaginatedAccounts {
  data: AccountData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedTransactions {
  data: TransactionData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreateAccountPayload {
  name: string;
  type: "Bank" | "Cash" | "Mobile" | "Card";
  balance?: number;
  color?: string;
  status?: string;
  notes?: string;
}

export interface CreateTransactionPayload {
  account_id: number;
  description: string;
  category?: string;
  type: "Income" | "Expense" | "Transfer";
  amount: number;
  reference?: string;
  date: string;
}

export const accountsApi = {
  getAll: (params?: {
    type?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) => api.get<PaginatedAccounts>("/accounts", { params }),
  getOne: (id: number) => api.get<AccountData>(`/accounts/${id}`),
  create: (data: CreateAccountPayload) =>
    api.post<AccountData>("/accounts", data),
  update: (id: number, data: Partial<CreateAccountPayload>) =>
    api.put<AccountData>(`/accounts/${id}`, data),
  delete: (id: number) => api.delete(`/accounts/${id}`),
  stats: () => api.get<AccountStats>("/accounts/stats"),
};

export const transactionsApi = {
  getAll: (params?: {
    type?: string;
    category?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) => api.get<PaginatedTransactions>("/transactions", { params }),
  getOne: (id: number) => api.get<TransactionData>(`/transactions/${id}`),
  create: (data: CreateTransactionPayload) =>
    api.post<TransactionData>("/transactions", data),
  delete: (id: number) => api.delete(`/transactions/${id}`),
};
