import api from "../../lib/api";

// ── Customer Panel (Self-Service) API ──

export interface CustomerPanelProfile {
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
    created_at: string;
  };
  order_count: number;
  total_spent: number;
}

export interface CustomerOrderItem {
  id: number;
  order_id: number;
  service_key: string;
  name: string;
  price: string;
  period: string;
  quantity: number;
}

export interface CustomerOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_country: string | null;
  total_amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  payment_status: "unpaid" | "paid" | "refunded";
  payment_method: string | null;
  notes: string | null;
  items: CustomerOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CustomerStats {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_spent: number;
}

export interface PaginatedCustomerOrders {
  data: CustomerOrder[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CustomerOrderParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
}

export const customerPanelApi = {
  // Profile
  getProfile: () => api.get<CustomerPanelProfile>("/customer/profile"),

  updateProfile: (data: FormData) => {
    return api.put("/customer/profile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Orders
  getOrders: (params?: CustomerOrderParams) =>
    api.get<PaginatedCustomerOrders>("/customer/orders", { params }),

  getOrderDetail: (id: number) =>
    api.get<CustomerOrder>(`/customer/orders/${id}`),

  // Stats
  getStats: () => api.get<CustomerStats>("/customer/stats"),
};
