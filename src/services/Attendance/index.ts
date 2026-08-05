import api from "../../lib/api";

// ── Attendance API ──

export interface AttendanceData {
  id: number;
  employee_id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  hours: number;
  status: "Present" | "Absent" | "On Leave" | "Half Day" | "Late";
  employee: {
    id: number;
    name: string;
    department: string;
    role: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AttendanceStats {
  total_employees: number;
  present: number;
  absent: number;
  late: number;
  half_day: number;
  on_leave: number;
  attendance_rate: number;
}

export interface PaginatedAttendance {
  data: AttendanceData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreateAttendancePayload {
  employee_id: number;
  date: string;
  check_in?: string;
  check_out?: string;
  hours?: number;
  status?: "Present" | "Absent" | "On Leave" | "Half Day" | "Late";
}

export const attendanceApi = {
  getAll: (params?: Record<string, string | number>) =>
    api.get<PaginatedAttendance>("/attendance", { params }),

  getOne: (id: number) => api.get<AttendanceData>(`/attendance/${id}`),

  create: (data: CreateAttendancePayload) =>
    api.post<AttendanceData>("/attendance", data),

  update: (id: number, data: Partial<CreateAttendancePayload>) =>
    api.put<AttendanceData>(`/attendance/${id}`, data),

  delete: (id: number) => api.delete(`/attendance/${id}`),

  stats: (params?: { date?: string }) =>
    api.get<AttendanceStats>("/attendance/stats", { params }),
};
