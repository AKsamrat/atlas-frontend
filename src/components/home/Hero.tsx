import { useEffect, useRef } from "react";


/**
 * Entra Global Tech — Hero Section
 * React + TypeScript + Tailwind
 *
 * Signature element: a hub-and-spoke "network" panel (echoing the logo's
 * own globe/node motif) where a central "Entra Hub" node connects out to
 * the four service lines. An ambient particle-network canvas runs behind
 * the whole hero for the same reason — it's the brand's own visual
 * language, not decoration.
 *
 * Setup notes (see README.md in this folder):
 * 1. Add the Google Fonts <link> tags (Sora, Inter, JetBrains Mono) to
 *    your index.html <head>, or use next/font if you're on Next.js.
 * 2. Add the small keyframes + color tokens from tailwind.config snippet
 *    (README.md) to your tailwind.config.ts.
 */

interface ServiceNode {
    id: string;
    title: string;
    meta: string;
    /** position classes for the floating node card inside the network panel */
    posClassName: string;
}



const NODES: ServiceNode[] = [
    { id: "hosting", title: "Domain & Hosting", meta: "UPTIME · SETUP", posClassName: "top-[2%] left-[6%]" },
    { id: "webdev", title: "Web Development", meta: "SITES · APPS", posClassName: "top-[8%] right-0" },
    { id: "design", title: "Graphic Design", meta: "T-SHIRTS · FLYERS · BROCHURES", posClassName: "bottom-[6%] left-0" },
    { id: "marketing", title: "Digital Marketing", meta: "FB & IG GROWTH", posClassName: "bottom-0 right-[8%]" },
];



interface Point {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
}

/** Ambient drifting particle network behind the whole hero. */
function useAmbientNetwork(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let width = 0;
        let height = 0;
        let points: Point[] = [];
        let rafId = 0;

        const resize = () => {
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            const count = Math.max(28, Math.floor((width * height) / 32000));
            points = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                r: Math.random() * 1.4 + 0.6,
            }));
        };

        const tick = () => {
            ctx.clearRect(0, 0, width, height);
            for (const p of points) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
            }
            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const a = points[i];
                    const b = points[j];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d < 130) {
                        ctx.strokeStyle = `rgba(69,207,255,${0.16 * (1 - d / 130)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
            for (const p of points) {
                ctx.fillStyle = "rgba(69,207,255,0.55)";
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
            if (!reduceMotion) rafId = requestAnimationFrame(tick);
        };

        resize();
        tick();
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(rafId);
        };
    }, [canvasRef]);
}

/** Draws hub -> node connector lines + traveling pulse dots inside the network panel. */
function useHubLinks(
    panelRef: React.RefObject<HTMLDivElement | null>,
    hubRef: React.RefObject<HTMLDivElement | null>,
    svgRef: React.RefObject<SVGSVGElement | null>
) {
    useEffect(() => {
        const panel = panelRef.current;
        const hub = hubRef.current;
        const svg = svgRef.current;
        if (!panel || !hub || !svg) return;

        const draw = () => {
            const nodeEls = panel.querySelectorAll<HTMLDivElement>("[data-node]");
            Array.from(svg.querySelectorAll("line, circle.pulse-dot")).forEach((el) => el.remove());

            const panelRect = panel.getBoundingClientRect();
            const hubRect = hub.getBoundingClientRect();
            const hx = hubRect.left + hubRect.width / 2 - panelRect.left;
            const hy = hubRect.top + hubRect.height / 2 - panelRect.top;

            nodeEls.forEach((node, i) => {
                const r = node.getBoundingClientRect();
                const nx = r.left + r.width / 2 - panelRect.left;
                const ny = r.top + r.height / 2 - panelRect.top;

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", String(hx));
                line.setAttribute("y1", String(hy));
                line.setAttribute("x2", String(nx));
                line.setAttribute("y2", String(ny));
                line.setAttribute("stroke", "url(#lineGrad)");
                line.setAttribute("stroke-width", "1.3");
                line.setAttribute("opacity", "0.55");
                svg.appendChild(line);

                const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dot.setAttribute("r", "3");
                dot.setAttribute("class", "pulse-dot");
                dot.setAttribute("fill", "#45CFFF");
                const anim = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
                anim.setAttribute("dur", `${2.4 + i * 0.4}s`);
                anim.setAttribute("repeatCount", "indefinite");
                anim.setAttribute("path", `M${hx},${hy} L${nx},${ny}`);
                dot.appendChild(anim);
                svg.appendChild(dot);
            });
        };

        const raf = requestAnimationFrame(draw);
        window.addEventListener("resize", draw);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", draw);
        };
    }, [panelRef, hubRef, svgRef]);
}

export default function EntraHero() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const hubRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    useAmbientNetwork(canvasRef as React.RefObject<HTMLCanvasElement>);
    useHubLinks(panelRef, hubRef, svgRef);

    return (
        <div className="relative min-h-screen bg-white font-inter text-[#1a1f36] overflow-hidden dark:bg-[#060B14] dark:text-white">
            {/* ambient background gradients */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(1100px 550px at 82% 8%, rgba(46,139,240,0.22), transparent 60%), radial-gradient(900px 500px at 10% 95%, rgba(69,207,255,0.10), transparent 55%), linear-gradient(180deg, #060B14 0%, #081020 100%)",
                }}
            />
            <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-55" />

            <div className="relative z-10 flex min-h-screen flex-col">


                {/* MAIN CONTENT */}
                <div className="mx-auto flex w-full max-w-7xl flex-1 items-center py-10">
                    <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-[1.05fr_0.95fr]">
                        {/* COPY */}
                        <div>
                            <div className="mb-5 flex items-center gap-3 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                                <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                                Innovate · Connect · Empower
                            </div>

                            <h1 className="max-w-[15ch] font-sora text-[2.4rem] font-bold leading-[1.06] tracking-tight sm:text-[3rem] lg:text-[3.85rem]">
                                Your entire online presence,{" "}
                                <span className="bg-gradient-to-r from-[#45CFFF] via-[#2E8BF0] to-[#1E56E0] bg-clip-text text-transparent">
                                    run from one hub.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-[46ch] text-[1.05rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                                Entra Global Tech builds and hosts your website, designs everything from your logo to your next{" "}
                                <b className="font-semibold text-[#1a1f36] dark:text-white">t-shirt, flyer, or brochure</b>, and runs the{" "}
                                <b className="font-semibold text-[#1a1f36] dark:text-white">Facebook & Instagram campaigns</b> that get you seen. One
                                team, every touchpoint connected.
                            </p>

                            <div className="mt-9 flex flex-wrap gap-4">
                                <a
                                    href="#contact"
                                    className="inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] px-7 py-[15px] text-[0.95rem] font-semibold shadow-[0_10px_30px_rgba(30,86,224,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(30,86,224,0.5)]"
                                >
                                    Start a Project →
                                </a>
                                <a
                                    href="#services"
                                    className="inline-flex items-center gap-2 rounded-[10px] border border-black/10 bg-black/[0.03] px-7 py-[15px] text-[0.95rem] font-semibold transition-all duration-300 hover:bg-black/[0.06] hover:border-black/20 dark:border-white/[0.12] dark:bg-white/[0.02] dark:hover:bg-white/[0.06] dark:hover:border-white/20"
                                >
                                    See What We Do
                                </a>
                            </div>

                            <div className="mt-[52px] flex flex-wrap gap-8 border-t border-black/8 pt-7 dark:border-white/[0.09] md:gap-11">
                                <div>
                                    <b className="block font-sora text-2xl">4-in-1</b>
                                    <span className="font-mono text-[0.8rem] text-[#8b95ad] dark:text-[#7C8AAD]">SERVICES UNDER ONE ROOF</span>
                                </div>
                                <div>
                                    <b className="block font-sora text-2xl">24/7</b>
                                    <span className="font-mono text-[0.8rem] text-[#8b95ad] dark:text-[#7C8AAD]">HOSTING & SUPPORT</span>
                                </div>
                                <div>
                                    <b className="block font-sora text-2xl">100%</b>
                                    <span className="font-mono text-[0.8rem] text-[#8b95ad] dark:text-[#7C8AAD]">CUSTOM DESIGN WORK</span>
                                </div>
                            </div>
                        </div>

                        {/* NETWORK PANEL */}
                        <div ref={panelRef} className="relative order-first h-[380px] md:order-none md:h-[480px]">
                            <svg ref={svgRef} className="absolute inset-0 z-[2] h-full w-full overflow-visible">
                                <defs>
                                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#45CFFF" />
                                        <stop offset="100%" stopColor="#1E56E0" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div
                                ref={hubRef}
                                className="absolute left-1/2 top-1/2 z-[3] flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 animate-hub-pulse items-center justify-center rounded-full text-center font-sora text-[0.95rem] font-bold leading-tight text-[#060B14]"
                                style={{
                                    background: "radial-gradient(circle at 35% 30%, #45CFFF, #1E56E0 70%)",
                                }}
                            >
                                ENTRA
                                <br />
                                HUB
                            </div>

                            {NODES.map((node) => (
                                <div
                                    key={node.id}
                                    data-node
                                    className={`absolute z-[3] flex items-center gap-2.5 rounded-xl border border-black/8 bg-white/90 px-[18px] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-md dark:border-white/[0.09] dark:bg-[#0F1E3D]/75 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${node.posClassName}`}
                                >
                                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#45CFFF]" />
                                    <div>
                                        <b className="block font-sora text-[0.86rem] font-semibold text-[#1a1f36] dark:text-white">{node.title}</b>
                                        <span className="font-mono text-[0.68rem] tracking-wide text-[#8b95ad] dark:text-[#7C8AAD]">{node.meta}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SERVICE STRIP */}
                {/* <div
          id="services"
          className="relative z-10 grid grid-cols-2 border-t border-white/[0.09] bg-[#060B14]/60 md:grid-cols-4"
        >
          {SERVICE_STRIP.map((item, i) => (
            <div
              key={item.title}
              className={`border-white/[0.09] px-4 py-[22px] sm:px-6 md:px-8 ${
                i % 2 === 0 ? "border-r" : "md:border-r"
              } ${i < 2 ? "border-b md:border-b-0" : ""} ${i === SERVICE_STRIP.length - 1 ? "md:border-r-0" : ""}`}
            >
              <div className="font-mono text-[0.68rem] tracking-wide text-[#45CFFF]">{item.tag}</div>
              <h4 className="mt-1.5 font-sora text-[0.95rem] font-semibold text-white">{item.title}</h4>
              <p className="mt-1 text-[0.78rem] leading-relaxed text-[#7C8AAD]">{item.description}</p>
            </div>
          ))}
        </div> */}
            </div>
        </div >
    );
}