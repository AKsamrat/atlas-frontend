import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Trash2, X } from "lucide-react";
import {
    useNotifications,
    type NotificationPanel,
    type AppNotification,
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
    return `${days}d ago`;
}

/* ── Component ────────────────────────────────────────────────────── */
interface NotificationBellProps {
    panel: NotificationPanel;
}

export default function NotificationBell({ panel }: NotificationBellProps) {
    const navigate = useNavigate();
    const { unreadCount, markAsRead, markAllAsRead, clearAll, getNotifications } =
        useNotifications();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (!open) return;
        setLoading(true);
        getNotifications(panel)
            .then((res) => setItems(res.items))
            .finally(() => setLoading(false));
    }, [open, panel, getNotifications]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleNotifClick = async (n: AppNotification) => {
        await markAsRead(n.id);
        if (n.link) navigate(n.link);
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            {/* Bell button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative flex items-center justify-center w-9 h-9 rounded-xl text-[#596887] hover:bg-[#f1f3f8] dark:hover:bg-white/[0.06] hover:text-[#1E56E0] dark:hover:text-[#45CFFF] transition-all"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0B1730]">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-[#0F1E3D] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-2xl overflow-hidden z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[#1a1f36] dark:text-white">Notifications</p>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-mono text-[#45CFFF] bg-[#45CFFF]/10 px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllAsRead(panel)}
                                    className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-[#45CFFF] hover:bg-[#45CFFF]/10 rounded-lg transition-colors"
                                    title="Mark all as read"
                                >
                                    <Check size={10} />
                                    Read all
                                </button>
                            )}
                            {items.length > 0 && (
                                <button
                                    onClick={() => clearAll(panel).then(() => setItems([]))}
                                    className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Clear all"
                                >
                                    <Trash2 size={10} />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notification list */}
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="py-10 text-center">
                                <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-[#45CFFF] border-t-transparent" />
                            </div>
                        ) : items.length === 0 ? (
                            <div className="py-10 text-center">
                                <Bell size={28} className="mx-auto text-[#8b95ad]/40 mb-2" />
                                <p className="text-sm text-[#8b95ad]">No notifications yet</p>
                            </div>
                        ) : (
                            items.slice(0, 20).map((n) => {
                                const style = typeStyles[n.type] || typeStyles.info;
                                return (
                                    <button
                                        key={n.id}
                                        onClick={() => handleNotifClick(n)}
                                        className={`flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-[#f8f9fc] dark:hover:bg-white/[0.03] transition-colors ${!n.is_read ? "bg-[#45CFFF]/[0.03]" : ""
                                            }`}
                                    >
                                        <span className="mt-0.5 text-base shrink-0">{style.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[13px] leading-snug ${!n.is_read ? "font-semibold text-[#1a1f36] dark:text-white" : "text-[#596887] dark:text-[#B9C7E0]"}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-[12px] text-[#8b95ad] mt-0.5 line-clamp-2">
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-[#8b95ad]/60 mt-1">{timeAgo(n.timestamp)}</p>
                                        </div>
                                        {!n.is_read && (
                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#45CFFF]" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <button
                            onClick={() => {
                                if (panel === "admin") navigate("/dashboard/notifications");
                                else if (panel === "customer") navigate("/customer/notifications");
                                else navigate("/user/notifications");
                                setOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-xs font-medium text-[#45CFFF] hover:bg-[#f8f9fc] dark:hover:bg-white/[0.03] border-t border-black/[0.06] dark:border-white/[0.06] transition-colors"
                        >
                            View all
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
