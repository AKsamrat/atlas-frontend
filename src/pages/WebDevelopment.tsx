import {
    Code2,
    Smartphone,
    Search,
    Palette,
    CheckCircle2,
    ArrowRight,
    Layers,
    Database,
    Gauge,
    Rocket,
    Globe,
    Lock,
    ShoppingCart,
} from "lucide-react";
import { useContent } from "../context/ContentContext";
import { useCart } from "../store/cartStore";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Web Development Landing Page                   */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)         */
/* ------------------------------------------------------------------ */

const SERVICES = [
    {
        icon: Smartphone,
        title: "Responsive & Mobile-First",
        desc: "Every site looks and works perfectly on phones, tablets, desktops and everything in between.",
    },
    {
        icon: Search,
        title: "SEO & Performance",
        desc: "Optimized structure, fast load times and clean code so search engines rank you higher.",
    },
    {
        icon: Palette,
        title: "UI/UX Design",
        desc: "Beautiful, intuitive interfaces designed to convert visitors into customers.",
    },
    {
        icon: Layers,
        title: "Maintenance & Updates",
        desc: "Ongoing support to keep your site fresh, secure and performing at its best.",
    },
];

const PROCESS = [
    { num: "01", title: "Discovery", desc: "We learn your business goals, audience and design preferences." },
    { num: "02", title: "Design", desc: "Our team crafts wireframes and visual mockups for your approval." },
    { num: "03", title: "Development", desc: "We build your site with clean, performant code and modern tech." },
    { num: "04", title: "Launch", desc: "We deploy, test, optimize and hand you the keys — you're live." },
];

const TECH = [
    { icon: Code2, label: "React / Next.js" },
    { icon: Database, label: "Node.js / APIs" },
    { icon: Globe, label: "HTML5 / CSS3" },
    { icon: Gauge, label: "Vite / Tailwind" },
    { icon: Lock, label: "Firebase / Auth" },
    { icon: Rocket, label: "CI / CD Deploy" },
];

/* ---- helper ---- */
function CheckIcon() {
    return <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-[#45CFFF]" />;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function WebDevelopment() {
    const { content } = useContent();
    const { addItem } = useCart();
    const PLANS = content.servicePackages["web-development"];

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
                            "radial-gradient(1100px 550px at 78% 12%, rgba(69,207,255,0.18), transparent 60%), radial-gradient(700px 400px at 15% 88%, rgba(30,86,224,0.14), transparent 55%)",
                    }}
                />

                <div className="relative mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#45CFFF]/20 bg-[#45CFFF]/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#45CFFF]">
                            <Code2 size={14} /> Web Development
                        </span>

                        <h1 className="mt-6 font-sora text-[2.4rem] font-bold leading-[1.08] tracking-tight sm:text-[3.2rem] lg:text-[3.8rem]">
                            Custom websites that{" "}
                            <span className="bg-gradient-to-r from-[#45CFFF] via-[#2E8BF0] to-[#1E56E0] bg-clip-text text-transparent">
                                actually work.
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                            From a single landing page to a full e-commerce store — we design and build websites around
                            what your business actually needs, not a pre-made template.
                        </p>

                        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                            <a
                                href="#plans"
                                className="inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] px-7 py-3.5 text-[0.95rem] font-semibold shadow-[0_10px_30px_rgba(30,86,224,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(30,86,224,0.5)]"
                            >
                                View Plans <ArrowRight size={16} />
                            </a>
                            <a
                                href="#services"
                                className="inline-flex items-center gap-2 rounded-[10px] border border-black/10 bg-black/[0.03] px-7 py-3.5 text-[0.95rem] font-semibold transition-all duration-300 hover:bg-black/[0.06] dark:border-white/[0.12] dark:bg-white/[0.02] dark:hover:bg-white/[0.06]"
                            >
                                See Our Work
                            </a>
                        </div>

                        {/* quick stats */}
                        <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-black/8 pt-8 dark:border-white/[0.09]">
                            <div>
                                <b className="block font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">200+</b>
                                <span className="font-mono text-[0.72rem] text-[#8b95ad] dark:text-[#7C8AAD]">SITES BUILT</span>
                            </div>
                            <div>
                                <b className="block font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">98%</b>
                                <span className="font-mono text-[0.72rem] text-[#8b95ad] dark:text-[#7C8AAD]">CLIENT SATISFACTION</span>
                            </div>
                            <div>
                                <b className="block font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">&lt;2s</b>
                                <span className="font-mono text-[0.72rem] text-[#8b95ad] dark:text-[#7C8AAD]">AVG LOAD TIME</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  TECH STACK                                                  */}
            {/* ============================================================ */}
            <section className="relative px-5 py-14 sm:px-8 md:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {TECH.map((t) => {
                            const Icon = t.icon;
                            return (
                                <span
                                    key={t.label}
                                    className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-[#f1f3f8] px-4 py-2 text-[0.82rem] font-medium text-[#596887] transition-colors hover:border-[#45CFFF]/30 hover:text-[#1a1f36] dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#B9C7E0] dark:hover:text-white"
                                >
                                    <Icon size={14} className="text-[#45CFFF]" />
                                    {t.label}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  SERVICES / WHAT WE BUILD                                     */}
            {/* ============================================================ */}
            <section id="services" className="relative px-5 py-20 sm:px-8 md:px-16">
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "radial-gradient(900px 500px at 88% 20%, rgba(69,207,255,0.10), transparent 55%)" }}
                />

                <div className="relative mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                            <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                            What We Build
                        </span>
                        <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                            From idea to live site, we handle it all.
                        </h2>
                    </div>

                    <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {SERVICES.map((s) => {
                            const Icon = s.icon;
                            return (
                                <div
                                    key={s.title}
                                    className="group rounded-2xl border border-black/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#45CFFF]/30 hover:shadow-[0_16px_40px_rgba(46,139,240,0.15)] dark:border-white/[0.08] dark:bg-gradient-to-b dark:from-[#0F1E3D]/95 dark:to-[#0B1730]/90"
                                >
                                    <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#45CFFF]/20 to-[#1E56E0]/20 text-[#45CFFF] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3">
                                        <Icon size={22} />
                                    </span>
                                    <h4 className="font-sora text-[1.05rem] font-bold text-[#1a1f36] dark:text-white">{s.title}</h4>
                                    <p className="mt-2 text-[0.88rem] leading-relaxed text-[#8b95ad] dark:text-[#7C8AAD]">{s.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  PROCESS — 4 steps                                           */}
            {/* ============================================================ */}
            <section className="relative px-5 py-20 sm:px-8 md:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                            <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                            Our Process
                        </span>
                        <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                            From concept to launch in four steps.
                        </h2>
                    </div>

                    <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {/* connecting line */}
                        <div className="pointer-events-none absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-transparent via-[#45CFFF]/30 to-transparent lg:block" />

                        {PROCESS.map((step) => (
                            <div key={step.num} className="relative text-center">
                                <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] font-mono text-sm font-bold text-[#060B14] shadow-[0_8px_24px_rgba(46,139,240,0.4)]">
                                    {step.num}
                                </span>
                                <h3 className="font-sora text-[1.15rem] font-bold text-[#1a1f36] dark:text-white">{step.title}</h3>
                                <p className="mx-auto mt-2 max-w-[30ch] text-[0.88rem] leading-relaxed text-[#8b95ad] dark:text-[#7C8AAD]">{step.desc}</p>
                            </div>
                        ))}
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
                            Transparent pricing, no surprises.
                        </h2>
                        <p className="mt-4 text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                            Choose the plan that fits your project. Every plan includes responsive design, SEO basics and a fast, secure build.
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
                                        <Rocket size={12} /> Most Popular
                                    </span>
                                )}

                                <h3 className="font-sora text-[1.2rem] font-bold text-[#1a1f36] dark:text-white">{plan.name}</h3>
                                <p className="mt-1 text-[0.82rem] text-[#8b95ad] dark:text-[#7C8AAD]">{plan.tagline}</p>

                                <div className="mt-5 flex items-baseline gap-1">
                                    <span className="font-mono text-[0.85rem] text-[#596887] dark:text-[#B9C7E0]">৳</span>
                                    <span className="font-sora text-[2.4rem] font-bold leading-none text-[#1a1f36] dark:text-white">{plan.price}</span>
                                    {plan.period && <span className="text-[0.85rem] text-[#8b95ad] dark:text-[#7C8AAD]">{plan.period}</span>}
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
                                        id: `web-dev-${plan.name}`,
                                        serviceKey: "web-development",
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
                                    <ShoppingCart size={15} /> Add to Cart
                                </button>
                                <section className="relative px-5 py-20 sm:px-8 md:px-16">
                                    <div className="mx-auto max-w-7xl">
                                        <div className="grid gap-12 md:grid-cols-2 md:items-center">
                                            {/* left copy */}
                                            <div>
                                                <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                                                    <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                                                    Why Entra
                                                </span>
                                                <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                                                    We don't just build websites. We build growth engines.
                                                </h2>
                                                <p className="mt-4 text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                                                    Every site we deliver is optimized for speed, search engines and conversions — so it doesn't
                                                    just look great, it actually drives results for your business.
                                                </p>
                                                <a
                                                    href="/contact"
                                                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] px-6 py-3 text-[0.9rem] font-semibold shadow-[0_8px_24px_rgba(30,86,224,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(30,86,224,0.5)]"
                                                >
                                                    Start Your Project <ArrowRight size={15} />
                                                </a>
                                            </div>

                                            {/* right metrics */}
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {[
                                                    { icon: Gauge, title: "Speed Optimized", desc: "Sub-2-second load times on every build." },
                                                    { icon: Search, title: "SEO Ready", desc: "Clean markup and structured data out of the box." },
                                                    { icon: Smartphone, title: "100% Responsive", desc: "Pixel-perfect on every screen size." },
                                                    { icon: Lock, title: "Secure by Default", desc: "HTTPS, input sanitization and best practices." },
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
                                {/*  CTA BANNER                                                  */}
                                {/* ============================================================ */}
                                <section className="relative px-5 pb-20 sm:px-8 md:px-16">
                                    <div className="mx-auto max-w-7xl">
                                        <div className="relative overflow-hidden rounded-[28px] border border-black/8 bg-gradient-to-br from-white via-[#f1f3f8] to-[#e8ecf4] p-10 text-center sm:p-14 dark:border-white/[0.09] dark:from-[#0F1E3D] dark:via-[#0B1730] dark:to-[#060B14]">
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
                                                    Ready to build your dream website?
                                                </h2>
                                                <p className="mx-auto mt-4 max-w-[48ch] text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                                                    Let's turn your vision into a fast, beautiful and conversion-ready website. Tell us what
                                                    you need and we'll make it happen.
                                                </p>
                                                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                                    <a
                                                        href="/contact"
                                                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-7 py-3.5 text-[0.95rem] font-semibold text-[#060B14] shadow-[0_10px_30px_rgba(46,139,240,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(46,139,240,0.5)]"
                                                    >
                                                        Start Your Project <ArrowRight size={16} />
                                                    </a>
                                                    <a
                                                        href="/contact"
                                                        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-7 py-3.5 text-[0.95rem] font-semibold transition-all duration-300 hover:bg-black/[0.06] dark:border-white/[0.12] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
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
