import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Trash2,
    Plus,
    Minus,
    ShoppingCart,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Package,
    User,
    Mail,
    Phone,
    Globe,
} from "lucide-react";
import { useCart } from "../store/cartStore";
import Swal from "sweetalert2";

/* ------------------------------------------------------------------ */
/*  Entra Global Tech — Cart & Checkout Page                           */
/*  React + TypeScript + Tailwind  (navy / cyan / blue tokens)         */
/* ------------------------------------------------------------------ */

interface CheckoutForm {
    name: string;
    email: string;
    phone: string;
    country: string;
}

const INITIAL_FORM: CheckoutForm = { name: "", email: "", phone: "", country: "" };

export default function Cart() {
    const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (field: keyof CheckoutForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const e: Partial<Record<keyof CheckoutForm, string>> = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
        if (!form.phone.trim()) e.phone = "Phone is required";
        if (!form.country.trim()) e.country = "Country is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const order = {
            customer: form,
            items: items.map((item) => ({
                id: item.id,
                name: item.name,
                serviceKey: item.serviceKey,
                price: item.price,
                period: item.period,
                quantity: item.quantity,
            })),
            total: totalPrice,
            createdAt: new Date().toISOString(),
        };

        const orders = JSON.parse(localStorage.getItem("entra-orders") || "[]");
        orders.push(order);
        localStorage.setItem("entra-orders", JSON.stringify(orders));

        clearCart();
        setSubmitted(true);

        Swal.fire({
            icon: "success",
            title: "Order Placed!",
            text: "Thank you! We'll contact you shortly to confirm your order.",
            confirmButtonColor: "#1E56E0",
            background: "#0F1E3D",
            color: "#fff",
        });
    };

    /* ---- Empty / Thank-you state ---- */
    if (submitted || items.length === 0) {
        return (
            <div className="min-h-screen bg-white px-5 py-24 dark:bg-[#060B14] sm:px-8 md:px-16">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#45CFFF]/10">
                        <ShoppingCart size={36} className="text-[#45CFFF]" />
                    </span>
                    <h1 className="font-sora text-3xl font-bold text-[#1a1f36] dark:text-white sm:text-4xl">
                        {submitted ? "Thank You!" : "Your Cart is Empty"}
                    </h1>
                    <p className="mt-4 text-[1rem] leading-relaxed text-[#596887] dark:text-[#B9C7E0]">
                        {submitted
                            ? "Your order has been placed successfully. We'll reach out to you soon."
                            : "Explore our services and add a plan to get started."}
                    </p>
                    <Link
                        to="/"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-8 py-3.5 text-[0.95rem] font-semibold text-[#060B14] shadow-[0_8px_24px_rgba(46,139,240,0.35)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(46,139,240,0.5)]"
                    >
                        <ArrowLeft size={16} /> Browse Services
                    </Link>
                </div>
            </div>
        );
    }

    /* ---- Cart with items ---- */
    return (
        <div className="min-h-screen bg-white px-5 py-12 dark:bg-[#060B14] sm:px-8 md:px-16">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-10">
                    <span className="mb-3 inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.22em] text-[#45CFFF]">
                        <ShoppingCart size={14} />
                        Shopping Cart
                    </span>
                    <h1 className="font-sora text-[2rem] font-bold text-[#1a1f36] dark:text-white sm:text-[2.5rem]">
                        Your Cart{" "}
                        <span className="text-[#45CFFF]">({totalItems})</span>
                    </h1>
                </div>

                <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
                    {/* ---- Cart Items ---- */}
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden rounded-2xl border border-black/8 bg-white p-6 transition-all duration-300 hover:border-[#45CFFF]/30 hover:shadow-[0_12px_32px_rgba(46,139,240,0.12)] dark:border-white/[0.08] dark:bg-gradient-to-b dark:from-[#0F1E3D] dark:to-[#0B1730] dark:hover:border-[#45CFFF]/20"
                            >
                                {item.highlight && (
                                    <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#45CFFF] via-[#2E8BF0] to-[#1E56E0]" />
                                )}

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#45CFFF]/10">
                                                <Package size={15} className="text-[#45CFFF]" />
                                            </span>
                                            <h3 className="font-sora text-[1.05rem] font-bold text-[#1a1f36] dark:text-white">
                                                {item.name}
                                            </h3>
                                            {item.highlight && (
                                                <span className="rounded-full bg-[#45CFFF]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#45CFFF]">
                                                    Popular
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1.5 ml-10 text-[0.82rem] text-[#8b95ad] dark:text-[#7C8AAD]">
                                            {item.tagline}
                                        </p>
                                        <div className="ml-10 mt-2 flex flex-wrap gap-1.5">
                                            {item.features.slice(0, 3).map((f) => (
                                                <span
                                                    key={f}
                                                    className="inline-flex items-center gap-1 rounded-full border border-black/6 bg-black/[0.02] px-2 py-0.5 text-[0.7rem] text-[#596887] dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-[#B9C7E0]"
                                                >
                                                    <CheckCircle2 size={10} className="text-[#45CFFF]" />
                                                    {f}
                                                </span>
                                            ))}
                                            {item.features.length > 3 && (
                                                <span className="text-[0.7rem] text-[#8b95ad] dark:text-[#7C8AAD]">
                                                    +{item.features.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                                        <div className="text-right">
                                            <div className="flex items-baseline gap-1">
                                                <span className="font-sora text-[1.5rem] font-bold text-[#1a1f36] dark:text-white">
                                                    ৳{item.price}
                                                </span>
                                                {item.period && (
                                                    <span className="text-[0.78rem] text-[#8b95ad] dark:text-[#7C8AAD]">
                                                        {item.period}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center rounded-full border border-black/8 bg-black/[0.02] dark:border-white/[0.08] dark:bg-white/[0.03]">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#596887] transition-colors hover:bg-[#45CFFF]/10 hover:text-[#45CFFF] dark:text-[#B9C7E0]"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="min-w-[2rem] text-center font-mono text-[0.85rem] font-medium text-[#1a1f36] dark:text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#596887] transition-colors hover:bg-[#45CFFF]/10 hover:text-[#45CFFF] dark:text-[#B9C7E0]"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8b95ad] transition-colors hover:bg-red-500/10 hover:text-red-500 dark:text-[#7C8AAD]"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Link
                            to="/"
                            className="mt-4 inline-flex items-center gap-2 text-[0.88rem] font-medium text-[#596887] transition-colors hover:text-[#1E56E0] dark:text-[#B9C7E0] dark:hover:text-[#45CFFF]"
                        >
                            <ArrowLeft size={15} /> Continue Shopping
                        </Link>
                    </div>

                    {/* ---- Order Summary / Checkout ---- */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <div className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:border-white/[0.08] dark:bg-gradient-to-b dark:from-[#0F1E3D] dark:to-[#0B1730] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                            <span className="block h-1 bg-gradient-to-r from-[#45CFFF] via-[#2E8BF0] to-[#1E56E0]" />

                            <div className="p-6">
                                <h2 className="font-sora text-[1.1rem] font-bold text-[#1a1f36] dark:text-white">
                                    Order Summary
                                </h2>

                                <div className="mt-5 space-y-3">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between text-[0.85rem]">
                                            <span className="text-[#596887] dark:text-[#B9C7E0]">
                                                {item.name} × {item.quantity}
                                            </span>
                                            <span className="font-medium text-[#1a1f36] dark:text-white">
                                                ৳{item.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="my-5 h-px bg-gradient-to-r from-transparent via-[#45CFFF]/20 to-transparent" />

                                <div className="flex items-baseline justify-between">
                                    <span className="font-sora text-[1rem] font-bold text-[#1a1f36] dark:text-white">
                                        Total
                                    </span>
                                    <span className="font-sora text-[1.6rem] font-bold text-[#1a1f36] dark:text-white">
                                        ৳{totalPrice}
                                    </span>
                                </div>

                                {!checkoutOpen ? (
                                    <button
                                        type="button"
                                        onClick={() => setCheckoutOpen(true)}
                                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-6 py-3.5 text-[0.95rem] font-semibold text-[#060B14] shadow-[0_8px_24px_rgba(46,139,240,0.35)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(46,139,240,0.5)]"
                                    >
                                        Proceed to Checkout <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                        <h3 className="font-sora text-[0.95rem] font-bold text-[#1a1f36] dark:text-white">
                                            Checkout Details
                                        </h3>

                                        {/* Name */}
                                        <div>
                                            <label className="mb-1.5 flex items-center gap-1.5 text-[0.8rem] font-medium text-[#596887] dark:text-[#B9C7E0]">
                                                <User size={13} className="text-[#45CFFF]" />
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={(e) => handleChange("name", e.target.value)}
                                                placeholder="John Doe"
                                                className={`w-full rounded-xl border ${errors.name ? "border-red-400" : "border-black/10 dark:border-white/[0.1]"
                                                    } bg-black/[0.02] px-4 py-2.5 text-[0.88rem] text-[#1a1f36] placeholder-[#b0b8c9] transition-colors focus:border-[#45CFFF] focus:outline-none focus:ring-1 focus:ring-[#45CFFF]/30 dark:bg-white/[0.04] dark:text-white dark:placeholder-[#596887]`}
                                            />
                                            {errors.name && <p className="mt-1 text-[0.75rem] text-red-400">{errors.name}</p>}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="mb-1.5 flex items-center gap-1.5 text-[0.8rem] font-medium text-[#596887] dark:text-[#B9C7E0]">
                                                <Mail size={13} className="text-[#45CFFF]" />
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => handleChange("email", e.target.value)}
                                                placeholder="john@example.com"
                                                className={`w-full rounded-xl border ${errors.email ? "border-red-400" : "border-black/10 dark:border-white/[0.1]"
                                                    } bg-black/[0.02] px-4 py-2.5 text-[0.88rem] text-[#1a1f36] placeholder-[#b0b8c9] transition-colors focus:border-[#45CFFF] focus:outline-none focus:ring-1 focus:ring-[#45CFFF]/30 dark:bg-white/[0.04] dark:text-white dark:placeholder-[#596887]`}
                                            />
                                            {errors.email && <p className="mt-1 text-[0.75rem] text-red-400">{errors.email}</p>}
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="mb-1.5 flex items-center gap-1.5 text-[0.8rem] font-medium text-[#596887] dark:text-[#B9C7E0]">
                                                <Phone size={13} className="text-[#45CFFF]" />
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={form.phone}
                                                onChange={(e) => handleChange("phone", e.target.value)}
                                                placeholder="+880 1XXXXXXXXX"
                                                className={`w-full rounded-xl border ${errors.phone ? "border-red-400" : "border-black/10 dark:border-white/[0.1]"
                                                    } bg-black/[0.02] px-4 py-2.5 text-[0.88rem] text-[#1a1f36] placeholder-[#b0b8c9] transition-colors focus:border-[#45CFFF] focus:outline-none focus:ring-1 focus:ring-[#45CFFF]/30 dark:bg-white/[0.04] dark:text-white dark:placeholder-[#596887]`}
                                            />
                                            {errors.phone && <p className="mt-1 text-[0.75rem] text-red-400">{errors.phone}</p>}
                                        </div>

                                        {/* Country */}
                                        <div>
                                            <label className="mb-1.5 flex items-center gap-1.5 text-[0.8rem] font-medium text-[#596887] dark:text-[#B9C7E0]">
                                                <Globe size={13} className="text-[#45CFFF]" />
                                                Country
                                            </label>
                                            <select
                                                value={form.country}
                                                onChange={(e) => handleChange("country", e.target.value)}
                                                className={`w-full rounded-xl border ${errors.country ? "border-red-400" : "border-black/10 dark:border-white/[0.1]"
                                                    } bg-black/[0.02] px-4 py-2.5 text-[0.88rem] text-[#1a1f36] transition-colors focus:border-[#45CFFF] focus:outline-none focus:ring-1 focus:ring-[#45CFFF]/30 dark:bg-white/[0.04] dark:text-white`}
                                            >
                                                <option value="">Select country</option>
                                                <option value="Bangladesh">Bangladesh</option>
                                                <option value="India">India</option>
                                                <option value="Pakistan">Pakistan</option>
                                                <option value="United States">United States</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Canada">Canada</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Germany">Germany</option>
                                                <option value="France">France</option>
                                                <option value="Japan">Japan</option>
                                                <option value="Singapore">Singapore</option>
                                                <option value="UAE">United Arab Emirates</option>
                                                <option value="Saudi Arabia">Saudi Arabia</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.country && <p className="mt-1 text-[0.75rem] text-red-400">{errors.country}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] px-6 py-3.5 text-[0.95rem] font-semibold text-[#060B14] shadow-[0_8px_24px_rgba(46,139,240,0.35)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(46,139,240,0.5)]"
                                        >
                                            <CheckCircle2 size={16} /> Place Order — ৳{totalPrice}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setCheckoutOpen(false)}
                                            className="w-full text-center text-[0.82rem] text-[#8b95ad] transition-colors hover:text-[#1E56E0] dark:text-[#7C8AAD] dark:hover:text-[#45CFFF]"
                                        >
                                            Back to cart
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
