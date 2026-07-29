import { useState, useMemo } from "react";
import {
    FaSearch, FaMoneyBillWave, FaCheckCircle, FaClock,
    FaTimes, FaEye, FaFileInvoiceDollar, FaSpinner,
} from "react-icons/fa";

interface SalaryRecord {
    id: number;
    employee: string;
    department: string;
    baseSalary: number;
    allowances: number;
    deductions: number;
    bonus: number;
    status: "Paid" | "Pending" | "Processing";
    period: string;
    paidDate: string;
    bankAccount: string;
}

const initialRecords: SalaryRecord[] = [
    { id: 1, employee: "Karim Ahmed", department: "Development", baseSalary: 85000, allowances: 8000, deductions: 8500, bonus: 5000, status: "Paid", period: "January 2025", paidDate: "Jan 28, 2025", bankAccount: "Primary Bank" },
    { id: 2, employee: "Mehedi Hasan", department: "Design", baseSalary: 75000, allowances: 6000, deductions: 7500, bonus: 3000, status: "Paid", period: "January 2025", paidDate: "Jan 28, 2025", bankAccount: "bKash Business" },
    { id: 3, employee: "Fatima Rahman", department: "Marketing", baseSalary: 70000, allowances: 5000, deductions: 7000, bonus: 4000, status: "Pending", period: "January 2025", paidDate: "\u2014", bankAccount: "Primary Bank" },
    { id: 4, employee: "Sakib Al Hasan", department: "Development", baseSalary: 90000, allowances: 10000, deductions: 9000, bonus: 6000, status: "Pending", period: "January 2025", paidDate: "\u2014", bankAccount: "Primary Bank" },
    { id: 5, employee: "Nusrat Jahan", department: "HR", baseSalary: 65000, allowances: 5000, deductions: 6500, bonus: 3500, status: "Paid", period: "January 2025", paidDate: "Jan 28, 2025", bankAccount: "Nagad Account" },
    { id: 6, employee: "Arif Mahmud", department: "Development", baseSalary: 82000, allowances: 7000, deductions: 8200, bonus: 4500, status: "Pending", period: "January 2025", paidDate: "\u2014", bankAccount: "Primary Bank" },
    { id: 7, employee: "Tasnim Ahmed", department: "Design", baseSalary: 68000, allowances: 4500, deductions: 6800, bonus: 2500, status: "Pending", period: "January 2025", paidDate: "\u2014", bankAccount: "bKash Business" },
    { id: 8, employee: "Rafiq Uddin", department: "Marketing", baseSalary: 72000, allowances: 5500, deductions: 7200, bonus: 3200, status: "Paid", period: "January 2025", paidDate: "Jan 28, 2025", bankAccount: "Primary Bank" },
    { id: 9, employee: "Sumaiya Akter", department: "HR", baseSalary: 67000, allowances: 4800, deductions: 6700, bonus: 3000, status: "Paid", period: "January 2025", paidDate: "Jan 28, 2025", bankAccount: "Primary Bank" },
    { id: 10, employee: "Tanvir Hossain", department: "Development", baseSalary: 78000, allowances: 6500, deductions: 7800, bonus: 4000, status: "Pending", period: "January 2025", paidDate: "\u2014", bankAccount: "Primary Bank" },
];

const fmt = (n: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n);

export default function Salary() {
    const [records, setRecords] = useState(initialRecords);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showPayslip, setShowPayslip] = useState<SalaryRecord | null>(null);
    const [showPayAllModal, setShowPayAllModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const summary = useMemo(() => {
        const totalPaid = records.filter((r) => r.status === "Paid").reduce((s, r) => s + r.baseSalary + r.allowances + r.bonus - r.deductions, 0);
        const totalPending = records.filter((r) => r.status === "Pending").reduce((s, r) => s + r.baseSalary + r.allowances + r.bonus - r.deductions, 0);
        const totalAllowances = records.reduce((s, r) => s + r.allowances, 0);
        const totalDeductions = records.reduce((s, r) => s + r.deductions, 0);
        return { totalPaid, totalPending, totalAllowances, totalDeductions };
    }, [records]);

    const filtered = records.filter((r) => {
        const matchSearch = r.employee.toLowerCase().includes(search.toLowerCase()) || r.department.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || r.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const pendingCount = records.filter((r) => r.status === "Pending").length;

    const markAsPaid = (id: number) => {
        setRecords((prev) => prev.map((r) => r.id === id ? { ...r, status: "Paid" as const, paidDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) } : r));
        showToast("Salary payment recorded");
    };

    const processAllPending = () => {
        setProcessing(true);
        setTimeout(() => {
            setRecords((prev) => prev.map((r) => r.status === "Pending" ? { ...r, status: "Paid" as const, paidDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) } : r));
            setProcessing(false);
            setShowPayAllModal(false);
            showToast(`All pending salaries processed successfully`);
        }, 2000);
    };

    const summaryCards = [
        { label: "Total Paid", value: fmt(summary.totalPaid), icon: FaCheckCircle, color: "from-[#10B981] to-[#059669]" },
        { label: "Total Pending", value: fmt(summary.totalPending), icon: FaClock, color: "from-[#F59E0B] to-[#D97706]" },
        { label: "Total Allowances", value: fmt(summary.totalAllowances), icon: FaMoneyBillWave, color: "from-[#45CFFF] to-[#1E56E0]" },
        { label: "Total Deductions", value: fmt(summary.totalDeductions), icon: FaFileInvoiceDollar, color: "from-[#E91E63] to-[#C2185B]" },
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
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Salary Management</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{pendingCount} employee{pendingCount !== 1 ? "s" : ""} awaiting salary payment</p>
                </div>
                <button onClick={() => setShowPayAllModal(true)} disabled={pendingCount === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    <FaMoneyBillWave size={14} />Pay All Pending
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
                            {filtered.map((rec) => {
                                const netPay = rec.baseSalary + rec.allowances + rec.bonus - rec.deductions;
                                return (
                                    <tr key={rec.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-xs font-bold">{rec.employee.charAt(0)}</div>
                                                <div><p className="text-sm font-medium text-[#1a1f36] dark:text-white">{rec.employee}</p><p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{rec.department}</p></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm font-mono text-[#1a1f36] dark:text-white">{fmt(rec.baseSalary)}</td>
                                        <td className="px-6 py-3.5 text-sm font-mono text-green-500">+{fmt(rec.allowances)}</td>
                                        <td className="px-6 py-3.5 text-sm font-mono text-red-500">-{fmt(rec.deductions)}</td>
                                        <td className="px-6 py-3.5 text-sm font-mono text-[#45CFFF]">+{fmt(rec.bonus)}</td>
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
                            {filtered.length === 0 && (<tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-[#A0AEC0]">No salary records found.</td></tr>)}
                        </tbody>
                    </table>
                </div>
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
                                <div><p className="font-semibold text-[#1a1f36] dark:text-white">{showPayslip.employee}</p><p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{showPayslip.department} {'\u2014'} {showPayslip.period}</p></div>
                            </div>
                            <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-4 space-y-2">
                                <h4 className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0] mb-2">Earnings</h4>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Base Salary</span><span className="font-mono text-[#1a1f36] dark:text-white">{fmt(showPayslip.baseSalary)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Allowances</span><span className="font-mono text-green-500">+{fmt(showPayslip.allowances)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Bonus</span><span className="font-mono text-[#45CFFF]">+{fmt(showPayslip.bonus)}</span></div>
                                <div className="border-t border-[#E2E8F0] dark:border-[#2D3748] pt-2 flex justify-between text-sm font-semibold"><span className="text-[#1a1f36] dark:text-white">Gross Pay</span><span className="font-mono text-[#1a1f36] dark:text-white">{fmt(showPayslip.baseSalary + showPayslip.allowances + showPayslip.bonus)}</span></div>
                            </div>
                            <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-4 space-y-2">
                                <h4 className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0] mb-2">Deductions</h4>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Tax &amp; Contributions</span><span className="font-mono text-red-500">-{fmt(showPayslip.deductions)}</span></div>
                                <div className="border-t border-[#E2E8F0] dark:border-[#2D3748] pt-2 flex justify-between text-sm font-semibold"><span className="text-[#1a1f36] dark:text-white">Total Deductions</span><span className="font-mono text-red-500">-{fmt(showPayslip.deductions)}</span></div>
                            </div>
                            <div className="rounded-xl bg-gradient-to-r from-[#1E56E0] to-[#45CFFF] p-4 text-white">
                                <p className="text-xs text-white/80 mb-1">Net Pay</p>
                                <p className="text-2xl font-sora font-bold">{fmt(showPayslip.baseSalary + showPayslip.allowances + showPayslip.bonus - showPayslip.deductions)}</p>
                                <p className="text-xs text-white/60 mt-1">{showPayslip.status === "Paid" ? `Paid on ${showPayslip.paidDate} to ${showPayslip.bankAccount}` : "Awaiting payment"}</p>
                            </div>
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
                                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Please wait while we process {pendingCount} pending payments</p>
                                    <div className="w-full h-2 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full animate-pulse" style={{ width: "60%" }} /></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#10B981]/20 to-[#059669]/20 mx-auto flex items-center justify-center"><FaMoneyBillWave size={28} className="text-[#10B981]" /></div>
                                    <div>
                                        <p className="font-semibold text-[#1a1f36] dark:text-white">Confirm Salary Processing</p>
                                        <p className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">This will process salary payments for <strong>{pendingCount}</strong> employee{pendingCount !== 1 ? "s" : ""}. Total: <strong>{fmt(summary.totalPending)}</strong></p>
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