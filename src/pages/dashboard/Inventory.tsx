import { useState } from "react";
import { FaSearch, FaWarehouse, FaExclamationTriangle, FaCheckCircle, FaEdit, FaPlus, FaTruck, FaBoxOpen, FaSync } from "react-icons/fa";

const inventoryItems = [
    { id: "INV-001", name: "Business Card Design", sku: "BCD-001", category: "Design", stock: 200, minStock: 50, status: "In Stock", lastUpdated: "Jan 15, 2025", supplier: "PrintBD" },
    { id: "INV-002", name: "Flyer Design Templates", sku: "FLT-001", category: "Design", stock: 15, minStock: 20, status: "Low Stock", lastUpdated: "Jan 14, 2025", supplier: "DesignHub" },
    { id: "INV-003", name: "T-Shirt Print Designs", sku: "TPD-001", category: "Design", stock: 3, minStock: 10, status: "Critical", lastUpdated: "Jan 14, 2025", supplier: "PrintBD" },
    { id: "INV-004", name: "Domain Licenses (Annual)", sku: "DLA-001", category: "Digital", stock: 500, minStock: 100, status: "In Stock", lastUpdated: "Jan 13, 2025", supplier: "Namecheap" },
    { id: "INV-005", name: "Hosting SSL Certificates", sku: "HSC-001", category: "Digital", stock: 350, minStock: 100, status: "In Stock", lastUpdated: "Jan 13, 2025", supplier: "Cloudflare" },
    { id: "INV-006", name: "Branded Merchandise Kits", sku: "BMK-001", category: "Merchandise", stock: 8, minStock: 15, status: "Low Stock", lastUpdated: "Jan 12, 2025", supplier: "MerchPro" },
    { id: "INV-007", name: "Software License Keys", sku: "SLK-001", category: "Digital", stock: 120, minStock: 50, status: "In Stock", lastUpdated: "Jan 12, 2025", supplier: "Adobe" },
    { id: "INV-008", name: "Brochure Templates", sku: "BRT-001", category: "Design", stock: 45, minStock: 30, status: "In Stock", lastUpdated: "Jan 11, 2025", supplier: "DesignHub" },
    { id: "INV-009", name: "Office Stationery Pack", sku: "OSP-001", category: "Supplies", stock: 0, minStock: 20, status: "Out of Stock", lastUpdated: "Jan 10, 2025", supplier: "LocalStore" },
    { id: "INV-010", name: "Presentation Clickers", sku: "PCL-001", category: "Equipment", stock: 25, minStock: 10, status: "In Stock", lastUpdated: "Jan 10, 2025", supplier: "TechStore" },
];

const summaryCards = [
    { label: "Total Items", value: "1,266", icon: FaWarehouse, color: "text-[#45CFFF] bg-[#45CFFF]/10" },
    { label: "In Stock", value: "1,213", icon: FaCheckCircle, color: "text-green-500 bg-green-500/10" },
    { label: "Low Stock", value: "2", icon: FaExclamationTriangle, color: "text-amber-500 bg-amber-500/10" },
    { label: "Out of Stock", value: "1", icon: FaBoxOpen, color: "text-red-500 bg-red-500/10" },
];

export default function Inventory() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filtered = inventoryItems.filter((item) => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase()) || item.supplier.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || item.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Inventory</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{inventoryItems.length} items tracked</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50 transition-all">
                        <FaSync size={14} />
                        Sync Stock
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                        <FaPlus size={14} />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={18} />
                        </div>
                        <div>
                            <p className="text-2xl font-sora font-bold text-[#1a1f36] dark:text-white">{stat.value}</p>
                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                    <input
                        type="text"
                        placeholder="Search inventory..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                    />
                </div>
                <div className="flex gap-2">
                    {["All", "In Stock", "Low Stock", "Out of Stock", "Critical"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${statusFilter === s ? "bg-[#45CFFF] text-white" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inventory Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Min Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Supplier</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item) => {
                                const stockPct = item.minStock > 0 ? (item.stock / item.minStock) * 100 : 100;
                                return (
                                    <tr key={item.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-3.5">
                                            <div>
                                                <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{item.name}</p>
                                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{item.id}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm font-mono text-[#45CFFF]">{item.sku}</td>
                                        <td className="px-6 py-3.5">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#45CFFF]/10 text-[#45CFFF]">{item.category}</span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-[#1a1f36] dark:text-white">{item.stock}</span>
                                                <div className="w-16 h-1.5 bg-[#E2E8F0] dark:bg-[#2D3748] rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${stockPct <= 0 ? "bg-red-500" : stockPct < 100 ? "bg-amber-500" : "bg-green-500"}`}
                                                        style={{ width: `${Math.min(stockPct, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{item.minStock}</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === "In Stock" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                                item.status === "Low Stock" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                                                    item.status === "Critical" ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                                                        "bg-red-500/10 text-red-600 dark:text-red-400"
                                                }`}>
                                                {item.status === "Out of Stock" && <FaExclamationTriangle size={10} className="inline mr-1" />}
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{item.supplier}</td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-1">
                                                <button className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaTruck size={13} /></button>
                                                <button className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEdit size={13} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
