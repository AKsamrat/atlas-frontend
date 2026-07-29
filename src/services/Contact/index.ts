import api from "../../lib/api";

// ── Contact Info API (Singleton) ──
export interface ContactInfoData {
  id: number;
  phone: string;
  email: string;
  address: string;
  tagline: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  social_twitter: string;
}

export const contactApi = {
  get: () => api.get<ContactInfoData>("/contact"),

  update: (data: Partial<ContactInfoData>) =>
    api.put<ContactInfoData>("/contact", data),
};
