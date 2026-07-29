import api from "../../lib/api";

// ── Service Packages API ──
export interface ServicePackageData {
  id: number;
  service_key: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  highlight: boolean;
  features: string[];
  cta?: string;
  sort_order: number;
}

export type ServicePackagesGrouped = Record<string, ServicePackageData[]>;

export const servicePackagesApi = {
  getAll: () => api.get<ServicePackageData[]>("/service-packages"),

  getGrouped: () =>
    api.get<ServicePackagesGrouped>("/service-packages/grouped"),

  getOne: (id: number) =>
    api.get<ServicePackageData>(`/service-packages/${id}`),

  create: (data: Omit<ServicePackageData, "id">) =>
    api.post<ServicePackageData>("/service-packages", data),

  update: (id: number, data: Partial<ServicePackageData>) =>
    api.put<ServicePackageData>(`/service-packages/${id}`, data),

  delete: (id: number) => api.delete(`/service-packages/${id}`),
};
