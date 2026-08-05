import { useState, useEffect, useCallback } from "react";
import {
    FaSearch, FaMoneyBillWave, FaCheckCircle, FaClock,
    FaTimes, FaEye, FaFileInvoiceDollar, FaSpinner, FaPlus, FaEdit, FaTrash,
} from "react-icons/fa";
import { salaryApi, type SalaryData, type SalaryStats } from "../../services";
import Swal from "sweetalert2";

const departments = ["Development", "Design", "Marketing", "HR", "Finance", "Operations"];
const fmt = (n: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n);

export default function Salary() {
    const [records, setRecords] = useState<SalaryData[]>([]);
    const [stats, setStats] = useState<SalaryStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showPayslip, setShowPayslip] = useState<SalaryData | null>(null);
    const [showPayAllModal, setShowPayAllModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState<SalaryData | null>(null);

    // Form
    const [formEmployee, setFormEmployee] = useState("");
    const [formDepartment, setFormDepartment] = useState(departments[0]);
    const [formBase, setFormBase] = useState("");
    const [formAllowances, setFormAllowances] = useState("0");
    const [formDeductions, setFormDeductions] = useState("0");
    const [formBonus, setFormBonus] = useState("0");
    const [formPeriod, setFormPeriod] = useState("");
    const [formBank, setFormBank] = useState("");

    const fetchRecords = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = { page, per_page: 10 };
            if (statusFilter !== "all") params.status = statusFilter;
            if (search) params.search = search;
            const res = await salaryApi.getAll(params as Parameters<typeof salaryApi.getAll>[0]);
            setRecords(res.data.data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            Swal.fire("Error", "Failed to load salary records", "error");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, search, page]);

    const fetchStats = useCallback(async () => {
        try { const res = await salaryApi.stats(); setStats(res.data); } catch { /* non-critical */ }
    }, []);

    useEffect(() => { fetchRecords(); }, [fetchRecords]);
    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { setPage(1); }, [statusFilter, search]);

    const pendingCount = stats?.pending_count ?? 0;

    const resetForm = () => { setFormEmployee(""); setFormDepartment(departments[0]); setFormBase(""); setFormAllowances("0"); setFormDeductions("0"); setFormBonus("0"); setFormPeriod(""); setFormBank(""); setEditingRecord(null); };

    const openAddModal = () => { resetForm(); setShowModal(true); };
    const openEditModal = (rec: SalaryData) => {
        setEditingRecord(rec);
        setFormEmployee(rec.employee); setFormDepartment(rec.department); setFormBase(String(rec.base_salary));
        setFormAllowances(String(rec.allowances)); setFormDeductions(String(rec.deductions)); setFormBonus(String(rec.bonus));
        setFormPeriod(rec.period); setFormBank(rec.bank_account || "");
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formEmployee || !formBase || !formPeriod) { Swal.fire("Validation", "Employee, base salary and period are required", "warning"); return; }
        try {
            const payload = { employee: formEmployee, department: formDepartment, base_salary: Number(formBase), allowances: Number(formAllowances) || 0, deductions: Number(formDeductions) || 0, bonus: Number(formBonus) || 0, period: formPeriod, bank_account: formBank };
            if (editingRecord) {
                await salaryApi.update(editingRecord.id, payload);
                Swal.fire({ icon: "success", title: "Updated", timer: 1500, showConfirmButton: false });
            } else {
                await salaryApi.create(payload);
                Swal.fire({ icon: "success", title: "Created", timer: 1500, showConfirmButton: false });
            }
            setShowModal(false); resetForm();
            fetchRecords(); fetchStats();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save salary record";
            Swal.fire("Error", msg, "error");
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({ icon: "warning", title: "Delete salary record?", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
        if (!result.isConfirmed) return;
        try {
            await salaryApi.delete(id);
            fetchRecords(); fetchStats();
            Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to delete", "error"); }
    };

    const markAsPaid = async (id: number) => {
        try {
            await salaryApi.update(id, { status: "Paid", paid_date: new Date().toISOString().split("T")[0] });
            fetchRecords(); fetchStats();
            Swal.fire({ icon: "success", title: "Payment recorded", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to mark as paid", "error"); }
    };

    const processAllPending = async () => {
        setProcessing(true);
        try {
            const pendingRecords = records.filter((r) => r.status === "Pending");
            const today = new Date().toISOString().split("T")[0];
            for (const rec of pendingRecords) {
                await salaryApi.update(rec.id, { status: "Paid", paid_date: today });
            }
            setShowPayAllModal(false);
            fetchRecords(); fetchStats();
            Swal.fire({ icon: "success", title: `All ${pendingRecords.length} pending salaries processed`, timer: 2000, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to process all salaries", "error"); }
        finally { setProcessing(false); }
    };

    const summaryCards = [
        { label: "Total Paid", value: fmt(stats?.total_paid ?? 0), icon: FaCheckCircle, color: "from-[#10B981] to-[#059669]" },
        { label: "Total Pending", value: fmt(stats?.total_pending ?? 0), icon: FaClock, color: "from-[#F59E0B] to-[#D97706]" },
        { label: "Total Allowances", value: fmt(stats?.total_allowances ?? 0), icon: FaMoneyBillWave, color: "from-[#45CFFF] to-[#1E56E0]" },
        { label: "Total Deductions", value: fmt(stats?.total_deductions ?? 0), icon: FaFileInvoiceDollar, color: "from-[#E91E63] to-[#C2185B]" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Salary Management</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{pendingCount} employee{pendingCount !== 1 ? "s" : ""} awaiting salary payment</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm font-medium text-[#1a1f36] dark:text-white hover:border-[#45CFFF]/50 transition-colors">
                        <FaPlus size={14} />Add Record
                    </button>
                    <button onClick={() => setShowPayAllModal(true)} disabled={pendingCount === 0}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        <FaMoneyBillWave size={14} />Pay All Pending
                    </button>
                </div>
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
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                    <input type="text" placeholder="Search by name or department..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["all", "Paid", "Pending", "Processing"].map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${statusFilter === s ? "bg-[#45CFFF] text-white shadow-md" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Salary Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                {["Employee", "Base Salary", "Allowances", "Deductions", "Bonus", "Net Pay", "Status", ""].map((h, i) => (
                                    <th key={i} className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={8} className="px-6 py-12 text-center text-[#A0AEC0]"><FaSpinner className="mx-auto animate-spin" size={20} /></td></tr>
                            ) : records.length === 0 ? (
                                <tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-[#A0AEC0]">No salary records found.</td></tr>
                            ) : records.map((rec) => (
                                <tr key={rec.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-xs font-bold">{rec.employee.charAt(0)}</div>
                                            <div><p className="text-sm font-medium text-[#1a1f36] dark:text-white">{rec.employee}</p><p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{rec.department}</p></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm font-mono text-[#1a1f36] dark:text-white">{fmt(rec.base_salary)}</td>
                                    <td className="px-6 py-3.5 text-sm font-mono text-green-500">+{fmt(rec.allowances)}</td>
                                    <td className="px-6 py-3.5 text-sm font-mono text-red-500">-{fmt(rec.deductions)}</td>
                                    <td className="px-6 py-3.5 text-sm font-mono text-[#45CFFF]">+{fmt(rec.bonus)}</td>
                                    <td className="px-6 py-3.5 text-sm font-mono font-bold text-[#1a1f36] dark:text-white">{fmt(rec.net_salary)}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${rec.status === "Paid" ? "bg-green-500/10 text-green-600 dark:text-green-400" : rec.status === "Pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"}`}>
                                            {rec.status === "Paid" && <FaCheckCircle size={10} className="inline mr-1" />}
                                            {rec.status === "Pending" && <FaClock size={10} className="inline mr-1" />}
                                            {rec.status === "Processing" && <FaSpinner size={10} className="inline mr-1 animate-spin" />}
                                            {rec.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setShowPayslip(rec)} className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-xs hover:bg-blue-500/20 transition-colors" title="View payslip"><FaEye size={12} /></button>
                                            <button onClick={() => openEditModal(rec)} className="px-2 py-1 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] text-xs transition-colors" title="Edit"><FaEdit size={12} /></button>
                                            <button onClick={() => handleDelete(rec.id)} className="px-2 py-1 rounded-lg hover:bg-red-500/10 text-[#718096] hover:text-red-500 text-xs transition-colors" title="Delete"><FaTrash size={12} /></button>
                                            {rec.status === "Pending" && (
                                                <button onClick={() => markAsPaid(rec.id)} className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"><FaMoneyBillWave size={10} className="inline mr-1" /> Pay</button>
                                            )}
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
                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{total} records</p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] disabled:opacity-40">Prev</button>
                            <span className="text-xs text-[#718096] dark:text-[#A0AEC0]">Page {page} of {totalPages}</span>
                            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] disabled:opacity-40">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Payslip Modal */}
            {showPayslip && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Salary Payslip</h3>
                            <button onClick={() => setShowPayslip(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white font-bold font-sora text-lg">{showPayslip.employee.charAt(0)}</div>
                                <div><p className="font-semibold text-[#1a1f36] dark:text-white">{showPayslip.employee}</p><p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{showPayslip.department} &mdash; {showPayslip.period}</p></div>
                            </div>
                            <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-4 space-y-2">
                                <h4 className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0] mb-2">Earnings</h4>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Base Salary</span><span className="font-mono text-[#1a1f36] dark:text-white">{fmt(showPayslip.base_salary)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Allowances</span><span className="font-mono text-green-500">+{fmt(showPayslip.allowances)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Bonus</span><span className="font-mono text-[#45CFFF]">+{fmt(showPayslip.bonus)}</span></div>
                                <div className="border-t border-[#E2E8F0] dark:border-[#2D3748] pt-2 flex justify-between text-sm font-semibold"><span className="text-[#1a1f36] dark:text-white">Gross Pay</span><span className="font-mono text-[#1a1f36] dark:text-white">{fmt(showPayslip.base_salary + showPayslip.allowances + showPayslip.bonus)}</span></div>
                            </div>
                            <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-4 space-y-2">
                                <h4 className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0] mb-2">Deductions</h4>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Tax &amp; Contributions</span><span className="font-mono text-red-500">-{fmt(showPayslip.deductions)}</span></div>
                                <div className="border-t border-[#E2E8F0] dark:border-[#2D3748] pt-2 flex justify-between text-sm font-semibold"><span className="text-[#1a1f36] dark:text-white">Total Deductions</span><span className="font-mono text-red-500">-{fmt(showPayslip.deductions)}</span></div>
                            </div>
                            <div className="rounded-xl bg-gradient-to-r from-[#1E56E0] to-[#45CFFF] p-4 text-white">
                                <p className="text-xs text-white/80 mb-1">Net Pay</p>
                                <p className="text-2xl font-sora font-bold">{fmt(showPayslip.net_salary)}</p>
                                <p className="text-xs text-white/60 mt-1">{showPayslip.status === "Paid" ? `Paid on ${showPayslip.paid_date || "—"} to ${showPayslip.bank_account || "—"}` : "Awaiting payment"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add / Edit Salary Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">{editingRecord ? "Edit Salary Record" : "Add Salary Record"}</h3>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Employee Name</label>
                                    <input type="text" value={formEmployee} onChange={(e) => setFormEmployee(e.target.value)} placeholder="Full name"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Department</label>
                                    <select value={formDepartment} onChange={(e) => setFormDepartment(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                        {departments.map((d) => (<option key={d}>{d}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Base Salary</label>
                                    <input type="number" value={formBase} onChange={(e) => setFormBase(e.target.value)} placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Allowances</label>
                                    <input type="number" value={formAllowances} onChange={(e) => setFormAllowances(e.target.value)} placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Deductions</label>
                                    <input type="number" value={formDeductions} onChange={(e) => setFormDeductions(e.target.value)} placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Bonus</label>
                                    <input type="number" value={formBonus} onChange={(e) => setFormBonus(e.target.value)} placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Period</label>
                                    <input type="text" value={formPeriod} onChange={(e) => setFormPeriod(e.target.value)} placeholder="e.g., January 2025"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Bank Account</label>
                                    <input type="text" value={formBank} onChange={(e) => setFormBank(e.target.value)} placeholder="Optional"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]">Cancel</button>
                            <button onClick={handleSubmit} disabled={!formEmployee || !formBase || !formPeriod}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                <FaPlus size={12} />{editingRecord ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Process All Pending Modal */}
            {showPayAllModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Process Salaries</h3>
                            {!processing && <button onClick={() => setShowPayAllModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>}
                        </div>
                        <div className="px-6 py-8 text-center">
                            {processing ? (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] mx-auto flex items-center justify-center animate-pulse"><FaSpinner size={28} className="text-white animate-spin" /></div>
                                    <p className="font-semibold text-[#1a1f36] dark:text-white">Processing salaries...</p>
                                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Please wait</p>
                                    <div className="w-full h-2 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full animate-pulse" style={{ width: "60%" }} /></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#10B981]/20 to-[#059669]/20 mx-auto flex items-center justify-center"><FaMoneyBillWave size={28} className="text-[#10B981]" /></div>
                                    <div>
                                        <p className="font-semibold text-[#1a1f36] dark:text-white">Confirm Salary Processing</p>
                                        <p className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">This will process <strong>{pendingCount}</strong> pending payment{pendingCount !== 1 ? "s" : ""}.</p>
                                    </div>
                                    <div className="flex items-center justify-center gap-3 pt-2">
                                        <button onClick={() => setShowPayAllModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]">Cancel</button>
                                        <button onClick={processAllPending} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-sm font-semibold hover:opacity-90"><FaCheckCircle size={12} /> Process Now</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
