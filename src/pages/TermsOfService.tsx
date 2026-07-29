import { FileText, Shield, Gavel, AlertTriangle, CheckCircle, XCircle, Globe, Lock, User, Mail } from "lucide-react";

const TermsOfService = () => {
    const lastUpdated = "January 15, 2025";
    const effectiveDate = "January 15, 2025";
    const version = "2.1";

    const sections = [
        {
            id: "acceptance",
            icon: FileText,
            title: "1. Acceptance of Terms",
            content: [
                "By accessing, browsing, or using the Entra Global Tech website (\"Website\") and our services (\"Services\"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service (\"Terms\"), including our Privacy Policy and any additional guidelines, rules, or policies referenced herein.",
                "If you do not agree with any part of these Terms, you must not access or use our Website or Services. Your continued use of the Website or Services following the posting of changes to these Terms constitutes acceptance of those changes.",
                "<strong>Eligibility:</strong> You must be at least 18 years old and have the legal capacity to enter into binding contracts to use our Services. By using our Services, you represent and warrant that you meet these requirements."
            ]
        },
        {
            id: "services",
            icon: Shield,
            title: "2. Description of Services",
            content: [
                "Entra Global Tech provides digital solutions including but not limited to: web development, mobile app development, UI/UX design, digital marketing, SEO services, domain registration, hosting solutions, graphic design, branding, and consulting services (collectively, \"Services\").",
                "We reserve the right to modify, suspend, or discontinue any Service at any time without prior notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of Services.",
                "Specific Service details, deliverables, timelines, and pricing are outlined in individual Service Agreements, Proposals, or Statements of Work (\"SOW\") agreed upon between you and Entra Global Tech."
            ]
        },
        {
            id: "user-accounts",
            icon: User,
            title: "3. User Accounts & Registration",
            content: [
                "To access certain features of our Services, you may be required to create an account. You agree to:",
                "<ul className=\"list-disc list-inside space-y-2 mt-2 ml-4\"><li>Provide accurate, current, and complete information during registration</li><li>Maintain the security of your account credentials</li><li>Accept responsibility for all activities under your account</li><li>Notify us immediately of any unauthorized use or security breach</li><li>Not share your account with unauthorized persons</li></ul>",
                "We reserve the right to suspend or terminate accounts that violate these Terms or engage in suspicious activity."
            ]
        },
        {
            id: "user-obligations",
            icon: Gavel,
            title: "4. User Obligations & Prohibited Conduct",
            content: [
                "You agree not to use our Website or Services for any unlawful or prohibited purpose. You shall not:",
                "<ul className=\"list-disc list-inside space-y-2 mt-2 ml-4\"><li>Violate any applicable laws, regulations, or third-party rights</li><li>Attempt to gain unauthorized access to our systems or networks</li><li>Interfere with or disrupt the integrity or performance of our Services</li><li>Transmit viruses, malware, or other harmful code</li><li>Scrape, crawl, or harvest data from our Website without permission</li><li>Use our Services to send spam, phishing, or unsolicited communications</li><li>Impersonate any person or entity or misrepresent your affiliation</li><li>Reverse engineer, decompile, or attempt to derive source code</li><li>Remove or alter any proprietary notices or labels</li><li>Use our Services for competitive analysis or benchmarking without consent</li></ul>",
                "We reserve the right to investigate and take appropriate legal action against anyone who violates these provisions."
            ]
        },
        {
            id: "intellectual-property",
            icon: Lock,
            title: "5. Intellectual Property Rights",
            content: [
                "<strong>Our Intellectual Property:</strong> All content, features, functionality, designs, graphics, logos, trademarks, service marks, trade names, software, algorithms, and other materials on our Website and Services (\"Our IP\") are owned by or licensed to Entra Global Tech and are protected by copyright, trademark, patent, and other intellectual property laws.",
                "<strong>Your License to Us:</strong> By submitting content through our Services (feedback, testimonials, project requirements, etc.), you grant us a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, modify, adapt, publish, translate, and distribute such content for the purpose of providing and improving our Services.",
                "<strong>Client Work Product:</strong> Intellectual property rights for custom deliverables created under a Service Agreement are governed by the specific terms of that agreement. Generally, upon full payment, clients receive ownership of final deliverables as specified in the SOW.",
                "<strong>Restrictions:</strong> You may not copy, modify, distribute, sell, lease, license, or create derivative works of Our IP without our prior written consent."
            ]
        },
        {
            id: "payments-billing",
            icon: Globe,
            title: "6. Payments, Billing & Refunds",
            content: [
                "<strong>Pricing:</strong> Service fees are as specified in the applicable Service Agreement, Proposal, or SOW. We reserve the right to change pricing with 30 days' notice for recurring services.",
                "<strong>Payment Terms:</strong> Invoices are due upon receipt unless otherwise specified. Late payments may incur a 1.5% monthly interest charge. We accept bank transfers, credit cards, and other agreed payment methods.",
                "<strong>Refund Policy:</strong> Refunds for services are handled case-by-case. Generally:",
                "<ul className=\"list-disc list-inside space-y-2 mt-2 ml-4\"><li>Discovery/consultation fees are non-refundable once work begins</li><li>Design/development work: refunds prorated based on work completed</li><li>Domain/hosting: non-refundable after registration/provisioning</li><li>Digital marketing: refunds for unused prepaid months only</li></ul>",
                "<strong>Disputes:</strong> Billing disputes must be raised in writing within 15 days of invoice date."
            ]
        },
        {
            id: "confidentiality",
            icon: Lock,
            title: "7. Confidentiality",
            content: [
                "Both parties agree to keep confidential all non-public information disclosed during the course of the business relationship (\"Confidential Information\"). This includes: business plans, technical data, trade secrets, customer lists, pricing, and proprietary methodologies.",
                "Confidential Information does not include information that: (a) is publicly known, (b) becomes publicly known through no fault of the receiving party, (c) was known prior to disclosure, or (d) is independently developed.",
                "Confidentiality obligations survive termination of these Terms for a period of 3 years."
            ]
        },
        {
            id: "warranties-disclaimers",
            icon: AlertTriangle,
            title: "8. Warranties & Disclaimers",
            content: [
                "<strong>Our Warranties:</strong> We warrant that our Services will be performed in a professional and workmanlike manner consistent with industry standards.",
                "<strong>Disclaimers:</strong> TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR WEBSITE AND SERVICES ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.",
                "We do not warrant that: (a) the Website or Services will be uninterrupted, timely, secure, or error-free; (b) results obtained will be accurate or reliable; (c) defects will be corrected; or (d) the Website/Services are free of viruses or harmful components."
            ]
        },
        {
            id: "limitation-liability",
            icon: XCircle,
            title: "9. Limitation of Liability",
            content: [
                "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ENTRA GLOBAL TECH, ITS DIRECTORS, EMPLOYEES, AGENTS, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION: LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM: (A) YOUR USE OR INABILITY TO USE THE SERVICES; (B) UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR DATA; (C) STATEMENTS OR CONDUCT OF ANY THIRD PARTY; OR (D) ANY OTHER MATTER RELATING TO THE SERVICES.",
                "<strong>Cap on Liability:</strong> Our total aggregate liability for any claims arising out of or related to these Terms shall not exceed the total fees paid by you to Entra Global Tech in the 12 months preceding the claim, or $1,000 USD, whichever is greater.",
                "These limitations apply regardless of the legal theory (contract, tort, negligence, strict liability, etc.) and even if we have been advised of the possibility of such damages."
            ]
        },
        {
            id: "indemnification",
            icon: Shield,
            title: "10. Indemnification",
            content: [
                "You agree to defend, indemnify, and hold harmless Entra Global Tech and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or expenses (including reasonable attorney's fees) arising from: (a) your use of the Services; (b) your violation of these Terms; (c) your violation of any third-party right; or (d) any content you submit through our Services."
            ]
        },
        {
            id: "termination",
            icon: XCircle,
            title: "11. Termination",
            content: [
                "We may terminate or suspend your access to our Services immediately, without prior notice, for any reason, including breach of these Terms. Upon termination: (a) your right to use the Services ceases immediately; (b) you remain liable for all fees incurred prior to termination; (c) provisions that by their nature should survive (confidentiality, IP, liability limitations, indemnification) shall survive.",
                "You may terminate your account at any time by contacting us. Refunds upon termination are subject to our Refund Policy (Section 6)."
            ]
        },
        {
            id: "governing-law",
            icon: Gavel,
            title: "12. Governing Law & Dispute Resolution",
            content: [
                "These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to conflict of law principles.",
                "<strong>Dispute Resolution:</strong> Any dispute arising out of these Terms shall be resolved through:",
                "<ol className=\"list-decimal list-inside space-y-2 mt-2 ml-4\"><li><strong>Good Faith Negotiation:</strong> Parties shall attempt to resolve disputes informally within 30 days</li><li><strong>Mediation:</strong> If negotiation fails, parties shall submit to binding mediation in Dhaka, Bangladesh</li><li><strong>Arbitration:</strong> If mediation fails, disputes shall be resolved by binding arbitration under the rules of the Bangladesh International Arbitration Centre</li></ol>",
                "The language of arbitration shall be English. The award shall be final and binding."
            ]
        },
        {
            id: "general",
            icon: FileText,
            title: "13. General Provisions",
            content: [
                "<strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy and any Service Agreements, constitute the entire agreement between you and Entra Global Tech.",
                "<strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions shall continue in full force and effect.",
                "<strong>Waiver:</strong> Failure to enforce any right does not constitute a waiver of that right.",
                "<strong>Assignment:</strong> You may not assign these Terms without our prior written consent. We may assign these Terms freely.",
                "<strong>Force Majeure:</strong> Neither party is liable for delays due to causes beyond reasonable control (natural disasters, war, strikes, government actions, etc.).",
                "<strong>Notices:</strong> Notices to you may be made via email or posting on the Website. Notices to us must be sent to legal@entraglobaltech.com.",
                "<strong>No Agency:</strong> These Terms do not create any agency, partnership, or joint venture relationship."
            ]
        },
        {
            id: "changes",
            icon: AlertTriangle,
            title: "14. Changes to Terms",
            content: [
                "We may modify these Terms at any time. Material changes will be communicated via email or prominent notice on the Website at least 30 days before the effective date. Your continued use after the effective date constitutes acceptance.",
                "We recommend reviewing these Terms periodically. The \"Last Updated\" date at the top indicates the most recent revision."
            ]
        },
        {
            id: "contact",
            icon: Mail,
            title: "15. Contact Information",
            content: [
                "If you have any questions about these Terms of Service, please contact us:",
                "<div className=\"mt-4 space-y-2\">",
                "<p><strong>Entra Global Tech</strong></p>",
                "<p>Email: <a href=\"mailto:legal@entraglobaltech.com\" className=\"text-[#45CFFF] hover:underline\">legal@entraglobaltech.com</a></p>",
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
                            <FileText size={16} />
                            <span>Terms of Service</span>
                        </div>
                        <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-bold text-[#060B14] dark:text-white leading-tight mb-6">
                            Terms of <span className="text-[#45CFFF]">Service</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#4A5568] dark:text-[#A0AEC0] mb-8 max-w-2xl mx-auto leading-relaxed">
                            Please read these terms carefully before using our website and services. By accessing our services, you agree to be bound by these terms.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#718096] dark:text-[#A0AEC0]">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-[#45CFFF]" />
                                <span>Version {version}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-[#45CFFF]" />
                                <span>Last Updated: {lastUpdated}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-[#45CFFF]" />
                                <span>Effective: {effectiveDate}</span>
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

            {/* Terms Content */}
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

                    {/* Important Notice */}
                    <div className="mt-20 p-8 rounded-2xl bg-[#FFF3E0] dark:bg-[#3D2A00] border border-[#FFE0B2] dark:border-[#8D6E00]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="font-sora text-lg font-bold text-[#78350F] dark:text-[#FDE68A] mb-2">Important Legal Notice</h3>
                                <p className="text-[#92400E] dark:text-[#FCD34D]">
                                    These Terms of Service constitute a legally binding agreement between you and Entra Global Tech.
                                    By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
                                    If you do not agree, please do not use our services.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white">
                        <div className="text-center max-w-2xl mx-auto">
                            <h3 className="font-sora text-2xl md:text-3xl font-bold mb-4">Questions About These Terms?</h3>
                            <p className="text-blue-100 mb-6">Our legal team is available to clarify any questions you may have about our Terms of Service.</p>
                            <a
                                href="mailto:legal@entraglobaltech.com"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all duration-300 backdrop-blur-sm"
                            >
                                <Mail size={20} />
                                Contact Legal Team
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links Footer */}
            <section className="py-16 px-4 bg-[#F9FAFC] dark:bg-[#040911] border-t border-[#E2E8F0] dark:border-[#2D3748]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <a href="/privacy-policy" className="group p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 transition-all">
                            <svg className="w-10 h-10 mx-auto text-[#45CFFF] mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            <h4 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-1">Privacy Policy</h4>
                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">How we protect your data</p>
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

export default TermsOfService;