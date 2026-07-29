import { Search, ChevronDown, ArrowRight, Mail, Headphones, BookOpen, LifeBuoy, Clock, Settings, Globe, Shield, Palette, Megaphone, Users, Zap, Heart, HelpCircle, FileText } from "lucide-react";
import { useState } from "react";

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);

    const categories = [
        { id: "all", label: "All Articles", icon: BookOpen, count: 48 },
        { id: "getting-started", label: "Getting Started", icon: Zap, count: 8 },
        { id: "account-billing", label: "Account & Billing", icon: Users, count: 12 },
        { id: "technical", label: "Technical Support", icon: Settings, count: 10 },
        { id: "design-branding", label: "Design & Branding", icon: Palette, count: 6 },
        { id: "marketing-seo", label: "Marketing & SEO", icon: Megaphone, count: 7 },
        { id: "domains-hosting", label: "Domains & Hosting", icon: Globe, count: 5 },
    ];

    const popularArticles = [
        {
            id: "1",
            title: "How to Set Up Your New Website Project",
            category: "Getting Started",
            readTime: "5 min",
            views: "2.4k",
            excerpt: "Step-by-step guide to initiating your web development project with Entra Global Tech, from discovery to launch.",
            tags: ["onboarding", "project-setup", "web-development"]
        },
        {
            id: "2",
            title: "Understanding Our Design Process & Revisions",
            category: "Design & Branding",
            readTime: "4 min",
            views: "1.8k",
            excerpt: "Learn about our collaborative design process, revision rounds, and how we ensure your vision comes to life.",
            tags: ["design-process", "revisions", "ui-ux"]
        },
        {
            id: "3",
            title: "Billing Cycles, Invoices & Payment Methods",
            category: "Account & Billing",
            readTime: "3 min",
            views: "3.1k",
            excerpt: "Complete guide to our billing system, accepted payment methods, invoice schedules, and managing your subscription.",
            tags: ["billing", "payments", "invoices", "subscription"]
        },
        {
            id: "4",
            title: "Domain Registration & DNS Configuration",
            category: "Domains & Hosting",
            readTime: "6 min",
            views: "1.5k",
            excerpt: "How to register domains, configure DNS records, set up email, and connect your domain to our hosting.",
            tags: ["domains", "dns", "email-setup", "hosting"]
        },
        {
            id: "5",
            title: "SEO Strategy & Keyword Research Guide",
            category: "Marketing & SEO",
            readTime: "8 min",
            views: "2.1k",
            excerpt: "Comprehensive guide to our SEO methodology, keyword research process, and how we improve your search rankings.",
            tags: ["seo", "keywords", "rankings", "organic-traffic"]
        },
        {
            id: "6",
            title: "Website Maintenance & Security Best Practices",
            category: "Technical Support",
            readTime: "7 min",
            views: "1.9k",
            excerpt: "Essential maintenance tasks, security monitoring, backup strategies, and keeping your website running smoothly.",
            tags: ["maintenance", "security", "backups", "updates"]
        },
    ];

    const faqs = [
        {
            id: "faq-1",
            question: "How long does a typical website project take?",
            answer: "Project timelines vary based on scope and complexity. A standard business website typically takes 4-8 weeks from discovery to launch. E-commerce sites may take 8-12 weeks. Custom web applications can take 12+ weeks. We provide detailed timelines during the proposal phase.",
            category: "Getting Started"
        },
        {
            id: "faq-2",
            question: "What is included in your design revision policy?",
            answer: "Our standard packages include 3 rounds of design revisions at each major milestone (wireframes, mockups, final design). Additional revisions are available at an hourly rate. We use collaborative tools like Figma for real-time feedback.",
            category: "Design & Branding"
        },
        {
            id: "faq-3",
            question: "Do you provide ongoing maintenance after launch?",
            answer: "Yes! We offer monthly maintenance plans starting at $199/month that include: security updates, plugin/core updates, daily backups, uptime monitoring, performance optimization, and priority support. Custom plans are available for enterprise needs.",
            category: "Technical Support"
        },
        {
            id: "faq-4",
            question: "Can you work with my existing hosting provider?",
            answer: "Absolutely. We can deploy to most major hosting providers (AWS, DigitalOcean, Vercel, Netlify, shared hosting, VPS, etc.). We also offer our own managed hosting with optimized performance, security, and 24/7 monitoring.",
            category: "Domains & Hosting"
        },
        {
            id: "faq-5",
            question: "How do you measure SEO success?",
            answer: "We track: organic traffic growth, keyword rankings (target keywords), conversion rates from organic search, Core Web Vitals, backlink profile quality, and ROI from SEO investment. Monthly reports with actionable insights are provided.",
            category: "Marketing & SEO"
        },
        {
            id: "faq-6",
            question: "What payment methods do you accept?",
            answer: "We accept: bank transfers (preferred for international), credit/debit cards (Visa, Mastercard, Amex), PayPal, Stripe, and Wise. For projects over $5,000, we typically require a 50% deposit to begin, with milestone-based payments.",
            category: "Account & Billing"
        },
        {
            id: "faq-7",
            question: "Do you sign NDAs for confidential projects?",
            answer: "Yes, we regularly sign mutual NDAs before project discussions. We take confidentiality seriously and have standard NDA templates available, or we can review your organization's NDA. All team members are bound by confidentiality agreements.",
            category: "Getting Started"
        },
        {
            id: "faq-8",
            question: "What happens if I need to cancel my project?",
            answer: "You can cancel at any time. Work completed up to the cancellation date is invoiced per our agreement. Deposits are non-refundable once work has commenced. We provide all completed deliverables and source files upon settlement.",
            category: "Account & Billing"
        },
        {
            id: "faq-9",
            question: "Can you integrate third-party APIs and services?",
            answer: "Yes, we have extensive experience integrating: payment gateways (Stripe, PayPal), CRM systems (HubSpot, Salesforce), email marketing (Mailchimp, Klaviyo), analytics (GA4, Mixpanel), authentication (Auth0, Firebase), and custom REST/GraphQL APIs.",
            category: "Technical Support"
        },
        {
            id: "faq-10",
            question: "Do you offer white-label services for agencies?",
            answer: "Yes! We partner with agencies worldwide for white-label development, design, and marketing services. We work under your brand, communicate with your clients as your team, and provide flexible partnership models. Contact our partnerships team for details.",
            category: "Getting Started"
        },
    ];

    const filteredFaqs = faqs.filter(faq =>
        activeCategory === "all" || faq.category.toLowerCase().replace(" & ", "-").replace(" ", "-") === activeCategory
    );

    const filteredArticles = popularArticles.filter(article =>
        activeCategory === "all" || article.category.toLowerCase().replace(" & ", "-").replace(" ", "-") === activeCategory
    );

    const toggleFaq = (id: string) => {
        setExpandedFaqs(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#060B14]">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32 px-4 bg-white dark:bg-[#060B14]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#45CFFF]/10 text-[#45CFFF] text-sm font-medium mb-6">
                            <LifeBuoy size={16} />
                            <span>Help Center</span>
                        </div>
                        <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-bold text-[#060B14] dark:text-white leading-tight mb-6">
                            How Can We <span className="text-[#45CFFF]">Help?</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#4A5568] dark:text-[#A0AEC0] mb-8 max-w-2xl mx-auto leading-relaxed">
                            Search our knowledge base, browse popular articles, or contact our support team for personalized assistance.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0] text-xl" />
                                <input
                                    type="search"
                                    placeholder="Search articles, guides, FAQs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-16 py-4 pl-12 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#060B14] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] focus:border-transparent transition-all text-base"
                                />
                            </div>
                            <p className="mt-3 text-sm text-[#718096] dark:text-[#A0AEC0]">
                                Try searching for: "billing", "DNS setup", "design revisions", "SEO timeline"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-12 px-4 bg-[#F9FAFC] dark:bg-[#040911] border-y border-[#E2E8F0] dark:border-[#2D3748]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat.id
                                    ? "bg-[#45CFFF] text-white shadow-lg shadow-[#45CFFF]/30"
                                    : "bg-white dark:bg-[#0F1E3D] text-[#4A5568] dark:text-[#A0AEC0] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 hover:text-[#45CFFF]"
                                    }`}
                            >
                                <cat.icon size={16} />
                                <span>{cat.label}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${activeCategory === cat.id ? "bg-white/20" : "bg-[#F1F5F9] dark:bg-[#1E293B]"
                                    }`}>
                                    {cat.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Articles */}
            <section className="py-20 px-4 bg-white dark:bg-[#060B14]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="font-sora text-3xl font-bold text-[#060B14] dark:text-white mb-2">Popular Articles</h2>
                            <p className="text-[#4A5568] dark:text-[#A0AEC0]">Most viewed guides and tutorials this month</p>
                        </div>
                        <a href="/help-center/articles" className="hidden md:inline-flex items-center gap-2 text-[#45CFFF] font-medium hover:underline transition-colors">
                            View All Articles
                            <ArrowRight size={16} />
                        </a>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((article) => (
                            <article
                                key={article.id}
                                className="group p-6 rounded-2xl bg-[#F9FAFC] dark:bg-[#040911] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 hover:shadow-xl hover:shadow-[#45CFFF]/10 transition-all duration-300 h-full flex flex-col"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#45CFFF]/10 text-[#45CFFF]">
                                        {article.category}
                                    </span>
                                    <span className="text-xs text-[#A0AEC0] flex items-center gap-1">
                                        <Clock size={12} />
                                        {article.readTime}
                                    </span>
                                </div>
                                <h3 className="font-sora text-xl font-bold text-[#060B14] dark:text-white mb-3 group-hover:text-[#45CFFF] transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-[#4A5568] dark:text-[#A0AEC0] text-sm mb-4 flex-1 leading-relaxed">
                                    {article.excerpt}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {article.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-0.5 rounded text-xs bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0]">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                                    <span className="text-xs text-[#A0AEC0] flex items-center gap-1">
                                        <Clock size={12} />
                                        {article.views} views
                                    </span>
                                    <a href={`/help-center/articles/${article.id}`} className="text-sm font-medium text-[#45CFFF] hover:underline flex items-center gap-1">
                                        Read More
                                        <ArrowRight size={14} />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="text-center py-16">
                            <Search className="w-12 h-12 mx-auto text-[#A0AEC0] mb-4" />
                            <h3 className="font-sora text-xl font-semibold text-[#060B14] dark:text-white mb-2">No articles found</h3>
                            <p className="text-[#718096] dark:text-[#A0AEC0]">Try adjusting your category filter or search terms.</p>
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <a href="/help-center/articles" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#45CFFF]/10 hover:bg-[#45CFFF]/20 text-[#45CFFF] font-semibold transition-all duration-300 border border-[#45CFFF]/20">
                            Browse All Articles
                            <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 bg-[#F9FAFC] dark:bg-[#040911] border-y border-[#E2E8F0] dark:border-[#2D3748]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0] max-w-2xl mx-auto">
                            Quick answers to common questions. Can't find what you're looking for?
                            <a href="/contact" className="text-[#45CFFF] hover:underline font-medium ml-1">Contact our support team</a>
                        </p>
                    </div>

                    <div className="space-y-4">
                        {filteredFaqs.map((faq) => {
                            const isExpanded = expandedFaqs.includes(faq.id);
                            return (
                                <details
                                    key={faq.id}
                                    id={faq.id}
                                    className="group bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] rounded-xl overflow-hidden transition-all duration-300"
                                    open={isExpanded}
                                    onToggle={() => toggleFaq(faq.id)}
                                >
                                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none focus:outline-none">
                                        <div className="flex items-start gap-4 flex-1 pr-4">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#45CFFF]/10 flex items-center justify-center text-[#45CFFF]">
                                                <HelpCircle size={20} />
                                            </div>
                                            <h3 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white leading-relaxed">
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <div className="flex-shrink-0 flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] dark:bg-[#1E293B] text-[#718096] dark:text-[#A0AEC0]">
                                                {faq.category}
                                            </span>
                                            <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B] flex items-center justify-center transition-transform duration-300 group-open:rotate-180">
                                                <ChevronDown size={18} className="text-[#718096] dark:text-[#A0AEC0]" />
                                            </div>
                                        </div>
                                    </summary>
                                    <div className="px-6 pb-6 border-t border-[#E2E8F0] dark:border-[#2D3748] animate-slide-down">
                                        <p className="text-[#4A5568] dark:text-[#A0AEC0] leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </details>
                            );
                        })}
                    </div>

                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-16">
                            <HelpCircle className="w-12 h-12 mx-auto text-[#A0AEC0] mb-4" />
                            <h3 className="font-sora text-xl font-semibold text-[#060B14] dark:text-white mb-2">No FAQs found</h3>
                            <p className="text-[#718096] dark:text-[#A0AEC0]">Try selecting a different category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Support CTA */}
            <section className="py-20 px-4 bg-white dark:bg-[#060B14]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white mb-6">
                                Still Need Help?
                            </h2>
                            <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0] mb-8 leading-relaxed">
                                Can't find the answer you're looking for? Our support team is here to help.
                                We typically respond within 4 hours during business hours.
                            </p>
                            <div className="space-y-4">
                                <a href="/contact" className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white font-semibold hover:opacity-90 hover:shadow-xl hover:shadow-[#1E56E0]/30 transition-all duration-300 w-full md:w-auto">
                                    <Mail size={20} />
                                    <span>Submit a Ticket</span>
                                </a>
                                <a href="mailto:support@entraglobaltech.com" className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#060B14] dark:text-white font-semibold hover:border-[#45CFFF]/50 hover:shadow-lg hover:shadow-[#45CFFF]/10 transition-all duration-300 w-full md:w-auto">
                                    <Headphones size={20} />
                                    <span>Email Support</span>
                                </a>
                            </div>
                        </div>

                        <div className="p-8 rounded-2xl bg-[#F9FAFC] dark:bg-[#040911] border border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora text-xl font-bold text-[#060B14] dark:text-white mb-6">Support Hours & Response Times</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#45CFFF]/10 flex items-center justify-center text-[#45CFFF]">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#060B14] dark:text-white">Business Hours</p>
                                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Mon-Fri: 9AM - 6PM (GMT+6)</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Online</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#45CFFF]/10 flex items-center justify-center text-[#45CFFF]">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#060B14] dark:text-white">Average Response</p>
                                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Under 4 hours (business hours)</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">Fast</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#45CFFF]/10 flex items-center justify-center text-[#45CFFF]">
                                            <Heart size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#060B14] dark:text-white">Satisfaction Rate</p>
                                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">98% positive feedback</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">Excellent</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links Footer */}
            <section className="py-16 px-4 bg-[#F9FAFC] dark:bg-[#040911] border-t border-[#E2E8F0] dark:border-[#2D3748]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <a href="/contact" className="group p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 transition-all">
                            <div className="w-10 h-10 mx-auto text-[#45CFFF] mb-3 group-hover:scale-110 transition-transform">
                                <Mail size={24} />
                            </div>
                            <h4 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-1">Contact Support</h4>
                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Submit a support ticket</p>
                        </a>
                        <a href="/privacy-policy" className="group p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 transition-all">
                            <div className="w-10 h-10 mx-auto text-[#45CFFF] mb-3 group-hover:scale-110 transition-transform">
                                <Shield size={24} />
                            </div>
                            <h4 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-1">Privacy Policy</h4>
                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Data protection & privacy</p>
                        </a>
                        <a href="/terms-of-service" className="group p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 transition-all">
                            <div className="w-10 h-10 mx-auto text-[#45CFFF] mb-3 group-hover:scale-110 transition-transform">
                                <FileText size={24} />
                            </div>
                            <h4 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-1">Terms of Service</h4>
                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Legal terms & conditions</p>
                        </a>
                        <a href="/" className="group p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 transition-all">
                            <div className="w-10 h-10 mx-auto text-[#45CFFF] mb-3 group-hover:scale-110 transition-transform">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                            </div>
                            <h4 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-1">Back to Home</h4>
                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Return to homepage</p>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HelpCenter;