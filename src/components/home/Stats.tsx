import { TrendingUp, Shield, Headphones, Users } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Stats Counter Bar                             */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)        */
/* ------------------------------------------------------------------ */

interface StatItem {
    value: string;
    label: string;
    icon: typeof TrendingUp;
}

const STATS: StatItem[] = [
    { value: "500+", label: "Projects Delivered", icon: TrendingUp },
    { value: "99.9%", label: "Uptime Guarantee", icon: Shield },
    { value: "24/7", label: "Expert Support", icon: Headphones },
    { value: "50+", label: "Team Members", icon: Users },
];

export default function Stats() {
    return (
        <section className="relative bg-white px-5 py-16 sm:px-8 md:px-16 dark:bg-[#060B14]">
            {/* ambient glow */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(800px 400px at 50% 0%, rgba(69,207,255,0.06), transparent 60%)",
                }}
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {STATS.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={i}
                                className="text-center border-l border-black/8 dark:border-white/[0.08] first:border-0 lg:border-l lg:border-t-0 lg:first:border-t"
                            >
                                <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#45CFFF]/20 to-[#1E56E0]/20 text-[#45CFFF]">
                                    <Icon size={24} />
                                </div>
                                <div className="font-sora text-[2.5rem] font-bold leading-none text-[#1a1f36] dark:text-white">
                                    {stat.value}
                                </div>
                                <div className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[#8b95ad] dark:text-[#7C8AAD]">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}