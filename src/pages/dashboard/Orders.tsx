
import { useState } from "react";
import { FaSearch, FaEye, FaEdit, FaShoppingCart, FaDollarSign, FaClock, FaTruck, FaArrowUp } from "react-icons/fa";

const orders = [
    { id: "#ORD-7841", customer: "Rafiq Hasan", email: "rafiq@mail.com", items: 3, total: "$2,400", status: "Completed", payment: "Paid", date: "Jan 15, 2025", method: "bKash" },
    { id: "#ORD-7840", customer: "Sumaiya Akter", email: "sumaiya@mail.com", items: 1, total: "$850", status: "Processing", payment: "Paid", date: "Jan 15, 2025", method: "Bank Transfer" },
    { id: "#ORD-7839", customer: "Tanvir Rahman", email: "tanvir@mail.com", items: 2, total: "$1,200", status: "Pending", payment: "Unpaid", date: "Jan 14, 2025", method: "Nagad" },
    { id: "#ORD-7838", customer: "Nusrat Jahan", email: "nusrat@mail.com", items: 1, total: "$600", status: "Completed", payment: "Paid", date: "Jan 14, 2025", method: "bKash" },
    { id: "#ORD-7837", customer: "Arif Mahmud", email: "arif@mail.com", items: 5, total: "$180", status: "Completed", payment: "Paid", date: "Jan 13, 2025", method: "Cash" },
    { id: "#ORD-7836", customer: "Karim Ahmed", email: "karim@mail.com", items: 2, total: "$3,500", status: "Shipped", payment: "Paid", date: "Jan 13, 2025", method: "Bank Transfer" },
    { id: "#ORD-7835", customer: "Mehedi Hasan", email: "mehedi@mail.com", items: 1, total: "$1,200", status: "Completed", payment: "Paid", date: "Jan 12, 2025", method: "bKash" },
    { id: "#ORD-7834", customer: "Fatima Rahman", email: "fatima@mail.com", items: 4, total: "$600", status: "Cancelled", payment: "Refunded", date: "Jan 12, 2025", method: "Bank Transfer" },
    { id: "#ORD-7833", customer: "Sakib Al Hasan", email: "sakib@mail.com", items: 1, total: "$2,400", status: "Shipped", payment: "Paid", date: "Jan 11, 2025", method: "bKash" },
    { id: "#ORD-7832", customer: "Tasnim Ahmed", email: "tasnim@mail.com", items: 3, total: "$850", status: "Completed", payment: "Paid", date: "Jan 11, 2025", method: "Cash" },
    { id: "#ORD-7831", customer: "Rafiq Uddin", email: "rafiq.u@mail.com", items: 2, total: "$300", status: "Processing", payment: "Paid", date: "Jan 10, 2025", method: "Nagad" },
    { id: "#ORD-7830", customer: "EduPath Institute", email: "info@edupath.com", items: 6, total: "$5,200", status: "Completed", payment: "Paid", date: "Jan 10, 2025", method: "Bank Transfer" },
];

const summaryCards = [
    { label: "Total Orders", value: "1,284", change: "+8.2%", up: true, icon: FaShoppingCart, color: "from-[#45CFFF] to-[#1E56E0]" },
    { label: "Revenue", value: "$48,352", change: "+12.5%", up: true, icon: FaDollarSign, color: "from-[#10B981] to-[#059669]" },
    { label: "Processing", value: "23", change: "-3", up: false, icon: FaClock, color: "from-[#F59E0B] to-[#D97706]" },
    { label: "Shipped", value: "15", change: "+5", up: true, icon: FaTruck, color: "from-[#8B5CF6] to-[#6D28D9]" },
];

const statusFilters = ["All", "Completed", "Processing", "Pending", "Shipped", "Cancelled"];

export default function Orders() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filtered = orders.filter((o) => {
        const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Orders</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{orders.length} recent orders</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mb-1">{stat.label}</p>
                                <p className="text-2xl font-sora font-bold text-[#1a1f36] dark:text-white">{stat.value}</p>
                                <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${stat.up ? "text-green-500" : "text-red-500"}`}>
                                    <FaArrowUp size={10} className={stat.up ? "" : "rotate-180"} />
                                    {stat.change}
                                </div>
                            </div>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <stat.icon size={16} />
                            </div>
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
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {statusFilters.map((s) => (
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

            {/* Orders Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Date</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((order) => (
                                <tr key={order.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5 text-sm font-medium text-[#45CFFF]">{order.id}</td>
                                    <td className="px-6 py-3.5">
                                        <div>
                                            <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{order.customer}</p>
                                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{order.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{order.items} items</td>
                                    <td className="px-6 py-3.5 text-sm font-semibold text-[#1a1f36] dark:text-white">{order.total}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.payment === "Paid" ? "bg-green-500/10 text-green-600 dark:text-green-400" : order.payment === "Unpaid" ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
                                            {order.payment} · {order.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.status === "Completed" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                            order.status === "Processing" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                                                order.status === "Pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                                                    order.status === "Shipped" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" :
                                                        "bg-red-500/10 text-red-600 dark:text-red-400"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{order.date}</td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEye size={13} /></button>
                                            <button className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEdit size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
