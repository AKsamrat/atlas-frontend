import { ArrowRight, CheckCircle, Target, Users, BarChart2, Megaphone, ShoppingCart } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import FinalCTA from "../components/home/FinalCTA";
import { useContent } from "../context/ContentContext";
import { useCart } from "../store/useCart";


export default function FacebookMarketing() {
    const { content } = useContent();
    const { addItem } = useCart();
    const plans = content.servicePackages["facebook-marketing"].map((p) => ({ ...p, description: p.tagline, popular: p.highlight }));
    const features = [
        {
            icon: Target,
            title: "Precision Targeting",
            description: "Reach the exact audience that matters — by interests, behaviors, demographics, and custom lookalikes.",
        },
        {
            icon: Users,
            title: "Community Building",
            description: "Grow an engaged community around your brand with content strategies, group management, and moderation.",
        },
        {
            icon: BarChart2,
            title: "Data-Driven Optimization",
            description: "Daily performance tracking, A/B creative testing, and budget reallocation to maximize ROAS.",
        },
        {
            icon: Megaphone,
            title: "Ad Creative Production",
            description: "Scroll-stopping static, carousel, and video creatives designed for Facebook's ad placements.",
        },
    ];

    const processSteps = [
        { step: "01", title: "Discovery & Audit", description: "We analyze your current presence, competitors, and audience to build a data-backed strategy." },
        { step: "02", title: "Strategy & Setup", description: "Campaign structure, pixel implementation, audience architecture, and creative roadmap." },
        { step: "03", title: "Creative Production", description: "Our designers produce scroll-stopping ad creatives tailored to each placement." },
        { step: "04", title: "Launch & Optimize", description: "Go live with controlled budgets, then iterate daily based on performance signals." },
        { step: "05", title: "Scale & Report", description: "Winning campaigns scale aggressively; you get transparent weekly & monthly reports." },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#060B14]">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#45CFFF]/10 text-[#45CFFF] text-sm font-medium mb-6">
                            <FaFacebook size={16} />
                            <span>Facebook Marketing Services</span>
                        </div>
                        <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-bold text-[#060B14] dark:text-white leading-tight mb-6">
                            Turn Facebook into your <span className="text-[#45CFFF]">highest-ROI channel</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#4A5568] dark:text-[#A0AEC0] mb-10 max-w-2xl mx-auto leading-relaxed">
                            From cold audience acquisition to loyal community building — we design, launch, and scale Facebook campaigns that drive measurable business growth.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="#plans" className="group inline-flex items-center gap-2 px-8 py-4 bg-[#060B14] dark:bg-[#45CFFF] text-white dark:text-[#060B14] rounded-xl font-semibold text-base hover:opacity-90 transition-opacity">
                                View Pricing Plans
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a href="#process" className="inline-flex items-center gap-2 px-8 py-4 border border-[#E2E8F0] dark:border-[#2D3748] text-[#1A202C] dark:text-[#E2E8F0] rounded-xl font-semibold text-base hover:bg-[#F7FAFC] dark:hover:bg-[#1A202C] transition-colors">
                                Our Process
                            </a>
                        </div>
                    </div>

                    {/* Trust Stats */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">2.9B+</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Monthly Active Users</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">93%</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Of Marketers Use Facebook</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">10M+</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Active Advertisers</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">150%</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Avg. ROAS Improvement</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 md:py-28 px-4 bg-[#F9FAFC] dark:bg-[#040911]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white mb-4">
                            Why Brands Choose Our Facebook Marketing
                        </h2>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0]">
                            End-to-end management — from strategy to creative to optimization — so you can focus on running your business.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="group p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#45CFFF]/10">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#45CFFF]/20 to-[#1E56E0]/20 flex items-center justify-center text-[#45CFFF] mb-4 group-hover:scale-110 transition-transform">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="font-sora text-xl font-semibold text-[#060B14] dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-[#4A5568] dark:text-[#A0AEC0] leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section id="process" className="py-20 md:py-28 px-4 bg-white dark:bg-[#060B14]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white mb-4">
                            Our Proven 5-Step Process
                        </h2>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0]">
                            A systematic approach that turns ad spend into predictable revenue.
                        </p>
                    </div>

                    {/* Grid-based step cards with hover expansion */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {processSteps.map((step, index) => (
                            <div
                                key={index}
                                className="group relative p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#45CFFF]/15 overflow-hidden"
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {/* Gradient top accent */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                                {/* Step number badge */}
                                <div className="relative mb-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl font-sora text-xl font-bold text-white shadow-lg shadow-[#45CFFF]/40"
                                        style={{ background: 'linear-gradient(135deg, #45CFFF 0%, #1E56E0 100%)' }}>
                                        {step.step}
                                    </div>
                                    {/* Floating particles on hover */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#45CFFF] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Step icon */}
                                <div className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center text-[#45CFFF] bg-[#45CFFF]/10 group-hover:bg-[#45CFFF] group-hover:text-white transition-all duration-300">
                                    <Target size={24} />
                                </div>

                                {/* Step content */}
                                <div className="relative z-10">
                                    <h3 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-2 group-hover:text-[#45CFFF] transition-colors duration-300">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-[#4A5568] dark:text-[#A0AEC0] leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Hover arrow */}
                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 text-[#45CFFF]">
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Plans Section */}
            <section id="plans" className="py-20 md:py-28 px-4 bg-[#F9FAFC] dark:bg-[#040911]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0]">
                            No hidden fees. No long-term contracts. Cancel anytime.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, index) => (
                            <div key={index} className={`relative p-8 rounded-2xl bg-white dark:bg-[#0F1E3D] border ${plan.popular ? 'border-[#45CFFF] shadow-xl shadow-[#45CFFF]/20' : 'border-[#E2E8F0] dark:border-[#2D3748]'} transition-all duration-300`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#45CFFF] text-[#060B14] text-sm font-semibold rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                <div className="text-center mb-6">
                                    <h3 className="font-sora text-xl font-semibold text-[#060B14] dark:text-white mb-2">{plan.name}</h3>
                                    <p className="text-[#718096] dark:text-[#A0AEC0] text-sm mb-4">{plan.description}</p>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="font-sora text-4xl font-bold text-[#060B14] dark:text-white">{plan.price}</span>
                                        <span className="text-[#718096] dark:text-[#A0AEC0]">{plan.period}</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[#4A5568] dark:text-[#A0AEC0]">
                                            <CheckCircle size={18} className="text-[#45CFFF] flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => addItem({
                                        id: `fb-${plan.name}`,
                                        serviceKey: "facebook-marketing",
                                        name: plan.name,
                                        price: plan.price,
                                        period: plan.period,
                                        tagline: plan.description,
                                        features: plan.features,
                                        highlight: plan.popular,
                                    })}
                                    className={`block w-full py-3 px-4 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-[#060B14] dark:bg-[#45CFFF] text-white dark:text-[#060B14] hover:opacity-90' : 'bg-[#F7FAFC] dark:bg-[#1A202C] text-[#060B14] dark:text-white border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50'}`}
                                >
                                    <ShoppingCart size={18} /> {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <FinalCTA
                title="Ready to Scale Your Facebook Ads?"
                description="Book a free strategy call and we'll audit your current campaigns, identify wasted spend, and show you a roadmap to profitable growth."
                primaryCta={{ label: "Book Free Strategy Call", href: "/contact" }}
                secondaryCta={{ label: "See Case Studies", href: "/case-studies" }}
                trustBadges={["Meta Business Partner", "100% Transparent Reporting", "No Lock-in Contracts", "Dedicated Account Manager"]}
            />
        </div>
    );
}