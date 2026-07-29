

import { useState } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaBoxOpen, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

const products = [
    { id: "PRD-001", name: "Web Development Package", category: "Services", price: "$2,400", stock: "∞", sold: 142, status: "Active", image: "WD" },
    { id: "PRD-002", name: "Logo & Branding Kit", category: "Design", price: "$850", stock: "∞", sold: 98, status: "Active", image: "LB" },
    { id: "PRD-003", name: "SEO Optimization Plan", category: "Marketing", price: "$1,200", stock: "∞", sold: 76, status: "Active", image: "SO" },
    { id: "PRD-004", name: "Social Media Management", category: "Marketing", price: "$600", stock: "∞", sold: 64, status: "Active", image: "SM" },
    { id: "PRD-005", name: "Domain + Hosting Annual", category: "Infrastructure", price: "$180", stock: 500, sold: 210, status: "Active", image: "DH" },
    { id: "PRD-006", name: "Flyer Design", category: "Design", price: "$120", stock: 15, sold: 320, status: "Low Stock", image: "FD" },
    { id: "PRD-007", name: "Business Card Design", category: "Design", price: "$50", stock: 200, sold: 450, status: "Active", image: "BC" },
    { id: "PRD-008", name: "Email Marketing Setup", category: "Marketing", price: "$300", stock: "∞", sold: 45, status: "Active", image: "EM" },
    { id: "PRD-009", name: "Mobile App Prototype", category: "Services", price: "$3,500", stock: "∞", sold: 18, status: "Active", image: "MA" },
    { id: "PRD-010", name: "T-Shirt Print Design", category: "Design", price: "$80", stock: 3, sold: 180, status: "Low Stock", image: "TS" },
];

const categories = ["All", "Services", "Design", "Marketing", "Infrastructure"];

const summaryCards = [
    { label: "Total Products", value: "326", icon: FaBoxOpen, color: "text-[#45CFFF] bg-[#45CFFF]/10" },
    { label: "Active Products", value: "298", icon: FaCheckCircle, color: "text-green-500 bg-green-500/10" },
    { label: "Low Stock Items", value: "12", icon: FaExclamationTriangle, color: "text-amber-500 bg-amber-500/10" },
    { label: "Out of Stock", value: "5", icon: FaTimesCircle, color: "text-red-500 bg-red-500/10" },
];

export default function Product() {
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);

    const filtered = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === "All" || p.category === catFilter;
        return matchSearch && matchCat;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Products</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">{products.length} products listed</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    <FaPlus size={14} />
                    Add Product
                </button>
            </div>

            {/* Stats */}
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
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                    />
                </div>
                <div className="flex gap-2">
                    {categories.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCatFilter(c)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${catFilter === c ? "bg-[#45CFFF] text-white" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Sold</th>
                                <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">Status</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((prod) => (
                                <tr key={prod.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] flex items-center justify-center text-white text-xs font-bold">{prod.image}</div>
                                            <div>
                                                <p className="text-sm font-medium text-[#1a1f36] dark:text-white">{prod.name}</p>
                                                <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{prod.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#45CFFF]/10 text-[#45CFFF]">{prod.category}</span>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm font-semibold text-[#1a1f36] dark:text-white">{prod.price}</td>
                                    <td className="px-6 py-3.5 text-sm font-mono text-[#718096] dark:text-[#A0AEC0]">{prod.stock}</td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{prod.sold} units</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${prod.status === "Active" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                            }`}>
                                            {prod.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEye size={13} /></button>
                                            <button className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEdit size={13} /></button>
                                            <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#718096] hover:text-red-500 transition-all"><FaTrash size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-[#0F1E3D] rounded-2xl border border-[#E2E8F0] dark:border-[#2D3748] p-6 w-full max-w-lg mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-sora text-lg font-bold text-[#1a1f36] dark:text-white mb-4">Add New Product</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Product Name</label>
                                <input className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Category</label>
                                    <select className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none">
                                        <option>Services</option>
                                        <option>Design</option>
                                        <option>Marketing</option>
                                        <option>Infrastructure</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Price ($)</label>
                                    <input type="number" className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Stock</label>
                                    <input type="number" className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Status</label>
                                    <select className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none">
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Description</label>
                                <textarea rows={3} className="w-full px-3 py-2 rounded-lg bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:ring-2 focus:ring-[#45CFFF] focus:outline-none resize-none" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F1F5F9] dark:hover:bg-white/[0.05] transition-colors">Cancel</button>
                            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity">Add Product</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
