import { ArrowRight, CheckCircle, Target, Image, Video, Zap, ShoppingCart } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import FinalCTA from "../components/home/FinalCTA";
import { useContent } from "../context/ContentContext";
import { useCart } from "../store/cartStore";

export default function InstagramMarketing() {
    const { content } = useContent();
    const { addItem } = useCart();
    const plans = content.servicePackages["instagram-marketing"].map((p) => ({ ...p, description: p.tagline, popular: p.highlight }));
    const features = [
        {
            icon: Image,
            title: "Visual Content Strategy",
            description: "Curated feed aesthetics, story sequences, and highlight covers that build instant brand recognition.",
        },
        {
            icon: Video,
            title: "Reels & Video Production",
            description: "Short-form video concepts, scripting, editing, and trend adaptation for maximum reach and engagement.",
        },
        {
            icon: Target,
            title: "Influencer & UGC Campaigns",
            description: "Identify, negotiate, and manage creator partnerships that drive authentic engagement and conversions.",
        },
        {
            icon: Zap,
            title: "Growth Automation",
            description: "Smart automation for DM outreach, comment management, and follower growth — all within platform guidelines.",
        },
    ];

    const processSteps = [
        { step: "01", title: "Brand & Audience Audit", description: "We analyze your current presence, competitor landscape, and define your visual identity & content pillars." },
        { step: "02", title: "Content Strategy & Calendar", description: "Monthly content themes, post types, Reels concepts, and story sequences planned 30 days ahead." },
        { step: "03", title: "Production & Creation", description: "Our creators shoot, design, and edit all assets — photos, graphics, Reels, carousels — on-brand every time." },
        { step: "04", title: "Publishing & Community", description: "Scheduled posting, real-time story coverage, comment engagement, and DM management by our team." },
        { step: "05", title: "Analyze & Iterate", description: "Weekly performance reviews, viral content replication, and strategy pivots based on hard data." },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#060B14]">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E84393]/10 text-[#E84393] text-sm font-medium mb-6">
                            <FaInstagram size={16} />
                            <span>Instagram Marketing Services</span>
                        </div>
                        <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-bold text-[#060B14] dark:text-white leading-tight mb-6">
                            Build a brand people <span className="text-[#E84393]">can't stop following</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#4A5568] dark:text-[#A0AEC0] mb-10 max-w-2xl mx-auto leading-relaxed">
                            From aesthetic feeds to viral Reels — we turn scrollers into buyers with data-backed creative and community strategies that convert.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="#plans" className="group inline-flex items-center gap-2 px-8 py-4 bg-[#060B14] dark:bg-[#E84393] text-white dark:text-[#060B14] rounded-xl font-semibold text-base hover:opacity-90 transition-opacity">
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
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">2B+</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Monthly Active Users</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">90%</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Follow at Least One Business</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">500M+</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Daily Reels Views</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">3.5x</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Higher Engagement vs Feed</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 md:py-28 px-4 bg-[#F9FAFC] dark:bg-[#040911]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white mb-4">
                            Full-Stack Instagram Growth
                        </h2>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0]">
                            Content, community, commerce — we handle every layer so your Instagram becomes a revenue channel, not just a portfolio.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="group p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#E84393]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#E84393]/10">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E84393]/20 to-[#FD1D1D]/20 flex items-center justify-center text-[#E84393] mb-4 group-hover:scale-110 transition-transform">
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
                            Our 5-Step Instagram Growth Framework
                        </h2>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0]">
                            Systematic, repeatable, and built for the algorithm — not against it.
                        </p>
                    </div>

                    {/* Vertical stepper with progress indicator */}
                    <div className="max-w-3xl mx-auto">
                        {/* Overall progress bar */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-sora text-sm font-semibold text-[#060B14] dark:text-white">Framework Progress</span>
                                <span className="font-mono text-lg font-bold text-[#E84393] dark:text-[#FD1D1D]">01 / 05</span>
                            </div>
                            <div className="relative h-2 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden">
                                <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#E84393] via-[#FD1D1D] to-[#F56040]" style={{ width: '20%' }} />
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="space-y-6" role="list" aria-label="Instagram growth framework steps">
                            {processSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`group relative flex items-start gap-6 p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border transition-all duration-500 ${index === 0
                                        ? 'border-[#E84393] shadow-lg shadow-[#E84393]/20'
                                        : 'border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#E84393]/50 hover:shadow-xl hover:shadow-[#E84393]/10'
                                        }`}
                                    role="listitem"
                                >
                                    {/* Step number with progress ring */}
                                    <div className="relative flex-shrink-0">
                                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                                            {/* Background circle */}
                                            <circle
                                                cx="50" cy="50" r="45"
                                                fill="none" stroke="#E2E8F0" strokeWidth="8"
                                                className="dark:stroke-[#2D3748]" />
                                            {/* Progress circle */}
                                            <circle
                                                cx="50" cy="50" r="45"
                                                fill="none" stroke="url(#progressGradient)" strokeWidth="8"
                                                strokeDasharray="283" strokeDashoffset="283"
                                                strokeLinecap="round"
                                                className="transition-all duration-700"
                                                style={{
                                                    strokeDashoffset: index === 0 ? '0' : '283',
                                                    filter: 'drop-shadow(0 4px 8px rgba(232, 67, 147, 0.3))'
                                                }} />
                                            <defs>
                                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#E84393" />
                                                    <stop offset="100%" stopColor="#FD1D1D" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="font-sora text-xl font-bold text-white">
                                                {step.step}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Step content */}
                                    <div className="flex-1 min-w-0 pt-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-sora text-xl font-semibold text-[#060B14] dark:text-white group-hover:text-[#E84393] transition-colors duration-300">
                                                {step.title}
                                            </h3>
                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#E84393]/10 text-[#E84393]">
                                                Phase {index + 1}
                                            </span>
                                        </div>
                                        <p className="text-base text-[#4A5568] dark:text-[#A0AEC0] leading-relaxed pr-4">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Connecting line */}
                                    {index < processSteps.length - 1 && (
                                        <div className="absolute left-7 top-16 bottom-0 w-0.5 bg-gradient-to-b from-[#E84393] to-transparent" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step indicator dots */}
                        <div className="mt-10 flex items-center justify-center gap-2">
                            {processSteps.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === 0
                                        ? 'bg-[#E84393] w-8'
                                        : 'bg-[#E2E8F0] dark:bg-[#2D3748] hover:bg-[#E84393]/50'
                                        }`}
                                    aria-label={`Go to step ${index + 1}`}
                                />
                            ))}
                        </div>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0]">
                            No hidden fees. No long-term contracts. Cancel anytime.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, index) => (
                            <div key={index} className={`relative p-8 rounded-2xl bg-white dark:bg-[#0F1E3D] border ${plan.popular ? 'border-[#E84393] shadow-xl shadow-[#E84393]/20' : 'border-[#E2E8F0] dark:border-[#2D3748]'} transition-all duration-300`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#E84393] text-white text-sm font-semibold rounded-full">
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
                                            <CheckCircle size={18} className="text-[#E84393] flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => addItem({
                                        id: `instagram-${plan.name}`,
                                        serviceKey: "instagram-marketing",
                                        name: plan.name,
                                        price: plan.price,
                                        period: plan.period,
                                        tagline: plan.description,
                                        features: plan.features,
                                        highlight: plan.popular,
                                    })}
                                    className={`block w-full py-3 px-4 rounded-xl font-semibold text-center transition-all ${plan.popular ? 'bg-[#060B14] dark:bg-[#E84393] text-white dark:text-[#060B14] hover:opacity-90' : 'bg-[#F7FAFC] dark:bg-[#1A202C] text-[#060B14] dark:text-white border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#E84393]/50'}`}
                                >
                                    <ShoppingCart size={16} className="inline mr-2" /> Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <FinalCTA
                title="Ready to Own Your Niche on Instagram?"
                description="Book a free audit and we'll show you exactly what's working, what's not, and a 90-day roadmap to 10x your engagement and conversions."
                primaryCta={{ label: "Book Free Instagram Audit", href: "/contact" }}
                secondaryCta={{ label: "View Our Work", href: "/portfolio" }}
                trustBadges={["Meta Business Partner", "Verified Creator Network", "Brand-Safe Practices", "Monthly Growth Guarantee"]}
            />
        </div>
    );
}