import { Outlet, useLocation } from "react-router-dom";
import UserSidebar from "../components/user/UserSidebar";
import { useAuth } from "../context/AuthContext";

const pageTitles: Record<string, string> = {
    "/user": "My Dashboard",
    "/user/profile": "My Profile",
    "/user/attendance": "Attendance",
    "/user/leave": "Leave Management",
    "/user/salary": "Salary History",
};

const UserLayout = () => {
    const location = useLocation();
    const pageName = pageTitles[location.pathname] || "Dashboard";

    const { user } = useAuth();
    const currentUser = user || { name: "User", email: "user@email.com" };

    return (
        <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#060B14] flex">
            <UserSidebar />
            <div className="flex-1 bg-[#f8f9fc] dark:bg-[#060B14]">
                <header className="bg-white dark:bg-[#0F1E3D] shadow-sm border-b border-black/8 dark:border-white/[0.08]">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-[#45CFFF] mb-1">Employee</p>
                                <h1 className="text-xl font-sora font-bold text-[#1a1f36] dark:text-white">{pageName}</h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#45CFFF]/10 text-[#45CFFF] text-xs font-medium">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Online
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-[#596887] dark:text-[#B9C7E0]">Welcome, {currentUser.name}</span>
                                    {'avatar' in currentUser && currentUser.avatar ? (
                                        <img
                                            src={(currentUser as { avatar?: string }).avatar!.startsWith("http")
                                                ? (currentUser as { avatar?: string }).avatar!
                                                : `${import.meta.env.VITE_API_URL?.replace("/api", "")}/storage/${(currentUser as { avatar?: string }).avatar!}`}
                                            alt={currentUser.name}
                                            className="w-9 h-9 rounded-full object-cover border-2 border-[#45CFFF]/30 shadow-[0_2px_8px_rgba(69,207,255,0.15)]"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">{currentUser.name[0]?.toUpperCase() || "U"}</span>
                                        </div>
                                    )}
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

export default UserLayout;
