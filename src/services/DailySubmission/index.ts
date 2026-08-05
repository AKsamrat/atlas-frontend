import api from "../../lib/api";

export interface DailySubmissionData {
  id: number;
  employee_id: number;
  topic: string;
  target: number;
  made: number;
  accept: number;
  reject: number;
  folder_link: string | null;
  remark: string | null;
  status: "Pending" | "Approved" | "Rejected";
  submission_date: string;
  created_at: string;
  employee: {
    id: number;
    name: string;
    email: string;
    department: string;
    role: string;
    image: string | null;
  } | null;
}

export interface DailySubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface PaginatedDailySubmissions {
  data: DailySubmissionData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const dailySubmissionApi = {
  /** Admin: Get all daily submissions with filters */
  getAll: (params?: Record<string, string | number>) =>
    api.get<PaginatedDailySubmissions>("/daily-submissions", { params }),

  /** Admin: Get stats */
  getStats: () => api.get<DailySubmissionStats>("/daily-submissions/stats"),

  /** Admin: Update a submission (approve/reject with remark) */
  update: (
    id: number,
    data: {
      accept: number;
      reject: number;
      remark?: string;
      status: "Approved" | "Rejected" | "Pending";
    },
  ) => api.put<DailySubmissionData>(`/daily-submissions/${id}`, data),

  /** Admin: Delete a submission */
  delete: (id: number) => api.delete(`/daily-submissions/${id}`),
};
