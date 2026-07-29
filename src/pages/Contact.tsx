

import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useState } from "react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#060B14]">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32 px-4 bg-white dark:bg-[#060B14]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#45CFFF]/10 text-[#45CFFF] text-sm font-medium mb-6">
                            <Mail size={16} />
                            <span>Get in Touch</span>
                        </div>
                        <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-bold text-[#060B14] dark:text-white leading-tight mb-6">
                            Let's Start a <span className="text-[#45CFFF]">Conversation</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#4A5568] dark:text-[#A0AEC0] mb-10 max-w-2xl mx-auto leading-relaxed">
                            Have a project in mind? Need help with your digital strategy?
                            We'd love to hear from you. Send us a message and we'll respond within 24 hours.
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-6 md:gap-8 max-w-md mx-auto">
                            <div className="p-4 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748]">
                                <div className="font-sora text-2xl font-bold text-[#060B14] dark:text-white">24h</div>
                                <div className="text-sm text-[#718096] dark:text-[#A0AEC0]">Response Time</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748]">
                                <div className="font-sora text-2xl font-bold text-[#060B14] dark:text-white">98%</div>
                                <div className="text-sm text-[#718096] dark:text-[#A0AEC0]">Satisfaction Rate</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-[#F7FAFC] dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748]">
                                <div className="font-sora text-2xl font-bold text-[#060B14] dark:text-white">500+</div>
                                <div className="text-sm text-[#718096] dark:text-[#A0AEC0]">Projects Delivered</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info Section */}
            <section className="py-20 md:py-28 px-4 bg-[#F9FAFC] dark:bg-[#040911]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] sticky top-24">
                                <h2 className="font-sora text-2xl font-bold text-[#060B14] dark:text-white mb-6">Contact Information</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#45CFFF]/10 flex items-center justify-center text-[#45CFFF]">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-1">Email Us</h3>
                                            <p className="text-[#4A5568] dark:text-[#A0AEC0]">entraglobaltech@gmail.com</p>
                                            <p className="text-[#4A5568] dark:text-[#A0AEC0]">info@entraglobaltech.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#45CFFF]/10 flex items-center justify-center text-[#45CFFF]">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-1">Call Us</h3>
                                            <p className="text-[#4A5568] dark:text-[#A0AEC0]">+88 01927001333</p>
                                            <p className="text-[#4A5568] dark:text-[#A0AEC0]">Sat-Thu: 9AM - 6PM (GMT+6)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#45CFFF]/10 flex items-center justify-center text-[#45CFFF]">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-1">Visit Us</h3>
                                            <p className="text-[#4A5568] dark:text-[#A0AEC0]">Entra Global Tech Head Office</p>
                                            <p className="text-[#4A5568] dark:text-[#A0AEC0]">level-5,Hazi Asraf Ali Market,Shewrapara,Dhaka, Bangladesh</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748]">
                                <h3 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 rounded-xl bg-[#F7FAFC] dark:bg-[#1A202C] border border-[#E2E8F0] dark:border-[#2D3748] flex items-center justify-center text-[#4A5568] dark:text-[#A0AEC0] hover:bg-[#45CFFF] hover:border-[#45CFFF] hover:text-white transition-all duration-300">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-xl bg-[#F7FAFC] dark:bg-[#1A202C] border border-[#E2E8F0] dark:border-[#2D3748] flex items-center justify-center text-[#4A5568] dark:text-[#A0AEC0] hover:bg-[#E84393] hover:border-[#E84393] hover:text-white transition-all duration-300">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-xl bg-[#F7FAFC] dark:bg-[#1A202C] border border-[#E2E8F0] dark:border-[#2D3748] flex items-center justify-center text-[#4A5568] dark:text-[#A0AEC0] hover:bg-[#0077B5] hover:border-[#0077B5] hover:text-white transition-all duration-300">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-xl bg-[#F7FAFC] dark:bg-[#1A202C] border border-[#E2E8F0] dark:border-[#2D3748] flex items-center justify-center text-[#4A5568] dark:text-[#A0AEC0] hover:bg-[#1DA1F2] hover:border-[#1DA1F2] hover:text-white transition-all duration-300">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748]">
                                <h2 className="font-sora text-2xl font-bold text-[#060B14] dark:text-white mb-6">Send Us a Message</h2>

                                {submitStatus === "success" && (
                                    <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-green-800 dark:text-green-200">Message Sent Successfully!</p>
                                            <p className="text-sm text-green-700 dark:text-green-300">We'll get back to you within 24 hours.</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-[#4A5568] dark:text-[#A0AEC0] mb-2">Full Name *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-[#060B14] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] focus:border-transparent transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-[#4A5568] dark:text-[#A0AEC0] mb-2">Email Address *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-[#060B14] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] focus:border-transparent transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-[#4A5568] dark:text-[#A0AEC0] mb-2">Subject *</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-[#060B14] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF] focus:border-transparent transition-all"
                                        >
                                            <option value="">Select a topic</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="sales">Sales & Partnerships</option>
                                            <option value="support">Technical Support</option>
                                            <option value="billing">Billing & Payments</option>
                                            <option value="careers">Careers</option>
                                            <option value="press">Press & Media</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-[#4A5568] dark:text-[#A0AEC0] mb-2">Message *</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-[#060B14] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] focus:border-transparent transition-all resize-none"
                                            placeholder="Tell us about your project, goals, or how we can help..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white font-semibold text-base hover:opacity-90 hover:shadow-xl hover:shadow-[#1E56E0]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send size={20} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Quick Links */}
            <section className="py-20 px-4 bg-white dark:bg-[#060B14]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="font-sora text-3xl md:text-4xl font-bold text-[#060B14] dark:text-white mb-4">
                            Quick Answers
                        </h2>
                        <p className="text-lg text-[#4A5568] dark:text-[#A0AEC0]">
                            Find answers to common questions or browse our help center
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <a href="/help-center" className="group p-6 rounded-2xl bg-[#F9FAFC] dark:bg-[#040911] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 hover:shadow-xl hover:shadow-[#45CFFF]/10 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-[#45CFFF]/10 flex items-center justify-center text-[#45CFFF] mb-4 group-hover:scale-110 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            </div>
                            <h3 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-2">Help Center</h3>
                            <p className="text-[#4A5568] dark:text-[#A0AEC0] text-sm">Browse articles & guides</p>
                        </a>
                        <a href="/privacy-policy" className="group p-6 rounded-2xl bg-[#F9FAFC] dark:bg-[#040911] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 hover:shadow-xl hover:shadow-[#45CFFF]/10 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-[#45CFFF]/10 flex items-center justify-center text-[#45CFFF] mb-4 group-hover:scale-110 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <h3 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-2">Privacy Policy</h3>
                            <p className="text-[#4A5568] dark:text-[#A0AEC0] text-sm">How we protect your data</p>
                        </a>
                        <a href="/terms-of-service" className="group p-6 rounded-2xl bg-[#F9FAFC] dark:bg-[#040911] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 hover:shadow-xl hover:shadow-[#45CFFF]/10 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-[#45CFFF]/10 flex items-center justify-center text-[#45CFFF] mb-4 group-hover:scale-110 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            </div>
                            <h3 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-2">Terms of Service</h3>
                            <p className="text-[#4A5568] dark:text-[#A0AEC0] text-sm">Our terms & conditions</p>
                        </a>
                        <a href="/contact" className="group p-6 rounded-2xl bg-[#F9FAFC] dark:bg-[#040911] border border-[#E2E8F0] dark:border-[#2D3748] hover:border-[#45CFFF]/50 hover:shadow-xl hover:shadow-[#45CFFF]/10 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-[#45CFFF]/10 flex items-center justify-center text-[#45CFFF] mb-4 group-hover:scale-110 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                            </div>
                            <h3 className="font-sora text-lg font-semibold text-[#060B14] dark:text-white mb-2">Contact Support</h3>
                            <p className="text-[#4A5568] dark:text-[#A0AEC0] text-sm">Get personalized help</p>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
