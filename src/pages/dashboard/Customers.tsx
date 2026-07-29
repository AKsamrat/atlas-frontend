import { useState } from "react";
import { FaSearch, FaEye, FaEnvelope, FaPhone, FaUsers, FaShoppingCart, FaDollarSign, FaUserPlus, FaMapMarkerAlt } from "react-icons/fa";

const customers = [
    { id: "CUS-001", name: "Rafiq Hasan", email: "rafiq@mail.com", phone: "+880 1712-345678", location: "Dhaka", orders: 12, totalSpent: "$8,400", joinDate: "Mar 2023", status: "Active", avatar: "RH", lastOrder: "Jan 15, 2025" },
    { id: "CUS-002", name: "Sumaiya Akter", email: "sumaiya@mail.com", phone: "+880 1812-345678", location: "Chittagong", orders: 8, totalSpent: "$5,200", joinDate: "Jun 2023", status: "Active", avatar: "SA", lastOrder: "Jan 15, 2025" },
    { id: "CUS-003", name: "Tanvir Rahman", email: "tanvir@mail.com", phone: "+880 1912-345678", location: "Sylhet", orders: 5, totalSpent: "$3,600", joinDate: "Sep 2023", status: "Active", avatar: "TR", lastOrder: "Jan 14, 2025" },
    { id: "CUS-004", name: "Nusrat Jahan", email: "nusrat@mail.com", phone: "+880 1612-345678", location: "Rajshahi", orders: 15, totalSpent: "$12,800", joinDate: "Jan 2022", status: "VIP", avatar: "NJ", lastOrder: "Jan 14, 2025" },
    { id: "CUS-005", name: "Arif Mahmud", email: "arif@mail.com", phone: "+880 1512-345678", location: "Dhaka", orders: 3, totalSpent: "$900", joinDate: "Nov 2023", status: "Active", avatar: "AM", lastOrder: "Jan 13, 2025" },
    { id: "CUS-006", name: "EduPath Institute", email: "info@edupath.com", phone: "+880 1412-345678", location: "Comilla", orders: 22, totalSpent: "$24,500", joinDate: "Jan 2022", status: "VIP", avatar: "EP", lastOrder: "Jan 10, 2025" },
    { id: "CUS-007", name: "Karim Ahmed", email: "karim@mail.com", phone: "+880 1312-345678", location: "Khulna", orders: 6, totalSpent: "$4,100", joinDate: "Feb 2023", status: "Active", avatar: "KA", lastOrder: "Jan 8, 2025" },
    { id: "CUS-008", name: "Mehedi Hasan", email: "mehedi@mail.com", phone: "+880 1212-345678", location: "Dhaka", orders: 2, totalSpent: "$600", joinDate: "Oct 2023", status: "Active", avatar: "MH", lastOrder: "Dec 28, 2024" },
    { id: "CUS-009", name: "Fatima Rahman", email: "fatima@mail.com", phone: "+880 1112-345678", location: "Barisal", orders: 9, totalSpent: "$6,700", joinDate: "Apr 2023", status: "Active", avatar: "FR", lastOrder: "Jan 5, 2025" },
    { id: "CUS-010", name: "Sakib Corp", email: "contact@sakibcorp.com", phone: "+880 1012-345678", location: "Gazipur", orders: 18, totalSpent: "$18,200", joinDate: "Feb 2022", status: "VIP", avatar: "SC", lastOrder: "Jan 12, 2025" },
];

const summaryCards = [
    { label: "Total Customers", value: "847", icon: FaUsers, color: "text-[#45CFFF] bg-[#45CFFF]/10" },
    { label: "New This Month", value: "34", icon: FaUserPlus, color: "text-green-500 bg-green-500/10" },
    { label: "Active Customers", value: "612", icon: FaShoppingCart, color: "text-[#8B5CF6] bg-[#8B5CF6]/10" },
    { label: "Avg. Lifetime Value", value: "$6,240", icon: FaDollarSign, color: "text-[#F59E0B] bg-[#F59E0B]/10" },
];

export default function Customers() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filtered = customers.filter((c) => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Customers</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{customers.length} customers in database</p>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((stat) => (
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                    />
                </div>
                <div className="flex gap-2">
                    {["All", "Active", "VIP"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-[#45CFFF] text-white" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Customer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((cust) => (
                    <div key={cust.id} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-sm font-bold">{cust.avatar}</div>
                                <div>
                                    <h4 className="text-sm font-semibold text-[#1a1f36] dark:text-white">{cust.name}</h4>
                                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{cust.id}</p>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cust.status === "VIP" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-green-500/10 text-green-600 dark:text-green-400"}`}>
                                {cust.status}
                            </span>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#A0AEC0]">
                                <FaEnvelope size={11} /> {cust.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#A0AEC0]">
                                <FaPhone size={11} /> {cust.phone}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#A0AEC0]">
                                <FaMapMarkerAlt size={11} /> {cust.location}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <div className="text-center">
                                <p className="text-lg font-sora font-bold text-[#1a1f36] dark:text-white">{cust.orders}</p>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">Orders</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-sora font-bold text-[#1a1f36] dark:text-white">{cust.totalSpent}</p>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">Spent</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-sora font-bold text-[#1a1f36] dark:text-white">{cust.joinDate}</p>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">Joined</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <span className="text-xs text-[#718096] dark:text-[#A0AEC0]">Last order: {cust.lastOrder}</span>
                            <button className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEye size={13} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
