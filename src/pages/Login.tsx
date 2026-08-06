
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        const loggedInUser = await login(email, password);
        setLoading(false);

        if (loggedInUser) {
            if (loggedInUser.role === "admin") navigate("/dashboard");
            else if (loggedInUser.role === "customer") navigate("/customer");
            else navigate("/user");
        } else {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                        E
                    </div>
                    <h1 className="font-sora text-2xl font-bold text-[#060B14] dark:text-white">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-1">
                        Sign in to your Entra Global Tech account
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error */}
                        {error && (
                            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={15} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={15} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF] focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0] hover:text-[#45CFFF] transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-[#E2E8F0] dark:border-[#2D3748] text-[#45CFFF] focus:ring-[#45CFFF] bg-[#F9FAFC] dark:bg-[#060B14]" />
                                <span className="text-sm text-[#718096] dark:text-[#A0AEC0]">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-medium text-[#45CFFF] hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" size={16} />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-[#E2E8F0] dark:bg-[#2D3748]" />
                        <span className="text-xs text-[#A0AEC0] font-medium">OR</span>
                        <div className="flex-1 h-px bg-[#E2E8F0] dark:bg-[#2D3748]" />
                    </div>

                    {/* Register Link */}
                    <p className="text-center text-sm text-[#718096] dark:text-[#A0AEC0]">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="font-semibold text-[#45CFFF] hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Demo Credentials */}
                {/* <div className="mt-6 rounded-2xl bg-[#F9FAFC] dark:bg-[#0F1E3D]/50 border border-[#E2E8F0] dark:border-[#2D3748] p-4">
                    <p className="text-xs font-mono font-medium text-[#718096] dark:text-[#A0AEC0] mb-2">Demo Credentials:</p>
                    <div className="space-y-1 text-xs text-[#718096] dark:text-[#A0AEC0]">
                        <p><span className="font-medium text-[#1a1f36] dark:text-white">Admin:</span> admin@entra.com / admin123</p>
                        <p><span className="font-medium text-[#1a1f36] dark:text-white">User:</span> user@entra.com / user123</p>
                    </div>
                </div> */}
            </div>
        </div>
    );
}
