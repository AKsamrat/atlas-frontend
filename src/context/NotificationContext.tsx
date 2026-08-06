import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { notificationsApi, type NotificationPanel, type AppNotification, type NotificationType } from "../services/Notification";

/* ------------------------------------------------------------------ */
/*  Notification System — Entra Global Tech                           */
/*  API-backed via /notifications endpoints                          */
/* ------------------------------------------------------------------ */

// Re-export types so existing imports still work
export type { NotificationPanel, AppNotification, NotificationType };

interface NotificationContextValue {
    /** All notifications across all panels (for global unread count) */
    notifications: AppNotification[];
    /** Global unread count across all panels */
    unreadCount: number;
    /** Send one or more notifications to the API */
    addNotification: (n: Omit<AppNotification, "id" | "is_read" | "timestamp">) => Promise<void>;
    /** Mark a single notification as read */
    markAsRead: (id: string) => Promise<void>;
    /** Mark all notifications in a panel as read */
    markAllAsRead: (panel: NotificationPanel) => Promise<void>;
    /** Clear all notifications in a panel */
    clearAll: (panel: NotificationPanel) => Promise<void>;
    /** Fetch paginated notifications for a panel */
    getNotifications: (panel: NotificationPanel, page?: number, unreadOnly?: boolean) => Promise<{ items: AppNotification[]; total: number; totalPages: number }>;
    /** Get unread count for a panel */
    getUnreadCount: (panel: NotificationPanel) => Promise<number>;
}

/* ── Context ──────────────────────────────────────────────────────── */
const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    // Global unread count (polled periodically)
    const [unreadCount, setUnreadCount] = useState(0);

    /** Poll unread counts every 30s across all panels */
    useEffect(() => {
        let active = true;
        const poll = async () => {
            try {
                const panels: NotificationPanel[] = ["admin", "customer", "employee"];
                const counts = await Promise.all(
                    panels.map((p) => notificationsApi.getUnreadCount(p).then((r) => r.data.count))
                );
                if (active) setUnreadCount(counts.reduce((a, b) => a + b, 0));
            } catch { /* offline / not logged in */ }
        };
        poll();
        const interval = setInterval(poll, 30_000);
        return () => { active = false; clearInterval(interval); };
    }, []);

    /** Send notification(s) to the backend */
    const addNotification = useCallback(
        async (n: Omit<AppNotification, "id" | "is_read" | "timestamp">) => {
            try {
                await notificationsApi.create({
                    panel: n.panel,
                    type: n.type,
                    title: n.title,
                    message: n.message,
                    link: n.link,
                    user_id: n.user_id ?? undefined,
                });
                // Bump global unread count immediately
                setUnreadCount((c) => c + 1);
            } catch (err) {
                console.error("[Notification] Failed to send:", err);
            }
        },
        []
    );

    /** Mark a single notification as read */
    const markAsRead = useCallback(async (id: string) => {
        try {
            await notificationsApi.markAsRead(id);
            setUnreadCount((c) => Math.max(0, c - 1));
        } catch (err) {
            console.error("[Notification] markAsRead failed:", err);
        }
    }, []);

    /** Mark all notifications in a panel as read */
    const markAllAsRead = useCallback(async (panel: NotificationPanel) => {
        try {
            await notificationsApi.markAllAsRead(panel);
            setUnreadCount(0);
        } catch (err) {
            console.error("[Notification] markAllAsRead failed:", err);
        }
    }, []);

    /** Clear all notifications in a panel */
    const clearAll = useCallback(async (panel: NotificationPanel) => {
        try {
            await notificationsApi.clearAll(panel);
        } catch (err) {
            console.error("[Notification] clearAll failed:", err);
        }
    }, []);

    /** Fetch paginated notifications for a panel */
    const getNotifications = useCallback(
        async (panel: NotificationPanel, page = 1, unreadOnly = false) => {
            try {
                const res = await notificationsApi.getAll({ panel, page, per_page: 20, unread: unreadOnly });
                return {
                    items: res.data.data,
                    total: res.data.total,
                    totalPages: res.data.last_page,
                };
            } catch (err) {
                console.error("[Notification] getNotifications failed:", err);
                return { items: [], total: 0, totalPages: 0 };
            }
        },
        []
    );

    /** Get unread count for a specific panel */
    const getUnreadCount = useCallback(async (panel: NotificationPanel) => {
        try {
            const res = await notificationsApi.getUnreadCount(panel);
            return res.data.count;
        } catch {
            return 0;
        }
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications: [],
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearAll,
                getNotifications,
                getUnreadCount,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotifications must be used within a NotificationProvider");
    return ctx;
}
