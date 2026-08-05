import { useState, useEffect, useCallback } from "react";
import {
    FaBuilding, FaUsers, FaDollarSign, FaPlus, FaEdit, FaTrash, FaSpinner, FaChartBar, FaProjectDiagram,
} from "react-icons/fa";
import { departmentsApi, type DepartmentData, type DepartmentStats } from "../../services";
import Swal from "sweetalert2";

const deptColors = ["from-[#45CFFF] to-[#1E56E0]", "from-[#10B981] to-[#059669]", "from-[#F59E0B] to-[#D97706]", "from-[#8B5CF6] to-[#6D28D9]", "from-[#E91E63] to-[#C2185B]", "from-[#FF6B35] to-[#D63031]"];
const fmt = (n: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n);

export default function Departments() {
    const [departments, setDepartments] = useState<DepartmentData[]>([]);
    const [stats, setStats] = useState<DepartmentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<DepartmentData | null>(null);

    // Form
    const [formName, setFormName] = useState("");
    const [formHead, setFormHead] = useState("");
    const [formMembers, setFormMembers] = useState("0");
    const [formBudget, setFormBudget] = useState("0");
    const [formSpent, setFormSpent] = useState("0");
    const [formPerformance, setFormPerformance] = useState("0");
    const [formProjects, setFormProjects] = useState("0");
    const [formColor, setFormColor] = useState(deptColors[0]);

    const fetchDepartments = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = { page, per_page: 10 };
            if (search) params.search = search;
            const res = await departmentsApi.getAll(params as Parameters<typeof departmentsApi.getAll>[0]);
            setDepartments(res.data.data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            Swal.fire("Error", "Failed to load departments", "error");
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    const fetchStats = useCallback(async () => {
        try { const res = await departmentsApi.stats(); setStats(res.data); } catch { /* non-critical */ }
    }, []);

    useEffect(() => { fetchDepartments(); }, [fetchDepartments]);
    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { setPage(1); }, [search]);

    const resetForm = () => { setFormName(""); setFormHead(""); setFormMembers("0"); setFormBudget("0"); setFormSpent("0"); setFormPerformance("0"); setFormProjects("0"); setFormColor(deptColors[0]); setEditing(null); };

    const openAddModal = () => { resetForm(); setShowModal(true); };
    const openEditModal = (dept: DepartmentData) => {
        setEditing(dept);
        setFormName(dept.name); setFormHead(dept.head || ""); setFormMembers(String(dept.members)); setFormBudget(String(dept.budget)); setFormSpent(String(dept.spent)); setFormPerformance(String(dept.performance)); setFormProjects(String(dept.projects)); setFormColor(dept.color || deptColors[0]);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formName) { Swal.fire("Validation", "Department name is required", "warning"); return; }
        try {
            const payload = { name: formName, head: formHead || undefined, members: Number(formMembers), budget: Number(formBudget), spent: Number(formSpent), performance: Number(formPerformance), projects: Number(formProjects), color: formColor };
            if (editing) {
                await departmentsApi.update(editing.id, payload);
                Swal.fire({ icon: "success", title: "Updated", timer: 1500, showConfirmButton: false });
            } else {
                await departmentsApi.create(payload);
                Swal.fire({ icon: "success", title: "Created", timer: 1500, showConfirmButton: false });
            }
            setShowModal(false); resetForm();
            fetchDepartments(); fetchStats();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save department";
            Swal.fire("Error", msg, "error");
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({ icon: "warning", title: "Delete department?", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
        if (!result.isConfirmed) return;
        try {
            await departmentsApi.delete(id);
            fetchDepartments(); fetchStats();
            Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to delete", "error"); }
    };

    const summaryCards = [
        { label: "Departments", value: stats?.total_departments ?? 0, icon: FaBuilding, color: "from-[#45CFFF] to-[#1E56E0]" },
        { label: "Total Members", value: stats?.total_members ?? 0, icon: FaUsers, color: "from-[#10B981] to-[#059669]" },
        { label: "Total Budget", value: fmt(stats?.total_budget ?? 0), icon: FaDollarSign, color: "from-[#F59E0B] to-[#D97706]" },
        { label: "Projects", value: stats?.total_projects ?? 0, icon: FaProjectDiagram, color: "from-[#8B5CF6] to-[#6D28D9]" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Departments</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{total} departments &bull; {stats?.total_members ?? 0} total members</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                    <FaPlus size={14} />Add Department
                </button>
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

            {/* Search */}
            <div className="relative max-w-md">
                <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                <input type="text" placeholder="Search departments..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
            </div>

            {/* Department Cards */}
            {loading ? (
                <div className="flex items-center justify-center py-20"><FaSpinner className="animate-spin text-[#45CFFF]" size={32} /></div>
            ) : departments.length === 0 ? (
                <div className="text-center py-20 text-sm text-[#A0AEC0]">No departments found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {departments.map((dept, i) => {
                        const color = dept.color || deptColors[i % deptColors.length];
                        const spentPct = dept.budget > 0 ? Math.min((dept.spent / dept.budget) * 100, 100) : 0;
                        return (
                            <div key={dept.id} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}><FaBuilding size={20} /></div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#1a1f36] dark:text-white">{dept.name}</p>
                                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">Head: {dept.head || "—"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => openEditModal(dept)} className="px-2 py-1 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] text-xs transition-colors" title="Edit"><FaEdit size={12} /></button>
                                        <button onClick={() => handleDelete(dept.id)} className="px-2 py-1 rounded-lg hover:bg-red-500/10 text-[#718096] hover:text-red-500 text-xs transition-colors" title="Delete"><FaTrash size={12} /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-3">
                                        <p className="text-[10px] text-[#718096] dark:text-[#A0AEC0]">Members</p>
                                        <p className="text-sm font-bold text-[#1a1f36] dark:text-white">{dept.members}</p>
                                    </div>
                                    <div className="rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] p-3">
                                        <p className="text-[10px] text-[#718096] dark:text-[#A0AEC0]">Projects</p>
                                        <p className="text-sm font-bold text-[#1a1f36] dark:text-white">{dept.projects}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-xs"><span className="text-[#718096] dark:text-[#A0AEC0]">Budget Usage</span><span className="font-mono text-[#1a1f36] dark:text-white">{fmt(dept.spent)} / {fmt(dept.budget)}</span></div>
                                    <div className="w-full h-2 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden">
                                        <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all`} style={{ width: `${spentPct}%` }} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1"><FaChartBar size={12} className="text-[#A0AEC0]" /><span className="text-xs text-[#718096] dark:text-[#A0AEC0]">Performance:</span><span className="text-xs font-bold text-[#1a1f36] dark:text-white">{dept.performance}%</span></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-1">
                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{total} records</p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] disabled:opacity-40">Prev</button>
                        <span className="text-xs text-[#718096] dark:text-[#A0AEC0]">Page {page} of {totalPages}</span>
                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] disabled:opacity-40">Next</button>
                    </div>
                </div>
            )}

            {/* Add / Edit Department Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">{editing ? "Edit Department" : "Add Department"}</h3>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/6"><FaTrash size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Name *</label>
                                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Department name"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Head</label>
                                    <input type="text" value={formHead} onChange={(e) => setFormHead(e.target.value)} placeholder="Department head"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Members</label>
                                    <input type="number" value={formMembers} onChange={(e) => setFormMembers(e.target.value)} min="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Budget</label>
                                    <input type="number" value={formBudget} onChange={(e) => setFormBudget(e.target.value)} min="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Spent</label>
                                    <input type="number" value={formSpent} onChange={(e) => setFormSpent(e.target.value)} min="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Performance %</label>
                                    <input type="number" value={formPerformance} onChange={(e) => setFormPerformance(e.target.value)} min="0" max="100"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Projects</label>
                                    <input type="number" value={formProjects} onChange={(e) => setFormProjects(e.target.value)} min="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Color</label>
                                    <div className="flex gap-2 mt-2">
                                        {deptColors.map((c) => (
                                            <button key={c} onClick={() => setFormColor(c)} className={`w-8 h-8 rounded-full bg-gradient-to-br ${c} ${formColor === c ? "ring-2 ring-offset-2 ring-[#45CFFF]" : ""}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6">Cancel</button>
                            <button onClick={handleSubmit} disabled={!formName}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                <FaPlus size={12} />{editing ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
