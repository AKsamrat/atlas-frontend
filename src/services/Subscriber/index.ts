import api from "../../lib/api";

// ── Subscribers API ──
export interface SubscriberData {
  id: number;
  email: string;
  name: string | null;
  status: "active" | "unsubscribed";
  created_at: string;
  updated_at: string;
}

export interface SubscriberStats {
  total: number;
  active: number;
  unsubscribed: number;
  this_month: number;
}

export interface PaginatedSubscribers {
  data: SubscriberData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface SubscriberParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
}

export const subscribersApi = {
  // Public: Subscribe via footer
  subscribe: (email: string, name?: string) =>
    api.post<{ message: string }>("/subscribe", { email, name }),

  // Admin: List all subscribers
  getAll: (params?: SubscriberParams) =>
    api.get<PaginatedSubscribers>("/subscribers", { params }),

  // Admin: Get stats
  getStats: () => api.get<SubscriberStats>("/subscribers/stats"),

  // Admin: Update subscriber status
  update: (id: number, data: Partial<SubscriberData>) =>
    api.put<SubscriberData>(`/subscribers/${id}`, data),

  // Admin: Delete subscriber
  delete: (id: number) => api.delete(`/subscribers/${id}`),
};
