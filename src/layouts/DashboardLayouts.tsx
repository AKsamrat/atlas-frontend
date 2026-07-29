
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import { useAuth } from "../context/AuthContext";

const pageTitles: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/employees": "Employees",
    "/dashboard/attendance": "Attendance",
    "/dashboard/leave": "Leave Management",
    "/dashboard/departments": "Departments",
    "/dashboard/payroll": "Payroll",
    "/dashboard/products": "Products",
    "/dashboard/orders": "Orders",
    "/dashboard/customers": "Customers",
    "/dashboard/inventory": "Inventory",
    "/dashboard/settings": "Settings",
    "/dashboard/content/services": "Manage Services",
    "/dashboard/content/partners": "Manage Partners",
    "/dashboard/content/testimonials": "Manage Testimonials",
    "/dashboard/content/contact": "Contact & Branding",
    "/dashboard/content/domain-packages": "Domain & Hosting Packages",
    "/dashboard/content/service-packages": "Service Packages & Pricing",
};

const DashboardLayout = () => {
    const location = useLocation();
    const pageName = pageTitles[location.pathname] || "Dashboard";

    const { user } = useAuth();
    const userName = user?.name || "Admin";

    return (
        <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#060B14] flex">
            <Sidebar />
            <div className="flex-1 bg-[#f8f9fc] dark:bg-[#060B14]">
                <header className="bg-white dark:bg-[#0F1E3D] shadow-sm border-b border-black/8 dark:border-white/[0.08]">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-[#45CFFF] mb-1">{user?.role === "admin" ? "Admin" : "User"}</p>
                                <h1 className="text-xl font-sora font-bold text-[#1a1f36] dark:text-white">{pageName}</h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#45CFFF]/10 text-[#45CFFF] text-xs font-medium">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Online
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-[#596887] dark:text-[#B9C7E0]">Welcome, {userName}</span>
                                    <div className="w-9 h-9 bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">{userName[0]?.toUpperCase() || "A"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="p-6 bg-[#f1f3f8] dark:bg-[#081020] min-h-[calc(100vh-65px)]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;