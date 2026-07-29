import api from "../../lib/api";

// ── Testimonials API ──
export interface TestimonialData {
  id: number;
  name: string;
  role: string;
  stars: number;
  text: string;
  sort_order: number;
}

export const testimonialsApi = {
  getAll: () => api.get<TestimonialData[]>("/testimonials"),

  getOne: (id: number) => api.get<TestimonialData>(`/testimonials/${id}`),

  create: (data: Omit<TestimonialData, "id">) =>
    api.post<TestimonialData>("/testimonials", data),

  update: (id: number, data: Partial<TestimonialData>) =>
    api.put<TestimonialData>(`/testimonials/${id}`, data),

  delete: (id: number) => api.delete(`/testimonials/${id}`),
};
