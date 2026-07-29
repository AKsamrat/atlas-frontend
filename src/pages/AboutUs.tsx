import {
    Target,
    Eye,
    Heart,
    Users,
    Rocket,
    Shield,
    ArrowRight,
    CheckCircle2,
    Award,
    Building2,
    Globe,
    Handshake,
    Sparkles,
    TrendingUp,
    Zap,    
    Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — About Us Page                                 */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)         */
/* ------------------------------------------------------------------ */

const STATS = [
    { value: "200+", label: "Brands Served", icon: Building2 },
    { value: "5+", label: "Years of Experience", icon: Award },
    { value: "50+", label: "Team Members", icon: Users },
    { value: "98%", label: "Client Retention", icon: Heart },
];

const VALUES = [
    {
        icon: Rocket,
        title: "Innovation First",
        desc: "We stay ahead of the curve, adopting the latest technologies and strategies so your business always gets a competitive edge.",
    },
    {
        icon: Heart,
        title: "Client-Centric",
        desc: "Your success is our success. Every project starts with understanding your unique goals and crafting solutions that fit.",
    },
    {
        icon: Shield,
        title: "Reliability",
        desc: "From 99.9% uptime to on-time deliveries, we build trust through consistent, dependable performance.",
    },
    {
        icon: Handshake,
        title: "Transparency",
        desc: "No hidden fees, no surprises. We believe in honest communication and clear reporting at every step.",
    },
    {
        icon: Globe,
        title: "One-Stop Hub",
        desc: "Hosting, development, design, and marketing — everything your digital business needs, managed under one roof.",
    },
    {
        icon: Users,
        title: "Empowering Growth",
        desc: "We don't just deliver projects; we build long-term partnerships that fuel your brand's evolution.",
    },
];

const MILESTONES = [
    {
        year: "2019",
        title: "Founded in Dhaka",
        desc: "Started as a small web development studio with a big vision — to be the one-stop digital agency Bangladesh needed.",
        icon: Rocket,
        stat: "4 Founders",
        statLabel: "Team of 4",
    },
    {
        year: "2020",
        title: "100+ Clients",
        desc: "Reached our first hundred clients within the first year, proving that businesses were hungry for a unified digital partner.",
        icon: TrendingUp,
        stat: "100+",
        statLabel: "Clients served",
    },
    {
        year: "2021",
        title: "Full-Service Hub",
        desc: "Expanded into hosting, graphic design, and digital marketing — becoming a true end-to-end digital agency.",
        icon: Zap,
        stat: "4 Services",
        statLabel: "All under one roof",
    },
    {
        year: "2022",
        title: "20+ Team Members",
        desc: "Grew to a 20+ member crew of designers, developers, marketers and strategists — a family building brands.",
        icon: Users,
        stat: "20+",
        statLabel: "Team members",
    },
    {
        year: "2023",
        title: "200+ Brands",
        desc: "Now powering digital presence for over 200 brands across Bangladesh — from local shops to national enterprises.",
        icon: Star,
        stat: "200+",
        statLabel: "Brands powered",
    },
    {
        year: "2025",
        title: "Regional Expansion",
        desc: "Expanding services across South Asia, bringing our proven model of integrated digital services to new markets.",
        icon: Globe,
        stat: "3 Countries",
        statLabel: "Regional presence",
    },
];

export default function AboutUs() {
    return (
        <main className="bg-white text-[#1a1f36] dark:bg-[#060B14] dark:text-white">
            {/* ============================================================ */}
            {/*  HERO                                                        */}
            {/* ============================================================ */}
            <section className="relative overflow-hidden px-5 pt-24 pb-20 sm:px-8 md:px-16 md:pt-28 md:pb-24">
                {/* ambient glows */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: [
                            "radial-gradient(900px 450px at 30% 20%, rgba(46,139,240,0.09), transparent 55%)",
                            "radial-gradient(600px 300px at 80% 60%, rgba(69,207,255,0.06), transparent 50%)",
                        ].join(", "),
                    }}
                />

                <div className="relative mx-auto max-w-7xl">
                    <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                        <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                        About Us
                    </span>

                    <h1 className="mt-6 max-w-3xl font-sora text-[2.4rem] font-bold leading-[1.15] tracking-tight sm:text-[3rem] md:text-[3.5rem]">
                        We're the digital engine{" "}
                        <span className="bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] bg-clip-text text-transparent">
                            behind growing brands.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-[1.05rem] leading-[1.75] text-[#596887] dark:text-[#B9C7E0]">
                        Entra Global Tech is a Dhaka-based digital agency that brings together
                        hosting, web development, graphic design, and digital marketing under
                        one roof — so you never have to juggle multiple vendors again.
                    </p>

                    <a
                        href="/contact"
                        className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-7 py-3.5 font-sora text-[0.9rem] font-semibold text-[#060B14] shadow-[0_8px_30px_rgba(46,139,240,0.25)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(46,139,240,0.35)]"
                    >
                        Work With Us
                        <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </a>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  STATS BAR                                                   */}
            {/* ============================================================ */}
            <section className="border-y border-black/6 bg-black/[0.01] dark:border-white/[0.05] dark:bg-white/[0.01]">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
                    {STATS.map(({ value, label, icon: Icon }) => (
                        <div
                            key={label}
                            className="flex flex-col items-center gap-2 py-10 text-center"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#45CFFF]/[0.08] text-[#45CFFF]">
                                <Icon size={20} />
                            </div>
                            <span className="font-sora text-[1.8rem] font-bold text-[#1a1f36] dark:text-white">
                                {value}
                            </span>
                            <span className="text-[0.82rem] text-[#8b95ad] dark:text-[#7C8AAD]">{label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ============================================================ */}
            {/*  OUR STORY — split layout                                    */}
            {/* ============================================================ */}
            <section className="relative overflow-hidden px-5 py-20 sm:px-8 md:px-16">
                <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
                    {/* left — text */}
                    <div>
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                            <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                            Our Story
                        </span>
                        <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight sm:text-[2.4rem]">
                            Built by founders who{" "}
                            <span className="text-[#45CFFF]">understand the struggle.</span>
                        </h2>
                        <p className="mt-5 text-[0.95rem] leading-[1.8] text-[#596887] dark:text-[#B9C7E0]">
                            We started Entra Global Tech in 2019 because we saw the same
                            problem over and over: businesses in Bangladesh juggling a web
                            developer here, a designer there, a hosting provider somewhere
                            else — and losing time, money and sleep in the process.
                        </p>
                        <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#596887] dark:text-[#B9C7E0]">
                            Our answer was simple — create one team that does it all. Today,
                            we're a 50+ member crew serving over 200 brands, from local
                            startups to established enterprises, with everything they need to
                            build, launch and grow their digital presence.
                        </p>
                    </div>

                    {/* right — feature cards */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {[
                            {
                                icon: Globe,
                                title: "All Services, One Team",
                                desc: "No more coordinating between freelancers — we handle it all.",
                            },
                            {
                                icon: Target,
                                title: "Result-Driven",
                                desc: "Every project is tied to measurable business outcomes.",
                            },
                            {
                                icon: Users,
                                title: "Dedicated Account Mgmt",
                                desc: "A single point of contact who knows your brand inside-out.",
                            },
                            {
                                icon: CheckCircle2,
                                title: "Proven Track Record",
                                desc: "200+ brands, 5+ years, 98% client retention speaks for itself.",
                            },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="rounded-2xl border border-black/6 bg-white p-6 transition-all duration-300 hover:border-[#45CFFF]/20 hover:shadow-[0_8px_30px_rgba(46,139,240,0.08)] dark:border-white/[0.06] dark:bg-gradient-to-b dark:from-[#0F1E3D] dark:to-[#0B1730]"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#45CFFF]/[0.08] text-[#45CFFF]">
                                    <Icon size={18} />
                                </div>
                                <h3 className="mt-4 font-sora text-[0.95rem] font-bold text-[#1a1f36] dark:text-white">
                                    {title}
                                </h3>
                                <p className="mt-2 text-[0.82rem] leading-relaxed text-[#8b95ad] dark:text-[#7C8AAD]">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  MISSION & VISION                                           */}
            {/* ============================================================ */}
            <section className="px-5 py-20 sm:px-8 md:px-16">
                <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
                    {/* Mission */}
                    <div className="group relative overflow-hidden rounded-3xl border border-black/6 bg-gradient-to-br from-[#f1f3f8] to-[#e8ecf4] p-8 md:p-10 dark:border-white/[0.06] dark:from-[#0F1E3D]/80 dark:to-[#0B1730]/50">
                        <div
                            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(46,139,240,0.1), transparent 70%)",
                            }}
                        />
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#45CFFF]/15 to-[#1E56E0]/15 text-[#45CFFF]">
                            <Target size={24} />
                        </div>
                        <h3 className="mt-6 font-sora text-[1.45rem] font-bold text-[#1a1f36] dark:text-white">
                            Our Mission
                        </h3>
                        <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#596887] dark:text-[#B9C7E0]">
                            To empower businesses of every size with a complete digital
                            toolkit — from domain registration and blazing-fast hosting to
                            stunning design and result-driven marketing — all delivered
                            seamlessly by one reliable, transparent team.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="group relative overflow-hidden rounded-3xl border border-black/6 bg-gradient-to-br from-[#f1f3f8] to-[#e8ecf4] p-8 md:p-10 dark:border-white/[0.06] dark:from-[#0F1E3D]/80 dark:to-[#0B1730]/50">
                        <div
                            className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(69,207,255,0.1), transparent 70%)",
                            }}
                        />
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#45CFFF]/15 to-[#1E56E0]/15 text-[#45CFFF]">
                            <Eye size={24} />
                        </div>
                        <h3 className="mt-6 font-sora text-[1.45rem] font-bold text-[#1a1f36] dark:text-white">
                            Our Vision
                        </h3>
                        <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#596887] dark:text-[#B9C7E0]">
                            To become Bangladesh's most trusted one-stop digital agency —
                            where every brand, from a neighbourhood shop to a nationwide
                            enterprise, has access to world-class digital infrastructure and
                            creative expertise under one roof.
                        </p>
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  CORE VALUES                                                */}
            {/* ============================================================ */}
            <section className="relative overflow-hidden px-5 py-20 sm:px-8 md:px-16">
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(800px 400px at 70% 40%, rgba(30,86,224,0.06), transparent 55%)",
                    }}
                />

                <div className="relative mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                            <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                            Core Values
                        </span>
                        <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight sm:text-[2.5rem]">
                            What drives every decision we make.
                        </h2>
                    </div>

                    <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {VALUES.map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="group rounded-2xl border border-black/6 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#45CFFF]/20 hover:shadow-[0_12px_36px_rgba(46,139,240,0.1)] dark:border-white/[0.06] dark:bg-gradient-to-b dark:from-[#0F1E3D] dark:to-[#0B1730]"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#45CFFF]/[0.08] text-[#45CFFF] transition-colors duration-300 group-hover:bg-[#45CFFF]/15">
                                    <Icon size={20} />
                                </div>
                                <h3 className="mt-5 font-sora text-[1rem] font-bold text-[#1a1f36] dark:text-white">
                                    {title}
                                </h3>
                                <p className="mt-2.5 text-[0.86rem] leading-relaxed text-[#8b95ad] dark:text-[#7C8AAD]">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  MILESTONES TIMELINE — Upgraded                             */}
            {/* ============================================================ */}
            <section className="relative overflow-hidden px-5 py-24 sm:px-8 md:px-16">
                {/* ambient glows */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: [
                            "radial-gradient(900px 500px at 20% 30%, rgba(46,139,240,0.07), transparent 55%)",
                            "radial-gradient(600px 350px at 80% 70%, rgba(69,207,255,0.05), transparent 50%)",
                        ].join(", "),
                    }}
                />

                <div className="relative mx-auto max-w-7xl">
                    {/* heading */}
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                            <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                            Our Journey
                        </span>
                        <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight sm:text-[2.5rem]">
                            From a small studio to a{" "}
                            <span className="bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] bg-clip-text text-transparent">
                                full-service digital agency.
                            </span>
                        </h2>
                        <p className="mt-4 text-[0.95rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                            Every milestone marks a moment we chose to grow — for ourselves
                            and for the brands we serve.
                        </p>
                    </div>

                    {/* ======================================================== */}
                    {/*  Timeline — desktop (md+)                                */}
                    {/* ======================================================== */}
                    <div className="relative mt-16 hidden md:block">
                        {/* center vertical line — gradient backbone */}
                        <div
                            className="absolute left-1/2 top-0 h-full -translate-x-1/2"
                            style={{
                                width: "2px",
                                background:
                                    "linear-gradient(to bottom, rgba(69,207,255,0.35) 0%, rgba(30,86,224,0.20) 50%, rgba(69,207,255,0.05) 100%)",
                            }}
                        />

                        {/* glow pulse at center */}
                        <div
                            className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(46,139,240,0.06), transparent 70%)",
                            }}
                        />

                        <div className="space-y-0">
                            {MILESTONES.map(({ year, title, desc, icon: Icon, stat, statLabel }, idx) => {
                                const isLeft = idx % 2 === 0;
                                const isFirst = idx === 0;
                                const isLast = idx === MILESTONES.length - 1;

                                return (
                                    <div
                                        key={year}
                                        className="group relative flex items-center"
                                        style={{ minHeight: "140px" }}
                                    >
                                        {/* ---- LEFT SIDE ---- */}
                                        <div
                                            className={`w-1/2 ${isLeft ? "pr-12 text-right" : "order-3 pl-12 text-left"
                                                }`}
                                        >
                                            <div
                                                className={`relative inline-block max-w-md rounded-2xl border border-black/6 bg-white p-6 transition-all duration-400 hover:-translate-y-0.5 hover:border-[#45CFFF]/25 hover:shadow-[0_16px_48px_rgba(46,139,240,0.1)] dark:border-white/[0.06] dark:bg-gradient-to-b dark:from-[#0F1E3D] dark:to-[#0B1730] ${isLeft ? "ml-auto" : ""
                                                    }`}
                                            >
                                                {/* top accent line */}
                                                <div
                                                    className={`absolute top-0 h-px w-12 ${isLeft ? "right-6" : "left-6"
                                                        } bg-gradient-to-r from-[#45CFFF]/40 to-[#1E56E0]/20`}
                                                />

                                                <div
                                                    className={`flex items-center gap-3 mb-3 ${isLeft ? "justify-end" : "justify-start"
                                                        }`}
                                                >
                                                    <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.2em] text-[#45CFFF]">
                                                        {year}
                                                    </span>
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#45CFFF]/[0.08] text-[#45CFFF]">
                                                        <Icon size={15} />
                                                    </span>
                                                </div>

                                                <h3 className="font-sora text-[1.1rem] font-bold leading-snug text-[#1a1f36] dark:text-white">
                                                    {title}
                                                </h3>
                                                <p className="mt-2 text-[0.84rem] leading-[1.7] text-[#8b95ad] dark:text-[#7C8AAD]">
                                                    {desc}
                                                </p>

                                                {/* stat callout */}
                                                <div
                                                    className={`mt-4 inline-flex items-center gap-2 rounded-full border border-[#45CFFF]/15 bg-[#45CFFF]/[0.04] px-3.5 py-1.5 ${isLeft ? "ml-auto" : ""
                                                        }`}
                                                >
                                                    <span className="font-sora text-[0.85rem] font-bold text-[#45CFFF]">
                                                        {stat}
                                                    </span>
                                                    <span className="text-[0.72rem] text-[#8b95ad] dark:text-[#596887]">
                                                        {statLabel}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ---- CENTER NODE ---- */}
                                        <div className="absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-center">
                                            {/* outer glow ring */}
                                            <div className="absolute h-12 w-12 rounded-full bg-[#45CFFF]/[0.06] transition-all duration-500 group-hover:h-14 group-hover:w-14 group-hover:bg-[#45CFFF]/10" />
                                            {/* border ring */}
                                            <div
                                                className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${isFirst || isLast
                                                    ? "border-[#45CFFF] bg-gradient-to-br from-[#45CFFF]/20 to-[#1E56E0]/20 shadow-[0_0_20px_rgba(46,139,240,0.25)]"
                                                    : "border-[#45CFFF]/40 bg-[#060B14] group-hover:border-[#45CFFF]/70"
                                                    }`}
                                            >
                                                <div
                                                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${isFirst || isLast
                                                        ? "bg-[#45CFFF] shadow-[0_0_8px_rgba(46,139,240,0.6)]"
                                                        : "bg-[#45CFFF]/60 group-hover:bg-[#45CFFF] group-hover:shadow-[0_0_8px_rgba(46,139,240,0.4)]"
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        {/* ---- RIGHT SIDE (spacer) ---- */}
                                        <div
                                            className={`w-1/2 ${isLeft ? "order-3" : ""
                                                }`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ======================================================== */}
                    {/*  Timeline — mobile                                       */}
                    {/* ======================================================== */}
                    <div className="relative mt-14 md:hidden">
                        {/* left vertical line */}
                        <div
                            className="absolute left-5 top-0 h-full"
                            style={{
                                width: "2px",
                                background:
                                    "linear-gradient(to bottom, rgba(69,207,255,0.35) 0%, rgba(30,86,224,0.15) 100%)",
                            }}
                        />

                        <div className="space-y-8">
                            {MILESTONES.map(({ year, title, desc, icon: Icon, stat, statLabel }, idx) => {
                                const isFirst = idx === 0;
                                const isLast = idx === MILESTONES.length - 1;

                                return (
                                    <div key={year} className="group relative flex gap-5">
                                        {/* node */}
                                        <div className="relative z-10 flex shrink-0 items-start pt-1">
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${isFirst || isLast
                                                    ? "border-[#45CFFF] bg-gradient-to-br from-[#45CFFF]/20 to-[#1E56E0]/20 shadow-[0_0_14px_rgba(46,139,240,0.2)]"
                                                    : "border-[#45CFFF]/40 bg-[#060B14]"
                                                    }`}
                                            >
                                                <Icon
                                                    size={15}
                                                    className={`${isFirst || isLast
                                                        ? "text-[#45CFFF]"
                                                        : "text-[#45CFFF]/60"
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        {/* card */}
                                        <div className="flex-1 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#0F1E3D]/70 to-[#0B1730]/40 p-5 transition-all duration-300 hover:border-[#45CFFF]/20 hover:shadow-[0_8px_24px_rgba(46,139,240,0.08)]">
                                            <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-[#45CFFF]">
                                                {year}
                                            </span>
                                            <h3 className="mt-1.5 font-sora text-[1rem] font-bold text-[#1a1f36] dark:text-white">
                                                {title}
                                            </h3>
                                            <p className="mt-2 text-[0.82rem] leading-[1.7] text-[#8b95ad] dark:text-[#7C8AAD]">
                                                {desc}
                                            </p>

                                            {/* stat pill */}
                                            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#45CFFF]/15 bg-[#45CFFF]/[0.04] px-3 py-1.5">
                                                <span className="font-sora text-[0.8rem] font-bold text-[#45CFFF]">
                                                    {stat}
                                                </span>
                                                <span className="text-[0.7rem] text-[#8b95ad] dark:text-[#596887]">
                                                    {statLabel}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ======================================================== */}
                    {/*  Bottom — future note                                    */}
                    {/* ======================================================== */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-2.5 rounded-full border border-black/6 bg-[#f1f3f8] px-6 py-3 text-[0.84rem] text-[#8b95ad] dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-[#7C8AAD]">
                            <Sparkles size={14} className="text-[#45CFFF]" />
                            <span>
                                And we're just getting started.{" "}
                                <a
                                    href="/contact"
                                    className="font-semibold text-[#45CFFF] transition-colors hover:text-[#1E56E0]"
                                >
                                    Join the journey →
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  CTA BANNER                                                 */}
            {/* ============================================================ */}
            <section className="px-5 pb-20 pt-10 sm:px-8 md:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="relative overflow-hidden rounded-3xl border border-black/6 bg-gradient-to-br from-[#f1f3f8] to-[#e8ecf4] px-6 py-14 text-center sm:px-12 md:px-20 dark:border-white/[0.06] dark:from-[#0F1E3D]/80 dark:to-[#0B1730]/50">
                        {/* ambient glow */}
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background:
                                    "radial-gradient(700px 300px at 50% 50%, rgba(46,139,240,0.08), transparent 60%)",
                            }}
                        />

                        <div className="relative">
                            <h2 className="mx-auto max-w-2xl font-sora text-[1.8rem] font-bold leading-tight sm:text-[2.2rem]">
                                Ready to build something{" "}
                                <span className="bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] bg-clip-text text-transparent">
                                    extraordinary?
                                </span>
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                                Whether you're launching a startup or scaling an enterprise,
                                our team is ready to be your digital partner.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                <a
                                    href="/contact"
                                    className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-7 py-3.5 font-sora text-[0.9rem] font-semibold text-[#060B14] shadow-[0_8px_30px_rgba(46,139,240,0.25)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(46,139,240,0.35)]"
                                >
                                    Contact Us
                                    <ArrowRight
                                        size={16}
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </a>
                                <a
                                    href="/"
                                    className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-[#f1f3f8] px-7 py-3.5 font-sora text-[0.9rem] font-semibold text-[#1a1f36] transition-all duration-300 hover:border-[#45CFFF]/30 hover:bg-[#e8ecf4] dark:border-white/[0.10] dark:bg-white/[0.03] dark:text-white dark:hover:border-[#45CFFF]/30 dark:hover:bg-[#45CFFF]/5"
                                >
                                    Back to Home
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
