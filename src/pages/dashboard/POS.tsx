import { useState, useEffect, useMemo, useCallback } from "react";
import {
    Search,
    Plus,
    Minus,
    Trash2,
    ShoppingCart,
    CreditCard,
    Banknote,
    Smartphone,
    Package,
    X,
    Check,

    User,
    FileText,
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { ordersApi, type CreateOrderPayload } from "../../services/Order";
import { productsApi, type ProductData } from "../../services/Product";
import { servicesApi, type ServiceData } from "../../services/Service";
import { servicePackagesApi, type ServicePackageData } from "../../services/ServicePackage";
import { domainPlansApi, type DomainPlanData } from "../../services/DomainPlan";
import { useToast } from "../../components/shared/Toast";

/* ── Types ─────────────────────────────────────────────────────── */
interface POSItem {
    /** Unique key: "product-{id}" or "pkg-{key}" or "svc-{id}" */
    key: string;
    name: string;
    price: number;
    category: string;
    type: "product" | "service" | "service-detail";
    /** Service packages use serviceKey; products use product id; services use "svc-{id}" */
    serviceKey: string;
    stock?: number;
}

interface CartLine extends POSItem {
    quantity: number;
}

interface CheckoutForm {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_country: string;
    payment_method: string;
    notes: string;
}

const INITIAL_FORM: CheckoutForm = {
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_country: "",
    payment_method: "cash",
    notes: "",
};

/* ── Helpers ───────────────────────────────────────────────────── */
const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 0 });

const parsePrice = (v: string | number): number => {
    if (typeof v === "number") return v;
    return parseFloat(String(v).replace(/[^0-9.]/g, "")) || 0;
};

/* ── POS Page ─────────────────────────────────────────────────── */
export default function POS() {
    const { showToast } = useToast();
    const { addNotification } = useNotifications();

    /* ── Catalog state ──────────────────────────────────────── */
    const [products, setProducts] = useState<ProductData[]>([]);
    const [packages, setPackages] = useState<Record<string, ServicePackageData[]>>({});
    const [services, setServices] = useState<ServiceData[]>([]);
    const [domainPlans, setDomainPlans] = useState<DomainPlanData[]>([]);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    /* ── Cart state ─────────────────────────────────────────── */
    const [cart, setCart] = useState<CartLine[]>([]);
    const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [lastOrderNumber, setLastOrderNumber] = useState("");

    /* ── Load catalog ───────────────────────────────────────── */
    useEffect(() => {
        const load = async () => {
            try {
                const [prodRes, pkgRes, svcRes, dpRes] = await Promise.allSettled([
                    productsApi.getAll({ per_page: 200, status: "active" }),
                    servicePackagesApi.getGrouped(),
                    servicesApi.getAll(),
                    domainPlansApi.getAll(),
                ]);

                if (prodRes.status === "fulfilled") {
                    setProducts(prodRes.value.data.data || []);
                }

                if (pkgRes.status === "fulfilled") {
                    const grouped = pkgRes.value.data;
                    const flat: Record<string, ServicePackageData[]> = {};
                    for (const [key, pkgs] of Object.entries(grouped)) {
                        flat[key] = pkgs;
                    }
                    setPackages(flat);
                }

                if (svcRes.status === "fulfilled") {
                    setServices(svcRes.value.data || []);
                }

                if (dpRes.status === "fulfilled") {
                    setDomainPlans(dpRes.value.data || []);
                }
            } catch {
                /* silent */
            } finally {
                setCatalogLoading(false);
            }
        };
        load();
    }, []);

    /* ── Build unified catalog ──────────────────────────────── */
    const catalog = useMemo<POSItem[]>(() => {
        const items: POSItem[] = [];

        // Products
        for (const p of products) {
            items.push({
                key: `product-${p.id}`,
                name: p.name,
                price: parsePrice(p.price),
                category: p.category || "Product",
                type: "product",
                serviceKey: String(p.id),
                stock: p.stock,
            });
        }

        // Service Packages
        for (const [groupKey, pkgs] of Object.entries(packages)) {
            for (const pkg of pkgs) {
                items.push({
                    key: `pkg-${groupKey}-${pkg.name}`,
                    name: pkg.name,
                    price: parsePrice(pkg.price),
                    category: groupKey
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase()),
                    type: "service",
                    serviceKey: groupKey,
                });
            }
        }

        // Services (from database)
        for (const svc of services) {
            items.push({
                key: `svc-${svc.id}`,
                name: svc.title,
                price: 0,
                category: svc.tag || "Services",
                type: "service-detail",
                serviceKey: `svc-${svc.id}`,
            });
        }

        // Domain Plans
        for (const dp of domainPlans) {
            items.push({
                key: `domain-${dp.id}`,
                name: dp.name,
                price: parsePrice(dp.price),
                category: "Domain Plan",
                type: "service",
                serviceKey: `domain-${dp.id}`,
            });
        }

        return items;
    }, [products, packages, services, domainPlans]);

    /* ── Categories ─────────────────────────────────────────── */
    const categories = useMemo(() => {
        const cats = new Set(catalog.map((i) => i.category));
        return ["all", ...Array.from(cats).sort()];
    }, [catalog]);

    /* ── Filtered catalog ───────────────────────────────────── */
    const filtered = useMemo(() => {
        let items = catalog;
        if (activeCategory !== "all") {
            items = items.filter((i) => i.category === activeCategory);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            items = items.filter(
                (i) =>
                    i.name.toLowerCase().includes(q) ||
                    i.category.toLowerCase().includes(q)
            );
        }
        return items;
    }, [catalog, activeCategory, search]);

    /* ── Cart operations ────────────────────────────────────── */
    const addToCart = useCallback((item: POSItem) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.key === item.key);
            if (existing) {
                return prev.map((c) =>
                    c.key === item.key ? { ...c, quantity: c.quantity + 1 } : c
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    }, []);

    const updateQty = useCallback((key: string, delta: number) => {
        setCart((prev) =>
            prev
                .map((c) =>
                    c.key === key
                        ? { ...c, quantity: Math.max(0, c.quantity + delta) }
                        : c
                )
                .filter((c) => c.quantity > 0)
        );
    }, []);

    const removeFromCart = useCallback((key: string) => {
        setCart((prev) => prev.filter((c) => c.key !== key));
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

    const updateCartPrice = useCallback((key: string, price: number) => {
        setCart((prev) =>
            prev.map((c) => (c.key === key ? { ...c, price: Math.max(0, price) } : c))
        );
    }, []);

    /* ── Totals ─────────────────────────────────────────────── */
    const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
    const itemCount = cart.reduce((sum, c) => sum + c.quantity, 0);

    /* ── Validation ─────────────────────────────────────────── */
    const validate = (): boolean => {
        const e: Partial<Record<keyof CheckoutForm, string>> = {};
        if (!form.customer_name.trim()) e.customer_name = "Name is required";
        if (!form.customer_email.trim()) e.customer_email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email))
            e.customer_email = "Invalid email";
        if (!form.customer_phone.trim()) e.customer_phone = "Phone is required";
        if (!form.customer_country.trim()) e.customer_country = "Country is required";
        if (cart.length === 0) e.notes = "Add at least one item";
        else if (cart.some((c) => c.price <= 0)) e.notes = "Set a price for all items";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ── Submit order ───────────────────────────────────────── */
    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);

        const payload: CreateOrderPayload = {
            customer_name: form.customer_name.trim(),
            customer_email: form.customer_email.trim(),
            customer_phone: form.customer_phone.trim(),
            customer_country: form.customer_country.trim(),
            payment_method: form.payment_method,
            notes: form.notes.trim() || undefined,
            items: cart.map((c) => ({
                service_key: c.serviceKey,
                name: c.name,
                price: String(c.price),
                period: "",
                quantity: c.quantity,
            })),
        };

        try {
            const res = await ordersApi.create(payload);
            const orderNumber = res.data?.order_number || "N/A";
            setLastOrderNumber(orderNumber);

            // Notify admin panel
            addNotification({
                panel: "admin",
                type: "order_created",
                title: "POS Order Created",
                message: `Order ${orderNumber} from ${form.customer_name} — ${itemCount} item(s)`,
                link: "/dashboard/orders",
            });

            setSuccess(true);
            showToast("Order created successfully!", "success");

            // Reset after 3 seconds
            setTimeout(() => {
                setCart([]);
                setForm(INITIAL_FORM);
                setSuccess(false);
                setLastOrderNumber("");
            }, 3000);
        } catch (err) {
            console.error("[POS] Order failed:", err);
            showToast("Failed to create order. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Success screen ─────────────────────────────────────── */
    if (success) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                        <Check className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1a1f36] dark:text-white">
                        Order Created!
                    </h2>
                    <p className="text-[#596887] dark:text-[#B9C7E0]">
                        Order number:{" "}
                        <span className="font-mono font-bold text-[#1E56E0] dark:text-[#45CFFF]">
                            {lastOrderNumber}
                        </span>
                    </p>
                    <p className="text-sm text-[#8b95ad] dark:text-[#7C8AAD]">
                        Redirecting to POS in a moment...
                    </p>
                </div>
            </div>
        );
    }

    /* ── Main POS layout ────────────────────────────────────── */
    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
            {/* ═══════════════════ LEFT: Catalog ═══════════════════ */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Search + Categories */}
                <div className="mb-4 space-y-3">
                    {/* Search bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b95ad]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products & services..."
                            className="w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 py-2.5 text-sm text-[#1a1f36] placeholder-[#8b95ad] focus:border-[#45CFFF]/50 focus:outline-none focus:ring-1 focus:ring-[#45CFFF]/30 dark:border-white/[0.08] dark:bg-[#0F1E3D] dark:text-white dark:placeholder-[#7C8AAD]"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b95ad] hover:text-[#1a1f36] dark:hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Category chips */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${activeCategory === cat
                                    ? "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-[#060B14] shadow-[0_4px_12px_rgba(69,207,255,0.3)]"
                                    : "border border-black/10 bg-white text-[#596887] hover:border-[#45CFFF]/30 dark:border-white/[0.08] dark:bg-[#0F1E3D] dark:text-[#B9C7E0] dark:hover:border-[#45CFFF]/30"
                                    }`}
                            >
                                {cat === "all" ? "All Items" : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product grid */}
                {catalogLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#45CFFF] border-t-transparent" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-[#8b95ad] dark:text-[#7C8AAD]">
                        <div className="text-center space-y-2">
                            <Package className="mx-auto h-10 w-10 opacity-40" />
                            <p className="text-sm">No items found</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 flex-1 content-start">
                        {filtered.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => addToCart(item)}
                                className="group relative flex flex-col items-start rounded-xl border border-black/8 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#45CFFF]/40 hover:shadow-[0_8px_24px_rgba(46,139,240,0.12)] active:scale-[0.97] dark:border-white/[0.08] dark:bg-[#0F1E3D] dark:hover:border-[#45CFFF]/30"
                            >
                                <span
                                    className={`mb-2 inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${item.type === "product"
                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                        : "bg-[#45CFFF]/10 text-[#1E56E0] dark:text-[#45CFFF]"
                                        }`}
                                >
                                    {item.type === "product"
                                        ? "Product"
                                        : item.type === "service-detail"
                                            ? "Service"
                                            : "Package"}
                                </span>
                                <h4 className="text-sm font-semibold text-[#1a1f36] dark:text-white leading-tight line-clamp-2">
                                    {item.name}
                                </h4>
                                <p className="mt-0.5 text-[10px] text-[#8b95ad] dark:text-[#7C8AAD]">
                                    {item.category}
                                </p>
                                <div className="mt-auto pt-3 flex items-center justify-between w-full">
                                    <span className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white">
                                        {item.price > 0 ? <>৳{fmt(item.price)}</> : <span className="text-xs text-[#8b95ad] dark:text-[#7C8AAD]">Set price on add</span>}
                                    </span>
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#45CFFF]/10 text-[#1E56E0] opacity-0 transition-opacity group-hover:opacity-100 dark:bg-[#45CFFF]/15 dark:text-[#45CFFF]">
                                        <Plus className="h-3.5 w-3.5" />
                                    </span>
                                </div>
                                {item.type === "product" && item.stock !== undefined && (
                                    <span className={`absolute top-3 right-3 text-[10px] font-medium ${item.stock > 0
                                        ? "text-emerald-500"
                                        : "text-red-400"
                                        }`}>
                                        {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ═══════════════════ RIGHT: Order Panel ═══════════════════ */}
            <div className="w-full lg:w-[420px] xl:w-[460px] flex flex-col rounded-2xl border border-black/8 bg-white p-5 shadow-lg dark:border-white/[0.08] dark:bg-[#0F1E3D] lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-[#45CFFF]" />
                        <h2 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white">
                            Current Order
                        </h2>
                        {itemCount > 0 && (
                            <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#1E56E0] px-1.5 text-[10px] font-bold text-white">
                                {itemCount}
                            </span>
                        )}
                    </div>
                    {cart.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-xs text-red-400 hover:text-red-500 transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Cart items */}
                <div className="flex-1 overflow-y-auto space-y-2.5 min-h-0 mb-4 scrollbar-thin">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-[#8b95ad] dark:text-[#7C8AAD]">
                            <ShoppingCart className="h-8 w-8 mb-2 opacity-30" />
                            <p className="text-sm">No items yet</p>
                            <p className="text-xs mt-1">Click items from the catalog</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.key}
                                className="rounded-xl border border-black/5 bg-[#f8f9fc] p-3 dark:border-white/[0.05] dark:bg-[#0B1730] space-y-2"
                            >
                                {/* Row 1: badge + name + delete */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span
                                            className={`shrink-0 inline-flex rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${item.type === "product"
                                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                : item.type === "service-detail"
                                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                    : "bg-[#45CFFF]/10 text-[#1E56E0] dark:text-[#45CFFF]"
                                                }`}
                                        >
                                            {item.type === "product"
                                                ? "Product"
                                                : item.type === "service-detail"
                                                    ? "Service"
                                                    : "Package"}
                                        </span>
                                        <p className="text-sm font-semibold text-[#1a1f36] dark:text-white truncate">
                                            {item.name}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.key)}
                                        className="shrink-0 flex h-6 w-6 items-center justify-center rounded-md text-[#8b95ad] hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>

                                {/* Row 2: category tag */}
                                <p className="text-[10px] text-[#8b95ad] dark:text-[#7C8AAD] -mt-1">
                                    {item.category}
                                </p>

                                {/* Row 3: price, qty controls, line total */}
                                <div className="flex items-center gap-3">
                                    {item.price > 0 ? (
                                        <span className="text-xs font-medium text-[#596887] dark:text-[#B9C7E0]">
                                            ৳{fmt(item.price)}
                                        </span>
                                    ) : (
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="Set price"
                                            value={item.price || ""}
                                            onChange={(e) => updateCartPrice(item.key, parseFloat(e.target.value) || 0)}
                                            className="w-[90px] rounded-md border border-[#45CFFF]/30 bg-white px-2 py-1 text-xs font-semibold text-[#1a1f36] focus:border-[#45CFFF] focus:outline-none focus:ring-1 focus:ring-[#45CFFF]/30 dark:border-[#45CFFF]/20 dark:bg-[#0B1730] dark:text-[#45CFFF]"
                                        />
                                    )}
                                    <span className="text-xs text-[#8b95ad] dark:text-[#7C8AAD]">×</span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => updateQty(item.key, -1)}
                                            className="flex h-6 w-6 items-center justify-center rounded-md border border-black/10 bg-white text-[#596887] hover:bg-red-50 hover:text-red-500 dark:border-white/[0.1] dark:bg-[#0F1E3D] dark:text-[#B9C7E0] dark:hover:bg-red-500/10"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-7 text-center text-sm font-bold text-[#1a1f36] dark:text-white">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQty(item.key, 1)}
                                            className="flex h-6 w-6 items-center justify-center rounded-md border border-black/10 bg-white text-[#596887] hover:bg-[#45CFFF]/10 hover:text-[#1E56E0] dark:border-white/[0.1] dark:bg-[#0F1E3D] dark:text-[#B9C7E0] dark:hover:bg-[#45CFFF]/10"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <span className="ml-auto text-sm font-bold text-[#1a1f36] dark:text-white">
                                        ৳{fmt(item.price * item.quantity)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Divider */}
                <div className="border-t border-black/5 dark:border-white/[0.06] pt-4 space-y-4 overflow-y-auto max-h-[calc(100vh-30rem)] lg:max-h-none scrollbar-thin">
                    {/* ── Customer Details ─────────────────────── */}
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#596887] dark:text-[#B9C7E0]">
                        <User className="h-3.5 w-3.5" /> Customer Details
                    </h3>

                    <div className="space-y-3">
                        <div>
                            <input
                                type="text"
                                placeholder="Customer Name *"
                                value={form.customer_name}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, customer_name: e.target.value }))
                                }
                                className={`w-full rounded-lg border bg-[#f8f9fc] px-3 py-2 text-sm text-[#1a1f36] placeholder-[#8b95ad] focus:outline-none focus:ring-1 dark:border-white/[0.08] dark:bg-[#0B1730] dark:text-white dark:placeholder-[#7C8AAD] ${errors.customer_name
                                    ? "border-red-400 focus:ring-red-400"
                                    : "border-black/10 focus:border-[#45CFFF]/50 focus:ring-[#45CFFF]/30"
                                    }`}
                            />
                            {errors.customer_name && (
                                <p className="mt-1 text-xs text-red-400">{errors.customer_name}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="Email *"
                                value={form.customer_email}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, customer_email: e.target.value }))
                                }
                                className={`w-full rounded-lg border bg-[#f8f9fc] px-3 py-2 text-sm text-[#1a1f36] placeholder-[#8b95ad] focus:outline-none focus:ring-1 dark:border-white/[0.08] dark:bg-[#0B1730] dark:text-white dark:placeholder-[#7C8AAD] ${errors.customer_email
                                    ? "border-red-400 focus:ring-red-400"
                                    : "border-black/10 focus:border-[#45CFFF]/50 focus:ring-[#45CFFF]/30"
                                    }`}
                            />
                            {errors.customer_email && (
                                <p className="mt-1 text-xs text-red-400">{errors.customer_email}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input
                                    type="tel"
                                    placeholder="Phone *"
                                    value={form.customer_phone}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, customer_phone: e.target.value }))
                                    }
                                    className={`w-full rounded-lg border bg-[#f8f9fc] px-3 py-2 text-sm text-[#1a1f36] placeholder-[#8b95ad] focus:outline-none focus:ring-1 dark:border-white/[0.08] dark:bg-[#0B1730] dark:text-white dark:placeholder-[#7C8AAD] ${errors.customer_phone
                                        ? "border-red-400 focus:ring-red-400"
                                        : "border-black/10 focus:border-[#45CFFF]/50 focus:ring-[#45CFFF]/30"
                                        }`}
                                />
                                {errors.customer_phone && (
                                    <p className="mt-1 text-xs text-red-400">{errors.customer_phone}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Country *"
                                    value={form.customer_country}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, customer_country: e.target.value }))
                                    }
                                    className={`w-full rounded-lg border bg-[#f8f9fc] px-3 py-2 text-sm text-[#1a1f36] placeholder-[#8b95ad] focus:outline-none focus:ring-1 dark:border-white/[0.08] dark:bg-[#0B1730] dark:text-white dark:placeholder-[#7C8AAD] ${errors.customer_country
                                        ? "border-red-400 focus:ring-red-400"
                                        : "border-black/10 focus:border-[#45CFFF]/50 focus:ring-[#45CFFF]/30"
                                        }`}
                                />
                                {errors.customer_country && (
                                    <p className="mt-1 text-xs text-red-400">{errors.customer_country}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Payment Method ───────────────────────── */}
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#596887] dark:text-[#B9C7E0] pt-1">
                        <CreditCard className="h-3.5 w-3.5" /> Payment Method
                    </h3>

                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { value: "cash", label: "Cash", icon: Banknote },
                            { value: "card", label: "Card", icon: CreditCard },
                            { value: "mobile", label: "Mobile", icon: Smartphone },
                        ].map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => setForm((f) => ({ ...f, payment_method: value }))}
                                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-all ${form.payment_method === value
                                    ? "border-[#45CFFF]/50 bg-[#45CFFF]/5 text-[#1E56E0] dark:border-[#45CFFF]/40 dark:bg-[#45CFFF]/10 dark:text-[#45CFFF]"
                                    : "border-black/10 bg-[#f8f9fc] text-[#596887] hover:border-[#45CFFF]/25 dark:border-white/[0.08] dark:bg-[#0B1730] dark:text-[#B9C7E0] dark:hover:border-[#45CFFF]/20"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* ── Notes ─────────────────────────────────── */}
                    <div>
                        <textarea
                            placeholder="Order notes (optional)"
                            rows={2}
                            value={form.notes}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, notes: e.target.value }))
                            }
                            className="w-full rounded-lg border border-black/10 bg-[#f8f9fc] px-3 py-2 text-sm text-[#1a1f36] placeholder-[#8b95ad] focus:border-[#45CFFF]/50 focus:outline-none focus:ring-1 focus:ring-[#45CFFF]/30 dark:border-white/[0.08] dark:bg-[#0B1730] dark:text-white dark:placeholder-[#7C8AAD] resize-none"
                        />
                        {errors.notes && (
                            <p className="mt-1 text-xs text-red-400">{errors.notes}</p>
                        )}
                    </div>

                    {/* ── Order Summary ──────────────────────── */}
                    <div className="rounded-xl border border-black/5 bg-[#f8f9fc] p-4 dark:border-white/[0.05] dark:bg-[#0B1730] space-y-2">
                        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#596887] dark:text-[#B9C7E0]">
                            <FileText className="h-3.5 w-3.5" /> Order Summary
                        </h3>
                        {cart.length > 0 && (
                            <div className="space-y-1.5">
                                {cart.map((item) => (
                                    <div key={item.key} className="flex items-center justify-between text-xs">
                                        <span className="text-[#596887] dark:text-[#B9C7E0] truncate max-w-[60%]">
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span className="font-medium text-[#1a1f36] dark:text-white whitespace-nowrap">
                                            ৳{fmt(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="border-t border-black/5 dark:border-white/[0.06] pt-2 space-y-1">
                            <div className="flex items-center justify-between text-sm text-[#596887] dark:text-[#B9C7E0]">
                                <span>Subtotal ({itemCount} items)</span>
                                <span className="font-medium">৳{fmt(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-sora text-base font-bold text-[#1a1f36] dark:text-white">
                                    Total
                                </span>
                                <span className="font-sora text-xl font-bold text-[#1E56E0] dark:text-[#45CFFF]">
                                    ৳{fmt(subtotal)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || cart.length === 0}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(30,86,224,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(30,86,224,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {submitting ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <FileText className="h-4 w-4" />
                                Create Order — ৳{fmt(subtotal)}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
