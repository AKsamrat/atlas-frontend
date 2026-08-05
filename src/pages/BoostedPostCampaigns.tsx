import { ArrowRight, CheckCircle, Target, DollarSign, BarChart3, Zap, Shield, ShoppingCart } from "lucide-react";
import FinalCTA from "../components/home/FinalCTA";
import { useContent } from "../context/ContentContext";
import { useCart } from "../store/useCart";

export default function BoostedPostCampaigns() {
    const { content } = useContent();
    const { addItem } = useCart();
    const plans = content.servicePackages["boosted-post-campaigns"].map((p) => ({ ...p, description: p.tagline, popular: p.highlight }));
    const features = [
        {
            icon: Target,
            title: "Precision Audience Targeting",
            description: "Layer demographics, interests, behaviors, and custom audiences to reach the exact people most likely to convert.",
        },
        {
            icon: DollarSign,
            title: "Budget Optimization Engine",
            description: "AI-powered bid management allocates spend to highest-performing placements, audiences, and creatives in real-time.",
        },
        {
            icon: BarChart3,
            title: "Creative Testing Framework",
            description: "Systematic A/B testing of headlines, images, videos, CTAs, and formats — winners scale automatically.",
        },
        {
            icon: Shield,
            title: "Brand Safety & Compliance",
            description: "Automated content moderation, placement exclusions, and policy monitoring protect your brand reputation.",
        },
    ];

    const processSteps = [
        { step: "01", title: "Audit & Benchmark", description: "Analyze historical performance, audience data, creative assets, and competitive landscape to establish baselines." },
        { step: "02", title: "Strategy & Structure", description: "Design campaign architecture — objectives, funnels, audience segments, budget allocation, and testing roadmap." },
        { step: "03", title: "Creative Production", description: "Our team produces scroll-stopping static, video, and carousel ads optimized for each placement and audience." },
        { step: "04", title: "Launch & Optimize", description: "Go live with micro-budget tests, identify winners fast, and scale spend on proven combinations daily." },
        { step: "05", title: "Report & Reinvest", description: "Transparent ROI reporting, learnings documentation, and next-month strategy with reinvestment recommendations." },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#060B14]">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E56E0]/10 text-[#1E56E0] dark:text-[#45CFFF] text-sm font-medium mb-6">
                            <Zap size={16} />
                            <span>Boosted Post Campaigns</span>
                        </div>
                        <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-bold text-[#060B14] dark:text-white leading-tight mb-6">
                            Turn organic posts into <span className="text-[#1E56E0]">revenue engines</span> with paid amplification
                        </h1>
                        <p className="text-lg md:text-xl text-[#4A5568] dark:text-[#A0AEC0] mb-10 max-w-2xl mx-auto leading-relaxed">
                            Strategic boosting, creative testing, and automated optimization — we manage the complexity so your best content reaches the right people at the right price.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="#plans" className="group inline-flex items-center gap-2 px-8 py-4 bg-[#060B14] dark:bg-[#1E56E0] text-white dark:text-[#060B14] rounded-xl font-semibold text-base hover:opacity-90 transition-opacity">
                                View Plans
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
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">3.2x</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Average ROAS Improvement</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">65%</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Lower CPA vs Self-Managed</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">$50M+</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Ad Spend Managed</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">24h</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Optimization Cycle</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 md:py-28 px-4 bg-[#F9FAFC] dark:bg-[#040911]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white mb-4">
                            Why Our Boosted Campaigns Outperform
                        </h2>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0]">
                            Most businesses boost posts blindly. We build systems that learn, optimize, and compound.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="group p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#1E56E0]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#1E56E0]/10">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E56E0]/20 to-[#45CFFF]/20 flex items-center justify-center text-[#1E56E0] dark:text-[#45CFFF] mb-4 group-hover:scale-110 transition-transform">
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
                            Our 5-Step Campaign Mastery Process
                        </h2>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0]">
                            From first boost to predictable profit — a repeatable framework for paid social success.
                        </p>
                    </div>

                    {/* Alternating timeline design */}
                    <div className="relative max-w-3xl mx-auto">
                        {/* Center timeline */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#1E56E0] via-[#45CFFF] to-transparent" />

                        {processSteps.map((step, index) => (
                            <div key={index} className={`relative mb-12 ${index % 2 === 0 ? 'pl-[55%] pr-8 text-left' : 'pr-[55%] pl-8 text-right'}`}>
                                {/* Step marker on timeline */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                                    <div className="relative w-12 h-12 rounded-full flex items-center justify-center font-sora text-lg font-bold text-white shadow-lg shadow-[#1E56E0]/40"
                                        style={{ background: 'linear-gradient(135deg, #1E56E0 0%, #45CFFF 100%)' }}>
                                        {step.step}
                                        {/* Pulse ring */}
                                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"
                                            style={{ background: 'linear-gradient(135deg, #1E56E0 0%, #45CFFF 100%)' }} />
                                    </div>
                                </div>

                                {/* Step card */}
                                <div className="group relative p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#1E56E0]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#1E56E0]/10">
                                    {/* Arrow pointing to timeline */}
                                    <div className={`absolute top-4 ${index % 2 === 0 ? '-right-4' : '-left-4'} w-4 h-4 bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] rotate-45 group-hover:border-[#1E56E0] transition-colors`} />

                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-[#1E56E0] dark:text-[#45CFFF] bg-[#1E56E0]/10 dark:bg-[#1E56E0]/20">
                                            <Target size={20} />
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-2 group-hover:text-[#1E56E0] dark:group-hover:text-[#45CFFF] transition-colors duration-300">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-[#4A5568] dark:text-[#A0AEC0] leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
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
                            Management Fee + Your Ad Spend
                        </h2>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0]">
                            Transparent flat-fee management. You control the ad budget; we maximize every dollar.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, index) => (
                            <div key={index} className={`relative p-8 rounded-2xl bg-white dark:bg-[#0F1E3D] border ${plan.popular ? 'border-[#1E56E0] shadow-xl shadow-[#1E56E0]/20' : 'border-[#E2E8F0] dark:border-[#2D3748]'} transition-all duration-300`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#1E56E0] text-white text-sm font-semibold rounded-full">
                                        Best for Scaling
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
                                            <CheckCircle size={18} className="text-[#1E56E0] dark:text-[#45CFFF] flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => addItem({
                                        id: `boosted-${plan.name}`,
                                        serviceKey: "boosted-post-campaigns",
                                        name: plan.name,
                                        price: plan.price,
                                        period: plan.period,
                                        tagline: plan.description,
                                        features: plan.features,
                                        highlight: plan.popular,
                                    })}
                                    className={`block w-full py-3 px-4 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-[#060B14] dark:bg-[#1E56E0] text-white hover:opacity-90' : 'bg-[#F7FAFC] dark:bg-[#1A202C] text-[#060B14] dark:text-white border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#1E56E0]/50'}`}
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
                title="Ready to Make Every Boost Profitable?"
                description="Get a free campaign audit — we'll review your current boosting strategy, identify wasted spend, and show you a roadmap to 3x ROAS within 90 days."
                primaryCta={{ label: "Free Campaign Audit", href: "/contact" }}
                secondaryCta={{ label: "Calculate Your ROAS", href: "/roas-calculator" }}
                trustBadges={["Meta Certified Buyers", "Daily Optimization", "Full Transparency", "No Setup Fees"]}
            />
        </div>
    );
}