import { useState, useRef, useEffect } from "react";
import { Building2, Award, TrendingUp, Users, Server, Globe2, Shield, HardDrive } from "lucide-react";
import { useContent, type PartnerData } from "../../context/ContentContext";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Trusted By (Logo Marquee)                     */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)        */
/* ------------------------------------------------------------------ */

interface LogoItem {
    name: string;
    icon: typeof Building2;
    color: string;
}

const PARTNER_ICON_MAP: Record<string, typeof Building2> = {
    Building2, Award, TrendingUp, Users, Server, Globe2, Shield, HardDrive,
};


function MarqueeTrack({ logos, isPaused }: { logos: LogoItem[]; isPaused: boolean }) {
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let animationId: number;
        const duration = 30000; // 30 seconds for full loop

        const animate = (time: number) => {
            if (!isPaused && track) {
                const progress = (time % duration) / duration;
                const trackWidth = track.scrollWidth / 2; // Half because we duplicate
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
    );
}

function LogoItem({ logo }: { logo: LogoItem }) {
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

export default function TrustedBy() {
    const { content } = useContent();
    const [isPaused, setIsPaused] = useState(false);

    const clientLogos: LogoItem[] = content.partners.map((p: PartnerData) => ({
        name: p.name,
        icon: PARTNER_ICON_MAP[p.iconName] || Building2,
        color: p.color,
    }));

    return (
        <section className="relative bg-white px-5 py-16 sm:px-8 md:px-16 overflow-hidden dark:bg-[#060B14]">
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

                    <div className="relative overflow-hidden" aria-label="Customer logos" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                        <MarqueeTrack logos={clientLogos} isPaused={isPaused} />
                    </div>
                </div>
            </div>
        </section>
    );
}