import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown, FaShoppingCart } from "react-icons/fa";
import { navRoutes } from "../../routes/navRoutes";


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const toggleSubmenu = (name: string) => {
        setOpenSubmenu(openSubmenu === name ? null : name);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-gray-800">
                    Atlas
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex items-center gap-6 font-medium text-gray-700">
                    {navRoutes.map((item, index) => (
                        <li key={index} className="relative group">
                            {item.children ? (
                                <>
                                    <button className="flex items-center gap-1 hover:text-blue-600">
                                        {item.name}
                                        <FaChevronDown size={12} />
                                    </button>

                                    {/* Dropdown */}
                                    <ul className="absolute left-0 top-full mt-2 w-44 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        {item.children.map((child, i) => (
                                            <li key={i}>
                                                <NavLink
                                                    to={child.path!}
                                                    className={({ isActive }) =>
                                                        `block px-4 py-2 hover:bg-gray-100 ${isActive ? "text-blue-600 font-semibold" : ""
                                                        }`
                                                    }
                                                >
                                                    {child.name}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <NavLink
                                    to={item.path!}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-blue-600 font-semibold"
                                            : "hover:text-blue-600"
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <NavLink to="/cart">
                        <FaShoppingCart size={20} />
                    </NavLink>

                    <button
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-md px-4 py-4 space-y-3">
                    {navRoutes.map((item, index) => (
                        <div key={index}>
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() => toggleSubmenu(item.name)}
                                        className="flex items-center justify-between w-full py-1"
                                    >
                                        {item.name}
                                        <FaChevronDown
                                            className={`transition-transform ${openSubmenu === item.name ? "rotate-180" : ""
                                                }`}
                                            size={14}
                                        />
                                    </button>

                                    {openSubmenu === item.name && (
                                        <div className="ml-4 mt-2 space-y-2">
                                            {item.children.map((child, i) => (
                                                <NavLink
                                                    key={i}
                                                    to={child.path!}
                                                    className={({ isActive }) =>
                                                        `block ${isActive
                                                            ? "text-blue-600 font-semibold"
                                                            : ""
                                                        }`
                                                    }
                                                >
                                                    {child.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <NavLink
                                    to={item.path!}
                                    className={({ isActive }) =>
                                        `block py-1 ${isActive ? "text-blue-600 font-semibold" : ""
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;