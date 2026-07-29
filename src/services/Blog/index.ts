import api from "../../lib/api";

// ── Blog API ──
export interface BlogData {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  status: "draft" | "published";
  author_id: number;
  author?: { id: number; name: string; email: string };
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedBlogs {
  data: BlogData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const blogsApi = {
  getAll: (params?: { status?: string; page?: number; search?: string }) =>
    api.get<PaginatedBlogs>("/blogs", { params }),

  getBySlug: (slug: string) => api.get<BlogData>(`/blogs/${slug}`),

  getOne: (id: number) => api.get<BlogData>(`/blogs/${id}/edit`),

  create: (data: {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    image?: string;
    status?: string;
  }) => api.post<BlogData>("/blogs", data),

  update: (id: number, data: Partial<BlogData>) =>
    api.put<BlogData>(`/blogs/${id}`, data),

  delete: (id: number) => api.delete(`/blogs/${id}`),
};

// Legacy exports for backward compatibility
export const createBlog = (data: FormData) => api.post("/blogs", data);
export const getAllBlogs = (
  search?: string,
  status?: string,
  page?: number,
  perPage?: number,
) => api.get("/blogs", { params: { search, status, page, per_page: perPage } });
export const getSingleBlog = (id: string) => api.get(`/blogs/${id}/edit`);
export const updateBlog = (id: number, data: FormData) =>
  api.post(`/blogs/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateBlogStatus = (id: number, status: string) =>
  api.patch(`/blogs/${id}`, { status });
export const deleteBlog = (id: number) => api.delete(`/blogs/${id}`);
