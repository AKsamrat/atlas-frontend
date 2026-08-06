import { useState, useEffect, useRef } from "react";
import { FaSpinner, FaCheck, FaCamera, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { customerPanelApi, type CustomerPanelProfile } from "../../services";

export default function CustomerProfile() {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [profile, setProfile] = useState<CustomerPanelProfile | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await customerPanelApi.getProfile();
                const p = res.data;
                setProfile(p);
                setName(p.user.name);
                setEmail(p.user.email);
                if (p.user.avatar) {
                    const base = import.meta.env.VITE_API_URL?.replace("/api", "") || "";
                    setAvatarPreview(`${base}/storage/${p.user.avatar}`);
                }
            } catch {
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            if (avatarFile) formData.append("avatar", avatarFile);

            const res = await customerPanelApi.updateProfile(formData);
            setSuccess("Profile updated successfully!");

            // Update auth context
            if (user) {
                const updated = res.data as unknown as { name?: string; email?: string; avatar?: string };
                updateUser({ ...user, name: updated.name || name, email: updated.email || email, avatar: updated.avatar || user.avatar });
            }

            setTimeout(() => setSuccess(""), 3000);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr?.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <FaSpinner className="animate-spin text-[#45CFFF]" size={28} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Avatar Card */}
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 dark:border-white/6 dark:bg-[#0d1829]">
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="h-20 w-20 rounded-2xl object-cover border-2 border-[#45CFFF]/30" />
                        ) : (
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center">
                                <span className="text-white text-2xl font-bold font-sora">{(name || "C").charAt(0)?.toUpperCase() || "C"}</span>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FaCamera size={18} />
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </div>
                    <div>
                        <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white">{name}</h3>
                        <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{email}</p>
                        <p className="text-xs text-[#45CFFF] mt-1">Customer Account</p>
                    </div>
                </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="rounded-2xl border border-[#e2e8f0] bg-white p-6 dark:border-white/6 dark:bg-[#0d1829] space-y-5">
                <h3 className="font-sora text-base font-bold text-[#1a1f36] dark:text-white">Edit Profile</h3>

                {success && (
                    <div className="flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-2.5 text-sm text-green-600 dark:text-green-400">
                        <FaCheck size={14} /> {success}
                    </div>
                )}
                {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                        <FaExclamationTriangle size={14} /> {error}
                    </div>
                )}

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#596887] dark:text-[#B9C7E0]">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1a1f36] placeholder-[#B9C7E0] focus:border-[#45CFFF] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]/10 dark:border-white/8 dark:bg-white/3 dark:text-white transition-all"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#596887] dark:text-[#B9C7E0]">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1a1f36] placeholder-[#B9C7E0] focus:border-[#45CFFF] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]/10 dark:border-white/8 dark:bg-white/3 dark:text-white transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E56E0] to-[#2E8BF0] px-5 py-2.5 text-sm font-medium text-white shadow hover:shadow-md disabled:opacity-50 transition-all"
                    >
                        {saving ? <FaSpinner className="animate-spin" size={14} /> : <FaCheck size={14} />}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>

            {/* Account Stats */}
            {
                profile && (
                    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 dark:border-white/6 dark:bg-[#0d1829]">
                        <h3 className="font-sora text-base font-bold text-[#1a1f36] dark:text-white mb-4">Account Overview</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl bg-[#f8fafc] p-4 dark:bg-white/3">
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">Total Orders</p>
                                <p className="mt-1 text-xl font-bold text-[#1a1f36] dark:text-white">{profile.order_count}</p>
                            </div>
                            <div className="rounded-xl bg-[#f8fafc] p-4 dark:bg-white/3">
                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">Total Spent</p>
                                <p className="mt-1 text-xl font-bold text-[#1a1f36] dark:text-white">
                                    {new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(profile.total_spent)}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
