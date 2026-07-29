import { useState, useEffect, useCallback } from "react";
import { testimonialsApi, type TestimonialData } from "../../../services/Testimonial";
import { FaPlus, FaTrash, FaSave, FaStar, FaSpinner } from "react-icons/fa";

export default function TestimonialsManager() {
    const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTestimonials = useCallback(async () => {
        try {
            setLoading(true);
            const res = await testimonialsApi.getAll();
            setTestimonials(res.data);
        } catch {
            setError("Failed to load testimonials.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

    const handleChange = (index: number, field: keyof TestimonialData, value: string | number) => {
        setTestimonials((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
    };

    const addTestimonial = () => {
        setTestimonials((prev) => [
            ...prev,
            { id: 0, name: "New Person", role: "Position, Company", stars: 5, text: "Write the testimonial here...", sort_order: prev.length },
        ]);
    };

    const removeTestimonial = async (index: number) => {
        const t = testimonials[index];
        setTestimonials((prev) => prev.filter((_, i) => i !== index));
        if (t.id) {
            try { await testimonialsApi.delete(t.id); } catch { /* revert on next fetch */ }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const results = await Promise.all(
                testimonials.map((t) => {
                    const payload = { ...t };
                    if (t.id && t.id > 0) {
                        return testimonialsApi.update(t.id, payload);
                    } else {
                        return testimonialsApi.create(payload);
                    }
                })
            );
            setTestimonials(results.map((r) => r.data));
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
                    <h2 className="text-xl font-bold text-[#1a1f36] dark:text-white">Testimonials</h2>
                    <p className="text-sm text-[#596887] dark:text-[#B9C7E0] mt-1">Manage customer testimonials displayed on the homepage.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={addTestimonial} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#45CFFF]/10 text-[#45CFFF] text-sm font-medium hover:bg-[#45CFFF]/20 transition-all">
                        <FaPlus size={12} /> Add Testimonial
                    </button>
                    <button onClick={handleSave} disabled={saving} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${saved ? "bg-green-500 text-white" : "bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white hover:opacity-90"}`}>
                        {saving ? <FaSpinner className="animate-spin" size={14} /> : <FaSave size={14} />} {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {testimonials.map((testimonial, idx) => (
                    <div key={testimonial.id || idx} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">{testimonial.name[0]}</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-[#1a1f36] dark:text-white">{testimonial.name}</h4>
                                    <p className="text-xs text-[#596887] dark:text-[#B9C7E0]">{testimonial.role}</p>
                                </div>
                            </div>
                            <button onClick={() => removeTestimonial(idx)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                <FaTrash size={14} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Name</label>
                                    <input value={testimonial.name} onChange={(e) => handleChange(idx, "name", e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Role / Company</label>
                                    <input value={testimonial.role} onChange={(e) => handleChange(idx, "role", e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Stars</label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button key={s} onClick={() => handleChange(idx, "stars", s)} className="transition-all">
                                            <FaStar size={18} className={s <= testimonial.stars ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Testimonial</label>
                                <textarea value={testimonial.text} onChange={(e) => handleChange(idx, "text", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none resize-none" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
