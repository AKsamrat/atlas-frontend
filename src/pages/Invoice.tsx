import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSpinner, FaPrint, FaArrowLeft } from "react-icons/fa";
import { ordersApi, type OrderData } from "../services";
import { customerPanelApi } from "../services/CustomerPanel";
import logo from "../assets/entra-logo.png";

const fmt = (n: number) =>
    new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(isNaN(n) ? 0 : n);

/** Parse price strings like "৳4,999" / "$499" / "2,499" to number */
const safeNum = (v: string | number | undefined | null): number => {
    if (typeof v === "number") return isNaN(v) ? 0 : v;
    if (!v) return 0;
    const cleaned = String(v).replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
};

const fmtDate = (d: string) => {
    try {
        return new Date(d).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return d;
    }
};

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_COLORS: Record<string, string> = {
    unpaid: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    refunded: "bg-purple-100 text-purple-700",
};

export default function Invoice() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const invoiceRef = useRef<HTMLDivElement>(null);

    const fetchOrder = useCallback(async () => {
        if (!id) {
            setError("No order ID provided");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            // Try admin API first, fall back to customer API
            try {
                const res = await ordersApi.getOne(Number(id));
                setOrder(res.data);
            } catch {
                const res = await customerPanelApi.getOrderDetail(Number(id));
                setOrder(res.data as unknown as OrderData);
            }
        } catch {
            setError("Failed to load order details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const handlePrint = () => {
        // Hide layout elements before printing
        const sidebar = document.querySelector("aside");
        const header = document.querySelector("header");
        const mainContent = document.querySelector("main")?.parentElement;
        if (sidebar) sidebar.style.display = "none";
        if (header) header.style.display = "none";
        if (mainContent) {
            mainContent.style.margin = "0";
            mainContent.style.width = "100%";
        }
        window.print();
        // Restore after print
        setTimeout(() => {
            if (sidebar) sidebar.style.display = "";
            if (header) header.style.display = "";
            if (mainContent) {
                mainContent.style.margin = "";
                mainContent.style.width = "";
            }
        }, 500);
    };

    const subtotal = order?.items.reduce((sum, item) => sum + safeNum(item.price) * item.quantity, 0) ?? 0;

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <FaSpinner className="animate-spin text-[#45CFFF]" size={32} />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-sm text-red-500">{error || "Order not found"}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1E56E0] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a45b8] transition-colors"
                >
                    <FaArrowLeft size={12} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Print Controls — hidden when printing */}
            <div className="no-print mb-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#718096] hover:border-[#45CFFF] hover:text-[#45CFFF] transition-all dark:border-[#2D3748] dark:bg-[#0F1E3D] dark:text-[#A0AEC0]"
                    >
                        <FaArrowLeft size={12} /> Back
                    </button>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E56E0] to-[#2E8BF0] px-5 py-2.5 text-sm font-medium text-white shadow hover:shadow-lg transition-all"
                    >
                        <FaPrint size={14} /> Print Invoice
                    </button>
                </div>
            </div>

            {/* Invoice Content */}
            <div
                ref={invoiceRef}
                className="mx-auto max-w-[800px] rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-lg print:shadow-none print:border-none print:rounded-none"
            >
                {/* Header */}
                <div className="mb-8 flex flex-col items-center gap-4 border-b border-[#E2E8F0] pb-6">
                    {/* Logo centered */}
                    <img src={logo} alt="Company Logo" className="h-14 w-auto object-contain" />
                    <div className="text-center">
                        <h1 className="font-sora text-2xl font-bold text-[#1E56E0]">INVOICE</h1>
                        <p className="mt-1 font-mono text-sm text-[#718096]">{order.order_number}</p>
                    </div>
                    <div className="text-sm text-[#718096]">
                        <span className="text-xs">Date Issued: </span>
                        <span className="font-medium text-[#1a1f36]">{fmtDate(order.created_at)}</span>
                    </div>
                </div>

                {/* Bill To & Payment Info */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#718096]">
                            Bill To
                        </p>
                        <p className="text-sm font-semibold text-[#1a1f36]">{order.customer_name}</p>
                        <p className="text-sm text-[#718096]">{order.customer_email}</p>
                        {order.customer_phone && (
                            <p className="text-sm text-[#718096]">{order.customer_phone}</p>
                        )}
                        {order.customer_country && (
                            <p className="text-sm text-[#718096]">{order.customer_country}</p>
                        )}
                    </div>
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#718096]">
                            Payment Info
                        </p>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[#718096]">Status:</span>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PAYMENT_COLORS[order.payment_status] || ""}`}>
                                    {order.payment_status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[#718096]">Order:</span>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[order.status] || ""}`}>
                                    {order.status}
                                </span>
                            </div>
                            {order.payment_method && (
                                <p className="text-xs text-[#718096]">
                                    Method: {order.payment_method}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-[#E2E8F0]">
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[#718096]">
                                    Item
                                </th>
                                <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-[#718096]">
                                    Qty
                                </th>
                                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-[#718096]">
                                    Unit Price
                                </th>
                                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-[#718096]">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-[#E2E8F0]/50">
                                    <td className="py-3">
                                        <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{item.name}</p>
                                        <p className="text-xs text-[#A0AEC0]">{item.service_key}</p>
                                    </td>
                                    <td className="py-3 text-center text-sm text-[#718096]">
                                        {item.quantity}
                                    </td>
                                    <td className="py-3 text-right text-sm text-[#718096]">
                                        {fmt(safeNum(item.price))}
                                    </td>
                                    <td className="py-3 text-right text-sm font-medium text-[#1a1f36]">
                                        {fmt(safeNum(item.price) * item.quantity)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-full max-w-[280px] space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[#718096]">Subtotal</span>
                            <span className="text-[#1a1f36]">{fmt(subtotal)}</span>
                        </div>
                        <div className="border-t-2 border-[#E2E8F0] pt-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-[#1a1f36]">Total</span>
                            <span className="font-sora text-lg font-bold text-[#1E56E0]">{fmt(order.total_amount)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {order.notes && (
                    <div className="mt-8 rounded-lg bg-[#f8fafc] p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#718096]">Notes</p>
                        <p className="text-sm text-[#718096] italic">{order.notes}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 border-t border-[#E2E8F0] pt-4 text-center">
                    <p className="text-xs text-[#A0AEC0]">Thank you for your business!</p>
                    <p className="text-xs text-[#A0AEC0]">Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    /* Hide everything outside the invoice */
                    .no-print,
                    aside,
                    header,
                    nav,
                    footer,
                    .sidebar {
                        display: none !important;
                    }

                    /* Reset layout to full width for print */
                    body > div {
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    /* Show only the invoice */
                    .invoice-print-wrapper {
                        display: block !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }

                    /* Dark mode overrides for print */
                    .dark\:text-white, .dark .dark\:text-white {
                        color: #1a1f36 !important;
                    }
                    .dark\:bg-\[\#0B1730\], .dark .dark\:bg-\[\#0B1730\] {
                        background-color: white !important;
                    }
                    .dark\:border-\[\#2D3748\], .dark .dark\:border-\[\#2D3748\] {
                        border-color: #E2E8F0 !important;
                    }

                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    @page {
                        margin: 1cm;
                    }
                }
            `}</style>
        </>
    );
}
