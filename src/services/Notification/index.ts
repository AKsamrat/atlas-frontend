import api from "../../lib/api";

// ── Notifications API ──

export type NotificationPanel = "admin" | "customer" | "employee";

export type NotificationType =
  | "order_created"
  | "order_processing"
  | "order_completed"
  | "order_cancelled"
  | "salary_created"
  | "salary_paid"
  | "expense_created"
  | "expense_approved"
  | "expense_rejected"
  | "employee_added"
  | "attendance_marked"
  | "leave_requested"
  | "leave_approved"
  | "leave_rejected"
  | "daily_submission"
  | "customer_message"
  | "system"
  | "info";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  panel: NotificationPanel;
  is_read: boolean;
  timestamp: number;
  link?: string;
  user_id?: number | null;
}

export interface CreateNotificationPayload {
  panel: NotificationPanel;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  user_id?: number | null;
}

export interface PaginatedNotifications {
  data: AppNotification[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface NotificationParams {
  panel: NotificationPanel;
  unread?: boolean;
  page?: number;
  per_page?: number;
}

/** Normalize backend row → frontend AppNotification */
function normalize(
  n: Record<string, unknown> | AppNotification,
): AppNotification {
  // Already normalized — pass through
  if (
    typeof n.id === "string" &&
    "is_read" in n &&
    typeof (n as AppNotification).is_read === "boolean"
  )
    return n as AppNotification;
  // At this point n is a raw backend record
  const r = n as Record<string, unknown>;
  return {
    id: String(r.id),
    type: r.type as string as NotificationType,
    title: r.title as string,
    message: r.message as string,
    panel: r.panel as NotificationPanel,
    is_read: Boolean(r.is_read),
    timestamp: r.created_at
      ? new Date(r.created_at as string).getTime()
      : Date.now(),
    link: (r.link as string) || undefined,
    user_id: (r.user_id as number) ?? null,
  };
}

export const notificationsApi = {
  /** List notifications (paginated) */
  getAll: (params: NotificationParams) =>
    api
      .get<PaginatedNotifications>("/notifications", { params })
      .then((res) => ({
        ...res,
        data: {
          ...res.data,
          data: res.data.data.map(normalize),
        },
      })),

  /** Get unread count for a panel */
  getUnreadCount: (panel: NotificationPanel) =>
    api.get<{ count: number }>("/notifications/unread-count", {
      params: { panel },
    }),

  /** Create a single notification */
  create: (data: CreateNotificationPayload) =>
    api.post<AppNotification>("/notifications", data),

  /** Create multiple notifications at once */
  createBatch: (notifications: CreateNotificationPayload[]) =>
    api.post<{ created: number }>("/notifications/batch", { notifications }),

  /** Mark one notification as read */
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),

  /** Mark all notifications in a panel as read */
  markAllAsRead: (panel: NotificationPanel) =>
    api.post("/notifications/mark-all-read", null, { params: { panel } }),

  /** Clear all notifications in a panel */
  clearAll: (panel: NotificationPanel) =>
    api.delete("/notifications", { params: { panel } }),
};
