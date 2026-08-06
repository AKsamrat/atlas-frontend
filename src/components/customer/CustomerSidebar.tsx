import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaTachometerAlt,
    FaUser,
    FaShoppingBag,
    FaSignOutAlt,
    FaBars,
    FaChevronRight,
    FaTimes,
    FaBell,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import entraLogo from "../../assets/entra-logo.png";

/* ------------------------------------------------------------------ */
/*  Customer Sidebar navigation                                       */
/* ------------------------------------------------------------------ */
const customerRoutes = [
    { name: "Dashboard", path: "/customer", icon: FaTachometerAlt },
    { name: "My Orders", path: "/customer/orders", icon: FaShoppingBag },
    { name: "Notifications", path: "/customer/notifications", icon: FaBell },
    { name: "My Profile", path: "/customer/profile", icon: FaUser },
];

const CustomerSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const sidebarWidth = collapsed ? "w-[72px]" : "w-64";

    return (
        <>
            {/* ── Mobile Top Bar ──────────────────────────────────── */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#060B14] text-white border-b border-white/6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-lg bg-white p-1">
                        <img src={entraLogo} alt="Entra" className="h-7 w-auto" />
                    </div>
                    <span className="font-sora text-sm font-semibold tracking-tight">Customer Panel</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-lg p-2 text-[#B9C7E0] hover:bg-white/6 transition-colors"
                >
                    {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                </button>
            </div>

            {/* ── Sidebar ─────────────────────────────────────────── */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-50 h-screen ${sidebarWidth} flex flex-col bg-[#060B14] text-[#B9C7E0] transition-all duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
                    border-r border-white/6
                    ${collapsed ? "items-center" : ""}
                `}
            >
                {/* ── Brand Header ──────────────────────────────── */}
                <div className={`flex items-center gap-3 border-b border-white/6 px-4 py-4 shrink-0 ${collapsed ? "justify-center px-0" : ""}`}>
                    <div className="flex shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
                        <img
                            src={entraLogo}
                            alt="Entra Global Tech"
                            className={`${collapsed ? "h-7 w-7 object-contain" : "h-8 w-auto"}`}
                        />
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <h2 className="font-sora text-[15px] font-bold tracking-tight text-white truncate">Entra</h2>
                            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#45CFFF]">Customer Panel</p>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="ml-auto hidden md:flex h-6 w-6 items-center justify-center rounded-md text-[#596887] hover:bg-white/6 hover:text-white transition-colors"
                        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <FaChevronRight
                            size={10}
                            className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
                        />
                    </button>
                </div>

                {/* ── Navigation ─────────────────────────────────── */}
                <nav className={`flex-1 overflow-y-auto px-3 py-4 space-y-1 ${collapsed ? "px-2" : ""}`}>
                    {customerRoutes.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/customer"}
                            title={collapsed ? item.name : undefined}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200
                                ${collapsed ? "justify-center px-0" : ""}
                                ${isActive
                                    ? "bg-gradient-to-r from-[#45CFFF]/15 to-[#1E56E0]/10 text-[#45CFFF] shadow-[inset_0_0_0_1px_rgba(69,207,255,0.15)]"
                                    : "text-[#8b95ad] hover:bg-white/4 hover:text-white"
                                }`
                            }
                        >
                            <item.icon size={15} className="shrink-0" />
                            {!collapsed && <span>{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* ── User Info + Logout ─────────────────────────── */}
                <div className={`border-t border-white/6 px-3 py-3 space-y-1 shrink-0 ${collapsed ? "px-2" : ""}`}>
                    <div className={`rounded-xl bg-white/3 border border-white/5 p-3 ${collapsed ? "px-2" : ""}`}>
                        <div className="flex items-center gap-3">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar.startsWith("http") ? user.avatar : `${import.meta.env.VITE_API_URL?.replace("/api", "")}/storage/${user.avatar}`}
                                    alt={user?.name || "User"}
                                    className="w-9 h-9 rounded-full object-cover border-2 border-[#45CFFF]/30 shrink-0"
                                />
                            ) : (
                                <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center shadow-[0_4px_12px_rgba(46,139,240,0.25)]">
                                    <span className="text-white text-xs font-bold font-sora">
                                        {user?.name?.charAt(0)?.toUpperCase() || "C"}
                                    </span>
                                </div>
                            )}
                            {!collapsed && (
                                <div className="min-w-0">
                                    <p className="text-[13px] font-medium text-white truncate">{user?.name || "Customer"}</p>
                                    <p className="text-[11px] text-[#596887] truncate">{user?.email || ""}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <NavLink
                        to="/"
                        title={collapsed ? "Home" : undefined}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all
                            ${collapsed ? "justify-center px-0" : ""}
                            ${isActive
                                ? "bg-gradient-to-r from-[#45CFFF]/15 to-[#1E56E0]/10 text-[#45CFFF]"
                                : "text-[#8b95ad] hover:bg-white/4 hover:text-white"
                            }`
                        }
                    >
                        <FaHome size={15} className="shrink-0" />
                        {!collapsed && <span>Home</span>}
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#8b95ad] hover:bg-red-500/10 hover:text-red-400 transition-all
                            ${collapsed ? "justify-center px-0" : ""}`}
                    >
                        <FaSignOutAlt size={15} className="shrink-0" />
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default CustomerSidebar;
