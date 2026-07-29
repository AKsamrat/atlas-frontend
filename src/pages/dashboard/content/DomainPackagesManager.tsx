import { useState, useEffect, useCallback } from "react";
import { domainPlansApi, type DomainPlanData } from "../../../services/DomainPlan";
import { FaPlus, FaTrash, FaSave, FaStar, FaSpinner } from "react-icons/fa";

export default function DomainPackagesManager() {
    const [plans, setPlans] = useState<DomainPlanData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlans = useCallback(async () => {
        try {
            setLoading(true);
            const res = await domainPlansApi.getAll();
            setPlans(res.data);
        } catch {
            setError("Failed to load domain plans.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPlans(); }, [fetchPlans]);

    const handleChange = (index: number, field: keyof DomainPlanData, value: string | boolean) => {
        setPlans((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
    };

    const handleFeatureChange = (planIdx: number, featureIdx: number, value: string) => {
        setPlans((prev) =>
            prev.map((p, i) =>
                i === planIdx ? { ...p, features: p.features.map((f, j) => (j === featureIdx ? value : f)) } : p
            )
        );
    };

    const addFeature = (planIdx: number) => {
        setPlans((prev) =>
            prev.map((p, i) => (i === planIdx ? { ...p, features: [...p.features, "New feature"] } : p))
        );
    };

    const removeFeature = (planIdx: number, featureIdx: number) => {
        setPlans((prev) =>
            prev.map((p, i) =>
                i === planIdx ? { ...p, features: p.features.filter((_, j) => j !== featureIdx) } : p
            )
        );
    };

    const addPlan = () => {
        setPlans((prev) => [
            ...prev,
            {
                id: 0,
                name: "New Plan",
                price: "0",
                period: "/mo",
                tagline: "Plan description here",
                highlight: false,
                features: ["Feature 1"],
                sort_order: prev.length,
            },
        ]);
    };

    const removePlan = async (index: number) => {
        const plan = plans[index];
        setPlans((prev) => prev.filter((_, i) => i !== index));
        if (plan.id) {
            try { await domainPlansApi.delete(plan.id); } catch { /* revert on next fetch */ }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const results = await Promise.all(
                plans.map((p) => {
                    const payload = { ...p };
                    if (p.id && p.id > 0) {
                        return domainPlansApi.update(p.id, payload);
                    } else {
                        return domainPlansApi.create(payload);
                    }
                })
            );
            setPlans(results.map((r) => r.data));
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
                    <h2 className="text-xl font-bold text-[#1a1f36] dark:text-white">Domain & Hosting Packages</h2>
                    <p className="text-sm text-[#596887] dark:text-[#B9C7E0] mt-1">Manage the pricing plans displayed on the Domain & Hosting page.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={addPlan}
                        className="flex items-center gap-2 rounded-lg bg-[#45CFFF]/10 px-4 py-2 text-sm font-medium text-[#45CFFF] transition-colors hover:bg-[#45CFFF]/20"
                    >
                        <FaPlus /> Add Plan
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white transition-all ${saved ? "bg-green-500" : "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] hover:shadow-[0_4px_20px_rgba(46,139,240,0.3)]"}`}
                    >
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {plans.map((plan, planIdx) => (
                    <div
                        key={plan.id || planIdx}
                        className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm dark:border-[#2D3748] dark:bg-[#0F1E3D]"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {plan.highlight && (
                                    <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                        <FaStar size={10} /> Most Popular
                                    </span>
                                )}
                                <h3 className="text-lg font-bold text-[#1a1f36] dark:text-white">Plan {planIdx + 1}</h3>
                            </div>
                            <button
                                onClick={() => removePlan(planIdx)}
                                className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-[#596887] dark:text-[#B9C7E0]">Plan Name</label>
                                <input
                                    type="text"
                                    value={plan.name}
                                    onChange={(e) => handleChange(planIdx, "name", e.target.value)}
                                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#f8f9fc] px-3 py-2 text-sm text-[#1a1f36] outline-none focus:border-[#45CFFF] dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-[#596887] dark:text-[#B9C7E0]">Price (৳)</label>
                                <input
                                    type="text"
                                    value={plan.price}
                                    onChange={(e) => handleChange(planIdx, "price", e.target.value)}
                                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#f8f9fc] px-3 py-2 text-sm text-[#1a1f36] outline-none focus:border-[#45CFFF] dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-[#596887] dark:text-[#B9C7E0]">Period</label>
                                <input
                                    type="text"
                                    value={plan.period}
                                    onChange={(e) => handleChange(planIdx, "period", e.target.value)}
                                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#f8f9fc] px-3 py-2 text-sm text-[#1a1f36] outline-none focus:border-[#45CFFF] dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-white"
                                    placeholder="/mo"
                                />
                            </div>
                            <div className="flex items-end">
                                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#f8f9fc] px-3 py-2 text-sm dark:border-[#2D3748] dark:bg-[#0B1730]">
                                    <input
                                        type="checkbox"
                                        checked={plan.highlight}
                                        onChange={(e) => handleChange(planIdx, "highlight", e.target.checked)}
                                        className="accent-[#1E56E0]"
                                    />
                                    <span className="text-[#596887] dark:text-[#B9C7E0]">Most Popular</span>
                                </label>
                            </div>
                        </div>

                        <div className="mt-3">
                            <label className="mb-1 block text-xs font-medium text-[#596887] dark:text-[#B9C7E0]">Tagline</label>
                            <input
                                type="text"
                                value={plan.tagline}
                                onChange={(e) => handleChange(planIdx, "tagline", e.target.value)}
                                className="w-full rounded-lg border border-[#E2E8F0] bg-[#f8f9fc] px-3 py-2 text-sm text-[#1a1f36] outline-none focus:border-[#45CFFF] dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-white"
                            />
                        </div>

                        <div className="mt-4">
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-medium text-[#596887] dark:text-[#B9C7E0]">Features</label>
                                <button
                                    onClick={() => addFeature(planIdx)}
                                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[#45CFFF] transition-colors hover:bg-[#45CFFF]/10"
                                >
                                    <FaPlus size={10} /> Add Feature
                                </button>
                            </div>
                            <div className="space-y-2">
                                {plan.features.map((feature, featureIdx) => (
                                    <div key={featureIdx} className="flex items-center gap-2">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#45CFFF]/10 text-[10px] font-bold text-[#45CFFF]">
                                            {featureIdx + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(planIdx, featureIdx, e.target.value)}
                                            className="flex-1 rounded-lg border border-[#E2E8F0] bg-[#f8f9fc] px-3 py-1.5 text-sm text-[#1a1f36] outline-none focus:border-[#45CFFF] dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-white"
                                        />
                                        <button
                                            onClick={() => removeFeature(planIdx, featureIdx)}
                                            className="rounded-md p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                        >
                                            <FaTrash size={12} />
                                        </button>
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
