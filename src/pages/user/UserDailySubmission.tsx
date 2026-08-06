import { useState, useEffect, useCallback } from "react";
import {
    FaPaperPlane, FaList, FaSpinner, FaPlus, FaEye, FaTimes,
    FaCheckCircle, FaClock, FaCalendarAlt, FaLink,
} from "react-icons/fa";
import { userApi, type MyDailySubmission } from "../../services";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import Pagination from "../../components/shared/Pagination";
import DateRangePicker from "../../components/shared/DateRangePicker";
import Swal from "sweetalert2";

type ViewMode = "list" | "submit";

const statusColors: Record<string, string> = {
    Approved: "bg-green-500/10 text-green-600 dark:text-green-400",
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const fmtDate = (d: string) => {
    try {
        return new Date(d).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
        });
    } catch {
        return d;
    }
};

const today = new Date().toISOString().split("T")[0];

export default function UserDailySubmission() {
    const { addNotification } = useNotifications();
    const { user } = useAuth();
    const [view, setView] = useState<ViewMode>("list");
    const [submissions, setSubmissions] = useState<MyDailySubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [showDetail, setShowDetail] = useState<MyDailySubmission | null>(null);

    // Form state
    const [topic, setTopic] = useState("");
    const [target, setTarget] = useState("");
    const [made, setMade] = useState("");
    const [accept, setAccept] = useState("");
    const [reject, setReject] = useState("");
    const [folderLink, setFolderLink] = useState("");
    const [submissionDate, setSubmissionDate] = useState(today);
    const [submitting, setSubmitting] = useState(false);

    const fetchSubmissions = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = { per_page: 10, page };
            if (filter !== "All") params.status = filter;
            if (fromDate) params.from_date = fromDate;
            if (toDate) params.to_date = toDate;
            const res = await userApi.getMyDailySubmissions(params as Parameters<typeof userApi.getMyDailySubmissions>[0]);
            setSubmissions(res.data.data || []);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            // non-critical
        } finally {
            setLoading(false);
        }
    }, [page, filter, fromDate, toDate]);

    useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

    useEffect(() => { setPage(1); }, [filter, fromDate, toDate]);

    const filtered = submissions;

    const handleSubmit = async () => {
        if (!topic.trim()) {
            Swal.fire("Validation", "Topic is required", "warning");
            return;
        }
        if (!target || Number(target) < 0) {
            Swal.fire("Validation", "Target must be a positive number", "warning");
            return;
        }

        try {
            setSubmitting(true);
            await userApi.createDailySubmission({
                topic: topic.trim(),
                target: Number(target),
                made: Number(made) || 0,
                accept: Number(accept) || 0,
                reject: Number(reject) || 0,
                folder_link: folderLink || undefined,
                submission_date: submissionDate,
            });

            setTopic(""); setTarget(""); setMade("");
            setAccept(""); setReject(""); setFolderLink("");
            setSubmissionDate(today);

            addNotification({
                panel: "admin",
                type: "daily_submission",
                title: "New Daily Submission",
                message: `${user?.name || "Employee"} submitted daily work: ${topic.trim()}`,
                link: "/dashboard/daily-submissions",
            });
            Swal.fire({
                icon: "success",
                title: "Submitted!",
                text: "Your daily submission has been recorded.",
                timer: 2000,
                showConfirmButton: false,
            });
            setView("list");
            fetchSubmissions();
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data
                    ?.message || "Failed to submit";
            Swal.fire("Error", msg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <FaSpinner className="animate-spin text-[#45CFFF]" size={32} />
                <span className="ml-3 text-[#718096] dark:text-[#A0AEC0]">
                    Loading submissions...
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex gap-2">
                    <button
                        onClick={() => setView("list")}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "list"
                            ? "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-white shadow-lg"
                            : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#596887] dark:text-[#B9C7E0]"
                            }`}
                    >
                        <FaList size={12} className="inline mr-2" />
                        My Submissions
                    </button>
                    <button
                        onClick={() => setView("submit")}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "submit"
                            ? "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-white shadow-lg"
                            : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#596887] dark:text-[#B9C7E0]"
                            }`}
                    >
                        <FaPlus size={12} className="inline mr-2" />
                        New Submission
                    </button>
                </div>
                {view === "list" && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <DateRangePicker
                            fromDate={fromDate}
                            toDate={toDate}
                            onFromDateChange={setFromDate}
                            onToDateChange={setToDate}
                            onClear={() => { setFromDate(""); setToDate(""); }}
                        />
                        {["All", "Pending", "Approved", "Rejected"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f
                                    ? "bg-[#45CFFF] text-white shadow-md"
                                    : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0]"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* List View */}
            {view === "list" && (
                <div className="space-y-3">
                    {filtered.map((s) => (
                        <div
                            key={s.id}
                            className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0 ${s.status === "Approved"
                                            ? "bg-gradient-to-br from-[#10B981] to-[#059669]"
                                            : s.status === "Pending"
                                                ? "bg-gradient-to-br from-[#F59E0B] to-[#D97706]"
                                                : "bg-gradient-to-br from-[#EF4444] to-[#DC2626]"
                                            }`}
                                    >
                                        {s.status === "Approved" ? (
                                            <FaCheckCircle size={18} />
                                        ) : s.status === "Pending" ? (
                                            <FaClock size={18} />
                                        ) : (
                                            <FaTimes size={18} />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-sm font-semibold text-[#1a1f36] dark:text-white">
                                                {s.topic}
                                            </h4>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[s.status] || ""
                                                    }`}
                                            >
                                                {s.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mt-1">
                                            <FaCalendarAlt
                                                size={10}
                                                className="inline mr-1"
                                            />
                                            {fmtDate(s.submission_date)}
                                            <span className="ml-3">
                                                Target: {s.target} | Made: {s.made} | Accept: {s.accept} | Reject: {s.reject}
                                            </span>
                                        </p>
                                        {s.remark && (
                                            <p className="text-xs text-[#45CFFF] mt-1">
                                                Remark: {s.remark}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDetail(s)}
                                    className="px-3 py-1.5 rounded-lg bg-[#45CFFF]/10 text-[#45CFFF] text-xs font-medium hover:bg-[#45CFFF]/20 transition-colors self-start"
                                >
                                    <FaEye size={10} className="inline mr-1" />
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-sm text-[#A0AEC0]">
                            No submissions found
                        </div>
                    )}
                    <Pagination currentPage={page} totalPages={totalPages} total={total} onPageChange={setPage} />
                </div>
            )}

            {/* Submit Form */}
            {view === "submit" && (
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-6 max-w-2xl">
                    <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white mb-6">
                        New Daily Submission
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">
                                Topic *
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Social media content creation"
                                className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">
                                    Target *
                                </label>
                                <input
                                    type="number"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    min={0}
                                    placeholder="0"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">
                                    Made (Completed)
                                </label>
                                <input
                                    type="number"
                                    value={made}
                                    onChange={(e) => setMade(e.target.value)}
                                    min={0}
                                    placeholder="0"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">
                                    Accept
                                </label>
                                <input
                                    type="number"
                                    value={accept}
                                    onChange={(e) => setAccept(e.target.value)}
                                    min={0}
                                    placeholder="0"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">
                                    Reject
                                </label>
                                <input
                                    type="number"
                                    value={reject}
                                    onChange={(e) => setReject(e.target.value)}
                                    min={0}
                                    placeholder="0"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">
                                    Submission Date
                                </label>
                                <input
                                    type="date"
                                    value={submissionDate}
                                    onChange={(e) => setSubmissionDate(e.target.value)}
                                    max={today}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">
                                    Folder Link
                                </label>
                                <input
                                    type="url"
                                    value={folderLink}
                                    onChange={(e) => setFolderLink(e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !topic.trim() || !target}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <FaSpinner className="animate-spin" size={14} />{" "}
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane size={14} /> Submit Daily Report
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">
                                Submission Details
                            </h3>
                            <button
                                onClick={() => setShowDetail(null)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#718096] dark:text-[#A0AEC0]">Topic</span>
                                <span className="font-medium text-[#1a1f36] dark:text-white text-right max-w-[60%]">
                                    {showDetail.topic}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#718096] dark:text-[#A0AEC0]">Date</span>
                                <span className="font-medium text-[#1a1f36] dark:text-white">
                                    {fmtDate(showDetail.submission_date)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#718096] dark:text-[#A0AEC0]">Status</span>
                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[showDetail.status]
                                        }`}
                                >
                                    {showDetail.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-3 text-center">
                                    <p className="text-[10px] text-[#718096] dark:text-[#A0AEC0] uppercase">Target</p>
                                    <p className="text-lg font-bold text-[#1a1f36] dark:text-white">{showDetail.target}</p>
                                </div>
                                <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-3 text-center">
                                    <p className="text-[10px] text-[#718096] dark:text-[#A0AEC0] uppercase">Made</p>
                                    <p className="text-lg font-bold text-[#1a1f36] dark:text-white">{showDetail.made}</p>
                                </div>
                                <div className="rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-3 text-center">
                                    <p className="text-[10px] text-green-600 dark:text-green-400 uppercase">Accept</p>
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{showDetail.accept}</p>
                                </div>
                                <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 text-center">
                                    <p className="text-[10px] text-red-600 dark:text-red-400 uppercase">Reject</p>
                                    <p className="text-lg font-bold text-red-600 dark:text-red-400">{showDetail.reject}</p>
                                </div>
                            </div>
                            {showDetail.folder_link && (
                                <div>
                                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mb-1">Folder Link</p>
                                    <a
                                        href={showDetail.folder_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-[#45CFFF] hover:underline flex items-center gap-1"
                                    >
                                        <FaLink size={10} /> {showDetail.folder_link}
                                    </a>
                                </div>
                            )}
                            {showDetail.remark && (
                                <div>
                                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mb-1">Admin Remark</p>
                                    <p className="text-sm text-[#1a1f36] dark:text-white bg-[#F9FAFC] dark:bg-[#060B14] rounded-xl p-3 border border-[#E2E8F0] dark:border-[#2D3748]">
                                        {showDetail.remark}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748] flex justify-end">
                            <button
                                onClick={() => setShowDetail(null)}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
