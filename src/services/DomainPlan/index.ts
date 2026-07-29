import api from "../../lib/api";

// ── Domain Plans API ──
export interface DomainPlanData {
  id: number;
  name: string;
  price: string;
  period: string;
  tagline: string;
  highlight: boolean;
  features: string[];
  cta?: string;
  sort_order: number;
}

export const domainPlansApi = {
  getAll: () => api.get<DomainPlanData[]>("/domain-plans"),

  getOne: (id: number) => api.get<DomainPlanData>(`/domain-plans/${id}`),

  create: (data: Omit<DomainPlanData, "id">) =>
    api.post<DomainPlanData>("/domain-plans", data),

  update: (id: number, data: Partial<DomainPlanData>) =>
    api.put<DomainPlanData>(`/domain-plans/${id}`, data),

  delete: (id: number) => api.delete(`/domain-plans/${id}`),
};
