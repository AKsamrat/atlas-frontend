import { useState, useEffect, useCallback } from "react";
import { useResetPage } from "../../hooks/useResetPage";
import { FaSearch, FaEnvelope, FaPhone, FaUsers, FaShoppingCart, FaDollarSign, FaUserPlus, FaMapMarkerAlt, FaSpinner, FaTimes, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { customersApi, type CustomerData, type CustomerStats } from "../../services";
import Swal from "sweetalert2";

const STATUS_COLORS: Record<string, string> = {
    active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    vip: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    inactive: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function Customers() {
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [stats, setStats] = useState<CustomerStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useResetPage([statusFilter, search]);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);
    const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", status: "active", notes: "" });

    const fetchCustomers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await customersApi.getAll({ status: statusFilter, search, page, per_page: 12 });
            setCustomers(res.data.data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            Swal.fire("Error", "Failed to load customers", "error");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, search, page]);

    const fetchStats = useCallback(async () => {
        try { const res = await customersApi.stats(); setStats(res.data); } catch { /* non-critical */ }
    }, []);

    useEffect(() => { fetchCustomers(); }, [fetchCustomers]);
    useEffect(() => { fetchStats(); }, [fetchStats]);

    const resetForm = () => { setForm({ name: "", email: "", phone: "", location: "", status: "active", notes: "" }); setEditingCustomer(null); };

    const openAddModal = () => { resetForm(); setShowModal(true); };
    const openEditModal = (c: CustomerData) => {
        setEditingCustomer(c);
        setForm({ name: c.name, email: c.email, phone: c.phone || "", location: c.location || "", status: c.status, notes: c.notes || "" });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email) {
            Swal.fire("Validation", "Name and email are required", "warning");
            return;
        }
        try {
            if (editingCustomer) {
                await customersApi.update(editingCustomer.id, { ...form, status: form.status as "active" | "inactive" | "vip" });
                Swal.fire({ icon: "success", title: "Updated", timer: 1500, showConfirmButton: false });
            } else {
                await customersApi.create({ ...form, status: form.status as "active" | "inactive" | "vip" });
                Swal.fire({ icon: "success", title: "Created", timer: 1500, showConfirmButton: false });
            }
            setShowModal(false);
            resetForm();
            fetchCustomers();
            fetchStats();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save customer";
            Swal.fire("Error", msg, "error");
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({ icon: "warning", title: "Delete customer?", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
        if (!result.isConfirmed) return;
        try {
            await customersApi.delete(id);
            fetchCustomers();
            fetchStats();
            Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to delete", "error"); }
    };

    const summaryCards = [
        { label: "Total Customers", value: stats?.total_customers ?? 0, icon: FaUsers, color: "text-[#45CFFF] bg-[#45CFFF]/10" },
        { label: "New This Month", value: stats?.new_this_month ?? 0, icon: FaUserPlus, color: "text-green-500 bg-green-500/10" },
        { label: "VIP Customers", value: stats?.vip_customers ?? 0, icon: FaShoppingCart, color: "text-[#8B5CF6] bg-[#8B5CF6]/10" },
        { label: "Avg. Lifetime Value", value: `৳${(stats?.avg_lifetime_value ?? 0).toLocaleString()}`, icon: FaDollarSign, color: "text-[#F59E0B] bg-[#F59E0B]/10" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Customers</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{total} customers in database</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    <FaPlus size={14} /> Add Customer
                </button>
            </div>

            {/* Summary */}
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
                    <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["all", "active", "vip", "inactive"].map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${statusFilter === s ? "bg-[#45CFFF] text-white" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Customer Cards Grid */}
            {loading ? (
                <div className="text-center py-12 text-[#A0AEC0]"><FaSpinner className="mx-auto mb-2 animate-spin" size={24} /> Loading customers...</div>
            ) : customers.length === 0 ? (
                <div className="text-center py-12 text-[#A0AEC0]">No customers found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {customers.map((c) => {
                        const initials = c.name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();
                        return (
                            <div key={c.id} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-sm font-bold">{initials}</div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-[#1a1f36] dark:text-white">{c.name}</h4>
                                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">ID: {c.id}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[c.status] || ""}`}>{c.status}</span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#A0AEC0]"><FaEnvelope size={11} /> {c.email}</div>
                                    {c.phone && <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#A0AEC0]"><FaPhone size={11} /> {c.phone}</div>}
                                    {c.location && <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#A0AEC0]"><FaMapMarkerAlt size={11} /> {c.location}</div>}
                                </div>
                                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                                    <div className="text-center">
                                        <p className="text-lg font-sora font-bold text-[#1a1f36] dark:text-white">{c.total_orders}</p>
                                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">Orders</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-sora font-bold text-[#1a1f36] dark:text-white">৳{c.total_spent.toLocaleString()}</p>
                                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">Spent</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-sora font-bold text-[#1a1f36] dark:text-white">{new Date(c.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
                                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">Joined</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                                    <button onClick={() => openEditModal(c)} className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEdit size={13} /></button>
                                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#718096] hover:text-red-500 transition-all"><FaTrash size={13} /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

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
                            <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white">{editingCustomer ? "Edit Customer" : "Add New Customer"}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-[#A0AEC0] hover:bg-red-500/10 hover:text-red-500"><FaTimes size={16} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Name *</label>
                                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Email *</label>
                                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Phone</label>
                                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Location</label>
                                    <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Status</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none">
                                    <option value="active">Active</option><option value="vip">VIP</option><option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Notes</label>
                                <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none resize-none" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F1F5F9] dark:hover:bg-white/[0.05] transition-colors">Cancel</button>
                            <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                                {editingCustomer ? "Update Customer" : "Add Customer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
