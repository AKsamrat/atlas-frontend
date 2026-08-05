import api from "../../lib/api";

// ── Products API ──

export interface ProductData {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  price: number;
  stock: number;
  min_stock: number;
  sold: number;
  status: "active" | "inactive";
  image: string | null;
  supplier: string | null;
  stock_status: string;
  created_at: string;
  updated_at: string;
}

export interface ProductStats {
  total_products: number;
  active_products: number;
  low_stock: number;
  out_of_stock: number;
  total_stock_value: number;
}

export interface PaginatedProducts {
  data: ProductData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  min_stock?: number;
  status?: "active" | "inactive";
  image?: string;
  supplier?: string;
}

export const productsApi = {
  /** List products (admin sees all) */
  getAll: (params?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) => api.get<PaginatedProducts>("/products", { params }),

  /** Get single product */
  getOne: (id: number) => api.get<ProductData>(`/products/${id}`),

  /** Create product */
  create: (data: CreateProductPayload) =>
    api.post<ProductData>("/products", data),

  /** Update product */
  update: (id: number, data: Partial<CreateProductPayload>) =>
    api.put<ProductData>(`/products/${id}`, data),

  /** Delete product */
  delete: (id: number) => api.delete(`/products/${id}`),

  /** Dashboard stats */
  stats: () => api.get<ProductStats>("/products/stats"),
};
