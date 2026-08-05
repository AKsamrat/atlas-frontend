/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Send,
    Globe,
    Code,
    Palette,
    Megaphone,
} from "lucide-react";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import logo from "../../assets/footerlogo.png";
import { useContent } from "../../context/ContentContext";
import { subscribersApi } from "../../services";
import Swal from "sweetalert2";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Premium Footer                                */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)         */
/* ------------------------------------------------------------------ */

const SERVICES = [
    { label: "Domain & Hosting", href: "/domain-hosting", icon: Globe },
    { label: "Web Development", href: "/web-development", icon: Code },
    { label: "Graphic Design", href: "/#design", icon: Palette },
    { label: "Digital Marketing", href: "/#marketing", icon: Megaphone },
];

const COMPANY = [
    { label: "About Us", href: "/about-us" },
    { label: "Our Brand", href: "/OurBrand" },
    { label: "Business Value", href: "/BusinessValue" },
    { label: "Blog", href: "/blog" },

];

const SUPPORT = [
    { label: "Help Center", href: "/help-center" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
];



export default function Footer() {
    const { content } = useContent();
    const c = content.contact;
    const [subscribeEmail, setSubscribeEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subscribeEmail.trim()) return;
        setSubscribing(true);
        try {
            const res = await subscribersApi.subscribe(subscribeEmail.trim());
            Swal.fire({
                icon: "success",
                title: "Subscribed!",
                text: res.data.message,
                timer: 2500,
                showConfirmButton: false,
                background: "#0d1829",
                color: "#fff",
            });
            setSubscribeEmail("");
        } catch (err: any) {
            const msg = err.response?.data?.message || "Something went wrong. Please try again.";
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: msg,
                timer: 3000,
                showConfirmButton: false,
                background: "#0d1829",
                color: "#fff",
            });
        } finally {
            setSubscribing(false);
        }
    };

    const CONTACT_INFO = [
        { label: c.phone, href: `tel:${c.phone}`, icon: Phone },
        { label: c.email, href: `mailto:${c.email}`, icon: Mail },
        { label: c.address, href: null, icon: MapPin },
    ];
    const SOCIALS = [
        { label: "Facebook", href: c.socialFacebook || "#", icon: FaFacebook },
        { label: "Instagram", href: c.socialInstagram || "#", icon: FaInstagram },
        { label: "Twitter", href: c.socialTwitter || "#", icon: FaTwitter },
        { label: "LinkedIn", href: c.socialLinkedin || "#", icon: FaLinkedin },
    ];

    return (
        <footer className="relative overflow-hidden bg-[#f1f3f8] dark:bg-[#040911]">
            {/* ============================================================ */}
            {/*  Layered ambient glows                                       */}
            {/* ============================================================ */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: [
                        "radial-gradient(1000px 500px at 20% 0%, rgba(46,139,240,0.08), transparent 55%)",
                        "radial-gradient(700px 350px at 80% 10%, rgba(69,207,255,0.06), transparent 50%)",
                        "radial-gradient(500px 300px at 50% 100%, rgba(30,86,224,0.05), transparent 55%)",
                    ].join(", "),
                }}
            />

            {/* subtle dot grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #45CFFF 0.8px, transparent 0.8px)",
                    backgroundSize: "28px 28px",
                }}
            />

            <div className="relative z-10">
                {/* ========================================================== */}
                {/*  CTA BANNER                                                */}
                {/* ========================================================== */}
                <div className="border-b border-black/6 dark:border-white/[0.05]">
                    <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 py-12 text-center md:flex-row md:justify-between md:text-left">
                        <div>
                            <h3 className="font-sora text-[1.45rem] font-bold leading-snug text-[#1a1f36] sm:text-[1.7rem] dark:text-white">
                                Ready to grow your brand{" "}
                                <span className="bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] bg-clip-text text-transparent">
                                    with Entra?
                                </span>
                            </h3>
                            <p className="mt-2 max-w-lg text-[0.88rem] leading-relaxed text-[#8b95ad] dark:text-[#7C8AAD]">
                                From hosting to marketing — we build the digital infrastructure your
                                business needs to scale.
                            </p>
                        </div>
                        <a
                            href="/contact"
                            className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-7 py-3.5 font-sora text-[0.88rem] font-semibold text-[#060B14] shadow-[0_8px_30px_rgba(46,139,240,0.25)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(46,139,240,0.35)]"
                        >
                            <Send
                                size={15}
                                className="transition-transform duration-300 group-hover:translate-x-0.5"
                            />
                            Get a Free Quote
                            <ArrowRight
                                size={15}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>
                    </div>
                </div>

                {/* ========================================================== */}
                {/*  MAIN CONTENT                                              */}
                {/* ========================================================== */}
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-10 py-14 lg:grid-cols-12 lg:gap-10">
                        {/* ================================================== */}
                        {/*  Brand column — logo, description, newsletter, social */}
                        {/* ================================================== */}
                        <div className="lg:col-span-4 lg:pr-4">
                            <a href="/" className="inline-flex items-center gap-3">
                                <div className="flex items-center gap-2.5 rounded-xl bg-white px-2 py-1 dark:bg-white">
                                    <img
                                        src={logo}
                                        alt="Entra Global Tech"
                                        className="h-28 w-auto transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            </a>

                            <p className="mt-5 max-w-[36ch] text-[0.88rem] leading-[1.7] text-[#8b95ad] dark:text-[#7C8AAD]">
                                One team for hosting, web development, graphic design and digital
                                marketing — all connected under one hub.
                            </p>

                            {/* newsletter card */}
                            <div className="mt-7 rounded-2xl border border-black/6 bg-white p-5 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                                {/* <p className="mb-1 font-sora text-[0.82rem] font-semibold text-[#1a1f36] dark:text-white">
                                    Subscribe to our newsletter
                                </p>
                                <p className="mb-4 text-[0.76rem] text-[#8b95ad] dark:text-[#596887]">
                                    Tips, updates & offers — straight to your inbox.
                                </p> */}
                                <form
                                    onSubmit={handleSubscribe}
                                    className="flex overflow-hidden rounded-xl border border-black/8 bg-[#f1f3f8] transition-all duration-300 focus-within:border-[#45CFFF]/40 focus-within:shadow-[0_0_20px_rgba(46,139,240,0.08)] dark:border-white/[0.08] dark:bg-[#060B14]/80"
                                >
                                    <input
                                        type="email"
                                        value={subscribeEmail}
                                        onChange={(e) => setSubscribeEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        required
                                        className="w-full bg-transparent px-4 py-2.5 text-[0.82rem] text-[#1a1f36] placeholder:text-[#8b95ad] outline-none dark:text-white dark:placeholder:text-[#3d4f6e]"
                                    />
                                    <button
                                        type="submit"
                                        disabled={subscribing}
                                        className="flex shrink-0 items-center gap-1.5 bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-4 font-sora text-[0.78rem] font-semibold text-[#060B14] transition-all hover:opacity-90 disabled:opacity-60"
                                    >
                                        {subscribing ? (
                                            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[#060B14] border-t-transparent" />
                                        ) : (
                                            <Send size={12} />
                                        )}
                                        {subscribing ? "..." : "Subscribe"}
                                    </button>
                                </form>
                            </div>


                        </div>

                        {/* ================================================== */}
                        {/*  Link columns                                        */}
                        {/* ================================================== */}
                        <div className="lg:col-span-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
                            {/* Services — with icon badges */}
                            <div>
                                <h4 className="mb-5 font-sora text-[1.1rem] font-bold uppercase tracking-[0.16em] text-[#1a1f36] dark:text-white">
                                    Services
                                </h4>
                                <ul className="space-y-3">
                                    {SERVICES.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                className="group/link flex items-center gap-2 text-[1rem] text-[#8b95ad] transition-colors duration-200 hover:text-[#45CFFF] dark:text-[#7C8AAD]"
                                            >
                                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#45CFFF]/[0.07] text-[#45CFFF]/60 transition-all duration-200 group-hover/link:bg-[#45CFFF]/15 group-hover/link:text-[#45CFFF]">
                                                    <link.icon size={12} />
                                                </span>
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h4 className="mb-5 font-sora text-[1.1rem] font-bold uppercase tracking-[0.16em] text-[#1a1f36] dark:text-white">
                                    Company
                                </h4>
                                <ul className="space-y-3">
                                    {COMPANY.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                className="relative inline-block text-[1rem] text-[#8b95ad] transition-colors duration-200 hover:text-[#45CFFF] after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-[#45CFFF]/50 after:transition-all after:duration-300 hover:after:w-full dark:text-[#7C8AAD]"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h4 className="mb-5 font-sora text-[1.1rem] font-bold uppercase tracking-[0.16em] text-[#1a1f36] dark:text-white">
                                    Support
                                </h4>
                                <ul className="space-y-3">
                                    {SUPPORT.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                className="relative inline-block text-[1rem] text-[#8b95ad] transition-colors duration-200 hover:text-[#45CFFF] after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-[#45CFFF]/50 after:transition-all after:duration-300 hover:after:w-full dark:text-[#7C8AAD]"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h4 className="mb-5 font-sora text-[1.1rem] font-bold uppercase tracking-[0.16em] text-[#1a1f36] dark:text-white">
                                    Get in Touch
                                </h4>
                                <ul className="space-y-3.5">
                                    {CONTACT_INFO.map(({ label, href, icon: Icon }) => {
                                        const inner = (
                                            <span className="flex items-start gap-2.5 text-[1rem] text-[#8b95ad] transition-colors duration-200 hover:text-[#1a1f36] dark:text-[#7C8AAD] dark:hover:text-white">
                                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#45CFFF]/[0.07] text-[#45CFFF]/70">
                                                    <Icon size={13} />
                                                </span>
                                                <span>{label}</span>
                                            </span>
                                        );
                                        return (
                                            <li key={label}>
                                                {href ? (
                                                    <a href={href}>{inner}</a>
                                                ) : (
                                                    inner
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                                {/* social icons */}
                                <div className="mt-6 flex items-center gap-2.5">
                                    {SOCIALS.map(({ label, href, icon: Icon }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            aria-label={label}
                                            className="group/social flex h-10 w-10 items-center justify-center rounded-xl border border-black/8 bg-white text-[#8b95ad] transition-all duration-300 hover:border-[#45CFFF]/30 hover:bg-[#45CFFF]/10 hover:text-[#45CFFF] hover:shadow-[0_4px_16px_rgba(46,139,240,0.12)] dark:border-white/[0.07] dark:bg-white/[0.02] dark:text-[#596887]"
                                        >
                                            <Icon
                                                size={16}
                                                className="transition-transform duration-300 group-hover/social:scale-110"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================== */}
                {/*  BOTTOM BAR                                                */}
                {/* ========================================================== */}
                <div className="border-t border-black/6 dark:border-white/[0.05]">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 py-6 sm:flex-row">
                        <p className="text-[0.76rem] text-[#8b95ad] dark:text-[#3d4f6e]">
                            © {new Date().getFullYear()} Entra Global Tech. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-[0.76rem] text-[#8b95ad] dark:text-[#3d4f6e]">
                            <a href="/privacy-policy" className="transition-colors duration-200 hover:text-[#45CFFF]">
                                Privacy Policy
                            </a>
                            <span className="h-3 w-px bg-black/6 dark:bg-white/[0.06]" />
                            <a href="/terms-of-service" className="transition-colors duration-200 hover:text-[#45CFFF]">
                                Terms of Service
                            </a>
                            <span className="h-3 w-px bg-black/6 dark:bg-white/[0.06]" />
                            <a href="/help-center" className="transition-colors duration-200 hover:text-[#45CFFF]">
                                Help Center
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
