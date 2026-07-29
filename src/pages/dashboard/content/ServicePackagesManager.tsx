import { useState, useEffect, useCallback } from "react";
import { servicePackagesApi, type ServicePackageData } from "../../../services/ServicePackage";
import { FaPlus, FaTrash, FaSave, FaStar, FaSpinner } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/*  Service Packages Manager — Tabbed admin page for all service      */
/*  pricing plans (web dev, design, marketing pages)                  */
/* ------------------------------------------------------------------ */

interface TabConfig {
    key: string;
    label: string;
    category: string;
}

const TABS: TabConfig[] = [
    { key: "web-development", label: "Web Development", category: "Web & Dev" },
    { key: "tshirt-design", label: "T-Shirt Design", category: "Design" },
    { key: "brochure-design", label: "Brochure Design", category: "Design" },
    { key: "flyer-design", label: "Flyer Design", category: "Design" },
    { key: "logo-branding", label: "Logo & Branding", category: "Design" },
    { key: "facebook-marketing", label: "Facebook Marketing", category: "Marketing" },
    { key: "instagram-marketing", label: "Instagram Marketing", category: "Marketing" },
    { key: "likes-followers", label: "Likes & Followers", category: "Marketing" },
    { key: "boosted-post-campaigns", label: "Boosted Posts", category: "Marketing" },
];

const CATEGORIES = ["Web & Dev", "Design", "Marketing"];

export default function ServicePackagesManager() {
    const [grouped, setGrouped] = useState<Record<string, ServicePackageData[]>>({});
    const [activeTab, setActiveTab] = useState(TABS[0].key);
    const [plans, setPlans] = useState<ServicePackageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [savedTab, setSavedTab] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchGrouped = useCallback(async () => {
        try {
            setLoading(true);
            const res = await servicePackagesApi.getGrouped();
            setGrouped(res.data);
            setPlans(res.data[TABS[0].key] || []);
        } catch {
            setError("Failed to load service packages.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchGrouped(); }, [fetchGrouped]);

    // Switch tab — save current tab's plans to local state
    const switchTab = (key: string) => {
        setGrouped((prev) => ({ ...prev, [activeTab]: plans }));
        setActiveTab(key);
        setPlans(grouped[key] || []);
        setSaved(false);
    };

    const handleChange = (index: number, field: keyof ServicePackageData, value: string | boolean) => {
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
            { id: 0, service_key: activeTab, name: "New Plan", price: "0", period: "", tagline: "Plan description", highlight: false, features: ["Feature 1"], cta: "Get Started", sort_order: prev.length },
        ]);
    };

    const removePlan = async (index: number) => {
        const plan = plans[index];
        setPlans((prev) => prev.filter((_, i) => i !== index));
        if (plan.id) {
            try { await servicePackagesApi.delete(plan.id); } catch { /* revert on next fetch */ }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const results = await Promise.all(
                plans.map((p) => {
                    const payload = { ...p, service_key: activeTab };
                    if (p.id && p.id > 0) {
                        return servicePackagesApi.update(p.id, payload);
                    } else {
                        return servicePackagesApi.create(payload);
                    }
                })
            );
            const savedPlans = results.map((r) => r.data);
            setPlans(savedPlans);
            setGrouped((prev) => ({ ...prev, [activeTab]: savedPlans }));
            setSaved(true);
            setSavedTab(activeTab);
            setTimeout(() => { setSaved(false); setSavedTab(null); }, 2000);
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
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1f36] dark:text-white">Service Packages & Pricing</h2>
                    <p className="text-sm text-[#596887] dark:text-[#B9C7E0] mt-1">Manage pricing plans for all service pages from one place.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all shrink-0 ${saved ? "bg-green-500" : "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] hover:shadow-[0_4px_20px_rgba(46,139,240,0.3)]"}`}
                >
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} {saved ? "Saved!" : saving ? "Saving..." : "Save All Changes"}
                </button>
            </div>

            {/* Tab bar */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white dark:border-[#2D3748] dark:bg-[#0F1E3D] overflow-hidden">
                <div className="p-4 space-y-4">
                    {CATEGORIES.map((cat) => {
                        const catTabs = TABS.filter((t) => t.category === cat);
                        const isCatActive = catTabs.some((t) => t.key === activeTab);
                        return (
                            <div key={cat}>
                                {/* Category label */}
                                <span className={`mb-2 inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-[0.18em] px-1 ${isCatActive ? "text-[#45CFFF]" : "text-[#596887] dark:text-[#7C8AAD]"}`}>
                                    <span className={`inline-block h-px w-3 ${isCatActive ? "bg-[#45CFFF]" : "bg-[#596887]/40"}`} />
                                    {cat}
                                </span>
                                {/* Tabs for this category */}
                                <div className="flex flex-wrap gap-2">
                                    {catTabs.map((tab) => {
                                        const isActive = activeTab === tab.key;
                                        const isSaved = savedTab === tab.key;
                                        return (
                                            <button
                                                key={tab.key}
                                                onClick={() => switchTab(tab.key)}
                                                className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-medium whitespace-nowrap transition-all ${isActive
                                                    ? "bg-[#45CFFF]/10 text-[#45CFFF] shadow-[inset_0_0_0_1px_rgba(69,207,255,0.2)]"
                                                    : "text-[#596887] dark:text-[#B9C7E0] bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.06]"
                                                    }`}
                                            >
                                                {isSaved && <span className="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />}
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Plans content */}
                <div className="p-6 space-y-6">
                    {/* Current tab info */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.15em] text-[#45CFFF] bg-[#45CFFF]/10 px-2 py-0.5 rounded-md">
                                    {TABS.find((t) => t.key === activeTab)?.category}
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-[#1a1f36] dark:text-white">
                                {TABS.find((t) => t.key === activeTab)?.label} — {plans.length} plan{plans.length !== 1 ? "s" : ""}
                            </h3>
                            <p className="text-xs text-[#596887] dark:text-[#B9C7E0] mt-0.5">
                                Edit plans below. Changes are saved per tab.
                            </p>
                        </div>
                        <button
                            onClick={addPlan}
                            className="flex items-center gap-1.5 rounded-lg bg-[#45CFFF]/10 px-3 py-1.5 text-xs font-medium text-[#45CFFF] transition-colors hover:bg-[#45CFFF]/20"
                        >
                            <FaPlus size={11} /> Add Plan
                        </button>
                    </div>

                    {/* Plan cards */}
                    {plans.length === 0 ? (
                        <div className="rounded-xl border-2 border-dashed border-[#E2E8F0] dark:border-[#2D3748] p-12 text-center">
                            <p className="text-sm text-[#596887] dark:text-[#B9C7E0]">No plans yet. Click "Add Plan" to create one.</p>
                        </div>
                    ) : (
                        <div className="grid gap-5">
                            {plans.map((plan, planIdx) => (
                                <div
                                    key={planIdx}
                                    className={`rounded-2xl border p-5 transition-all ${plan.highlight
                                        ? "border-[#45CFFF]/30 bg-[#45CFFF]/[0.02] shadow-[0_0_0_1px_rgba(69,207,255,0.1)]"
                                        : "border-[#E2E8F0] bg-[#f8f9fc] dark:border-[#2D3748] dark:bg-[#0B1730]"
                                        }`}
                                >
                                    {/* Plan header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] text-[11px] font-bold text-white">
                                                {planIdx + 1}
                                            </span>
                                            {plan.highlight && (
                                                <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                    <FaStar size={8} /> Popular
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removePlan(planIdx)}
                                            className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                        >
                                            <FaTrash size={13} />
                                        </button>
                                    </div>

                                    {/* Plan fields */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                        <div>
                                            <label className="mb-1 block text-[11px] font-medium text-[#596887] dark:text-[#B9C7E0]">Plan Name</label>
                                            <input type="text" value={plan.name} onChange={(e) => handleChange(planIdx, "name", e.target.value)}
                                                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1a1f36] outline-none focus:border-[#45CFFF] dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[11px] font-medium text-[#596887] dark:text-[#B9C7E0]">Price</label>
                                            <input type="text" value={plan.price} onChange={(e) => handleChange(planIdx, "price", e.target.value)}
                                                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1a1f36] outline-none focus:border-[#45CFFF] dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[11px] font-medium text-[#596887] dark:text-[#B9C7E0]">Period</label>
                                            <input type="text" value={plan.period} onChange={(e) => handleChange(planIdx, "period", e.target.value)}
                                                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1a1f36] outline-none focus:border-[#45CFFF] dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-white" placeholder="/mo" />
                                        </div>
                                        <div className="flex items-end">
                                            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm dark:border-[#2D3748] dark:bg-[#0B1730]">
                                                <input type="checkbox" checked={plan.highlight} onChange={(e) => handleChange(planIdx, "highlight", e.target.checked)} className="accent-[#1E56E0]" />
                                                <span className="text-[#596887] dark:text-[#B9C7E0]">Popular</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Tagline */}
                                    <div className="mt-3">
                                        <label className="mb-1 block text-[11px] font-medium text-[#596887] dark:text-[#B9C7E0]">Tagline</label>
                                        <input type="text" value={plan.tagline} onChange={(e) => handleChange(planIdx, "tagline", e.target.value)}
                                            className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1a1f36] outline-none focus:border-[#45CFFF] dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-white" />
                                    </div>

                                    {/* CTA (for marketing pages) */}
                                    {plan.cta !== undefined && (
                                        <div className="mt-3">
                                            <label className="mb-1 block text-[11px] font-medium text-[#596887] dark:text-[#B9C7E0]">CTA Button Text</label>
                                            <input type="text" value={plan.cta} onChange={(e) => handleChange(planIdx, "cta", e.target.value)}
                                                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1a1f36] outline-none focus:border-[#45CFFF] dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-white" placeholder="Get Started" />
                                        </div>
                                    )}

                                    {/* Features */}
                                    <div className="mt-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="text-[11px] font-medium text-[#596887] dark:text-[#B9C7E0]">Features ({plan.features.length})</label>
                                            <button onClick={() => addFeature(planIdx)}
                                                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-[#45CFFF] transition-colors hover:bg-[#45CFFF]/10">
                                                <FaPlus size={9} /> Add
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                            {plan.features.map((feature, featureIdx) => (
                                                <div key={featureIdx} className="flex items-center gap-2">
                                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#45CFFF]/10 text-[9px] font-bold text-[#45CFFF]">
                                                        {featureIdx + 1}
                                                    </span>
                                                    <input type="text" value={feature} onChange={(e) => handleFeatureChange(planIdx, featureIdx, e.target.value)}
                                                        className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-[13px] text-[#1a1f36] outline-none focus:border-[#45CFFF] dark:border-[#2D3748] dark:bg-[#0B1730] dark:text-white" />
                                                    <button onClick={() => removeFeature(planIdx, featureIdx)}
                                                        className="rounded-md p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                                                        <FaTrash size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
