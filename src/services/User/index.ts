import api from "../../lib/api";

// ── User Self-Service API ──

export interface MyEmployee {
  id: number;
  user_id: number;
  name: string;
  image: string | null;
  email: string;
  phone: string | null;
  department: string;
  role: string;
  salary: number;
  status: "active" | "on_leave" | "inactive";
  join_date: string;
  address: string | null;
  emergency_contact: string | null;
  attendances: MyAttendance[];
  leave_requests: MyLeaveRequest[];
  payroll_records: MyPayroll[];
}

export interface MyAttendance {
  id: number;
  employee_id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  hours: number;
  status: "Present" | "Absent" | "On Leave" | "Half Day" | "Late";
}

export interface MyLeaveRequest {
  id: number;
  employee_id: number;
  type: string;
  from_date: string;
  to_date: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
  reason: string | null;
  created_at: string;
}

export interface MyPayroll {
  id: number;
  employee_id: number;
  account_id: number | null;
  base_salary: number;
  bonus: number;
  deduction: number;
  status: "Paid" | "Pending" | "Processing";
  period: string;
  paid_date: string | null;
  net_salary: number;
  account: { id: number; name: string; type: string } | null;
}

export interface MyDailySubmission {
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
}

export interface PaginatedMyData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const userApi = {
  /** Get the employee profile linked to the logged-in user */
  getProfile: () => api.get<MyEmployee>("/my/profile"),

  /** Get attendance history for the logged-in user */
  getAttendance: (params?: Record<string, string | number>) =>
    api.get<PaginatedMyData<MyAttendance>>("/my/attendance", { params }),

  /** Clock in for today */
  clockIn: () => api.post<MyAttendance>("/my/attendance/clock-in"),

  /** Clock out for today */
  clockOut: () => api.post<MyAttendance>("/my/attendance/clock-out"),

  /** Get leave requests for the logged-in user */
  getLeaves: (params?: Record<string, string | number>) =>
    api.get<PaginatedMyData<MyLeaveRequest>>("/my/leaves", { params }),

  /** Submit a new leave request */
  createLeave: (data: {
    type: string;
    from_date: string;
    to_date: string;
    days: number;
    reason?: string;
  }) => api.post<MyLeaveRequest>("/my/leaves", data),

  /** Get payroll records for the logged-in user */
  getPayroll: (params?: Record<string, string | number>) =>
    api.get<PaginatedMyData<MyPayroll>>("/my/payroll", { params }),

  /** Get my daily submissions */
  getMyDailySubmissions: (params?: Record<string, string | number>) =>
    api.get<PaginatedMyData<MyDailySubmission>>("/my/daily-submissions", {
      params,
    }),

  /** Submit a new daily submission */
  createDailySubmission: (data: {
    topic: string;
    target: number;
    made: number;
    accept: number;
    reject: number;
    folder_link?: string;
    submission_date: string;
  }) => api.post<MyDailySubmission>("/my/daily-submissions", data),
};
