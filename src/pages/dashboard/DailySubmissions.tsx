import { useState, useEffect, useCallback } from "react";
import {
    FaClipboardList, FaCheckCircle, FaClock, FaTimes, FaEye,
    FaSave, FaSpinner, FaSearch, FaCalendarAlt, FaUser,
    FaFilter, FaTrash,
} from "react-icons/fa";
import {
    dailySubmissionApi,
    type DailySubmissionData,
    type DailySubmissionStats,
} from "../../services";
import Pagination from "../../components/shared/Pagination";
import DateRangePicker from "../../components/shared/DateRangePicker";
import Swal from "sweetalert2";

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

export default function DailySubmissions() {
    const [submissions, setSubmissions] = useState<DailySubmissionData[]>([]);
    const [stats, setStats] = useState<DailySubmissionStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [showReview, setShowReview] = useState<DailySubmissionData | null>(null);
    const [reviewAccept, setReviewAccept] = useState(0);
    const [reviewReject, setReviewReject] = useState(0);
    const [reviewRemark, setReviewRemark] = useState("");
    const [reviewStatus, setReviewStatus] = useState<"Approved" | "Rejected">("Approved");
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = {
                per_page: 10,
                page,
                status: filter === "All" ? "all" : filter,
            };
            if (searchTerm) params.search = searchTerm;
            if (fromDate) params.from_date = fromDate;
            if (toDate) params.to_date = toDate;
            const [subRes, statsRes] = await Promise.all([
                dailySubmissionApi.getAll(params as Parameters<typeof dailySubmissionApi.getAll>[0]),
                dailySubmissionApi.getStats(),
            ]);
            setSubmissions(subRes.data.data || []);
            setTotalPages(subRes.data.last_page);
            setTotal(subRes.data.total);
            setStats(statsRes.data);
        } catch {
            // non-critical
        } finally {
            setLoading(false);
        }
    }, [filter, page, searchTerm, fromDate, toDate]);

    useEffect(() => { fetchData(); }, [fetchData]);

    useEffect(() => { setPage(1); }, [filter, searchTerm, fromDate, toDate]);

    const openReview = (s: DailySubmissionData) => {
        setShowReview(s);
        setReviewAccept(s.accept);
        setReviewReject(s.reject);
        setReviewRemark(s.remark || "");
        setReviewStatus("Approved");
    };

    const handleReview = async () => {
        if (!showReview) return;
        try {
            setSaving(true);
            await dailySubmissionApi.update(showReview.id, {
                accept: reviewAccept,
                reject: reviewReject,
                remark: reviewRemark,
                status: reviewStatus,
            });
            Swal.fire({
                icon: "success",
                title: `${reviewStatus}!`,
                text: "Submission updated successfully.",
                timer: 2000,
                showConfirmButton: false,
            });
            setShowReview(null);
            fetchData();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update";
            Swal.fire("Error", msg, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Delete Submission?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            confirmButtonText: "Yes, delete it!",
        });
        if (result.isConfirmed) {
            try {
                await dailySubmissionApi.delete(id);
                Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
                fetchData();
            } catch {
                Swal.fire("Error", "Failed to delete", "error");
            }
        }
    };

    const filtered = submissions;

    const statCards = [
        { label: "Total Submissions", value: stats.total, icon: FaClipboardList, color: "from-[#1E56E0] to-[#45CFFF]" },
        { label: "Pending Review", value: stats.pending, icon: FaClock, color: "from-[#F59E0B] to-[#D97706]" },
        { label: "Approved", value: stats.approved, icon: FaCheckCircle, color: "from-[#10B981] to-[#059669]" },
        { label: "Rejected", value: stats.rejected, icon: FaTimes, color: "from-[#EF4444] to-[#DC2626]" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <FaSpinner className="animate-spin text-[#45CFFF]" size={32} />
                <span className="ml-3 text-[#718096] dark:text-[#A0AEC0]">Loading submissions...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <div key={card.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <card.icon size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] text-[#718096] dark:text-[#A0AEC0]">{card.label}</p>
                                <p className="text-lg font-sora font-bold text-[#1a1f36] dark:text-white">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex gap-2 flex-wrap">
                    {["All", "Pending", "Approved", "Rejected"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f
                                ? "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-white shadow-lg"
                                : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#596887] dark:text-[#B9C7E0]"
                                }`}
                        >
                            <FaFilter size={10} className="inline mr-1" />
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <FaSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search topic, employee..."
                        className="pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] w-64"
                    />
                </div>
                <DateRangePicker
                    fromDate={fromDate}
                    toDate={toDate}
                    onFromDateChange={setFromDate}
                    onToDateChange={setToDate}
                    onClear={() => { setFromDate(""); setToDate(""); }}
                />
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                <th className="text-left px-5 py-3 text-[11px] font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Employee</th>
                                <th className="text-left px-5 py-3 text-[11px] font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Topic</th>
                                <th className="text-center px-3 py-3 text-[11px] font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Date</th>
                                <th className="text-center px-3 py-3 text-[11px] font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Target</th>
                                <th className="text-center px-3 py-3 text-[11px] font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Made</th>
                                <th className="text-center px-3 py-3 text-[11px] font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Accept</th>
                                <th className="text-center px-3 py-3 text-[11px] font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Reject</th>
                                <th className="text-center px-3 py-3 text-[11px] font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Status</th>
                                <th className="text-center px-3 py-3 text-[11px] font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s) => (
                                <tr key={s.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E56E0] to-[#45CFFF] flex items-center justify-center text-white text-xs font-bold">
                                                {s.employee?.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{s.employee?.name || "Unknown"}</p>
                                                <p className="text-[10px] text-[#718096] dark:text-[#A0AEC0]">{s.employee?.department || ""}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-sm text-[#1a1f36] dark:text-white max-w-[200px] truncate">{s.topic}</td>
                                    <td className="px-3 py-3 text-center text-xs text-[#718096] dark:text-[#A0AEC0]">
                                        <FaCalendarAlt size={10} className="inline mr-1" />
                                        {fmtDate(s.submission_date)}
                                    </td>
                                    <td className="px-3 py-3 text-center text-sm font-mono text-[#1a1f36] dark:text-white">{s.target}</td>
                                    <td className="px-3 py-3 text-center text-sm font-mono text-[#1a1f36] dark:text-white">{s.made}</td>
                                    <td className="px-3 py-3 text-center text-sm font-mono text-green-600 dark:text-green-400">{s.accept}</td>
                                    <td className="px-3 py-3 text-center text-sm font-mono text-red-600 dark:text-red-400">{s.reject}</td>
                                    <td className="px-3 py-3 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[s.status] || ""}`}>{s.status}</span>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => openReview(s)} className="w-8 h-8 rounded-lg bg-[#45CFFF]/10 text-[#45CFFF] flex items-center justify-center hover:bg-[#45CFFF]/20 transition-colors" title="Review">
                                                <FaEye size={12} />
                                            </button>
                                            <button onClick={() => handleDelete(s.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors" title="Delete">
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-5 py-12 text-center text-sm text-[#A0AEC0]">No submissions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                    <Pagination currentPage={page} totalPages={totalPages} total={total} onPageChange={setPage} />
                </div>
            </div>

            {/* Review Modal */}
            {showReview && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <div>
                                <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Review Submission</h3>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mt-0.5">
                                    <FaUser size={10} className="inline mr-1" />
                                    {showReview.employee?.name} &middot; {fmtDate(showReview.submission_date)}
                                </p>
                            </div>
                            <button onClick={() => setShowReview(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]">
                                <FaTimes size={14} />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            {/* Read-only info */}
                            <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-4 space-y-2">
                                <h4 className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0] mb-2">Employee Report</h4>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#718096] dark:text-[#A0AEC0]">Topic</span>
                                    <span className="font-medium text-[#1a1f36] dark:text-white text-right max-w-[60%]">{showReview.topic}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#718096] dark:text-[#A0AEC0]">Target</span>
                                    <span className="font-mono text-[#1a1f36] dark:text-white">{showReview.target}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#718096] dark:text-[#A0AEC0]">Made</span>
                                    <span className="font-mono text-[#1a1f36] dark:text-white">{showReview.made}</span>
                                </div>
                                {showReview.folder_link && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#718096] dark:text-[#A0AEC0]">Link</span>
                                        <a href={showReview.folder_link} target="_blank" rel="noopener noreferrer" className="text-[#45CFFF] text-xs hover:underline truncate max-w-[60%]">{showReview.folder_link}</a>
                                    </div>
                                )}
                            </div>

                            {/* Admin review inputs */}
                            <div>
                                <h4 className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0] mb-3">Admin Review</h4>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Accept Quantity</label>
                                        <input
                                            type="number"
                                            value={reviewAccept}
                                            onChange={(e) => setReviewAccept(Number(e.target.value))}
                                            min={0}
                                            className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Reject Quantity</label>
                                        <input
                                            type="number"
                                            value={reviewReject}
                                            onChange={(e) => setReviewReject(Number(e.target.value))}
                                            min={0}
                                            className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Remark</label>
                                    <textarea
                                        value={reviewRemark}
                                        onChange={(e) => setReviewRemark(e.target.value)}
                                        rows={3}
                                        placeholder="Write a remark for this submission..."
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] resize-none"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { setReviewStatus("Approved"); }}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${reviewStatus === "Approved"
                                            ? "bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-lg"
                                            : "bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400"
                                            }`}
                                    >
                                        <FaCheckCircle size={14} className="inline mr-1" /> Approve
                                    </button>
                                    <button
                                        onClick={() => { setReviewStatus("Rejected"); }}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${reviewStatus === "Rejected"
                                            ? "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-lg"
                                            : "bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"
                                            }`}
                                    >
                                        <FaTimes size={14} className="inline mr-1" /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748] flex justify-end gap-3">
                            <button onClick={() => setShowReview(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6">
                                Cancel
                            </button>
                            <button onClick={handleReview} disabled={saving} className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                                {saving ? <><FaSpinner className="animate-spin" size={14} /> Saving...</> : <><FaSave size={14} /> Save Review</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
