
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";

const DashboardLayout = () => {

    const user = {
        name: "samrat",
        role: "Admin",

    }
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div>

                <Sidebar />
            </div>
            <div className=" w-full">

                <header className="bg-white shadow-sm border-b">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                <span className="uppercase">{user?.role} </span> Dashboard
                            </h1>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">
                                    Welcome, {user?.name}
                                </span>
                                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user.name.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;