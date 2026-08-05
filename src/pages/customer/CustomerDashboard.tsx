import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaShoppingBag, FaCheckCircle, FaClock, FaMoneyBillWave,
    FaArrowRight, FaSpinner,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import {
    customerPanelApi,
    type CustomerPanelProfile,
    type CustomerPanelOrder as CustomerOrder,
    type CustomerPanelStats,
} from "../../services";

const fmt = (n: number) =>
    new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
    catch { return d; }
};

const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    processing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    completed: "bg-green-500/10 text-green-600 dark:text-green-400",
    cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function CustomerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [_profile, setProfile] = useState<CustomerPanelProfile | null>(null);
    const [stats, setStats] = useState<CustomerPanelStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<CustomerOrder[]>([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [profileRes, statsRes, ordersRes] = await Promise.all([
                customerPanelApi.getProfile(),
                customerPanelApi.getStats(),
                customerPanelApi.getOrders({ per_page: 5 }),
            ]);
            setProfile(profileRes.data);
            setStats(statsRes.data);
            setRecentOrders((ordersRes.data as unknown as { data: CustomerOrder[] }).data || []);
        } catch {
            // non-critical
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const greeting = useMemo(() => {
        const h = new Date().getHours();
        if (h < 12) return "Good Morning";
        if (h < 17) return "Good Afternoon";
        return "Good Evening";
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <FaSpinner className="animate-spin text-[#45CFFF]" size={32} />
                <span className="ml-3 text-[#718096] dark:text-[#A0AEC0]">Loading dashboard...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#1E56E0] to-[#45CFFF] p-6 text-white">
                <h2 className="font-sora text-2xl font-bold">{greeting}, {user?.name || "Customer"}!</h2>
                <p className="mt-1 text-white/80 text-sm">Welcome to your Entra customer dashboard. Here's an overview of your account.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                    { label: "Total Orders", value: String(stats?.total_orders || 0), icon: FaShoppingBag, color: "from-[#1E56E0] to-[#2E8BF0]" },
                    { label: "Pending", value: String(stats?.pending_orders || 0), icon: FaClock, color: "from-amber-500 to-orange-600" },
                    { label: "Completed", value: String(stats?.completed_orders || 0), icon: FaCheckCircle, color: "from-green-500 to-emerald-600" },
                    { label: "Total Spent", value: fmt(stats?.total_spent || 0), icon: FaMoneyBillWave, color: "from-[#45CFFF] to-[#1E56E0]" },
                ].map((s) => (
                    <div key={s.label} className="relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-5 dark:border-white/6 dark:bg-[#0d1829]">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-[#8b95ad] dark:text-[#7C8AAD]">{s.label}</p>
                                <p className="mt-2 font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">{s.value}</p>
                            </div>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                                <s.icon size={18} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="rounded-2xl border border-[#e2e8f0] bg-white dark:border-white/6 dark:bg-[#0d1829]">
                <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4 dark:border-white/6">
                    <h3 className="font-sora text-base font-bold text-[#1a1f36] dark:text-white">Recent Orders</h3>
                    <button
                        onClick={() => navigate("/customer/orders")}
                        className="flex items-center gap-1 text-sm font-medium text-[#1E56E0] hover:text-[#45CFFF] transition-colors"
                    >
                        View All <FaArrowRight size={11} />
                    </button>
                </div>
                {recentOrders.length === 0 ? (
                    <div className="px-6 py-12 text-center text-sm text-[#8b95ad] dark:text-[#7C8AAD]">
                        <FaShoppingBag className="mx-auto mb-2 opacity-30" size={32} />
                        No orders yet. Start shopping!
                    </div>
                ) : (
                    <div className="divide-y divide-[#e2e8f0] dark:divide-white/4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-[#f8fafc] dark:hover:bg-white/2 transition-colors">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-[#1a1f36] dark:text-white truncate">{order.order_number}</p>
                                    <p className="text-xs text-[#8b95ad] dark:text-[#7C8AAD]">{fmtDate(order.created_at)} · {order.items.length} item(s)</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status] || ""}`}>
                                        {order.status}
                                    </span>
                                    <span className="text-sm font-semibold text-[#1a1f36] dark:text-white">{fmt(order.total_amount)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
