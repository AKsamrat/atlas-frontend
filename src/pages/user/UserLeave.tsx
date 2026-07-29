import { useState, useMemo } from "react";
import {
    FaClock, FaCheckCircle, FaTimes, FaCalendarAlt,
    FaHistory, FaPaperPlane, FaEye, FaSpinner,
} from "react-icons/fa";

type ViewMode = "history" | "apply";

interface LeaveRequest {
    id: number;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: "Pending" | "Approved" | "Rejected";
    appliedOn: string;
    days: number;
}

interface LeaveBalance {
    type: string;
    total: number;
    used: number;
    icon: string;
    color: string;
}

const initialRequests: LeaveRequest[] = [
    { id: 1, type: "Sick Leave", startDate: "Jul 20, 2026", endDate: "Jul 20, 2026", reason: "Feeling unwell with fever and cold", status: "Approved", appliedOn: "Jul 18, 2026", days: 1 },
    { id: 2, type: "Casual Leave", startDate: "Jul 15, 2026", endDate: "Jul 15, 2026", reason: "Personal appointment", status: "Pending", appliedOn: "Jul 13, 2026", days: 1 },
    { id: 3, type: "Annual Leave", startDate: "Jul 10, 2026", endDate: "Jul 12, 2026", reason: "Family vacation trip to Cox's Bazar", status: "Approved", appliedOn: "Jul 5, 2026", days: 3 },
    { id: 4, type: "Sick Leave", startDate: "Jun 28, 2026", endDate: "Jun 28, 2026", reason: "Dental appointment", status: "Rejected", appliedOn: "Jun 26, 2026", days: 1 },
    { id: 5, type: "Casual Leave", startDate: "Jun 20, 2026", endDate: "Jun 21, 2026", reason: "Home renovation work", status: "Approved", appliedOn: "Jun 18, 2026", days: 2 },
];

const leaveBalances: LeaveBalance[] = [
    { type: "Annual Leave", total: 12, used: 5, icon: "🏖️", color: "from-[#1E56E0] to-[#45CFFF]" },
    { type: "Sick Leave", total: 10, used: 3, icon: "🤒", color: "from-[#EF4444] to-[#DC2626]" },
    { type: "Casual Leave", total: 10, used: 4, icon: "🏠", color: "from-[#10B981] to-[#059669]" },
    { type: "Maternity", total: 90, used: 0, icon: "👶", color: "from-[#F59E0B] to-[#D97706]" },
];

const leaveTypes = ["Annual Leave", "Sick Leave", "Casual Leave", "Maternity", "Paternity", "Unpaid Leave"];

export default function UserLeave() {
    const [view, setView] = useState<ViewMode>("history");
    const [requests, setRequests] = useState(initialRequests);
    const [toast, setToast] = useState<string | null>(null);
    const [showDetail, setShowDetail] = useState<LeaveRequest | null>(null);
    const [filter, setFilter] = useState("All");

    // Apply form state
    const [leaveType, setLeaveType] = useState("Annual Leave");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const filtered = requests.filter((r) => filter === "All" || r.status === filter);

    const balances = useMemo(() => leaveBalances.map((b) => ({ ...b, remaining: b.total - b.used })), []);

    const daysBetween = (d1: string, d2: string) => {
        const start = new Date(d1);
        const end = new Date(d2);
        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return Math.max(1, diff);
    };

    const handleApply = () => {
        if (!startDate || !endDate || !reason) { showToast("Please fill in all fields"); return; }
        setSubmitting(true);
        setTimeout(() => {
            const newReq: LeaveRequest = {
                id: Date.now(),
                type: leaveType,
                startDate: new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                endDate: new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                reason,
                status: "Pending",
                appliedOn: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                days: daysBetween(startDate, endDate),
            };
            setRequests((prev) => [newReq, ...prev]);
            setStartDate(""); setEndDate(""); setReason("");
            setSubmitting(false);
            showToast("Leave request submitted successfully");
            setView("history");
        }, 1500);
    };

    return (
        <div className="space-y-6 relative">
            {toast && (
                <div className="fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl bg-green-500 text-white text-sm font-semibold shadow-2xl">
                    <div className="flex items-center gap-2"><FaCheckCircle />{toast}</div>
                </div>
            )}

            {/* Leave Balances */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {balances.map((b) => (
                    <div key={b.type} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform text-lg`}>
                                {b.icon}
                            </div>
                            <div>
                                <p className="text-[11px] text-[#718096] dark:text-[#A0AEC0]">{b.type}</p>
                                <p className="text-lg font-sora font-bold text-[#1a1f36] dark:text-white">{b.remaining}</p>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-br ${b.color}`} style={{ width: `${(b.used / b.total) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-[#A0AEC0] mt-1">{b.used} of {b.total} used</p>
                    </div>
                ))}
            </div>

            {/* View Toggle + Apply Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex gap-2">
                    <button onClick={() => setView("history")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "history" ? "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-white shadow-lg" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#596887] dark:text-[#B9C7E0]"}`}>
                        <FaHistory size={12} className="inline mr-2" />My Requests
                    </button>
                    <button onClick={() => setView("apply")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "apply" ? "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-white shadow-lg" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#596887] dark:text-[#B9C7E0]"}`}>
                        <FaPaperPlane size={12} className="inline mr-2" />Apply Leave
                    </button>
                </div>
                {view === "history" && (
                    <div className="flex gap-2 flex-wrap">
                        {["All", "Pending", "Approved", "Rejected"].map((f) => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-[#45CFFF] text-white shadow-md" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0]"}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {view === "history" ? (
                /* Leave History */
                <div className="space-y-3">
                    {filtered.map((req) => (
                        <div key={req.id} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-4">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0 ${req.status === "Approved" ? "bg-gradient-to-br from-[#10B981] to-[#059669]" :
                                        req.status === "Pending" ? "bg-gradient-to-br from-[#F59E0B] to-[#D97706]" :
                                            "bg-gradient-to-br from-[#EF4444] to-[#DC2626]"
                                        }`}>
                                        {req.status === "Approved" ? <FaCheckCircle size={18} /> : req.status === "Pending" ? <FaClock size={18} /> : <FaTimes size={18} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-sm font-semibold text-[#1a1f36] dark:text-white">{req.type}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${req.status === "Approved" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                                req.status === "Pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                                                    "bg-red-500/10 text-red-600 dark:text-red-400"
                                                }`}>{req.status}</span>
                                        </div>
                                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mt-1">
                                            <FaCalendarAlt size={10} className="inline mr-1" />
                                            {req.startDate}{req.startDate !== req.endDate ? ` - ${req.endDate}` : ""} ({req.days} day{req.days > 1 ? "s" : ""})
                                        </p>
                                        <p className="text-xs text-[#596887] dark:text-[#B9C7E0] mt-1">{req.reason}</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowDetail(req)} className="px-3 py-1.5 rounded-lg bg-[#45CFFF]/10 text-[#45CFFF] text-xs font-medium hover:bg-[#45CFFF]/20 transition-colors self-start">
                                    <FaEye size={10} className="inline mr-1" />Details
                                </button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-sm text-[#A0AEC0]">No leave requests found</div>
                    )}
                </div>
            ) : (
                /* Apply Form */
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-6 max-w-2xl">
                    <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white mb-6">New Leave Request</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Leave Type</label>
                            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                {leaveTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Start Date</label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                            <div>
                                <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">End Date</label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Reason</label>
                            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder="Please describe the reason for your leave..."
                                className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] resize-none" />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button onClick={handleApply} disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1E56E0] to-[#45CFFF] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50">
                                {submitting ? <><FaSpinner className="animate-spin" size={14} /> Submitting...</> : <><FaPaperPlane size={12} /> Submit Request</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Leave Details</h3>
                            <button onClick={() => setShowDetail(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-3">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${showDetail.status === "Approved" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                    showDetail.status === "Pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                                        "bg-red-500/10 text-red-600 dark:text-red-400"
                                    }`}>{showDetail.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div><p className="text-[#718096] dark:text-[#A0AEC0]">Type</p><p className="font-medium text-[#1a1f36] dark:text-white">{showDetail.type}</p></div>
                                <div><p className="text-[#718096] dark:text-[#A0AEC0]">Duration</p><p className="font-medium text-[#1a1f36] dark:text-white">{showDetail.days} day{showDetail.days > 1 ? "s" : ""}</p></div>
                                <div><p className="text-[#718096] dark:text-[#A0AEC0]">From</p><p className="font-medium text-[#1a1f36] dark:text-white">{showDetail.startDate}</p></div>
                                <div><p className="text-[#718096] dark:text-[#A0AEC0]">To</p><p className="font-medium text-[#1a1f36] dark:text-white">{showDetail.endDate}</p></div>
                            </div>
                            <div><p className="text-[#718096] dark:text-[#A0AEC0] text-sm">Reason</p><p className="text-sm font-medium text-[#1a1f36] dark:text-white mt-1">{showDetail.reason}</p></div>
                            <div><p className="text-[#718096] dark:text-[#A0AEC0] text-sm">Applied On</p><p className="text-sm font-medium text-[#1a1f36] dark:text-white mt-1">{showDetail.appliedOn}</p></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
