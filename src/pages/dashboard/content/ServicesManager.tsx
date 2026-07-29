import { useState, useEffect, useCallback } from "react";
import { servicesApi, type ServiceData } from "../../../services/Service";
import { FaPlus, FaTrash, FaSave, FaGlobe, FaCode, FaPalette, FaRocket, FaSpinner } from "react-icons/fa";

const ICON_OPTIONS = [
    { value: "Globe2", label: "Globe", icon: FaGlobe },
    { value: "Code2", label: "Code", icon: FaCode },
    { value: "Palette", label: "Palette", icon: FaPalette },
    { value: "Rocket", label: "Rocket", icon: FaRocket },
];

export default function ServicesManager() {
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            const res = await servicesApi.getAll();
            setServices(res.data);
        } catch {
            setError("Failed to load services.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchServices(); }, [fetchServices]);

    const handleServiceChange = (index: number, field: keyof ServiceData, value: string) => {
        setServices((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    };

    const handleItemChange = (serviceIdx: number, itemIdx: number, value: string) => {
        setServices((prev) =>
            prev.map((s, i) =>
                i === serviceIdx
                    ? { ...s, items: s.items.map((it, j) => (j === itemIdx ? { title: value } : it)) }
                    : s
            )
        );
    };

    const addItem = (serviceIdx: number) => {
        setServices((prev) =>
            prev.map((s, i) => (i === serviceIdx ? { ...s, items: [...s.items, { title: "New item" }] } : s))
        );
    };

    const removeItem = (serviceIdx: number, itemIdx: number) => {
        setServices((prev) =>
            prev.map((s, i) =>
                i === serviceIdx ? { ...s, items: s.items.filter((_, j) => j !== itemIdx) } : s
            )
        );
    };

    const addService = () => {
        setServices((prev) => [
            ...prev,
            {
                id: 0, // Temporary — will be assigned by API
                tag: "New Service",
                title: "New Service",
                description: "Service description here.",
                icon_name: "Globe2",
                items: [{ title: "Item 1" }],
                sort_order: prev.length,
            },
        ]);
    };

    const removeService = async (index: number) => {
        const service = services[index];
        setServices((prev) => prev.filter((_, i) => i !== index));
        // If it has a real ID, delete from API
        if (service.id) {
            try { await servicesApi.delete(service.id); } catch { /* will revert on next fetch */ }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save each service (create new ones, update existing)
            const results = await Promise.all(
                services.map((s) => {
                    const payload = { ...s };
                    if (s.id && s.id > 0) {
                        return servicesApi.update(s.id, payload);
                    } else {
                        return servicesApi.create(payload);
                    }
                })
            );
            // Replace local state with API-returned data
            setServices(results.map((r) => r.data));
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
                    <h2 className="text-xl font-bold text-[#1a1f36] dark:text-white">Services / What We Do</h2>
                    <p className="text-sm text-[#596887] dark:text-[#B9C7E0] mt-1">Manage the services section displayed on the homepage.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={addService} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#45CFFF]/10 text-[#45CFFF] text-sm font-medium hover:bg-[#45CFFF]/20 transition-all">
                        <FaPlus size={12} /> Add Service
                    </button>
                    <button onClick={handleSave} disabled={saving} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${saved ? "bg-green-500 text-white" : "bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white hover:opacity-90"}`}>
                        {saving ? <FaSpinner className="animate-spin" size={14} /> : <FaSave size={14} />} {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {services.map((service, idx) => (
                    <div key={service.id || idx} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[#1a1f36] dark:text-white">Service {idx + 1}</h3>
                            <button onClick={() => removeService(idx)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                <FaTrash size={14} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Tag</label>
                                <input value={service.tag} onChange={(e) => handleServiceChange(idx, "tag", e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Title</label>
                                <input value={service.title} onChange={(e) => handleServiceChange(idx, "title", e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Description</label>
                            <textarea value={service.description} onChange={(e) => handleServiceChange(idx, "description", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none resize-none" />
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-medium text-[#596887] dark:text-[#B9C7E0] mb-1">Icon</label>
                            <select value={service.icon_name} onChange={(e) => handleServiceChange(idx, "icon_name" as keyof ServiceData, e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none">
                                {ICON_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-[#596887] dark:text-[#B9C7E0]">Items</label>
                                <button onClick={() => addItem(idx)} className="text-xs text-[#45CFFF] hover:underline">+ Add Item</button>
                            </div>
                            <div className="space-y-2">
                                {service.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex items-center gap-2">
                                        <input value={item.title} onChange={(e) => handleItemChange(idx, itemIdx, e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                        <button onClick={() => removeItem(idx, itemIdx)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"><FaTrash size={12} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
