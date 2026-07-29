import { ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Final CTA Section                             */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)        */
/* ------------------------------------------------------------------ */

interface FinalCTAProps {
    headline?: string;
    subtext?: string;
    primaryCTA?: { label: string; href: string };
    secondaryCTA?: { label: string; href: string };
    title?: string;
    description?: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    trustBadges?: string[];
}

export default function FinalCTA({
    headline = "Ready to grow your digital presence?",
    subtext = "Let's build something great together. Free consultation, no obligation.",
    primaryCTA = { label: "Start Your Project", href: "/contact" },
    secondaryCTA = { label: "View Our Work", href: "/portfolio" },
    title,
    description,
    primaryCta,
    secondaryCta,
    trustBadges,
}: FinalCTAProps) {
    // Support both prop naming conventions
    const h = title || headline;
    const s = description || subtext;
    const pCta = primaryCta || primaryCTA;
    const sCta = secondaryCta || secondaryCTA;
    const badges = trustBadges || [
        "No long-term contracts",
        "30-day money-back",
        "Dedicated account manager"
    ];

    return (
        <section className="relative bg-white px-5 py-20 sm:px-8 md:px-16 dark:bg-[#060B14]">
            {/* ambient glows */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(600px 300px at 20% 50%, rgba(69,207,255,0.12), transparent 55%), radial-gradient(500px 250px at 80% 50%, rgba(30,86,224,0.10), transparent 50%)",
                }}
            />

            <div className="relative mx-auto max-w-4xl text-center">
                <h2 className="font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] lg:text-[3rem] dark:text-white">
                    {h}
                </h2>
                <p className="mx-auto mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                    {s}
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <a
                        href={pCta.href}
                        className="inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] px-8 py-4 text-[0.95rem] font-semibold shadow-[0_10px_30px_rgba(30,86,224,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(30,86,224,0.5)]"
                    >
                        {pCta.label} <ArrowRight size={16} />
                    </a>
                    <a
                        href={sCta.href}
                        className="inline-flex text-gray-700 dark:text-white items-center gap-2 rounded-[10px] border border-black/10 bg-black/[0.03] px-8 py-4 text-[0.95rem] font-semibold transition-all duration-300 hover:bg-black/[0.06] dark:border-white/12 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                    >
                        {sCta.label}
                    </a>
                </div>

                {/* trust line */}
                <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-[0.8rem] text-[#8b95ad] dark:text-[#7C8AAD]">
                    {badges.map((badge, i) => (
                        <span key={i} className="flex items-center gap-1.5 font-mono">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#45CFFF]" />
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}