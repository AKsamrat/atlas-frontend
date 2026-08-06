import { useState, useEffect, useCallback, useRef } from "react";
import { useResetPage } from "../../hooks/useResetPage";
import {
    FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaEnvelope, FaPhone,
    FaSpinner, FaBuilding, FaDollarSign, FaUserCheck, FaCalendarTimes, FaCamera,
} from "react-icons/fa";
import { employeesApi, type EmployeeData, type EmployeeStats } from "../../services";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:8000";
const imgSrc = (path: string | null) => path ? (path.startsWith("http") ? path : `${API_BASE}/storage/${path}`) : "";

const departments = ["All", "Development", "Design", "Marketing", "HR", "Finance", "Operations"];
const fmt = (n: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n);

export default function Employees() {
    const [employees, setEmployees] = useState<EmployeeData[]>([]);
    const [stats, setStats] = useState<EmployeeStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useResetPage([deptFilter, statusFilter, search]);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<EmployeeData | null>(null);
    const [viewEmployee, setViewEmployee] = useState<EmployeeData | null>(null);

    // Form
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [formPhone, setFormPhone] = useState("");
    const [formDept, setFormDept] = useState("Development");
    const [formRole, setFormRole] = useState("");
    const [formSalary, setFormSalary] = useState("");
    const [formStatus, setFormStatus] = useState("active");
    const [formJoinDate, setFormJoinDate] = useState("");
    const [formAddress, setFormAddress] = useState("");
    const [formEmergency, setFormEmergency] = useState("");
    const [formImage, setFormImage] = useState<File | null>(null);
    const [formImagePreview, setFormImagePreview] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = { page, per_page: 10 };
            if (deptFilter !== "All") params.department = deptFilter;
            if (statusFilter !== "all") params.status = statusFilter;
            if (search) params.search = search;
            const res = await employeesApi.getAll(params as Parameters<typeof employeesApi.getAll>[0]);
            setEmployees(res.data.data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            Swal.fire("Error", "Failed to load employees", "error");
        } finally {
            setLoading(false);
        }
    }, [deptFilter, statusFilter, search, page]);

    const fetchStats = useCallback(async () => {
        try { const res = await employeesApi.stats(); setStats(res.data); } catch { /* non-critical */ }
    }, []);

    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
    useEffect(() => { fetchStats(); }, [fetchStats]);

    const resetForm = () => { setFormName(""); setFormEmail(""); setFormPassword(""); setFormPhone(""); setFormDept("Development"); setFormRole(""); setFormSalary(""); setFormStatus("active"); setFormJoinDate(""); setFormAddress(""); setFormEmergency(""); setFormImage(null); setFormImagePreview(""); setEditing(null); };

    const openAddModal = () => { resetForm(); setShowModal(true); };
    const openEditModal = (emp: EmployeeData) => {
        setEditing(emp);
        setFormName(emp.name); setFormEmail(emp.email); setFormPhone(emp.phone || ""); setFormDept(emp.department);
        setFormRole(emp.role); setFormSalary(String(emp.salary)); setFormStatus(emp.status); setFormJoinDate(emp.join_date);
        setFormAddress(emp.address || ""); setFormEmergency(emp.emergency_contact || "");
        setFormImage(null); setFormImagePreview(emp.image ? imgSrc(emp.image) : "");
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formName || !formEmail || !formDept || !formRole || !formSalary) {
            Swal.fire("Validation", "Name, email, department, role and salary are required", "warning"); return;
        }
        try {
            const payload = { name: formName, email: formEmail, password: formPassword || undefined, phone: formPhone || undefined, department: formDept, role: formRole, salary: Number(formSalary), status: formStatus as "active" | "on_leave" | "inactive", join_date: formJoinDate || undefined, address: formAddress || undefined, emergency_contact: formEmergency || undefined, image: formImage || undefined };
            if (editing) {
                await employeesApi.update(editing.id, payload);
                Swal.fire({ icon: "success", title: "Updated", timer: 1500, showConfirmButton: false });
            } else {
                const res = await employeesApi.create(payload);
                const { credentials } = res.data;
                if (credentials) {
                    await Swal.fire({
                        icon: "success",
                        title: "Employee Created!",
                        html: `
                            <div style="text-align:left; padding: 8px 0;">
                                <p style="margin-bottom:12px; color:#718096; font-size:14px;">Login credentials for the new employee:</p>
                                <div style="background:#F9FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:8px;">
                                    <p style="margin:0 0 4px; font-size:12px; color:#718096;">Email</p>
                                    <p style="margin:0; font-weight:600; color:#1a1f36; font-size:14px;">${credentials.email}</p>
                                </div>
                                <div style="background:#F9FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px;">
                                    <p style="margin:0 0 4px; font-size:12px; color:#718096;">Password</p>
                                    <p style="margin:0; font-weight:600; color:#1a1f36; font-size:14px; font-family:monospace;">${credentials.password}</p>
                                </div>
                                <p style="margin-top:12px; font-size:12px; color:#EF4444;">⚠️ Please save this password — it will not be shown again.</p>
                            </div>
                        `,
                        confirmButtonText: "Got it!",
                        confirmButtonColor: "#1E56E0",
                        width: 420,
                    });
                } else {
                    Swal.fire({ icon: "success", title: "Employee Created!", text: "Employee linked to existing user account.", timer: 2000, showConfirmButton: false });
                }
            }
            setShowModal(false); resetForm();
            fetchEmployees(); fetchStats();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save employee";
            Swal.fire("Error", msg, "error");
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({ icon: "warning", title: "Delete employee?", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
        if (!result.isConfirmed) return;
        try {
            await employeesApi.delete(id);
            fetchEmployees(); fetchStats();
            Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to delete", "error"); }
    };

    const summaryCards = [
        { label: "Total Employees", value: stats?.total_employees ?? 0, icon: FaBuilding, color: "from-[#45CFFF] to-[#1E56E0]" },
        { label: "Active", value: stats?.active_employees ?? 0, icon: FaUserCheck, color: "from-[#10B981] to-[#059669]" },
        { label: "On Leave", value: stats?.on_leave ?? 0, icon: FaCalendarTimes, color: "from-[#F59E0B] to-[#D97706]" },
        { label: "Avg Salary", value: fmt(stats?.avg_salary ?? 0), icon: FaDollarSign, color: "from-[#8B5CF6] to-[#6D28D9]" },
    ];

    const statusColors: Record<string, string> = { active: "bg-green-500/10 text-green-600 dark:text-green-400", on_leave: "bg-amber-500/10 text-amber-600 dark:text-amber-400", inactive: "bg-red-500/10 text-red-600 dark:text-red-400" };
    const statusLabels: Record<string, string> = { active: "Active", on_leave: "On Leave", inactive: "Inactive" };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Employees</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{total} total employees</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                    <FaPlus size={14} />Add Employee
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                    <input type="text" placeholder="Search by name, email, or role..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                </div>
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                    {departments.map((d) => <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>)}
                </select>
                <div className="flex gap-2 flex-wrap">
                    {["all", "active", "on_leave", "inactive"].map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${statusFilter === s ? "bg-[#45CFFF] text-white shadow-md" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}>
                            {s === "all" ? "All" : s.replace("_", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Employees Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20"><FaSpinner className="animate-spin text-[#45CFFF]" size={32} /></div>
            ) : employees.length === 0 ? (
                <div className="text-center py-20 text-sm text-[#A0AEC0]">No employees found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {employees.map((emp) => (
                        <div key={emp.id} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {emp.image ? (
                                        <img src={imgSrc(emp.image)} alt={emp.name} className="w-11 h-11 rounded-full object-cover border-2 border-[#45CFFF]/30" />
                                    ) : (
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-sm font-bold">{emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-[#1a1f36] dark:text-white">{emp.name}</p>
                                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{emp.role}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[emp.status] || ""}`}>{statusLabels[emp.status] || emp.status}</span>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#A0AEC0]"><FaBuilding size={12} />{emp.department}</div>
                                <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#A0AEC0]"><FaEnvelope size={12} />{emp.email}</div>
                                {emp.phone && <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#A0AEC0]"><FaPhone size={12} />{emp.phone}</div>}
                                <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#A0AEC0]"><FaDollarSign size={12} />{fmt(emp.salary)}</div>
                            </div>
                            <div className="flex items-center gap-1 pt-3 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                                <button onClick={() => setViewEmployee(emp)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-xs hover:bg-blue-500/20 transition-colors"><FaEye size={12} /> View</button>
                                <button onClick={() => openEditModal(emp)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#45CFFF]/10 text-[#45CFFF] text-xs hover:bg-[#45CFFF]/20 transition-colors"><FaEdit size={12} /> Edit</button>
                                <button onClick={() => handleDelete(emp.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs hover:bg-red-500/20 transition-colors"><FaTrash size={12} /> Del</button>
                            </div>
                        </div>
                    ))}
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

            {/* View Employee Detail Modal */}
            {viewEmployee && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Employee Details</h3>
                            <button onClick={() => setViewEmployee(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/6"><FaTrash size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-3">
                            <div className="flex items-center gap-4 mb-4">
                                {viewEmployee.image ? (
                                    <img src={imgSrc(viewEmployee.image)} alt={viewEmployee.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#45CFFF]/30" />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white font-bold font-sora text-xl">{viewEmployee.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
                                )}
                                <div><p className="text-lg font-bold text-[#1a1f36] dark:text-white">{viewEmployee.name}</p><p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{viewEmployee.role}</p></div>
                            </div>
                            {[["Email", viewEmployee.email], ["Phone", viewEmployee.phone], ["Department", viewEmployee.department], ["Salary", fmt(viewEmployee.salary)], ["Join Date", viewEmployee.join_date], ["Address", viewEmployee.address], ["Emergency Contact", viewEmployee.emergency_contact]].map(([label, val]) => val ? (
                                <div key={label as string} className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">{label}</span><span className="font-medium text-[#1a1f36] dark:text-white">{val as string}</span></div>
                            ) : null)}
                            <div className="flex justify-between text-sm"><span className="text-[#718096] dark:text-[#A0AEC0]">Status</span><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[viewEmployee.status]}`}>{statusLabels[viewEmployee.status]}</span></div>
                        </div>
                        <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748] flex justify-end">
                            <button onClick={() => setViewEmployee(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add / Edit Employee Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">{editing ? "Edit Employee" : "Add Employee"}</h3>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/6"><FaTrash size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            {/* Image Upload */}
                            <div className="flex items-center gap-4">
                                <div onClick={() => fileInputRef.current?.click()} className="relative group cursor-pointer">
                                    {formImagePreview ? (
                                        <img src={formImagePreview} alt="Preview" className="w-20 h-20 rounded-2xl object-cover border-2 border-[#45CFFF]/30" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#45CFFF]/20 to-[#1E56E0]/20 border-2 border-dashed border-[#45CFFF]/40 flex items-center justify-center text-[#45CFFF]">
                                            <FaCamera size={24} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-medium">{formImagePreview ? "Change" : "Upload"}</span>
                                    </div>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) { setFormImage(file); setFormImagePreview(URL.createObjectURL(file)); }
                                }} />
                                <div>
                                    <p className="text-sm font-medium text-[#1a1f36] dark:text-white">Profile Photo</p>
                                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">JPG, PNG, GIF or WebP. Max 2MB.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Full Name *</label>
                                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="John Doe"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Email *</label>
                                    <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="john@company.com"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                            {/* Password — create: auto-generate or set; edit: leave blank to keep current */}
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Password</label>
                                <input type="text" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder={editing ? "Leave blank to keep current" : "Leave blank to auto-generate"}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mt-1">
                                    {editing ? "Enter a new password to change it, or leave empty to keep the current one." : "Employee will use this to log in. Leave empty to auto-generate."}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Phone</label>
                                    <input type="text" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="+880..."
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Department *</label>
                                    <select value={formDept} onChange={(e) => setFormDept(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                        {departments.filter((d) => d !== "All").map((d) => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Role *</label>
                                    <input type="text" value={formRole} onChange={(e) => setFormRole(e.target.value)} placeholder="Senior Developer"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Salary *</label>
                                    <input type="number" value={formSalary} onChange={(e) => setFormSalary(e.target.value)} placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Status</label>
                                    <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                        <option value="active">Active</option>
                                        <option value="on_leave">On Leave</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Join Date</label>
                                    <input type="text" value={formJoinDate} onChange={(e) => setFormJoinDate(e.target.value)} placeholder="Jan 2025"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Address</label>
                                <input type="text" value={formAddress} onChange={(e) => setFormAddress(e.target.value)} placeholder="Optional"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Emergency Contact</label>
                                <input type="text" value={formEmergency} onChange={(e) => setFormEmergency(e.target.value)} placeholder="Optional"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6">Cancel</button>
                            <button onClick={handleSubmit} disabled={!formName || !formEmail || !formRole || !formSalary}
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
