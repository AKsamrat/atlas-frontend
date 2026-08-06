import {
    Palette,
    Shirt,
    FileText,
    Zap,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    PenTool,
    Brush,
    Layout,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Graphic Design Services Page                  */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)         */
/* ------------------------------------------------------------------ */

const DESIGN_SERVICES = [
    {
        icon: Shirt,
        title: "T-Shirt Design",
        desc: "Custom T-shirt designs for brands, events, and merchandise. From concept to print-ready files, we create designs that people actually want to wear.",
        features: ["Unlimited concepts", "Print-ready files (AI/PSD/PDF)", "Brand-aligned artwork", "Merch strategy guidance"],
        link: "/design/t-shirt",
    },
    {
        icon: FileText,
        title: "Brochure Design",
        desc: "Professional brochures that tell your brand story and showcase your products with impact. Tri-fold, bi-fold, or custom formats.",
        features: ["Multi-page layouts", "Print & digital formats", "Infographic integration", "Brand-consistent styling"],
        link: "/design/brochure",
    },
    {
        icon: Zap,
        title: "Flyer Design",
        desc: "Eye-catching flyers for promotions, events, and product launches. Designed to grab attention and drive action.",
        features: ["Event & promo ready", "Bold typography choices", "High-res print files", "Social media variants"],
        link: "/design/flyer",
    },
    {
        icon: Sparkles,
        title: "Logo & Branding",
        desc: "Complete brand identity design — logo, color palette, typography, and guidelines that make your business instantly recognizable.",
        features: ["Logo concepts & revisions", "Brand style guide", "Business card design", "Social media kit"],
        link: "/design/logo-branding",
    },
];

const WORK_PROCESS = [
    { icon: PenTool, title: "Brief & Research", desc: "We dive deep into your brand, audience, and goals to understand what makes you unique." },
    { icon: Brush, title: "Concept Creation", desc: "Our designers craft multiple creative concepts, each exploring a different visual direction." },
    { icon: Layout, title: "Design & Refine", desc: "We iterate with your feedback, refining every detail until the design feels perfect." },
    { icon: CheckCircle2, title: "Deliver & Support", desc: "You receive print-ready and digital files, plus ongoing support for future needs." },
];

const GraphicDesign = () => {
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
                        <Palette size={14} /> Graphic Design
                    </span>
                    <h1 className="font-sora text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                        Designs That{" "}
                        <span className="bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] bg-clip-text text-transparent">Speak Volumes</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#B9C7E0]">
                        From logos to brochures, T-shirts to flyers — our design team creates visuals that capture attention, communicate your message, and elevate your brand.
                    </p>
                </div>
            </section>

            {/* ═══════════════ SERVICES ═══════════════ */}
            <section className="py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1E56E0]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#1E56E0] dark:text-[#45CFFF]">
                            <Palette size={14} /> Our Services
                        </span>
                        <h2 className="font-sora text-3xl font-bold sm:text-4xl text-[#1a1f36] dark:text-white">Design Services We Offer</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        {DESIGN_SERVICES.map((s) => (
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

            {/* ═══════════════ WORK PROCESS ═══════════════ */}
            <section className="bg-[#f8f9fc] dark:bg-[#0B1730]/50 py-20 md:py-28">
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#45CFFF]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#45CFFF]">
                            <PenTool size={14} /> How We Work
                        </span>
                        <h2 className="font-sora text-3xl font-bold sm:text-4xl text-[#1a1f36] dark:text-white">Our Design Process</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {WORK_PROCESS.map((step, i) => (
                            <div key={step.title} className="relative rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] bg-white dark:bg-[#0F1E3D] p-6 text-center hover:shadow-lg transition-all">
                                <div className="mb-3 text-xs font-bold text-[#8b95ad]">Step {i + 1}</div>
                                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#45CFFF]/10 text-[#45CFFF]">
                                    <step.icon size={20} />
                                </div>
                                <h3 className="font-sora text-base font-bold text-[#1a1f36] dark:text-white mb-2">{step.title}</h3>
                                <p className="text-xs leading-relaxed text-[#718096] dark:text-[#A0AEC0]">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ CTA ═══════════════ */}
            <section className="bg-gradient-to-br from-[#060B14] via-[#0B1730] to-[#0F1E3D] py-20 text-center text-white">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <h2 className="font-sora text-3xl font-bold sm:text-4xl">
                        Let's Create Something{" "}
                        <span className="bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] bg-clip-text text-transparent">Beautiful</span>
                    </h2>
                    <p className="mt-4 text-lg text-[#B9C7E0]">Ready to elevate your brand with professional design?</p>
                    <a href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-8 py-3.5 font-sora text-sm font-semibold text-[#060B14] shadow-[0_8px_30px_rgba(46,139,240,0.25)] transition-all hover:shadow-[0_12px_40px_rgba(46,139,240,0.35)]">
                        Get a Free Quote <ArrowRight size={16} />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default GraphicDesign;
