import { Search, PenTool, Code2, Rocket } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Process / How It Works                        */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)        */
/* ------------------------------------------------------------------ */

interface ProcessStep {
    num: string;
    title: string;
    desc: string;
    icon: typeof Search;
    color: string;
}

const STEPS: ProcessStep[] = [
    {
        num: "01",
        title: "Discover",
        desc: "Free consultation, scope definition, and project roadmap tailored to your goals.",
        icon: Search,
        color: "#45CFFF",
    },
    {
        num: "02",
        title: "Design",
        desc: "Wireframes, high-fidelity mockups, and iterative feedback loops until it's perfect.",
        icon: PenTool,
        color: "#2E8BF0",
    },
    {
        num: "03",
        title: "Build",
        desc: "Clean, scalable code with staging reviews, QA testing, and performance optimization.",
        icon: Code2,
        color: "#1E56E0",
    },
    {
        num: "04",
        title: "Launch & Grow",
        desc: "Seamless go-live, team training, and ongoing support to scale your digital presence.",
        icon: Rocket,
        color: "#45CFFF",
    },
];

export default function Process() {
    return (
        <section className="relative bg-white px-5 py-20 sm:px-8 md:px-16 dark:bg-[#060B14]">
            {/* ambient glow */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(900px 500px at 80% 20%, rgba(69,207,255,0.08), transparent 55%)",
                }}
            />

            <div className="relative mx-auto max-w-7xl">
                {/* heading */}
                <div className="mx-auto max-w-2xl text-center">
                    <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                        <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                        Our Process
                    </span>
                    <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                        From idea to impact in four clear steps.
                    </h2>
                    <p className="mt-4 text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                        Transparent, collaborative, and designed to keep you informed at every stage.
                    </p>
                </div>

                {/* steps */}
                <div className="relative mt-16">
                    {/* connecting line */}
                    <div className="pointer-events-none absolute left-1/6 right-1/6 top-10 hidden h-px bg-gradient-to-r from-transparent via-[#45CFFF]/30 to-transparent md:block" />

                    <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {STEPS.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.num} className="relative text-center">
                                    {/* step number */}
                                    <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full font-mono text-sm font-bold text-[#060B14] shadow-[0_8px_24px_rgba(46,139,240,0.4)]"
                                        style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)` }}
                                    >
                                        {step.num}
                                    </span>

                                    {/* icon */}
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                                        style={{ background: `${step.color}15` }}
                                    >
                                        <Icon size={22} style={{ color: step.color }} />
                                    </div>

                                    <h3 className="font-sora text-[1.15rem] font-bold text-[#1a1f36] dark:text-white">
                                        {step.title}
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-[32ch] text-[0.9rem] leading-relaxed text-[#8b95ad] dark:text-[#7C8AAD]">
                                        {step.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}