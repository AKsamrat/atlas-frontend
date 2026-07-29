import { useState, useMemo } from "react";
import {
    FaSearch, FaPlus, FaReceipt, FaCalendar, FaChartPie,
    FaTimes, FaCheckCircle, FaTrash, FaFilter,
} from "react-icons/fa";

interface Expense {
    id: number;
    date: string;
    description: string;
    category: string;
    amount: number;
    paymentMethod: string;
    status: "Approved" | "Pending" | "Rejected";
    receipt: boolean;
    submittedBy: string;
}

const categories = ["Rent", "Utilities", "Software", "Marketing", "Supplies", "Travel", "Office", "Miscellaneous"];

const initialExpenses: Expense[] = [
    { id: 1, date: "Jan 27, 2025", description: "Office Rent - January 2025", category: "Rent", amount: 35000, paymentMethod: "Bank Transfer", status: "Approved", receipt: true, submittedBy: "Admin" },
    { id: 2, date: "Jan 26, 2025", description: "Internet & Phone Bill", category: "Utilities", amount: 8500, paymentMethod: "bKash", status: "Approved", receipt: true, submittedBy: "Nusrat Jahan" },
    { id: 3, date: "Jan 25, 2025", description: "Adobe Creative Cloud License", category: "Software", amount: 12000, paymentMethod: "Credit Card", status: "Approved", receipt: true, submittedBy: "Admin" },
    { id: 4, date: "Jan 24, 2025", description: "Office Supplies - Stationery", category: "Supplies", amount: 4200, paymentMethod: "Cash", status: "Approved", receipt: false, submittedBy: "Sumaiya Akter" },
    { id: 5, date: "Jan 23, 2025", description: "Facebook & Google Ads Campaign", category: "Marketing", amount: 25000, paymentMethod: "Bank Transfer", status: "Approved", receipt: true, submittedBy: "Rafiq Uddin" },
    { id: 6, date: "Jan 22, 2025", description: "Client Meeting - Dhaka Trip", category: "Travel", amount: 6800, paymentMethod: "bKash", status: "Pending", receipt: true, submittedBy: "Fatima Rahman" },
    { id: 7, date: "Jan 21, 2025", description: "Team Lunch - Project Celebration", category: "Office", amount: 8500, paymentMethod: "Cash", status: "Pending", receipt: false, submittedBy: "Karim Ahmed" },
    { id: 8, date: "Jan 20, 2025", description: "Server Hosting - AWS Monthly", category: "Software", amount: 18000, paymentMethod: "Credit Card", status: "Approved", receipt: true, submittedBy: "Admin" },
    { id: 9, date: "Jan 19, 2025", description: "Electricity Bill - January", category: "Utilities", amount: 12000, paymentMethod: "Nagad", status: "Approved", receipt: true, submittedBy: "Admin" },
    { id: 10, date: "Jan 18, 2025", description: "Printer Maintenance", category: "Office", amount: 3500, paymentMethod: "Cash", status: "Rejected", receipt: false, submittedBy: "Tasnim Ahmed" },
    { id: 11, date: "Jan 17, 2025", description: "Canva Pro Subscription", category: "Software", amount: 5000, paymentMethod: "bKash", status: "Pending", receipt: true, submittedBy: "Mehedi Hasan" },
    { id: 12, date: "Jan 16, 2025", description: "Water Bill - January", category: "Utilities", amount: 2000, paymentMethod: "Cash", status: "Approved", receipt: true, submittedBy: "Admin" },
];

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
    const [expenses, setExpenses] = useState(initialExpenses);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [showAdd, setShowAdd] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const [formDesc, setFormDesc] = useState("");
    const [formCategory, setFormCategory] = useState(categories[0]);
    const [formAmount, setFormAmount] = useState("");
    const [formMethod, setFormMethod] = useState("Bank Transfer");
    const [formSubmitter, setFormSubmitter] = useState("");

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const summary = useMemo(() => {
        const total = expenses.reduce((s, e) => s + e.amount, 0);
        const approved = expenses.filter((e) => e.status === "Approved").reduce((s, e) => s + e.amount, 0);
        const pending = expenses.filter((e) => e.status === "Pending").reduce((s, e) => s + e.amount, 0);
        const thisMonth = expenses.filter((e) => e.date.includes("Jan 2025")).reduce((s, e) => s + e.amount, 0);
        return { total, approved, pending, thisMonth };
    }, [expenses]);

    const categoryBreakdown = useMemo(() => {
        const map: Record<string, number> = {};
        expenses.filter((e) => e.status === "Approved").forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
        return Object.entries(map).sort((a, b) => b[1] - a[1]);
    }, [expenses]);

    const maxCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0][1] : 1;

    const filtered = expenses.filter((e) => {
        const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) || e.submittedBy.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || e.status === statusFilter;
        const matchCategory = categoryFilter === "All" || e.category === categoryFilter;
        return matchSearch && matchStatus && matchCategory;
    });

    const updateStatus = (id: number, status: "Approved" | "Rejected") => {
        setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
        showToast(`Expense ${status.toLowerCase()}`);
    };

    const deleteExpense = (id: number) => {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
        showToast("Expense deleted");
    };

    const handleAdd = () => {
        if (!formDesc || !formAmount || !formSubmitter) return;
        const newExp: Expense = {
            id: Date.now(), date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            description: formDesc, category: formCategory, amount: Number(formAmount), paymentMethod: formMethod,
            status: "Pending", receipt: false, submittedBy: formSubmitter,
        };
        setExpenses((prev) => [newExp, ...prev]);
        showToast("Expense submitted for approval");
        setShowAdd(false); setFormDesc(""); setFormAmount(""); setFormSubmitter("");
    };

    const summaryCards = [
        { label: "Total Expenses", value: fmt(summary.total), icon: FaReceipt, color: "from-[#F59E0B] to-[#D97706]" },
        { label: "This Month", value: fmt(summary.thisMonth), icon: FaCalendar, color: "from-[#45CFFF] to-[#1E56E0]" },
        { label: "Pending Approval", value: fmt(summary.pending), icon: FaFilter, color: "from-[#E91E63] to-[#C2185B]" },
        { label: "Approved Total", value: fmt(summary.approved), icon: FaCheckCircle, color: "from-[#10B981] to-[#059669]" },
    ];

    const pendingCount = expenses.filter((e) => e.status === "Pending").length;

    return (
        <div className="space-y-6 relative">
            {toast && (
                <div className="fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl bg-green-500 text-white text-sm font-semibold shadow-2xl">
                    <div className="flex items-center gap-2"><FaCheckCircle />{toast}</div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Expense Management</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{pendingCount} expense{pendingCount !== 1 ? "s" : ""} pending approval</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
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
                            {["All", "Approved", "Pending", "Rejected"].map((s) => (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${statusFilter === s ? "bg-[#45CFFF] text-white" : "bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0]"}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-xs text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                            <option value="All">All Categories</option>
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
                                {filtered.map((exp) => (
                                    <tr key={exp.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-3.5">
                                            <p className="text-sm font-medium text-[#1a1f36] dark:text-white max-w-[200px] truncate">{exp.description}</p>
                                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{exp.date} {'\u00B7'} {exp.submittedBy}</p>
                                        </td>
                                        <td className="px-6 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[exp.category] || categoryColors.Miscellaneous}`}>{exp.category}</span></td>
                                        <td className="px-6 py-3.5 text-sm font-mono font-bold text-[#1a1f36] dark:text-white">{fmt(exp.amount)}</td>
                                        <td className="px-6 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[exp.status]}`}>{exp.status}</span></td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-1">
                                                {exp.status === "Pending" && (
                                                    <>
                                                        <button onClick={() => updateStatus(exp.id, "Approved")} className="px-2 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-xs hover:bg-green-500/20 transition-colors" title="Approve"><FaCheckCircle size={12} /></button>
                                                        <button onClick={() => updateStatus(exp.id, "Rejected")} className="px-2 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs hover:bg-red-500/20 transition-colors" title="Reject"><FaTimes size={12} /></button>
                                                    </>
                                                )}
                                                <button onClick={() => deleteExpense(exp.id)} className="px-2 py-1 rounded-lg hover:bg-red-500/10 text-[#718096] hover:text-red-500 text-xs transition-colors" title="Delete"><FaTrash size={12} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (<tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-[#A0AEC0]">No expenses found.</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                        <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white flex items-center gap-2"><FaChartPie size={14} /> Category Breakdown</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        {categoryBreakdown.map(([cat, amount]) => {
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

            {/* Add Expense Modal */}
            {showAdd && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <div><h3 className="font-sora font-bold text-[#1a1f36] dark:text-white text-lg">Add Expense</h3><p className="text-xs text-[#718096] dark:text-[#A0AEC0] mt-0.5">Submit a new expense for approval</p></div>
                            <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
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
                            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]">Cancel</button>
                            <button onClick={handleAdd} disabled={!formDesc || !formAmount || !formSubmitter}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                <FaPlus size={12} />Submit Expense
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}