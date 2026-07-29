import { Sparkles, Palette, CheckCircle2, ArrowRight, Layers, Target, Shield, ShoppingCart } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { useCart } from "../store/cartStore";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Logo & Branding Page                          */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)        */
/* ------------------------------------------------------------------ */

const FEATURES = [
    {
        icon: Sparkles,
        title: "Strategy-First Approach",
        desc: "We research your market, audience, and competitors before sketching a single line.",
    },
    {
        icon: Target,
        title: "Distinctive Positioning",
        desc: "Logos that differentiate — not derivative trends that blend into your category.",
    },
    {
        icon: Palette,
        title: "Systematic Color & Type",
        desc: "Accessible palettes, scalable type scales, and usage rules that non-designers can follow.",
    },
    {
        icon: Layers,
        title: "Flexible Logo Systems",
        desc: "Primary, secondary, icon, monogram, responsive variants — works everywhere.",
    },
    {
        icon: Shield,
        title: "Trademark-Ready Delivery",
        desc: "Unique marks with clearance search guidance and vector source files for registration.",
    },
    {
        icon: CheckCircle2,
        title: "Implementation Support",
        desc: "Guidelines, templates, and 30-day support so your team applies the brand correctly.",
    },
];

const PROCESS_STEPS = [
    { num: "01", title: "Discovery & Strategy", desc: "Workshop sessions, competitor audit, positioning statement, and creative brief." },
    { num: "02", title: "Concept Development", desc: "3-5 distinct logo directions with rationale — presented with real-world mockups." },
    { num: "03", title: "Refinement & System", desc: "Chosen concept polished, full identity system built (color, type, graphics, patterns)." },
    { num: "04", title: "Guidelines & Handoff", desc: "Comprehensive brand book, all source files, templates, and team walkthrough." },
];

function CheckIcon() {
    return <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-[#45CFFF]" />;
}

export default function LogoBranding() {
    const { content } = useContent();
    const { addItem } = useCart();
    const PLANS = content.servicePackages["logo-branding"];

    return (
        <div className="bg-white font-inter text-[#1a1f36] dark:bg-[#060B14] dark:text-white">
            {/* ============================================================ */}
            {/*  HERO                                                        */}
            {/* ============================================================ */}
            <section className="relative overflow-hidden px-5 py-24 sm:px-8 md:px-16">
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
                            <Sparkles size={14} /> Logo & Branding
                        </span>

                        <h1 className="mt-6 font-sora text-[2.4rem] font-bold leading-[1.08] tracking-tight sm:text-[3.2rem] lg:text-[3.8rem]">
                            Brands that{" "}
                            <span className="bg-gradient-to-r from-[#45CFFF] via-[#2E8BF0] to-[#1E56E0] bg-clip-text text-transparent">
                                own their category.
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                            Strategic identity systems — logo suites, color, typography, guidelines, and launch collateral.
                            Built for recognition, trust, and scale.
                        </p>

                        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                            <a
                                href="#plans"
                                className="inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] px-7 py-3.5 text-[0.95rem] font-semibold shadow-[0_10px_30px_rgba(30,86,224,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(30,86,224,0.5)]"
                            >
                                View Pricing <ArrowRight size={16} />
                            </a>
                            <a
                                href="#process"
                                className="inline-flex items-center gap-2 rounded-[10px] border border-black/10 bg-black/[0.03] px-7 py-3.5 text-[0.95rem] font-semibold transition-all duration-300 hover:bg-black/[0.06] dark:border-white/12 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                            >
                                Our Process
                            </a>
                        </div>

                        <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-black/8 pt-8 dark:border-white/[0.09]">
                            <div>
                                <b className="block font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">80+</b>
                                <span className="font-mono text-[0.72rem] text-[#8b95ad] dark:text-[#7C8AAD]">BRANDS LAUNCHED</span>
                            </div>
                            <div>
                                <b className="block font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">100%</b>
                                <span className="font-mono text-[0.72rem] text-[#8b95ad] dark:text-[#7C8AAD]">TRADEMARK-CLEARED</span>
                            </div>
                            <div>
                                <b className="block font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">2-Week</b>
                                <span className="font-mono text-[0.72rem] text-[#8b95ad] dark:text-[#7C8AAD]">AVG TIMELINE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  WHY CHOOSE US — 6 features                                  */}
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
                            Why Choose Entra
                        </span>
                        <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                            Strategy-led identity. Built to last.
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
            {/*  PRICING / PLANS                                             */}
            {/* ============================================================ */}
            <section id="plans" className="relative px-5 py-20 sm:px-8 md:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                            <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                            Pricing
                        </span>
                        <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                            Investment tiers for every stage.
                        </h2>
                        <p className="mt-4 text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                            Every tier includes strategy, mockups, source files, and implementation support.
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
                                        <Sparkles size={12} /> Most Popular
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
                                        id: `logo-${plan.name}`,
                                        serviceKey: "logo-branding",
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
            {/*  PROCESS — 4 steps                                           */}
            {/* ============================================================ */}
            <section id="process" className="relative px-5 py-20 sm:px-8 md:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                            <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                            Our Process
                        </span>
                        <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                            From strategy session to brand book in four steps.
                        </h2>
                    </div>

                    <div className="relative mt-14 grid gap-8 md:grid-cols-4">
                        <div className="pointer-events-none absolute left-1/6 right-1/6 top-8 hidden h-px bg-gradient-to-r from-transparent via-[#45CFFF]/30 to-transparent md:block" />

                        {PROCESS_STEPS.map((step) => (
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
            {/*  CTA BANNER                                                  */}
            {/* ============================================================ */}
            <section className="relative px-5 pb-20 sm:px-8 md:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="overflow-hidden rounded-[28px] border border-black/8 bg-gradient-to-br from-white via-[#f1f3f8] to-[#e8ecf4] p-10 sm:p-14 text-center dark:border-white/[0.09] dark:from-[#0F1E3D] dark:via-[#0B1730] dark:to-[#060B14]">
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
                                Ready to define your brand?
                            </h2>
                            <p className="mx-auto mt-4 max-w-[48ch] text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                                Let's build an identity system that differentiates, resonates, and scales with your business.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                <a
                                    href="/contact"
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-7 py-3.5 text-[0.95rem] font-semibold text-[#060B14] shadow-[0_10px_30px_rgba(46,139,240,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(46,139,240,0.5)]"
                                >
                                    Start a Project <ArrowRight size={16} />
                                </a>
                                <a
                                    href="#plans"
                                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-7 py-3.5 text-[0.95rem] font-semibold transition-all duration-300 hover:bg-black/[0.06] dark:border-white/12 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                                >
                                    View Pricing
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}