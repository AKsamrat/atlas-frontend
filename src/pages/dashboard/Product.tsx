

import { useState, useEffect, useCallback } from "react";
import { useResetPage } from "../../hooks/useResetPage";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaBoxOpen, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaSpinner, FaTimes } from "react-icons/fa";
import { productsApi, type ProductData, type ProductStats } from "../../services";
import Swal from "sweetalert2";

const CATEGORIES = ["All", "Services", "Design", "Marketing", "Infrastructure"];

const CATEGORY_COLORS: Record<string, string> = {
    Services: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Design: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    Marketing: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Infrastructure: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function Product() {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [stats, setStats] = useState<ProductStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("All");
    const [page, setPage] = useResetPage([catFilter, search]);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
    const [form, setForm] = useState({ name: "", description: "", category: "Services", price: "", stock: "", min_stock: "10", status: "active", supplier: "" });

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await productsApi.getAll({ category: catFilter, search, page, per_page: 10 });
            setProducts(res.data.data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            Swal.fire("Error", "Failed to load products", "error");
        } finally {
            setLoading(false);
        }
    }, [catFilter, search, page]);

    const fetchStats = useCallback(async () => {
        try { const res = await productsApi.stats(); setStats(res.data); } catch { /* non-critical */ }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);
    useEffect(() => { fetchStats(); }, [fetchStats]);

    const resetForm = () => { setForm({ name: "", description: "", category: "Services", price: "", stock: "", min_stock: "10", status: "active", supplier: "" }); setEditingProduct(null); };

    const openAddModal = () => { resetForm(); setShowModal(true); };
    const openEditModal = (p: ProductData) => {
        setEditingProduct(p);
        setForm({ name: p.name, description: p.description || "", category: p.category, price: String(p.price), stock: String(p.stock), min_stock: String(p.min_stock), status: p.status, supplier: p.supplier || "" });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.category || !form.price) {
            Swal.fire("Validation", "Name, category, and price are required", "warning");
            return;
        }
        try {
            const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0, min_stock: parseInt(form.min_stock) || 10, status: form.status as "active" | "inactive" };
            if (editingProduct) {
                await productsApi.update(editingProduct.id, payload);
                Swal.fire({ icon: "success", title: "Updated", timer: 1500, showConfirmButton: false });
            } else {
                await productsApi.create(payload as any);
                Swal.fire({ icon: "success", title: "Created", timer: 1500, showConfirmButton: false });
            }
            setShowModal(false);
            resetForm();
            fetchProducts();
            fetchStats();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save product";
            Swal.fire("Error", msg, "error");
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({ icon: "warning", title: "Delete product?", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
        if (!result.isConfirmed) return;
        try {
            await productsApi.delete(id);
            fetchProducts();
            fetchStats();
            Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to delete", "error"); }
    };

    const summaryCards = [
        { label: "Total Products", value: stats?.total_products ?? 0, icon: FaBoxOpen, color: "text-[#45CFFF] bg-[#45CFFF]/10" },
        { label: "Active", value: stats?.active_products ?? 0, icon: FaCheckCircle, color: "text-green-500 bg-green-500/10" },
        { label: "Low Stock", value: stats?.low_stock ?? 0, icon: FaExclamationTriangle, color: "text-amber-500 bg-amber-500/10" },
        { label: "Out of Stock", value: stats?.out_of_stock ?? 0, icon: FaTimesCircle, color: "text-red-500 bg-red-500/10" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Products</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{total} products listed</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    <FaPlus size={14} /> Add Product
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                    <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map((c) => (
                        <button key={c} onClick={() => setCatFilter(c)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${catFilter === c ? "bg-[#45CFFF] text-white" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                {["Product", "Category", "Price", "Stock", "Sold", "Status", ""].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-[#A0AEC0]"><FaSpinner className="mx-auto mb-2 animate-spin" size={24} /> Loading...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-[#A0AEC0]">No products found.</td></tr>
                            ) : products.map((p) => (
                                <tr key={p.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-xs font-bold">{p.name.substring(0, 2).toUpperCase()}</div>
                                            <div>
                                                <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{p.name}</p>
                                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{p.supplier || "—"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[p.category] || "bg-gray-100 text-gray-600"}`}>{p.category}</span></td>
                                    <td className="px-6 py-3.5 text-sm font-semibold text-[#1a1f36] dark:text-white">৳{p.price.toLocaleString()}</td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-mono text-[#718096] dark:text-[#A0AEC0]">{p.stock}</span>
                                            {p.stock <= p.min_stock && p.stock > 0 && <FaExclamationTriangle size={12} className="text-amber-500" />}
                                            {p.stock <= 0 && <FaTimesCircle size={12} className="text-red-500" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{p.sold}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.status === "active" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => openEditModal(p)} className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEdit size={13} /></button>
                                            <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#718096] hover:text-red-500 transition-all"><FaTrash size={13} /></button>
                                        </div>
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
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#718096] hover:border-[#45CFFF] disabled:opacity-40 dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-[#A0AEC0]">Previous</button>
                    <span className="text-xs text-[#718096] dark:text-[#A0AEC0]">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#718096] hover:border-[#45CFFF] disabled:opacity-40 dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-[#A0AEC0]">Next</button>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-[#0F1E3D] rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-[#A0AEC0] hover:bg-red-500/10 hover:text-red-500"><FaTimes size={16} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Product Name *</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Category *</label>
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none">
                                        <option>Services</option><option>Design</option><option>Marketing</option><option>Infrastructure</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Price (৳) *</label>
                                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Stock</label>
                                    <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Min Stock</label>
                                    <input type="number" value={form.min_stock} onChange={(e) => setForm({ ...form, min_stock: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Status</label>
                                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none">
                                        <option value="active">Active</option><option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Supplier</label>
                                <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Description</label>
                                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none resize-none" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F1F5F9] dark:hover:bg-white/[0.05] transition-colors">Cancel</button>
                            <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                                {editingProduct ? "Update Product" : "Add Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
