import { useState, useEffect, useMemo, useRef } from "react";
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
    FaChartBar,
    FaCalendarAlt,
    FaTimes,
    FaChevronDown,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { ordersApi, type OrderStats, type OrderData } from "../../services/Order";
import { productsApi, type ProductStats, type ProductData } from "../../services/Product";
import { employeesApi, type EmployeeStats } from "../../services/Employee";
import { expensesApi, type ExpenseStats } from "../../services/Expense";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

export default function DashboardHome() {
    const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
    const [productStats, setProductStats] = useState<ProductStats | null>(null);
    const [employeeStats, setEmployeeStats] = useState<EmployeeStats | null>(null);
    const [expenseStats, setExpenseStats] = useState<ExpenseStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);
    const [chartOrders, setChartOrders] = useState<OrderData[]>([]);
    const [topProducts, setTopProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [barChartView, setBarChartView] = useState<"monthly" | "status">("monthly");
    const [chartFromDate, setChartFromDate] = useState("");
    const [chartToDate, setChartToDate] = useState("");
    const [showPresetDropdown, setShowPresetDropdown] = useState(false);
    const [activePreset, setActivePreset] = useState("all");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowPresetDropdown(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const applyPreset = (preset: string) => {
        const today = new Date();
        const fmt = (d: Date) => d.toISOString().split("T")[0];
        setActivePreset(preset);
        setShowPresetDropdown(false);
        switch (preset) {
            case "today": {
                const todayStr = fmt(today);
                setChartFromDate(todayStr);
                setChartToDate(todayStr);
                break;
            }
            case "7d": {
                const from = new Date(today);
                from.setDate(from.getDate() - 7);
                setChartFromDate(fmt(from));
                setChartToDate(fmt(today));
                break;
            }
            case "30d": {
                const from = new Date(today);
                from.setDate(from.getDate() - 30);
                setChartFromDate(fmt(from));
                setChartToDate(fmt(today));
                break;
            }
            case "thisMonth": {
                const from = new Date(today.getFullYear(), today.getMonth(), 1);
                setChartFromDate(fmt(from));
                setChartToDate(fmt(today));
                break;
            }
            case "lastMonth": {
                const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const to = new Date(today.getFullYear(), today.getMonth(), 0);
                setChartFromDate(fmt(from));
                setChartToDate(fmt(to));
                break;
            }
            case "thisYear": {
                const from = new Date(today.getFullYear(), 0, 1);
                setChartFromDate(fmt(from));
                setChartToDate(fmt(today));
                break;
            }
            default:
                setChartFromDate("");
                setChartToDate("");
        }
    };

    const presetLabel = useMemo(() => {
        const map: Record<string, string> = {
            all: "All Time",
            today: "Today",
            "7d": "Last 7 Days",
            "30d": "Last 30 Days",
            thisMonth: "This Month",
            lastMonth: "Last Month",
            thisYear: "This Year",
            custom: "Custom Range",
        };
        return map[activePreset] || "Custom Range";
    }, [activePreset]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [ordersStatsRes, productsStatsRes, employeesStatsRes, expensesStatsRes, recentOrdersRes, chartOrdersRes, topProductsRes] =
                await Promise.allSettled([
                    ordersApi.stats(),
                    productsApi.stats(),
                    employeesApi.stats(),
                    expensesApi.stats(),
                    ordersApi.getAll({ per_page: 5 }),
                    ordersApi.getAll({ per_page: 100 }),
                    productsApi.getAll({ per_page: 5 }),
                ]);

            if (ordersStatsRes.status === "fulfilled") setOrderStats(ordersStatsRes.value.data);
            if (productsStatsRes.status === "fulfilled") setProductStats(productsStatsRes.value.data);
            if (employeesStatsRes.status === "fulfilled") setEmployeeStats(employeesStatsRes.value.data);
            if (expensesStatsRes.status === "fulfilled") setExpenseStats(expensesStatsRes.value.data);
            if (recentOrdersRes.status === "fulfilled") setRecentOrders(recentOrdersRes.value.data.data);
            if (chartOrdersRes.status === "fulfilled") setChartOrders(chartOrdersRes.value.data.data);
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

    /* ── Chart Data ─────────────────────────────────────────────── */

    const PIE_COLORS = ["#10B981", "#EF4444"];

    // Pie chart: Total Sales vs Profit
    const salesProfitData = useMemo(() => {
        const totalSales = Number(orderStats?.total_revenue ?? 0);
        const totalExpenses = Number(expenseStats?.approved_total ?? 0);
        const profit = Math.max(0, totalSales - totalExpenses);
        return [
            { name: "Sales", value: totalSales, fill: PIE_COLORS[0] },
            { name: "Expenses", value: totalExpenses, fill: PIE_COLORS[1] },
        ].filter((d) => d.value > 0);
    }, [orderStats, expenseStats]);

    // Bar chart: Monthly orders broken down by status
    const monthlyData = useMemo(() => {
        const filtered = chartOrders.filter((o) => {
            const d = new Date(o.created_at);
            if (chartFromDate && d < new Date(chartFromDate)) return false;
            if (chartToDate) {
                const to = new Date(chartToDate);
                to.setHours(23, 59, 59, 999);
                if (d > to) return false;
            }
            return true;
        });

        const monthMap: Record<string, { completed: number; processing: number; pending: number }> = {};
        filtered.forEach((o) => {
            const d = new Date(o.created_at);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
            if (!monthMap[key]) monthMap[key] = { completed: 0, processing: 0, pending: 0 };
            if (o.status === "completed") monthMap[key].completed++;
            else if (o.status === "processing") monthMap[key].processing++;
            else if (o.status === "pending") monthMap[key].pending++;
        });
        return Object.entries(monthMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-12)
            .map(([k, v]) => ({
                name: new Date(k + "-01").toLocaleDateString("en-US", { month: "short" }),
                Completed: v.completed,
                Processing: v.processing,
                Pending: v.pending,
            }));
    }, [chartOrders, chartFromDate, chartToDate]);

    // Bar chart: Orders by status (filtered by date)
    const ordersByStatusData = useMemo(() => {
        const filtered = chartOrders.filter((o) => {
            const d = new Date(o.created_at);
            if (chartFromDate && d < new Date(chartFromDate)) return false;
            if (chartToDate) {
                const to = new Date(chartToDate);
                to.setHours(23, 59, 59, 999);
                if (d > to) return false;
            }
            return true;
        });
        const counts: Record<string, number> = { completed: 0, processing: 0, pending: 0, cancelled: 0 };
        filtered.forEach((o) => { if (o.status in counts) counts[o.status]++; });
        const statusColors: Record<string, string> = {
            completed: "#10B981",
            processing: "#3B82F6",
            pending: "#F59E0B",
            cancelled: "#EF4444",
        };
        return Object.entries(counts).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            fill: statusColors[name],
        }));
    }, [chartOrders, chartFromDate, chartToDate]);

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

            {/* ── Charts Section ── */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Bar Chart — Monthly Orders / By Status */}
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Orders Overview</h3>
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Date Range Picker */}
                            <div ref={dropdownRef} className="relative">
                                <button
                                    onClick={() => setShowPresetDropdown(!showPresetDropdown)}
                                    className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#f8fafc] px-3 py-2 text-xs font-medium text-[#1a1f36] transition-all hover:border-[#45CFFF]/50 hover:shadow-sm dark:border-[#2D3748] dark:bg-[#0F1E3D] dark:text-white dark:hover:border-[#45CFFF]/50"
                                >
                                    <FaCalendarAlt size={12} className="text-[#45CFFF]" />
                                    {chartFromDate && chartToDate ? (
                                        <span>{new Date(chartFromDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {new Date(chartToDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                    ) : (
                                        <span>All Time</span>
                                    )}
                                    <FaChevronDown size={10} className={`text-[#A0AEC0] transition-transform ${showPresetDropdown ? "rotate-180" : ""}`} />
                                </button>
                                {showPresetDropdown && (
                                    <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-xl dark:border-[#2D3748] dark:bg-[#0B1730]">
                                        {/* Quick Presets */}
                                        <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#A0AEC0]">Quick Select</p>
                                        {[
                                            { key: "all", label: "All Time" },
                                            { key: "today", label: "Today" },
                                            { key: "7d", label: "Last 7 Days" },
                                            { key: "30d", label: "Last 30 Days" },
                                            { key: "thisMonth", label: "This Month" },
                                            { key: "lastMonth", label: "Last Month" },
                                            { key: "thisYear", label: "This Year" },
                                        ].map((item) => (
                                            <button
                                                key={item.key}
                                                onClick={() => applyPreset(item.key)}
                                                className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-all ${activePreset === item.key ? "bg-[#45CFFF]/10 text-[#1E56E0] dark:bg-[#45CFFF]/10 dark:text-[#45CFFF]" : "text-[#718096] hover:bg-[#f8fafc] dark:text-[#A0AEC0] dark:hover:bg-white/[0.04]"}`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                        {/* Custom Range */}
                                        <div className="mt-2 border-t border-[#E2E8F0] pt-2 dark:border-[#2D3748]">
                                            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#A0AEC0]">Custom Range</p>
                                            <div className="flex items-center gap-2 px-3 pb-2">
                                                <input
                                                    type="date"
                                                    value={chartFromDate}
                                                    onChange={(e) => { setChartFromDate(e.target.value); setActivePreset("custom"); }}
                                                    className="flex-1 rounded-lg border border-[#E2E8F0] bg-[#f8fafc] px-2.5 py-2 text-xs text-[#1a1f36] dark:border-[#2D3748] dark:bg-[#0F1E3D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#45CFFF]"
                                                />
                                                <span className="text-xs text-[#A0AEC0]">–</span>
                                                <input
                                                    type="date"
                                                    value={chartToDate}
                                                    onChange={(e) => { setChartToDate(e.target.value); setActivePreset("custom"); }}
                                                    className="flex-1 rounded-lg border border-[#E2E8F0] bg-[#f8fafc] px-2.5 py-2 text-xs text-[#1a1f36] dark:border-[#2D3748] dark:bg-[#0F1E3D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#45CFFF]"
                                                />
                                            </div>
                                        </div>
                                        {/* Clear */}
                                        {(chartFromDate || chartToDate) && (
                                            <button
                                                onClick={() => { setChartFromDate(""); setChartToDate(""); setActivePreset("all"); setShowPresetDropdown(false); }}
                                                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-500 transition-all hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400"
                                            >
                                                <FaTimes size={10} /> Clear Filter
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* View Toggle */}
                            <div className="flex rounded-xl border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden bg-[#f8fafc] dark:bg-[#0F1E3D]">
                                <button
                                    onClick={() => setBarChartView("monthly")}
                                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all ${barChartView === "monthly" ? "bg-[#1E56E0] text-white shadow" : "text-[#718096] dark:text-[#A0AEC0] hover:bg-white dark:hover:bg-white/[0.04]"}`}
                                >
                                    <FaCalendarAlt size={11} /> Monthly
                                </button>
                                <button
                                    onClick={() => setBarChartView("status")}
                                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all ${barChartView === "status" ? "bg-[#1E56E0] text-white shadow" : "text-[#718096] dark:text-[#A0AEC0] hover:bg-white dark:hover:bg-white/[0.04]"}`}
                                >
                                    <FaChartBar size={11} /> By Status
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={(barChartView === "monthly" ? monthlyData : ordersByStatusData) as any} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#718096" }} axisLine={false} tickLine={false} interval={0} angle={barChartView === "monthly" && monthlyData.length > 6 ? -35 : 0} textAnchor={barChartView === "monthly" && monthlyData.length > 6 ? "end" : "middle"} height={barChartView === "monthly" && monthlyData.length > 6 ? 50 : 30} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#718096" }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #E2E8F0",
                                        borderRadius: "12px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                        fontSize: "13px",
                                    }}
                                    formatter={(value: unknown, name: unknown) => [Number(value).toLocaleString(), String(name)]}
                                    cursor={{ fill: "rgba(69,207,255,0.06)" }}
                                />
                                {barChartView === "monthly" ? (
                                    <>
                                        <Bar dataKey="Completed" fill="#10B981" radius={[4, 4, 0, 0]} barSize={14} name="Completed" />
                                        <Bar dataKey="Processing" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={14} name="Processing" />
                                        <Bar dataKey="Pending" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={14} name="Pending" />
                                    </>
                                ) : (
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                        {ordersByStatusData.map((entry, idx) => (
                                            <Cell key={idx} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart — Total Sales vs Profit */}
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-6">
                    <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white mb-4">Total Sales vs Expenses</h3>
                    <div className="h-[260px]">
                        {salesProfitData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={salesProfitData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={95}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                        label={(({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`) as any}
                                        labelLine={false}
                                    >
                                        {salesProfitData.map((entry, idx) => (
                                            <Cell key={idx} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: unknown) => `$${Number(value).toLocaleString()}`}
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #E2E8F0",
                                            borderRadius: "12px",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                            fontSize: "13px",
                                        }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        iconSize={8}
                                        wrapperStyle={{ fontSize: "12px", color: "#718096" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-sm text-[#A0AEC0]">No sales data available</div>
                        )}
                    </div>
                </div>
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
                                            <td className="px-3 sm:px-6 py-3 text-sm font-medium text-[#45CFFF]">#{order.order_number}</td>
                                            <td className="px-3 sm:px-6 py-3">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{order.customer_name}</p>
                                                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0] hidden sm:block">{order.customer_email}</p>
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-6 py-3 text-sm font-semibold text-[#1a1f36] dark:text-white">
                                                ${Number(order.total_amount).toLocaleString()}
                                            </td>
                                            <td className="px-3 sm:px-6 py-3">
                                                <span className={`px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(order.status)}`}>
                                                    {formatStatus(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-6 py-3 text-sm text-[#718096] dark:text-[#A0AEC0]">
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
                                        <td className="px-3 sm:px-6 py-3 text-sm font-mono text-[#718096] dark:text-[#A0AEC0]">{i + 1}</td>
                                        <td className="px-3 sm:px-6 py-3 text-sm font-medium text-[#1a1f36] dark:text-white">{product.name}</td>
                                        <td className="px-3 sm:px-6 py-3 text-sm text-[#718096] dark:text-[#A0AEC0] hidden sm:table-cell">{product.category}</td>
                                        <td className="px-3 sm:px-6 py-3">
                                            <span className={`text-sm font-medium ${product.stock <= product.min_stock ? "text-red-500" : "text-[#718096] dark:text-[#A0AEC0]"}`}>
                                                {product.stock} units
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 text-sm font-semibold text-[#1a1f36] dark:text-white">
                                            ${Number(product.price).toLocaleString()}
                                        </td>
                                        <td className="px-3 sm:px-6 py-3">
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
