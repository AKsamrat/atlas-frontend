
import {
    FaDollarSign,
    FaShoppingCart,
    FaUserTie,
    FaBoxOpen,
    FaArrowUp,
    FaArrowDown,
    FaUsers,
    FaCalendarCheck,
    FaEllipsisV,
} from "react-icons/fa";

const stats = [
    { label: "Total Revenue", value: "$48,352", change: "+12.5%", up: true, icon: FaDollarSign, color: "from-[#45CFFF] to-[#1E56E0]" },
    { label: "Total Orders", value: "1,284", change: "+8.2%", up: true, icon: FaShoppingCart, color: "from-[#45CFFF] to-[#0EA5E9]" },
    { label: "Employees", value: "47", change: "+3", up: true, icon: FaUserTie, color: "from-[#10B981] to-[#059669]" },
    { label: "Products", value: "326", change: "-2", up: false, icon: FaBoxOpen, color: "from-[#F59E0B] to-[#D97706]" },
];

const recentOrders = [
    { id: "#ORD-7841", customer: "Rafiq Hasan", product: "Web Development Package", amount: "$2,400", status: "Completed", date: "Jan 15" },
    { id: "#ORD-7840", customer: "Sumaiya Akter", product: "Logo & Branding Kit", amount: "$850", status: "Processing", date: "Jan 15" },
    { id: "#ORD-7839", customer: "Tanvir Rahman", product: "SEO Optimization", amount: "$1,200", status: "Pending", date: "Jan 14" },
    { id: "#ORD-7838", customer: "Nusrat Jahan", product: "Social Media Pack", amount: "$600", status: "Completed", date: "Jan 14" },
    { id: "#ORD-7837", customer: "Arif Mahmud", product: "Domain + Hosting Annual", amount: "$180", status: "Completed", date: "Jan 13" },
];

const recentActivity = [
    { action: "New employee joined", detail: "Karim Ahmed — Developer", time: "2 hours ago", icon: FaUserTie, color: "text-green-500 bg-green-500/10" },
    { action: "Order #ORD-7841 completed", detail: "Payment confirmed — $2,400", time: "3 hours ago", icon: FaShoppingCart, color: "text-blue-500 bg-blue-500/10" },
    { action: "Product stock updated", detail: "Flyer Design — 15 units added", time: "5 hours ago", icon: FaBoxOpen, color: "text-amber-500 bg-amber-500/10" },
    { action: "Leave request approved", detail: "Mehedi Hasan — 3 days", time: "6 hours ago", icon: FaCalendarCheck, color: "text-purple-500 bg-purple-500/10" },
    { action: "New customer registered", detail: "EduPath Institute", time: "8 hours ago", icon: FaUsers, color: "text-cyan-500 bg-cyan-500/10" },
];

const topProducts = [
    { name: "Web Development Package", sold: 142, revenue: "$34,080", trend: "+18%" },
    { name: "Logo & Branding Kit", sold: 98, revenue: "$12,740", trend: "+12%" },
    { name: "SEO Optimization Plan", sold: 76, revenue: "$9,120", trend: "+8%" },
    { name: "Social Media Management", sold: 64, revenue: "$7,680", trend: "+5%" },
    { name: "Domain + Hosting Bundle", sold: 210, revenue: "$3,780", trend: "+22%" },
];

export default function DashboardHome() {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-[#718096] dark:text-[#A0AEC0] mb-1">{stat.label}</p>
                                <p className="text-2xl font-sora font-bold text-[#1a1f36] dark:text-white">{stat.value}</p>
                                <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.up ? "text-green-500" : "text-red-500"}`}>
                                    {stat.up ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                                    {stat.change} from last month
                                </div>
                            </div>
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <stat.icon size={18} />
                            </div>
                        </div>
                        {/* mini chart bar */}
                        <div className="mt-4 flex items-end gap-1 h-8">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-sm transition-all duration-300 ${i === 11 ? "bg-[#45CFFF]" : "bg-[#E2E8F0] dark:bg-[#2D3748]"}`}
                                    style={{ height: `${20 + Math.random() * 80}%` }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                        <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Recent Orders</h3>
                        <a href="/dashboard/orders" className="text-sm text-[#45CFFF] hover:underline">View All</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                    <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Order</th>
                                    <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-3.5 text-sm font-medium text-[#45CFFF]">{order.id}</td>
                                        <td className="px-6 py-3.5">
                                            <div>
                                                <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{order.customer}</p>
                                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{order.product}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm font-semibold text-[#1a1f36] dark:text-white">{order.amount}</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.status === "Completed" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                                order.status === "Processing" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                                                    "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                        <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Recent Activity</h3>
                    </div>
                    <div className="p-4">
                        {recentActivity.map((activity, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                                    <activity.icon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#1a1f36] dark:text-white truncate">{activity.action}</p>
                                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0] truncate">{activity.detail}</p>
                                    <p className="text-xs text-[#A0AEC0] mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                    <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Top Selling Products</h3>
                    <a href="/dashboard/products" className="text-sm text-[#45CFFF] hover:underline">View All</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">#</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Sold</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Revenue</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Trend</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((product, i) => (
                                <tr key={i} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5 text-sm font-mono text-[#718096] dark:text-[#A0AEC0]">{i + 1}</td>
                                    <td className="px-6 py-3.5 text-sm font-medium text-[#1a1f36] dark:text-white">{product.name}</td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{product.sold} units</td>
                                    <td className="px-6 py-3.5 text-sm font-semibold text-[#1a1f36] dark:text-white">{product.revenue}</td>
                                    <td className="px-6 py-3.5 text-sm text-green-500 font-medium">{product.trend}</td>
                                    <td className="px-6 py-3.5">
                                        <button className="text-[#718096] hover:text-[#45CFFF] transition-colors">
                                            <FaEllipsisV size={14} />
                                        </button>
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
