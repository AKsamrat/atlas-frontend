import { useState, useEffect, useCallback } from "react";
import {
    FaSearch,
    FaEnvelope,
    FaPhone,
    FaUsers,
    FaUserShield,
    FaUserPlus,
    FaSpinner,
    FaTimes,
    FaEdit,
    FaTrash,
    FaPlus,
    FaCheckCircle,
    FaBan,
    FaClock,
} from "react-icons/fa";
import { usersApi, type UserData, type UserStats } from "../../services";
import Swal from "sweetalert2";

const STATUS_COLORS: Record<string, string> = {
    active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    inactive: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
    suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const ROLE_COLORS: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    staff: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    user: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function Users() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user" as "admin" | "staff" | "user",
        phone: "",
        status: "active" as "active" | "inactive" | "suspended",
    });

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = { page, per_page: 12 };
            if (roleFilter !== "all") params.role = roleFilter;
            if (statusFilter !== "all") params.status = statusFilter;
            if (search) params.search = search;
            const res = await usersApi.getAll(params as { role?: string; status?: string; search?: string; page?: number; per_page?: number });
            setUsers(res.data.data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            Swal.fire("Error", "Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    }, [roleFilter, statusFilter, search, page]);

    const fetchStats = useCallback(async () => {
        try {
            const res = await usersApi.stats();
            setStats(res.data);
        } catch { /* non-critical */ }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);
    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { setPage(1); }, [roleFilter, statusFilter, search]);

    const resetForm = () => {
        setForm({ name: "", email: "", password: "", role: "user", phone: "", status: "active" });
        setEditingUser(null);
    };

    const openAddModal = () => { resetForm(); setShowModal(true); };

    const openEditModal = (u: UserData) => {
        setEditingUser(u);
        setForm({
            name: u.name,
            email: u.email,
            password: "",
            role: u.role,
            phone: u.phone || "",
            status: u.status,
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email) {
            Swal.fire("Validation", "Name and email are required", "warning");
            return;
        }
        if (!editingUser && !form.password) {
            Swal.fire("Validation", "Password is required for new users", "warning");
            return;
        }
        try {
            if (editingUser) {
                const payload: Record<string, unknown> = { ...form };
                if (!payload.password) delete payload.password; // Don't send empty password
                await usersApi.update(editingUser.id, payload as { name?: string; email?: string; password?: string; role?: "admin" | "staff" | "user"; phone?: string; status?: "active" | "inactive" | "suspended" });
                Swal.fire({ icon: "success", title: "User Updated", timer: 1500, showConfirmButton: false });
            } else {
                await usersApi.create({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role,
                    phone: form.phone || undefined,
                    status: form.status,
                });
                Swal.fire({ icon: "success", title: "User Created", timer: 1500, showConfirmButton: false });
            }
            setShowModal(false);
            resetForm();
            fetchUsers();
            fetchStats();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save user";
            Swal.fire("Error", msg, "error");
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Delete user?",
            text: "This action cannot be undone.",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            confirmButtonText: "Delete",
        });
        if (!result.isConfirmed) return;
        try {
            await usersApi.delete(id);
            fetchUsers();
            fetchStats();
            Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        } catch {
            Swal.fire("Error", "Failed to delete user", "error");
        }
    };

    const summaryCards = [
        { label: "Total Users", value: stats?.total_users ?? 0, icon: FaUsers, color: "text-[#45CFFF] bg-[#45CFFF]/10" },
        { label: "New This Month", value: stats?.new_this_month ?? 0, icon: FaUserPlus, color: "text-green-500 bg-green-500/10" },
        { label: "Admins", value: stats?.admins ?? 0, icon: FaUserShield, color: "text-[#8B5CF6] bg-[#8B5CF6]/10" },
        { label: "Active Users", value: stats?.active_users ?? 0, icon: FaCheckCircle, color: "text-[#10B981] bg-[#10B981]/10" },
    ];

    const getInitials = (name: string) => name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Users Management</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{total} users registered</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    <FaPlus size={14} /> Add User
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}><stat.icon size={18} /></div>
                        <div>
                            <p className="text-2xl font-sora font-bold text-[#1a1f36] dark:text-white">{stat.value}</p>
                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["all", "admin", "staff", "user"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${roleFilter === r ? "bg-[#45CFFF] text-white" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}
                        >
                            {r}
                        </button>
                    ))}
                    <div className="w-px bg-[#E2E8F0] dark:bg-[#2D3748]" />
                    {["all", "active", "inactive", "suspended"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${statusFilter === s ? "bg-[#45CFFF] text-white" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* User Cards Grid */}
            {loading ? (
                <div className="text-center py-12 text-[#A0AEC0]">
                    <FaSpinner className="mx-auto mb-2 animate-spin" size={24} /> Loading users...
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 text-[#A0AEC0]">
                    <FaUsers className="mx-auto mb-3 text-4xl opacity-30" />
                    <p>No users found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {users.map((u) => (
                        <div key={u.id} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-sm font-bold">
                                        {u.avatar ? (
                                            <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            getInitials(u.name)
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-[#1a1f36] dark:text-white">{u.name}</h4>
                                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">ID: {u.id}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${ROLE_COLORS[u.role] || ""}`}>
                                        {u.role}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[u.status] || ""}`}>
                                        {u.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#A0AEC0]">
                                    <FaEnvelope size={11} /> {u.email}
                                </div>
                                {u.phone && (
                                    <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#A0AEC0]">
                                        <FaPhone size={11} /> {u.phone}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                                <div className="flex items-center gap-2">
                                    {u.status === "active" ? (
                                        <FaCheckCircle size={12} className="text-green-500" />
                                    ) : u.status === "suspended" ? (
                                        <FaBan size={12} className="text-red-500" />
                                    ) : (
                                        <FaClock size={12} className="text-gray-400" />
                                    )}
                                    <span className="text-xs text-[#718096] dark:text-[#A0AEC0] capitalize">{u.status}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{formatDate(u.created_at)}</p>
                                    <p className="text-xs text-[#A0AEC0]">Joined</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                                <button onClick={() => openEditModal(u)} className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all" title="Edit">
                                    <FaEdit size={13} />
                                </button>
                                <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#718096] hover:text-red-500 transition-all" title="Delete">
                                    <FaTrash size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#718096] hover:border-[#45CFFF] disabled:opacity-40 dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-[#A0AEC0]"
                    >
                        Previous
                    </button>
                    <span className="text-xs text-[#718096] dark:text-[#A0AEC0]">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#718096] hover:border-[#45CFFF] disabled:opacity-40 dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-[#A0AEC0]"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-[#0F1E3D] rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white">
                                {editingUser ? "Edit User" : "Add New User"}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-[#A0AEC0] hover:bg-red-500/10 hover:text-red-500">
                                <FaTimes size={16} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Name *</label>
                                    <input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">
                                    Password {editingUser ? "(leave blank to keep current)" : "*"}
                                </label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder={editingUser ? "••••••••" : ""}
                                    className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Phone</label>
                                    <input
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Role</label>
                                    <select
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "staff" | "user" })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none"
                                    >
                                        <option value="user">User</option>
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Status</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" | "suspended" })}
                                    className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F1F5F9] dark:hover:bg-white/[0.05] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                {editingUser ? "Update User" : "Create User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

