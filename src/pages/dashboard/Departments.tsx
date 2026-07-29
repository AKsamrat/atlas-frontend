import { FaBuilding, FaUsers, FaDollarSign, FaPlus, FaEdit, FaEye, FaChartBar } from "react-icons/fa";

const departments = [
    {
        name: "Development",
        head: "Tanvir Hossain",
        headAvatar: "TH",
        members: 12,
        budget: "$48,000",
        spent: "$38,500",
        performance: 92,
        color: "from-[#45CFFF] to-[#1E56E0]",
        projects: 8,
    },
    {
        name: "Design",
        head: "Mehedi Hasan",
        headAvatar: "MH",
        members: 6,
        budget: "$24,000",
        spent: "$18,200",
        performance: 88,
        color: "from-[#10B981] to-[#059669]",
        projects: 5,
    },
    {
        name: "Marketing",
        head: "Fatima Rahman",
        headAvatar: "FR",
        members: 8,
        budget: "$32,000",
        spent: "$27,800",
        performance: 85,
        color: "from-[#F59E0B] to-[#D97706]",
        projects: 6,
    },
    {
        name: "Human Resources",
        head: "Sumaiya Akter",
        headAvatar: "SA",
        members: 4,
        budget: "$16,000",
        spent: "$12,400",
        performance: 90,
        color: "from-[#8B5CF6] to-[#6D28D9]",
        projects: 3,
    },
    {
        name: "Sales",
        head: "Arif Mahmud",
        headAvatar: "AM",
        members: 10,
        budget: "$40,000",
        spent: "$35,100",
        performance: 87,
        color: "from-[#EC4899] to-[#BE185D]",
        projects: 7,
    },
    {
        name: "Support",
        head: "Nusrat Jahan",
        headAvatar: "NJ",
        members: 5,
        budget: "$18,000",
        spent: "$14,600",
        performance: 91,
        color: "from-[#06B6D4] to-[#0891B2]",
        projects: 4,
    },
];

export default function Departments() {
    const totalMembers = departments.reduce((acc, d) => acc + d.members, 0);
    const totalBudget = departments.reduce((acc, d) => acc + parseInt(d.budget.replace(/[$,]/g, "")), 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Departments</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{departments.length} departments · {totalMembers} total employees</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    <FaPlus size={14} />
                    Add Department
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Departments", value: departments.length, icon: FaBuilding, color: "text-[#45CFFF] bg-[#45CFFF]/10" },
                    { label: "Total Employees", value: totalMembers, icon: FaUsers, color: "text-[#10B981] bg-[#10B981]/10" },
                    { label: "Total Budget", value: `$${(totalBudget / 1000).toFixed(0)}K`, icon: FaDollarSign, color: "text-[#F59E0B] bg-[#F59E0B]/10" },
                    { label: "Avg Performance", value: `${Math.round(departments.reduce((a, d) => a + d.performance, 0) / departments.length)}%`, icon: FaChartBar, color: "text-[#8B5CF6] bg-[#8B5CF6]/10" },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 flex items-center gap-3">
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

            {/* Department Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {departments.map((dept) => {
                    const spentPct = (parseInt(dept.spent.replace(/[$,]/g, "")) / parseInt(dept.budget.replace(/[$,]/g, ""))) * 100;
                    return (
                        <div key={dept.name} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden hover:shadow-lg transition-all duration-300 group">
                            {/* Header Gradient */}
                            <div className={`bg-gradient-to-r ${dept.color} px-5 py-4 text-white relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="flex items-center gap-3 relative">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                        <FaBuilding size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-sora font-bold text-lg">{dept.name}</h3>
                                        <p className="text-xs text-white/80">{dept.members} members · {dept.projects} projects</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                {/* Department Head */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-xs font-bold">{dept.headAvatar}</div>
                                    <div>
                                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">Department Head</p>
                                        <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{dept.head}</p>
                                    </div>
                                </div>
                                {/* Budget */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-[#718096] dark:text-[#A0AEC0]">Budget Usage</span>
                                        <span className="text-xs font-mono text-[#1a1f36] dark:text-white">{dept.spent} / {dept.budget}</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${spentPct > 90 ? "bg-red-500" : spentPct > 70 ? "bg-amber-500" : "bg-green-500"}`}
                                            style={{ width: `${spentPct}%` }}
                                        />
                                    </div>
                                </div>
                                {/* Performance */}
                                <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                                    <span className="text-xs text-[#718096] dark:text-[#A0AEC0]">Performance</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-sora font-bold text-[#1a1f36] dark:text-white">{dept.performance}%</span>
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEye size={12} /></button>
                                            <button className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEdit size={12} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
