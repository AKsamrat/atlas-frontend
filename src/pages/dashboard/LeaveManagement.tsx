import { useState } from "react";
import {
    FaCalendarCheck, FaCalendarTimes, FaCalendarAlt, FaCheckCircle,
    FaTimesCircle, FaClock, FaPlus, FaSearch, FaTimes, FaPaperPlane, FaEye,
} from "react-icons/fa";

interface LeaveRequest {
    id: number;
    employee: string;
    department: string;
    type: string;
    from: string;
    to: string;
    days: number;
    status: "Pending" | "Approved" | "Rejected";
    reason: string;
}

const leaveTypes = ["Sick Leave", "Annual Leave", "Personal Leave", "Maternity Leave", "Paternity Leave"];
const employees = [
    { name: "Karim Ahmed", department: "Development" },
    { name: "Mehedi Hasan", department: "Design" },
    { name: "Fatima Rahman", department: "Marketing" },
    { name: "Sakib Al Hasan", department: "Development" },
    { name: "Nusrat Jahan", department: "HR" },
    { name: "Arif Mahmud", department: "Development" },
    { name: "Tasnim Ahmed", department: "Design" },
    { name: "Rafiq Uddin", department: "Marketing" },
    { name: "Sumaiya Akter", department: "HR" },
    { name: "Tanvir Hossain", department: "Development" },
];

const initialRequests: LeaveRequest[] = [
    { id: 1, employee: "Nusrat Jahan", department: "HR", type: "Sick Leave", from: "Jan 15, 2025", to: "Jan 17, 2025", days: 3, status: "Pending", reason: "Medical appointment and recovery" },
    { id: 2, employee: "Karim Ahmed", department: "Development", type: "Annual Leave", from: "Jan 20, 2025", to: "Jan 24, 2025", days: 5, status: "Approved", reason: "Family vacation" },
    { id: 3, employee: "Mehedi Hasan", department: "Design", type: "Personal Leave", from: "Jan 12, 2025", to: "Jan 12, 2025", days: 1, status: "Approved", reason: "Personal work" },
    { id: 4, employee: "Fatima Rahman", department: "Marketing", type: "Annual Leave", from: "Jan 28, 2025", to: "Jan 31, 2025", days: 4, status: "Pending", reason: "Travel plans" },
    { id: 5, employee: "Sakib Al Hasan", department: "Development", type: "Sick Leave", from: "Jan 10, 2025", to: "Jan 11, 2025", days: 2, status: "Rejected", reason: "Flu symptoms" },
    { id: 6, employee: "Arif Mahmud", department: "Development", type: "Maternity Leave", from: "Feb 1, 2025", to: "May 1, 2025", days: 90, status: "Approved", reason: "Maternity leave" },
    { id: 7, employee: "Tasnim Ahmed", department: "Design", type: "Annual Leave", from: "Feb 5, 2025", to: "Feb 7, 2025", days: 3, status: "Pending", reason: "Family event" },
    { id: 8, employee: "Rafiq Uddin", department: "Marketing", type: "Personal Leave", from: "Jan 8, 2025", to: "Jan 8, 2025", days: 1, status: "Approved", reason: "Urgent personal matter" },
];

const initialBalances = [
    { type: "Annual Leave", icon: FaCalendarAlt, total: 20, used: 8, color: "from-[#45CFFF] to-[#1E56E0]" },
    { type: "Sick Leave", icon: FaCalendarCheck, total: 10, used: 3, color: "from-[#10B981] to-[#059669]" },
    { type: "Personal Leave", icon: FaCalendarTimes, total: 5, used: 2, color: "from-[#F59E0B] to-[#D97706]" },
];

function daysBetween(a: string, b: string) {
    const d1 = new Date(a);
    const d2 = new Date(b);
    return Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / 86400000) + 1);
}

function formatDate(d: Date) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function LeaveManagement() {
    const [requests, setRequests] = useState(initialRequests);
    const [balances, setBalances] = useState(initialBalances);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState<LeaveRequest | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const [formEmployee, setFormEmployee] = useState(employees[0].name);
    const [formType, setFormType] = useState(leaveTypes[0]);
    const [formFrom, setFormFrom] = useState("");
    const [formTo, setFormTo] = useState("");
    const [formReason, setFormReason] = useState("");

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const updateStatus = (id: number, newStatus: "Approved" | "Rejected") => {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
        const req = requests.find((r) => r.id === id);
        if (newStatus === "Approved" && req) {
            setBalances((prev) => prev.map((b) => b.type === req.type ? { ...b, used: b.used + req.days } : b));
        }
        showToast(`Request ${newStatus.toLowerCase()} successfully`);
    };

    const handleCreate = () => {
        if (!formFrom || !formTo || !formReason) return;
        const emp = employees.find((e) => e.name === formEmployee);
        const days = daysBetween(formFrom, formTo);
        const newReq: LeaveRequest = {
            id: Date.now(), employee: formEmployee, department: emp?.department || "N/A",
            type: formType, from: formatDate(new Date(formFrom)), to: formatDate(new Date(formTo)),
            days, status: "Pending", reason: formReason,
        };
        setRequests((prev) => [newReq, ...prev]);
        setShowCreateModal(false); setFormFrom(""); setFormTo(""); setFormReason("");
        showToast("Leave request submitted successfully");
    };

    const filtered = requests.filter((r) => {
        const matchSearch = r.employee.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()) || r.department.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || r.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const pendingCount = requests.filter((r) => r.status === "Pending").length;

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
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Leave Management</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{pendingCount} pending request{pendingCount !== 1 ? "s" : ""} awaiting review</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                    <FaPlus size={14} />Request Leave
                </button>
            </div>

            {/* Leave Balances */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {initialBalances.map((balance) => {
                    const bal = balances.find((b) => b.type === balance.type) || balance;
                    const remaining = bal.total - bal.used;
                    const pct = (bal.used / bal.total) * 100;
                    return (
                        <div key={bal.type} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bal.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                    <balance.icon size={18} />
                                </div>
                                <span className="text-xs font-mono text-[#718096] dark:text-[#A0AEC0]">{bal.used}/{bal.total} days</span>
                            </div>
                            <p className="text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">{bal.type}</p>
                            <p className="text-2xl font-sora font-bold text-[#1a1f36] dark:text-white">{remaining} <span className="text-sm font-normal text-[#718096] dark:text-[#A0AEC0]">remaining</span></p>
                            <div className="mt-3 w-full h-2 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${bal.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                    <input type="text" placeholder="Search by employee, type, or department..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["All", "Pending", "Approved", "Rejected"].map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-[#45CFFF] text-white shadow-md" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}>
                            {s}
                            {s === "Pending" && pendingCount > 0 && <span className="ml-1.5 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                {["Employee", "Type", "Duration", "Days", "Reason", "Status", ""].map((h, i) => (
                                    <th key={i} className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((req) => (
                                <tr key={req.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5"><div><p className="text-sm font-medium text-[#1a1f36] dark:text-white">{req.employee}</p><p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{req.department}</p></div></td>
                                    <td className="px-6 py-3.5"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#45CFFF]/10 text-[#45CFFF]">{req.type}</span></td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{req.from} {"\u2014"} {req.to}</td>
                                    <td className="px-6 py-3.5 text-sm font-mono font-semibold text-[#1a1f36] dark:text-white">{req.days}d</td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0] max-w-[200px] truncate">{req.reason}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${req.status === "Approved" ? "bg-green-500/10 text-green-600 dark:text-green-400" : req.status === "Rejected" ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
                                            {req.status === "Approved" && <FaCheckCircle size={10} className="inline mr-1" />}
                                            {req.status === "Rejected" && <FaTimesCircle size={10} className="inline mr-1" />}
                                            {req.status === "Pending" && <FaClock size={10} className="inline mr-1" />}
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setShowDetailModal(req)} className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-xs hover:bg-blue-500/20 transition-colors" title="View details"><FaEye size={12} /></button>
                                            {req.status === "Pending" && (
                                                <>
                                                    <button onClick={() => updateStatus(req.id, "Approved")} className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"><FaCheckCircle size={12} className="inline mr-1" /> Approve</button>
                                                    <button onClick={() => updateStatus(req.id, "Rejected")} className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"><FaTimesCircle size={12} className="inline mr-1" /> Reject</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (<tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[#A0AEC0]">No leave requests match your search.</td></tr>)}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CREATE MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <div>
                                <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white text-lg">New Leave Request</h3>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mt-0.5">Submit a new leave request for approval</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06] transition-colors"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Employee</label>
                                <select value={formEmployee} onChange={(e) => setFormEmployee(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                    {employees.map((e) => (<option key={e.name} value={e.name}>{e.name} {"\u2014"} {e.department}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Leave Type</label>
                                <select value={formType} onChange={(e) => setFormType(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                    {leaveTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">From</label>
                                    <input type="date" value={formFrom} onChange={(e) => setFormFrom(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">To</label>
                                    <input type="date" value={formTo} onChange={(e) => setFormTo(e.target.value)} min={formFrom} className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Reason</label>
                                <textarea value={formReason} onChange={(e) => setFormReason(e.target.value)} rows={3} placeholder="Describe the reason for your leave request..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] resize-none" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06] transition-colors">Cancel</button>
                            <button onClick={handleCreate} disabled={!formFrom || !formTo || !formReason}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                                <FaPaperPlane size={12} />Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAIL MODAL */}
            {showDetailModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Leave Details</h3>
                            <button onClick={() => setShowDetailModal(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06] transition-colors"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white font-bold font-sora text-lg">{showDetailModal.employee.charAt(0)}</div>
                                <div><p className="font-semibold text-[#1a1f36] dark:text-white">{showDetailModal.employee}</p><p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{showDetailModal.department}</p></div>
                            </div>
                            {[{ label: "Leave Type", value: showDetailModal.type }, { label: "From", value: showDetailModal.from }, { label: "To", value: showDetailModal.to }, { label: "Duration", value: `${showDetailModal.days} day${showDetailModal.days !== 1 ? "s" : ""}` }, { label: "Reason", value: showDetailModal.reason }].map((row) => (
                                <div key={row.label} className="flex items-start justify-between py-2 border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 last:border-none">
                                    <span className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0]">{row.label}</span>
                                    <span className="text-sm text-[#1a1f36] dark:text-white text-right max-w-[60%]">{row.value}</span>
                                </div>
                            ))}
                            <div className="flex items-center justify-between py-2">
                                <span className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0]">Status</span>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${showDetailModal.status === "Approved" ? "bg-green-500/10 text-green-600 dark:text-green-400" : showDetailModal.status === "Rejected" ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>{showDetailModal.status}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            {showDetailModal.status === "Pending" && (
                                <>
                                    <button onClick={() => { updateStatus(showDetailModal.id, "Approved"); setShowDetailModal(null); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"><FaCheckCircle size={12} /> Approve</button>
                                    <button onClick={() => { updateStatus(showDetailModal.id, "Rejected"); setShowDetailModal(null); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"><FaTimesCircle size={12} /> Reject</button>
                                </>
                            )}
                            <button onClick={() => setShowDetailModal(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06] transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}