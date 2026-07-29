import api from "../../lib/api";

// ── Partners API (Trusted By) ──
export interface PartnerData {
  id: number;
  name: string;
  icon_name: string;
  color: string;
  sort_order: number;
}

export const partnersApi = {
  getAll: () => api.get<PartnerData[]>("/partners"),

  getOne: (id: number) => api.get<PartnerData>(`/partners/${id}`),

  create: (data: Omit<PartnerData, "id">) =>
    api.post<PartnerData>("/partners", data),

  update: (id: number, data: Partial<PartnerData>) =>
    api.put<PartnerData>(`/partners/${id}`, data),

  delete: (id: number) => api.delete(`/partners/${id}`),
};
