import api from "../../lib/api";

// ── Customers API ──

export interface CustomerData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  status: "active" | "vip" | "inactive";
  total_orders: number;
  total_spent: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerStats {
  total_customers: number;
  active_customers: number;
  vip_customers: number;
  new_this_month: number;
  avg_lifetime_value: number;
}

export interface PaginatedCustomers {
  data: CustomerData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreateCustomerPayload {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  status?: "active" | "vip" | "inactive";
  notes?: string;
}

export const customersApi = {
  /** List customers */
  getAll: (params?: {
    status?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) => api.get<PaginatedCustomers>("/customers", { params }),

  /** Get single customer */
  getOne: (id: number) => api.get<CustomerData>(`/customers/${id}`),

  /** Create customer */
  create: (data: CreateCustomerPayload) =>
    api.post<CustomerData>("/customers", data),

  /** Update customer */
  update: (id: number, data: Partial<CreateCustomerPayload>) =>
    api.put<CustomerData>(`/customers/${id}`, data),

  /** Delete customer */
  delete: (id: number) => api.delete(`/customers/${id}`),

  /** Dashboard stats */
  stats: () => api.get<CustomerStats>("/customers/stats"),
};
