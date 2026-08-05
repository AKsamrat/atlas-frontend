import api from "../../lib/api";

// ── Leave Requests API ──

export interface LeaveRequestData {
  id: number;
  employee_id: number;
  type: string;
  from_date: string;
  to_date: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
  reason: string | null;
  employee: {
    id: number;
    name: string;
    department: string;
    role: string;
  };
  created_at: string;
  updated_at: string;
}

export interface LeaveStats {
  total_requests: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface PaginatedLeaves {
  data: LeaveRequestData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreateLeavePayload {
  employee_id: number;
  type: string;
  from_date: string;
  to_date: string;
  days: number;
  reason?: string;
}

export const leavesApi = {
  getAll: (params?: Record<string, string | number>) =>
    api.get<PaginatedLeaves>("/leaves", { params }),

  getOne: (id: number) => api.get<LeaveRequestData>(`/leaves/${id}`),

  create: (data: CreateLeavePayload) =>
    api.post<LeaveRequestData>("/leaves", data),

  update: (id: number, data: Partial<{ status: string; reason: string }>) =>
    api.put<LeaveRequestData>(`/leaves/${id}`, data),

  delete: (id: number) => api.delete(`/leaves/${id}`),

  stats: () => api.get<LeaveStats>("/leaves/stats"),
};
