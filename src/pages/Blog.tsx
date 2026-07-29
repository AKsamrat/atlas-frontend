import { useState } from "react";
import {
    Search,
    Clock,
    ArrowRight,
    Tag,
    Calendar,
    User,
    BookOpen,
    TrendingUp,
    MessageCircle,
    Share2,
    ChevronRight,
    Layers,
    Globe,
    Code,
    Palette,
    Megaphone,
    Zap,
    Filter,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Blog Page — Entra Global Tech                                      */
/*  Full blog listing with categories, featured post, search, newsletter */
/* ------------------------------------------------------------------ */

const categories = [
    { id: "all", label: "All Posts", icon: Layers, count: 24 },
    { id: "web-development", label: "Web Development", icon: Code, count: 8 },
    { id: "design", label: "Design", icon: Palette, count: 6 },
    { id: "marketing", label: "Digital Marketing", icon: Megaphone, count: 5 },
    { id: "hosting", label: "Domains & Hosting", icon: Globe, count: 3 },
    { id: "tips", label: "Tips & Tutorials", icon: Zap, count: 2 },
];

const blogPosts = [
    {
        id: 1,
        title: "The Complete Guide to Building a Modern Web Application in 2025",
        excerpt: "From choosing the right framework to deploying at scale — a comprehensive walkthrough of modern web development best practices, performance optimization, and security considerations.",
        category: "web-development",
        author: "Entra Tech Team",
        date: "Jan 15, 2025",
        readTime: "12 min read",
        views: "3.2k",
        comments: 24,
        featured: true,
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop",
        tags: ["React", "TypeScript", "Performance"],
    },
    {
        id: 2,
        title: "Why Your Business Needs a Professional Logo: Beyond Just Aesthetics",
        excerpt: "Discover how a well-designed logo builds trust, communicates your brand values, and creates lasting impressions that drive customer loyalty and recognition.",
        category: "design",
        author: "Design Studio",
        date: "Jan 12, 2025",
        readTime: "8 min read",
        views: "2.1k",
        comments: 18,
        featured: false,
        image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=500&fit=crop",
        tags: ["Logo", "Branding", "Identity"],
    },
    {
        id: 3,
        title: "Facebook vs Instagram Marketing: Which Platform Is Right for Your Business?",
        excerpt: "A data-driven comparison of Facebook and Instagram advertising platforms, including audience demographics, ad formats, costs, and ROI benchmarks for 2025.",
        category: "marketing",
        author: "Marketing Team",
        date: "Jan 10, 2025",
        readTime: "10 min read",
        views: "4.5k",
        comments: 32,
        featured: false,
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop",
        tags: ["Facebook", "Instagram", "Ads"],
    },
    {
        id: 4,
        title: "Domain Registration 101: How to Choose and Register the Perfect Domain Name",
        excerpt: "Tips for selecting a memorable domain name, understanding DNS records, configuring email hosting, and protecting your brand with domain privacy settings.",
        category: "hosting",
        author: "Hosting Team",
        date: "Jan 8, 2025",
        readTime: "6 min read",
        views: "1.8k",
        comments: 12,
        featured: false,
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
        tags: ["Domain", "DNS", "Hosting"],
    },
    {
        id: 5,
        title: "10 UI/UX Design Trends That Will Dominate 2025",
        excerpt: "Explore the latest design trends including glassmorphism, micro-interactions, AI-powered interfaces, and immersive 3D experiences that are reshaping digital products.",
        category: "design",
        author: "Design Studio",
        date: "Jan 5, 2025",
        readTime: "9 min read",
        views: "5.3k",
        comments: 41,
        featured: false,
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop",
        tags: ["UI/UX", "Trends", "2025"],
    },
    {
        id: 6,
        title: "How to Speed Up Your Website: A Developer's Guide to Core Web Vitals",
        excerpt: "Practical techniques to improve LCP, FID, and CLS scores. Learn lazy loading, code splitting, image optimization, and CDN strategies for blazing-fast sites.",
        category: "web-development",
        author: "Entra Tech Team",
        date: "Jan 3, 2025",
        readTime: "11 min read",
        views: "2.9k",
        comments: 27,
        featured: false,
        image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=500&fit=crop",
        tags: ["Performance", "SEO", "Speed"],
    },
    {
        id: 7,
        title: "SEO in 2025: What's Changed and How to Stay Ahead",
        excerpt: "Google's latest algorithm updates, AI-generated content guidelines, voice search optimization, and local SEO strategies that actually work in 2025.",
        category: "marketing",
        author: "Marketing Team",
        date: "Dec 28, 2024",
        readTime: "14 min read",
        views: "6.1k",
        comments: 38,
        featured: false,
        image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&h=500&fit=crop",
        tags: ["SEO", "Google", "Algorithm"],
    },
    {
        id: 8,
        title: "Building Accessible Web Applications: A Practical Checklist",
        excerpt: "Ensure your website meets WCAG 2.1 AA standards with this actionable checklist covering semantic HTML, ARIA attributes, color contrast, keyboard navigation, and screen reader testing.",
        category: "web-development",
        author: "Entra Tech Team",
        date: "Dec 25, 2024",
        readTime: "7 min read",
        views: "1.4k",
        comments: 15,
        featured: false,
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=500&fit=crop",
        tags: ["Accessibility", "WCAG", "Inclusive"],
    },
    {
        id: 9,
        title: "Email Marketing Best Practices: From Subscriber to Customer",
        excerpt: "Craft compelling subject lines, segment your audience, automate sequences, and measure campaign performance with these proven email marketing strategies.",
        category: "marketing",
        author: "Marketing Team",
        date: "Dec 22, 2024",
        readTime: "8 min read",
        views: "3.7k",
        comments: 22,
        featured: false,
        image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=500&fit=crop",
        tags: ["Email", "Automation", "Campaign"],
    },
];

const trendingTopics = [
    "React 19",
    "AI in Web Dev",
    "Dark Mode UX",
    "Core Web Vitals",
    "Social Commerce",
    "Headless CMS",
];

export default function Blog() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredPosts = blogPosts.filter((post) => {
        const matchesCategory = activeCategory === "all" || post.category === activeCategory;
        const matchesSearch =
            searchQuery === "" ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const featuredPost = blogPosts.find((p) => p.featured);
    const regularPosts = filteredPosts.filter((p) => !p.featured);

    return (
        <div className="min-h-screen bg-white dark:bg-[#060B14]">
            {/* ============================================================ */}
            {/*  Hero Section                                                 */}
            {/* ============================================================ */}
            <section className="relative overflow-hidden py-20 md:py-32 px-4 bg-white dark:bg-[#060B14]">
                {/* Background glows */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-[#45CFFF]/5 blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] rounded-full bg-[#1E56E0]/5 blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#45CFFF]/10 text-[#45CFFF] text-sm font-medium mb-6">
                            <BookOpen size={16} />
                            <span>Our Blog</span>
                        </div>
                        <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-bold text-[#060B14] dark:text-white leading-tight mb-6">
                            Insights &{" "}
                            <span className="text-[#45CFFF]">Resources</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#4A5568] dark:text-[#A0AEC0] mb-8 max-w-2xl mx-auto leading-relaxed">
                            Expert tips, industry trends, and practical guides to help you build, grow,
                            and optimize your digital presence.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0] text-xl" />
                                <input
                                    type="search"
                                    placeholder="Search articles, topics, tags..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-12 py-4 pl-12 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#060B14] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] focus:border-transparent transition-all text-base"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  Categories                                                   */}
            {/* ============================================================ */}
            <section className="py-8 px-4 bg-[#F9FAFC] dark:bg-[#040911] border-y border-[#E2E8F0] dark:border-[#2D3748]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat.id
                                        ? "bg-[#45CFFF] text-white shadow-lg shadow-[#45CFFF]/30"
                                        : "bg-white dark:bg-[#0F1E3D] text-[#4A5568] dark:text-[#A0AEC0] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 hover:text-[#45CFFF]"
                                    }`}
                            >
                                <cat.icon size={14} />
                                <span>{cat.label}</span>
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-xs ${activeCategory === cat.id
                                            ? "bg-white/20"
                                            : "bg-[#F1F5F9] dark:bg-[#1E293B]"
                                        }`}
                                >
                                    {cat.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  Featured Post (only when on "all" category)                   */}
            {/* ============================================================ */}
            {activeCategory === "all" && featuredPost && (
                <section className="py-16 px-4 bg-white dark:bg-[#060B14]">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 mb-8">
                            <TrendingUp size={20} className="text-[#45CFFF]" />
                            <h2 className="font-sora text-2xl font-bold text-[#060B14] dark:text-white">
                                Featured Article
                            </h2>
                        </div>

                        <article className="group grid lg:grid-cols-2 gap-8 p-6 md:p-8 rounded-3xl bg-[#F9FAFC] dark:bg-[#040911] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/30 hover:shadow-2xl hover:shadow-[#45CFFF]/10 transition-all duration-500">
                            {/* Image */}
                            <div className="relative overflow-hidden rounded-2xl aspect-[16/10]">
                                <img
                                    src={featuredPost.image}
                                    alt={featuredPost.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#45CFFF] text-[#060B14] text-xs font-bold uppercase tracking-wider">
                                    Featured
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#45CFFF]/10 text-[#45CFFF]">
                                        {categories.find((c) => c.id === featuredPost.category)?.label || featuredPost.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-[#A0AEC0]">
                                        <Clock size={12} />
                                        {featuredPost.readTime}
                                    </span>
                                </div>

                                <h3 className="font-sora text-2xl md:text-3xl font-bold text-[#060B14] dark:text-white mb-4 group-hover:text-[#45CFFF] transition-colors leading-tight">
                                    {featuredPost.title}
                                </h3>

                                <p className="text-[#4A5568] dark:text-[#A0AEC0] leading-relaxed mb-6">
                                    {featuredPost.excerpt}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {featuredPost.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5 text-sm text-[#718096] dark:text-[#A0AEC0]">
                                            <User size={14} />
                                            {featuredPost.author}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-sm text-[#718096] dark:text-[#A0AEC0]">
                                            <Calendar size={14} />
                                            {featuredPost.date}
                                        </span>
                                    </div>
                                    <a
                                        href={`/blog/${featuredPost.id}`}
                                        className="inline-flex items-center gap-2 text-[#45CFFF] font-semibold hover:underline"
                                    >
                                        Read Article
                                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>
            )}

            {/* ============================================================ */}
            {/*  Blog Posts Grid                                               */}
            {/* ============================================================ */}
            <section className="py-16 px-4 bg-white dark:bg-[#060B14]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="font-sora text-3xl font-bold text-[#060B14] dark:text-white mb-2">
                                {activeCategory === "all"
                                    ? "Latest Articles"
                                    : categories.find((c) => c.id === activeCategory)?.label || "Articles"}
                            </h2>
                            <p className="text-[#4A5568] dark:text-[#A0AEC0]">
                                {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} found
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-sm text-[#718096] dark:text-[#A0AEC0]">
                            <Filter size={14} />
                            <span>Sort by: Latest</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {regularPosts.map((post) => (
                            <article
                                key={post.id}
                                className="group flex flex-col rounded-2xl bg-[#F9FAFC] dark:bg-[#040911] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/40 hover:shadow-xl hover:shadow-[#45CFFF]/10 transition-all duration-300 overflow-hidden"
                            >
                                {/* Image */}
                                <div className="relative overflow-hidden aspect-[16/10]">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#45CFFF]/10 text-[#45CFFF] backdrop-blur-sm">
                                            {categories.find((c) => c.id === post.category)?.label || post.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-1 p-6">
                                    <div className="flex items-center gap-3 mb-3 text-xs text-[#A0AEC0]">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {post.date}
                                        </span>
                                        <span className="h-3 w-px bg-[#E2E8F0] dark:bg-[#2D3748]" />
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {post.readTime}
                                        </span>
                                    </div>

                                    <h3 className="font-sora text-lg font-bold text-[#060B14] dark:text-white mb-3 group-hover:text-[#45CFFF] transition-colors line-clamp-2 leading-snug">
                                        {post.title}
                                    </h3>

                                    <p className="text-sm text-[#4A5568] dark:text-[#A0AEC0] mb-4 flex-1 leading-relaxed line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 rounded text-xs bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1 text-xs text-[#A0AEC0]">
                                                <User size={12} />
                                                {post.author}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-[#A0AEC0]">
                                                <MessageCircle size={12} />
                                                {post.comments}
                                            </span>
                                        </div>
                                        <a
                                            href={`/blog/${post.id}`}
                                            className="inline-flex items-center gap-1 text-sm font-medium text-[#45CFFF] hover:underline"
                                        >
                                            Read
                                            <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {regularPosts.length === 0 && (
                        <div className="text-center py-20">
                            <Search className="w-12 h-12 mx-auto text-[#A0AEC0] mb-4" />
                            <h3 className="font-sora text-xl font-semibold text-[#060B14] dark:text-white mb-2">
                                No articles found
                            </h3>
                            <p className="text-[#718096] dark:text-[#A0AEC0]">
                                Try adjusting your search terms or category filter.
                            </p>
                        </div>
                    )}

                    {/* Load More */}
                    {regularPosts.length > 0 && (
                        <div className="text-center mt-12">
                            <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#45CFFF]/10 hover:bg-[#45CFFF]/20 text-[#45CFFF] font-semibold transition-all duration-300 border border-[#45CFFF]/20 hover:border-[#45CFFF]/40">
                                Load More Articles
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ============================================================ */}
            {/*  Newsletter CTA                                                */}
            {/* ============================================================ */}
            <section className="py-20 px-4 bg-[#F9FAFC] dark:bg-[#040911] border-y border-[#E2E8F0] dark:border-[#2D3748]">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#45CFFF]/10 text-[#45CFFF] text-sm font-medium mb-6">
                        <Tag size={16} />
                        <span>Stay Updated</span>
                    </div>
                    <h2 className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white mb-4">
                        Never Miss an{" "}
                        <span className="text-[#45CFFF]">Update</span>
                    </h2>
                    <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0] mb-8 max-w-2xl mx-auto">
                        Subscribe to our newsletter and get the latest articles, tips, and industry insights
                        delivered straight to your inbox.
                    </p>

                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                    >
                        <input
                            type="email"
                            placeholder="you@company.com"
                            className="flex-1 px-5 py-3.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#060B14] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] focus:border-transparent transition-all"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white font-semibold hover:opacity-90 hover:shadow-lg hover:shadow-[#1E56E0]/30 transition-all duration-300 whitespace-nowrap"
                        >
                            Subscribe
                        </button>
                    </form>

                    <p className="mt-4 text-xs text-[#A0AEC0]">
                        No spam, unsubscribe at any time. We respect your privacy.
                    </p>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  Sidebar-style: Trending Topics + Quick Links                  */}
            {/* ============================================================ */}
            <section className="py-20 px-4 bg-white dark:bg-[#060B14]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Trending Topics */}
                        <div className="lg:col-span-2">
                            <h2 className="font-sora text-2xl font-bold text-[#060B14] dark:text-white mb-8">
                                Trending Topics
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {trendingTopics.map((topic) => (
                                    <a
                                        key={topic}
                                        href={`/blog?topic=${encodeURIComponent(topic)}`}
                                        className="group flex items-center gap-3 p-4 rounded-xl bg-[#F9FAFC] dark:bg-[#040911] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/40 hover:bg-white dark:hover:bg-[#0F1E3D] transition-all duration-300"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-[#45CFFF]/10 flex items-center justify-center text-[#45CFFF] group-hover:scale-110 transition-transform">
                                            <TrendingUp size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-medium text-[#060B14] dark:text-white group-hover:text-[#45CFFF] transition-colors">
                                                {topic}
                                            </span>
                                        </div>
                                        <ChevronRight size={16} className="text-[#A0AEC0] group-hover:text-[#45CFFF] group-hover:translate-x-1 transition-all" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h2 className="font-sora text-2xl font-bold text-[#060B14] dark:text-white mb-8">
                                Quick Links
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { label: "Contact Us", href: "/contact" },
                                    { label: "About Our Team", href: "/about-us" },
                                    { label: "Our Services", href: "/web-development" },
                                    { label: "Domain Hosting", href: "/domain-hosting" },
                                    { label: "Help Center", href: "/help-center" },
                                ].map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="group flex items-center justify-between p-4 rounded-xl bg-[#F9FAFC] dark:bg-[#040911] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/40 transition-all duration-300"
                                    >
                                        <span className="font-medium text-[#060B14] dark:text-white group-hover:text-[#45CFFF] transition-colors">
                                            {link.label}
                                        </span>
                                        <ArrowRight size={16} className="text-[#A0AEC0] group-hover:text-[#45CFFF] group-hover:translate-x-1 transition-all" />
                                    </a>
                                ))}
                            </div>

                            {/* Share */}
                            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#45CFFF]/10 to-[#1E56E0]/10 border border-[#45CFFF]/20">
                                <h3 className="font-sora text-lg font-bold text-[#060B14] dark:text-white mb-3">
                                    Share Our Blog
                                </h3>
                                <p className="text-sm text-[#4A5568] dark:text-[#A0AEC0] mb-4">
                                    Help others discover our content
                                </p>
                                <div className="flex items-center gap-2">
                                    {["Facebook", "Twitter", "LinkedIn"].map((platform) => (
                                        <a
                                            key={platform}
                                            href="#"
                                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/40 hover:text-[#45CFFF] transition-all"
                                        >
                                            <Share2 size={16} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
