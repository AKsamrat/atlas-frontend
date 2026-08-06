import { useState, useEffect, useCallback } from "react";
import {
    FaClock, FaCheckCircle, FaTimes, FaCalendarAlt,
    FaHistory, FaPaperPlane, FaEye, FaSpinner,
} from "react-icons/fa";
import { userApi, type MyLeaveRequest } from "../../services";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

type ViewMode = "history" | "apply";

const statusColors: Record<string, string> = {
    Approved: "bg-green-500/10 text-green-600 dark:text-green-400",
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const leaveTypes = ["Annual Leave", "Sick Leave", "Casual Leave", "Maternity", "Paternity", "Unpaid Leave"];

const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
    catch { return d; }
};

export default function UserLeave() {
    const { addNotification } = useNotifications();
    const { user } = useAuth();
    const [view, setView] = useState<ViewMode>("history");
    const [requests, setRequests] = useState<MyLeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [showDetail, setShowDetail] = useState<MyLeaveRequest | null>(null);

    const [leaveType, setLeaveType] = useState("Annual Leave");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchLeaves = useCallback(async () => {
        try {
            setLoading(true);
            const res = await userApi.getLeaves({ per_page: 50 });
            setRequests(res.data.data || []);
        } catch {
            Swal.fire("Error", "Failed to load leave requests", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

    const filtered = requests.filter((r) => filter === "All" || r.status === filter);

    const balances = [
        { type: "Annual Leave", total: 12, used: requests.filter((l) => l.type === "Annual Leave" && l.status === "Approved").reduce((s, l) => s + l.days, 0), icon: "\u{1F3D6}\uFE0F", color: "from-[#1E56E0] to-[#45CFFF]" },
        { type: "Sick Leave", total: 10, used: requests.filter((l) => l.type === "Sick Leave" && l.status === "Approved").reduce((s, l) => s + l.days, 0), icon: "\u{1F912}", color: "from-[#EF4444] to-[#DC2626]" },
        { type: "Casual Leave", total: 10, used: requests.filter((l) => l.type === "Casual Leave" && l.status === "Approved").reduce((s, l) => s + l.days, 0), icon: "\u{1F3E0}", color: "from-[#10B981] to-[#059669]" },
        { type: "Maternity", total: 90, used: requests.filter((l) => l.type === "Maternity" && l.status === "Approved").reduce((s, l) => s + l.days, 0), icon: "\u{1F476}", color: "from-[#F59E0B] to-[#D97706]" },
    ];

    const daysBetween = (d1: string, d2: string) => {
        const start = new Date(d1);
        const end = new Date(d2);
        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return Math.max(1, diff);
    };

    const handleApply = async () => {
        if (!startDate || !endDate || !reason) {
            Swal.fire("Validation", "Please fill in all fields", "warning");
            return;
        }
        try {
            setSubmitting(true);
            await userApi.createLeave({
                type: leaveType,
                from_date: startDate,
                to_date: endDate,
                days: daysBetween(startDate, endDate),
                reason,
            });
            setStartDate(""); setEndDate(""); setReason("");
            addNotification({
                panel: "admin",
                type: "leave_requested",
                title: "New Leave Request",
                message: `${user?.name || "Employee"} requested ${leaveType} from ${startDate} to ${endDate}`,
                link: "/dashboard/leave",
            });
            Swal.fire({ icon: "success", title: "Leave Request Submitted!", timer: 2000, showConfirmButton: false });
            setView("history");
            fetchLeaves();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to submit leave request";
            Swal.fire("Error", msg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <FaSpinner className="animate-spin text-[#45CFFF]" size={32} />
                <span className="ml-3 text-[#718096] dark:text-[#A0AEC0]">Loading leave requests...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {balances.map((b) => (
                    <div key={b.type} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform text-lg`}>
                                {b.icon}
                            </div>
                            <div>
                                <p className="text-[11px] text-[#718096] dark:text-[#A0AEC0]">{b.type}</p>
                                <p className="text-lg font-sora font-bold text-[#1a1f36] dark:text-white">{b.total - b.used}</p>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-br ${b.color}`} style={{ width: `${b.total > 0 ? (b.used / b.total) * 100 : 0}%` }} />
                        </div>
                        <p className="text-[10px] text-[#A0AEC0] mt-1">{b.used} of {b.total} used</p>
                    </div>
                ))}
            </div>

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
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[req.status] || ""}`}>{req.status}</span>
                                        </div>
                                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mt-1">
                                            <FaCalendarAlt size={10} className="inline mr-1" />
                                            {fmtDate(req.from_date)}{req.from_date !== req.to_date ? ` - ${fmtDate(req.to_date)}` : ""} ({req.days} day{req.days > 1 ? "s" : ""})
                                        </p>
                                        {req.reason && <p className="text-xs text-[#596887] dark:text-[#B9C7E0] mt-1">{req.reason}</p>}
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
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                        </div>
                        {startDate && endDate && (
                            <p className="text-xs text-[#45CFFF] font-medium">
                                {daysBetween(startDate, endDate)} day{daysBetween(startDate, endDate) > 1 ? "s" : ""} requested
                            </p>
                        )}
                        <div>
                            <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Reason *</label>
                            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Please provide a reason for your leave request..."
                                className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] resize-none" />
                        </div>
                        <button onClick={handleApply} disabled={submitting || !startDate || !endDate || !reason}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                            {submitting ? <><FaSpinner className="animate-spin" size={14} /> Submitting...</> : <><FaPaperPlane size={14} /> Submit Request</>}
                        </button>
                    </div>
                </div>
            )}

            {showDetail && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Leave Details</h3>
                            <button onClick={() => setShowDetail(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-3">
                            <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Type</span><span className="font-medium text-[#1a1f36] dark:text-white">{showDetail.type}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Status</span><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[showDetail.status]}`}>{showDetail.status}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">From</span><span className="font-medium text-[#1a1f36] dark:text-white">{fmtDate(showDetail.from_date)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">To</span><span className="font-medium text-[#1a1f36] dark:text-white">{fmtDate(showDetail.to_date)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Duration</span><span className="font-medium text-[#1a1f36] dark:text-white">{showDetail.days} day{showDetail.days > 1 ? "s" : ""}</span></div>
                            {showDetail.reason && <div><p className="text-xs text-[#718096] dark:text-[#A0AEC0] mb-1">Reason</p><p className="text-sm text-[#1a1f36] dark:text-white">{showDetail.reason}</p></div>}
                        </div>
                        <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748] flex justify-end">
                            <button onClick={() => setShowDetail(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
