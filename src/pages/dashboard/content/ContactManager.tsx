import { useState, useEffect, useCallback } from "react";
import { contactApi, type ContactInfoData } from "../../../services/Contact";
import { FaSave, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaSpinner } from "react-icons/fa";

const DEFAULT_CONTACT: ContactInfoData = {
    id: 1,
    phone: "",
    email: "",
    address: "",
    tagline: "",
    social_facebook: "",
    social_instagram: "",
    social_linkedin: "",
    social_twitter: "",
};

export default function ContactManager() {
    const [contact, setContact] = useState<ContactInfoData>(DEFAULT_CONTACT);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContact = useCallback(async () => {
        try {
            setLoading(true);
            const res = await contactApi.get();
            setContact(res.data);
        } catch {
            setError("Failed to load contact info.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchContact(); }, [fetchContact]);

    const handleChange = (field: keyof ContactInfoData, value: string) => {
        setContact((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await contactApi.update(contact);
            setContact(res.data);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch {
            setError("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <FaSpinner className="animate-spin text-[#45CFFF] text-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                    {error}
                    <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
                </div>
            )}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1f36] dark:text-white">Contact Info & Branding</h2>
                    <p className="text-sm text-[#596887] dark:text-[#B9C7E0] mt-1">Manage contact information, tagline, and social media links.</p>
                </div>
                <button onClick={handleSave} disabled={saving} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${saved ? "bg-green-500 text-white" : "bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white hover:opacity-90"}`}>
                    {saving ? <FaSpinner className="animate-spin" size={14} /> : <FaSave size={14} />} {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Contact Details */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#1a1f36] dark:text-white mb-4 flex items-center gap-2">
                    <FaPhone size={16} className="text-[#45CFFF]" /> Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Phone Number</label>
                        <div className="relative">
                            <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                            <input value={contact.phone} onChange={(e) => handleChange("phone", e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Email Address</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                            <input value={contact.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Address</label>
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-3.5 top-3 text-[#A0AEC0]" size={14} />
                            <textarea value={contact.address} onChange={(e) => handleChange("address", e.target.value)} rows={2} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none resize-none" />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Topbar Tagline</label>
                        <input value={contact.tagline} onChange={(e) => handleChange("tagline", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                    </div>
                </div>
            </div>

            {/* Social Media Links */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#1a1f36] dark:text-white mb-4 flex items-center gap-2">
                    <FaFacebook size={16} className="text-[#45CFFF]" /> Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Facebook URL</label>
                        <div className="relative">
                            <FaFacebook className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1877F2]" size={14} />
                            <input value={contact.social_facebook} onChange={(e) => handleChange("social_facebook", e.target.value)} placeholder="https://facebook.com/..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Instagram URL</label>
                        <div className="relative">
                            <FaInstagram className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E4405F]" size={14} />
                            <input value={contact.social_instagram} onChange={(e) => handleChange("social_instagram", e.target.value)} placeholder="https://instagram.com/..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">LinkedIn URL</label>
                        <div className="relative">
                            <FaLinkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A66C2]" size={14} />
                            <input value={contact.social_linkedin} onChange={(e) => handleChange("social_linkedin", e.target.value)} placeholder="https://linkedin.com/..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Twitter URL</label>
                        <div className="relative">
                            <FaTwitter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1DA1F2]" size={14} />
                            <input value={contact.social_twitter} onChange={(e) => handleChange("social_twitter", e.target.value)} placeholder="https://twitter.com/..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
