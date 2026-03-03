/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    FaTachometerAlt,
    FaBoxOpen,
    FaShoppingCart,
    FaUsers,
    FaBars,
    FaChevronDown,
} from "react-icons/fa";

const sidebarRoutes = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: <FaTachometerAlt />,
    },
    {
        name: "Products",
        icon: <FaBoxOpen />,
        children: [
            {
                name: "All Products",
                path: "/dashboard/products",
            },
            {
                name: "Add Product",
                path: "/dashboard/products/add",
            },
        ],
    },
    {
        name: "Orders",
        path: "/dashboard/orders",
        icon: <FaShoppingCart />,
    },
    {
        name: "Users",
        path: "/dashboard/users",
        icon: <FaUsers />,
    },
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const location = useLocation();

    const toggleSubmenu = (menu: string) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const isChildActive = (children: any[]) => {
        return children.some((child) =>
            location.pathname.startsWith(child.path)
        );
    };

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-gray-800 text-white">
                <h2 className="text-lg font-semibold">Dashboard</h2>
                <button onClick={() => setIsOpen(!isOpen)}>
                    <FaBars size={20} />
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 transition-transform duration-300 z-50`}
            >
                <div className="p-5 font-bold text-xl border-b border-gray-700">
                    Admin Panel
                </div>

                <nav className="p-4 space-y-2">
                    {sidebarRoutes.map((item, index) => {
                        // If item has children (submenu)
                        if (item.children) {
                            const activeParent = isChildActive(item.children);

                            return (
                                <div key={index}>
                                    <button
                                        onClick={() => toggleSubmenu(item.name)}
                                        className={`flex items-center justify-between w-full p-2 rounded-md ${activeParent
                                            ? "bg-gray-700"
                                            : "hover:bg-gray-800"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            {item.name}
                                        </div>
                                        <FaChevronDown
                                            className={`transition-transform ${openMenu === item.name || activeParent
                                                ? "rotate-180"
                                                : ""
                                                }`}
                                        />
                                    </button>

                                    {(openMenu === item.name || activeParent) && (
                                        <div className="ml-8 mt-2 space-y-2">
                                            {item.children.map((child, i) => (
                                                <NavLink
                                                    key={i}
                                                    to={child.path}
                                                    className={({ isActive }) =>
                                                        `block p-2 rounded-md ${isActive
                                                            ? "bg-gray-700 font-semibold"
                                                            : "hover:bg-gray-800"
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
                        }

                        // Normal route
                        return (
                            <NavLink
                                key={index}
                                to={item.path!}
                                end
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-2 rounded-md ${isActive
                                        ? "bg-gray-700 font-semibold"
                                        : "hover:bg-gray-800"
                                    }`
                                }
                            >
                                {item.icon}
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;