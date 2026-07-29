import { useState, useEffect, useMemo } from "react";
import {
    FaClock, FaCalendarAlt,
    FaCheckCircle, FaTimes, FaHistory, FaPlay, FaStop,
} from "react-icons/fa";

type ViewMode = "today" | "history";

interface AttendanceRecord {
    id: number;
    date: string;
    checkIn: string;
    checkOut: string;
    status: "Present" | "Absent" | "Half Day" | "Late";
    hours: string;
}

const initialHistory: AttendanceRecord[] = [
    { id: 1, date: "Jul 28, 2026", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "Present", hours: "8h 30m" },
    { id: 2, date: "Jul 27, 2026", checkIn: "09:15 AM", checkOut: "06:00 PM", status: "Present", hours: "8h 45m" },
    { id: 3, date: "Jul 26, 2026", checkIn: "\u2014", checkOut: "\u2014", status: "Absent", hours: "0h" },
    { id: 4, date: "Jul 25, 2026", checkIn: "08:55 AM", checkOut: "05:45 PM", status: "Present", hours: "8h 50m" },
    { id: 5, date: "Jul 24, 2026", checkIn: "09:30 AM", checkOut: "01:00 PM", status: "Half Day", hours: "3h 30m" },
    { id: 6, date: "Jul 23, 2026", checkIn: "09:45 AM", checkOut: "06:15 PM", status: "Late", hours: "8h 30m" },
    { id: 7, date: "Jul 22, 2026", checkIn: "08:50 AM", checkOut: "05:30 PM", status: "Present", hours: "8h 40m" },
    { id: 8, date: "Jul 21, 2026", checkIn: "09:00 AM", checkOut: "05:00 PM", status: "Present", hours: "8h" },
    { id: 9, date: "Jul 20, 2026", checkIn: "\u2014", checkOut: "\u2014", status: "Absent", hours: "0h" },
    { id: 10, date: "Jul 19, 2026", checkIn: "09:05 AM", checkOut: "05:35 PM", status: "Present", hours: "8h 30m" },
];

export default function UserAttendance() {
    const [view, setView] = useState<ViewMode>("today");
    const [history, setHistory] = useState(initialHistory);
    const [clockInTime, setClockInTime] = useState<Date | null>(null);
    const [elapsed, setElapsed] = useState("00:00:00");
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [editDate, setEditDate] = useState("");
    const [editTime, setEditTime] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!isClockedIn || !clockInTime) return;
        const timer = setInterval(() => {
            const diff = Date.now() - clockInTime.getTime();
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setElapsed(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
        }, 1000);
        return () => clearInterval(timer);
    }, [isClockedIn, clockInTime]);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const handleClockIn = () => {
        const now = new Date();
        setClockInTime(now);
        setIsClockedIn(true);
        const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        showToast(`Clocked in at ${timeStr}`);
    };

    const handleClockOut = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        const newRecord: AttendanceRecord = {
            id: Date.now(),
            date: dateStr,
            checkIn: clockInTime ? clockInTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) : "\u2014",
            checkOut: timeStr,
            status: "Present",
            hours: elapsed,
        };
        setHistory((prev) => [newRecord, ...prev]);
        setIsClockedIn(false);
        setClockInTime(null);
        setElapsed("00:00:00");
        showToast(`Clocked out at ${timeStr}`);
    };

    const handleEditTime = () => {
        if (!selectedRecord || !editTime) return;
        setHistory((prev) => prev.map((r) => r.id === selectedRecord.id ? { ...r, checkIn: editTime } : r));
        setShowEditModal(false);
        setSelectedRecord(null);
        showToast("Attendance time updated");
    };

    const todayStats = useMemo(() => {
        const present = history.filter((r) => r.status === "Present" || r.status === "Late").length;
        const absent = history.filter((r) => r.status === "Absent").length;
        const halfDay = history.filter((r) => r.status === "Half Day").length;
        return { present, absent, halfDay, total: history.length };
    }, [history]);

    return (
        <div className="space-y-6 relative">
            {toast && (
                <div className="fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl bg-green-500 text-white text-sm font-semibold shadow-2xl">
                    <div className="flex items-center gap-2"><FaCheckCircle />{toast}</div>
                </div>
            )}

            {/* View Toggle */}
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
                    {/* Live Clock Card */}
                    <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-8 text-center">
                        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#1E56E0] to-[#45CFFF] flex items-center justify-center shadow-2xl relative">
                            <div className="absolute inset-1 rounded-full border-2 border-dashed border-white/30 animate-spin" style={{ animationDuration: "20s" }} />
                            <div className="text-center">
                                <p className="text-3xl font-mono font-bold text-white">{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</p>
                                <p className="text-xs text-white/70 mt-1">{currentTime.toLocaleDateString("en-US", { weekday: "short" })}</p>
                            </div>
                        </div>
                        <p className="text-sm text-[#718096] dark:text-[#A0AEC0] mb-1">{currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                        {isClockedIn && (
                            <div className="mt-4">
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mb-1">Elapsed Time</p>
                                <p className="text-4xl font-mono font-bold text-[#45CFFF]">{elapsed}</p>
                                <p className="text-xs text-[#A0AEC0] mt-2">Clocked in at {clockInTime?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                            </div>
                        )}
                        <div className="flex justify-center gap-4 mt-6">
                            {!isClockedIn ? (
                                <button onClick={handleClockIn} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg">
                                    <FaPlay size={14} /> Clock In
                                </button>
                            ) : (
                                <button onClick={handleClockOut} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg">
                                    <FaStop size={14} /> Clock Out
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Today Stats */}
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
                /* History View */
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                    {["Date", "Check In", "Check Out", "Hours", "Status", "Action"].map((h, i) => (
                                        <th key={i} className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((rec) => (
                                    <tr key={rec.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-3.5 text-sm font-medium text-[#1a1f36] dark:text-white">{rec.date}</td>
                                        <td className="px-6 py-3.5 text-sm font-mono text-[#1a1f36] dark:text-white">{rec.checkIn}</td>
                                        <td className="px-6 py-3.5 text-sm font-mono text-[#1a1f36] dark:text-white">{rec.checkOut}</td>
                                        <td className="px-6 py-3.5 text-sm font-mono text-[#45CFFF]">{rec.hours}</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${rec.status === "Present" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                                rec.status === "Absent" ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                                                    rec.status === "Late" ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" :
                                                        "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                }`}>{rec.status}</span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <button onClick={() => { setSelectedRecord(rec); setEditTime(rec.checkIn); setShowEditModal(true); }}
                                                className="px-2.5 py-1 rounded-lg bg-[#45CFFF]/10 text-[#45CFFF] text-xs font-medium hover:bg-[#45CFFF]/20 transition-colors">
                                                <FaClock size={10} className="inline mr-1" />Edit Time
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Time Modal */}
            {showEditModal && selectedRecord && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Edit Attendance</h3>
                            <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Editing attendance for <strong className="text-[#1a1f36] dark:text-white">{selectedRecord.date}</strong></p>
                            <div>
                                <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Date</label>
                                <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                            <div>
                                <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Check In Time</label>
                                <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]">Cancel</button>
                                <button onClick={handleEditTime} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1E56E0] to-[#45CFFF] text-white text-sm font-semibold hover:opacity-90">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
