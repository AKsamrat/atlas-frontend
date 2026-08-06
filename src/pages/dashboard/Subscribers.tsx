import { useState, useEffect, useCallback } from "react";
import { useResetPage } from "../../hooks/useResetPage";
import {
    FaUsers, FaCheckCircle, FaTimes, FaUserMinus,
    FaSearch, FaCalendarAlt, FaTrash, FaSync, FaEnvelope,
} from "react-icons/fa";
import {
    subscribersApi,
    type SubscriberData,
    type SubscriberStats,
} from "../../services";
import Pagination from "../../components/shared/Pagination";
import DateRangePicker from "../../components/shared/DateRangePicker";
import Swal from "sweetalert2";

const statusColors: Record<string, string> = {
    active: "bg-green-500/10 text-green-600 dark:text-green-400",
    unsubscribed: "bg-red-500/10 text-red-600 dark:text-red-400",
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

export default function Subscribers() {
    const [subscribers, setSubscribers] = useState<SubscriberData[]>([]);
    const [stats, setStats] = useState<SubscriberStats>({ total: 0, active: 0, unsubscribed: 0, this_month: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [page, setPage] = useResetPage([filter, searchTerm, fromDate, toDate]);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

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
                subscribersApi.getAll(params as Parameters<typeof subscribersApi.getAll>[0]),
                subscribersApi.getStats(),
            ]);
            setSubscribers(subRes.data.data || []);
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

    const handleDelete = async (sub: SubscriberData) => {
        const result = await Swal.fire({
            title: "Delete Subscriber?",
            html: `Are you sure you want to remove <strong>${sub.email}</strong>?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete",
        });
        if (result.isConfirmed) {
            try {
                await subscribersApi.delete(sub.id);
                Swal.fire("Deleted!", "Subscriber has been removed.", "success");
                fetchData();
            } catch {
                Swal.fire("Error", "Failed to delete subscriber.", "error");
            }
        }
    };

    const toggleStatus = async (sub: SubscriberData) => {
        const newStatus = sub.status === "active" ? "unsubscribed" : "active";
        try {
            await subscribersApi.update(sub.id, { status: newStatus });
            fetchData();
        } catch {
            Swal.fire("Error", "Failed to update status.", "error");
        }
    };

    const clearDates = () => { setFromDate(""); setToDate(""); };

    return (
        <div className="space-y-6">
            {/* â”€â”€ Header â”€â”€ */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">
                        Subscribers
                    </h1>
                    <p className="mt-1 text-sm text-[#8b95ad] dark:text-[#7C8AAD]">
                        Manage newsletter subscribers
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-medium text-[#1a1f36] transition-all hover:bg-[#f1f3f8] dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06]"
                >
                    <FaSync size={13} />
                    Refresh
                </button>
            </div>

            {/* â”€â”€ Stats â”€â”€ */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                    { label: "Total Subscribers", value: stats.total, icon: FaUsers, color: "from-[#1E56E0] to-[#2E8BF0]" },
                    { label: "Active", value: stats.active, icon: FaCheckCircle, color: "from-green-500 to-emerald-600" },
                    { label: "Unsubscribed", value: stats.unsubscribed, icon: FaUserMinus, color: "from-red-500 to-rose-600" },
                    { label: "This Month", value: stats.this_month, icon: FaCalendarAlt, color: "from-[#45CFFF] to-[#1E56E0]" },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-5 dark:border-white/[0.06] dark:bg-[#0d1829]"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-[#8b95ad] dark:text-[#7C8AAD]">
                                    {s.label}
                                </p>
                                <p className="mt-2 font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">
                                    {s.value}
                                </p>
                            </div>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                                <s.icon size={18} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* â”€â”€ Filters â”€â”€ */}
            <div className="flex flex-col gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 dark:border-white/[0.06] dark:bg-[#0d1829] sm:flex-row sm:items-center">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    {["All", "active", "unsubscribed"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all ${filter === f
                                ? "bg-[#1E56E0] text-white shadow-md"
                                : "bg-[#f1f3f8] text-[#8b95ad] hover:bg-[#e2e8f0] dark:bg-white/[0.04] dark:text-[#7C8AAD] dark:hover:bg-white/[0.08]"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b95ad]" size={13} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by email or name..."
                        className="w-full rounded-xl border border-[#e2e8f0] bg-[#f1f3f8] py-2 pl-9 pr-4 text-sm text-[#1a1f36] placeholder:text-[#8b95ad] focus:border-[#45CFFF] focus:outline-none dark:border-white/[0.08] dark:bg-[#060B14]/80 dark:text-white dark:placeholder:text-[#3d4f6e]"
                    />
                </div>

                {/* Date Range */}
                <DateRangePicker
                    fromDate={fromDate}
                    toDate={toDate}
                    onFromDateChange={setFromDate}
                    onToDateChange={setToDate}
                    onClear={clearDates}
                />
            </div>

            {/* â”€â”€ Table â”€â”€ */}
            <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white dark:border-white/[0.06] dark:bg-[#0d1829]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] dark:border-white/[0.06] dark:bg-white/[0.02]">
                                <th className="px-3 sm:px-5 py-3 font-sora text-xs font-semibold uppercase tracking-wider text-[#8b95ad] dark:text-[#7C8AAD]">
                                    #
                                </th>
                                <th className="px-3 sm:px-5 py-3 font-sora text-xs font-semibold uppercase tracking-wider text-[#8b95ad] dark:text-[#7C8AAD]">
                                    Email
                                </th>
                                <th className="px-3 sm:px-5 py-3 font-sora text-xs font-semibold uppercase tracking-wider text-[#8b95ad] dark:text-[#7C8AAD]">
                                    Name
                                </th>
                                <th className="px-3 sm:px-5 py-3 font-sora text-xs font-semibold uppercase tracking-wider text-[#8b95ad] dark:text-[#7C8AAD]">
                                    Status
                                </th>
                                <th className="px-3 sm:px-5 py-3 font-sora text-xs font-semibold uppercase tracking-wider text-[#8b95ad] dark:text-[#7C8AAD]">
                                    Subscribed
                                </th>
                                <th className="px-3 sm:px-5 py-3 font-sora text-xs font-semibold uppercase tracking-wider text-[#8b95ad] dark:text-[#7C8AAD]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e2e8f0] dark:divide-white/[0.04]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-3 sm:px-5 py-16 text-center text-[#8b95ad] dark:text-[#7C8AAD]">
                                        <FaSync className="mx-auto mb-2 animate-spin" size={20} />
                                        Loading subscribers...
                                    </td>
                                </tr>
                            ) : subscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-3 sm:px-5 py-16 text-center text-[#8b95ad] dark:text-[#7C8AAD]">
                                        <FaEnvelope className="mx-auto mb-2 opacity-30" size={32} />
                                        No subscribers found
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map((sub, idx) => (
                                    <tr
                                        key={sub.id}
                                        className="transition-colors hover:bg-[#f8fafc] dark:hover:bg-white/[0.02]"
                                    >
                                        <td className="px-3 sm:px-5 py-3 text-[#8b95ad] dark:text-[#7C8AAD]">
                                            {(page - 1) * 10 + idx + 1}
                                        </td>
                                        <td className="px-3 sm:px-5 py-3 font-medium text-[#1a1f36] dark:text-white">
                                            {sub.email}
                                        </td>
                                        <td className="px-3 sm:px-5 py-3 text-[#8b95ad] dark:text-[#7C8AAD]">
                                            {sub.name || "â€”"}
                                        </td>
                                        <td className="px-3 sm:px-5 py-3">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[sub.status] || ""}`}>
                                                {sub.status === "active" ? <FaCheckCircle size={10} /> : <FaTimes size={10} />}
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-5 py-3 text-sm text-[#8b95ad] dark:text-[#7C8AAD]">
                                            {fmtDate(sub.created_at)}
                                        </td>
                                        <td className="px-3 sm:px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleStatus(sub)}
                                                    title={sub.status === "active" ? "Unsubscribe" : "Reactivate"}
                                                    className="rounded-lg p-1.5 text-[#8b95ad] transition-colors hover:bg-amber-500/10 hover:text-amber-600 dark:text-[#7C8AAD]"
                                                >
                                                    <FaUserMinus size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sub)}
                                                    title="Delete"
                                                    className="rounded-lg p-1.5 text-[#8b95ad] transition-colors hover:bg-red-500/10 hover:text-red-600 dark:text-[#7C8AAD]"
                                                >
                                                    <FaTrash size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-[#e2e8f0] bg-[#f8fafc] px-5 py-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        total={total}
                        onPageChange={setPage}
                    />
                </div>
            </div>
        </div>
    );
}
