import { useState, useEffect, useCallback } from "react";
import { useResetPage } from "../../hooks/useResetPage";
import { FaSearch, FaWarehouse, FaExclamationTriangle, FaCheckCircle, FaEdit, FaTruck, FaBoxOpen, FaSpinner, FaTimes } from "react-icons/fa";
import { productsApi, type ProductData, type ProductStats } from "../../services";
import Swal from "sweetalert2";

const STATUS_OPTIONS = ["all", "in_stock", "low_stock", "out_of_stock"] as const;

const STATUS_COLORS: Record<string, string> = {
    in_stock: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    low_stock: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    out_of_stock: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function Inventory() {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [stats, setStats] = useState<ProductStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [page, setPage] = useResetPage([statusFilter, search]);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [editItem, setEditItem] = useState<ProductData | null>(null);
    const [editStock, setEditStock] = useState("");
    const [editMinStock, setEditMinStock] = useState("");
    const [updating, setUpdating] = useState(false);

    const fetchInventory = useCallback(async () => {
        try {
            setLoading(true);
            const res = await productsApi.getAll({ status: statusFilter, search, page, per_page: 10 });
            setProducts(res.data.data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            Swal.fire("Error", "Failed to load inventory", "error");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, search, page]);

    const fetchStats = useCallback(async () => {
        try { const res = await productsApi.stats(); setStats(res.data); } catch { /* non-critical */ }
    }, []);

    useEffect(() => { fetchInventory(); }, [fetchInventory]);
    useEffect(() => { fetchStats(); }, [fetchStats]);

    const openEditStock = (p: ProductData) => {
        setEditItem(p);
        setEditStock(String(p.stock));
        setEditMinStock(String(p.min_stock));
    };

    const handleStockUpdate = async () => {
        if (!editItem) return;
        setUpdating(true);
        try {
            await productsApi.update(editItem.id, { stock: parseInt(editStock) || 0, min_stock: parseInt(editMinStock) || 0 });
            Swal.fire({ icon: "success", title: "Stock Updated", timer: 1500, showConfirmButton: false });
            setEditItem(null);
            fetchInventory();
            fetchStats();
        } catch {
            Swal.fire("Error", "Failed to update stock", "error");
        } finally {
            setUpdating(false);
        }
    };

    const getStockStatus = (p: ProductData): string => {
        if (p.stock <= 0) return "out_of_stock";
        if (p.stock <= p.min_stock) return "low_stock";
        return "in_stock";
    };

    const getStatusLabel = (s: string) => s.replace(/_/g, " ");

    const summaryCards = [
        { label: "Total Items", value: stats?.total_products ?? 0, icon: FaWarehouse, color: "text-[#45CFFF] bg-[#45CFFF]/10" },
        { label: "In Stock", value: (stats?.active_products ?? 0) - (stats?.low_stock ?? 0) - (stats?.out_of_stock ?? 0), icon: FaCheckCircle, color: "text-green-500 bg-green-500/10" },
        { label: "Low Stock", value: stats?.low_stock ?? 0, icon: FaExclamationTriangle, color: "text-amber-500 bg-amber-500/10" },
        { label: "Out of Stock", value: stats?.out_of_stock ?? 0, icon: FaBoxOpen, color: "text-red-500 bg-red-500/10" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Inventory</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{total} items tracked</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}><stat.icon size={18} /></div>
                        <div>
                            <p className="text-2xl font-sora font-bold text-[#1a1f36] dark:text-white">{stat.value}</p>
                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                    <input type="text" placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {STATUS_OPTIONS.map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${statusFilter === s ? "bg-[#45CFFF] text-white" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}>
                            {getStatusLabel(s)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inventory Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                {["Item", "Category", "Stock", "Min Stock", "Status", "Supplier", ""].map((h) => (
                                    <th key={h} className="px-3 sm:px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="px-3 sm:px-6 py-12 text-center text-[#A0AEC0]"><FaSpinner className="mx-auto mb-2 animate-spin" size={24} /> Loading...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={7} className="px-3 sm:px-6 py-12 text-center text-[#A0AEC0]">No inventory items found.</td></tr>
                            ) : products.map((p) => {
                                const status = getStockStatus(p);
                                const stockPct = p.min_stock > 0 ? (p.stock / p.min_stock) * 100 : 100;
                                return (
                                    <tr key={p.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-3 sm:px-6 py-3">
                                            <div>
                                                <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{p.name}</p>
                                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">ID: {p.id}</p>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#45CFFF]/10 text-[#45CFFF]">{p.category}</span></td>
                                        <td className="px-3 sm:px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-[#1a1f36] dark:text-white">{p.stock}</span>
                                                <div className="w-16 h-1.5 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${stockPct <= 0 ? "bg-red-500" : stockPct < 100 ? "bg-amber-500" : "bg-green-500"}`}
                                                        style={{ width: `${Math.min(stockPct, 100)}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 text-sm text-[#718096] dark:text-[#A0AEC0]">{p.min_stock}</td>
                                        <td className="px-3 sm:px-6 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status] || ""}`}>{getStatusLabel(status)}</span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 text-sm text-[#718096] dark:text-[#A0AEC0]">{p.supplier || "â€”"}</td>
                                        <td className="px-3 sm:px-6 py-3">
                                            <button onClick={() => openEditStock(p)} className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all" title="Edit stock">
                                                <FaEdit size={13} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#718096] hover:border-[#45CFFF] disabled:opacity-40 dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-[#A0AEC0]">Previous</button>
                    <span className="text-xs text-[#718096] dark:text-[#A0AEC0]">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#718096] hover:border-[#45CFFF] disabled:opacity-40 dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-[#A0AEC0]">Next</button>
                </div>
            )}

            {/* Edit Stock Modal */}
            {editItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditItem(null)}>
                    <div className="bg-white dark:bg-[#0F1E3D] rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white">Update Stock</h3>
                            <button onClick={() => setEditItem(null)} className="p-1.5 rounded-lg text-[#A0AEC0] hover:bg-red-500/10 hover:text-red-500"><FaTimes size={16} /></button>
                        </div>
                        <p className="text-sm text-[#718096] dark:text-[#A0AEC0] mb-4">{editItem.name}</p>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Current Stock</label>
                                <input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Minimum Stock Threshold</label>
                                <input type="number" value={editMinStock} onChange={(e) => setEditMinStock(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button onClick={() => setEditItem(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F1F5F9] dark:hover:bg-white/[0.05] transition-colors">Cancel</button>
                            <button onClick={handleStockUpdate} disabled={updating}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                                {updating ? <FaSpinner className="animate-spin inline mr-1" size={14} /> : <FaTruck size={14} className="inline mr-1" />}
                                Update Stock
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
