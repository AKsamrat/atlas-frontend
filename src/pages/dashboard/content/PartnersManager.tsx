import { useState, useEffect, useCallback } from "react";
import { partnersApi, type PartnerData } from "../../../services/Partner";
import { FaPlus, FaTrash, FaSave, FaSpinner } from "react-icons/fa";
import { Building2, Award, TrendingUp, Users, Server, Globe2, Shield, HardDrive } from "lucide-react";

const ICON_MAP: Record<string, typeof Building2> = {
    Building2, Award, TrendingUp, Users, Server, Globe2, Shield, HardDrive,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

const COLOR_PRESETS = ["#22C55E", "#EC4899", "#3B82F6", "#F59E0B", "#8B5CF6", "#06B6D4", "#EF4444", "#6366F1", "#14B8A6", "#F97316"];

export default function PartnersManager() {
    const [partners, setPartners] = useState<PartnerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPartners = useCallback(async () => {
        try {
            setLoading(true);
            const res = await partnersApi.getAll();
            setPartners(res.data);
        } catch {
            setError("Failed to load partners.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPartners(); }, [fetchPartners]);

    const handleChange = (index: number, field: keyof PartnerData, value: string) => {
        setPartners((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
    };

    const addPartner = () => {
        setPartners((prev) => [...prev, { id: 0, name: "New Partner", icon_name: "Building2", color: "#3B82F6", sort_order: prev.length }]);
    };

    const removePartner = async (index: number) => {
        const partner = partners[index];
        setPartners((prev) => prev.filter((_, i) => i !== index));
        if (partner.id) {
            try { await partnersApi.delete(partner.id); } catch { /* revert on next fetch */ }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const results = await Promise.all(
                partners.map((p) => {
                    const payload = { ...p };
                    if (p.id && p.id > 0) {
                        return partnersApi.update(p.id, payload);
                    } else {
                        return partnersApi.create(payload);
                    }
                })
            );
            setPartners(results.map((r) => r.data));
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
                    <h2 className="text-xl font-bold text-[#1a1f36] dark:text-white">Trusted By / Partners</h2>
                    <p className="text-sm text-[#596887] dark:text-[#B9C7E0] mt-1">Manage the partner logos displayed on the homepage marquee.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={addPartner} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#45CFFF]/10 text-[#45CFFF] text-sm font-medium hover:bg-[#45CFFF]/20 transition-all">
                        <FaPlus size={12} /> Add Partner
                    </button>
                    <button onClick={handleSave} disabled={saving} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${saved ? "bg-green-500 text-white" : "bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white hover:opacity-90"}`}>
                        {saving ? <FaSpinner className="animate-spin" size={14} /> : <FaSave size={14} />} {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partners.map((partner, idx) => (
                    <div key={partner.id || idx} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${partner.color}15` }}>
                                    {ICON_MAP[partner.icon_name] ? (() => { const I = ICON_MAP[partner.icon_name]; return <I size={20} style={{ color: partner.color }} />; })() : <Building2 size={20} style={{ color: partner.color }} />}
                                </div>
                                <span className="text-sm font-semibold text-[#1a1f36] dark:text-white truncate max-w-[140px]">{partner.name}</span>
                            </div>
                            <button onClick={() => removePartner(idx)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                <FaTrash size={12} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Partner Name</label>
                                <input value={partner.name} onChange={(e) => handleChange(idx, "name", e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Icon</label>
                                <select value={partner.icon_name} onChange={(e) => handleChange(idx, "icon_name" as keyof PartnerData, e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none">
                                    {ICON_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Color</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={partner.color} onChange={(e) => handleChange(idx, "color", e.target.value)} className="w-8 h-8 rounded-lg border border-[#E2E8F0] dark:border-[#2D3748] cursor-pointer" />
                                    <div className="flex gap-1 flex-wrap">
                                        {COLOR_PRESETS.map((c) => (
                                            <button key={c} onClick={() => handleChange(idx, "color", c)} className="w-5 h-5 rounded-full border-2 transition-all" style={{ backgroundColor: c, borderColor: partner.color === c ? "#1a1f36" : "transparent" }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
