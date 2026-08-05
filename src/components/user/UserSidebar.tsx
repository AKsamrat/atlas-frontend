/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaTachometerAlt,
    FaUser,
    FaCalendarCheck,
    FaHistory,
    FaMoneyBillWave,
    FaClipboardList,
    FaBars,
    FaChevronDown,
    FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import entraLogo from "../../assets/entra-logo.png";

const userRoutes: Array<{ name: string; path?: string; icon: React.ReactNode; children?: Array<{ name: string; path: string }> }> = [
    {
        name: "Home",
        path: "/",
        icon: <FaHome />,
    },
    {
        name: "Dashboard",
        path: "/user",
        icon: <FaTachometerAlt />,
    },
    {
        name: "My Profile",
        path: "/user/profile",
        icon: <FaUser />,
    },
    {
        name: "Attendance",
        path: "/user/attendance",
        icon: <FaCalendarCheck />,
    },
    {
        name: "Leave",
        path: "/user/leave",
        icon: <FaHistory />,
    },
    {
        name: "Salary",
        path: "/user/salary",
        icon: <FaMoneyBillWave />,
    },
    {
        name: "Daily Submission",
        path: "/user/daily-submission",
        icon: <FaClipboardList />,
    },
];

const UserSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] flex items-center justify-center text-[#1a1f36] dark:text-white shadow-lg"
            >
                <FaBars size={16} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-white dark:bg-[#0F1E3D] border-r border-[#E2E8F0] dark:border-[#2D3748] flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                {/* Brand */}
                <div className="px-5 py-5 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
                            <img src={entraLogo} alt="Entra Global Tech" className="h-8 w-auto" />
                        </div>
                        <div>
                            <h2 className="font-sora font-bold text-[#1a1f36] dark:text-white text-sm leading-tight">Entra</h2>
                            <p className="text-[10px] text-[#718096] dark:text-[#A0AEC0] font-mono uppercase">Employee Panel</p>
                        </div>
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-4 px-3 overflow-y-auto">
                    <div className="space-y-1">
                        {userRoutes.map((item) => {
                            const isActive = item.children
                                ? item.children.some((c) => location.pathname === c.path)
                                : location.pathname === item.path;

                            if (item.children) {
                                return (
                                    <SidebarGroup
                                        key={item.name}
                                        item={item}
                                        isActive={isActive}
                                        location={location}
                                        onClose={() => setIsOpen(false)}
                                    />
                                );
                            }

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path!}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive: active }) =>
                                        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                                            ? "bg-gradient-to-r from-[#45CFFF]/10 to-[#1E56E0]/10 text-[#1E56E0] dark:text-[#45CFFF] border border-[#45CFFF]/20"
                                            : "text-[#596887] dark:text-[#B9C7E0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.04]"
                                        }`
                                    }
                                >
                                    <span className="text-base">{item.icon}</span>
                                    <span>{item.name}</span>
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                {/* User Info + Logout */}
                <div className="p-3 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] mb-2">
                        {user?.avatar ? (
                            <img
                                src={user.avatar.startsWith("http") ? user.avatar : `${import.meta.env.VITE_API_URL?.replace("/api", "")}/storage/${user.avatar}`}
                                alt={user?.name || "User"}
                                className="w-9 h-9 rounded-full object-cover border-2 border-[#45CFFF]/30 flex-shrink-0"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#1a1f36] dark:text-white truncate">{user?.name || "User"}</p>
                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0] truncate">{user?.email || "user@email.com"}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    >
                        <FaSignOutAlt size={14} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

const SidebarGroup = ({ item, isActive, onClose }: any) => {
    const [open, setOpen] = useState(isActive);

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? "bg-gradient-to-r from-[#45CFFF]/10 to-[#1E56E0]/10 text-[#1E56E0] dark:text-[#45CFFF] border border-[#45CFFF]/20"
                    : "text-[#596887] dark:text-[#B9C7E0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.04]"
                    }`}
            >
                <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                </div>
                <FaChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && (
                <div className="ml-4 mt-1 space-y-0.5 pl-4 border-l border-[#E2E8F0] dark:border-[#2D3748]">
                    {item.children.map((child: any) => (
                        <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={onClose}
                            className={({ isActive: active }) =>
                                `block px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${active
                                    ? "bg-[#45CFFF]/10 text-[#1E56E0] dark:text-[#45CFFF]"
                                    : "text-[#596887] dark:text-[#B9C7E0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.04]"
                                }`
                            }
                        >
                            {child.name}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserSidebar;
