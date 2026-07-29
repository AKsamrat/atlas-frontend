import { Shield, Lock, Eye, Database, Globe, User, Mail, Settings, AlertTriangle, CheckCircle } from "lucide-react";

const PrivacyPolicy = () => {
    const lastUpdated = "January 15, 2025";
    const effectiveDate = "January 15, 2025";

    const sections = [
        {
            id: "introduction",
            icon: Shield,
            title: "1. Introduction",
            content: [
                "Welcome to Entra Global Tech (\"we,\" \"our,\" \"us\"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us in any way.",
                "Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.",
                "We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the \"Last Updated\" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates."
            ]
        },
        {
            id: "information-we-collect",
            icon: Database,
            title: "2. Information We Collect",
            content: [
                "We collect information that you provide directly to us, information we collect automatically when you use our services, and information from third-party sources.",
                "<strong>Personal Information You Provide:</strong> We collect information you provide when you create an account, fill out forms, contact us, subscribe to newsletters, request quotes, or otherwise communicate with us. This may include: name, email address, phone number, company name, job title, billing/shipping addresses, payment information, and any other information you choose to provide.",
                "<strong>Automatically Collected Information:</strong> When you access our website or use our services, we automatically collect certain information about your device and usage patterns. This includes: IP address, browser type and version, operating system, device identifiers, referring URLs, pages visited, time spent on pages, clickstream data, and cookies/technologies.",
                "<strong>Third-Party Sources:</strong> We may receive information about you from third-party sources such as: analytics providers (Google Analytics), advertising networks, social media platforms (when you connect your account), and publicly available sources."
            ]
        },
        {
            id: "how-we-use",
            icon: Settings,
            title: "3. How We Use Your Information",
            content: [
                "We use the information we collect for the following purposes:",
                "<ul className=\"list-disc list-inside space-y-2 mt-2 ml-4\"><li>To provide, maintain, and improve our services</li><li>To process transactions and send related communications</li><li>To respond to your inquiries and provide customer support</li><li>To send marketing communications (with your consent)</li><li>To personalize your experience and deliver relevant content</li><li>To analyze usage trends and improve our website</li><li>To detect, prevent, and address fraud and security issues</li><li>To comply with legal obligations and enforce our terms</li><li>To develop new products and services</li></ul>",
                "We will not use your information for purposes other than those described in this Privacy Policy without your consent."
            ]
        },
        {
            id: "cookies-tracking",
            icon: Eye,
            title: "4. Cookies & Tracking Technologies",
            content: [
                "We use cookies, web beacons, pixels, and similar tracking technologies to collect information about your interactions with our website and services.",
                "<strong>Types of Cookies We Use:</strong>",
                "<ul className=\"list-disc list-inside space-y-2 mt-2 ml-4\"><li><strong>Essential Cookies:</strong> Required for the website to function properly (authentication, security, session management)</li><li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (Google Analytics)</li><li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign performance</li><li><strong>Preference Cookies:</strong> Remember your settings and preferences (language, region, theme)</li></ul>",
                "You can control cookies through your browser settings. However, disabling certain cookies may affect the functionality of our website. For more information, please see our Cookie Policy."
            ]
        },
        {
            id: "data-sharing",
            icon: Globe,
            title: "5. Data Sharing & Disclosure",
            content: [
                "We do not sell your personal information. We may share your information in the following circumstances:",
                "<ul className=\"list-disc list-inside space-y-2 mt-2 ml-4\"><li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (hosting, analytics, payment processing, email delivery, CRM)</li><li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li><li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li><li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property, and that of our users</li><li><strong>With Your Consent:</strong> When you explicitly agree to share information with third parties</li></ul>",
                "All third-party service providers are contractually obligated to protect your personal information and use it only for the purposes we specify."
            ]
        },
        {
            id: "data-security",
            icon: Lock,
            title: "6. Data Security",
            content: [
                "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:",
                "<ul className=\"list-disc list-inside space-y-2 mt-2 ml-4\"><li>Encryption of data in transit (TLS 1.2+) and at rest (AES-256)</li><li>Regular security assessments and vulnerability scanning</li><li>Access controls and authentication mechanisms</li><li>Employee training on data protection and privacy</li><li>Incident response and breach notification procedures</li></ul>",
                "However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security."
            ]
        },
        {
            id: "data-retention",
            icon: Database,
            title: "7. Data Retention",
            content: [
                "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.",
                "<ul className=\"list-disc list-inside space-y-2 mt-2 ml-4\"><li><strong>Account Data:</strong> Retained while your account is active and for 2 years after closure</li><li><strong>Transaction Data:</strong> Retained for 7 years for legal/tax compliance</li><li><strong>Marketing Data:</strong> Retained until you unsubscribe or request deletion</li><li><strong>Analytics Data:</strong> Retained for 26 months (Google Analytics default)</li><li><strong>Support Communications:</strong> Retained for 3 years</li></ul>"
            ]
        },
        {
            id: "your-rights",
            icon: User,
            title: "8. Your Rights & Choices",
            content: [
                "Depending on your location, you may have the following rights regarding your personal information:",
                "<ul className=\"list-disc list-inside space-y-2 mt-2 ml-4\"><li><strong>Access:</strong> Request a copy of your personal data</li><li><strong>Rectification:</strong> Request correction of inaccurate data</li><li><strong>Erasure:</strong> Request deletion of your data (\"right to be forgotten\")</li><li><strong>Restriction:</strong> Request limitation of processing</li><li><strong>Portability:</strong> Receive your data in a structured, commonly used format</li><li><strong>Objection:</strong> Object to processing for direct marketing or legitimate interests</li><li><strong>Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent</li><li><strong>Lodge Complaint:</strong> File a complaint with a supervisory authority</li></ul>",
                "To exercise any of these rights, please contact us at <a href=\"mailto:privacy@entraglobaltech.com\" className=\"text-[#45CFFF] hover:underline\">privacy@entraglobaltech.com</a>. We will respond within 30 days as required by applicable law."
            ]
        },
        {
            id: "international-transfers",
            icon: Globe,
            title: "9. International Data Transfers",
            content: [
                "Our services are hosted and operated from Bangladesh. If you are accessing our services from outside Bangladesh, your information may be transferred to, stored, and processed in Bangladesh where our servers are located and our central database is operated.",
                "We ensure appropriate safeguards are in place for international transfers, including Standard Contractual Clauses (SCCs) and adequacy decisions where applicable."
            ]
        },
        {
            id: "childrens-privacy",
            icon: AlertTriangle,
            title: "10. Children's Privacy",
            content: [
                "Our services are not directed to children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <a href=\"mailto:privacy@entraglobaltech.com\" className=\"text-[#45CFFF] hover:underline\">privacy@entraglobaltech.com</a>. If we become aware that we have collected personal information from a child under 16 without parental consent, we will take steps to delete that information."
            ]
        },
        {
            id: "third-party-links",
            icon: Globe,
            title: "11. Third-Party Links",
            content: [
                "Our website may contain links to third-party websites, applications, and services that are not operated by us. This Privacy Policy does not apply to those third-party services. We encourage you to review the privacy policies of any third-party services you use."
            ]
        },
        {
            id: "changes",
            icon: AlertTriangle,
            title: "12. Changes to This Privacy Policy",
            content: [
                "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last Updated\" date at the top of this policy.",
                "If we make material changes to how we process your personal information, we will provide you with additional notice (such as email notification or a prominent notice on our website) prior to the change becoming effective.",
                "We encourage you to review this Privacy Policy periodically for any changes."
            ]
        },
        {
            id: "contact",
            icon: Mail,
            title: "13. Contact Us",
            content: [
                "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:",
                "<div className=\"mt-4 space-y-2\">",
                "<p><strong>Entra Global Tech</strong></p>",
                "<p>Email: <a href=\"mailto:privacy@entraglobaltech.com\" className=\"text-[#45CFFF] hover:underline\">privacy@entraglobaltech.com</a></p>",
                "<p>Phone: +880 1234-567890</p>",
                "<p>Address: Entra Global Tech HQ, Dhaka, Bangladesh</p>",
                "</div>"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#060B14]">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32 px-4 bg-white dark:bg-[#060B14]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#45CFFF]/10 text-[#45CFFF] text-sm font-medium mb-6">
                            <Shield size={16} />
                            <span>Privacy Policy</span>
                        </div>
                        <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-bold text-[#060B14] dark:text-white leading-tight mb-6">
                            Your Privacy <span className="text-[#45CFFF]">Matters</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#4A5568] dark:text-[#A0AEC0] mb-8 max-w-2xl mx-auto leading-relaxed">
                            We are committed to protecting your personal information and being transparent about how we collect, use, and safeguard your data.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#718096] dark:text-[#A0AEC0]">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-[#45CFFF]" />
                                <span>Last Updated: {lastUpdated}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-[#45CFFF]" />
                                <span>Effective Date: {effectiveDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="py-12 px-4 bg-[#F9FAFC] dark:bg-[#040911] border-y border-[#E2E8F0] dark:border-[#2D3748]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-sora text-2xl font-bold text-[#060B14] dark:text-white mb-8">Table of Contents</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="group flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 hover:shadow-lg hover:shadow-[#45CFFF]/10 transition-all duration-300"
                            >
                                <section.icon className="w-5 h-5 text-[#45CFFF] group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-[#060B14] dark:text-white group-hover:text-[#45CFFF] transition-colors">
                                    {section.title}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Policy Content */}
            <section className="py-20 md:py-28 px-4 bg-white dark:bg-[#060B14]">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-16">
                        {sections.map((section) => (
                            <article
                                key={section.id}
                                id={section.id}
                                className="space-y-6"
                            >
                                <header className="flex items-start gap-4 pb-6 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#45CFFF]/10 flex items-center justify-center text-[#45CFFF]">
                                        <section.icon size={24} />
                                    </div>
                                    <h2 className="font-sora text-2xl md:text-3xl font-bold text-[#060B14] dark:text-white mt-1">
                                        {section.title}
                                    </h2>
                                </header>
                                <div className="prose prose-slate dark:prose-invert max-w-none text-[#4A5568] dark:text-[#A0AEC0] leading-relaxed">
                                    {section.content.map((paragraph, index) => (
                                        <p key={index} className="mb-4 last:mb-0" dangerouslySetInnerHTML={{ __html: paragraph }} />
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white">
                        <div className="text-center max-w-2xl mx-auto">
                            <h3 className="font-sora text-2xl md:text-3xl font-bold mb-4">Have Questions About Your Privacy?</h3>
                            <p className="text-blue-100 mb-6">Our Data Protection Officer is here to help. Contact us for any privacy-related inquiries.</p>
                            <a
                                href="mailto:privacy@entraglobaltech.com"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all duration-300 backdrop-blur-sm"
                            >
                                <Mail size={20} />
                                Contact Privacy Team
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links Footer */}
            <section className="py-16 px-4 bg-[#F9FAFC] dark:bg-[#040911] border-t border-[#E2E8F0] dark:border-[#2D3748]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <a href="/terms-of-service" className="group p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 transition-all">
                            <svg className="w-10 h-10 mx-auto text-[#45CFFF] mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            <h4 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-1">Terms of Service</h4>
                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Read our terms & conditions</p>
                        </a>
                        <a href="/help-center" className="group p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 transition-all">
                            <svg className="w-10 h-10 mx-auto text-[#45CFFF] mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            <h4 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-1">Help Center</h4>
                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Browse help articles</p>
                        </a>
                        <a href="/contact" className="group p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 transition-all">
                            <svg className="w-10 h-10 mx-auto text-[#45CFFF] mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                            <h4 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-1">Contact Us</h4>
                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Get in touch with us</p>
                        </a>
                        <a href="/" className="group p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 transition-all">
                            <svg className="w-10 h-10 mx-auto text-[#45CFFF] mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                            <h4 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-1">Back to Home</h4>
                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Return to homepage</p>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;