import { useState } from "react";
import {
    FaMoneyBillWave, FaCheckCircle, FaClock, FaEye, FaTimes,
    FaArrowDown, FaArrowUp, FaFileInvoiceDollar,
} from "react-icons/fa";

interface Payslip {
    id: number;
    period: string;
    baseSalary: number;
    allowances: number;
    deductions: number;
    bonus: number;
    netPay: number;
    status: "Paid" | "Pending";
    paidDate: string;
    bankAccount: string;
}

const initialPayslips: Payslip[] = [
    { id: 1, period: "July 2026", baseSalary: 85000, allowances: 8000, deductions: 8500, bonus: 5000, netPay: 89500, status: "Pending", paidDate: "\u2014", bankAccount: "Primary Bank" },
    { id: 2, period: "June 2026", baseSalary: 85000, allowances: 8000, deductions: 8500, bonus: 5000, netPay: 89500, status: "Paid", paidDate: "Jun 28, 2026", bankAccount: "Primary Bank" },
    { id: 3, period: "May 2026", baseSalary: 85000, allowances: 7500, deductions: 8500, bonus: 4000, netPay: 88000, status: "Paid", paidDate: "May 28, 2026", bankAccount: "Primary Bank" },
    { id: 4, period: "April 2026", baseSalary: 85000, allowances: 8000, deductions: 8500, bonus: 5000, netPay: 89500, status: "Paid", paidDate: "Apr 28, 2026", bankAccount: "Primary Bank" },
    { id: 5, period: "March 2026", baseSalary: 85000, allowances: 7000, deductions: 8500, bonus: 3000, netPay: 86500, status: "Paid", paidDate: "Mar 28, 2026", bankAccount: "Primary Bank" },
    { id: 6, period: "February 2026", baseSalary: 85000, allowances: 8000, deductions: 8500, bonus: 5000, netPay: 89500, status: "Paid", paidDate: "Feb 27, 2026", bankAccount: "Primary Bank" },
    { id: 7, period: "January 2026", baseSalary: 85000, allowances: 6500, deductions: 8500, bonus: 2000, netPay: 85000, status: "Paid", paidDate: "Jan 28, 2026", bankAccount: "Primary Bank" },
];

const fmt = (n: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n);

export default function UserSalary() {
    const [payslips] = useState(initialPayslips);
    const [showDetail, setShowDetail] = useState<Payslip | null>(null);
    const [filter, setFilter] = useState("All");

    const filtered = payslips.filter((p) => filter === "All" || p.status === filter);

    const totalPaid = payslips.filter((p) => p.status === "Paid").reduce((s, p) => s + p.netPay, 0);
    const totalPending = payslips.filter((p) => p.status === "Pending").reduce((s, p) => s + p.netPay, 0);
    const totalAllowances = payslips.reduce((s, p) => s + p.allowances, 0);
    const totalDeductions = payslips.reduce((s, p) => s + p.deductions, 0);

    const summaryCards = [
        { label: "Total Received", value: fmt(totalPaid), icon: FaCheckCircle, color: "from-[#10B981] to-[#059669]" },
        { label: "Pending Payment", value: fmt(totalPending), icon: FaClock, color: "from-[#F59E0B] to-[#D97706]" },
        { label: "Total Allowances", value: fmt(totalAllowances), icon: FaArrowUp, color: "from-[#45CFFF] to-[#1E56E0]" },
        { label: "Total Deductions", value: fmt(totalDeductions), icon: FaArrowDown, color: "from-[#E91E63] to-[#C2185B]" },
    ];

    return (
        <div className="space-y-6 relative">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card) => (
                    <div key={card.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <card.icon size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] text-[#718096] dark:text-[#A0AEC0]">{card.label}</p>
                                <p className="text-base font-sora font-bold text-[#1a1f36] dark:text-white">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {["All", "Paid", "Pending"].map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-white shadow-lg" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#596887] dark:text-[#B9C7E0]"}`}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Payslips */}
            <div className="space-y-3">
                {filtered.map((p) => (
                    <div key={p.id} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg ${p.status === "Paid" ? "bg-gradient-to-br from-[#10B981] to-[#059669]" : "bg-gradient-to-br from-[#F59E0B] to-[#D97706]"
                                    }`}>
                                    <FaMoneyBillWave size={18} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-sm font-semibold text-[#1a1f36] dark:text-white">{p.period}</h4>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${p.status === "Paid" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                            }`}>{p.status}</span>
                                    </div>
                                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mt-0.5">
                                        Net Pay: <span className="font-mono font-bold text-[#1a1f36] dark:text-white">{fmt(p.netPay)}</span>
                                        {p.status === "Paid" && <span className="ml-2">Paid on {p.paidDate}</span>}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowDetail(p)}
                                className="px-3 py-1.5 rounded-lg bg-[#45CFFF]/10 text-[#45CFFF] text-xs font-medium hover:bg-[#45CFFF]/20 transition-colors self-start">
                                <FaEye size={10} className="inline mr-1" />View Payslip
                            </button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-sm text-[#A0AEC0]">No payslips found</div>
                )}
            </div>

            {/* Payslip Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Salary Payslip</h3>
                            <button onClick={() => setShowDetail(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white font-bold font-sora text-lg">K</div>
                                <div>
                                    <p className="font-semibold text-[#1a1f36] dark:text-white">Karim Ahmed</p>
                                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">Development {'\u2014'} {showDetail.period}</p>
                                </div>
                            </div>
                            <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-4 space-y-2">
                                <h4 className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0] mb-2">Earnings</h4>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Base Salary</span><span className="font-mono text-[#1a1f36] dark:text-white">{fmt(showDetail.baseSalary)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Allowances</span><span className="font-mono text-green-500">+{fmt(showDetail.allowances)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Bonus</span><span className="font-mono text-[#45CFFF]">+{fmt(showDetail.bonus)}</span></div>
                                <div className="border-t border-[#E2E8F0] dark:border-[#2D3748] pt-2 flex justify-between text-sm font-semibold"><span className="text-[#1a1f36] dark:text-white">Gross Pay</span><span className="font-mono text-[#1a1f36] dark:text-white">{fmt(showDetail.baseSalary + showDetail.allowances + showDetail.bonus)}</span></div>
                            </div>
                            <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-4 space-y-2">
                                <h4 className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0] mb-2">Deductions</h4>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Tax &amp; Contributions</span><span className="font-mono text-red-500">-{fmt(showDetail.deductions)}</span></div>
                                <div className="border-t border-[#E2E8F0] dark:border-[#2D3748] pt-2 flex justify-between text-sm font-semibold"><span className="text-[#1a1f36] dark:text-white">Total Deductions</span><span className="font-mono text-red-500">-{fmt(showDetail.deductions)}</span></div>
                            </div>
                            <div className="rounded-xl bg-gradient-to-r from-[#1E56E0] to-[#45CFFF] p-4 text-white">
                                <div className="flex items-center gap-2 mb-1"><FaFileInvoiceDollar size={14} /><p className="text-xs text-white/80">Net Pay</p></div>
                                <p className="text-2xl font-sora font-bold">{fmt(showDetail.netPay)}</p>
                                <p className="text-xs text-white/60 mt-1">{showDetail.status === "Paid" ? `Paid on ${showDetail.paidDate} to ${showDetail.bankAccount}` : "Awaiting payment"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
