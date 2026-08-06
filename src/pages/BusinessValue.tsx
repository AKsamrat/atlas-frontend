import {
    TrendingUp,
    DollarSign,
    Clock,
    Users,
    Target,
    BarChart3,
    Shield,
    Zap,
    Globe,
    Award,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Rocket,
    Handshake,
    Lightbulb,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Business Value Page                           */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)         */
/* ------------------------------------------------------------------ */

const VALUES = [
    {
        icon: TrendingUp,
        title: "Revenue Growth",
        desc: "Our strategies are designed to drive measurable revenue — from SEO that ranks to campaigns that convert.",
        stat: "3x",
        statLabel: "Average ROI",
    },
    {
        icon: Clock,
        title: "Time Savings",
        desc: "One partner for hosting, dev, design, and marketing means less time managing vendors and more time growing.",
        stat: "60%",
        statLabel: "Less vendor time",
    },
    {
        icon: DollarSign,
        title: "Cost Efficiency",
        desc: "Bundled services at competitive rates eliminate redundancy and reduce your overall digital spend.",
        stat: "40%",
        statLabel: "Cost reduction",
    },
    {
        icon: Users,
        title: "Customer Reach",
        desc: "Data-driven marketing expands your audience across social, search, and display — reaching the right people at the right time.",
        stat: "5x",
        statLabel: "More leads",
    },
    {
        icon: Shield,
        title: "Brand Trust",
        desc: "Professional design and consistent branding build credibility that turns visitors into loyal customers.",
        stat: "98%",
        statLabel: "Client retention",
    },
    {
        icon: Zap,
        title: "Speed to Market",
        desc: "Streamlined processes and in-house teams mean faster launches — from website to campaign, weeks not months.",
        stat: "2x",
        statLabel: "Faster launch",
    },
];

const SERVICES_VALUE = [
    {
        icon: Globe,
        title: "Domain & Hosting",
        values: ["99.9% uptime guarantee", "Free SSL certificates", "Daily backups", "24/7 support"],
    },
    {
        icon: Rocket,
        title: "Web Development",
        values: ["Custom-built solutions", "Mobile-first responsive", "SEO-optimized code", "Fast load times"],
    },
    {
        icon: Target,
        title: "Graphic Design",
        values: ["Brand-consistent visuals", "Conversion-focused layouts", "Print & digital ready", "Unlimited revisions"],
    },
    {
        icon: BarChart3,
        title: "Digital Marketing",
        values: ["Data-driven campaigns", "ROI tracking & reports", "Multi-channel reach", "A/B testing"],
    },
];

const TESTIMONIALS = [
    {
        name: "Rafiq Ahmed",
        role: "CEO, TechBD Solutions",
        text: "Entra helped us go from zero online presence to a fully branded digital ecosystem in 3 months. Our leads tripled.",
    },
    {
        name: "Sara Khan",
        role: "Founder, Bloom Cosmetics",
        text: "The design team understood our vision perfectly. Our rebrand brought in 40% more customers within the first quarter.",
    },
    {
        name: "Tanvir Hassan",
        role: "Director, GreenLeaf Foods",
        text: "Having one agency handle hosting, website, and marketing simplified everything. We saved both time and money.",
    },
];

const BusinessValue = () => {
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
                        <TrendingUp size={14} /> Business Value
                    </span>
                    <h1 className="font-sora text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                        Real Value for{" "}
                        <span className="bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] bg-clip-text text-transparent">Your Business</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#B9C7E0]">
                        Every service we deliver is designed to move the needle — more revenue, less overhead,
                        faster growth, and a brand that stands out.
                    </p>
                </div>
            </section>

            {/* ═══════════════ CORE VALUES ═══════════════ */}
            <section className="py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1E56E0]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#1E56E0] dark:text-[#45CFFF]">
                            <Lightbulb size={14} /> The Impact
                        </span>
                        <h2 className="font-sora text-3xl font-bold sm:text-4xl text-[#1a1f36] dark:text-white">How We Create Value</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {VALUES.map((v) => (
                            <div key={v.title} className="group rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#0F1E3D] p-7 transition-all hover:shadow-lg hover:-translate-y-0.5">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#45CFFF]/10 text-[#45CFFF] group-hover:bg-gradient-to-br group-hover:from-[#45CFFF] group-hover:to-[#1E56E0] group-hover:text-white transition-all">
                                    <v.icon size={22} />
                                </div>
                                <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white mb-2">{v.title}</h3>
                                <p className="text-sm leading-relaxed text-[#718096] dark:text-[#A0AEC0] mb-4">{v.desc}</p>
                                <div className="flex items-center gap-2 pt-3 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                                    <span className="font-sora text-2xl font-bold text-[#1E56E0] dark:text-[#45CFFF]">{v.stat}</span>
                                    <span className="text-xs text-[#8b95ad]">{v.statLabel}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ SERVICE VALUE BREAKDOWN ═══════════════ */}
            <section className="bg-[#f8f9fc] dark:bg-[#0B1730]/50 py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#45CFFF]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#45CFFF]">
                            <Award size={14} /> Service Value
                        </span>
                        <h2 className="font-sora text-3xl font-bold sm:text-4xl text-[#1a1f36] dark:text-white">What Each Service Delivers</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        {SERVICES_VALUE.map((sv) => (
                            <div key={sv.title} className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#0F1E3D] p-7 hover:shadow-lg transition-all">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] text-white shadow-md">
                                        <sv.icon size={20} />
                                    </div>
                                    <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white">{sv.title}</h3>
                                </div>
                                <ul className="space-y-3">
                                    {sv.values.map((item) => (
                                        <li key={item} className="flex items-start gap-2.5 text-sm text-[#718096] dark:text-[#A0AEC0]">
                                            <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-[#45CFFF]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ TESTIMONIALS ═══════════════ */}
            <section className="py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1E56E0]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#1E56E0] dark:text-[#45CFFF]">
                            <Handshake size={14} /> Client Stories
                        </span>
                        <h2 className="font-sora text-3xl font-bold sm:text-4xl text-[#1a1f36] dark:text-white">What Our Clients Say</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {TESTIMONIALS.map((t) => (
                            <div key={t.name} className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#0F1E3D] p-7 hover:shadow-lg transition-all">
                                <div className="mb-4 text-[#45CFFF] text-3xl font-serif leading-none">&ldquo;</div>
                                <p className="text-sm leading-relaxed text-[#718096] dark:text-[#A0AEC0] mb-5">{t.text}</p>
                                <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-sm font-bold">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#1a1f36] dark:text-white">{t.name}</p>
                                        <p className="text-xs text-[#8b95ad]">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ CTA ═══════════════ */}
            <section className="bg-gradient-to-br from-[#060B14] via-[#0B1730] to-[#0F1E3D] py-20 text-center text-white">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <h2 className="font-sora text-3xl font-bold sm:text-4xl">
                        Invest in Growth That{" "}
                        <span className="bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] bg-clip-text text-transparent">Pays Off</span>
                    </h2>
                    <p className="mt-4 text-lg text-[#B9C7E0]">Let's build a digital strategy that delivers real, measurable results for your business.</p>
                    <a href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-8 py-3.5 font-sora text-sm font-semibold text-[#060B14] shadow-[0_8px_30px_rgba(46,139,240,0.25)] transition-all hover:shadow-[0_12px_40px_rgba(46,139,240,0.35)]">
                        Start Your Journey <ArrowRight size={16} />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default BusinessValue;
