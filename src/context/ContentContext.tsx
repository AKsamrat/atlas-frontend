/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
    servicesApi,
    partnersApi,
    testimonialsApi,
    contactApi,
    domainPlansApi,
    servicePackagesApi,
} from "../services";

/* ------------------------------------------------------------------ */
/*  ContentContext — Central store for editable homepage content        */
/*  Fetches from Laravel API on mount, falls back to localStorage      */
/* ------------------------------------------------------------------ */

export interface ServiceItem {
    title: string;
}

export interface ServiceData {
    id: string;
    tag: string;
    title: string;
    description: string;
    iconName: string;
    items: ServiceItem[];
}

export interface PartnerData {
    name: string;
    iconName: string;
    color: string;
}

export interface TestimonialData {
    name: string;
    role: string;
    stars: number;
    text: string;
}

export interface ContactInfoData {
    phone: string;
    email: string;
    address: string;
    tagline: string;
    socialFacebook: string;
    socialInstagram: string;
    socialLinkedin: string;
    socialTwitter: string;
}

export interface DomainPlanData {
    name: string;
    price: string;
    period: string;
    tagline: string;
    highlight: boolean;
    features: string[];
    cta?: string;
}

export interface PackagePlanData {
    name: string;
    price: string;
    period: string;
    tagline: string;
    highlight: boolean;
    features: string[];
    cta?: string;
}

export type ServicePackages = Record<string, PackagePlanData[]>;

export interface SiteContent {
    services: ServiceData[];
    partners: PartnerData[];
    testimonials: TestimonialData[];
    contact: ContactInfoData;
    domainPlans: DomainPlanData[];
    servicePackages: ServicePackages;
}

interface ContentContextValue {
    content: SiteContent;
    loading: boolean;
    refreshContent: () => Promise<void>;
    updateServices: (services: ServiceData[]) => void;
    updatePartners: (partners: PartnerData[]) => void;
    updateTestimonials: (testimonials: TestimonialData[]) => void;
    updateContact: (contact: ContactInfoData) => void;
    updateDomainPlans: (plans: DomainPlanData[]) => void;
    updateServicePackages: (key: string, plans: PackagePlanData[]) => void;
}

const STORAGE_KEY = "entra-site-content";

const DEFAULT_CONTENT: SiteContent = {
    services: [
        {
            id: "hosting",
            tag: "Hosting",
            title: "Domain & Hosting",
            description: "We register your domain and keep your site fast, secure and online — day one and every day after.",
            iconName: "Globe2",
            items: [
                { title: "Domain registration & renewal" },
                { title: "SSL certificates & security" },
                { title: "24/7 uptime monitoring" },
                { title: "Business email hosting" },
            ],
        },
        {
            id: "webdev",
            tag: "Web Development",
            title: "Web Development",
            description: "Custom websites built around what your business actually needs — not a generic template.",
            iconName: "Code2",
            items: [
                { title: "Custom business websites" },
                { title: "E-commerce & online stores" },
                { title: "Landing pages that convert" },
                { title: "Ongoing updates & maintenance" },
            ],
        },
        {
            id: "design",
            tag: "Graphic Design",
            title: "All Kinds of Design",
            description: "From merch to marketing collateral, every piece designed to look the part.",
            iconName: "Palette",
            items: [
                { title: "T-Shirt Design" },
                { title: "Flyer Design" },
                { title: "Brochure Design" },
                { title: "Logo & Branding" },
            ],
        },
        {
            id: "marketing",
            tag: "Digital Marketing",
            title: "Digital Marketing",
            description: "We run the campaigns that get your Facebook and Instagram pages seen by real people.",
            iconName: "Rocket",
            items: [
                { title: "Facebook Marketing" },
                { title: "Instagram Marketing" },
                { title: "Likes & Followers" },
                { title: "Boosted Post Campaigns" },
            ],
        },
    ],
    partners: [
        { name: "GreenLeaf Cosmetics", iconName: "Building2", color: "#22C55E" },
        { name: "StyleBD Fashion", iconName: "Award", color: "#EC4899" },
        { name: "TechNova Solutions", iconName: "TrendingUp", color: "#3B82F6" },
        { name: "Dhaka Deli", iconName: "Users", color: "#F59E0B" },
        { name: "LogiChain Ltd", iconName: "Server", color: "#8B5CF6" },
        { name: "EduPath", iconName: "Globe2", color: "#06B6D4" },
        { name: "MediCare Plus", iconName: "Shield", color: "#EF4444" },
        { name: "AutoParts BD", iconName: "HardDrive", color: "#6366F1" },
        { name: "FreshMart", iconName: "Building2", color: "#14B8A6" },
        { name: "CodeCraft Studio", iconName: "Award", color: "#F97316" },
    ],
    testimonials: [
        {
            name: "Rafiq Hasan",
            role: "CEO, GreenLeaf Cosmetics",
            stars: 5,
            text: "Entra built our entire online presence — website, logo, even our Facebook ads. We went from zero online visibility to 3× our monthly orders in under three months.",
        },
        {
            name: "Sumaiya Akter",
            role: "Founder, StyleBD Fashion",
            stars: 5,
            text: "The team handles our hosting, e-commerce site and social media campaigns. Having everything under one roof saved us countless hours and headaches.",
        },
        {
            name: "Tanvir Rahman",
            role: "Director, TechNova Solutions",
            stars: 5,
            text: "Fast, professional and genuinely helpful. They delivered a complex web app ahead of schedule and the ongoing support has been fantastic.",
        },
        {
            name: "Nusrat Jahan",
            role: "Owner, Dhaka Deli",
            stars: 5,
            text: "Our restaurant's online orders doubled after Entra redesigned our site and set up local SEO. The team is responsive and actually cares.",
        },
        {
            name: "Arif Mahmud",
            role: "CTO, LogiChain Ltd",
            stars: 5,
            text: "Reliable hosting, clean code, and they're always just a message away. Rare to find an agency that delivers on every promise.",
        },
        {
            name: "Meherun Nesa",
            role: "Marketing Lead, EduPath",
            stars: 5,
            text: "Entra's digital marketing team grew our student signups by 40% in two quarters. Data-driven, creative, and transparent reporting.",
        },
    ],
    contact: {
        phone: "+88 01927001333",
        email: "entraglobaltech@gmail.com",
        address: "level-5, Hazi Asraf Ali Market, Shewrapara, Dhaka, Bangladesh",
        tagline: "Free consultation on your first project",
        socialFacebook: "#",
        socialInstagram: "#",
        socialLinkedin: "#",
        socialTwitter: "#",
    },
    domainPlans: [
        {
            name: "Starter",
            price: "999",
            period: "/mo",
            tagline: "Perfect for personal sites & blogs",
            highlight: false,
            features: [
                "1 website hosted",
                "5 GB SSD storage",
                "Free SSL certificate",
                "1 business email",
                "Weekly backups",
            ],
        },
        {
            name: "Business",
            price: "2,499",
            period: "/mo",
            tagline: "Best for growing businesses",
            highlight: true,
            features: [
                "5 websites hosted",
                "25 GB SSD storage",
                "Free SSL certificates",
                "5 business emails",
                "Daily backups",
                "Priority support",
            ],
        },
        {
            name: "Enterprise",
            price: "5,999",
            period: "/mo",
            tagline: "Unlimited power & flexibility",
            highlight: false,
            features: [
                "Unlimited websites",
                "100 GB SSD storage",
                "Wildcard SSL included",
                "Unlimited emails",
                "Real-time backups",
                "Dedicated account manager",
            ],
        },
    ],
    servicePackages: {
        "web-development": [
            { name: "Landing Page", price: "4,999", period: "", tagline: "Single-page presence for launches & promos", highlight: false, features: ["Responsive single-page design", "Mobile-first layout", "Contact form integration", "Basic SEO setup", "1 revision round"] },
            { name: "Business Website", price: "14,999", period: "", tagline: "Multi-page site that tells your full story", highlight: true, features: ["Up to 8 custom pages", "CMS-ready dashboard", "SEO-optimized structure", "Speed-optimized build", "2 revision rounds", "30-day support"] },
            { name: "E-Commerce Store", price: "29,999", period: "", tagline: "Full-featured online shop ready to sell", highlight: false, features: ["Unlimited products", "Payment gateway integration", "Inventory management", "Order tracking system", "3 revision rounds", "60-day support"] },
        ],
        "tshirt-design": [
            { name: "Basic", price: "2,999", period: "", tagline: "Perfect for small teams & events", highlight: false, features: ["1 design concept", "Front or back print", "Up to 3 colors", "Print-ready files (AI, PNG)", "1 revision round"] },
            { name: "Standard", price: "5,999", period: "", tagline: "Best for growing brands & merch", highlight: true, features: ["3 design concepts", "Front + back + sleeve", "Unlimited colors", "Print-ready + mockup files", "3 revision rounds", "Vector source file included"] },
            { name: "Premium", price: "12,999", period: "", tagline: "Full merch collection ready", highlight: false, features: ["Unlimited concepts", "All-over print support", "Specialty inks (foil, puff, glow)", "Full tech pack for manufacturers", "Unlimited revisions", "Brand style guide included"] },
        ],
        "brochure-design": [
            { name: "Bi-Fold", price: "4,999", period: "", tagline: "Classic 4-page company profile", highlight: false, features: ["4-page layout (A4 folded)", "Cover + 3 inner spreads", "Print-ready PDF + mockup", "2 revision rounds", "Stock imagery included"] },
            { name: "Tri-Fold", price: "6,999", period: "", tagline: "6-panel marketing brochure", highlight: true, features: ["6-panel layout (DL/A4 folded)", "Cover + 5 content panels", "Print-ready + digital variants", "3 revision rounds", "Custom icons/graphics", "Social media teaser cuts"] },
            { name: "Multi-Page", price: "14,999", period: "", tagline: "8-16 page product catalog", highlight: false, features: ["8-16 custom pages", "Master template system", "Data-merge ready for products", "Print + interactive PDF", "Unlimited revisions", "Source files (InDesign/Figma)"] },
        ],
        "flyer-design": [
            { name: "Basic", price: "1,999", period: "", tagline: "Single-sided promo flyer", highlight: false, features: ["1 design concept", "A5 or A6 size", "Print-ready PDF + PNG", "1 revision round", "Stock photos included"] },
            { name: "Standard", price: "3,999", period: "", tagline: "Double-sided marketing flyer", highlight: true, features: ["3 design concepts", "A5, A6, or DL size", "Front + back design", "Print-ready + mockup files", "3 revision rounds", "Custom illustrations available"] },
            { name: "Premium", price: "7,999", period: "", tagline: "Campaign flyer set (3 designs)", highlight: false, features: ["3 coordinated designs", "Multiple sizes included", "Full brand consistency", "Source files (AI/PSD)", "Unlimited revisions", "Social media variants included"] },
        ],
        "logo-branding": [
            { name: "Logo Essentials", price: "9,999", period: "", tagline: "Primary logo + basic guidelines", highlight: false, features: ["3 logo concepts", "Primary + secondary logo", "Color palette (5 colors)", "Typography pairings", "Basic usage guide (PDF)", "2 revision rounds", "PNG, SVG, EPS, PDF formats"] },
            { name: "Brand Identity", price: "19,999", period: "", tagline: "Complete visual identity system", highlight: true, features: ["5 logo concepts", "Full logo suite (primary, secondary, icon, monogram)", "Extended color system", "Typography system", "Graphic elements & patterns", "Comprehensive brand guidelines (15+ pages)", "4 revision rounds", "All source files (AI, Figma)"] },
            { name: "Brand + Collateral", price: "34,999", period: "", tagline: "Identity + launch collateral", highlight: false, features: ["Everything in Brand Identity", "Business card design (2-sided)", "Letterhead + envelope", "Email signature templates", "Social media kit", "Presentation template (15 slides)", "Unlimited revisions", "30-day post-launch support"] },
        ],
        "facebook-marketing": [
            { name: "Starter", price: "$499", period: "/month", tagline: "Perfect for small businesses testing Facebook ads.", highlight: false, features: ["Campaign setup & structure", "2 ad creatives/month", "Audience research & targeting", "Weekly performance reports", "Monthly strategy call"], cta: "Get Started" },
            { name: "Growth", price: "$999", period: "/month", tagline: "For brands ready to scale profitably.", highlight: true, features: ["Everything in Starter", "6 ad creatives/month", "Advanced funnel building", "A/B testing & optimization", "Bi-weekly strategy calls", "Pixel & CAPI setup"], cta: "Scale Now" },
            { name: "Enterprise", price: "Custom", period: "", tagline: "High-volume accounts needing dedicated management.", highlight: false, features: ["Everything in Growth", "Unlimited creatives", "Dedicated account manager", "Custom reporting dashboard", "Daily optimization", "Priority support"], cta: "Contact Sales" },
        ],
        "instagram-marketing": [
            { name: "Creator", price: "$399", period: "/month", tagline: "For personal brands & micro-influencers growing organically.", highlight: false, features: ["Content calendar & strategy", "12 feed posts + 20 stories/month", "4 Reels/month with editing", "Hashtag research & optimization", "Monthly analytics report"], cta: "Start Growing" },
            { name: "Business", price: "$899", period: "/month", tagline: "For businesses converting followers into customers.", highlight: true, features: ["Everything in Creator", "20 feed posts + 30 stories/month", "8 Reels/month + trend monitoring", "Influencer outreach (5/month)", "UGC campaign management", "Shopping tag setup & management"], cta: "Scale Business" },
            { name: "Agency", price: "Custom", period: "", tagline: "Multi-account management for agencies & enterprises.", highlight: false, features: ["Everything in Business", "Unlimited content production", "Multi-account dashboard", "White-label reporting", "Dedicated creative team", "API access for custom tools"], cta: "Contact Sales" },
        ],
        "likes-followers": [
            { name: "Starter", price: "$199", period: "/month", tagline: "Kickstart organic growth for new accounts.", highlight: false, features: ["500-1,000 real followers/month", "Niche-targeted audience", "Daily engagement actions", "Weekly growth report", "Account safety monitoring"], cta: "Start Growing" },
            { name: "Pro", price: "$399", period: "/month", tagline: "Steady growth for established brands.", highlight: true, features: ["2,000-5,000 real followers/month", "Advanced audience targeting", "Content optimization guidance", "Competitor audience analysis", "Bi-weekly strategy calls", "Priority support"], cta: "Accelerate Growth" },
            { name: "Enterprise", price: "$899", period: "/month", tagline: "Maximum velocity for high-growth companies.", highlight: false, features: ["10,000+ real followers/month", "Multi-platform coordination", "Dedicated growth strategist", "Custom campaign development", "Weekly executive reporting", "SLA-backed results"], cta: "Scale Aggressively" },
        ],
        "boosted-post-campaigns": [
            { name: "Launch", price: "$499", period: "/month + ad spend", tagline: "For businesses testing boosted posts for the first time.", highlight: false, features: ["Up to 5 active campaigns", "2 creative variations per campaign", "Basic audience targeting", "Weekly performance reports", "Monthly strategy call", "Ad spend management up to $2K"], cta: "Launch First Campaign" },
            { name: "Scale", price: "$1,299", period: "/month + ad spend", tagline: "For brands ready to scale profitable campaigns aggressively.", highlight: true, features: ["Up to 20 active campaigns", "Unlimited creative testing", "Advanced lookalike & retargeting", "Automated budget optimization", "Bi-weekly strategy calls", "Ad spend management up to $15K"], cta: "Start Scaling" },
            { name: "Enterprise", price: "Custom", period: "", tagline: "Full-funnel paid social for high-volume advertisers.", highlight: false, features: ["Unlimited campaigns & creatives", "Multi-account & cross-platform", "Dedicated media buying team", "Custom attribution modeling", "Creative production included", "SLA-backed performance guarantees"], cta: "Talk to Strategist" },
        ],
    },
};

function getStoredContent(): SiteContent {
    if (typeof window === "undefined") return DEFAULT_CONTENT;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_CONTENT;
        const parsed = JSON.parse(raw);
        // Merge with defaults so new fields are always present
        return {
            ...DEFAULT_CONTENT,
            ...parsed,
            contact: { ...DEFAULT_CONTENT.contact, ...parsed.contact },
            domainPlans: parsed.domainPlans || DEFAULT_CONTENT.domainPlans,
            servicePackages: { ...DEFAULT_CONTENT.servicePackages, ...parsed.servicePackages },
        };
    } catch {
        return DEFAULT_CONTENT;
    }
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Mapper helpers — convert snake_case API responses to camelCase     */
/* ------------------------------------------------------------------ */

function mapApiServices(items: import("../services").ServiceData[]): ServiceData[] {
    return items
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((s) => ({
            id: String(s.id),
            tag: s.tag,
            title: s.title,
            description: s.description,
            iconName: s.icon_name,
            items: s.items.map((it) => ({ title: it.title })),
        }));
}

function mapApiPartners(items: import("../services").PartnerData[]): PartnerData[] {
    return items
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((p) => ({
            name: p.name,
            iconName: p.icon_name,
            color: p.color,
        }));
}

function mapApiTestimonials(items: import("../services").TestimonialData[]): TestimonialData[] {
    return items
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((t) => ({
            name: t.name,
            role: t.role,
            stars: t.stars,
            text: t.text,
        }));
}

function mapApiContact(data: import("../services").ContactInfoData): ContactInfoData {
    return {
        phone: data.phone,
        email: data.email,
        address: data.address,
        tagline: data.tagline,
        socialFacebook: data.social_facebook,
        socialInstagram: data.social_instagram,
        socialLinkedin: data.social_linkedin,
        socialTwitter: data.social_twitter,
    };
}

function mapApiDomainPlans(items: import("../services").DomainPlanData[]): DomainPlanData[] {
    return items
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((d) => ({
            name: d.name,
            price: d.price,
            period: d.period,
            tagline: d.tagline,
            highlight: d.highlight,
            features: d.features,
            cta: d.cta,
        }));
}

function mapApiServicePackages(
    grouped: import("../services").ServicePackagesGrouped,
): ServicePackages {
    const result: ServicePackages = {};
    for (const [key, plans] of Object.entries(grouped)) {
        result[key] = plans
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((p) => ({
                name: p.name,
                price: p.price,
                period: p.period,
                tagline: p.tagline,
                highlight: p.highlight,
                features: p.features,
                cta: p.cta,
            }));
    }
    return result;
}

export function ContentProvider({ children }: { children: ReactNode }) {
    const [content, setContent] = useState<SiteContent>(getStoredContent);
    const [loading, setLoading] = useState(true);

    /* Fetch all content from the Laravel API */
    const refreshContent = useCallback(async () => {
        try {
            const [servicesRes, partnersRes, testimonialsRes, contactRes, domainRes, packagesRes] =
                await Promise.allSettled([
                    servicesApi.getAll(),
                    partnersApi.getAll(),
                    testimonialsApi.getAll(),
                    contactApi.get(),
                    domainPlansApi.getAll(),
                    servicePackagesApi.getGrouped(),
                ]);

            const updated: SiteContent = {
                services:
                    servicesRes.status === "fulfilled"
                        ? mapApiServices(servicesRes.value.data)
                        : content.services,
                partners:
                    partnersRes.status === "fulfilled"
                        ? mapApiPartners(partnersRes.value.data)
                        : content.partners,
                testimonials:
                    testimonialsRes.status === "fulfilled"
                        ? mapApiTestimonials(testimonialsRes.value.data)
                        : content.testimonials,
                contact:
                    contactRes.status === "fulfilled"
                        ? mapApiContact(contactRes.value.data)
                        : content.contact,
                domainPlans:
                    domainRes.status === "fulfilled"
                        ? mapApiDomainPlans(domainRes.value.data)
                        : content.domainPlans,
                servicePackages:
                    packagesRes.status === "fulfilled"
                        ? mapApiServicePackages(packagesRes.value.data)
                        : content.servicePackages,
            };

            setContent(updated);
        } catch {
            // Silently fall back to existing localStorage content
        } finally {
            setLoading(false);
        }
    }, [content]);

    /* Fetch on mount */
    useEffect(() => {
        refreshContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Persist to localStorage whenever content changes */
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    }, [content]);

    const updateServices = useCallback((services: ServiceData[]) => {
        setContent((prev) => ({ ...prev, services }));
    }, []);

    const updatePartners = useCallback((partners: PartnerData[]) => {
        setContent((prev) => ({ ...prev, partners }));
    }, []);

    const updateTestimonials = useCallback((testimonials: TestimonialData[]) => {
        setContent((prev) => ({ ...prev, testimonials }));
    }, []);

    const updateContact = useCallback((contact: ContactInfoData) => {
        setContent((prev) => ({ ...prev, contact }));
    }, []);

    const updateDomainPlans = useCallback((domainPlans: DomainPlanData[]) => {
        setContent((prev) => ({ ...prev, domainPlans }));
    }, []);

    const updateServicePackages = useCallback((key: string, plans: PackagePlanData[]) => {
        setContent((prev) => ({ ...prev, servicePackages: { ...prev.servicePackages, [key]: plans } }));
    }, []);

    return (
        <ContentContext.Provider
            value={{
                content,
                loading,
                refreshContent,
                updateServices,
                updatePartners,
                updateTestimonials,
                updateContact,
                updateDomainPlans,
                updateServicePackages,
            }}
        >
            {children}
        </ContentContext.Provider>
    );
}

export function useContent(): ContentContextValue {
    const ctx = useContext(ContentContext);
    if (!ctx) throw new Error("useContent must be used within a ContentProvider");
    return ctx;
}

export type { DomainPlanData as DomainPlanDataType, PackagePlanData as PackagePlanDataType, ServicePackages as ServicePackagesType };
