import {
    Megaphone,
    Users,
    Rocket,
    CheckCircle2,
    ArrowRight,
    BarChart3,
    Target,
    TrendingUp,
    Globe,
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Digital Marketing Services Page               */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)         */
/* ------------------------------------------------------------------ */

const MARKETING_SERVICES = [
    {
        icon: FaFacebook,
        title: "Facebook Marketing",
        desc: "Strategic Facebook campaigns that reach your ideal audience. From organic growth to paid ads, we build your presence where billions scroll daily.",
        features: ["Page setup & optimization", "Content calendar creation", "Facebook Ads (Meta Ads)", "Audience targeting & retargeting"],
        link: "/marketing/facebook",
    },
    {
        icon: FaInstagram,
        title: "Instagram Marketing",
        desc: "Visual storytelling that captures attention. We create scroll-stopping content and run campaigns that turn followers into customers.",
        features: ["Reels & Stories strategy", "Hashtag research", "Instagram Ads", "Influencer collaboration"],
        link: "/marketing/instagram",
    },
    {
        icon: Users,
        title: "Likes & Followers",
        desc: "Authentic, organic follower growth strategies that build a real community around your brand — no bots, no shortcuts.",
        features: ["Organic growth tactics", "Engagement campaigns", "Community management", "Analytics & reporting"],
        link: "/marketing/likes-followers",
    },
    {
        icon: Rocket,
        title: "Boosted Post Campaigns",
        desc: "Amplify your best content with targeted boosted posts. Get your message in front of the right people at the right time.",
        features: ["Budget-optimized boosts", "A/B ad testing", "Performance tracking", "ROI-focused strategy"],
        link: "/marketing/boosted-posts",
    },
];

const RESULTS = [
    { value: "5x", label: "Average Engagement Increase", icon: TrendingUp },
    { value: "3x", label: "Return on Ad Spend", icon: BarChart3 },
    { value: "10M+", label: "Impressions Generated", icon: Globe },
    { value: "200+", label: "Campaigns Launched", icon: Rocket },
];

const WHY_CHOOSE = [
    { icon: Target, title: "Audience-First Approach", desc: "We don't just post — we research, target, and retarget to reach the people who matter most to your business." },
    { icon: BarChart3, title: "Data-Driven Decisions", desc: "Every campaign is backed by analytics. We track, measure, and optimize continuously for maximum ROI." },
    { icon: TrendingUp, title: "Scalable Strategies", desc: "Whether you're starting with a small budget or running enterprise campaigns, our strategies grow with you." },
];

const DigitalMarketing = () => {
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
                        <Megaphone size={14} /> Digital Marketing
                    </span>
                    <h1 className="font-sora text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                        Marketing That{" "}
                        <span className="bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] bg-clip-text text-transparent">Drives Results</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#B9C7E0]">
                        Data-driven digital marketing that puts your brand in front of the right audience,
                        at the right time, on the right platform — and turns clicks into customers.
                    </p>
                </div>
            </section>

            {/* ═══════════════ STATS ═══════════════ */}
            <section className="relative z-10 -mt-12 mx-auto max-w-5xl px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {RESULTS.map((r) => (
                        <div key={r.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 text-center shadow-lg hover:shadow-xl transition-all">
                            <r.icon size={22} className="mx-auto mb-2 text-[#45CFFF]" />
                            <p className="font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">{r.value}</p>
                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{r.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════ SERVICES ═══════════════ */}
            <section className="py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1E56E0]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#1E56E0] dark:text-[#45CFFF]">
                            <Megaphone size={14} /> Our Services
                        </span>
                        <h2 className="font-sora text-3xl font-bold sm:text-4xl text-[#1a1f36] dark:text-white">Marketing Services We Offer</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        {MARKETING_SERVICES.map((s) => (
                            <div key={s.title} className="group rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#0F1E3D] p-7 transition-all hover:shadow-xl hover:-translate-y-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] text-white shadow-lg group-hover:scale-110 transition-transform">
                                        <s.icon size={22} />
                                    </div>
                                    <h3 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">{s.title}</h3>
                                </div>
                                <p className="text-sm leading-relaxed text-[#718096] dark:text-[#A0AEC0] mb-5">{s.desc}</p>
                                <ul className="space-y-2 mb-5">
                                    {s.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2 text-sm text-[#718096] dark:text-[#A0AEC0]">
                                            <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-[#45CFFF]" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to={s.link}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E56E0] dark:text-[#45CFFF] hover:gap-3 transition-all"
                                >
                                    Learn More <ArrowRight size={14} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ WHY CHOOSE US ═══════════════ */}
            <section className="bg-[#f8f9fc] dark:bg-[#0B1730]/50 py-20 md:py-28">
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#45CFFF]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#45CFFF]">
                            <BarChart3 size={14} /> Why Us
                        </span>
                        <h2 className="font-sora text-3xl font-bold sm:text-4xl text-[#1a1f36] dark:text-white">Why Brands Trust Our Marketing</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {WHY_CHOOSE.map((w) => (
                            <div key={w.title} className="rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#0F1E3D] p-7 text-center hover:shadow-lg transition-all">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#45CFFF]/10 text-[#45CFFF]">
                                    <w.icon size={22} />
                                </div>
                                <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white mb-2">{w.title}</h3>
                                <p className="text-sm leading-relaxed text-[#718096] dark:text-[#A0AEC0]">{w.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ CTA ═══════════════ */}
            <section className="bg-gradient-to-br from-[#060B14] via-[#0B1730] to-[#0F1E3D] py-20 text-center text-white">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <h2 className="font-sora text-3xl font-bold sm:text-4xl">
                        Ready to{" "}
                        <span className="bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] bg-clip-text text-transparent">Scale Your Brand?</span>
                    </h2>
                    <p className="mt-4 text-lg text-[#B9C7E0]">Let's build a marketing strategy that turns clicks into customers.</p>
                    <a href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-8 py-3.5 font-sora text-sm font-semibold text-[#060B14] shadow-[0_8px_30px_rgba(46,139,240,0.25)] transition-all hover:shadow-[0_12px_40px_rgba(46,139,240,0.35)]">
                        Start a Campaign <ArrowRight size={16} />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default DigitalMarketing;
