import { Phone, Mail } from "lucide-react";
import { BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { useContent } from "../../context/ContentContext";

/**
 * Entra Global Tech — Topbar
 * React + TypeScript + Tailwind
 *
 * Sits above Navbar.tsx (not sticky — it scrolls away, Navbar stays
 * pinned). Same design tokens as the rest of the site: navy #060B14,
 * cyan #45CFFF, blue #1E56E0, Inter body / JetBrains Mono for the
 * tagline. Icons switched from react-icons/fa to lucide-react so the
 * whole project only carries one icon library (already used in
 * Navbar.tsx and Services.tsx).
 */

const Topbar = () => {
    const { content } = useContent();
    const contact = content.contact;
    const SOCIAL_LINKS = [
        { id: "facebook", label: "Facebook", href: contact.socialFacebook || "#", icon: FaFacebook },
        { id: "instagram", label: "Instagram", href: contact.socialInstagram || "#", icon: BsInstagram },
        { id: "linkedin", label: "LinkedIn", href: contact.socialLinkedin || "#", icon: BsLinkedin },
        { id: "twitter", label: "Twitter", href: contact.socialTwitter || "#", icon: BsTwitter },
    ];

    return (
        <div className="hidden border-b border-black/8 bg-white text-gray-600 dark:border-white/[0.06] dark:bg-[#060B14] dark:text-[#B9C7E0] md:block">
            <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 font-inter text-[16px] leading-none text-gray-600 dark:text-[#B9C7E0]">
                {/* Left section */}
                <div className="flex items-center gap-6">
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-2 transition-colors hover:text-gray-900 dark:hover:text-white">
                        <Phone size={13} className="text-[#45CFFF]" />
                        <span>{contact.phone}</span>
                    </a>

                    <a href={`mailto:${contact.email}`} className="flex items-center gap-2 transition-colors hover:text-gray-900 dark:hover:text-white">
                        <Mail size={13} className="text-[#45CFFF]" />
                        <span>{contact.email}</span>
                    </a>

                    <span className="hidden items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-[#45CFFF] lg:flex">
                        <span className="h-1 w-1 rounded-full bg-[#45CFFF]" />
                        {contact.tagline}
                    </span>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-2">
                    {SOCIAL_LINKS.map(({ id, label, href, icon: Icon }) => (
                        <a
                            key={id}
                            href={href}
                            aria-label={label}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-all duration-200 hover:bg-gradient-to-br hover:from-[#45CFFF] hover:to-[#1E56E0] hover:text-white dark:text-[#B9C7E0] dark:hover:text-[#060B14]"
                        >
                            <Icon size={20} />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Topbar;