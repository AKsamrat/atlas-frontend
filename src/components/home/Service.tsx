import { ArrowRight, CheckCircle2, Code2, Globe2, Palette, Rocket } from "lucide-react";
import { useContent, type ServiceData as ServiceDataType } from "../../context/ContentContext";

/**
 * Entra Global Tech — Detailed Services section
 * React + TypeScript + Tailwind
 *
 * Expands the four service lines from the Hero's bottom strip and the
 * Navbar's dropdowns into full cards. Anchors (`id`) match the hrefs
 * already used in Navbar.tsx (#hosting, #webdev, #design, #marketing) so
 * the nav links scroll straight to the right card.
 *
 * Card signature: an icon badge that breaks out of the card's top edge,
 * a giant near-invisible watermark of the same icon in the background,
 * and a gradient top edge — all in the same navy/cyan/blue system as
 * EntraHero.tsx / Navbar.tsx (Sora / Inter / JetBrains Mono).
 */

type LucideIcon = typeof Globe2;

interface ServiceItem {
    title: string;
    icon: LucideIcon;
}

interface Service {
    id: string;
    tag: string;
    title: string;
    description: string;
    icon: LucideIcon;
    items: ServiceItem[];
}

const ICON_MAP: Record<string, LucideIcon> = { Globe2, Code2, Palette, Rocket };

function mapContextService(s: ServiceDataType): Service {
    const Icon = ICON_MAP[s.iconName] || Globe2;
    return {
        id: s.id,
        tag: s.tag,
        title: s.title,
        description: s.description,
        icon: Icon,
        items: s.items.map((it) => ({ title: it.title, icon: CheckCircle2 })),
    };
}

function ServiceCard({ service }: { service: Service }) {
    const Icon = service.icon;
    return (
        <div
            id={service.id}
            className="group relative scroll-mt-24 overflow-hidden rounded-[28px] border border-black/8 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#45CFFF]/40 hover:shadow-[0_28px_70px_rgba(46,139,240,0.22)] dark:border-white/[0.09] dark:bg-gradient-to-b dark:from-[#0F1E3D] dark:to-[#0B1730] dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
        >
            {/* gradient top edge */}
            <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#45CFFF] via-[#2E8BF0] to-[#1E56E0]" />

            {/* giant watermark icon, purely decorative */}
            <Icon
                aria-hidden
                className="pointer-events-none absolute -right-7 -top-7 h-40 w-40 rotate-12 text-black/[0.03] transition-transform duration-500 ease-out group-hover:rotate-3 group-hover:scale-110 dark:text-white/[0.035]"
                strokeWidth={1}
            />

            {/* category pill */}
            <span className="absolute right-6 top-7 z-10 rounded-full border border-black/8 bg-black/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#8b95ad] dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-[#7C8AAD]">
                {service.tag}
            </span>

            {/* icon badge, breaks out of the card's top edge */}
            <span className="relative z-10 mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] text-[#060B14] shadow-[0_12px_30px_rgba(46,139,240,0.45)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-3">
                <Icon size={26} strokeWidth={2.2} />
            </span>

            <h3 className="relative z-10 font-sora text-[1.35rem] font-bold text-[#1a1f36] dark:text-white">{service.title}</h3>
            <p className="relative z-10 mt-3 text-[0.95rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">{service.description}</p>

            <div className="relative z-10 mt-6 flex flex-wrap gap-2">
                {service.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                        <span
                            key={item.title}
                            className="inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-black/[0.02] px-3 py-1.5 text-[0.78rem] font-medium text-[#1a1f36] transition-colors group-hover:border-[#45CFFF]/40 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#DCE6F5] dark:group-hover:border-white/[0.14]"
                        >
                            <ItemIcon size={13} className="flex-shrink-0 text-[#45CFFF]" />
                            {item.title}
                        </span>
                    );
                })}
            </div>

            <a
                href="#contact"
                className="relative z-10 mt-7 inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-black/[0.04] px-4 py-2 font-inter text-[0.85rem] font-semibold text-[#1a1f36] transition-all duration-300 hover:gap-2.5 hover:bg-gradient-to-r hover:from-[#45CFFF] hover:to-[#1E56E0] hover:text-[#060B14] dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white dark:hover:bg-gradient-to-r dark:hover:from-[#45CFFF] dark:hover:to-[#1E56E0] dark:hover:text-[#060B14]"
            >
                Get started
                <ArrowRight size={15} />
            </a>
        </div>
    );
}

export default function Services() {
    const { content } = useContent();
    const services = content.services.map(mapContextService);

    return (
        <section className="relative bg-white px-5 py-20 sm:px-8 md:px-16 dark:bg-[#060B14]">
            {/* faint ambient glow, consistent with the Hero's background treatment */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: "radial-gradient(900px 500px at 12% 0%, rgba(46,139,240,0.12), transparent 55%)",
                }}
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                        <span className="inline-block h-px w-7 bg-[#45CFFF]" />
                        What We Do
                    </div>
                    <h2 className="mt-5 font-sora text-[2rem] font-bold leading-tight text-[#1a1f36] sm:text-[2.5rem] dark:text-white">
                        Everything your brand needs, handled in one place.
                    </h2>
                    <p className="mt-4 text-[1.02rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                        Four services, one team — so your hosting, your site, your designs and your social presence all move
                        together instead of living in four different inboxes.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-4">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
}