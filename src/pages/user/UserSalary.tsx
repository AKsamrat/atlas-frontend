import { useState, useEffect, useCallback } from "react";
import {
    FaMoneyBillWave, FaCheckCircle, FaClock, FaEye, FaTimes,
    FaArrowDown, FaArrowUp, FaFileInvoiceDollar, FaSpinner,
} from "react-icons/fa";
import { userApi, type MyPayroll } from "../../services";
import Pagination from "../../components/shared/Pagination";
import DateRangePicker from "../../components/shared/DateRangePicker";

type FilterType = "All" | "Paid" | "Pending";

const statusColors: Record<string, string> = {
    Paid: "bg-green-500/10 text-green-600 dark:text-green-400",
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Processing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

const fmt = (n: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string | null) => {
    if (!d) return "\u2014";
    try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
    catch { return d; }
};

export default function UserSalary() {
    const [payslips, setPayslips] = useState<MyPayroll[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDetail, setShowDetail] = useState<MyPayroll | null>(null);
    const [filter, setFilter] = useState<FilterType>("All");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const fetchPayroll = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = { per_page: 10, page };
            if (filter !== "All") params.status = filter;
            if (fromDate) params.from_date = fromDate;
            if (toDate) params.to_date = toDate;
            const res = await userApi.getPayroll(params as Parameters<typeof userApi.getPayroll>[0]);
            setPayslips(res.data.data || []);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            // non-critical
        } finally {
            setLoading(false);
        }
    }, [page, filter, fromDate, toDate]);

    useEffect(() => { fetchPayroll(); }, [fetchPayroll]);

    useEffect(() => { setPage(1); }, [filter, fromDate, toDate]);

    const filtered = payslips;

    const totalPaid = payslips.filter((p) => p.status === "Paid").reduce((s, p) => s + (p.base_salary + p.bonus - p.deduction), 0);
    const totalPending = payslips.filter((p) => p.status !== "Paid").reduce((s, p) => s + (p.base_salary + p.bonus - p.deduction), 0);
    const totalBonus = payslips.reduce((s, p) => s + p.bonus, 0);
    const totalDeduction = payslips.reduce((s, p) => s + p.deduction, 0);

    const summaryCards = [
        { label: "Total Received", value: fmt(totalPaid), icon: FaCheckCircle, color: "from-[#10B981] to-[#059669]" },
        { label: "Pending Payment", value: fmt(totalPending), icon: FaClock, color: "from-[#F59E0B] to-[#D97706]" },
        { label: "Total Bonus", value: fmt(totalBonus), icon: FaArrowUp, color: "from-[#45CFFF] to-[#1E56E0]" },
        { label: "Total Deductions", value: fmt(totalDeduction), icon: FaArrowDown, color: "from-[#E91E63] to-[#C2185B]" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <FaSpinner className="animate-spin text-[#45CFFF]" size={32} />
                <span className="ml-3 text-[#718096] dark:text-[#A0AEC0]">Loading salary data...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
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

            <div className="flex items-center gap-2 flex-wrap">
                <DateRangePicker
                    fromDate={fromDate}
                    toDate={toDate}
                    onFromDateChange={setFromDate}
                    onToDateChange={setToDate}
                    onClear={() => { setFromDate(""); setToDate(""); }}
                />
                {(["All", "Paid", "Pending"] as const).map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-white shadow-lg" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#596887] dark:text-[#B9C7E0]"}`}>
                        {f}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filtered.map((p) => {
                    const netPay = p.base_salary + p.bonus - p.deduction;
                    return (
                        <div key={p.id} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-4">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg ${p.status === "Paid" ? "bg-gradient-to-br from-[#10B981] to-[#059669]" : "bg-gradient-to-br from-[#F59E0B] to-[#D97706]"}`}>
                                        <FaMoneyBillWave size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-sm font-semibold text-[#1a1f36] dark:text-white">{p.period}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[p.status] || ""}`}>{p.status}</span>
                                        </div>
                                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mt-0.5">
                                            Net Pay: <span className="font-mono font-bold text-[#1a1f36] dark:text-white">{fmt(netPay)}</span>
                                            {p.status === "Paid" && p.paid_date && <span className="ml-2">Paid on {fmtDate(p.paid_date)}</span>}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setShowDetail(p)}
                                    className="px-3 py-1.5 rounded-lg bg-[#45CFFF]/10 text-[#45CFFF] text-xs font-medium hover:bg-[#45CFFF]/20 transition-colors self-start">
                                    <FaEye size={10} className="inline mr-1" />View Payslip
                                </button>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-sm text-[#A0AEC0]">No payslips found</div>
                )}
                <Pagination currentPage={page} totalPages={totalPages} total={total} onPageChange={setPage} />
            </div>

            {showDetail && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Salary Payslip</h3>
                            <button onClick={() => setShowDetail(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-4 space-y-2">
                                <h4 className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0] mb-2">Period: {showDetail.period}</h4>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Base Salary</span><span className="font-mono text-[#1a1f36] dark:text-white">{fmt(showDetail.base_salary)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Bonus</span><span className="font-mono text-green-500">+{fmt(showDetail.bonus)}</span></div>
                                <div className="border-t border-[#E2E8F0] dark:border-[#2D3748] pt-2 flex justify-between text-sm font-semibold"><span className="text-[#1a1f36] dark:text-white">Gross Pay</span><span className="font-mono text-[#1a1f36] dark:text-white">{fmt(showDetail.base_salary + showDetail.bonus)}</span></div>
                            </div>
                            <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-4 space-y-2">
                                <h4 className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0] mb-2">Deductions</h4>
                                <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Total Deductions</span><span className="font-mono text-red-500">-{fmt(showDetail.deduction)}</span></div>
                            </div>
                            <div className="rounded-xl bg-gradient-to-r from-[#1E56E0] to-[#45CFFF] p-4 text-white">
                                <div className="flex items-center gap-2 mb-1"><FaFileInvoiceDollar size={14} /><p className="text-xs text-white/80">Net Pay</p></div>
                                <p className="text-2xl font-sora font-bold">{fmt(showDetail.base_salary + showDetail.bonus - showDetail.deduction)}</p>
                                <p className="text-xs text-white/60 mt-1">{showDetail.status === "Paid" ? `Paid on ${fmtDate(showDetail.paid_date)}${showDetail.account ? ` from ${showDetail.account.name}` : ""}` : "Awaiting payment"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
