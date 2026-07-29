import { useState, useEffect, useCallback } from "react";
import {
    FaClock, FaCheckCircle, FaTimesCircle, FaCalendarTimes, FaUserClock,
    FaSearch, FaCalendarDay, FaHistory, FaStopwatch, FaUsers, FaTimes, FaUserCheck,
} from "react-icons/fa";

interface AttendanceRecord {
    name: string;
    department: string;
    checkIn: string;
    checkOut: string;
    hours: string;
    status: "Present" | "Absent" | "On Leave" | "Half Day" | "Late";
}

const initialRecords: AttendanceRecord[] = [
    { name: "Karim Ahmed", department: "Development", checkIn: "09:00 AM", checkOut: "05:30 PM", hours: "8h 30m", status: "Present" },
    { name: "Mehedi Hasan", department: "Design", checkIn: "09:15 AM", checkOut: "05:45 PM", hours: "8h 30m", status: "Present" },
    { name: "Fatima Rahman", department: "Marketing", checkIn: "08:55 AM", checkOut: "\u2014", hours: "\u2014", status: "Present" },
    { name: "Sakib Al Hasan", department: "Development", checkIn: "\u2014", checkOut: "\u2014", hours: "\u2014", status: "Absent" },
    { name: "Nusrat Jahan", department: "HR", checkIn: "\u2014", checkOut: "\u2014", hours: "\u2014", status: "On Leave" },
    { name: "Arif Mahmud", department: "Development", checkIn: "09:05 AM", checkOut: "\u2014", hours: "\u2014", status: "Present" },
    { name: "Tasnim Ahmed", department: "Design", checkIn: "09:30 AM", checkOut: "02:00 PM", hours: "4h 30m", status: "Half Day" },
    { name: "Rafiq Uddin", department: "Marketing", checkIn: "08:45 AM", checkOut: "05:15 PM", hours: "8h 30m", status: "Present" },
    { name: "Sumaiya Akter", department: "HR", checkIn: "09:00 AM", checkOut: "05:00 PM", hours: "8h 00m", status: "Present" },
    { name: "Tanvir Hossain", department: "Development", checkIn: "10:00 AM", checkOut: "06:00 PM", hours: "8h 00m", status: "Late" },
];

const weeklyData = [
    { day: "Mon", present: 8, absent: 1, leave: 1 },
    { day: "Tue", present: 9, absent: 0, leave: 1 },
    { day: "Wed", present: 7, absent: 2, leave: 1 },
    { day: "Thu", present: 8, absent: 1, leave: 1 },
    { day: "Fri", present: 8, absent: 1, leave: 1 },
];

const months = ["January 2025", "February 2025", "March 2025", "April 2025"];

const allEmployees = [
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

function formatTime(d: Date) {
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const s = d.getSeconds().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h.toString().padStart(2, "0")}:${m}:${s} ${ampm}`;
}

function diffHours(start: Date, end: Date) {
    const ms = end.getTime() - start.getTime();
    const hrs = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    return `${hrs}h ${mins.toString().padStart(2, "0")}m`;
}

export default function Attendance() {
    const [search, setSearch] = useState("");
    const [month, setMonth] = useState(months[0]);
    const [records, setRecords] = useState(initialRecords);
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [clockInTime, setClockInTime] = useState<Date | null>(null);
    const [elapsed, setElapsed] = useState("0h 00m");
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [view, setView] = useState<"today" | "history">("today");
    const [now, setNow] = useState(new Date());

    // Mark Attendance Modal State
    const [showMarkModal, setShowMarkModal] = useState(false);
    const [markMode, setMarkMode] = useState<"single" | "multiple">("multiple");
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [singleEmployee, setSingleEmployee] = useState(allEmployees[0].name);
    const [markStatus, setMarkStatus] = useState<"Present" | "Absent" | "Late" | "Half Day">("Present");
    const [markCheckIn, setMarkCheckIn] = useState("09:00");
    const [markCheckOut, setMarkCheckOut] = useState("05:00");
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (!isClockedIn || !clockInTime) return;
        const t = setInterval(() => setElapsed(diffHours(clockInTime, new Date())), 1000);
        return () => clearInterval(t);
    }, [isClockedIn, clockInTime]);

    const handleClockIn = useCallback(() => {
        const time = new Date();
        setClockInTime(time);
        setIsClockedIn(true);
        setElapsed("0h 00m");
        setRecords((prev) =>
            prev.map((r, i) =>
                i === 0 ? { ...r, checkIn: formatTime(time), checkOut: "\u2014", hours: "\u2014", status: "Present" as const } : r
            )
        );
    }, []);

    const handleClockOut = useCallback(() => {
        if (!clockInTime) return;
        const time = new Date();
        setIsClockedIn(false);
        setRecords((prev) =>
            prev.map((r, i) =>
                i === 0 ? { ...r, checkOut: formatTime(time), hours: diffHours(clockInTime, time), status: "Present" as const } : r
            )
        );
    }, [clockInTime]);

    const toggleEmployee = (name: string) => {
        setSelectedEmployees((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
    };

    const selectAllEmployees = () => {
        setSelectedEmployees(allEmployees.map((e) => e.name));
    };

    const handleMarkAttendance = () => {
        const timeToMark = markMode === "single"
            ? [singleEmployee]
            : selectedEmployees;

        if (timeToMark.length === 0) return;

        const formatAMPM = (t: string) => {
            const [h, m] = t.split(":").map(Number);
            const ampm = h >= 12 ? "PM" : "AM";
            const h12 = h % 12 || 12;
            return `${h12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${ampm}`;
        };

        setRecords((prev) =>
            prev.map((r) => {
                if (!timeToMark.includes(r.name)) return r;
                const checkIn = markStatus === "Absent" ? "\u2014" : formatAMPM(markCheckIn);
                const checkOut = markStatus === "Absent"
                    ? "\u2014"
                    : markStatus === "Half Day"
                        ? formatAMPM(markCheckOut)
                        : formatAMPM(markCheckOut);
                const hours = markStatus === "Absent" ? "\u2014" : markStatus === "Half Day" ? "4h 00m" : "8h 00m";
                return { ...r, checkIn, checkOut, hours, status: markStatus };
            })
        );

        const count = timeToMark.length;
        showToast(`Attendance marked for ${count} employee${count !== 1 ? "s" : ""}`);
        setShowMarkModal(false);
        setSelectedEmployees([]);
    };

    const presentCount = records.filter((r) => ["Present", "Late"].includes(r.status)).length;
    const absentCount = records.filter((r) => r.status === "Absent").length;
    const leaveCount = records.filter((r) => r.status === "On Leave").length;
    const lateCount = records.filter((r) => r.status === "Late").length;

    const stats = [
        { label: "Present Today", value: presentCount, icon: FaCheckCircle, color: "text-green-500 bg-green-500/10" },
        { label: "Absent Today", value: absentCount, icon: FaTimesCircle, color: "text-red-500 bg-red-500/10" },
        { label: "On Leave", value: leaveCount, icon: FaCalendarTimes, color: "text-amber-500 bg-amber-500/10" },
        { label: "Late Arrivals", value: lateCount, icon: FaUserClock, color: "text-purple-500 bg-purple-500/10" },
    ];

    const filtered = records.filter(
        (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.department.toLowerCase().includes(search.toLowerCase())
    );

    const toggleAllInList = () => {
        if (selectedEmployees.length === allEmployees.length) {
            setSelectedEmployees([]);
        } else {
            selectAllEmployees();
        }
    };

    return (
        <div className="space-y-6 relative">
            {toast && (
                <div className="fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl bg-green-500 text-white text-sm font-semibold shadow-2xl">
                    <div className="flex items-center gap-2"><FaCheckCircle />{toast}</div>
                </div>
            )}

            {/* Clock Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#1E56E0] to-[#45CFFF] p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                            <FaStopwatch size={26} />
                        </div>
                        <div>
                            <p className="text-sm text-white/80 mb-0.5">Current Time</p>
                            <h3 className="font-sora text-2xl font-bold font-mono tracking-wider">{formatTime(now)}</h3>
                            <p className="text-sm text-white/70 mt-1">
                                {isClockedIn
                                    ? `Clocked in at ${clockInTime ? formatTime(clockInTime) : "\u2014"} \u00B7 Working: ${elapsed}`
                                    : "Click the button to start your day"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={isClockedIn ? handleClockOut : handleClockIn}
                        className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${isClockedIn
                            ? "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                            : "bg-white text-[#1E56E0] hover:bg-white/90 shadow-lg"
                            }`}
                    >
                        <FaClock size={16} />
                        {isClockedIn ? "Clock Out" : "Clock In"}
                    </button>
                    <button
                        onClick={() => setShowMarkModal(true)}
                        className="px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    >
                        <FaUsers size={16} />
                        Mark Attendance
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 flex items-center gap-3 hover:shadow-lg transition-all">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={18} />
                        </div>
                        <div>
                            <p className="text-2xl font-sora font-bold text-[#1a1f36] dark:text-white">{stat.value}</p>
                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* View Toggle + Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] rounded-xl p-1">
                    <button
                        onClick={() => setView("today")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === "today" ? "bg-[#45CFFF] text-white shadow-md" : "text-[#718096] dark:text-[#A0AEC0] hover:text-[#1a1f36] dark:hover:text-white"
                            }`}
                    >
                        <FaCalendarDay size={14} />
                        Today
                    </button>
                    <button
                        onClick={() => setView("history")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === "history" ? "bg-[#45CFFF] text-white shadow-md" : "text-[#718096] dark:text-[#A0AEC0] hover:text-[#1a1f36] dark:hover:text-white"
                            }`}
                    >
                        <FaHistory size={14} />
                        History
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    {view === "history" && (
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-3 py-2 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                        />
                    )}
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                    >
                        {months.map((m) => (<option key={m}>{m}</option>))}
                    </select>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Attendance Table */}
                <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                        <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">
                            {view === "today" ? "Today's Records" : `Records \u2014 ${selectedDate}`}
                        </h3>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={12} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8 pr-3 py-1.5 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-xs text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                    <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Check In</th>
                                    <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Check Out</th>
                                    <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Hours</th>
                                    <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r, i) => (
                                    <tr key={i} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-3.5">
                                            <div>
                                                <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{r.name}</p>
                                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{r.department}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm text-[#1a1f36] dark:text-white font-mono">{r.checkIn}</td>
                                        <td className="px-6 py-3.5 text-sm text-[#1a1f36] dark:text-white font-mono">{r.checkOut}</td>
                                        <td className="px-6 py-3.5 text-sm font-mono text-[#718096] dark:text-[#A0AEC0]">{r.hours}</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${r.status === "Present" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                                r.status === "Absent" ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                                                    r.status === "On Leave" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                                                        r.status === "Late" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" :
                                                            "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                }`}>{r.status}</span>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-[#A0AEC0]">No records found for this date.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Weekly Summary */}
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                        <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Weekly Summary</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {weeklyData.map((day, i) => {
                            const total = day.present + day.absent + day.leave;
                            const pct = (day.present / total) * 100;
                            return (
                                <div key={i} className="p-3 rounded-xl hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[#1a1f36] dark:text-white">{day.day}</span>
                                        <span className="text-xs font-mono text-[#718096] dark:text-[#A0AEC0]">{day.present}/{total}</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#45CFFF] to-[#10B981] rounded-full transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-green-500">{'\u2713'} {day.present}</span>
                                        <span className="text-xs text-red-500">{'\u2717'} {day.absent}</span>
                                        <span className="text-xs text-amber-500">{'\u25C6'} {day.leave}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Monthly Overview */}
                    <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                        <h4 className="text-sm font-semibold text-[#1a1f36] dark:text-white mb-3">{month}</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-[#718096] dark:text-[#A0AEC0]">Attendance Rate</span>
                                <span className="font-mono font-semibold text-green-500">83%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-[#718096] dark:text-[#A0AEC0]">Avg. Working Hours</span>
                                <span className="font-mono font-semibold text-[#1a1f36] dark:text-white">8h 12m</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-[#718096] dark:text-[#A0AEC0]">Overtime Hours</span>
                                <span className="font-mono font-semibold text-[#45CFFF]">6h 30m</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MARK ATTENDANCE MODAL */}
            {showMarkModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748] shrink-0">
                            <div>
                                <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white text-lg">Mark Attendance</h3>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mt-0.5">Mark attendance for single or multiple employees</p>
                            </div>
                            <button onClick={() => { setShowMarkModal(false); setSelectedEmployees([]); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06] transition-colors"><FaTimes size={14} /></button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
                            {/* Mode Toggle */}
                            <div className="flex bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] rounded-xl p-1">
                                <button
                                    onClick={() => { setMarkMode("single"); setSelectedEmployees([]); }}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${markMode === "single" ? "bg-[#45CFFF] text-white shadow-md" : "text-[#718096] dark:text-[#A0AEC0] hover:text-[#1a1f36] dark:hover:text-white"}`}
                                >
                                    <FaUserCheck size={14} /> Single Employee
                                </button>
                                <button
                                    onClick={() => { setMarkMode("multiple"); setSingleEmployee(allEmployees[0].name); }}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${markMode === "multiple" ? "bg-[#45CFFF] text-white shadow-md" : "text-[#718096] dark:text-[#A0AEC0] hover:text-[#1a1f36] dark:hover:text-white"}`}
                                >
                                    <FaUsers size={14} /> Multiple Employees
                                </button>
                            </div>

                            {/* Single Mode */}
                            {markMode === "single" && (
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Select Employee</label>
                                    <select
                                        value={singleEmployee}
                                        onChange={(e) => setSingleEmployee(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                                    >
                                        {allEmployees.map((e) => (
                                            <option key={e.name} value={e.name}>{e.name} \u2014 {e.department}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Multiple Mode */}
                            {markMode === "multiple" && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-[#1a1f36] dark:text-white">
                                            Select Employees <span className="text-[#A0AEC0] font-normal">({selectedEmployees.length} selected)</span>
                                        </label>
                                        <button onClick={toggleAllInList} className="text-xs text-[#45CFFF] hover:underline font-medium">
                                            {selectedEmployees.length === allEmployees.length ? "Deselect All" : "Select All"}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1 rounded-xl border border-[#E2E8F0] dark:border-[#2D3748]">
                                        {allEmployees.map((emp) => {
                                            const isSelected = selectedEmployees.includes(emp.name);
                                            return (
                                                <button
                                                    key={emp.name}
                                                    onClick={() => toggleEmployee(emp.name)}
                                                    className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${isSelected ? "bg-[#45CFFF]/10 border-2 border-[#45CFFF]" : "bg-[#F9FAFC] dark:bg-[#060B14] border-2 border-transparent hover:border-[#E2E8F0] dark:hover:border-[#2D3748]"}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isSelected ? "bg-[#45CFFF] text-white" : "bg-[#E2E8F0] dark:bg-[#2D3748] text-[#718096] dark:text-[#A0AEC0]"}`}>{emp.name.charAt(0)}</div>
                                                    <div className="min-w-0">
                                                        <p className={`text-sm font-medium truncate ${isSelected ? "text-[#45CFFF]" : "text-[#1a1f36] dark:text-white"}`}>{emp.name}</p>
                                                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0] truncate">{emp.department}</p>
                                                    </div>
                                                    {isSelected && <FaCheckCircle size={14} className="text-[#45CFFF] ml-auto shrink-0" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Status Selection */}
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-2">Attendance Status</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[{ label: "Present", value: "Present" as const, color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30", activeColor: "bg-green-500 text-white border-green-500" },
                                    { label: "Absent", value: "Absent" as const, color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30", activeColor: "bg-red-500 text-white border-red-500" },
                                    { label: "Late", value: "Late" as const, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30", activeColor: "bg-purple-500 text-white border-purple-500" },
                                    { label: "Half Day", value: "Half Day" as const, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30", activeColor: "bg-blue-500 text-white border-blue-500" }
                                    ].map((s) => (
                                        <button
                                            key={s.value}
                                            onClick={() => setMarkStatus(s.value)}
                                            className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${markStatus === s.value ? s.activeColor : s.color}`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Inputs */}
                            {markStatus !== "Absent" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Check In Time</label>
                                        <input
                                            type="time"
                                            value={markCheckIn}
                                            onChange={(e) => setMarkCheckIn(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Check Out Time</label>
                                        <input
                                            type="time"
                                            value={markCheckOut}
                                            onChange={(e) => setMarkCheckOut(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748] shrink-0">
                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">
                                {markMode === "single"
                                    ? `Marking: ${singleEmployee}`
                                    : `${selectedEmployees.length} employee${selectedEmployees.length !== 1 ? "s" : ""} selected`
                                }
                            </p>
                            <div className="flex items-center gap-3">
                                <button onClick={() => { setShowMarkModal(false); setSelectedEmployees([]); }} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06] transition-colors">Cancel</button>
                                <button
                                    onClick={handleMarkAttendance}
                                    disabled={markMode === "multiple" && selectedEmployees.length === 0}
                                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaCheckCircle size={14} /> Confirm Attendance
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}