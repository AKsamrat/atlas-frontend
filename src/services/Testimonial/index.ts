import api from "../../lib/api";

// ── Testimonials API ──
export interface TestimonialData {
  id: number;
  name: string;
  role: string;
  stars: number;
  text: string;
  image: string | null;
  sort_order: number;
}

export interface CreateTestimonialPayload {
  name: string;
  role: string;
  stars: number;
  text: string;
  image?: File | null;
  sort_order: number;
}

export const testimonialsApi = {
  getAll: () => api.get<TestimonialData[]>("/testimonials"),

  getOne: (id: number) => api.get<TestimonialData>(`/testimonials/${id}`),

  create: (data: CreateTestimonialPayload) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return api.post<TestimonialData>("/testimonials", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: (id: number, data: Partial<CreateTestimonialPayload>) => {
    const formData = new FormData();
    formData.append("_method", "PUT");
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value === "") {
          // skip empty strings
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return api.post<TestimonialData>(`/testimonials/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: (id: number) => api.delete(`/testimonials/${id}`),
};
