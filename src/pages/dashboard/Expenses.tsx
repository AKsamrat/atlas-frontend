import { useState, useEffect, useCallback, useMemo } from "react";
import {
    FaSearch, FaPlus, FaReceipt, FaCalendar, FaChartPie,
    FaTimes, FaCheckCircle, FaTrash, FaSpinner, FaEdit,
} from "react-icons/fa";
import { expensesApi, type ExpenseData, type ExpenseStats } from "../../services";
import Swal from "sweetalert2";

const categories = ["Rent", "Utilities", "Software", "Marketing", "Supplies", "Travel", "Office", "Miscellaneous"];

const fmt = (n: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n);
const statusColors: Record<string, string> = {
    Approved: "bg-green-500/10 text-green-600 dark:text-green-400",
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
};
const categoryColors: Record<string, string> = {
    Rent: "bg-[#1E56E0]/10 text-[#1E56E0]", Utilities: "bg-[#45CFFF]/10 text-[#45CFFF]", Software: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
    Marketing: "bg-[#E91E63]/10 text-[#E91E63]", Supplies: "bg-[#10B981]/10 text-[#10B981]", Travel: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Office: "bg-[#06B6D4]/10 text-[#06B6D4]", Miscellaneous: "bg-[#718096]/10 text-[#718096]",
};

export default function Expenses() {
    const [expenses, setExpenses] = useState<ExpenseData[]>([]);
    const [stats, setStats] = useState<ExpenseStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState<ExpenseData | null>(null);

    // Form
    const [formDesc, setFormDesc] = useState("");
    const [formCategory, setFormCategory] = useState(categories[0]);
    const [formAmount, setFormAmount] = useState("");
    const [formMethod, setFormMethod] = useState("Bank Transfer");
    const [formSubmitter, setFormSubmitter] = useState("");

    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = { page, per_page: 10 };
            if (statusFilter !== "all") params.status = statusFilter;
            if (categoryFilter !== "all") params.category = categoryFilter;
            if (search) params.search = search;
            const res = await expensesApi.getAll(params as Parameters<typeof expensesApi.getAll>[0]);
            setExpenses(res.data.data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            Swal.fire("Error", "Failed to load expenses", "error");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, categoryFilter, search, page]);

    const fetchStats = useCallback(async () => {
        try { const res = await expensesApi.stats(); setStats(res.data); } catch { /* non-critical */ }
    }, []);

    useEffect(() => { fetchExpenses(); }, [fetchExpenses]);
    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { setPage(1); }, [statusFilter, categoryFilter, search]);

    const categoryBreakdown = useMemo(() => {
        // Build from stats or local data — using local for breakdown bars
        const map: Record<string, number> = {};
        expenses.filter((e) => e.status === "Approved").forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
        return Object.entries(map).sort((a, b) => b[1] - a[1]);
    }, [expenses]);
    const maxCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0][1] : 1;

    const resetForm = () => { setFormDesc(""); setFormCategory(categories[0]); setFormAmount(""); setFormMethod("Bank Transfer"); setFormSubmitter(""); setEditingExpense(null); };

    const openAddModal = () => { resetForm(); setShowModal(true); };
    const openEditModal = (exp: ExpenseData) => {
        setEditingExpense(exp);
        setFormDesc(exp.description); setFormCategory(exp.category); setFormAmount(String(exp.amount));
        setFormMethod(exp.payment_method || "Bank Transfer"); setFormSubmitter(exp.submitted_by || "");
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formDesc || !formAmount) { Swal.fire("Validation", "Description and amount are required", "warning"); return; }
        try {
            const payload = { description: formDesc, category: formCategory, amount: Number(formAmount), payment_method: formMethod, submitted_by: formSubmitter, date: new Date().toISOString().split("T")[0] };
            if (editingExpense) {
                await expensesApi.update(editingExpense.id, payload);
                Swal.fire({ icon: "success", title: "Updated", timer: 1500, showConfirmButton: false });
            } else {
                await expensesApi.create(payload);
                Swal.fire({ icon: "success", title: "Submitted", timer: 1500, showConfirmButton: false });
            }
            setShowModal(false); resetForm();
            fetchExpenses(); fetchStats();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save expense";
            Swal.fire("Error", msg, "error");
        }
    };

    const handleStatusChange = async (id: number, status: "Approved" | "Rejected") => {
        try {
            await expensesApi.update(id, { status });
            fetchExpenses(); fetchStats();
            Swal.fire({ icon: "success", title: `Expense ${status.toLowerCase()}`, timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to update status", "error"); }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({ icon: "warning", title: "Delete expense?", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
        if (!result.isConfirmed) return;
        try {
            await expensesApi.delete(id);
            fetchExpenses(); fetchStats();
            Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to delete", "error"); }
    };

    const summaryCards = [
        { label: "Total Expenses", value: fmt(stats?.total_expenses ?? 0), icon: FaReceipt, color: "from-[#F59E0B] to-[#D97706]" },
        { label: "Approved Total", value: fmt(stats?.approved_total ?? 0), icon: FaCheckCircle, color: "from-[#10B981] to-[#059669]" },
        { label: "Pending Total", value: fmt(stats?.pending_total ?? 0), icon: FaCalendar, color: "from-[#E91E63] to-[#C2185B]" },
        { label: "Total Count", value: String(stats?.total_count ?? 0), icon: FaChartPie, color: "from-[#45CFFF] to-[#1E56E0]" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Expense Management</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{stats?.pending_count ?? 0} expense{(stats?.pending_count ?? 0) !== 1 ? "s" : ""} pending approval</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                    <FaPlus size={14} />Add Expense
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card) => (
                    <div key={card.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}><card.icon size={18} /></div>
                            <div><p className="text-[11px] text-[#718096] dark:text-[#A0AEC0]">{card.label}</p><p className="text-base font-sora font-bold text-[#1a1f36] dark:text-white">{card.value}</p></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Expenses Table */}
                <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                        <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Expense Records</h3>
                    </div>
                    {/* Filters */}
                    <div className="px-6 py-3 border-b border-[#E2E8F0] dark:border-[#2D3748] flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={12} />
                            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-xs text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                            {["all", "Approved", "Pending", "Rejected"].map((s) => (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all capitalize ${statusFilter === s ? "bg-[#45CFFF] text-white" : "bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0]"}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-xs text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                            <option value="all">All Categories</option>
                            {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                    {["Description", "Category", "Amount", "Status", ""].map((h, i) => (
                                        <th key={i} className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-[#A0AEC0]"><FaSpinner className="mx-auto animate-spin" size={20} /></td></tr>
                                ) : expenses.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-[#A0AEC0]">No expenses found.</td></tr>
                                ) : expenses.map((exp) => (
                                    <tr key={exp.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-3.5">
                                            <p className="text-sm font-medium text-[#1a1f36] dark:text-white max-w-[200px] truncate">{exp.description}</p>
                                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{exp.date} &middot; {exp.submitted_by || "—"}</p>
                                        </td>
                                        <td className="px-6 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[exp.category] || categoryColors.Miscellaneous}`}>{exp.category}</span></td>
                                        <td className="px-6 py-3.5 text-sm font-mono font-bold text-[#1a1f36] dark:text-white">{fmt(exp.amount)}</td>
                                        <td className="px-6 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[exp.status]}`}>{exp.status}</span></td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-1">
                                                {exp.status === "Pending" && (
                                                    <>
                                                        <button onClick={() => handleStatusChange(exp.id, "Approved")} className="px-2 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-xs hover:bg-green-500/20 transition-colors" title="Approve"><FaCheckCircle size={12} /></button>
                                                        <button onClick={() => handleStatusChange(exp.id, "Rejected")} className="px-2 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs hover:bg-red-500/20 transition-colors" title="Reject"><FaTimes size={12} /></button>
                                                    </>
                                                )}
                                                <button onClick={() => openEditModal(exp)} className="px-2 py-1 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] text-xs transition-colors" title="Edit"><FaEdit size={12} /></button>
                                                <button onClick={() => handleDelete(exp.id)} className="px-2 py-1 rounded-lg hover:bg-red-500/10 text-[#718096] hover:text-red-500 text-xs transition-colors" title="Delete"><FaTrash size={12} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748] flex items-center justify-between">
                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{total} expenses</p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] disabled:opacity-40">Prev</button>
                                <span className="text-xs text-[#718096] dark:text-[#A0AEC0]">Page {page} of {totalPages}</span>
                                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] disabled:opacity-40">Next</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Category Breakdown */}
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                        <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white flex items-center gap-2"><FaChartPie size={14} /> Category Breakdown</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        {categoryBreakdown.length === 0 ? (
                            <p className="text-sm text-[#A0AEC0] text-center py-4">No approved expenses yet</p>
                        ) : categoryBreakdown.map(([cat, amount]) => {
                            const pct = (amount / maxCategory) * 100;
                            return (
                                <div key={cat}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[cat] || categoryColors.Miscellaneous}`}>{cat}</span>
                                        <span className="text-xs font-mono text-[#718096] dark:text-[#A0AEC0]">{fmt(amount)}</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] rounded-full transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Add / Edit Expense Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <div><h3 className="font-sora font-bold text-[#1a1f36] dark:text-white text-lg">{editingExpense ? "Edit Expense" : "Add Expense"}</h3><p className="text-xs text-[#718096] dark:text-[#A0AEC0] mt-0.5">{editingExpense ? "Update expense details" : "Submit a new expense for approval"}</p></div>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Description</label>
                                <input type="text" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="e.g., Office supplies purchase"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Category</label>
                                    <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                        {categories.map((c) => (<option key={c}>{c}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Amount</label>
                                    <input type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Payment Method</label>
                                    <select value={formMethod} onChange={(e) => setFormMethod(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                        <option>Bank Transfer</option><option>bKash</option><option>Nagad</option><option>Cash</option><option>Credit Card</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Submitted By</label>
                                    <input type="text" value={formSubmitter} onChange={(e) => setFormSubmitter(e.target.value)} placeholder="Your name"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]">Cancel</button>
                            <button onClick={handleSubmit} disabled={!formDesc || !formAmount}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                <FaPlus size={12} />{editingExpense ? "Update" : "Submit Expense"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
