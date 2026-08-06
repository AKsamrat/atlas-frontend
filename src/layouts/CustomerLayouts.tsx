import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CustomerSidebar from "../components/customer/CustomerSidebar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "../components/shared/NotificationBell";
import {
    ChevronRight,
    Home,
    LogOut,
    User,
    Settings,
    Sun,
    Moon,
} from "lucide-react";

const pageMeta: Record<string, { title: string; section: string }> = {
    "/customer": { title: "My Dashboard", section: "Customer" },
    "/customer/orders": { title: "My Orders", section: "Customer" },
    "/customer/profile": { title: "My Profile", section: "Customer" },
};

const CustomerLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const meta = pageMeta[location.pathname] || { title: "Dashboard", section: "Customer" };
    const userName = user?.name || "Customer";

    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#060B14] flex">
            <CustomerSidebar />
            <div className="flex-1 min-w-0 bg-[#f8f9fc] dark:bg-[#060B14]">
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B1730]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06]">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                        <nav className="flex items-center gap-1.5 text-sm min-w-0">
                            <Home size={14} className="text-[#8b95ad] shrink-0" />
                            <ChevronRight size={12} className="text-[#8b95ad]/50 shrink-0" />
                            <span className="text-[#8b95ad] hidden sm:inline">{meta.section}</span>
                            <ChevronRight size={12} className="text-[#8b95ad]/50 hidden sm:block shrink-0" />
                            <span className="font-semibold text-[#1a1f36] dark:text-white truncate">{meta.title}</span>
                        </nav>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center justify-center w-9 h-9 rounded-xl text-[#596887] hover:bg-[#f1f3f8] dark:hover:bg-white/[0.06] hover:text-[#1E56E0] dark:hover:text-[#45CFFF] transition-all"
                                title="Toggle theme"
                            >
                                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            <NotificationBell panel="customer" />

                            <div className="w-px h-6 bg-black/[0.06] dark:bg-white/[0.08] mx-1 hidden sm:block" />

                            <div ref={profileRef} className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-[#f1f3f8] dark:hover:bg-white/[0.06] transition-all"
                                >
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar.startsWith("http") ? user.avatar : `${import.meta.env.VITE_API_URL?.replace("/api", "")}/storage/${user.avatar}`}
                                            alt={userName}
                                            className="w-8 h-8 rounded-lg object-cover ring-2 ring-[#45CFFF]/20"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">{userName[0]?.toUpperCase() || "C"}</span>
                                        </div>
                                    )}
                                    <div className="hidden md:block text-left">
                                        <p className="text-[13px] font-semibold text-[#1a1f36] dark:text-white leading-tight">{userName}</p>
                                        <p className="text-[11px] text-[#8b95ad] capitalize leading-tight">Customer</p>
                                    </div>
                                    <ChevronRight size={12} className="hidden md:block text-[#8b95ad] ml-1" />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#0F1E3D] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-2xl overflow-hidden">
                                        <div className="px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                                            <p className="text-sm font-semibold text-[#1a1f36] dark:text-white">{userName}</p>
                                            <p className="text-xs text-[#8b95ad] truncate">{user?.email || ""}</p>
                                        </div>
                                        <div className="py-1.5">
                                            <button
                                                onClick={() => { navigate("/customer/profile"); setProfileOpen(false); }}
                                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-[#596887] hover:bg-[#f8f9fc] dark:hover:bg-white/[0.04] hover:text-[#1a1f36] dark:hover:text-white transition-colors"
                                            >
                                                <User size={15} />
                                                <span>My Profile</span>
                                            </button>
                                            <button
                                                onClick={() => { navigate("/customer/orders"); setProfileOpen(false); }}
                                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-[#596887] hover:bg-[#f8f9fc] dark:hover:bg-white/[0.04] hover:text-[#1a1f36] dark:hover:text-white transition-colors"
                                            >
                                                <Settings size={15} />
                                                <span>My Orders</span>
                                            </button>
                                        </div>
                                        <div className="border-t border-black/[0.06] dark:border-white/[0.06] py-1.5">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut size={15} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="p-4 sm:p-6 bg-[#f1f3f8] dark:bg-[#081020] min-h-[calc(100vh-64px)]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default CustomerLayout;
