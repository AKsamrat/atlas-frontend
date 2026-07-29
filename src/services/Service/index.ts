import api from "../../lib/api";

// ── Services API (What We Do) ──
export interface ServiceItem {
  title: string;
}

export interface ServiceData {
  id: number;
  tag: string;
  title: string;
  description: string;
  icon_name: string;
  items: ServiceItem[];
  sort_order: number;
}

export const servicesApi = {
  getAll: () => api.get<ServiceData[]>("/services"),

  getOne: (id: number) => api.get<ServiceData>(`/services/${id}`),

  create: (data: Omit<ServiceData, "id">) =>
    api.post<ServiceData>("/services", data),

  update: (id: number, data: Partial<ServiceData>) =>
    api.put<ServiceData>(`/services/${id}`, data),

  delete: (id: number) => api.delete(`/services/${id}`),
};
