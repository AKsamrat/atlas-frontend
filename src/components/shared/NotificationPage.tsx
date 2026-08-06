import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Trash2, Filter, ArrowLeft, ExternalLink } from "lucide-react";
import {
    useNotifications,
    type AppNotification,
    type NotificationPanel,
} from "../../context/NotificationContext";

/* ── Notification type → icon / color mapping ──────────────────────── */
const typeStyles: Record<string, { icon: string; color: string }> = {
    order_created: { icon: "🛒", color: "text-blue-500" },
    order_processing: { icon: "⚙️", color: "text-yellow-500" },
    order_completed: { icon: "✅", color: "text-green-500" },
    order_cancelled: { icon: "❌", color: "text-red-500" },
    salary_created: { icon: "💰", color: "text-purple-500" },
    salary_paid: { icon: "💸", color: "text-green-500" },
    expense_created: { icon: "📝", color: "text-orange-500" },
    expense_approved: { icon: "👍", color: "text-green-500" },
    expense_rejected: { icon: "👎", color: "text-red-500" },
    employee_added: { icon: "👤", color: "text-blue-500" },
    attendance_marked: { icon: "📋", color: "text-teal-500" },
    leave_requested: { icon: "📅", color: "text-yellow-500" },
    leave_approved: { icon: "✅", color: "text-green-500" },
    leave_rejected: { icon: "❌", color: "text-red-500" },
    daily_submission: { icon: "📄", color: "text-indigo-500" },
    customer_message: { icon: "💬", color: "text-cyan-500" },
    system: { icon: "🔔", color: "text-gray-500" },
    info: { icon: "ℹ️", color: "text-blue-500" },
};

function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}

/* ── Shared Notification Page ──────────────────────────────────────── */
interface NotificationPageProps {
    panel: NotificationPanel;
}

export default function NotificationPage({ panel }: NotificationPageProps) {
    const navigate = useNavigate();
    const { getNotifications, getUnreadCount, markAsRead, markAllAsRead, clearAll } =
        useNotifications();

    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [selected, setSelected] = useState<AppNotification | null>(null);
    const [items, setItems] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchNotifications = useCallback(
        async (p: number, unreadOnly: boolean) => {
            setLoading(true);
            try {
                const res = await getNotifications(panel, p, unreadOnly);
                setItems(res.items);
                setTotalPages(res.totalPages);
                setTotal(res.total);
            } finally {
                setLoading(false);
            }
        },
        [panel, getNotifications]
    );

    const fetchUnreadCount = useCallback(async () => {
        const count = await getUnreadCount(panel);
        setUnreadCount(count);
    }, [panel, getUnreadCount]);

    useEffect(() => {
        fetchNotifications(page, filter === "unread");
        fetchUnreadCount();
    }, [page, filter, fetchNotifications, fetchUnreadCount]);

    const handleClick = async (n: AppNotification) => {
        await markAsRead(n.id);
        setItems((prev) => prev.map((item) => (item.id === n.id ? { ...item, is_read: true } : item)));
        setUnreadCount((c) => Math.max(0, c - 1));
        setSelected({ ...n, is_read: true });
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead(panel);
        setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
    };

    const handleClearAll = async () => {
        await clearAll(panel);
        setItems([]);
        setUnreadCount(0);
    };

    /* ── Detail view ──────────────────────────────────────────── */
    if (selected) {
        const style = typeStyles[selected.type] || typeStyles.info;
        return (
            <div className="space-y-6">
                <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-[#596887] dark:text-[#8b95ad] hover:text-[#1E56E0] dark:hover:text-[#45CFFF] transition-colors">
                    <ArrowLeft size={16} /> Back to notifications
                </button>
                <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#0F1E3D] p-8">
                    <div className="flex items-start gap-4">
                        <span className="text-3xl shrink-0">{style.icon}</span>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-[#45CFFF] bg-[#45CFFF]/10 px-2 py-0.5 rounded-full">{selected.type.replace(/_/g, " ")}</span>
                                {!selected.is_read && <span className="h-2 w-2 rounded-full bg-[#45CFFF]" />}
                            </div>
                            <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white mt-2">{selected.title}</h2>
                            <p className="text-sm text-[#596887] dark:text-[#B9C7E0] mt-3 leading-relaxed">{selected.message}</p>
                            <p className="text-xs text-[#8b95ad]/60 mt-4">{new Date(selected.timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                    {selected.link && (
                        <div className="mt-6 pt-4 border-t border-[#E2E8F0]/60 dark:border-[#2D3748]/60">
                            <button onClick={() => navigate(selected.link!)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#45CFFF]/10 text-[#45CFFF] text-sm font-medium hover:bg-[#45CFFF]/20 transition-colors">
                                <ExternalLink size={14} /> Go to related page
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* ── List view ────────────────────────────────────────────── */
    const notifications = filter === "unread" ? items.filter((n) => !n.is_read) : items;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">
                        Notifications
                    </h1>
                    <p className="text-sm text-[#718096] dark:text-[#8b95ad] mt-1">
                        {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Filter */}
                    <div className="flex items-center gap-1 rounded-xl bg-[#F1F3F8] dark:bg-[#0B1730] p-1">
                        <button
                            onClick={() => { setFilter("all"); setPage(1); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === "all"
                                ? "bg-white dark:bg-[#1E56E0] text-[#1a1f36] dark:text-white shadow-sm"
                                : "text-[#596887] dark:text-[#8b95ad] hover:text-[#1a1f36] dark:hover:text-white"
                                }`}
                        >
                            <Filter size={12} /> All
                        </button>
                        <button
                            onClick={() => { setFilter("unread"); setPage(1); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === "unread"
                                ? "bg-white dark:bg-[#1E56E0] text-[#1a1f36] dark:text-white shadow-sm"
                                : "text-[#596887] dark:text-[#8b95ad] hover:text-[#1a1f36] dark:hover:text-white"
                                }`}
                        >
                            <Bell size={12} /> Unread
                        </button>
                    </div>

                    {/* Actions */}
                    {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#45CFFF] bg-[#45CFFF]/10 hover:bg-[#45CFFF]/20 transition-colors">
                            <Check size={12} /> Mark all read
                        </button>
                    )}
                    {items.length > 0 && (
                        <button onClick={handleClearAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                            <Trash2 size={12} /> Clear all
                        </button>
                    )}
                </div>
            </div>

            {/* Notification list */}
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#0F1E3D] overflow-hidden">
                {loading ? (
                    <div className="py-16 text-center">
                        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#45CFFF] border-t-transparent" />
                        <p className="text-sm text-[#8b95ad] mt-3">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="py-16 text-center">
                        <Bell size={32} className="mx-auto text-[#8b95ad]/30 mb-3" />
                        <p className="text-sm font-medium text-[#8b95ad]">
                            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                        </p>
                        <p className="text-xs text-[#8b95ad]/60 mt-1">
                            {filter === "unread" ? "You're all caught up!" : "Notifications will appear here"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#E2E8F0]/60 dark:divide-[#2D3748]/60">
                        {notifications.map((n) => {
                            const style = typeStyles[n.type] || typeStyles.info;
                            return (
                                <button
                                    key={n.id}
                                    onClick={() => handleClick(n)}
                                    className={`flex items-start gap-4 w-full px-6 py-4 text-left hover:bg-[#f8f9fc] dark:hover:bg-white/[0.03] transition-colors ${!n.is_read ? "bg-[#45CFFF]/[0.03]" : ""}`}
                                >
                                    <span className="mt-0.5 text-xl shrink-0">{style.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm leading-snug ${!n.is_read ? "font-semibold text-[#1a1f36] dark:text-white" : "text-[#596887] dark:text-[#B9C7E0]"}`}>
                                                {n.title}
                                            </p>
                                            {!n.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-[#45CFFF]" />}
                                        </div>
                                        <p className="text-xs text-[#8b95ad] mt-1 line-clamp-2">{n.message}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <p className="text-[10px] text-[#8b95ad]/60">{timeAgo(n.timestamp)}</p>
                                            <span className="text-[9px] font-mono uppercase tracking-wider text-[#45CFFF]/60 bg-[#45CFFF]/5 px-1.5 py-0.5 rounded">
                                                {n.type.replace(/_/g, " ")}
                                            </span>
                                        </div>
                                    </div>
                                    {n.link && (
                                        <span className="mt-1 text-[#8b95ad]/40">
                                            <ExternalLink size={14} />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E2E8F0] dark:border-[#2D3748] disabled:opacity-40 hover:bg-[#f8f9fc] dark:hover:bg-white/[0.03] transition-colors text-[#596887] dark:text-[#8b95ad]"
                    >
                        Previous
                    </button>
                    <span className="text-xs text-[#8b95ad]">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E2E8F0] dark:border-[#2D3748] disabled:opacity-40 hover:bg-[#f8f9fc] dark:hover:bg-white/[0.03] transition-colors text-[#596887] dark:text-[#8b95ad]"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Total count */}
            <p className="text-center text-[11px] text-[#8b95ad]/50">
                {total} notification{total !== 1 ? "s" : ""} total
            </p>
        </div>
    );
}
