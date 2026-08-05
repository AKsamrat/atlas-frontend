import { useState, useCallback, useEffect, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useContent } from "../../context/ContentContext";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Testimonials (Home section)                   */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)         */
/* ------------------------------------------------------------------ */

export default function Testimonials() {
    const { content } = useContent();
    const TESTIMONIALS = content.testimonials;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(() => {
        if (typeof window === "undefined") return 3;
        if (window.innerWidth >= 1024) return 3; // lg
        if (window.innerWidth >= 768) return 2;  // md
        return 1;                                // mobile
    });
    const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isHoveredRef = useRef(false);
    const maxIndexRef = useRef(TESTIMONIALS.length - (typeof window === "undefined" ? 3 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1));

    // Cards per view based on screen size
    const getCardsPerView = useCallback(() => {
        if (typeof window === "undefined") return 3;
        if (window.innerWidth >= 1024) return 3; // lg
        if (window.innerWidth >= 768) return 2;  // md
        return 1;                                // mobile
    }, []);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? maxIndexRef.current : prev - 1));
    }, []);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === maxIndexRef.current ? 0 : prev + 1));
    }, []);

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(Math.max(0, Math.min(index, maxIndexRef.current)));
    }, []);

    // Auto-play — stable interval that reads hover state via ref
    useEffect(() => {
        const tick = () => {
            if (!isHoveredRef.current) {
                setCurrentIndex((prev) => (prev >= maxIndexRef.current ? 0 : prev + 1));
            }
        };
        autoPlayRef.current = setInterval(tick, 4000);
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, []);

    // Update maxIndex and cardsPerView on resize
    useEffect(() => {
        const handleResize = () => {
            const newCardsPerView = getCardsPerView();
            setCardsPerView(newCardsPerView);
            maxIndexRef.current = TESTIMONIALS.length - newCardsPerView;
            setCurrentIndex((prev) => Math.min(prev, Math.max(0, maxIndexRef.current)));
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [getCardsPerView]);

    return (
        <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 md:px-16 dark:bg-[#060B14]" onMouseEnter={() => { isHoveredRef.current = true; }} onMouseLeave={() => { isHoveredRef.current = false; }}>
            {/* ambient glow */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(800px 400px at 80% 30%, rgba(46,139,240,0.08), transparent 55%)",
                }}
            />

            <div className="relative mx-auto max-w-7xl">
                {/* heading */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                        <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                        Testimonials
                    </span>
                    <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                        Hear the brands we've helped grow.
                    </h2>
                    <p className="mt-4 text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                        Real feedback from real businesses — here's what our partners say about working with Entra.
                    </p>
                </div>

                {/* slider */}
                <div className="mt-14 relative">
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{
                            transform: `translateX(-${(currentIndex / Math.max(1, TESTIMONIALS.length - cardsPerView)) * 100}%)`,
                        }}
                    >
                        {TESTIMONIALS.map((t) => (
                            <div
                                key={t.name}
                                className="w-full flex-shrink-0 px-3 sm:px-4"
                                style={{
                                    width: `${100 / cardsPerView}%`,
                                    maxWidth: `${100 / cardsPerView}%`,
                                }}
                            >
                                <div className="group relative flex flex-col h-full rounded-2xl border border-black/8 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#45CFFF]/30 hover:shadow-[0_16px_40px_rgba(46,139,240,0.12)] dark:border-white/[0.08] dark:bg-gradient-to-b dark:from-[#0F1E3D] dark:to-[#0B1730]">
                                    {/* quote icon */}
                                    <Quote
                                        size={32}
                                        className="mb-4 text-[#45CFFF]/20 transition-colors group-hover:text-[#45CFFF]/35"
                                    />

                                    {/* stars */}
                                    <div className="mb-4 flex gap-1">
                                        {Array.from({ length: t.stars }).map((_, i) => (
                                            <Star key={i} size={14} className="fill-[#45CFFF] text-[#45CFFF]" />
                                        ))}
                                    </div>

                                    {/* text */}
                                    <p className="flex-1 text-[0.92rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                                        "{t.text}"
                                    </p>

                                    {/* author */}
                                    <div className="mt-6 flex items-center gap-3 border-t border-black/6 pt-5 dark:border-white/[0.06]">
                                        {/* avatar */}
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0]">
                                            {t.image ? (
                                                <img
                                                    src={t.image.startsWith("http") ? t.image : `${import.meta.env.VITE_API_URL?.replace("/api", "")}/storage/${t.image}`}
                                                    alt={t.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center font-sora text-sm font-bold text-[#060B14]">
                                                    {t.name.split(" ").map((n) => n[0]).join("")}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <b className="block font-sora text-[0.88rem] font-semibold text-[#1a1f36] dark:text-white">
                                                {t.name}
                                            </b>
                                            <span className="text-[0.78rem] text-[#8b95ad] dark:text-[#7C8AAD]">{t.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* navigation arrows */}
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            onClick={goToPrev}
                            className="group flex h-12 w-12 items-center justify-center rounded-full border border-black/8 bg-white transition-all duration-300 hover:border-[#45CFFF]/30 hover:bg-[#45CFFF]/10 hover:shadow-[0_4px_16px_rgba(46,139,240,0.12)] dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:border-[#45CFFF]/30 dark:hover:bg-[#45CFFF]/10"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft size={20} className="text-[#1a1f36] dark:text-white transition-transform group-hover:-translate-x-0.5" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="group flex h-12 w-12 items-center justify-center rounded-full border border-black/8 bg-white transition-all duration-300 hover:border-[#45CFFF]/30 hover:bg-[#45CFFF]/10 hover:shadow-[0_4px_16px_rgba(46,139,240,0.12)] dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:border-[#45CFFF]/30 dark:hover:bg-[#45CFFF]/10"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight size={20} className="text-[#1a1f36] dark:text-white transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>

                    {/* dots indicator */}
                    <div className="mt-6 flex items-center justify-center gap-2">
                        {Array.from({ length: Math.max(1, TESTIMONIALS.length - cardsPerView + 1) }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToSlide(i)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex
                                    ? "bg-[#45CFFF] w-6 shadow-[0_0_8px_rgba(69,207,255,0.5)]"
                                    : "bg-black/10 hover:bg-black/20 dark:bg-white/[0.15] dark:hover:bg-white/[0.3]"
                                    }`}
                                aria-label={`Go to testimonial group ${i + 1}`}
                                aria-current={i === currentIndex ? "true" : "false"}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
