import { useState, useMemo } from "react";
import {
    FaSearch, FaDownload, FaPlay, FaMoneyBillWave, FaCheckCircle,
    FaClock, FaSpinner, FaEye, FaTimes, FaFileAlt,
} from "react-icons/fa";

interface PayrollRecord {
    id: number;
    name: string;
    department: string;
    baseSalary: number;
    bonus: number;
    deduction: number;
    status: "Paid" | "Pending" | "Processing";
    period: string;
    paidDate: string;
}

const initialPayroll: PayrollRecord[] = [
    { id: 1, name: "Karim Ahmed", department: "Development", baseSalary: 85000, bonus: 5000, deduction: 8500, status: "Paid", period: "January 2025", paidDate: "Jan 28, 2025" },
    { id: 2, name: "Mehedi Hasan", department: "Design", baseSalary: 75000, bonus: 3000, deduction: 7500, status: "Paid", period: "January 2025", paidDate: "Jan 28, 2025" },
    { id: 3, name: "Fatima Rahman", department: "Marketing", baseSalary: 70000, bonus: 4000, deduction: 7000, status: "Pending", period: "January 2025", paidDate: "\u2014" },
    { id: 4, name: "Sakib Al Hasan", department: "Development", baseSalary: 90000, bonus: 6000, deduction: 9000, status: "Pending", period: "January 2025", paidDate: "\u2014" },
    { id: 5, name: "Nusrat Jahan", department: "HR", baseSalary: 65000, bonus: 3500, deduction: 6500, status: "Paid", period: "January 2025", paidDate: "Jan 28, 2025" },
    { id: 6, name: "Arif Mahmud", department: "Development", baseSalary: 82000, bonus: 4500, deduction: 8200, status: "Pending", period: "January 2025", paidDate: "\u2014" },
    { id: 7, name: "Tasnim Ahmed", department: "Design", baseSalary: 68000, bonus: 2500, deduction: 6800, status: "Pending", period: "January 2025", paidDate: "\u2014" },
    { id: 8, name: "Rafiq Uddin", department: "Marketing", baseSalary: 72000, bonus: 3200, deduction: 7200, status: "Paid", period: "January 2025", paidDate: "Jan 28, 2025" },
    { id: 9, name: "Sumaiya Akter", department: "HR", baseSalary: 67000, bonus: 3000, deduction: 6700, status: "Paid", period: "January 2025", paidDate: "Jan 28, 2025" },
    { id: 10, name: "Tanvir Hossain", department: "Development", baseSalary: 78000, bonus: 4000, deduction: 7800, status: "Pending", period: "January 2025", paidDate: "\u2014" },
];

function fmt(n: number) {
    return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n);
}

export default function Payroll() {
    const [payroll, setPayroll] = useState(initialPayroll);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showPayslip, setShowPayslip] = useState<PayrollRecord | null>(null);
    const [showRunModal, setShowRunModal] = useState(false);
    const [runningPayroll, setRunningPayroll] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const summary = useMemo(() => {
        const totalPaid = payroll.filter((r) => r.status === "Paid").reduce((s, r) => s + r.baseSalary + r.bonus - r.deduction, 0);
        const totalPending = payroll.filter((r) => r.status === "Pending").reduce((s, r) => s + r.baseSalary + r.bonus - r.deduction, 0);
        const totalBonus = payroll.reduce((s, r) => s + r.bonus, 0);
        const totalDeduction = payroll.reduce((s, r) => s + r.deduction, 0);
        return { totalPaid, totalPending, totalBonus, totalDeduction };
    }, [payroll]);

    const markAsPaid = (id: number) => {
        setPayroll((prev) => prev.map((r) => r.id === id ? { ...r, status: "Paid" as const, paidDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) } : r));
        showToast("Payment recorded successfully");
    };

    const runPayroll = () => {
        setRunningPayroll(true);
        setTimeout(() => {
            setPayroll((prev) => prev.map((r) => r.status === "Pending" ? { ...r, status: "Paid" as const, paidDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) } : r));
            setRunningPayroll(false);
            setShowRunModal(false);
            showToast("Payroll processed successfully");
        }, 2000);
    };

    const exportCSV = () => {
        const headers = ["Employee", "Department", "Base Salary", "Bonus", "Deduction", "Net Pay", "Status", "Period"];
        const rows = filtered.map((r) => [r.name, r.department, r.baseSalary, r.bonus, r.deduction, r.baseSalary + r.bonus - r.deduction, r.status, r.period]);
        const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `payroll-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("CSV exported successfully");
    };

    const filtered = payroll.filter((r) => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.department.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || r.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const pendingCount = payroll.filter((r) => r.status === "Pending").length;

    const summaryCards = [
        { label: "Total Paid", value: fmt(summary.totalPaid), icon: FaCheckCircle, color: "text-green-500 bg-green-500/10" },
        { label: "Total Pending", value: fmt(summary.totalPending), icon: FaClock, color: "text-amber-500 bg-amber-500/10" },
        { label: "Total Bonuses", value: fmt(summary.totalBonus), icon: FaMoneyBillWave, color: "text-[#45CFFF] bg-[#45CFFF]/10" },
        { label: "Total Deductions", value: fmt(summary.totalDeduction), icon: FaFileAlt, color: "text-red-500 bg-red-500/10" },
    ];

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
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Payroll Management</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{pendingCount} employee{pendingCount !== 1 ? "s" : ""} awaiting payment</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm font-medium text-[#1a1f36] dark:text-white hover:border-[#45CFFF]/50 transition-colors">
                        <FaDownload size={14} />Export CSV
                    </button>
                    <button onClick={() => setShowRunModal(true)} disabled={pendingCount === 0}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        <FaPlay size={14} />Run Payroll
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card) => (
                    <div key={card.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}><card.icon size={18} /></div>
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
                    {["All", "Paid", "Pending", "Processing"].map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-[#45CFFF] text-white shadow-md" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}>
                            {s}
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
                                {["Employee", "Base Salary", "Bonus", "Deduction", "Net Pay", "Status", ""].map((h, i) => (
                                    <th key={i} className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((rec) => {
                                const netPay = rec.baseSalary + rec.bonus - rec.deduction;
                                return (
                                    <tr key={rec.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-3.5"><div><p className="text-sm font-medium text-[#1a1f36] dark:text-white">{rec.name}</p><p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{rec.department}</p></div></td>
                                        <td className="px-6 py-3.5 text-sm font-mono text-[#1a1f36] dark:text-white">{fmt(rec.baseSalary)}</td>
                                        <td className="px-6 py-3.5 text-sm font-mono text-green-500">+{fmt(rec.bonus)}</td>
                                        <td className="px-6 py-3.5 text-sm font-mono text-red-500">-{fmt(rec.deduction)}</td>
                                        <td className="px-6 py-3.5 text-sm font-mono font-bold text-[#1a1f36] dark:text-white">{fmt(netPay)}</td>
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
                                                {rec.status === "Pending" && (
                                                    <button onClick={() => markAsPaid(rec.id)} className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"><FaMoneyBillWave size={10} className="inline mr-1" /> Pay</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (<tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[#A0AEC0]">No payroll records match your search.</td></tr>)}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAYSLIP MODAL */}
            {showPayslip && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Payslip</h3>
                            <button onClick={() => setShowPayslip(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06] transition-colors"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white font-bold font-sora text-lg">{showPayslip.name.charAt(0)}</div>
                                <div><p className="font-semibold text-[#1a1f36] dark:text-white">{showPayslip.name}</p><p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{showPayslip.department} {"\u2014"} {showPayslip.period}</p></div>
                            </div>
                            <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-4">
                                <h4 className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0] mb-3">Earnings</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Base Salary</span><span className="font-mono text-[#1a1f36] dark:text-white">{fmt(showPayslip.baseSalary)}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Bonus</span><span className="font-mono text-green-500">+{fmt(showPayslip.bonus)}</span></div>
                                    <div className="border-t border-[#E2E8F0] dark:border-[#2D3748] pt-2 flex justify-between text-sm font-semibold"><span className="text-[#1a1f36] dark:text-white">Gross Pay</span><span className="font-mono text-[#1a1f36] dark:text-white">{fmt(showPayslip.baseSalary + showPayslip.bonus)}</span></div>
                                </div>
                            </div>
                            <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-4">
                                <h4 className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0] mb-3">Deductions</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Tax &amp; Contributions</span><span className="font-mono text-red-500">-{fmt(showPayslip.deduction)}</span></div>
                                    <div className="border-t border-[#E2E8F0] dark:border-[#2D3748] pt-2 flex justify-between text-sm font-semibold"><span className="text-[#1a1f36] dark:text-white">Total Deductions</span><span className="font-mono text-red-500">-{fmt(showPayslip.deduction)}</span></div>
                                </div>
                            </div>
                            <div className="rounded-xl bg-gradient-to-r from-[#1E56E0] to-[#45CFFF] p-4 text-white">
                                <p className="text-xs text-white/80 mb-1">Net Pay</p>
                                <p className="text-2xl font-sora font-bold">{fmt(showPayslip.baseSalary + showPayslip.bonus - showPayslip.deduction)}</p>
                                <p className="text-xs text-white/60 mt-1">{showPayslip.status === "Paid" ? `Paid on ${showPayslip.paidDate}` : "Awaiting payment"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* RUN PAYROLL MODAL */}
            {showRunModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Run Payroll</h3>
                            {!runningPayroll && <button onClick={() => setShowRunModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06] transition-colors"><FaTimes size={14} /></button>}
                        </div>
                        <div className="px-6 py-8 text-center">
                            {runningPayroll ? (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] mx-auto flex items-center justify-center animate-pulse"><FaSpinner size={28} className="text-white animate-spin" /></div>
                                    <p className="font-semibold text-[#1a1f36] dark:text-white">Processing payroll...</p>
                                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Please wait while we process {pendingCount} pending payments</p>
                                    <div className="w-full h-2 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full animate-pulse" style={{ width: "60%" }} /></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#10B981]/20 to-[#059669]/20 mx-auto flex items-center justify-center"><FaMoneyBillWave size={28} className="text-[#10B981]" /></div>
                                    <div>
                                        <p className="font-semibold text-[#1a1f36] dark:text-white">Confirm Payroll Processing</p>
                                        <p className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">This will process payments for <strong>{pendingCount}</strong> pending employee{pendingCount !== 1 ? "s" : ""}. This action cannot be undone.</p>
                                    </div>
                                    <div className="flex items-center justify-center gap-3 pt-2">
                                        <button onClick={() => setShowRunModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06] transition-colors">Cancel</button>
                                        <button onClick={runPayroll} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-sm font-semibold hover:opacity-90 transition-opacity"><FaPlay size={12} /> Process Now</button>
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