import { useState, useEffect, useMemo, useCallback } from "react";
import {
    FaClock, FaCalendarAlt,
    FaHistory, FaPlay, FaStop, FaSpinner,
} from "react-icons/fa";
import { userApi, type MyAttendance } from "../../services";
import Pagination from "../../components/shared/Pagination";
import DateRangePicker from "../../components/shared/DateRangePicker";
import Swal from "sweetalert2";

type ViewMode = "today" | "history";

const statusColors: Record<string, string> = {
    Present: "bg-green-500/10 text-green-600 dark:text-green-400",
    Absent: "bg-red-500/10 text-red-600 dark:text-red-400",
    Late: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    "Half Day": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    "On Leave": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
    catch { return d; }
};

export default function UserAttendance() {
    const [view, setView] = useState<ViewMode>("today");
    const [records, setRecords] = useState<MyAttendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [clockedInToday, setClockedInToday] = useState(false);
    const [todayRecord, setTodayRecord] = useState<MyAttendance | null>(null);
    const [elapsed, setElapsed] = useState("00:00:00");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [actionLoading, setActionLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!clockedInToday || !todayRecord?.check_in) return;
        const timer = setInterval(() => {
            const now = new Date();
            const [h, m] = (todayRecord.check_in || "00:00").split(":").map(Number);
            const checkInTime = new Date(todayRecord.date);
            checkInTime.setHours(h, m, 0, 0);
            const diff = now.getTime() - checkInTime.getTime();
            if (diff < 0) { setElapsed("00:00:00"); return; }
            const hours = Math.floor(diff / 3600000);
            const mins = Math.floor((diff % 3600000) / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            setElapsed(`${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
        }, 1000);
        return () => clearInterval(timer);
    }, [clockedInToday, todayRecord]);

    const fetchAttendance = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = { per_page: 10, page };
            if (fromDate) params.from_date = fromDate;
            if (toDate) params.to_date = toDate;
            const res = await userApi.getAttendance(params as Parameters<typeof userApi.getAttendance>[0]);
            const data = res.data.data || [];
            setRecords(data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
            const today = new Date().toISOString().split("T")[0];
            const todayRec = data.find((r) => r.date === today);
            if (todayRec) {
                setClockedInToday(true);
                setTodayRecord(todayRec);
            } else {
                setClockedInToday(false);
                setTodayRecord(null);
            }
        } catch {
            Swal.fire("Error", "Failed to load attendance data", "error");
        } finally {
            setLoading(false);
        }
    }, [page, fromDate, toDate]);

    useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

    useEffect(() => { setPage(1); }, [fromDate, toDate]);

    const todayStats = useMemo(() => {
        const present = records.filter((r) => r.status === "Present" || r.status === "Late").length;
        const absent = records.filter((r) => r.status === "Absent").length;
        const halfDay = records.filter((r) => r.status === "Half Day").length;
        return { present, absent, halfDay, total: records.length };
    }, [records]);

    const handleClockIn = async () => {
        try {
            setActionLoading(true);
            const res = await userApi.clockIn();
            const rec = res.data as MyAttendance;
            setClockedInToday(true);
            setTodayRecord(rec);
            setRecords((prev) => [rec, ...prev]);
            Swal.fire({ icon: "success", title: "Clocked In!", text: `You clocked in at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`, timer: 2000, showConfirmButton: false });
        } catch {
            Swal.fire("Error", "Failed to clock in. Please try again.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleClockOut = async () => {
        try {
            setActionLoading(true);
            const res = await userApi.clockOut();
            const updated = res.data as MyAttendance;
            setClockedInToday(false);
            setTodayRecord(updated);
            setElapsed("00:00:00");
            setRecords((prev) => prev.map((r) => r.date === updated.date ? updated : r));
            Swal.fire({ icon: "success", title: "Clocked Out!", text: `You clocked out at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`, timer: 2000, showConfirmButton: false });
        } catch {
            Swal.fire("Error", "Failed to clock out. Please try again.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <FaSpinner className="animate-spin text-[#45CFFF]" size={32} />
                <span className="ml-3 text-[#718096] dark:text-[#A0AEC0]">Loading attendance...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex gap-2">
                <button onClick={() => setView("today")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "today" ? "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-white shadow-lg" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#596887] dark:text-[#B9C7E0]"}`}>
                    <FaClock size={12} className="inline mr-2" />Today
                </button>
                <button onClick={() => setView("history")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "history" ? "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-white shadow-lg" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#596887] dark:text-[#B9C7E0]"}`}>
                    <FaHistory size={12} className="inline mr-2" />History
                </button>
            </div>

            {view === "today" ? (
                <>
                    <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-8 text-center">
                        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#1E56E0] to-[#45CFFF] flex items-center justify-center shadow-2xl relative">
                            <div className="absolute inset-1 rounded-full border-2 border-dashed border-white/30 animate-spin" style={{ animationDuration: "20s" }} />
                            <div className="text-center">
                                <p className="text-3xl font-mono font-bold text-white">{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</p>
                                <p className="text-xs text-white/70 mt-1">{currentTime.toLocaleDateString("en-US", { weekday: "short" })}</p>
                            </div>
                        </div>
                        <p className="text-sm text-[#718096] dark:text-[#A0AEC0] mb-1">{currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                        {clockedInToday && (
                            <div className="mt-4">
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mb-1">Elapsed Time</p>
                                <p className="text-4xl font-mono font-bold text-[#45CFFF]">{elapsed}</p>
                                <p className="text-xs text-[#A0AEC0] mt-2">Clocked in at {todayRecord?.check_in || "\u2014"}</p>
                            </div>
                        )}
                        {todayRecord?.check_out && (
                            <p className="text-xs text-[#A0AEC0] mt-2">Clocked out at {todayRecord.check_out} — {todayRecord.hours}h worked</p>
                        )}
                        <div className="flex justify-center gap-4 mt-6">
                            {!clockedInToday ? (
                                <button onClick={handleClockIn} disabled={actionLoading} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50">
                                    {actionLoading ? <FaSpinner className="animate-spin" size={14} /> : <FaPlay size={14} />} Clock In
                                </button>
                            ) : (
                                <button onClick={handleClockOut} disabled={actionLoading} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50">
                                    {actionLoading ? <FaSpinner className="animate-spin" size={14} /> : <FaStop size={14} />} Clock Out
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Total Days", value: todayStats.total, color: "from-[#45CFFF] to-[#1E56E0]" },
                            { label: "Present", value: todayStats.present, color: "from-[#10B981] to-[#059669]" },
                            { label: "Absent", value: todayStats.absent, color: "from-[#EF4444] to-[#DC2626]" },
                            { label: "Half Day", value: todayStats.halfDay, color: "from-[#F59E0B] to-[#D97706]" },
                        ].map((s) => (
                            <div key={s.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 text-center">
                                <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-2`}>
                                    <FaCalendarAlt size={16} />
                                </div>
                                <p className="text-2xl font-sora font-bold text-[#1a1f36] dark:text-white">{s.value}</p>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <DateRangePicker
                            fromDate={fromDate}
                            toDate={toDate}
                            onFromDateChange={setFromDate}
                            onToDateChange={setToDate}
                            onClear={() => { setFromDate(""); setToDate(""); }}
                        />
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                        {["Date", "Check In", "Check Out", "Hours", "Status"].map((h, i) => (
                                            <th key={i} className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((rec) => (
                                        <tr key={rec.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-3.5 text-sm font-medium text-[#1a1f36] dark:text-white">{fmtDate(rec.date)}</td>
                                            <td className="px-6 py-3.5 text-sm font-mono text-[#1a1f36] dark:text-white">{rec.check_in || "\u2014"}</td>
                                            <td className="px-6 py-3.5 text-sm font-mono text-[#1a1f36] dark:text-white">{rec.check_out || "\u2014"}</td>
                                            <td className="px-6 py-3.5 text-sm font-mono text-[#45CFFF]">{rec.hours ? `${rec.hours}h` : "0h"}</td>
                                            <td className="px-6 py-3.5">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[rec.status] || ""}`}>{rec.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {records.length === 0 && (
                                        <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-[#A0AEC0]">No attendance records found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <Pagination currentPage={page} totalPages={totalPages} total={total} onPageChange={setPage} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
