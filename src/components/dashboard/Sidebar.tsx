/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaTachometerAlt,
    FaShoppingCart,
    FaBars,
    FaChevronRight,
    FaUserTie,
    FaCog,
    FaWallet,
    FaSignOutAlt,
    FaGlobe,
    FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

/* ------------------------------------------------------------------ */
/*  Sidebar navigation data                                           */
/* ------------------------------------------------------------------ */
const sidebarRoutes = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: FaTachometerAlt,
    },
    {
        name: "HR Management",
        icon: FaUserTie,
        children: [
            { name: "Employees", path: "/dashboard/employees" },
            { name: "Attendance", path: "/dashboard/attendance" },
            { name: "Leave Management", path: "/dashboard/leave" },
            { name: "Departments", path: "/dashboard/departments" },
            { name: "Payroll", path: "/dashboard/payroll" },
        ],
    },
    {
        name: "E-Commerce",
        icon: FaShoppingCart,
        children: [
            { name: "Products", path: "/dashboard/products" },
            { name: "Orders", path: "/dashboard/orders" },
            { name: "Customers", path: "/dashboard/customers" },
            { name: "Inventory", path: "/dashboard/inventory" },
        ],
    },
    {
        name: "Accounting",
        icon: FaWallet,
        children: [
            { name: "Accounts", path: "/dashboard/accounts" },
            { name: "Expenses", path: "/dashboard/expenses" },
            { name: "Salary", path: "/dashboard/salary" },
        ],
    },
    {
        name: "Website Content",
        icon: FaGlobe,
        children: [
            { name: "Services", path: "/dashboard/content/services" },
            { name: "Partners", path: "/dashboard/content/partners" },
            { name: "Testimonials", path: "/dashboard/content/testimonials" },
            { name: "Contact & Branding", path: "/dashboard/content/contact" },
            { name: "Domain Packages", path: "/dashboard/content/domain-packages" },
            { name: "Service Packages", path: "/dashboard/content/service-packages" },
        ],
    },
];

const bottomRoutes = [
    { name: "Home", path: "/", icon: FaHome },
    { name: "Settings", path: "/dashboard/settings", icon: FaCog },
];

/* ------------------------------------------------------------------ */
/*  Sidebar Component                                                 */
/* ------------------------------------------------------------------ */
const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Auto-close mobile sidebar on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Auto-expand active parent on route change
    useEffect(() => {
        const active = sidebarRoutes.find((r) =>
            r.children?.some((c) => location.pathname.startsWith(c.path))
        );
        if (active) setOpenMenu(active.name);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleSubmenu = (menu: string) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const isChildActive = (children: any[]) =>
        children.some((c) => location.pathname.startsWith(c.path));

    const sidebarWidth = collapsed ? "w-[72px]" : "w-64";

    return (
        <>
            {/* ── Mobile Top Bar ──────────────────────────────────── */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#060B14] text-white border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center">
                        <span className="text-xs font-bold text-[#060B14]">A</span>
                    </div>
                    <span className="font-sora text-sm font-semibold tracking-tight">Admin Panel</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-lg p-2 text-[#B9C7E0] hover:bg-white/[0.06] transition-colors"
                >
                    {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                </button>
            </div>

            {/* ── Sidebar ─────────────────────────────────────────── */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-50 h-screen ${sidebarWidth} flex flex-col bg-[#060B14] text-[#B9C7E0] transition-all duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
                    border-r border-white/[0.06]
                    ${collapsed ? "items-center" : ""}
                `}
            >
                {/* ── Brand Header ──────────────────────────────── */}
                <div className={`flex items-center gap-3 border-b border-white/[0.06] px-4 py-4 shrink-0 ${collapsed ? "justify-center px-0" : ""}`}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] shadow-[0_4px_16px_rgba(46,139,240,0.3)]">
                        <span className="text-sm font-bold text-[#060B14] font-sora">A</span>
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <h2 className="font-sora text-[15px] font-bold tracking-tight text-white truncate">Entra Admin</h2>
                            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#45CFFF]">Control Center</p>
                        </div>
                    )}
                    {/* Desktop collapse toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="ml-auto hidden md:flex h-6 w-6 items-center justify-center rounded-md text-[#596887] hover:bg-white/[0.06] hover:text-white transition-colors"
                        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <FaChevronRight
                            size={10}
                            className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
                        />
                    </button>
                </div>

                {/* ── Main Navigation ────────────────────────────── */}
                <nav className={`flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin ${collapsed ? "px-2" : ""}`}>
                    {/* Top-level nav items */}
                    <NavLink
                        to="/dashboard"
                        end
                        title={collapsed ? "Dashboard" : undefined}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200
                            ${collapsed ? "justify-center px-0" : ""}
                            ${isActive
                                ? "bg-gradient-to-r from-[#45CFFF]/15 to-[#1E56E0]/10 text-[#45CFFF] shadow-[inset_0_0_0_1px_rgba(69,207,255,0.15)]"
                                : "text-[#8b95ad] hover:bg-white/[0.04] hover:text-white"
                            }`
                        }
                    >
                        <FaTachometerAlt size={15} className="shrink-0" />
                        {!collapsed && <span>Dashboard</span>}
                    </NavLink>

                    {/* Section label */}
                    {!collapsed && (
                        <div className="pt-4 pb-2 px-3">
                            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[#596887]">
                                Management
                            </span>
                        </div>
                    )}
                    {collapsed && <div className="mx-auto my-3 h-px w-6 bg-white/[0.08]" />}

                    {/* Dropdown groups */}
                    {sidebarRoutes.filter(r => r.children).map((item, index) => {
                        const activeParent = isChildActive(item.children!);
                        const isOpenGroup = openMenu === item.name;
                        const Icon = item.icon;

                        return (
                            <div key={index}>
                                <button
                                    onClick={() => toggleSubmenu(item.name)}
                                    title={collapsed ? item.name : undefined}
                                    className={`group flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200
                                        ${collapsed ? "justify-center px-0" : ""}
                                        ${activeParent
                                            ? "bg-gradient-to-r from-[#45CFFF]/15 to-[#1E56E0]/10 text-[#45CFFF] shadow-[inset_0_0_0_1px_rgba(69,207,255,0.15)]"
                                            : "text-[#8b95ad] hover:bg-white/[0.04] hover:text-white"
                                        }`}
                                >
                                    <Icon size={15} className="shrink-0" />
                                    {!collapsed && (
                                        <>
                                            <span className="flex-1 text-left truncate">{item.name}</span>
                                            <FaChevronRight
                                                size={9}
                                                className={`shrink-0 transition-transform duration-300 text-[#596887] ${isOpenGroup ? "rotate-90" : ""}`}
                                            />
                                        </>
                                    )}
                                </button>

                                {/* Submenu */}
                                {isOpenGroup && item.children && (
                                    <div className={`${collapsed ? "absolute left-[72px] top-0 z-50 ml-1 mt-2 w-52 rounded-xl border border-white/[0.08] bg-[#0B1730] py-2 shadow-2xl" : "ml-0 mt-1 space-y-0.5 pl-[18px]"}`}>
                                        {!collapsed && (
                                            <div className="ml-4 mb-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
                                        )}
                                        {item.children.map((child, i) => (
                                            <NavLink
                                                key={i}
                                                to={child.path}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] font-medium transition-all duration-200
                                                    ${collapsed ? "px-3 gap-2" : "ml-2"}
                                                    ${isActive
                                                        ? "bg-[#45CFFF]/10 text-[#45CFFF] shadow-[inset_0_0_0_1px_rgba(69,207,255,0.12)]"
                                                        : "text-[#8b95ad] hover:bg-white/[0.04] hover:text-[#B9C7E0]"
                                                    }`
                                                }
                                            >
                                                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${location.pathname.startsWith(child.path) ? "bg-[#45CFFF]" : "bg-[#596887]/50"}`} />
                                                <span className="truncate">{child.name}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* ── Bottom Section ─────────────────────────────── */}
                <div className={`border-t border-white/[0.06] px-3 py-3 space-y-1 shrink-0 ${collapsed ? "px-2" : ""}`}>
                    {/* Bottom links */}
                    {bottomRoutes.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={index}
                                to={item.path}
                                title={collapsed ? item.name : undefined}
                                className={({ isActive }) =>
                                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200
                                    ${collapsed ? "justify-center px-0" : ""}
                                    ${isActive
                                        ? "bg-gradient-to-r from-[#45CFFF]/15 to-[#1E56E0]/10 text-[#45CFFF] shadow-[inset_0_0_0_1px_rgba(69,207,255,0.15)]"
                                        : "text-[#8b95ad] hover:bg-white/[0.04] hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={15} className="shrink-0" />
                                {!collapsed && <span>{item.name}</span>}
                            </NavLink>
                        );
                    })}

                    {/* Divider */}
                    <div className={`my-2 h-px bg-white/[0.06] ${collapsed ? "mx-1" : ""}`} />

                    {/* User Card */}
                    <div className={`rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 ${collapsed ? "px-2" : ""}`}>
                        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
                            <div className="relative shrink-0">
                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center shadow-[0_4px_12px_rgba(46,139,240,0.25)]">
                                    <span className="text-sm font-bold text-[#060B14] font-sora">
                                        {user?.name?.[0]?.toUpperCase() || "A"}
                                    </span>
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#060B14] bg-emerald-400" />
                            </div>
                            {!collapsed && (
                                <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-semibold text-white truncate">{user?.name || "Admin"}</p>
                                    <p className="text-[11px] text-[#596887] truncate">{user?.email || "admin@email.com"}</p>
                                </div>
                            )}
                        </div>

                        {/* Sign Out */}
                        <button
                            onClick={handleLogout}
                            title={collapsed ? "Sign Out" : undefined}
                            className={`mt-2.5 flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-[12px] font-medium text-[#8b95ad] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200
                                ${collapsed ? "justify-center px-0" : ""}`}
                        >
                            <FaSignOutAlt size={13} className="shrink-0" />
                            {!collapsed && <span>Sign Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Mobile Overlay ──────────────────────────────────── */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;