import { useState, useEffect, useCallback } from "react";
import {
    FaSearch,
    FaEye,
    FaShoppingCart,
    FaDollarSign,
    FaClock,
    FaCheckCircle,
    FaTimes,
    FaSpinner,
} from "react-icons/fa";
import { ordersApi, type OrderData, type OrderStats } from "../../services";
import Swal from "sweetalert2";

/* ------------------------------------------------------------------ */
/*  Admin Orders Management Page — Connected to backend API            */
/* ------------------------------------------------------------------ */

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const PAYMENT_COLORS: Record<string, string> = {
    unpaid: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    refunded: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const STATUS_OPTIONS = ["pending", "processing", "completed", "cancelled"] as const;
const PAYMENT_OPTIONS = ["unpaid", "paid", "refunded"] as const;

export default function Orders() {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
    const [updating, setUpdating] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const res = await ordersApi.getAll({ status: statusFilter, search, page, per_page: 10 });
            setOrders(res.data.data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            Swal.fire("Error", "Failed to load orders", "error");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, search, page]);

    const fetchStats = useCallback(async () => {
        try {
            const res = await ordersApi.stats();
            setStats(res.data);
        } catch { /* non-critical */ }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);
    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { setPage(1); }, [statusFilter, search]);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        setUpdating(true);
        try {
            await ordersApi.update(orderId, { status: newStatus as OrderData["status"] });
            setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as OrderData["status"] } : o)));
            if (selectedOrder?.id === orderId) setSelectedOrder((prev) => prev ? { ...prev, status: newStatus as OrderData["status"] } : prev);
            fetchStats();
            Swal.fire({ icon: "success", title: "Updated", text: `Status → ${newStatus}`, timer: 1500, showConfirmButton: false });
        } catch {
            Swal.fire("Error", "Failed to update status", "error");
        } finally {
            setUpdating(false);
        }
    };

    const handlePaymentChange = async (orderId: number, newPayment: string) => {
        setUpdating(true);
        try {
            await ordersApi.update(orderId, { payment_status: newPayment as OrderData["payment_status"] });
            setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, payment_status: newPayment as OrderData["payment_status"] } : o)));
            if (selectedOrder?.id === orderId) setSelectedOrder((prev) => prev ? { ...prev, payment_status: newPayment as OrderData["payment_status"] } : prev);
            fetchStats();
            Swal.fire({ icon: "success", title: "Updated", text: `Payment → ${newPayment}`, timer: 1500, showConfirmButton: false });
        } catch {
            Swal.fire("Error", "Failed to update payment", "error");
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (orderId: number) => {
        const result = await Swal.fire({ icon: "warning", title: "Delete Order?", text: "This cannot be undone.", showCancelButton: true, confirmButtonColor: "#EF4444", cancelButtonColor: "#6B7280", confirmButtonText: "Delete" });
        if (!result.isConfirmed) return;
        try {
            await ordersApi.delete(orderId);
            setOrders((prev) => prev.filter((o) => o.id !== orderId));
            setSelectedOrder(null);
            fetchStats();
            Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        } catch {
            Swal.fire("Error", "Failed to delete", "error");
        }
    };

    const summaryCards = [
        { label: "Total Orders", value: stats?.total_orders ?? 0, icon: FaShoppingCart, color: "from-[#45CFFF] to-[#1E56E0]" },
        { label: "Revenue", value: `৳${(stats?.total_revenue ?? 0).toLocaleString()}`, icon: FaDollarSign, color: "from-[#10B981] to-[#059669]" },
        { label: "Pending", value: stats?.pending_orders ?? 0, icon: FaClock, color: "from-[#F59E0B] to-[#D97706]" },
        { label: "Completed", value: stats?.completed_orders ?? 0, icon: FaCheckCircle, color: "from-[#8B5CF6] to-[#6D28D9]" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Orders</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{total} total orders</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mb-1">{stat.label}</p>
                                <p className="text-2xl font-sora font-bold text-[#1a1f36] dark:text-white">{stat.value}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <stat.icon size={16} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                    <input type="text" placeholder="Search by name, email or order #..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["all", ...STATUS_OPTIONS].map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${statusFilter === s ? "bg-[#45CFFF] text-white" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Order #</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Date</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={8} className="px-6 py-12 text-center text-[#A0AEC0]">
                                    <FaSpinner className="mx-auto mb-2 animate-spin" size={24} /> Loading orders...
                                </td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={8} className="px-6 py-12 text-center text-[#A0AEC0]">No orders found.</td></tr>
                            ) : orders.map((order) => (
                                <tr key={order.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5 text-sm font-medium text-[#45CFFF] font-mono">{order.order_number}</td>
                                    <td className="px-6 py-3.5">
                                        <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{order.customer_name}</p>
                                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{order.customer_email}</p>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{order.items?.length ?? 0}</td>
                                    <td className="px-6 py-3.5 text-sm font-semibold text-[#1a1f36] dark:text-white">৳{order.total_amount.toLocaleString()}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PAYMENT_COLORS[order.payment_status] || ""}`}>{order.payment_status}</span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] || ""}`}>{order.status}</span>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">
                                        {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all" title="View details">
                                            <FaEye size={13} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                        className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#718096] hover:border-[#45CFFF] disabled:opacity-40 dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-[#A0AEC0]">Previous</button>
                    <span className="text-xs text-[#718096] dark:text-[#A0AEC0]">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#718096] hover:border-[#45CFFF] disabled:opacity-40 dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-[#A0AEC0]">Next</button>
                </div>
            )}

            {/* ── Order Detail Modal ── */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xl dark:border-[#2D3748] dark:bg-[#0B1730]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white">Order Details</h3>
                                <p className="font-mono text-xs text-[#45CFFF]">{selectedOrder.order_number}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="rounded-lg p-1.5 text-[#A0AEC0] hover:bg-red-500/10 hover:text-red-500"><FaTimes size={16} /></button>
                        </div>

                        {/* Customer */}
                        <div className="mb-4 rounded-lg bg-[#f8fafc] p-3 dark:bg-[#0F1E3D]/50">
                            <p className="text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Customer</p>
                            <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{selectedOrder.customer_name}</p>
                            <p className="text-xs text-[#A0AEC0]">{selectedOrder.customer_email}</p>
                            {selectedOrder.customer_phone && <p className="text-xs text-[#A0AEC0]">{selectedOrder.customer_phone}</p>}
                            {selectedOrder.customer_country && <p className="text-xs text-[#A0AEC0]">{selectedOrder.customer_country}</p>}
                        </div>

                        {/* Items */}
                        <div className="mb-4">
                            <p className="text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-2">Items</p>
                            <div className="space-y-2">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] p-2.5 dark:border-[#2D3748]">
                                        <div>
                                            <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{item.name}</p>
                                            <p className="text-xs text-[#A0AEC0]">{item.service_key} × {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium text-[#1a1f36] dark:text-white">৳{item.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="mb-4 flex items-center justify-between rounded-lg bg-[#f8fafc] p-3 dark:bg-[#0F1E3D]/50">
                            <span className="text-sm font-bold text-[#1a1f36] dark:text-white">Total</span>
                            <span className="font-sora text-lg font-bold text-[#1E56E0]">৳{selectedOrder.total_amount.toLocaleString()}</span>
                        </div>

                        {/* Status Controls */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-[#718096] dark:text-[#A0AEC0]">Order Status</label>
                                <select value={selectedOrder.status} onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)} disabled={updating}
                                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1a1f36] outline-none focus:border-[#45CFFF] dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-white">
                                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-[#718096] dark:text-[#A0AEC0]">Payment Status</label>
                                <select value={selectedOrder.payment_status} onChange={(e) => handlePaymentChange(selectedOrder.id, e.target.value)} disabled={updating}
                                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1a1f36] outline-none focus:border-[#45CFFF] dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-white">
                                    {PAYMENT_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                            </div>
                        </div>

                        <p className="mb-4 text-xs text-[#A0AEC0]">Created: {new Date(selectedOrder.created_at).toLocaleString()}</p>

                        <button onClick={() => handleDelete(selectedOrder.id)}
                            className="w-full rounded-lg border border-red-200 bg-red-50 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
                            Delete Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
