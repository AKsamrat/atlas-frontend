import api from "../../lib/api";

// ── Orders API ──

export interface OrderItemData {
  id?: number;
  order_id?: number;
  service_key: string;
  name: string;
  price: string;
  period: string;
  quantity: number;
}

export interface OrderData {
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
  items: OrderItemData[];
  created_at: string;
  updated_at: string;
}

export interface OrderStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  processing_orders: number;
  completed_orders: number;
}

export interface PaginatedOrders {
  data: OrderData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_country?: string;
  items: {
    service_key: string;
    name: string;
    price: string;
    period: string;
    quantity: number;
  }[];
  payment_method?: string;
  notes?: string;
}

export const ordersApi = {
  /** List orders (admin sees all, user sees own) */
  getAll: (params?: {
    status?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) => api.get<PaginatedOrders>("/orders", { params }),

  /** Get single order */
  getOne: (id: number) => api.get<OrderData>(`/orders/${id}`),

  /** Create order from checkout */
  create: (data: CreateOrderPayload) => api.post<OrderData>("/orders", data),

  /** Update order status / payment (admin) */
  update: (
    id: number,
    data: Partial<
      Pick<OrderData, "status" | "payment_status" | "payment_method" | "notes">
    >,
  ) => api.put<OrderData>(`/orders/${id}`, data),

  /** Delete order (admin) */
  delete: (id: number) => api.delete(`/orders/${id}`),

  /** Dashboard stats */
  stats: () => api.get<OrderStats>("/orders/stats"),
};
