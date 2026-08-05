import { ArrowRight, CheckCircle, Target, Shield, TrendingUp, Award, ThumbsUp, ShoppingCart } from "lucide-react";
import FinalCTA from "../components/home/FinalCTA";
import { useContent } from "../context/ContentContext";
import { useCart } from "../store/useCart";

export default function LikesFollowers() {
    const { content } = useContent();
    const { addItem } = useCart();
    const plans = content.servicePackages["likes-followers"].map((p) => ({ ...p, description: p.tagline, popular: p.highlight }));
    const features = [
        {
            icon: Target,
            title: "Real, Targeted Followers",
            description: "No bots, no fake accounts. We attract genuine users interested in your niche through organic growth strategies.",
        },
        {
            icon: Shield,
            title: "100% Platform Compliant",
            description: "All methods follow Meta's Terms of Service. Zero risk of shadowbans, restrictions, or account penalties.",
        },
        {
            icon: TrendingUp,
            title: "Engagement That Converts",
            description: "Followers who actually engage — likes, comments, shares, and saves that signal quality to the algorithm.",
        },
        {
            icon: Award,
            title: "Verified Growth Tracking",
            description: "Real-time dashboard showing follower demographics, engagement rates, and ROI attribution.",
        },
    ];

    const processSteps = [
        { step: "01", title: "Account Health Audit", description: "We analyze your current followers, engagement patterns, content performance, and risk factors." },
        { step: "02", title: "Ideal Audience Mapping", description: "Define precise targeting parameters — interests, behaviors, demographics, and lookalike profiles." },
        { step: "03", title: "Growth Engine Activation", description: "Deploy organic outreach, community engagement, collaboration networks, and viral content loops." },
        { step: "04", title: "Quality Filtering & Retention", description: "Continuous monitoring removes inactive/low-quality follows; retention campaigns keep real followers engaged." },
        { step: "05", title: "Compound & Convert", description: "Growing audience becomes a monetizable asset — we help convert followers into leads and customers." },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#060B14]">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#45CFFF]/10 text-[#45CFFF] text-sm font-medium mb-6">
                            <ThumbsUp size={16} />
                            <span>Likes & Followers Growth</span>
                        </div>
                        <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-bold text-[#060B14] dark:text-white leading-tight mb-6">
                            Real followers who <span className="text-[#45CFFF]">actually engage</span> and convert
                        </h1>
                        <p className="text-lg md:text-xl text-[#4A5568] dark:text-[#A0AEC0] mb-10 max-w-2xl mx-auto leading-relaxed">
                            No bots. No fake accounts. No risk. Just authentic, targeted audience growth that builds social proof and drives business results.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="#plans" className="group inline-flex items-center gap-2 px-8 py-4 bg-[#060B14] dark:bg-[#45CFFF] text-white dark:text-[#060B14] rounded-xl font-semibold text-base hover:opacity-90 transition-opacity">
                                View Plans
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a href="#process" className="inline-flex items-center gap-2 px-8 py-4 border border-[#E2E8F0] dark:border-[#2D3748] text-[#1A202C] dark:text-[#E2E8F0] rounded-xl font-semibold text-base hover:bg-[#F7FAFC] dark:hover:bg-[#1A202C] transition-colors">
                                How It Works
                            </a>
                        </div>
                    </div>

                    {/* Trust Stats */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">0%</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Bot Guarantee</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">4.9/5</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Client Satisfaction</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">24h</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Average First Results</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D]">
                            <div className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white">10K+</div>
                            <div className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">Accounts Grown</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 md:py-28 px-4 bg-[#F9FAFC] dark:bg-[#040911]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white mb-4">
                            Why Brands Trust Our Growth Method
                        </h2>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0]">
                            Sustainable, compliant, and built for long-term brand equity — not vanity metrics.
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
                            Our 5-Step Organic Growth Framework
                        </h2>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0]">
                            A systematic approach that compounds over time — not a quick fix that disappears.
                        </p>
                    </div>

                    {/* Desktop: Horizontal stepper with progress fill */}
                    <div className="hidden lg:block">
                        <div className="relative">
                            {/* Progress track */}
                            <div className="absolute top-10 left-16 right-16 h-1.5 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden">
                                {/* Progress fill - animated */}
                                <div className="h-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] rounded-full transition-all duration-1000" style={{ width: '100%' }} />
                            </div>

                            {/* Steps */}
                            <div className="flex items-start justify-between relative z-10">
                                {processSteps.map((step, index) => (
                                    <div key={index} className="relative flex flex-col items-center w-1/5 px-2 group">
                                        {/* Step circle with number */}
                                        <div className="relative w-20 h-20 rounded-full border-4 border-white dark:border-[#060B14] flex items-center justify-center font-sora text-xl font-bold text-[#45CFFF] bg-gradient-to-br from-[#45CFFF]/10 to-[#1E56E0]/10 shadow-lg shadow-[#45CFFF]/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#45CFFF]/40 z-10">
                                            {step.step}
                                            {/* Checkmark overlay on hover */}
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <CheckCircle size={24} className="text-white" />
                                            </div>
                                        </div>

                                        {/* Step label */}
                                        <div className="mt-6 w-full text-center">
                                            <h3 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-2 group-hover:text-[#45CFFF] transition-colors duration-300">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-[#4A5568] dark:text-[#A0AEC0] leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile/Tablet: Vertical cards with step progress indicator */}
                    <div className="lg:hidden space-y-4">
                        {processSteps.map((step, index) => (
                            <div key={index} className="group relative">
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#45CFFF]/10">
                                    {/* Step number with progress ring */}
                                    <div className="relative flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-sora text-lg font-bold text-white shadow-lg shadow-[#45CFFF]/30"
                                        style={{ background: 'linear-gradient(135deg, #45CFFF 0%, #1E56E0 100%)' }}>
                                        {step.step}
                                        {/* Progress ring */}
                                        <svg className="absolute -inset-1 transform -rotate-90" viewBox="0 0 36 36">
                                            <circle
                                                cx="18" cy="18" r="15.5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                strokeDasharray="97.4"
                                                strokeDashoffset="0"
                                                className="text-[#45CFFF]/30"
                                            />
                                        </svg>
                                    </div>

                                    {/* Step content */}
                                    <div className="flex-1 pt-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white group-hover:text-[#45CFFF] transition-colors duration-300">
                                                {step.title}
                                            </h3>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#45CFFF]/10 text-[#45CFFF]">
                                                Step {index + 1} of 5
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#4A5568] dark:text-[#A0AEC0] leading-relaxed">
                                            {step.description}
                                        </p>
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
                            Transparent Pricing, Measurable Results
                        </h2>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0]">
                            Pay for real growth, not empty numbers. Cancel anytime.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, index) => (
                            <div key={index} className={`relative p-8 rounded-2xl bg-white dark:bg-[#0F1E3D] border ${plan.popular ? 'border-[#45CFFF] shadow-xl shadow-[#45CFFF]/20' : 'border-[#E2E8F0] dark:border-[#2D3748]'} transition-all duration-300`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#45CFFF] text-[#060B14] text-sm font-semibold rounded-full">
                                        Best Value
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
                                        id: `likes-${plan.name}`,
                                        serviceKey: "likes-followers",
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
                title="Stop Buying Fake Followers. Start Building Real Influence."
                description="Get a free growth audit — we'll analyze your account, identify your ideal audience, and show you exactly how we'd grow your real, engaged following in 90 days."
                primaryCta={{ label: "Get Free Growth Audit", href: "/contact" }}
                secondaryCta={{ label: "See Real Results", href: "/case-studies" }}
                trustBadges={["Zero Bot Guarantee", "Meta Compliant Methods", "Real-Time Dashboard", "Cancel Anytime"]}
            />
        </div>
    );
}