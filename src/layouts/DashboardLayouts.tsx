import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "../components/shared/NotificationBell";
import {
    Search,
    ChevronRight,
    Home,
    LogOut,
    User,
    Settings,
    Sun,
    Moon,
    X,
} from "lucide-react";

/* ── Page metadata ──────────────────────────────────────────────── */
const pageMeta: Record<string, { title: string; section: string }> = {
    "/dashboard": { title: "Overview", section: "Dashboard" },
    "/dashboard/employees": { title: "Employees", section: "HR Management" },
    "/dashboard/attendance": { title: "Attendance", section: "HR Management" },
    "/dashboard/leave": { title: "Leave Management", section: "HR Management" },
    "/dashboard/daily-submissions": { title: "Daily Submissions", section: "HR Management" },
    "/dashboard/departments": { title: "Departments", section: "HR Management" },
    "/dashboard/payroll": { title: "Payroll", section: "HR Management" },
    "/dashboard/products": { title: "Products", section: "E-Commerce" },
    "/dashboard/pos": { title: "Point of Sale", section: "E-Commerce" },
    "/dashboard/orders": { title: "Orders", section: "E-Commerce" },
    "/dashboard/customers": { title: "Customers", section: "E-Commerce" },
    "/dashboard/inventory": { title: "Inventory", section: "E-Commerce" },
    "/dashboard/accounts": { title: "Accounts", section: "Accounting" },
    "/dashboard/expenses": { title: "Expenses", section: "Accounting" },
    "/dashboard/salary": { title: "Salary", section: "Accounting" },
    "/dashboard/settings": { title: "Settings", section: "System" },
    "/dashboard/content/services": { title: "Services", section: "Website Content" },
    "/dashboard/content/partners": { title: "Partners", section: "Website Content" },
    "/dashboard/content/testimonials": { title: "Testimonials", section: "Website Content" },
    "/dashboard/content/contact": { title: "Contact & Branding", section: "Website Content" },
    "/dashboard/content/domain-packages": { title: "Domain Packages", section: "Website Content" },
    "/dashboard/content/service-packages": { title: "Service Packages", section: "Website Content" },
    "/dashboard/subscribers": { title: "Subscribers", section: "Website Content" },
};

/* ── Component ─────────────────────────────────────────────────── */
const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const meta = pageMeta[location.pathname] || { title: "Dashboard", section: "Dashboard" };
    const userName = user?.name || "Admin";

    /* ── State ──────────────────────────────────────────────── */
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    /* ── Close dropdowns on outside click ───────────────────── */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    /* ── Focus search on open ───────────────────────────────── */
    useEffect(() => {
        if (searchOpen) searchRef.current?.focus();
    }, [searchOpen]);

    /* ── Keyboard shortcut: Cmd/Ctrl+K → toggle search ─────── */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen((prev) => !prev);
            }
            if (e.key === "Escape") {
                setSearchOpen(false);
                setProfileOpen(false);
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#060B14] flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 min-w-0 bg-[#f8f9fc] dark:bg-[#060B14]">
                {/* ── Top Header Bar ──────────────────────────── */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B1730]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06]">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">

                        {/* ── Left: Breadcrumbs ──────────────── */}
                        <nav className="flex items-center gap-1.5 text-sm min-w-0">
                            <Home size={14} className="text-[#8b95ad] shrink-0" />
                            <ChevronRight size={12} className="text-[#8b95ad]/50 shrink-0" />
                            <span className="text-[#8b95ad] hidden sm:inline">{meta.section}</span>
                            <ChevronRight size={12} className="text-[#8b95ad]/50 hidden sm:block shrink-0" />
                            <span className="font-semibold text-[#1a1f36] dark:text-white truncate">{meta.title}</span>
                        </nav>

                        {/* ── Right: Actions ─────────────────── */}
                        <div className="flex items-center gap-1">

                            {/* Search toggle */}
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="relative flex items-center justify-center w-9 h-9 rounded-xl text-[#596887] hover:bg-[#f1f3f8] dark:hover:bg-white/[0.06] hover:text-[#1E56E0] dark:hover:text-[#45CFFF] transition-all"
                                title="Search (⌘K)"
                            >
                                <Search size={18} />
                            </button>

                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                className="flex items-center justify-center w-9 h-9 rounded-xl text-[#596887] hover:bg-[#f1f3f8] dark:hover:bg-white/[0.06] hover:text-[#1E56E0] dark:hover:text-[#45CFFF] transition-all"
                                title="Toggle theme"
                            >
                                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            {/* Notifications */}
                            <NotificationBell panel="admin" />

                            {/* Divider */}
                            <div className="w-px h-6 bg-black/[0.06] dark:bg-white/[0.08] mx-1 hidden sm:block" />

                            {/* Profile */}
                            <div ref={profileRef} className="relative">
                                <button
                                    onClick={() => { setProfileOpen(!profileOpen); }}
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
                                            <span className="text-xs font-bold text-white">{userName[0]?.toUpperCase() || "A"}</span>
                                        </div>
                                    )}
                                    <div className="hidden md:block text-left">
                                        <p className="text-[13px] font-semibold text-[#1a1f36] dark:text-white leading-tight">{userName}</p>
                                        <p className="text-[11px] text-[#8b95ad] capitalize leading-tight">{user?.role || "admin"}</p>
                                    </div>
                                    <ChevronRight size={12} className="hidden md:block text-[#8b95ad] ml-1" />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#0F1E3D] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-2xl overflow-hidden">
                                        <div className="px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                                            <p className="text-sm font-semibold text-[#1a1f36] dark:text-white">{userName}</p>
                                            <p className="text-xs text-[#8b95ad] truncate">{user?.email || "admin@entra.com"}</p>
                                        </div>
                                        <div className="py-1.5">
                                            <button
                                                onClick={() => { navigate("/dashboard/settings"); setProfileOpen(false); }}
                                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-[#596887] hover:bg-[#f8f9fc] dark:hover:bg-white/[0.04] hover:text-[#1a1f36] dark:hover:text-white transition-colors"
                                            >
                                                <User size={15} />
                                                <span>My Profile</span>
                                            </button>
                                            <button
                                                onClick={() => { navigate("/dashboard/settings"); setProfileOpen(false); }}
                                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-[#596887] hover:bg-[#f8f9fc] dark:hover:bg-white/[0.04] hover:text-[#1a1f36] dark:hover:text-white transition-colors"
                                            >
                                                <Settings size={15} />
                                                <span>Settings</span>
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

                    {/* ── Expandable Search Bar ──────────────── */}
                    {searchOpen && (
                        <div className="border-t border-black/[0.04] dark:border-white/[0.04] px-4 sm:px-6 py-3">
                            <div className="flex items-center gap-3 max-w-xl mx-auto">
                                <div className="flex-1 flex items-center gap-2 bg-[#f1f3f8] dark:bg-white/[0.04] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#45CFFF]/40 focus-within:bg-white dark:focus-within:bg-white/[0.06] transition-all">
                                    <Search size={16} className="text-[#8b95ad] shrink-0" />
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search orders, employees, products..."
                                        className="flex-1 bg-transparent text-sm text-[#1a1f36] dark:text-white placeholder-[#8b95ad] outline-none"
                                    />
                                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#8b95ad] bg-white dark:bg-white/[0.06] rounded-md border border-black/[0.06] dark:border-white/[0.08]">
                                        ESC
                                    </kbd>
                                </div>
                                <button
                                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                                    className="flex items-center justify-center w-9 h-9 rounded-xl text-[#8b95ad] hover:bg-[#f1f3f8] dark:hover:bg-white/[0.06] hover:text-[#1a1f36] dark:hover:text-white transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </header>

                {/* ── Page Content ────────────────────────────── */}
                <div className="p-4 sm:p-6 bg-[#f1f3f8] dark:bg-[#081020] min-h-[calc(100vh-64px)]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;