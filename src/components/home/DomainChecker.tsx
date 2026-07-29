import { useState, useCallback } from "react";
import { Search, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Domain Availability Checker                   */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)        */
/* ------------------------------------------------------------------ */

const POPULAR_TLDS = [
    ".com",
    ".net",
    ".org",
    ".io",
    ".co",
    ".biz",
    ".info",
    ".online",
    ".site",
    ".tech",
    ".store",
    ".xyz",
];

type DomainStatus = "idle" | "checking" | "available" | "taken" | "error";

interface DomainResult {
    domain: string;
    status: DomainStatus;
    price?: string;
}

export default function DomainChecker() {
    const [inputValue, setInputValue] = useState("");
    const [selectedTld, setSelectedTld] = useState(".com");
    const [results, setResults] = useState<DomainResult[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    // Simulated domain check (replace with real API call)
    const checkDomain = useCallback(async (domain: string) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));

        // Mock logic: ~40% available, 55% taken, 5% error
        const rand = Math.random();
        if (rand < 0.05) return { domain, status: "error" as DomainStatus };
        if (rand < 0.45) return { domain, status: "available" as DomainStatus, price: "৳999/yr" };
        return { domain, status: "taken" as DomainStatus };
    }, []);

    const handleSearch = async () => {
        const name = inputValue.trim().toLowerCase();
        if (!name) return;

        // Validate domain name format
        if (!/^[a-z0-9-]+$/.test(name) || name.startsWith("-") || name.endsWith("-")) {
            setResults([{ domain: `${name}${selectedTld}`, status: "error" }]);
            return;
        }

        setIsChecking(true);
        setResults([]);

        // Check selected TLD + popular alternatives
        const tldsToCheck = [selectedTld, ...POPULAR_TLDS.filter((t) => t !== selectedTld)].slice(0, 6);

        const checks = tldsToCheck.map((tld) => checkDomain(`${name}${tld}`));
        const resolved = await Promise.all(checks);
        setResults(resolved);
        setIsChecking(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    const getStatusIcon = (status: DomainStatus) => {
        switch (status) {
            case "checking":
                return <Loader2 size={18} className="animate-spin text-[#45CFFF]" />;
            case "available":
                return <CheckCircle2 size={18} className="text-[#22C55E]" />;
            case "taken":
                return <XCircle size={18} className="text-[#EF4444]" />;
            case "error":
                return <AlertCircle size={18} className="text-[#F59E0B]" />;
            default:
                return <Search size={18} className="text-[#8b95ad] dark:text-[#7C8AAD]" />;
        }
    };

    const getStatusText = (status: DomainStatus) => {
        switch (status) {
            case "checking":
                return "Checking...";
            case "available":
                return "Available";
            case "taken":
                return "Taken";
            case "error":
                return "Error";
            default:
                return "Enter a domain";
        }
    };

    const getStatusColor = (status: DomainStatus) => {
        switch (status) {
            case "available":
                return "text-[#22C55E] dark:text-[#22C55E]";
            case "taken":
                return "text-[#EF4444] dark:text-[#EF4444]";
            case "error":
                return "text-[#F59E0B] dark:text-[#F59E0B]";
            default:
                return "text-[#8b95ad] dark:text-[#7C8AAD]";
        }
    };

    return (
        <section className="relative bg-white px-5 py-20 sm:px-8 md:px-16 dark:bg-[#060B14]">
            {/* ambient glow */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(800px 400px at 50% 0%, rgba(69,207,255,0.08), transparent 60%)",
                }}
            />

            <div className="relative mx-auto max-w-7xl">
                {/* heading */}
                <div className="mx-auto max-w-2xl text-center">
                    <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                        <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                        Domain Search
                    </span>
                    <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                        Find your perfect domain name.
                    </h2>
                    <p className="mt-4 text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                        Check availability instantly across popular extensions. Free SSL & privacy protection included.
                    </p>
                </div>

                {/* search form */}
                <div className="mt-12 mx-auto max-w-3xl">
                    <div className="relative flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 flex items-center">
                            <label htmlFor="domain-input" className="sr-only">
                                Domain name
                            </label>
                            <input
                                id="domain-input"
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value.replace(/[^a-z0-9-]/gi, "").toLowerCase())}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter your domain name"
                                className="w-full h-14 pl-5 pr-12 rounded-[10px] border border-black/10 bg-white text-[1rem] font-medium text-[#1a1f36] placeholder:text-[#8b95ad] focus:outline-none focus:border-[#45CFFF]/50 focus:ring-2 focus:ring-[#45CFFF]/20 transition-all duration-200 dark:border-white/10 dark:bg-[#0F1E3D] dark:text-white dark:placeholder:text-[#7C8AAD]"
                                disabled={isChecking}
                            />
                            <span className="absolute right-4 text-[#8b95ad] dark:text-[#7C8AAD] font-mono text-[0.9rem]">
                                {selectedTld}
                            </span>
                        </div>

                        <select
                            value={selectedTld}
                            onChange={(e) => setSelectedTld(e.target.value)}
                            className="h-14 px-5 rounded-[10px] border border-black/10 bg-white text-[0.9rem] font-medium text-[#1a1f36] focus:outline-none focus:border-[#45CFFF]/50 focus:ring-2 focus:ring-[#45CFFF]/20 transition-all duration-200 dark:border-white/10 dark:bg-[#0F1E3D] dark:text-white"
                            disabled={isChecking}
                        >
                            {POPULAR_TLDS.map((tld) => (
                                <option key={tld} value={tld}>
                                    {tld}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleSearch}
                            disabled={isChecking || !inputValue.trim()}
                            className="h-14 px-8 rounded-[10px] bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white font-semibold text-[0.95rem] shadow-[0_10px_30px_rgba(30,86,224,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(30,86,224,0.5)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#45CFFF]/50"
                        >
                            {isChecking ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={18} className="animate-spin" />
                                    Checking...
                                </span>
                            ) : (
                                "Search"
                            )}
                        </button>
                    </div>

                    {/* TLD quick picks */}
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {POPULAR_TLDS.slice(0, 8).map((tld) => (
                            <button
                                key={tld}
                                type="button"
                                onClick={() => {
                                    setSelectedTld(tld);
                                    if (inputValue.trim()) handleSearch();
                                }}
                                className={`px-3 py-1.5 rounded-full text-[0.75rem] font-mono font-medium transition-all duration-200 ${selectedTld === tld
                                        ? "bg-[#45CFFF]/15 text-[#45CFFF] border border-[#45CFFF]/30"
                                        : "bg-black/[0.03] text-[#8b95ad] hover:bg-black/[0.06] dark:bg-white/[0.03] dark:text-[#7C8AAD] dark:hover:bg-white/[0.06]"
                                    }`}
                            >
                                {tld}
                            </button>
                        ))}
                    </div>
                </div>

                {/* results */}
                {results.length > 0 && (
                    <div className="mt-10 mx-auto max-w-3xl">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {results.map((result) => (
                                <div
                                    key={result.domain}
                                    className={`relative rounded-2xl border p-5 transition-all duration-300 ${result.status === "available"
                                            ? "border-[#22C55E]/30 bg-[#22C55E]/5 dark:border-[#22C55E]/30 dark:bg-[#22C55E]/5"
                                            : result.status === "taken"
                                                ? "border-[#EF4444]/30 bg-[#EF4444]/5 dark:border-[#EF4444]/30 dark:bg-[#EF4444]/5"
                                                : result.status === "error"
                                                    ? "border-[#F59E0B]/30 bg-[#F59E0B]/5 dark:border-[#F59E0B]/30 dark:bg-[#F59E0B]/5"
                                                    : "border-black/8 bg-white dark:border-white/[0.08] dark:bg-[#0F1E3D]/50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 dark:bg-[#0F1E3D]/80">
                                            {getStatusIcon(result.status)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-sora text-[1rem] font-semibold text-[#1a1f36] truncate dark:text-white">
                                                {result.domain}
                                            </p>
                                            <p className={`font-mono text-[0.7rem] uppercase tracking-[0.12em] ${getStatusColor(result.status)}`}>
                                                {getStatusText(result.status)}
                                            </p>
                                        </div>
                                    </div>

                                    {result.status === "available" && result.price && (
                                        <div className="mt-4 pt-4 border-t border-black/8 dark:border-white/[0.08]">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-[0.8rem] text-[#8b95ad] dark:text-[#7C8AAD]">
                                                    Starting at
                                                </span>
                                                <span className="font-sora text-[1.1rem] font-bold text-[#1a1f36] dark:text-white">
                                                    {result.price}
                                                </span>
                                            </div>
                                            <button
                                                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] px-4 py-2.5 text-[0.85rem] font-semibold text-white shadow-[0_8px_24px_rgba(30,86,224,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(30,86,224,0.5)]"
                                            >
                                                Register
                                            </button>
                                        </div>
                                    )}

                                    {result.status === "taken" && (
                                        <div className="mt-4 pt-4 border-t border-black/8 dark:border-white/[0.08]">
                                            <button
                                                className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-2.5 text-[0.85rem] font-semibold text-[#1a1f36] hover:bg-black/[0.06] dark:border-white/12 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06]"
                                            >
                                                View Alternatives
                                            </button>
                                        </div>
                                    )}

                                    {result.status === "error" && (
                                        <div className="mt-4 pt-4 border-t border-black/8 dark:border-white/[0.08]">
                                            <p className="text-center text-[0.8rem] text-[#F59E0B] dark:text-[#F59E0B]">
                                                Could not check. Please try again.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* features hint */}
                <div className="mt-14 grid gap-6 sm:grid-cols-3">
                    {[
                        { icon: "🔒", title: "Free SSL Certificate", desc: "Auto-provisioned Let's Encrypt SSL on every domain." },
                        { icon: "🛡️", title: "WHOIS Privacy", desc: "Your personal info stays hidden from public records." },
                        { icon: "⚡", title: "Instant Setup", desc: "DNS propagates in seconds, not hours." },
                    ].map((item, i) => (
                        <div key={i} className="text-center p-4 rounded-2xl border border-black/8 bg-white/50 dark:border-white/[0.08] dark:bg-[#0F1E3D]/50">
                            <span className="mb-3 inline-block text-3xl">{item.icon}</span>
                            <h4 className="font-sora text-[1rem] font-bold text-[#1a1f36] dark:text-white">{item.title}</h4>
                            <p className="mt-1 text-[0.85rem] leading-relaxed text-[#8b95ad] dark:text-[#7C8AAD]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}