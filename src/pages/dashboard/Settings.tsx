import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Save, User, Mail, Shield, Loader2, CheckCircle2, AlertCircle, X, ImageOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../services";

type Status = "idle" | "saving" | "success" | "error";

/* ── Validation limits ── */
const MAX_FILE_SIZE_MB = 2;
const MAX_WIDTH_PX = 2000;
const MAX_HEIGHT_PX = 2000;

/* ── Toast component ── */
interface ToastProps {
    message: string;
    type: "error" | "success";
    onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isError = type === "error";
    return (
        <div
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-300 animate-[slideIn_0.3s_ease-out] ${isError
                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
                : "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                }`}
        >
            {isError ? <AlertCircle size={18} className="mt-0.5 flex-shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />}
            <span className="flex-1">{message}</span>
            <button onClick={onClose} className="flex-shrink-0 rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10">
                <X size={14} />
            </button>
        </div>
    );
}

export default function Settings() {
    const { user, updateUser } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");
    const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = useCallback((message: string, type: "error" | "success" = "error") => {
        setToast({ message, type });
    }, []);

    /* Keep form in sync if user loads later */
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        /* ── Validate file size (MB) ── */
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > MAX_FILE_SIZE_MB) {
            showToast(
                `Image is too large (${sizeMB.toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`,
                "error"
            );
            e.target.value = "";
            return;
        }

        /* ── Validate image dimensions ── */
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            if (img.width > MAX_WIDTH_PX || img.height > MAX_HEIGHT_PX) {
                showToast(
                    `Image resolution is too high (${img.width}×${img.height}px). Maximum allowed is ${MAX_WIDTH_PX}×${MAX_HEIGHT_PX}px.`,
                    "error"
                );
                e.target.value = "";
                return;
            }
            /* All good — accept the file */
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
            showToast("Image looks great!", "success");
        };
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            showToast("Could not read image file. Please choose a valid image.", "error");
            e.target.value = "";
        };
        img.src = objectUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("saving");
        setMessage("");

        try {
            const payload: { name?: string; email?: string; avatar?: File } = {};
            if (name !== user?.name) payload.name = name;
            if (email !== user?.email) payload.email = email;
            if (avatarFile) payload.avatar = avatarFile;

            /* Only call API if something changed */
            if (Object.keys(payload).length === 0) {
                setStatus("success");
                setMessage("No changes to save.");
                return;
            }

            const res = await authApi.updateProfile(payload);
            const updated = res.data;

            /* Update local auth state + localStorage */
            updateUser({
                name: updated.name,
                email: updated.email,
                avatar: updated.avatar,
            });

            setAvatarFile(null);
            setStatus("success");
            setMessage("Profile updated successfully!");
        } catch (err: unknown) {
            const msg =
                err instanceof Error ? err.message : "Failed to update profile. Please try again.";
            setStatus("error");
            setMessage(msg);
        }
    };

    const avatarUrl = avatarPreview
        || (user?.avatar
            ? user.avatar.startsWith("http")
                ? user.avatar
                : `${import.meta.env.VITE_API_URL?.replace("/api", "")}/storage/${user.avatar}`
            : null);

    return (
        <div className="mx-auto max-w-3xl">
            {/* ── Toast popup ── */}
            {toast && (
                <div className="fixed top-5 right-5 z-[100] max-w-sm">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}

            {/* Page intro */}
            <div className="mb-8">
                <h2 className="font-sora text-2xl font-bold text-[#1a1f36] dark:text-white">
                    Account Settings
                </h2>
                <p className="mt-1 text-sm text-[#596887] dark:text-[#B9C7E0]">
                    Manage your profile information and preferences.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* ── Avatar Card ─────────────────────────── */}
                <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#0F1E3D]">
                    <h3 className="mb-5 font-sora text-lg font-semibold text-[#1a1f36] dark:text-white">
                        Profile Photo
                    </h3>

                    <div className="flex items-center gap-6">
                        {/* Avatar circle */}
                        <div className="relative group">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={user?.name || "Admin"}
                                    className="h-24 w-24 rounded-full object-cover border-3 border-[#45CFFF]/30 shadow-[0_4px_20px_rgba(69,207,255,0.2)]"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] text-white text-3xl font-bold shadow-[0_4px_20px_rgba(69,207,255,0.3)]">
                                    {user?.name?.[0]?.toUpperCase() || "A"}
                                </div>
                            )}

                            {/* Overlay on hover */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                            >
                                <Camera size={22} className="text-white" />
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-[#1a1f36] dark:text-white">
                                {user?.name || "Admin"}
                            </p>
                            <p className="mt-0.5 text-xs text-[#596887] dark:text-[#7C8AAD]">
                                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Admin"}
                            </p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-2 text-xs font-medium text-[#45CFFF] hover:underline"
                            >
                                Change photo
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Personal Info Card ───────────────────── */}
                <div className="mt-6 rounded-2xl border border-black/8 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#0F1E3D]">
                    <h3 className="mb-5 font-sora text-lg font-semibold text-[#1a1f36] dark:text-white">
                        Personal Information
                    </h3>

                    <div className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#1a1f36] dark:text-[#DCE6F5]">
                                <User size={15} className="text-[#45CFFF]" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full rounded-xl border border-black/10 bg-[#f8f9fc] px-4 py-2.5 text-sm text-[#1a1f36] outline-none transition-colors placeholder:text-[#aab3c5] focus:border-[#45CFFF] focus:ring-2 focus:ring-[#45CFFF]/20 dark:border-white/[0.1] dark:bg-[#0B1730] dark:text-white dark:placeholder:text-[#596887] dark:focus:border-[#45CFFF]"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#1a1f36] dark:text-[#DCE6F5]">
                                <Mail size={15} className="text-[#45CFFF]" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-xl border border-black/10 bg-[#f8f9fc] px-4 py-2.5 text-sm text-[#1a1f36] outline-none transition-colors placeholder:text-[#aab3c5] focus:border-[#45CFFF] focus:ring-2 focus:ring-[#45CFFF]/20 dark:border-white/[0.1] dark:bg-[#0B1730] dark:text-white dark:placeholder:text-[#596887] dark:focus:border-[#45CFFF]"
                            />
                        </div>

                        {/* Role (read-only) */}
                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#1a1f36] dark:text-[#DCE6F5]">
                                <Shield size={15} className="text-[#45CFFF]" />
                                Role
                            </label>
                            <input
                                type="text"
                                value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Admin"}
                                readOnly
                                className="w-full cursor-not-allowed rounded-xl border border-black/10 bg-gray-100 px-4 py-2.5 text-sm text-[#596887] dark:border-white/[0.06] dark:bg-[#0B1730]/60 dark:text-[#7C8AAD]"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Status feedback ─────────────────────── */}
                {message && (
                    <div
                        className={`mt-5 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${status === "success"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                    >
                        {status === "success" ? (
                            <CheckCircle2 size={16} />
                        ) : (
                            <AlertCircle size={16} />
                        )}
                        {message}
                    </div>
                )}

                {/* ── Save button ─────────────────────────── */}
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={status === "saving"}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-6 py-2.5 text-sm font-semibold text-[#060B14] shadow-[0_4px_20px_rgba(46,139,240,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(46,139,240,0.5)] disabled:cursor-not-allowed disabled:opacity-60 dark:text-white"
                    >
                        {status === "saving" ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Saving…
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
