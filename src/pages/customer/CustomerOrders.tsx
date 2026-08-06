import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaShoppingBag, FaFilter, FaSearch, FaTimes, FaSpinner,
    FaChevronLeft, FaChevronRight, FaCalendar, FaFileInvoice,
} from "react-icons/fa";
import { customerPanelApi, type CustomerPanelOrder } from "../../services";

/** Strip non-numeric chars (currency symbols, commas) before parsing */
const safeNum = (v: unknown) => parseFloat(String(v).replace(/[^0-9.]/g, "")) || 0;
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

export default function CustomerOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<CustomerPanelOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // Order detail modal
    const [selectedOrder, setSelectedOrder] = useState<CustomerPanelOrder | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const fetchOrders = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const res = await customerPanelApi.getOrders({
                page,
                per_page: 10,
                search: search || undefined,
                status: statusFilter || undefined,
                from_date: fromDate || undefined,
                to_date: toDate || undefined,
            });
            setOrders(res.data.data || []);
            setCurrentPage(res.data.current_page);
            setLastPage(res.data.last_page);
        } catch {
            // error handled silently
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, fromDate, toDate]);

    useEffect(() => { fetchOrders(1); }, [fetchOrders]);

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchOrders(1); };

    const clearFilters = () => { setSearch(""); setStatusFilter(""); setFromDate(""); setToDate(""); };

    const openDetail = async (id: number) => {
        try {
            setDetailLoading(true);
            setShowDetail(true);
            const res = await customerPanelApi.getOrderDetail(id);
            setSelectedOrder(res.data);
        } catch {
            setShowDetail(false);
        } finally {
            setDetailLoading(false);
        }
    };

    const hasActiveFilters = search || statusFilter || fromDate || toDate;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E56E0] to-[#2E8BF0] text-white shadow-lg">
                        <FaShoppingBag size={18} />
                    </div>
                    <div>
                        <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">My Orders</h2>
                        <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{orders.length} order(s) found</p>
                    </div>
                </div>
                {hasActiveFilters && (
                    <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs font-medium text-[#8b95ad] hover:text-red-500 transition-colors">
                        <FaTimes size={11} /> Clear
                    </button>
                )}
            </div>

            {/* Filters */}
            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B9C7E0]" size={14} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search orders..."
                        className="w-full rounded-xl border border-[#e2e8f0] bg-white py-2.5 pl-9 pr-4 text-sm text-[#1a1f36] placeholder-[#B9C7E0] dark:border-white/8 dark:bg-[#0d1829] dark:text-white transition-colors"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm text-[#1a1f36] dark:border-white/8 dark:bg-[#0d1829] dark:text-white"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <div className="flex items-center gap-2">
                    <FaCalendar size={13} className="text-[#8b95ad]" />
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="rounded-xl border border-[#e2e8f0] bg-white px-3 py-2.5 text-sm text-[#1a1f36] dark:border-white/8 dark:bg-[#0d1829] dark:text-white" />
                    <span className="text-xs text-[#8b95ad]">–</span>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="rounded-xl border border-[#e2e8f0] bg-white px-3 py-2.5 text-sm text-[#1a1f36] dark:border-white/8 dark:bg-[#0d1829] dark:text-white" />
                </div>
                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E56E0] to-[#2E8BF0] px-5 py-2.5 text-sm font-medium text-white shadow hover:shadow-md transition-all">
                    <FaFilter size={13} /> Filter
                </button>
            </form>

            {/* Orders Table */}
            <div className="rounded-2xl border border-[#e2e8f0] bg-white dark:border-white/6 dark:bg-[#0d1829] overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <FaSpinner className="animate-spin text-[#45CFFF]" size={28} />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <FaShoppingBag className="mx-auto mb-3 opacity-20" size={40} />
                        <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">No orders found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-left text-xs font-medium uppercase tracking-wider text-[#718096] dark:border-white/6 dark:bg-white/2 dark:text-[#7C8AAD]">
                                        <th className="px-5 py-3">Order #</th>
                                        <th className="px-5 py-3">Date</th>
                                        <th className="px-5 py-3">Items</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">Amount</th>
                                        <th className="px-5 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e2e8f0] dark:divide-white/4">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-[#f8fafc] dark:hover:bg-white/2 transition-colors">
                                            <td className="px-5 py-3.5 font-medium text-[#1a1f36] dark:text-white">{order.order_number}</td>
                                            <td className="px-5 py-3.5 text-[#718096] dark:text-[#A0AEC0]">{fmtDate(order.created_at)}</td>
                                            <td className="px-5 py-3.5 text-[#718096] dark:text-[#A0AEC0]">{order.items.length}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status] || ""}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-semibold text-[#1a1f36] dark:text-white">{fmt(order.total_amount)}</td>
                                            <td className="px-5 py-3.5 text-right">
                                                <button onClick={() => openDetail(order.id)} className="text-[#1E56E0] hover:text-[#45CFFF] text-xs font-medium transition-colors">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {lastPage > 1 && (
                            <div className="flex items-center justify-between border-t border-[#e2e8f0] px-5 py-3 dark:border-white/6">
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">
                                    Page {currentPage} of {lastPage}
                                </p>
                                <div className="flex gap-2">
                                    <button disabled={currentPage <= 1} onClick={() => fetchOrders(currentPage - 1)} className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-xs font-medium text-[#596887] hover:bg-[#f8fafc] disabled:opacity-30 dark:border-white/8 dark:text-[#B9C7E0] dark:hover:bg-white/4">
                                        <FaChevronLeft size={11} />
                                    </button>
                                    <button disabled={currentPage >= lastPage} onClick={() => fetchOrders(currentPage + 1)} className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-xs font-medium text-[#596887] hover:bg-[#f8fafc] disabled:opacity-30 dark:border-white/8 dark:text-[#B9C7E0] dark:hover:bg-white/4">
                                        <FaChevronRight size={11} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Order Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowDetail(false)}>
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-[#0d1829] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white">Order Details</h3>
                            <button onClick={() => setShowDetail(false)} className="text-[#8b95ad] hover:text-red-500 transition-colors">
                                <FaTimes size={16} />
                            </button>
                        </div>
                        {detailLoading ? (
                            <div className="flex justify-center py-8"><FaSpinner className="animate-spin text-[#45CFFF]" size={24} /></div>
                        ) : selectedOrder ? (
                            <div className="space-y-4">
                                <div className="rounded-xl bg-[#f8fafc] p-4 dark:bg-white/3">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-[#718096]">Order:</span> <span className="font-medium text-[#1a1f36] dark:text-white">{selectedOrder.order_number}</span></div>
                                        <div><span className="text-[#718096]">Status:</span> <span className={`ml-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[selectedOrder.status] || ""}`}>{selectedOrder.status}</span></div>
                                        <div><span className="text-[#718096]">Date:</span> <span className="font-medium text-[#1a1f36] dark:text-white">{fmtDate(selectedOrder.created_at)}</span></div>
                                        <div><span className="text-[#718096]">Total:</span> <span className="font-semibold text-[#1a1f36] dark:text-white">{fmt(selectedOrder.total_amount)}</span></div>
                                    </div>
                                    {selectedOrder.notes && (
                                        <p className="mt-2 text-xs text-[#718096] italic">"{selectedOrder.notes}"</p>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-[#1a1f36] dark:text-white mb-2">Items</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#e2e8f0] p-3 dark:border-white/6">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{item.name || `Item #${item.id}`}</p>
                                                    <p className="text-xs text-[#718096]">Qty: {item.quantity} × {fmt(safeNum(item.price))}</p>
                                                </div>
                                                <span className="text-sm font-semibold text-[#1a1f36] dark:text-white">{fmt(safeNum(item.price) * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-sm text-[#718096]">Order not found</p>
                        )}
                        {selectedOrder && (
                            <div className="mt-5">
                                <button
                                    onClick={() => navigate(`/invoice/${selectedOrder.id}`)}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E56E0] to-[#2E8BF0] px-5 py-2.5 text-sm font-medium text-white shadow hover:shadow-lg transition-all"
                                >
                                    <FaFileInvoice size={14} /> Create Invoice
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
