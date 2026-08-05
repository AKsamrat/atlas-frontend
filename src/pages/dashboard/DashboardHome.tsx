import { useState, useEffect } from "react";
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
    FaSpinner,
    FaExclamationTriangle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { ordersApi, type OrderStats, type OrderData } from "../../services/Order";
import { productsApi, type ProductStats, type ProductData } from "../../services/Product";
import { employeesApi, type EmployeeStats } from "../../services/Employee";

export default function DashboardHome() {
    const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
    const [productStats, setProductStats] = useState<ProductStats | null>(null);
    const [employeeStats, setEmployeeStats] = useState<EmployeeStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);
    const [topProducts, setTopProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [ordersStatsRes, productsStatsRes, employeesStatsRes, recentOrdersRes, topProductsRes] =
                await Promise.allSettled([
                    ordersApi.stats(),
                    productsApi.stats(),
                    employeesApi.stats(),
                    ordersApi.getAll({ per_page: 5 }),
                    productsApi.getAll({ per_page: 5 }),
                ]);

            if (ordersStatsRes.status === "fulfilled") setOrderStats(ordersStatsRes.value.data);
            if (productsStatsRes.status === "fulfilled") setProductStats(productsStatsRes.value.data);
            if (employeesStatsRes.status === "fulfilled") setEmployeeStats(employeesStatsRes.value.data);
            if (recentOrdersRes.status === "fulfilled") setRecentOrders(recentOrdersRes.value.data.data);
            if (topProductsRes.status === "fulfilled") setTopProducts(topProductsRes.value.data.data);

            const allFailed = [ordersStatsRes, productsStatsRes, employeesStatsRes].every(
                (r) => r.status === "rejected"
            );
            if (allFailed) {
                setError("Failed to load dashboard data. Please check your connection.");
            }
        } catch {
            setError("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            label: "Total Revenue",
            value: orderStats ? `$${Number(orderStats.total_revenue).toLocaleString()}` : "$0",
            change: orderStats ? `${orderStats.pending_orders} pending` : "",
            up: true,
            icon: FaDollarSign,
            color: "from-[#45CFFF] to-[#1E56E0]",
        },
        {
            label: "Total Orders",
            value: orderStats ? orderStats.total_orders.toLocaleString() : "0",
            change: orderStats ? `${orderStats.completed_orders} completed` : "",
            up: true,
            icon: FaShoppingCart,
            color: "from-[#45CFFF] to-[#0EA5E9]",
        },
        {
            label: "Employees",
            value: employeeStats ? employeeStats.total_employees.toLocaleString() : "0",
            change: employeeStats ? `${employeeStats.on_leave} on leave` : "",
            up: true,
            icon: FaUserTie,
            color: "from-[#10B981] to-[#059669]",
        },
        {
            label: "Products",
            value: productStats ? productStats.total_products.toLocaleString() : "0",
            change: productStats ? `${productStats.low_stock} low stock` : "",
            up: false,
            icon: FaBoxOpen,
            color: "from-[#F59E0B] to-[#D97706]",
        },
    ];

    const formatStatus = (status: string) => {
        const map: Record<string, string> = {
            completed: "Completed",
            processing: "Processing",
            pending: "Pending",
            cancelled: "Cancelled",
        };
        return map[status] || status;
    };

    const getStatusClasses = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-500/10 text-green-600 dark:text-green-400";
            case "processing":
                return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
            case "pending":
                return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
            case "cancelled":
                return "bg-red-500/10 text-red-600 dark:text-red-400";
            default:
                return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-[#45CFFF] mx-auto mb-3" />
                    <p className="text-[#718096] dark:text-[#A0AEC0]">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <FaExclamationTriangle className="text-4xl text-amber-500 mx-auto mb-3" />
                    <p className="text-[#718096] dark:text-[#A0AEC0] mb-4">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="px-4 py-2 bg-[#45CFFF] text-white rounded-lg hover:bg-[#1E56E0] transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

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
                                    {stat.change}
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
                        <Link to="/dashboard/orders" className="text-sm text-[#45CFFF] hover:underline">View All</Link>
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
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-[#718096] dark:text-[#A0AEC0]">
                                            No orders yet.
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-3.5 text-sm font-medium text-[#45CFFF]">#{order.order_number}</td>
                                            <td className="px-6 py-3.5">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{order.customer_name}</p>
                                                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{order.customer_email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-sm font-semibold text-[#1a1f36] dark:text-white">
                                                ${Number(order.total_amount).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(order.status)}`}>
                                                    {formatStatus(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">
                                                {formatDate(order.created_at)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Overview Sidebar */}
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                        <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Overview</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-blue-500 bg-blue-500/10">
                                <FaShoppingCart size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#1a1f36] dark:text-white">Pending Orders</p>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{orderStats?.pending_orders ?? 0} orders awaiting processing</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-green-500 bg-green-500/10">
                                <FaCalendarCheck size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#1a1f36] dark:text-white">Completed Orders</p>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{orderStats?.completed_orders ?? 0} orders fulfilled</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-amber-500 bg-amber-500/10">
                                <FaBoxOpen size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#1a1f36] dark:text-white">Low Stock Alert</p>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{productStats?.low_stock ?? 0} products running low</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-purple-500 bg-purple-500/10">
                                <FaUserTie size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#1a1f36] dark:text-white">Employees on Leave</p>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{employeeStats?.on_leave ?? 0} currently away</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-cyan-500 bg-cyan-500/10">
                                <FaUsers size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#1a1f36] dark:text-white">Active Employees</p>
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{employeeStats?.active_employees ?? 0} of {employeeStats?.total_employees ?? 0} total</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                    <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Top Products</h3>
                    <Link to="/dashboard/products" className="text-sm text-[#45CFFF] hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">#</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Price</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-[#718096] dark:text-[#A0AEC0]">
                                        No products yet.
                                    </td>
                                </tr>
                            ) : (
                                topProducts.map((product, i) => (
                                    <tr key={product.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-3.5 text-sm font-mono text-[#718096] dark:text-[#A0AEC0]">{i + 1}</td>
                                        <td className="px-6 py-3.5 text-sm font-medium text-[#1a1f36] dark:text-white">{product.name}</td>
                                        <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{product.category}</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`text-sm font-medium ${product.stock <= product.min_stock ? "text-red-500" : "text-[#718096] dark:text-[#A0AEC0]"}`}>
                                                {product.stock} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm font-semibold text-[#1a1f36] dark:text-white">
                                            ${Number(product.price).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <button className="text-[#718096] hover:text-[#45CFFF] transition-colors">
                                                <FaEllipsisV size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
