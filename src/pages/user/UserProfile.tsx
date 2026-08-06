import { useState, useEffect, useRef } from "react";
import {
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding,
    FaCalendarAlt, FaCamera, FaSave, FaLock, FaCheckCircle, FaTimes, FaSpinner,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../services";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:8000";
const imgSrc = (path: string | null | undefined) => path ? (path.startsWith("http") ? path : `${API_BASE}/storage/${path}`) : "";

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    address: string;
    department: string;
    position: string;
    joinDate: string;
    bio: string;
}

const initialProfile: ProfileData = {
    name: "Karim Ahmed",
    email: "user@entra.com",
    phone: "+880 1712-345678",
    address: "123 Mirpur Road, Dhaka 1216",
    department: "Development",
    position: "Senior Developer",
    joinDate: "Mar 15, 2023",
    bio: "Full-stack developer with 5+ years of experience in React, TypeScript, and Node.js.",
};

export default function UserProfile() {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState<ProfileData>({ ...initialProfile, name: user?.name || initialProfile.name, email: user?.email || initialProfile.email });
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setProfile((prev) => ({ ...prev, name: user.name, email: user.email }));
            if (user.avatar) setAvatarPreview(imgSrc(user.avatar));
        }
    }, [user]);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload: { name?: string; email?: string; avatar?: File } = {};
            if (profile.name !== (user?.name || "")) payload.name = profile.name;
            if (profile.email !== (user?.email || "")) payload.email = profile.email;
            if (avatarFile) payload.avatar = avatarFile;

            if (Object.keys(payload).length === 0) {
                setIsEditing(false);
                return;
            }

            const res = await authApi.updateProfile(payload);
            const updatedUser = res.data;
            updateUser({ name: updatedUser.name, email: updatedUser.email, avatar: updatedUser.avatar });
            if (updatedUser.avatar) setAvatarPreview(imgSrc(updatedUser.avatar));
            setIsEditing(false);
            setAvatarFile(null);
            showToast("Profile updated successfully");
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update profile";
            Swal.fire("Error", msg, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) return;
        if (newPassword !== confirmPassword) { showToast("Passwords do not match"); return; }
        setShowPasswordModal(false);
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        showToast("Password changed successfully");
    };

    const handleAvatarChange = () => {
        fileInputRef.current?.click();
    };

    const onAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { Swal.fire("Error", "Image must be under 2MB", "error"); return; }
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
        setIsEditing(true);
    };

    return (
        <div className="space-y-6 relative max-w-4xl">
            {toast && (
                <div className="fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl bg-green-500 text-white text-sm font-semibold shadow-2xl">
                    <div className="flex items-center gap-2"><FaCheckCircle />{toast}</div>
                </div>
            )}

            {/* Profile Header */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-[#1E56E0] to-[#45CFFF] relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50" />
                </div>
                <div className="px-6 pb-6 relative">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 relative z-10">
                        <div className="relative group">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt={profile.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-[#0F1E3D] shadow-xl" />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-3xl font-sora font-bold border-4 border-white dark:border-[#0F1E3D] shadow-xl">
                                    {(profile.name || "U").charAt(0)}
                                </div>
                            )}
                            <button onClick={handleAvatarChange}
                                className="absolute bottom-0 right-0 w-8 h-8 rounded-lg bg-[#1E56E0] text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <FaCamera size={12} />
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarFileChange} />
                        </div>
                        <div className="flex-1 sm:pb-1">
                            <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">{profile.name}</h2>
                            <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{profile.position} {'\u2022'} {profile.department}</p>
                        </div>
                        <div className="flex gap-2 sm:pb-1">
                            <button onClick={() => setShowPasswordModal(true)}
                                className="px-4 py-2 rounded-xl text-sm font-medium border border-[#E2E8F0] dark:border-[#2D3748] text-[#596887] dark:text-[#B9C7E0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.04] transition-all flex items-center gap-2">
                                <FaLock size={12} /> Change Password
                            </button>
                            <button onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                disabled={saving}
                                className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-all flex items-center gap-2 ${isEditing ? "bg-green-500 hover:bg-green-600" : "bg-gradient-to-r from-[#1E56E0] to-[#45CFFF] hover:opacity-90"
                                    } disabled:opacity-50`}>
                                {saving ? <><FaSpinner className="animate-spin" size={12} /> Saving...</> : isEditing ? <><FaSave size={12} /> Save Changes</> : <><FaUser size={12} /> Edit Profile</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-6">
                    <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white mb-4">Personal Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Full Name</label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                                <input type="text" value={profile.name} disabled={!isEditing}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Email</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                                <input type="email" value={profile.email} disabled={!isEditing}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Phone</label>
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                                <input type="text" value={profile.phone} disabled={!isEditing}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Address</label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-3 text-[#A0AEC0]" size={14} />
                                <textarea value={profile.address} disabled={!isEditing} rows={2}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#45CFFF] resize-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Work Info */}
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-6">
                    <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white mb-4">Work Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Department</label>
                            <div className="relative">
                                <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                                <input type="text" value={profile.department} disabled
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white opacity-60" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Position</label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                                <input type="text" value={profile.position} disabled
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white opacity-60" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Join Date</label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                                <input type="text" value={profile.joinDate} disabled
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white opacity-60" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Bio</label>
                            <textarea value={profile.bio} disabled={!isEditing} rows={3}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#45CFFF] resize-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Current Password</label>
                                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                            <div>
                                <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">New Password</label>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                            <div>
                                <label className="block text-xs text-[#718096] dark:text-[#A0AEC0] mb-1.5 font-medium">Confirm Password</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setShowPasswordModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]">Cancel</button>
                                <button onClick={handleChangePassword} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1E56E0] to-[#45CFFF] text-white text-sm font-semibold hover:opacity-90">Update Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
