import { useState, useEffect, useCallback } from "react";
import {
    FaCalendarCheck, FaCalendarTimes, FaCalendarAlt, FaCheckCircle,
    FaTimesCircle, FaClock, FaPlus, FaSearch, FaTimes, FaEye, FaSpinner, FaTrash,
} from "react-icons/fa";
import { leavesApi, employeesApi, type LeaveRequestData, type LeaveStats, type EmployeeData } from "../../services";
import Swal from "sweetalert2";

const leaveTypes = ["Sick Leave", "Annual Leave", "Personal Leave", "Maternity Leave", "Paternity Leave"];
const statusColors: Record<string, string> = { Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400", Approved: "bg-green-500/10 text-green-600 dark:text-green-400", Rejected: "bg-red-500/10 text-red-600 dark:text-red-400" };

export default function LeaveManagement() {
    const [requests, setRequests] = useState<LeaveRequestData[]>([]);
    const [stats, setStats] = useState<LeaveStats | null>(null);
    const [allEmployees, setAllEmployees] = useState<EmployeeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [viewRequest, setViewRequest] = useState<LeaveRequestData | null>(null);

    // Form
    const [formEmployeeId, setFormEmployeeId] = useState("");
    const [formType, setFormType] = useState(leaveTypes[0]);
    const [formFrom, setFormFrom] = useState("");
    const [formTo, setFormTo] = useState("");
    const [formDays, setFormDays] = useState("");
    const [formReason, setFormReason] = useState("");

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = { page, per_page: 10 };
            if (statusFilter !== "all") params.status = statusFilter;
            if (search) params.search = search;
            const res = await leavesApi.getAll(params as Parameters<typeof leavesApi.getAll>[0]);
            setRequests(res.data.data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            Swal.fire("Error", "Failed to load leave requests", "error");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, search, page]);

    const fetchStats = useCallback(async () => {
        try { const res = await leavesApi.stats(); setStats(res.data); } catch { /* non-critical */ }
    }, []);

    const fetchEmployees = useCallback(async () => {
        try { const res = await employeesApi.getAll({ per_page: 100 }); setAllEmployees(res.data.data); } catch { /* non-critical */ }
    }, []);

    useEffect(() => { fetchRequests(); }, [fetchRequests]);
    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
    useEffect(() => { setPage(1); }, [statusFilter, search]);

    const resetForm = () => { setFormEmployeeId(""); setFormType(leaveTypes[0]); setFormFrom(""); setFormTo(""); setFormDays(""); setFormReason(""); };

    const handleSubmit = async () => {
        if (!formEmployeeId || !formFrom || !formTo || !formDays) { Swal.fire("Validation", "Employee, dates and days are required", "warning"); return; }
        try {
            await leavesApi.create({ employee_id: Number(formEmployeeId), type: formType, from_date: formFrom, to_date: formTo, days: Number(formDays), reason: formReason || undefined });
            Swal.fire({ icon: "success", title: "Leave request submitted", timer: 1500, showConfirmButton: false });
            setShowModal(false); resetForm();
            fetchRequests(); fetchStats();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to submit leave request";
            Swal.fire("Error", msg, "error");
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: "Approved" | "Rejected") => {
        const result = await Swal.fire({ icon: "question", title: `${newStatus} this leave request?`, showCancelButton: true, confirmButtonColor: newStatus === "Approved" ? "#10B981" : "#EF4444", confirmButtonText: newStatus });
        if (!result.isConfirmed) return;
        try {
            await leavesApi.update(id, { status: newStatus });
            fetchRequests(); fetchStats();
            Swal.fire({ icon: "success", title: `Leave ${newStatus.toLowerCase()}`, timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to update status", "error"); }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({ icon: "warning", title: "Delete leave request?", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
        if (!result.isConfirmed) return;
        try {
            await leavesApi.delete(id);
            fetchRequests(); fetchStats();
            Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to delete", "error"); }
    };

    const balanceCards = [
        { type: "Annual Leave", total: 20, used: stats?.approved ?? 0, icon: FaCalendarAlt, color: "from-[#45CFFF] to-[#1E56E0]" },
        { type: "Pending", total: stats?.pending ?? 0, used: 0, icon: FaCalendarCheck, color: "from-[#10B981] to-[#059669]" },
        { type: "Rejected", total: stats?.rejected ?? 0, used: 0, icon: FaCalendarTimes, color: "from-[#F59E0B] to-[#D97706]" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Leave Management</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{stats?.pending ?? 0} pending request{stats?.pending !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                    <FaPlus size={14} />Request Leave
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                {balanceCards.map((card) => {
                    const remaining = card.total - card.used;
                    const pct = card.total > 0 ? Math.min((card.used / card.total) * 100, 100) : 0;
                    return (
                        <div key={card.type} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}><card.icon size={18} /></div>
                                <div><p className="text-[11px] text-[#718096] dark:text-[#A0AEC0]">{card.type}</p><p className="text-lg font-sora font-bold text-[#1a1f36] dark:text-white">{remaining}</p></div>
                            </div>
                            <div className="w-full h-2 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                            </div>
                            <p className="text-[10px] text-[#A0AEC0] mt-1">{card.used} of {card.total} used</p>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                    <input type="text" placeholder="Search by employee name..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["all", "Pending", "Approved", "Rejected"].map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${statusFilter === s ? "bg-[#45CFFF] text-white shadow-md" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}>
                            {s === "all" ? "All" : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Leave Requests Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                {["Employee", "Type", "From", "To", "Days", "Status", ""].map((h, i) => (
                                    <th key={i} className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-[#A0AEC0]"><FaSpinner className="mx-auto animate-spin" size={20} /></td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[#A0AEC0]">No leave requests found.</td></tr>
                            ) : requests.map((req) => (
                                <tr key={req.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-xs font-bold">{req.employee?.name?.charAt(0) || "?"}</div>
                                            <div><p className="text-sm font-medium text-[#1a1f36] dark:text-white">{req.employee?.name || "Unknown"}</p><p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{req.employee?.department || ""}</p></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-[#1a1f36] dark:text-white">{req.type}</td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{new Date(req.from_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{new Date(req.to_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                                    <td className="px-6 py-3.5 text-sm font-mono font-bold text-[#1a1f36] dark:text-white">{req.days}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[req.status] || ""}`}>
                                            {req.status === "Approved" && <FaCheckCircle size={10} className="inline mr-1" />}
                                            {req.status === "Rejected" && <FaTimesCircle size={10} className="inline mr-1" />}
                                            {req.status === "Pending" && <FaClock size={10} className="inline mr-1" />}
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setViewRequest(req)} className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-xs hover:bg-blue-500/20 transition-colors" title="View"><FaEye size={12} /></button>
                                            {req.status === "Pending" && (
                                                <>
                                                    <button onClick={() => handleStatusUpdate(req.id, "Approved")} className="px-2 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-xs hover:bg-green-500/20 transition-colors" title="Approve"><FaCheckCircle size={12} /></button>
                                                    <button onClick={() => handleStatusUpdate(req.id, "Rejected")} className="px-2 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs hover:bg-red-500/20 transition-colors" title="Reject"><FaTimesCircle size={12} /></button>
                                                </>
                                            )}
                                            <button onClick={() => handleDelete(req.id)} className="px-2 py-1 rounded-lg hover:bg-red-500/10 text-[#718096] hover:text-red-500 text-xs transition-colors" title="Delete"><FaTrash size={12} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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

            {/* View Request Detail Modal */}
            {viewRequest && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Leave Request Details</h3>
                            <button onClick={() => setViewRequest(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/6"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-3">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white font-bold">{viewRequest.employee?.name?.charAt(0) || "?"}</div>
                                <div><p className="font-semibold text-[#1a1f36] dark:text-white">{viewRequest.employee?.name || "Unknown"}</p><p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{viewRequest.employee?.department || ""}</p></div>
                            </div>
                            {[["Type", viewRequest.type], ["From", new Date(viewRequest.from_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })], ["To", new Date(viewRequest.to_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })], ["Days", String(viewRequest.days)], ["Reason", viewRequest.reason]].map(([label, val]) => val ? (
                                <div key={label as string} className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">{label}</span><span className="font-medium text-[#1a1f36] dark:text-white text-right max-w-[60%]">{val as string}</span></div>
                            ) : null)}
                            <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Status</span><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[viewRequest.status]}`}>{viewRequest.status}</span></div>
                        </div>
                        <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748] flex justify-end">
                            <button onClick={() => setViewRequest(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Leave Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Request Leave</h3>
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
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Leave Type *</label>
                                <select value={formType} onChange={(e) => setFormType(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                    {leaveTypes.map((t) => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">From *</label>
                                    <input type="date" value={formFrom} onChange={(e) => setFormFrom(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">To *</label>
                                    <input type="date" value={formTo} onChange={(e) => setFormTo(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Days *</label>
                                    <input type="number" min="1" value={formDays} onChange={(e) => setFormDays(e.target.value)} placeholder="1"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Reason</label>
                                <textarea value={formReason} onChange={(e) => setFormReason(e.target.value)} rows={3} placeholder="Optional reason..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] resize-none" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6">Cancel</button>
                            <button onClick={handleSubmit} disabled={!formEmployeeId || !formFrom || !formTo || !formDays}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                <FaPlus size={12} />Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
