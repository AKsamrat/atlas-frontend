import { useState, useEffect, useCallback } from "react";
import { useResetPage } from "../../hooks/useResetPage";
import {
    FaDollarSign, FaCheckCircle, FaClock, FaSpinner, FaPlus, FaTrash, FaEye, FaTimes, FaCreditCard,
} from "react-icons/fa";
import { payrollApi, employeesApi, accountsApi, type PayrollData, type PayrollStats, type EmployeeData, type AccountData } from "../../services";
import Pagination from "../../components/shared/Pagination";
import DateRangePicker from "../../components/shared/DateRangePicker";
import Swal from "sweetalert2";

const statusColors: Record<string, string> = { Paid: "bg-green-500/10 text-green-600 dark:text-green-400", Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400", Processing: "bg-blue-500/10 text-blue-500" };
const fmt = (n: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n);

export default function Payroll() {
    const [records, setRecords] = useState<PayrollData[]>([]);
    const [stats, setStats] = useState<PayrollStats | null>(null);
    const [allEmployees, setAllEmployees] = useState<EmployeeData[]>([]);
    const [allAccounts, setAllAccounts] = useState<AccountData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [page, setPage] = useResetPage([statusFilter, search, fromDate, toDate]);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [viewRecord, setViewRecord] = useState<PayrollData | null>(null);

    // Form
    const [formEmployeeId, setFormEmployeeId] = useState("");
    const [formAccountId, setFormAccountId] = useState("");
    const [formBaseSalary, setFormBaseSalary] = useState("");
    const [formBonus, setFormBonus] = useState("0");
    const [formDeduction, setFormDeduction] = useState("0");
    const [formStatus, setFormStatus] = useState<"Paid" | "Pending" | "Processing">("Pending");
    const [formPeriod, setFormPeriod] = useState("");
    const [formPaidDate, setFormPaidDate] = useState("");

    const fetchRecords = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = { page, per_page: 10 };
            if (statusFilter !== "all") params.status = statusFilter;
            if (search) params.search = search;
            if (fromDate) params.from_date = fromDate;
            if (toDate) params.to_date = toDate;
            const res = await payrollApi.getAll(params as Parameters<typeof payrollApi.getAll>[0]);
            setRecords(res.data.data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            Swal.fire("Error", "Failed to load payroll records", "error");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, search, page, fromDate, toDate]);

    const fetchStats = useCallback(async () => {
        try { const res = await payrollApi.stats(); setStats(res.data); } catch { /* non-critical */ }
    }, []);

    const fetchEmployees = useCallback(async () => {
        try { const res = await employeesApi.getAll({ per_page: 100 }); setAllEmployees(res.data.data); } catch { /* non-critical */ }
    }, []);

    const fetchAccounts = useCallback(async () => {
        try { const res = await accountsApi.getAll({ per_page: 100 }); setAllAccounts(res.data.data); } catch { /* non-critical */ }
    }, []);

    useEffect(() => { fetchRecords(); }, [fetchRecords]);
    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
    useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

    const resetForm = () => { setFormEmployeeId(""); setFormAccountId(""); setFormBaseSalary(""); setFormBonus("0"); setFormDeduction("0"); setFormStatus("Pending"); setFormPeriod(""); setFormPaidDate(""); };

    const handleSubmit = async () => {
        if (!formEmployeeId || !formBaseSalary || !formPeriod) { Swal.fire("Validation", "Employee, salary and period are required", "warning"); return; }
        try {
            await payrollApi.create({
                employee_id: Number(formEmployeeId),
                account_id: formAccountId ? Number(formAccountId) : null,
                base_salary: Number(formBaseSalary),
                bonus: Number(formBonus),
                deduction: Number(formDeduction),
                status: formStatus,
                period: formPeriod,
                ...(formStatus === "Paid" ? { paid_date: formPaidDate || undefined } : {}),
            });
            Swal.fire({ icon: "success", title: "Payroll record created", timer: 1500, showConfirmButton: false });
            setShowModal(false); resetForm();
            fetchRecords(); fetchStats();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create payroll record";
            Swal.fire("Error", msg, "error");
        }
    };

    const handleMarkPaid = async (id: number) => {
        const result = await Swal.fire({ icon: "question", title: "Mark as paid?", showCancelButton: true, confirmButtonColor: "#10B981", confirmButtonText: "Yes, Mark Paid" });
        if (!result.isConfirmed) return;
        try {
            await payrollApi.update(id, { status: "Paid", paid_date: new Date().toISOString().split("T")[0] });
            fetchRecords(); fetchStats();
            Swal.fire({ icon: "success", title: "Marked as paid", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to update", "error"); }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({ icon: "warning", title: "Delete this payroll record?", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
        if (!result.isConfirmed) return;
        try {
            await payrollApi.delete(id);
            fetchRecords(); fetchStats();
            Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to delete", "error"); }
    };

    const summaryCards = [
        { label: "Total Records", value: stats?.total_records ?? 0, icon: FaCreditCard, color: "from-[#45CFFF] to-[#1E56E0]" },
        { label: "Total Paid", value: fmt(stats?.total_paid ?? 0), icon: FaCheckCircle, color: "from-[#10B981] to-[#059669]" },
        { label: "Total Pending", value: fmt(stats?.total_pending ?? 0), icon: FaClock, color: "from-[#F59E0B] to-[#D97706]" },
        { label: "Total Bonuses", value: fmt(stats?.total_bonus ?? 0), icon: FaDollarSign, color: "from-[#8B5CF6] to-[#6D28D9]" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Payroll Management</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{stats?.pending_count ?? 0} pending payment{(stats?.pending_count ?? 0) !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                    <FaPlus size={14} />Run Payroll
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="relative flex-1">
                    <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                    <input type="text" placeholder="Search by employee name..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                </div>
                <DateRangePicker
                    fromDate={fromDate}
                    toDate={toDate}
                    onFromDateChange={setFromDate}
                    onToDateChange={setToDate}
                    onClear={() => { setFromDate(""); setToDate(""); }}
                />
                <div className="flex gap-2 flex-wrap">
                    {["all", "Paid", "Pending", "Processing"].map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${statusFilter === s ? "bg-[#45CFFF] text-white shadow-md" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}>
                            {s === "all" ? "All" : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Payroll Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                {["Employee", "Period", "Account", "Base", "Bonus", "Deduction", "Net Salary", "Status", ""].map((h, i) => (
                                    <th key={i} className="px-3 sm:px-5 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={8} className="px-3 sm:px-5 py-12 text-center text-[#A0AEC0]"><FaSpinner className="mx-auto animate-spin" size={20} /></td></tr>
                            ) : records.length === 0 ? (
                                <tr><td colSpan={8} className="px-3 sm:px-5 py-12 text-center text-sm text-[#A0AEC0]">No payroll records found.</td></tr>
                            ) : records.map((rec) => (
                                <tr key={rec.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-3 sm:px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-xs font-bold">{rec.employee?.name?.charAt(0) || "?"}</div>
                                            <div><p className="text-sm font-medium text-[#1a1f36] dark:text-white">{rec.employee?.name || "Unknown"}</p><p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{rec.employee?.department || ""}</p></div>
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-5 py-3 text-sm font-mono text-[#1a1f36] dark:text-white">{rec.period}</td>
                                    <td className="px-3 sm:px-5 py-3 text-sm text-[#718096] dark:text-[#A0AEC0]">{rec.account?.name || <span className="italic text-[#A0AEC0]">â€”</span>}</td>
                                    <td className="px-3 sm:px-5 py-3 text-sm text-[#1a1f36] dark:text-white">{fmt(rec.base_salary)}</td>
                                    <td className="px-3 sm:px-5 py-3 text-sm text-green-600 dark:text-green-400">+{fmt(rec.bonus)}</td>
                                    <td className="px-3 sm:px-5 py-3 text-sm text-red-500">-{fmt(rec.deduction)}</td>
                                    <td className="px-3 sm:px-5 py-3 text-sm font-bold text-[#1a1f36] dark:text-white">{fmt(rec.net_salary)}</td>
                                    <td className="px-3 sm:px-5 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[rec.status] || ""}`}>
                                            {rec.status === "Paid" && <FaCheckCircle size={10} className="inline mr-1" />}
                                            {rec.status === "Pending" && <FaClock size={10} className="inline mr-1" />}
                                            {rec.status}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-5 py-3">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setViewRecord(rec)} className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-xs hover:bg-blue-500/20 transition-colors" title="View"><FaEye size={12} /></button>
                                            {rec.status === "Pending" && (
                                                <button onClick={() => handleMarkPaid(rec.id)} className="px-2 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-xs hover:bg-green-500/20 transition-colors" title="Mark Paid"><FaCheckCircle size={12} /></button>
                                            )}
                                            <button onClick={() => handleDelete(rec.id)} className="px-2 py-1 rounded-lg hover:bg-red-500/10 text-[#718096] hover:text-red-500 text-xs transition-colors" title="Delete"><FaTrash size={12} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                    <Pagination currentPage={page} totalPages={totalPages} total={total} onPageChange={setPage} />
                </div>
            </div>

            {/* View Payslip Modal */}
            {viewRecord && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Payslip</h3>
                            <button onClick={() => setViewRecord(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/6"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white font-bold text-lg">{viewRecord.employee?.name?.charAt(0) || "?"}</div>
                                <div><p className="font-semibold text-[#1a1f36] dark:text-white">{viewRecord.employee?.name || "Unknown"}</p><p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{viewRecord.employee?.department} &bull; {viewRecord.employee?.role}</p></div>
                            </div>
                            <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-4 space-y-3">
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Period</span><span className="font-medium text-[#1a1f36] dark:text-white">{viewRecord.period}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Base Salary</span><span className="font-medium text-[#1a1f36] dark:text-white">{fmt(viewRecord.base_salary)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Bonus</span><span className="font-medium text-green-600 dark:text-green-400">+{fmt(viewRecord.bonus)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Deduction</span><span className="font-medium text-red-500">-{fmt(viewRecord.deduction)}</span></div>
                                <div className="border-t border-[#E2E8F0] dark:border-[#2D3748] pt-3 flex justify-between text-sm">
                                    <span className="font-semibold text-[#1a1f36] dark:text-white">Net Salary</span>
                                    <span className="font-sora font-bold text-[#1a1f36] dark:text-white text-lg">{fmt(viewRecord.net_salary)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Status</span><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[viewRecord.status]}`}>{viewRecord.status}</span></div>
                            {viewRecord.account && <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Paid From</span><span className="font-medium text-[#1a1f36] dark:text-white">{viewRecord.account.name} ({viewRecord.account.type})</span></div>}
                            {viewRecord.paid_date && <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Paid Date</span><span className="font-medium text-[#1a1f36] dark:text-white">{new Date(viewRecord.paid_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></div>}
                        </div>
                        <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748] flex justify-end">
                            <button onClick={() => setViewRecord(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Run Payroll Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Run Payroll</h3>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/6"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Employee *</label>
                                <select value={formEmployeeId} onChange={(e) => setFormEmployeeId(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                    <option value="">Select employee</option>
                                    {allEmployees.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.department})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Pay From Account</label>
                                <select value={formAccountId} onChange={(e) => setFormAccountId(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                    <option value="">Select account (optional)</option>
                                    {allAccounts.map((a) => <option key={a.id} value={a.id}>{a.name} â€” {a.type}</option>)}
                                </select>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mt-1">Choose which account to pay salary from</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Period *</label>
                                    <input type="month" value={formPeriod} onChange={(e) => setFormPeriod(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Status</label>
                                    <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as typeof formStatus)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Base Salary *</label>
                                    <input type="number" value={formBaseSalary} onChange={(e) => setFormBaseSalary(e.target.value)} min="0" placeholder="50000"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Bonus</label>
                                    <input type="number" value={formBonus} onChange={(e) => setFormBonus(e.target.value)} min="0" placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Deduction</label>
                                    <input type="number" value={formDeduction} onChange={(e) => setFormDeduction(e.target.value)} min="0" placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                            {formStatus === "Paid" && (
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Paid Date</label>
                                    <input type="date" value={formPaidDate} onChange={(e) => setFormPaidDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            )}
                            {/* Net Preview */}
                            <div className="rounded-xl bg-gradient-to-r from-[#45CFFF]/10 to-[#1E56E0]/10 border border-[#45CFFF]/20 p-4">
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mb-1">Net Salary</p>
                                <p className="text-2xl font-sora font-bold text-[#1a1f36] dark:text-white">{fmt(Number(formBaseSalary || 0) + Number(formBonus || 0) - Number(formDeduction || 0))}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6">Cancel</button>
                            <button onClick={handleSubmit} disabled={!formEmployeeId || !formBaseSalary || !formPeriod}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                <FaPlus size={12} />Create Record
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
