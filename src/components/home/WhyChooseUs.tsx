import {
    Shield,
    Zap,
    Headphones,
    Users,
    Globe2,
    ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Why Choose Us (Home section)                  */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)         */
/* ------------------------------------------------------------------ */

const REASONS = [
    {
        icon: Globe2,
        title: "4-in-1 Service Hub",
        desc: "Hosting, web development, graphic design and digital marketing — one team, one invoice, zero coordination headaches.",
    },
    {
        icon: Zap,
        title: "Lightning-Fast Delivery",
        desc: "Most projects ship in under 2 weeks. We move quickly without cutting corners on quality or security.",
    },
    {
        icon: Shield,
        title: "Built to Last",
        desc: "Clean code, fast hosting and ongoing support mean your site stays online, secure and up-to-date.",
    },
    {
        icon: Headphones,
        title: "Real Humans, 24/7",
        desc: "No chatbot runaround. Our support team responds fast and actually solves your problems.",
    },
    {
        icon: Users,
        title: "Trusted by 200+ Brands",
        desc: "From startups to established businesses, we've delivered results for companies across Bangladesh.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 md:px-16 dark:bg-[#060B14]">
            {/* ambient glow */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(900px 500px at 10% 50%, rgba(69,207,255,0.08), transparent 55%), radial-gradient(700px 400px at 90% 20%, rgba(30,86,224,0.06), transparent 50%)",
                }}
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* left — copy */}
                    <div>
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                            <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                            Why Entra
                        </span>
                        <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                            One team for everything your brand needs online.
                        </h2>
                        <p className="mt-4 text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                            We don't just build websites or run ads — we handle your entire online presence so
                            everything moves together, looks consistent and actually drives results.
                        </p>
                        <a
                            href="/contact"
                            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] px-6 py-3 text-[0.9rem] font-semibold shadow-[0_8px_24px_rgba(30,86,224,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(30,86,224,0.5)]"
                        >
                            Get Started <ArrowRight size={15} />
                        </a>
                    </div>

                    {/* right — feature cards */}
                    <div className="space-y-4">
                        {REASONS.map((r) => {
                            const Icon = r.icon;
                            return (
                                <div
                                    key={r.title}
                                    className="group flex items-start gap-4 rounded-2xl border border-black/8 bg-[#f1f3f8] p-5 transition-all duration-300 hover:border-[#45CFFF]/25 hover:bg-[#e8ecf4] dark:border-white/[0.07] dark:bg-[#0F1E3D]/40 dark:hover:bg-[#0F1E3D]/70"
                                >
                                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#45CFFF]/15 to-[#1E56E0]/15 text-[#45CFFF] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3">
                                        <Icon size={20} />
                                    </span>
                                    <div>
                                        <h4 className="font-sora text-[0.98rem] font-bold text-[#1a1f36] dark:text-white">{r.title}</h4>
                                        <p className="mt-1 text-[0.85rem] leading-relaxed text-[#8b95ad] dark:text-[#7C8AAD]">{r.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
