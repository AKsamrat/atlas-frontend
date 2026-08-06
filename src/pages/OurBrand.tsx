import {
    Award,
    Users,
    Globe,
    Heart,
    Rocket,
    Shield,
    Handshake,
    Target,
    Eye,
    Sparkles,
    Building2,
    TrendingUp,
    Zap,
    Star,
    CheckCircle2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Our Brand Page                                */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)         */
/* ------------------------------------------------------------------ */

const BRAND_PILLARS = [
    {
        icon: Target,
        title: "Mission",
        desc: "To empower businesses of every size with a complete digital ecosystem — from hosting and development to design and marketing — all under one trusted roof.",
    },
    {
        icon: Eye,
        title: "Vision",
        desc: "To become South Asia's most reliable one-stop digital agency, known for quality, transparency, and lasting client partnerships.",
    },
    {
        icon: Heart,
        title: "Values",
        desc: "Innovation, integrity, and client-first thinking drive every project we take on. We measure success by the growth of the brands we serve.",
    },
];

const STATS = [
    { value: "200+", label: "Brands Served", icon: Building2 },
    { value: "5+", label: "Years of Experience", icon: Award },
    { value: "50+", label: "Team Members", icon: Users },
    { value: "98%", label: "Client Retention", icon: Heart },
];

const WHY_US = [
    { icon: Rocket, title: "Innovation First", desc: "We stay ahead of the curve, adopting the latest technologies and strategies so your business always gets a competitive edge." },
    { icon: Shield, title: "Reliability", desc: "From 99.9% uptime to on-time deliveries, we build trust through consistent, dependable performance." },
    { icon: Handshake, title: "Transparency", desc: "No hidden fees, no surprises. We believe in honest communication and clear reporting at every step." },
    { icon: Globe, title: "One-Stop Hub", desc: "Hosting, development, design, and marketing — everything your digital business needs, managed under one roof." },
    { icon: Users, title: "Empowering Growth", desc: "We don't just deliver projects; we build long-term partnerships that fuel your brand's evolution." },
    { icon: Sparkles, title: "Creative Excellence", desc: "Our design team blends aesthetics with strategy, creating visuals that don't just look good — they convert." },
];

const MILESTONES = [
    { year: "2019", title: "Founded in Dhaka", desc: "Started as a small web development studio with a big vision — to be the one-stop digital agency Bangladesh needed.", icon: Rocket, stat: "4 Founders", statLabel: "Team of 4" },
    { year: "2020", title: "100+ Clients", desc: "Reached our first hundred clients within the first year, proving that businesses were hungry for a unified digital partner.", icon: TrendingUp, stat: "100+", statLabel: "Clients served" },
    { year: "2021", title: "Full-Service Hub", desc: "Expanded into hosting, graphic design, and digital marketing — becoming a true end-to-end digital agency.", icon: Zap, stat: "4 Services", statLabel: "All under one roof" },
    { year: "2022", title: "20+ Team Members", desc: "Grew to a 20+ member crew of designers, developers, marketers and strategists — a family building brands.", icon: Users, stat: "20+", statLabel: "Team members" },
    { year: "2023", title: "200+ Brands", desc: "Crossed the 200-brand milestone, serving startups, SMEs, and enterprise clients across 15+ industries.", icon: Star, stat: "200+", statLabel: "Brands empowered" },
];

const OurBrand = () => {
    return (
        <div className="bg-white font-inter text-[#1a1f36] dark:bg-[#060B14] dark:text-white">
            {/* ═══════════════ HERO ═══════════════ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#060B14] via-[#0B1730] to-[#0F1E3D] py-24 text-white md:py-32">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#45CFFF]/[0.07] blur-[120px]" />
                    <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-[#1E56E0]/[0.1] blur-[100px]" />
                </div>
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 text-center">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#45CFFF]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#45CFFF]">
                        <Sparkles size={14} /> Our Brand
                    </span>
                    <h1 className="font-sora text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                        The Brand Behind{" "}
                        <span className="bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] bg-clip-text text-transparent">Your Digital Growth</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#B9C7E0]">
                        Entra Global Tech is more than a service provider — we're your strategic digital partner,
                        building the infrastructure, design, and marketing engine that powers modern businesses.
                    </p>
                </div>
            </section>

            {/* ═══════════════ STATS ═══════════════ */}
            <section className="relative z-10 -mt-12 mx-auto max-w-5xl px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STATS.map((s) => (
                        <div key={s.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 text-center shadow-lg hover:shadow-xl transition-all">
                            <s.icon size={22} className="mx-auto mb-2 text-[#45CFFF]" />
                            <p className="font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">{s.value}</p>
                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════ MISSION / VISION / VALUES ═══════════════ */}
            <section className="py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1E56E0]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#1E56E0] dark:text-[#45CFFF]">
                            <Target size={14} /> What Drives Us
                        </span>
                        <h2 className="font-sora text-3xl font-bold sm:text-4xl text-[#1a1f36] dark:text-white">Mission, Vision &amp; Values</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {BRAND_PILLARS.map((p) => (
                            <div key={p.title} className="group rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-gradient-to-br from-white to-[#f8f9fc] dark:from-[#0F1E3D] dark:to-[#0B1730] p-8 text-center transition-all hover:shadow-xl hover:-translate-y-1">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <p.icon size={24} />
                                </div>
                                <h3 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white mb-3">{p.title}</h3>
                                <p className="text-sm leading-relaxed text-[#718096] dark:text-[#A0AEC0]">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ WHY CHOOSE US ═══════════════ */}
            <section className="bg-[#f8f9fc] dark:bg-[#0B1730]/50 py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#45CFFF]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#45CFFF]">
                            <Star size={14} /> Why Entra
                        </span>
                        <h2 className="font-sora text-3xl font-bold sm:text-4xl text-[#1a1f36] dark:text-white">Why Businesses Choose Us</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {WHY_US.map((w) => (
                            <div key={w.title} className="group rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#0F1E3D] p-7 transition-all hover:shadow-lg hover:-translate-y-0.5">
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#45CFFF]/10 text-[#45CFFF] group-hover:bg-gradient-to-br group-hover:from-[#45CFFF] group-hover:to-[#1E56E0] group-hover:text-white transition-all">
                                    <w.icon size={20} />
                                </div>
                                <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white mb-2">{w.title}</h3>
                                <p className="text-sm leading-relaxed text-[#718096] dark:text-[#A0AEC0]">{w.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ MILESTONES ═══════════════ */}
            <section className="py-20 md:py-28">
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1E56E0]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#1E56E0] dark:text-[#45CFFF]">
                            <TrendingUp size={14} /> Our Journey
                        </span>
                        <h2 className="font-sora text-3xl font-bold sm:text-4xl text-[#1a1f36] dark:text-white">Milestones That Matter</h2>
                    </div>
                    <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#45CFFF] via-[#1E56E0] to-transparent md:left-1/2" />
                        <div className="space-y-12">
                            {MILESTONES.map((m, i) => (
                                <div key={m.year} className={`relative flex flex-col md:flex-row items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                                    <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                                        <div className="inline-block rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#0F1E3D] p-6 shadow-sm hover:shadow-lg transition-all">
                                            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#45CFFF]/10 px-3 py-1 text-xs font-bold text-[#45CFFF]">
                                                <m.icon size={12} /> {m.year}
                                            </span>
                                            <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white mt-2">{m.title}</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-[#718096] dark:text-[#A0AEC0]">{m.desc}</p>
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="font-sora text-xl font-bold text-[#1E56E0] dark:text-[#45CFFF]">{m.stat}</span>
                                                <span className="text-xs text-[#8b95ad]">{m.statLabel}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 z-10 flex h-3 w-3 items-center justify-center">
                                        <div className="h-3 w-3 rounded-full bg-[#45CFFF] ring-4 ring-white dark:ring-[#060B14]" />
                                    </div>
                                    <div className="flex-1 hidden md:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ CTA ═══════════════ */}
            <section className="bg-gradient-to-br from-[#060B14] via-[#0B1730] to-[#0F1E3D] py-20 text-center text-white">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <h2 className="font-sora text-3xl font-bold sm:text-4xl">
                        Ready to Grow with{" "}
                        <span className="bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] bg-clip-text text-transparent">Entra?</span>
                    </h2>
                    <p className="mt-4 text-lg text-[#B9C7E0]">Join 200+ brands that trust us to power their digital journey.</p>
                    <a href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-8 py-3.5 font-sora text-sm font-semibold text-[#060B14] shadow-[0_8px_30px_rgba(46,139,240,0.25)] transition-all hover:shadow-[0_12px_40px_rgba(46,139,240,0.35)]">
                        Get in Touch <CheckCircle2 size={16} />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default OurBrand;
