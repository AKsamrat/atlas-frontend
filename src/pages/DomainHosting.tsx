import { useState, useRef, useEffect } from "react";
import {
    Globe2,
    Shield,
    Clock,
    Mail,
    Server,
    HardDrive,
    CheckCircle2,
    ArrowRight,
    Zap,
    Lock,
    Headphones,
    RefreshCw,
    Building2,
    Award,
    TrendingUp,
    Users,
    ShoppingCart,
} from "lucide-react";
import DomainChecker from "../components/home/DomainChecker";
import { useContent } from "../context/ContentContext";
import { useCart } from "../store/useCart";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Domain & Hosting Landing Page                 */
/*  React + TypeScript + Tailwind  (same navy / cyan / blue tokens)   */
/* ------------------------------------------------------------------ */

const FEATURES = [
    {
        icon: Globe2,
        title: "Free Domain Registration",
        desc: "Get a free .com or .net domain for the first year with any hosting plan.",
    },
    {
        icon: Shield,
        title: "Free SSL Certificate",
        desc: "Every site is protected with industry-standard encryption at no extra cost.",
    },
    {
        icon: Clock,
        title: "99.9% Uptime Guarantee",
        desc: "Enterprise-grade infrastructure keeps your site online around the clock.",
    },
    {
        icon: Zap,
        title: "Lightning-Fast SSD",
        desc: "NVMe-powered SSD storage delivers sub-second page loads for your visitors.",
    },
    {
        icon: RefreshCw,
        title: "Automatic Backups",
        desc: "Daily or weekly snapshots so you can restore anything with one click.",
    },
    {
        icon: Headphones,
        title: "24/7 Expert Support",
        desc: "Our team is always available via chat, email or phone to keep you running.",
    },
];

const STEPS = [
    { num: "01", title: "Pick a Domain", desc: "Choose the perfect name for your online presence and register it instantly." },
    { num: "02", title: "Choose a Plan", desc: "Select the hosting tier that matches your traffic and storage needs." },
    { num: "03", title: "Go Live", desc: "We set everything up — SSL, email, backups — and hand you the keys." },
];

/* ---- tiny helpers ---- */
function CheckIcon() {
    return <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-[#45CFFF]" />;
}

/* ---- Customer logos for marquee ---- */
const CUSTOMER_LOGOS = [
    { name: "GreenLeaf Cosmetics", icon: Building2, color: "#22C55E" },
    { name: "StyleBD Fashion", icon: Award, color: "#EC4899" },
    { name: "TechNova Solutions", icon: TrendingUp, color: "#3B82F6" },
    { name: "Dhaka Deli", icon: Users, color: "#F59E0B" },
    { name: "LogiChain Ltd", icon: Server, color: "#8B5CF6" },
    { name: "EduPath", icon: Globe2, color: "#06B6D4" },
    { name: "MediCare Plus", icon: Shield, color: "#EF4444" },
    { name: "AutoParts BD", icon: HardDrive, color: "#6366F1" },
    { name: "FreshMart", icon: Building2, color: "#14B8A6" },
    { name: "CodeCraft Studio", icon: Award, color: "#F97316" },
];

/* ---- Marquee Component ---- */
export function Marquee({ logos }: { logos: typeof CUSTOMER_LOGOS }) {
    const [isPaused, setIsPaused] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let animationId: number;
        // let lastTime = 0;
        const duration = 30000; // 30 seconds for full loop
        const trackWidth = track.scrollWidth / 2; // Half because we duplicate

        const animate = (time: number) => {
            if (!isPaused) {
                const progress = (time % duration) / duration;
                const translateX = -progress * trackWidth;
                track.style.transform = `translateX(${translateX}px)`;
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [isPaused]);

    return (
        <div
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div
                ref={trackRef}
                className="flex gap-8 sm:gap-12 md:gap-16 lg:gap-20 will-change-transform"
                style={{ transform: "translateX(0)" }}
            >
                {/* Duplicate logos for seamless loop */}
                {logos.map((logo, i) => (
                    <LogoItem key={i} logo={logo} />
                ))}
                {logos.map((logo, i) => (
                    <LogoItem key={i + logos.length} logo={logo} />
                ))}
            </div>
        </div>
    );
}

function LogoItem({ logo }: { logo: typeof CUSTOMER_LOGOS[0] }) {
    const Icon = logo.icon;
    return (
        <div className="flex-shrink-0 flex items-center gap-3 rounded-xl bg-white/80 dark:bg-[#0F1E3D]/80 px-6 py-3 border border-black/5 dark:border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgba(69,207,255,0.15)] dark:hover:shadow-[0_8px_30px_rgba(69,207,255,0.2)] hover:-translate-y-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${logo.color}15` }}>
                <Icon size={20} style={{ color: logo.color }} />
            </span>
            <span className="font-sora text-[0.85rem] font-semibold text-[#1a1f36] dark:text-white whitespace-nowrap">{logo.name}</span>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function DomainHosting() {
    const { content } = useContent();
    const { addItem } = useCart();
    const PLANS = content.domainPlans;
    return (
        <div className="bg-white font-inter text-[#1a1f36] dark:bg-[#060B14] dark:text-white">
            {/* ============================================================ */}
            {/*  DOMAIN CHECKER                                              */}
            {/* ============================================================ */}
            <DomainChecker />
            {/* ============================================================ */}
            {/*  HERO                                                        */}
            {/* ============================================================ */}
            <section className="relative overflow-hidden px-5 py-24 sm:px-8 md:px-16">
                {/* ambient glows */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(1100px 550px at 80% 10%, rgba(69,207,255,0.18), transparent 60%), radial-gradient(700px 400px at 20% 90%, rgba(30,86,224,0.14), transparent 55%)",
                    }}
                />

                <div className="relative mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#45CFFF]/20 bg-[#45CFFF]/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#45CFFF]">
                            <Globe2 size={14} /> Domain &amp; Hosting
                        </span>

                        <h1 className="mt-6 font-sora text-[2.4rem] font-bold leading-[1.08] tracking-tight sm:text-[3.2rem] lg:text-[3.8rem]">
                            Your domain, your server,{" "}
                            <span className="bg-gradient-to-r from-[#45CFFF] via-[#2E8BF0] to-[#1E56E0] bg-clip-text text-transparent">
                                one home.
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                            We register your domain, set up fast SSD hosting, install a free SSL and keep your email
                            running — so you never have to touch a control panel you don't understand.
                        </p>

                        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                            <a
                                href="#plans"
                                className="inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] px-7 py-3.5 text-[0.95rem] font-semibold shadow-[0_10px_30px_rgba(30,86,224,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(30,86,224,0.5)]"
                            >
                                View Plans <ArrowRight size={16} />
                            </a>
                            <a
                                href="#features"
                                className="inline-flex items-center gap-2 rounded-[10px] border border-black/10 bg-black/[0.03] px-7 py-3.5 text-[0.95rem] font-semibold transition-all duration-300 hover:bg-black/[0.06] dark:border-white/12 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                            >
                                See Features
                            </a>
                        </div>

                        {/* quick stats */}
                        <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-black/8 pt-8 dark:border-white/[0.09]">
                            <div>
                                <b className="block font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">99.9%</b>
                                <span className="font-mono text-[0.72rem] text-[#8b95ad] dark:text-[#7C8AAD]">UPTIME</span>
                            </div>
                            <div>
                                <b className="block font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">NVMe</b>
                                <span className="font-mono text-[0.72rem] text-[#8b95ad] dark:text-[#7C8AAD]">SSD SPEED</span>
                            </div>
                            <div>
                                <b className="block font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">24/7</b>
                                <span className="font-mono text-[0.72rem] text-[#8b95ad] dark:text-[#7C8AAD]">SUPPORT</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ============================================================ */}
            {/*  HOW IT WORKS — 3 steps                                      */}
            {/* ============================================================ */}
            <section className="relative px-5 py-20 sm:px-8 md:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                            <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                            How It Works
                        </span>
                        <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                            Online in three simple steps.
                        </h2>
                    </div>

                    <div className="relative mt-14 grid gap-8 md:grid-cols-3">
                        {/* connecting line behind the steps */}
                        <div className="pointer-events-none absolute left-1/6 right-1/6 top-8 hidden h-px bg-gradient-to-r from-transparent via-[#45CFFF]/30 to-transparent md:block" />

                        {STEPS.map((step) => (
                            <div key={step.num} className="relative text-center">
                                <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] font-mono text-sm font-bold text-[#060B14] shadow-[0_8px_24px_rgba(46,139,240,0.4)]">
                                    {step.num}
                                </span>
                                <h3 className="font-sora text-[1.15rem] font-bold text-[#1a1f36] dark:text-white">{step.title}</h3>
                                <p className="mx-auto mt-2 max-w-[32ch] text-[0.9rem] leading-relaxed text-[#8b95ad] dark:text-[#7C8AAD]">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  FEATURES — 6 cards                                          */}
            {/* ============================================================ */}
            <section id="features" className="relative px-5 py-20 sm:px-8 md:px-16">
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "radial-gradient(900px 500px at 88% 20%, rgba(69,207,255,0.10), transparent 55%)" }}
                />

                <div className="relative mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                            <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                            Why Choose Us
                        </span>
                        <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                            Built for performance, designed for peace of mind.
                        </h2>
                    </div>

                    <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((f) => {
                            const Icon = f.icon;
                            return (
                                <div
                                    key={f.title}
                                    className="group rounded-2xl border border-black/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#45CFFF]/30 hover:shadow-[0_16px_40px_rgba(46,139,240,0.15)] dark:border-white/[0.08] dark:bg-gradient-to-b dark:from-[#0F1E3D] dark:to-[#0B1730]"
                                >
                                    <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#45CFFF]/20 to-[#1E56E0]/20 text-[#45CFFF] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3">
                                        <Icon size={22} />
                                    </span>
                                    <h4 className="font-sora text-[1.05rem] font-bold text-[#1a1f36] dark:text-white">{f.title}</h4>
                                    <p className="mt-2 text-[0.88rem] leading-relaxed text-[#8b95ad] dark:text-[#7C8AAD]">{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  PLANS / PRICING                                             */}
            {/* ============================================================ */}
            <section id="plans" className="relative px-5 py-20 sm:px-8 md:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                            <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                            Pricing
                        </span>
                        <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                            Simple plans, no hidden fees.
                        </h2>
                        <p className="mt-4 text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                            Every plan includes a free SSL, daily backups and our 24/7 expert support.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-6 md:grid-cols-3">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative flex flex-col overflow-hidden rounded-[24px] border p-8 transition-all duration-300 ${plan.highlight
                                    ? "border-[#45CFFF]/40 bg-gradient-to-b from-[#0F1E3D] to-[#0B1730] shadow-[0_20px_50px_rgba(46,139,240,0.25)] dark:from-[#0F1E3D] dark:to-[#0B1730]"
                                    : "border-black/8 bg-white hover:border-[#45CFFF]/25 dark:border-white/[0.08] dark:bg-gradient-to-b dark:from-[#0F1E3D]/95 dark:to-[#0B1730]/90"
                                    }`}
                            >
                                {plan.highlight && (
                                    <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#45CFFF] via-[#2E8BF0] to-[#1E56E0]" />
                                )}

                                {plan.highlight && (
                                    <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#45CFFF]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#45CFFF]">
                                        <Zap size={12} /> Most Popular
                                    </span>
                                )}

                                <h3 className="font-sora text-[1.2rem] font-bold text-[#1a1f36] dark:text-white">{plan.name}</h3>
                                <p className="mt-1 text-[0.82rem] text-[#8b95ad] dark:text-[#7C8AAD]">{plan.tagline}</p>

                                <div className="mt-5 flex items-baseline gap-1">
                                    <span className="font-mono text-[0.85rem] text-[#596887] dark:text-[#B9C7E0]">৳</span>
                                    <span className="font-sora text-[2.4rem] font-bold leading-none text-[#1a1f36] dark:text-white">{plan.price}</span>
                                    <span className="text-[0.85rem] text-[#8b95ad] dark:text-[#7C8AAD]">{plan.period}</span>
                                </div>

                                <ul className="mt-7 flex flex-1 flex-col gap-3">
                                    {plan.features.map((feat) => (
                                        <li key={feat} className="flex items-start gap-2.5 text-[0.88rem] text-[#1a1f36] dark:text-[#DCE6F5]">
                                            <CheckIcon />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => addItem({
                                        id: `domain-${plan.name}`,
                                        serviceKey: "domain-hosting",
                                        name: plan.name,
                                        price: plan.price,
                                        period: plan.period,
                                        tagline: plan.tagline,
                                        features: plan.features,
                                        highlight: plan.highlight,
                                    })}
                                    className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[0.9rem] font-semibold transition-all duration-300 ${plan.highlight
                                        ? "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-[#060B14] shadow-[0_8px_24px_rgba(46,139,240,0.35)] hover:shadow-[0_12px_32px_rgba(46,139,240,0.5)]"
                                        : "bg-black/[0.04] text-[#1a1f36] hover:bg-black/[0.08] dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.10]"
                                        }`}
                                >
                                    Add to Cart <ShoppingCart size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  WHAT'S INCLUDED — feature list                              */}
            {/* ============================================================ */}
            <section className="relative px-5 py-20 sm:px-8 md:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-12 md:grid-cols-2 md:items-center">
                        {/* left copy */}
                        <div>
                            <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                                <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                                What's Included
                            </span>
                            <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                                Everything you need, nothing you don't.
                            </h2>
                            <p className="mt-4 text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                                From domain registration to email hosting, we handle the technical side so you can
                                focus on what matters — your business.
                            </p>
                            <a
                                href="#contact"
                                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] px-6 py-3 text-[0.9rem] font-semibold shadow-[0_8px_24px_rgba(30,86,224,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(30,86,224,0.5)]"
                            >
                                Talk to Sales <ArrowRight size={15} />
                            </a>
                        </div>

                        {/* right cards */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                { icon: HardDrive, title: "NVMe SSD Storage", desc: "Blazing-fast disks for sub-second loads." },
                                { icon: Lock, title: "Free SSL Certificate", desc: "Encrypted connections on every domain." },
                                { icon: Mail, title: "Business Email", desc: "Professional email with your own domain." },
                                { icon: Server, title: "99.9% Uptime", desc: "Monitored servers with automatic failover." },
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.title}
                                        className="group rounded-2xl border border-black/8 bg-[#f1f3f8] p-5 transition-all duration-300 hover:border-[#45CFFF]/25 hover:bg-[#e8ecf4] dark:border-white/[0.07] dark:bg-[#0F1E3D]/50 dark:hover:bg-[#0F1E3D]/80"
                                    >
                                        <Icon
                                            size={22}
                                            className="mb-3 text-[#45CFFF] transition-transform duration-300 group-hover:-translate-y-0.5"
                                        />
                                        <h4 className="font-sora text-[0.95rem] font-bold text-[#1a1f36] dark:text-white">{item.title}</h4>
                                        <p className="mt-1 text-[0.8rem] leading-relaxed text-[#8b95ad] dark:text-[#7C8AAD]">{item.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  TRUSTED BY — Marquee Logo Slider                            */}
            {/* ============================================================ */}
            <section className="relative px-5 py-16 sm:px-8 md:px-16 overflow-hidden">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                            <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                            Trusted By
                        </span>
                        <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                            Brands that grew with Entra.
                        </h2>
                        <p className="mt-4 text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                            From startups to enterprises — 500+ businesses trust us with their digital presence.
                        </p>
                    </div>

                    {/* Marquee Slider */}
                    <div className="mt-14 relative">
                        {/* Gradient fade masks on sides */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-48 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-[#060B14] dark:via-[#060B14]/90 dark:to-transparent" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-48 bg-gradient-to-l from-white via-white/90 to-transparent dark:from-[#060B14] dark:via-[#060B14]/90 dark:to-transparent" />

                        <div className="relative" aria-label="Customer logos">
                            <Marquee logos={CUSTOMER_LOGOS} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  CTA BANNER                                                  */}
            {/* ============================================================ */}
            <section className="relative px-5 pb-20 sm:px-8 md:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="overflow-hidden rounded-[28px] border border-black/8 bg-gradient-to-br from-white via-[#f1f3f8] to-[#e8ecf4] p-10 sm:p-14 text-center dark:border-white/[0.09] dark:from-[#0F1E3D] dark:via-[#0B1730] dark:to-[#060B14]">
                        {/* decorative glows */}
                        <div
                            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
                            style={{ background: "radial-gradient(circle, #45CFFF, transparent 70%)" }}
                        />
                        <div
                            className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
                            style={{ background: "radial-gradient(circle, #1E56E0, transparent 70%)" }}
                        />

                        <div className="relative z-10">
                            <h2 className="font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                                Ready to get online?
                            </h2>
                            <p className="mx-auto mt-4 max-w-[48ch] text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                                Register your domain today and let us handle the rest — hosting, security, email and support,
                                all under one roof.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                <a
                                    href="#contact"
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-7 py-3.5 text-[0.95rem] font-semibold text-[#060B14] shadow-[0_10px_30px_rgba(46,139,240,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(46,139,240,0.5)]"
                                >
                                    Start Now <ArrowRight size={16} />
                                </a>
                                <a
                                    href="/contact"
                                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-7 py-3.5 text-[0.95rem] font-semibold transition-all duration-300 hover:bg-black/[0.06] dark:border-white/12 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                                >
                                    Talk to Sales
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
