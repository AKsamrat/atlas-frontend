import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
    Menu,
    X,
    ChevronDown,
    ShoppingCart,
    User,
    Globe2,

    Shirt,
    FileText,
    BookImage,
    Palette,
    ThumbsUp,
    Rocket,
    Sun,
    Moon,
} from "lucide-react";
import logo from "../../assets/entra-logo.png";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../store/cartStore";

import { type IconType } from "react-icons";

/**
 * Entra Global Tech — Responsive Navbar
 * React + TypeScript + Tailwind
 *
 * - Home / About / Domain & Hosting / Web Development are plain links.
 * - Design and Digital Marketing open a "card" style mega-menu on desktop
 *   (click to open, click outside or Escape to close).
 * - On mobile, the whole menu becomes a slide-down panel with accordions
 *   for the two items that carry submenus.
 * - Cart + user icons sit on the right on both desktop and mobile.
 *
 * Fonts/colors reuse the same tokens as EntraHero.tsx (Sora / Inter /
 * JetBrains Mono, navy #060B14, cyan #45CFFF, blue #1E56E0). See that
 * component's README for the tailwind.config + font <link> setup —
 * this component assumes the same config is already in place.
 */

type LucideIcon = typeof Globe2;
type NavIcon = LucideIcon | IconType;

interface SubMenuItem {
    id: string;
    title: string;
    description: string;
    icon: NavIcon;
    href: string;
}

interface NavItem {
    id: string;
    label: string;
    href: string;
    submenu?: SubMenuItem[];
}

const DESIGN_ITEMS: SubMenuItem[] = [
    { id: "tshirt", title: "T-Shirt Design", description: "Custom prints for teams, events and brand merch.", icon: Shirt, href: "/design/t-shirt" },
    { id: "flyer", title: "Flyer Design", description: "Eye-catching flyers for promos and events.", icon: FileText, href: "/design/flyer" },
    { id: "brochure", title: "Brochure Design", description: "Multi-fold brochures that explain your business.", icon: BookImage, href: "/design/brochure" },
    { id: "branding", title: "Logo & Branding", description: "Logos, color systems and brand guidelines.", icon: Palette, href: "/design/logo-branding" },
];

const MARKETING_ITEMS: SubMenuItem[] = [
    { id: "facebook", title: "Facebook Marketing", description: "Page growth, ads and community management.", icon: FaFacebook, href: "/marketing/facebook" },
    { id: "instagram", title: "Instagram Marketing", description: "Content, reels and audience growth.", icon: FaInstagram, href: "/marketing/instagram" },
    { id: "likes", title: "Likes & Followers", description: "Real engagement growth on your posts and pages.", icon: ThumbsUp, href: "/marketing/likes-followers" },
    { id: "boost", title: "Boosted Post Campaigns", description: "Paid boosts that put posts in front of the right people.", icon: Rocket, href: "/marketing/boosted-posts" },
];

const NAV_ITEMS: NavItem[] = [
    { id: "home", label: "Home", href: "/" },
    // { id: "about", label: "About", href: "/about-us" },
    { id: "hosting", label: "Domain & Hosting", href: "/domain-hosting" },
    { id: "webdev", label: "Website", href: "/web-development" },
    { id: "design", label: "Design", href: "/design/t-shirt", submenu: DESIGN_ITEMS },
    { id: "marketing", label: "Digital Marketing", href: "#marketing", submenu: MARKETING_ITEMS },
];

/** Desktop "card" mega-menu dropdown for items that carry a submenu. */
function DesktopSubmenuCard({ items }: { items: SubMenuItem[] }) {
    return (
        <div
            className="absolute left-1/2 top-full z-[60] mt-3 w-[560px] -translate-x-1/2 rounded-2xl border border-white/[0.09] bg-[#0F1E3D]/95 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-md"
            role="menu"
        >
            <div className="grid grid-cols-2 gap-2">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <a
                            key={item.id}
                            href={item.href}
                            role="menuitem"
                            className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.06]"
                        >
                            <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#45CFFF]/20 to-[#1E56E0]/20 text-[#45CFFF]">
                                <Icon size={18} />
                            </span>
                            <span>
                                <span className="block font-sora text-[0.88rem] font-semibold text-white">{item.title}</span>
                                <span className="mt-0.5 block text-[0.76rem] leading-snug text-[#7C8AAD]">{item.description}</span>
                            </span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

/** Mobile accordion version of the same submenu. */
function MobileSubmenu({ items }: { items: SubMenuItem[] }) {
    const location = useLocation();
    return (
        <div className="grid gap-1.5 pb-3 pl-2 pr-1 pt-1">
            {items.map((item) => {
                const active = location.pathname === item.href;
                return (
                    <a
                        key={item.id}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${active
                            ? "bg-white/[0.06] text-[#45CFFF]"
                            : "hover:bg-white/[0.06]"
                            }`}
                    >
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#45CFFF]/20 to-[#1E56E0]/20 text-[#45CFFF]">
                            <item.icon size={16} />
                        </span>
                        <span>
                            <span className={`block font-sora text-[0.85rem] font-semibold ${active ? "text-[#45CFFF]" : "text-white"}`}>{item.title}</span>
                            <span className="block text-[0.72rem] text-[#7C8AAD]">{item.description}</span>
                        </span>
                    </a>
                );
            })}
        </div>
    );
}

export default function Navbar() {
    const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const closeTimer = useRef<number | null>(null);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    // Helper to check if a nav item (or its submenu) is active
    const isActive = (href: string, submenu?: SubMenuItem[]) => {
        if (location.pathname === href) return true;
        if (submenu) {
            return submenu.some((item) => location.pathname === item.href);
        }
        return false;
    };

    // Hover-intent open/close for desktop submenus. A short delay on close
    // stops the dropdown from disappearing while the cursor crosses the small
    // gap between the menu button and the card below it.
    const openOnHover = (id: string) => {
        if (closeTimer.current !== null) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
        setOpenDesktopMenu(id);
    };

    const closeOnHover = () => {
        closeTimer.current = window.setTimeout(() => {
            setOpenDesktopMenu(null);
        }, 150);
    };

    // close desktop dropdown & user menu on outside click / Escape
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setOpenDesktopMenu(null);
                setUserMenuOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpenDesktopMenu(null);
                setMobileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    // lock body scroll when the mobile panel is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    // clear any pending close timer on unmount
    useEffect(() => {
        return () => {
            if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 border-b border-black/8 bg-white/90 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#060B14]/90">
            {/* Highlight panel behind the logo: the logo and navbar share the same
          dark background, so without this the logo would nearly disappear.
          The panel covers roughly a third of the header width and its right
          edge is cut on a diagonal ("cross") instead of a plain rectangle. */}

            <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-10
            md:w-[20%] lg:w-[24%] xl:w-[33%] h-full
             bg-gradient-to-br from-white to-[#cfdbee]
             [clip-path:polygon(0_0,100%_0,78%_100%,0_100%)]"
            />

            <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-0
            md:w-[20%] lg:w-[22%] xl:w-[35%] h-full
             bg-gradient-to-br from-[#172344] to-[#3277dd]
             [clip-path:polygon(0_0,100%_0,74%_100%,0_100%)]"
            />
            <nav ref={navRef} className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between  py-3">
                {/* Logo */}
                <a href="/" className="relative flex-shrink-0">
                    <img src={logo} alt="Entra Global Tech logo" className="h-9 w-auto md:h-14" />
                </a>

                {/* Desktop menu */}
                <ul className="hidden items-center gap-1 md:flex text-2xl">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.href, item.submenu);
                        return (
                            <li
                                key={item.id}
                                className="relative"
                                onMouseEnter={item.submenu ? () => openOnHover(item.id) : undefined}
                                onMouseLeave={item.submenu ? closeOnHover : undefined}
                            >
                                {item.submenu ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setOpenDesktopMenu(openDesktopMenu === item.id ? null : item.id)}
                                            aria-expanded={openDesktopMenu === item.id}
                                            className={`flex items-center gap-1 rounded-lg px-3.5 py-2 font-inter uppercase text-[17px] font-medium transition-colors relative ${active
                                                ? "text-[#1E56E0] dark:text-[#45CFFF] before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-1/2 before:h-0.5 before:bg-[#1E56E0] dark:before:bg-[#45CFFF]"
                                                : "text-gray-600 hover:bg-black/5 hover:text-gray-900 dark:text-[#B9C7E0] dark:hover:bg-white/[0.06] dark:hover:text-white"
                                                }`}
                                        >
                                            {item.label}
                                            <ChevronDown
                                                size={15}
                                                className={`transition-transform duration-200 ${openDesktopMenu === item.id ? "rotate-180" : ""}`}
                                            />
                                        </button>
                                        {openDesktopMenu === item.id && <DesktopSubmenuCard items={item.submenu} />}
                                    </>
                                ) : (
                                    <a
                                        href={item.href}
                                        className={`block uppercase rounded-lg px-3.5 py-2 font-inter text-[17px] font-medium transition-colors relative ${active
                                            ? "text-[#1E56E0] dark:text-[#45CFFF] before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-1/2 before:h-0.5 before:bg-[#1E56E0] dark:before:bg-[#45CFFF]"
                                            : "text-gray-600 hover:bg-black/5 hover:text-gray-900 dark:text-[#B9C7E0] dark:hover:bg-white/[0.06] dark:hover:text-white"
                                            }`}
                                    >
                                        {item.label}
                                    </a>
                                )}
                            </li>
                        );
                    })}
                </ul>

                {/* Right icons + mobile toggle */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Theme toggle */}
                    <button
                        type="button"
                        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                        onClick={toggleTheme}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-all duration-300 hover:bg-black/5 hover:text-[#1E56E0] dark:text-[#B9C7E0] dark:hover:bg-white/[0.06] dark:hover:text-[#45CFFF]"
                    >
                        {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
                    </button>
                    <Link
                        to="/cart"
                        aria-label="View cart"
                        className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-black/5 hover:text-gray-900 dark:text-[#B9C7E0] dark:hover:bg-white/[0.06] dark:hover:text-white"
                    >
                        <ShoppingCart size={19} />
                        {totalItems > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] px-1 font-mono text-[9px] font-bold text-[#060B14]">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </Link>
                    {/* User Menu */}
                    <div ref={userMenuRef} className="relative">
                        <button
                            type="button"
                            aria-label="Account"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${user
                                ? "bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] text-white"
                                : "text-gray-600 hover:bg-black/5 hover:text-gray-900 dark:text-[#B9C7E0] dark:hover:bg-white/[0.06] dark:hover:text-white"
                                }`}
                        >
                            {user ? (
                                <span className="text-sm font-bold font-sora">{user.name.charAt(0).toUpperCase()}</span>
                            ) : (
                                <User size={19} />
                            )}
                        </button>

                        {/* Dropdown */}
                        {userMenuOpen && (
                            <div className="absolute right-0 top-full z-[70] mt-3 w-56 rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#0F1E3D] shadow-xl overflow-hidden">
                                {user ? (
                                    <>
                                        {/* Logged in state */}
                                        <div className="px-4 py-3 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                            <p className="text-sm font-semibold text-[#1a1f36] dark:text-white truncate">{user.name}</p>
                                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0] truncate">{user.email}</p>
                                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#45CFFF]/10 text-[#45CFFF] uppercase">
                                                {user.role}
                                            </span>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                to={user.role === "admin" ? "/dashboard" : "/user"}
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1a1f36] dark:text-white hover:bg-[#F9FAFC] dark:hover:bg-white/[0.04] transition-colors"
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/dashboard/orders"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1a1f36] dark:text-white hover:bg-[#F9FAFC] dark:hover:bg-white/[0.04] transition-colors"
                                            >
                                                My Orders
                                            </Link>
                                            <Link
                                                to="/cart"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1a1f36] dark:text-white hover:bg-[#F9FAFC] dark:hover:bg-white/[0.04] transition-colors"
                                            >
                                                Cart
                                            </Link>
                                        </div>
                                        <div className="border-t border-[#E2E8F0] dark:border-[#2D3748] py-1">
                                            <button
                                                onClick={() => { logout(); setUserMenuOpen(false); }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/5 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Logged out state */}
                                        <div className="py-1">
                                            <Link
                                                to="/login"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#1a1f36] dark:text-white hover:bg-[#F9FAFC] dark:hover:bg-white/[0.04] transition-colors"
                                            >
                                                <User size={15} className="text-[#45CFFF]" />
                                                Sign In
                                            </Link>
                                            <Link
                                                to="/register"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#1a1f36] dark:text-white hover:bg-[#F9FAFC] dark:hover:bg-white/[0.04] transition-colors"
                                            >
                                                Create Account
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>



                    <button
                        type="button"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen((v) => !v)}
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-gray-900 transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/[0.06] md:hidden"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile panel */}
            <div
                className={`overflow-y-auto border-t border-black/8 bg-white dark:border-white/[0.08] dark:bg-[#060B14] transition-[max-height] duration-300 ease-in-out md:hidden ${mobileOpen ? "max-h-[calc(100vh-64px)]" : "max-h-0"
                    }`}
            >
                <ul className="flex flex-col gap-1 px-4 py-3">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.href, item.submenu);
                        return (
                            <li key={item.id} className="border-b border-white/[0.06] last:border-none">
                                {item.submenu ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenMobileAccordion(openMobileAccordion === item.id ? null : item.id)
                                            }
                                            aria-expanded={openMobileAccordion === item.id}
                                            className={`flex w-full items-center justify-between py-3.5 font-inter text-[0.95rem] font-medium transition-colors relative ${active ? "text-[#45CFFF] before:content-[''] before:absolute before:bottom-0 before:left-4 before:right-4 before:h-0.5 before:bg-[#45CFFF]" : "text-gray-900 dark:text-white"
                                                }`}
                                        >
                                            {item.label}
                                            <ChevronDown
                                                size={17}
                                                className={`text-[#7C8AAD] transition-transform duration-200 ${openMobileAccordion === item.id ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>
                                        {openMobileAccordion === item.id && <MobileSubmenu items={item.submenu} />}
                                    </>
                                ) : (
                                    <a
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`block py-3.5 font-inter text-[0.95rem] font-medium transition-colors relative ${active ? "text-[#45CFFF] before:content-[''] before:absolute before:bottom-0 before:left-4 before:right-4 before:h-0.5 before:bg-[#45CFFF]" : "text-gray-900 dark:text-white"
                                            }`}
                                    >
                                        {item.label}
                                    </a>
                                )}
                            </li>
                        );
                    })
                    }
                </ul>                {/* Mobile auth section */}
                <div className="border-t border-white/[0.08] px-4 py-3">
                    {user ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] text-white">
                                    <span className="text-sm font-bold font-sora">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-[#7C8AAD]">{user.email}</p>
                                </div>
                            </div>
                            <Link to={user.role === "admin" ? "/dashboard" : "/user"} onClick={() => setMobileOpen(false)} className="block py-2.5 font-inter text-[0.95rem] font-medium text-gray-900 dark:text-white">Dashboard</Link>
                            <Link to="/cart" onClick={() => setMobileOpen(false)} className="block py-2.5 font-inter text-[0.95rem] font-medium text-gray-900 dark:text-white">Cart</Link>
                            <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left py-2.5 font-inter text-[0.95rem] font-medium text-red-500">Sign Out</button>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2.5 font-inter text-[0.95rem] font-medium text-gray-900 dark:text-white">Sign In</Link>
                            <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2.5 font-inter text-[0.95rem] font-medium text-gray-900 dark:text-white">Create Account</Link>
                        </div>
                    )}
                </div>            </div>
        </header>
    );
}