import { useState, useEffect, useCallback, useRef } from "react";
import { testimonialsApi, type TestimonialData } from "../../../services/Testimonial";
import { FaPlus, FaTrash, FaSave, FaStar, FaSpinner, FaTimes } from "react-icons/fa";
import { ImageOff } from "lucide-react";
import type { AxiosResponse } from "axios";

/* ── Image validation limits ── */
const MAX_FILE_SIZE_MB = 2;
const MAX_DIMENSION_PX = 2000;

/* ── Helper: resolve image URL ── */
function getImageUrl(image: string | null | undefined): string | null {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `${import.meta.env.VITE_API_URL?.replace("/api", "")}/storage/${image}`;
}

interface LocalTestimonial extends TestimonialData {
    _imageFile?: File | null;
    _imagePreview?: string | null;
}

export default function TestimonialsManager() {
    const [testimonials, setTestimonials] = useState<LocalTestimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
    const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

    const showToast = useCallback((message: string, type: "error" | "success" = "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    }, []);

    const fetchTestimonials = useCallback(async () => {
        try {
            setLoading(true);
            const res = await testimonialsApi.getAll();
            setTestimonials(res.data.map((t) => ({ ...t, _imageFile: null, _imagePreview: null })));
        } catch {
            setError("Failed to load testimonials.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

    /* Cleanup object URLs on unmount */
    useEffect(() => {
        return () => {
            testimonials.forEach((t) => {
                if (t._imagePreview && t._imagePreview.startsWith("blob:")) {
                    URL.revokeObjectURL(t._imagePreview);
                }
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (index: number, field: keyof LocalTestimonial, value: string | number) => {
        setTestimonials((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        /* Validate file size */
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > MAX_FILE_SIZE_MB) {
            showToast(`Image is too large (${sizeMB.toFixed(1)} MB). Maximum is ${MAX_FILE_SIZE_MB} MB.`);
            e.target.value = "";
            return;
        }

        /* Validate dimensions */
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            if (img.width > MAX_DIMENSION_PX || img.height > MAX_DIMENSION_PX) {
                showToast(`Image is too large (${img.width}×${img.height}px). Max is ${MAX_DIMENSION_PX}×${MAX_DIMENSION_PX}px.`);
                e.target.value = "";
                return;
            }
            /* Revoke old preview */
            setTestimonials((prev) => {
                const copy = [...prev];
                const old = copy[index]._imagePreview;
                if (old && old.startsWith("blob:")) URL.revokeObjectURL(old);
                copy[index] = { ...copy[index], _imageFile: file, _imagePreview: URL.createObjectURL(file) };
                return copy;
            });
            showToast("Image looks great!", "success");
        };
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            showToast("Could not read this image file.");
            e.target.value = "";
        };
        img.src = objectUrl;
    };

    const removeImage = (index: number) => {
        setTestimonials((prev) => {
            const copy = [...prev];
            const old = copy[index]._imagePreview;
            if (old && old.startsWith("blob:")) URL.revokeObjectURL(old);
            copy[index] = { ...copy[index], _imageFile: null, _imagePreview: null, image: null };
            return copy;
        });
    };

    const addTestimonial = () => {
        setTestimonials((prev) => [
            ...prev,
            { id: 0, name: "New Person", role: "Position, Company", stars: 5, text: "Write the testimonial here...", image: null, sort_order: prev.length },
        ]);
    };

    const removeTestimonial = async (index: number) => {
        const t = testimonials[index];
        if (t._imagePreview && t._imagePreview.startsWith("blob:")) URL.revokeObjectURL(t._imagePreview);
        setTestimonials((prev) => prev.filter((_, i) => i !== index));
        if (t.id) {
            try { await testimonialsApi.delete(t.id); } catch { /* revert on next fetch */ }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const results = await Promise.allSettled(
                testimonials.map((t) => {
                    const payload: Record<string, string | number | File> = {
                        name: t.name,
                        role: t.role,
                        stars: t.stars,
                        text: t.text,
                        sort_order: t.sort_order,
                    };
                    if (t._imageFile) {
                        payload.image = t._imageFile;
                    }
                    if (t.id && t.id > 0) {
                        return testimonialsApi.update(t.id, payload);
                    } else {
                        return testimonialsApi.create(payload as unknown as Parameters<typeof testimonialsApi.create>[0]);
                    }
                })
            );

            const failed = results.filter((r) => r.status === "rejected");
            const succeeded = results
                .filter((r): r is PromiseFulfilledResult<AxiosResponse<TestimonialData>> => r.status === "fulfilled")
                .map((r) => r.value.data);

            if (failed.length > 0) {
                setError(`Failed to save ${failed.length} testimonial(s). ${succeeded.length} were saved successfully.`);
            }

            // Merge saved results back — keep unsaved ones in place for retry
            setTestimonials((prev) => {
                let successIdx = 0;
                return prev.map((t, i) => {
                    if (results[i].status === "fulfilled") {
                        successIdx++;
                        return { ...succeeded[successIdx - 1], _imageFile: null, _imagePreview: null };
                    }
                    return t; // keep failed ones as-is for retry
                });
            });

            if (failed.length === 0) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    /* Determine which image to show: new preview > existing API image > null */
    const getDisplayImage = (t: LocalTestimonial): string | null => {
        if (t._imagePreview) return t._imagePreview;
        return getImageUrl(t.image);
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
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm transition-all ${toast.type === "error"
                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
                    : "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                    }`}>
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(null)} className="rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10"><FaTimes size={12} /></button>
                </div>
            )}

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
                                {/* Avatar preview / upload trigger */}
                                <button
                                    onClick={() => fileInputRefs.current[idx]?.click()}
                                    className="group relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] transition-all hover:ring-2 hover:ring-[#45CFFF]/50"
                                    title="Upload photo"
                                >
                                    {getDisplayImage(testimonial) ? (
                                        <>
                                            <img src={getDisplayImage(testimonial)!} alt={testimonial.name} className="h-full w-full object-cover" />
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                                <FaPlus size={12} className="text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <ImageOff size={16} className="text-white/70 group-hover:hidden" />
                                            <FaPlus size={12} className="text-white hidden group-hover:block" />
                                        </div>
                                    )}
                                </button>
                                <input
                                    type="file"
                                    ref={(el) => { fileInputRefs.current[idx] = el; }}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(idx, e)}
                                />
                                <div>
                                    <h4 className="text-sm font-semibold text-[#1a1f36] dark:text-white">{testimonial.name}</h4>
                                    <p className="text-xs text-[#596887] dark:text-[#B9C7E0]">{testimonial.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {(getDisplayImage(testimonial)) && (
                                    <button onClick={() => removeImage(idx)} className="p-2 rounded-lg text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all" title="Remove image">
                                        <ImageOff size={14} />
                                    </button>
                                )}
                                <button onClick={() => removeTestimonial(idx)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                    <FaTrash size={14} />
                                </button>
                            </div>
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

                            {/* Image hint */}
                            <p className="text-[11px] text-[#8b95ad] dark:text-[#5a6a8a]">
                                Click the avatar circle to upload a photo (max {MAX_FILE_SIZE_MB}MB, {MAX_DIMENSION_PX}×{MAX_DIMENSION_PX}px)
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
