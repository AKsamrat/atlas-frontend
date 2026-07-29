import { useState } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaEnvelope } from "react-icons/fa";

const employees = [
    { id: "EMP-001", name: "Karim Ahmed", email: "karim@entra.com", phone: "+880 1712-345678", department: "Development", role: "Senior Developer", salary: "$3,200", status: "Active", joinDate: "Mar 2023", avatar: "KA" },
    { id: "EMP-002", name: "Mehedi Hasan", email: "mehedi@entra.com", phone: "+880 1812-345678", department: "Design", role: "UI/UX Designer", salary: "$2,800", status: "Active", joinDate: "Jun 2023", avatar: "MH" },
    { id: "EMP-003", name: "Fatima Rahman", email: "fatima@entra.com", phone: "+880 1912-345678", department: "Marketing", role: "Marketing Manager", salary: "$3,500", status: "Active", joinDate: "Jan 2022", avatar: "FR" },
    { id: "EMP-004", name: "Sakib Al Hasan", email: "sakib@entra.com", phone: "+880 1612-345678", department: "Development", role: "Frontend Developer", salary: "$2,600", status: "Active", joinDate: "Sep 2023", avatar: "SA" },
    { id: "EMP-005", name: "Nusrat Jahan", email: "nusrat@entra.com", phone: "+880 1512-345678", department: "HR", role: "HR Coordinator", salary: "$2,400", status: "On Leave", joinDate: "Apr 2023", avatar: "NJ" },
    { id: "EMP-006", name: "Arif Mahmud", email: "arif@entra.com", phone: "+880 1412-345678", department: "Development", role: "Backend Developer", salary: "$3,000", status: "Active", joinDate: "Feb 2023", avatar: "AM" },
    { id: "EMP-007", name: "Tasnim Ahmed", email: "tasnim@entra.com", phone: "+880 1312-345678", department: "Design", role: "Graphic Designer", salary: "$2,200", status: "Active", joinDate: "Nov 2023", avatar: "TA" },
    { id: "EMP-008", name: "Rafiq Uddin", email: "rafiq@entra.com", phone: "+880 1212-345678", department: "Marketing", role: "SEO Specialist", salary: "$2,500", status: "Active", joinDate: "Aug 2023", avatar: "RU" },
    { id: "EMP-009", name: "Sumaiya Akter", email: "sumaiya@entra.com", phone: "+880 1112-345678", department: "HR", role: "HR Manager", salary: "$3,100", status: "Active", joinDate: "Jan 2022", avatar: "SA" },
    { id: "EMP-010", name: "Tanvir Hossain", email: "tanvir@entra.com", phone: "+880 1012-345678", department: "Development", role: "DevOps Engineer", salary: "$3,400", status: "Active", joinDate: "May 2022", avatar: "TH" },
];

const departments = ["All", "Development", "Design", "Marketing", "HR"];

export default function Employees() {
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);

    const filtered = employees.filter((e) => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase());
        const matchDept = deptFilter === "All" || e.department === deptFilter;
        return matchSearch && matchDept;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Employees</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{employees.length} total employees</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    <FaPlus size={14} />
                    Add Employee
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                    />
                </div>
                <div className="flex gap-2">
                    {departments.map((d) => (
                        <button
                            key={d}
                            onClick={() => setDeptFilter(d)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${deptFilter === d ? "bg-[#45CFFF] text-white" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Salary</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Joined</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((emp) => (
                                <tr key={emp.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-xs font-bold">{emp.avatar}</div>
                                            <div>
                                                <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{emp.name}</p>
                                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0] flex items-center gap-1"><FaEnvelope size={9} /> {emp.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#45CFFF]/10 text-[#45CFFF]">{emp.department}</span>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-[#1a1f36] dark:text-white">{emp.role}</td>
                                    <td className="px-6 py-3.5 text-sm font-semibold text-[#1a1f36] dark:text-white">{emp.salary}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${emp.status === "Active" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{emp.joinDate}</td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEye size={13} /></button>
                                            <button className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEdit size={13} /></button>
                                            <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#718096] hover:text-red-500 transition-all"><FaTrash size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Employee Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-[#0F1E3D] rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] p-6 w-full max-w-lg mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white mb-4">Add New Employee</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Full Name</label>
                                    <input className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Email</label>
                                    <input type="email" className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Department</label>
                                    <select className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none">
                                        <option>Development</option>
                                        <option>Design</option>
                                        <option>Marketing</option>
                                        <option>HR</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Role</label>
                                    <input className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Phone</label>
                                    <input className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Salary</label>
                                    <input className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F1F5F9] dark:hover:bg-white/[0.05] transition-colors">Cancel</button>
                            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity">Add Employee</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
