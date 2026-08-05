import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaCalendarCheck, FaClock, FaHistory, FaMoneyBillWave,
    FaArrowUp, FaArrowRight, FaSpinner, FaExclamationCircle,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { userApi, type MyEmployee, type MyAttendance, type MyLeaveRequest, type MyPayroll } from "../../services";

const fmt = (n: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
    catch { return d; }
};

export default function UserDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [employee, setEmployee] = useState<MyEmployee | null>(null);
    const [recentAttendance, setRecentAttendance] = useState<MyAttendance[]>([]);
    const [recentLeaves, setRecentLeaves] = useState<MyLeaveRequest[]>([]);
    const [_recentPayroll, setRecentPayroll] = useState<MyPayroll[]>([]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const res = await userApi.getProfile();
            const emp = res.data;
            setEmployee(emp);
            setRecentAttendance(emp.attendances?.slice(0, 5) || []);
            setRecentLeaves(emp.leave_requests?.slice(0, 3) || []);
            setRecentPayroll(emp.payroll_records?.slice(0, 3) || []);
        } catch {
            setError("Could not load your dashboard data. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const greeting = useMemo(() => {
        const h = currentTime.getHours();
        if (h < 12) return "Good Morning";
        if (h < 17) return "Good Afternoon";
        return "Good Evening";
    }, [currentTime]);

    const stats = useMemo(() => {
        const attendances = employee?.attendances || [];
        const payrolls = employee?.payroll_records || [];
        const presentDays = attendances.filter((a) => a.status === "Present" || a.status === "Late").length;
        const totalHours = attendances.reduce((sum, a) => sum + (a.hours || 0), 0);
        const lastPayroll = payrolls[0];
        const netSalary = lastPayroll ? (lastPayroll.base_salary + lastPayroll.bonus - lastPayroll.deduction) : 0;
        const approvedLeaveDays = employee?.leave_requests?.filter((l) => l.status === "Approved").reduce((s, l) => s + l.days, 0) || 0;

        return [
            { label: "Days Present", value: String(presentDays), icon: FaCalendarCheck, color: "from-[#10B981] to-[#059669]", change: "This period" },
            { label: "Hours Worked", value: `${Math.round(totalHours)}h`, icon: FaClock, color: "from-[#45CFFF] to-[#1E56E0]", change: "This period" },
            { label: "Leave Balance", value: String(Math.max(0, 12 - approvedLeaveDays)), icon: FaHistory, color: "from-[#F59E0B] to-[#D97706]", change: "Days remaining" },
            { label: "Net Salary", value: fmt(netSalary), icon: FaMoneyBillWave, color: "from-[#E91E63] to-[#C2185B]", change: lastPayroll?.period || "No payroll yet" },
        ];
    }, [employee]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <FaSpinner className="animate-spin text-[#45CFFF]" size={32} />
                <span className="ml-3 text-[#718096] dark:text-[#A0AEC0]">Loading dashboard...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <FaExclamationCircle className="text-red-400 mb-3" size={40} />
                <p className="text-[#718096] dark:text-[#A0AEC0] mb-4">{error}</p>
                <button onClick={fetchData} className="px-4 py-2 rounded-xl bg-[#45CFFF] text-white text-sm font-medium hover:opacity-90">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#1E56E0] to-[#45CFFF] p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-8 -mb-8" />
                <div className="relative z-10">
                    <h2 className="font-sora text-2xl font-bold">{greeting}, {user?.name || "Employee"}!</h2>
                    <p className="text-white/80 mt-1 text-sm">
                        {currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        {" \u2022 "}
                        {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </p>
                    {employee && (
                        <p className="text-white/60 text-xs mt-1">{employee.department} — {employee.role}</p>
                    )}
                    <div className="flex gap-3 mt-4">
                        <button onClick={() => navigate("/user/attendance")} className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-medium backdrop-blur-sm transition-colors">
                            Mark Attendance
                        </button>
                        <button onClick={() => navigate("/user/leave")} className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-medium backdrop-blur-sm transition-colors">
                            Apply Leave
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <s.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[11px] text-[#718096] dark:text-[#A0AEC0]">{s.label}</p>
                                <p className="text-lg font-sora font-bold text-[#1a1f36] dark:text-white">{s.value}</p>
                            </div>
                        </div>
                        <p className="text-[11px] text-[#A0AEC0] mt-2 flex items-center gap-1">
                            <FaArrowUp size={10} className="text-green-500" /> {s.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Attendance */}
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748]">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                        <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white text-sm">Recent Attendance</h3>
                        <button onClick={() => navigate("/user/attendance")} className="text-xs text-[#45CFFF] hover:underline flex items-center gap-1">View All <FaArrowRight size={10} /></button>
                    </div>
                    <div className="divide-y divide-[#E2E8F0]/50 dark:divide-[#2D3748]/50">
                        {recentAttendance.map((a) => (
                            <div key={a.id} className="flex items-center justify-between px-6 py-3">
                                <div>
                                    <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{fmtDate(a.date)}</p>
                                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{a.check_in || "\u2014"} - {a.check_out || "\u2014"}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${a.status === "Present" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                    a.status === "Absent" ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                                        a.status === "Late" ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" :
                                            "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    }`}>{a.status}</span>
                            </div>
                        ))}
                        {recentAttendance.length === 0 && (
                            <p className="px-6 py-8 text-center text-sm text-[#A0AEC0]">No attendance records yet</p>
                        )}
                    </div>
                </div>

                {/* Recent Leaves */}
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748]">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                        <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white text-sm">Recent Leave Requests</h3>
                        <button onClick={() => navigate("/user/leave")} className="text-xs text-[#45CFFF] hover:underline flex items-center gap-1">View All <FaArrowRight size={10} /></button>
                    </div>
                    <div className="divide-y divide-[#E2E8F0]/50 dark:divide-[#2D3748]/50">
                        {recentLeaves.map((l) => (
                            <div key={l.id} className="flex items-center justify-between px-6 py-3">
                                <div>
                                    <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{l.type}</p>
                                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{fmtDate(l.from_date)} — {l.days} day{l.days > 1 ? "s" : ""}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${l.status === "Approved" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                    l.status === "Pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                                        "bg-red-500/10 text-red-600 dark:text-red-400"
                                    }`}>{l.status}</span>
                            </div>
                        ))}
                        {recentLeaves.length === 0 && (
                            <p className="px-6 py-8 text-center text-sm text-[#A0AEC0]">No leave requests yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
