import { useState, useEffect, useCallback } from "react";
import {
    FaCheckCircle, FaTimesCircle,
    FaSearch, FaUsers, FaTimes, FaSpinner, FaUserCheck, FaPlus, FaEdit, FaTrash,
} from "react-icons/fa";
import { attendanceApi, employeesApi, type AttendanceData, type AttendanceStats, type EmployeeData } from "../../services";
import Pagination from "../../components/shared/Pagination";
import DateRangePicker from "../../components/shared/DateRangePicker";
import Swal from "sweetalert2";

const statusColors: Record<string, string> = {
    Present: "bg-green-500/10 text-green-600 dark:text-green-400",
    Absent: "bg-red-500/10 text-red-600 dark:text-red-400",
    "On Leave": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    "Half Day": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    Late: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};
const departments = ["All", "Development", "Design", "Marketing", "HR", "Finance", "Operations"];

export default function Attendance() {
    const [records, setRecords] = useState<AttendanceData[]>([]);
    const [stats, setStats] = useState<AttendanceStats | null>(null);
    const [allEmployees, setAllEmployees] = useState<EmployeeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, _setDate] = useState(new Date().toISOString().split("T")[0]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<AttendanceData | null>(null);

    // Form
    const [formEmployeeId, setFormEmployeeId] = useState("");
    const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
    const [formCheckIn, setFormCheckIn] = useState("");
    const [formCheckOut, setFormCheckOut] = useState("");
    const [formHours, setFormHours] = useState("");
    const [formStatus, setFormStatus] = useState("Present");

    const fetchRecords = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = { page, per_page: 10 };
            if (fromDate && toDate) {
                params.from_date = fromDate;
                params.to_date = toDate;
            } else {
                params.date = date;
            }
            if (statusFilter !== "all") params.status = statusFilter;
            if (deptFilter !== "All") params.department = deptFilter;
            if (search) params.search = search;
            const res = await attendanceApi.getAll(params as Parameters<typeof attendanceApi.getAll>[0]);
            setRecords(res.data.data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            Swal.fire("Error", "Failed to load attendance", "error");
        } finally {
            setLoading(false);
        }
    }, [date, statusFilter, deptFilter, search, page, fromDate, toDate]);

    const fetchStats = useCallback(async () => {
        try { const res = await attendanceApi.stats({ date }); setStats(res.data); } catch { /* non-critical */ }
    }, [date]);

    const fetchEmployees = useCallback(async () => {
        try { const res = await employeesApi.getAll({ per_page: 100 }); setAllEmployees(res.data.data); } catch { /* non-critical */ }
    }, []);

    useEffect(() => { fetchRecords(); }, [fetchRecords]);
    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
    useEffect(() => { setPage(1); }, [statusFilter, deptFilter, search, date, fromDate, toDate]);

    const resetForm = () => { setFormEmployeeId(""); setFormDate(new Date().toISOString().split("T")[0]); setFormCheckIn(""); setFormCheckOut(""); setFormHours(""); setFormStatus("Present"); setEditing(null); };

    const openAddModal = () => { resetForm(); setShowModal(true); };
    const openEditModal = (rec: AttendanceData) => {
        setEditing(rec);
        setFormEmployeeId(String(rec.employee_id)); setFormDate(rec.date); setFormCheckIn(rec.check_in || ""); setFormCheckOut(rec.check_out || ""); setFormHours(String(rec.hours)); setFormStatus(rec.status);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formEmployeeId || !formDate) { Swal.fire("Validation", "Employee and date are required", "warning"); return; }
        try {
            const payload = { employee_id: Number(formEmployeeId), date: formDate, check_in: formCheckIn || undefined, check_out: formCheckOut || undefined, hours: formHours ? Number(formHours) : undefined, status: formStatus as "Present" | "Absent" | "On Leave" | "Half Day" | "Late" };
            if (editing) {
                await attendanceApi.update(editing.id, payload);
                Swal.fire({ icon: "success", title: "Updated", timer: 1500, showConfirmButton: false });
            } else {
                await attendanceApi.create(payload);
                Swal.fire({ icon: "success", title: "Recorded", timer: 1500, showConfirmButton: false });
            }
            setShowModal(false); resetForm();
            fetchRecords(); fetchStats();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save attendance";
            Swal.fire("Error", msg, "error");
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({ icon: "warning", title: "Delete record?", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
        if (!result.isConfirmed) return;
        try {
            await attendanceApi.delete(id);
            fetchRecords(); fetchStats();
            Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to delete", "error"); }
    };

    const summaryCards = [
        { label: "Total Employees", value: stats?.total_employees ?? 0, icon: FaUsers, color: "from-[#45CFFF] to-[#1E56E0]" },
        { label: "Present", value: stats?.present ?? 0, icon: FaCheckCircle, color: "from-[#10B981] to-[#059669]" },
        { label: "Absent", value: stats?.absent ?? 0, icon: FaTimesCircle, color: "from-[#EF4444] to-[#DC2626]" },
        { label: "Attendance Rate", value: `${stats?.attendance_rate ?? 0}%`, icon: FaUserCheck, color: "from-[#8B5CF6] to-[#6D28D9]" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Attendance Tracker</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{stats?.present ?? 0} present today &bull; {stats?.absent ?? 0} absent</p>
                </div>
                <div className="flex items-center gap-3">
                    <DateRangePicker
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}
                        onClear={() => { setFromDate(""); setToDate(""); }}
                    />
                    <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                        <FaPlus size={14} />Mark Attendance
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
                    <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                </div>
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                    {departments.map((d) => <option key={d}>{d === "All" ? "All Departments" : d}</option>)}
                </select>
                <div className="flex gap-2 flex-wrap">
                    {["all", "Present", "Absent", "On Leave", "Half Day", "Late"].map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-[#45CFFF] text-white shadow-md" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}>
                            {s === "all" ? "All" : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Attendance Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                {["Employee", "Department", "Check In", "Check Out", "Hours", "Status", ""].map((h, i) => (
                                    <th key={i} className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-[#A0AEC0]"><FaSpinner className="mx-auto animate-spin" size={20} /></td></tr>
                            ) : records.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[#A0AEC0]">No attendance records for this date.</td></tr>
                            ) : records.map((rec) => (
                                <tr key={rec.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-xs font-bold">{rec.employee?.name?.charAt(0) || "?"}</div>
                                            <div><p className="text-sm font-medium text-[#1a1f36] dark:text-white">{rec.employee?.name || "Unknown"}</p><p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{rec.employee?.role || ""}</p></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{rec.employee?.department || ""}</td>
                                    <td className="px-6 py-3.5 text-sm font-mono text-[#1a1f36] dark:text-white">{rec.check_in || "—"}</td>
                                    <td className="px-6 py-3.5 text-sm font-mono text-[#1a1f36] dark:text-white">{rec.check_out || "—"}</td>
                                    <td className="px-6 py-3.5 text-sm font-mono text-[#1a1f36] dark:text-white">{rec.hours ? `${rec.hours}h` : "—"}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[rec.status] || ""}`}>{rec.status}</span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => openEditModal(rec)} className="px-2 py-1 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] text-xs transition-colors" title="Edit"><FaEdit size={12} /></button>
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

            {/* Add / Edit Attendance Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">{editing ? "Edit Attendance" : "Mark Attendance"}</h3>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/6"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Employee *</label>
                                <select value={formEmployeeId} onChange={(e) => setFormEmployeeId(e.target.value)} disabled={!!editing}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF] disabled:opacity-50">
                                    <option value="">Select employee</option>
                                    {allEmployees.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.department})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Date *</label>
                                    <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Status</label>
                                    <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                        {["Present", "Absent", "On Leave", "Half Day", "Late"].map((s) => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Check In</label>
                                    <input type="time" value={formCheckIn} onChange={(e) => setFormCheckIn(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Check Out</label>
                                    <input type="time" value={formCheckOut} onChange={(e) => setFormCheckOut(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Hours</label>
                                    <input type="number" step="0.5" value={formHours} onChange={(e) => setFormHours(e.target.value)} placeholder="8"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6">Cancel</button>
                            <button onClick={handleSubmit} disabled={!formEmployeeId || !formDate}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                <FaPlus size={12} />{editing ? "Update" : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
