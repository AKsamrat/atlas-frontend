import { useState, useMemo } from "react";
import {
    FaSearch, FaPlus, FaWallet, FaArrowUp, FaArrowDown, FaExchangeAlt,
    FaEye, FaTimes, FaCheckCircle, FaCreditCard, FaBuilding, FaMobileAlt,
    FaMoneyBillWave,
} from "react-icons/fa";

interface Account {
    id: number;
    name: string;
    type: "Bank" | "Cash" | "Mobile" | "Card";
    icon: typeof FaWallet;
    balance: number;
    color: string;
}

interface Transaction {
    id: number;
    date: string;
    description: string;
    category: string;
    type: "Income" | "Expense" | "Transfer";
    amount: number;
    account: string;
    reference: string;
}

const initialAccounts: Account[] = [
    { id: 1, name: "Primary Bank Account", type: "Bank", icon: FaBuilding, balance: 2850000, color: "from-[#1E56E0] to-[#45CFFF]" },
    { id: 2, name: "Cash on Hand", type: "Cash", icon: FaMoneyBillWave, balance: 125000, color: "from-[#10B981] to-[#059669]" },
    { id: 3, name: "bKash Business", type: "Mobile", icon: FaMobileAlt, balance: 342500, color: "from-[#E91E63] to-[#C2185B]" },
    { id: 4, name: "Nagad Account", type: "Mobile", icon: FaMobileAlt, balance: 187000, color: "from-[#FF9800] to-[#F57C00]" },
    { id: 5, name: "Corporate Credit Card", type: "Card", icon: FaCreditCard, balance: -45000, color: "from-[#8B5CF6] to-[#6D28D9]" },
];

const initialTransactions: Transaction[] = [
    { id: 1, date: "Jan 28, 2025", description: "Order #ORD-7841 Payment - Rafiq Hasan", category: "Order Payment", type: "Income", amount: 2400, account: "bKash Business", reference: "ORD-7841" },
    { id: 2, date: "Jan 28, 2025", description: "Order #ORD-7840 Payment - Sumaiya Akter", category: "Order Payment", type: "Income", amount: 850, account: "Primary Bank Account", reference: "ORD-7840" },
    { id: 3, date: "Jan 27, 2025", description: "Office Rent - January", category: "Rent", type: "Expense", amount: 35000, account: "Primary Bank Account", reference: "EXP-001" },
    { id: 4, date: "Jan 27, 2025", description: "Order #ORD-7838 Payment - Nusrat Jahan", category: "Order Payment", type: "Income", amount: 600, account: "bKash Business", reference: "ORD-7838" },
    { id: 5, date: "Jan 26, 2025", description: "Internet & Utilities", category: "Utilities", type: "Expense", amount: 8500, account: "Primary Bank Account", reference: "EXP-002" },
    { id: 6, date: "Jan 26, 2025", description: "Order #ORD-7837 Payment - Arif Mahmud", category: "Order Payment", type: "Income", amount: 180, account: "Cash on Hand", reference: "ORD-7837" },
    { id: 7, date: "Jan 25, 2025", description: "Order #ORD-7836 Payment - Karim Ahmed", category: "Order Payment", type: "Income", amount: 3500, account: "Primary Bank Account", reference: "ORD-7836" },
    { id: 8, date: "Jan 25, 2025", description: "Software Subscription - Adobe", category: "Software", type: "Expense", amount: 12000, account: "Corporate Credit Card", reference: "EXP-003" },
    { id: 9, date: "Jan 24, 2025", description: "Transfer to bKash Account", category: "Transfer", type: "Transfer", amount: 50000, account: "Primary Bank Account", reference: "TRF-001" },
    { id: 10, date: "Jan 24, 2025", description: "Order #ORD-7835 Payment - Mehedi Hasan", category: "Order Payment", type: "Income", amount: 1200, account: "bKash Business", reference: "ORD-7835" },
    { id: 11, date: "Jan 23, 2025", description: "Office Supplies", category: "Supplies", type: "Expense", amount: 4200, account: "Cash on Hand", reference: "EXP-004" },
    { id: 12, date: "Jan 22, 2025", description: "Marketing Campaign - Facebook", category: "Marketing", type: "Expense", amount: 25000, account: "Primary Bank Account", reference: "EXP-005" },
    { id: 13, date: "Jan 21, 2025", description: "Order #ORD-7833 Payment - Sakib Al Hasan", category: "Order Payment", type: "Income", amount: 2400, account: "Nagad Account", reference: "ORD-7833" },
    { id: 14, date: "Jan 20, 2025", description: "Client Payment - EduPath Institute", category: "Service Payment", type: "Income", amount: 5200, account: "Primary Bank Account", reference: "SRV-001" },
    { id: 15, date: "Jan 19, 2025", description: "Order #ORD-7832 Payment - Tasnim Ahmed", category: "Order Payment", type: "Income", amount: 850, account: "Cash on Hand", reference: "ORD-7832" },
];

const fmt = (n: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n);
const typeColors = {
    Income: "bg-green-500/10 text-green-600 dark:text-green-400",
    Expense: "bg-red-500/10 text-red-600 dark:text-red-400",
    Transfer: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

export default function Accounts() {
    const [accounts] = useState(initialAccounts);
    const [transactions, setTransactions] = useState(initialTransactions);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [showDetail, setShowDetail] = useState<Transaction | null>(null);
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const [showAddTx, setShowAddTx] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const [newAccName, setNewAccName] = useState("");
    const [newAccType, setNewAccType] = useState<"Bank" | "Cash" | "Mobile" | "Card">("Bank");
    const [newAccBalance, setNewAccBalance] = useState("");

    const [txDesc, setTxDesc] = useState("");
    const [txCategory, setTxCategory] = useState("General");
    const [txType, setTxType] = useState<"Income" | "Expense">("Income");
    const [txAmount, setTxAmount] = useState("");
    const [txAccount, setTxAccount] = useState(accounts[0].name);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const summary = useMemo(() => {
        const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
        const totalIncome = transactions.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0);
        const totalExpense = transactions.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
        return { totalBalance, totalIncome, totalExpense, netProfit: totalIncome - totalExpense };
    }, [accounts, transactions]);

    const filtered = transactions.filter((t) => {
        const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.reference.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "All" || t.type === typeFilter;
        return matchSearch && matchType;
    });

    const handleCreateAccount = () => {
        if (!newAccName || !newAccBalance) return;

        showToast(`Account "${newAccName}" created successfully`);
        setShowCreateAccount(false); setNewAccName(""); setNewAccBalance("");
    };

    const handleAddTx = () => {
        if (!txDesc || !txAmount) return;
        const newTx: Transaction = {
            id: Date.now(), date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            description: txDesc, category: txCategory, type: txType, amount: Number(txAmount), account: txAccount,
            reference: `${txType === "Income" ? "INC" : "EXP"}-${String(transactions.length + 1).padStart(3, "0")}`,
        };
        setTransactions((prev) => [newTx, ...prev]);
        showToast(`Transaction added successfully`);
        setShowAddTx(false); setTxDesc(""); setTxAmount("");
    };

    const summaryCards = [
        { label: "Total Balance", value: fmt(summary.totalBalance), icon: FaWallet, color: "from-[#45CFFF] to-[#1E56E0]" },
        { label: "Total Income", value: fmt(summary.totalIncome), icon: FaArrowUp, color: "from-[#10B981] to-[#059669]" },
        { label: "Total Expenses", value: fmt(summary.totalExpense), icon: FaArrowDown, color: "from-[#F59E0B] to-[#D97706]" },
        { label: "Net Profit", value: fmt(summary.netProfit), icon: FaExchangeAlt, color: "from-[#8B5CF6] to-[#6D28D9]" },
    ];

    return (
        <div className="space-y-6 relative">
            {toast && (
                <div className="fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl bg-green-500 text-white text-sm font-semibold shadow-2xl">
                    <div className="flex items-center gap-2"><FaCheckCircle />{toast}</div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Accounts &amp; Finance</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Manage accounts, track income &amp; expenses</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowAddTx(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm font-medium text-[#1a1f36] dark:text-white hover:border-[#45CFFF]/50 transition-colors">
                        <FaExchangeAlt size={14} />Add Transaction
                    </button>
                    <button onClick={() => setShowCreateAccount(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                        <FaPlus size={14} />New Account
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card) => (
                    <div key={card.label} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-5 hover:shadow-lg transition-all group">
                        <div className="flex items-start justify-between">
                            <div><p className="text-xs text-[#718096] dark:text-[#A0AEC0] mb-1">{card.label}</p><p className="text-lg font-sora font-bold text-[#1a1f36] dark:text-white">{card.value}</p></div>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}><card.icon size={16} /></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Account Cards */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">My Accounts</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {accounts.map((acc) => (
                        <div key={acc.id} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 hover:shadow-lg transition-all group">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${acc.color} flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 transition-transform`}><acc.icon size={16} /></div>
                            <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mb-0.5">{acc.type}</p>
                            <p className="text-sm font-medium text-[#1a1f36] dark:text-white mb-2 truncate">{acc.name}</p>
                            <p className={`text-lg font-sora font-bold ${acc.balance >= 0 ? "text-[#1a1f36] dark:text-white" : "text-red-500"}`}>{fmt(acc.balance)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                    <input type="text" placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["All", "Income", "Expense", "Transfer"].map((s) => (
                        <button key={s} onClick={() => setTypeFilter(s)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${typeFilter === s ? "bg-[#45CFFF] text-white shadow-md" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}>
                            {s === "Income" && <FaArrowUp size={10} />}{s === "Expense" && <FaArrowDown size={10} />}{s === "Transfer" && <FaExchangeAlt size={10} />}
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transaction History Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                    <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Transaction History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] dark:border-[#2D3748]">
                                {["Date", "Description", "Category", "Account", "Type", "Amount", ""].map((h, i) => (
                                    <th key={i} className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((tx) => (
                                <tr key={tx.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{tx.date}</td>
                                    <td className="px-6 py-3.5"><p className="text-sm font-medium text-[#1a1f36] dark:text-white max-w-[260px] truncate">{tx.description}</p><p className="text-xs text-[#A0AEC0] font-mono">{tx.reference}</p></td>
                                    <td className="px-6 py-3.5"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#45CFFF]/10 text-[#45CFFF]">{tx.category}</span></td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{tx.account}</td>
                                    <td className="px-6 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[tx.type]}`}>{tx.type}</span></td>
                                    <td className="px-6 py-3.5 text-sm font-mono font-bold text-[#1a1f36] dark:text-white">{tx.type === "Expense" ? "-" : tx.type === "Transfer" ? "-" : "+"}{fmt(tx.amount)}</td>
                                    <td className="px-6 py-3.5"><button onClick={() => setShowDetail(tx)} className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEye size={13} /></button></td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (<tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[#A0AEC0]">No transactions found.</td></tr>)}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Transaction Details</h3>
                            <button onClick={() => setShowDetail(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-3">
                            <div className="text-center mb-4">
                                <p className={`text-3xl font-sora font-bold ${showDetail.type === "Income" ? "text-green-500" : showDetail.type === "Expense" ? "text-red-500" : "text-blue-500"}`}>
                                    {showDetail.type === "Expense" ? "-" : "+"}{fmt(showDetail.amount)}
                                </p>
                                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${typeColors[showDetail.type]}`}>{showDetail.type}</span>
                            </div>
                            {[{ l: "Description", v: showDetail.description }, { l: "Category", v: showDetail.category }, { l: "Account", v: showDetail.account }, { l: "Reference", v: showDetail.reference }, { l: "Date", v: showDetail.date }].map((r) => (
                                <div key={r.l} className="flex items-center justify-between py-2 border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 last:border-none">
                                    <span className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0]">{r.l}</span>
                                    <span className="text-sm text-[#1a1f36] dark:text-white text-right max-w-[60%] truncate">{r.v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => setShowDetail(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Account Modal */}
            {showCreateAccount && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Create New Account</h3>
                            <button onClick={() => setShowCreateAccount(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Account Name</label>
                                <input type="text" value={newAccName} onChange={(e) => setNewAccName(e.target.value)} placeholder="e.g., Savings Account"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Account Type</label>
                                <select value={newAccType} onChange={(e) => setNewAccType(e.target.value as typeof newAccType)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                    <option value="Bank">Bank</option><option value="Cash">Cash</option><option value="Mobile">Mobile</option><option value="Card">Card</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Opening Balance</label>
                                <input type="number" value={newAccBalance} onChange={(e) => setNewAccBalance(e.target.value)} placeholder="0"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => setShowCreateAccount(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]">Cancel</button>
                            <button onClick={handleCreateAccount} disabled={!newAccName || !newAccBalance}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                <FaPlus size={12} />Create Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Transaction Modal */}
            {showAddTx && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">Add Transaction</h3>
                            <button onClick={() => setShowAddTx(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Description</label>
                                <input type="text" value={txDesc} onChange={(e) => setTxDesc(e.target.value)} placeholder="e.g., Office supplies purchase"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Type</label>
                                    <select value={txType} onChange={(e) => setTxType(e.target.value as "Income" | "Expense")}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                        <option value="Income">Income</option><option value="Expense">Expense</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Category</label>
                                    <select value={txCategory} onChange={(e) => setTxCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                        <option>General</option><option>Order Payment</option><option>Rent</option><option>Utilities</option><option>Software</option><option>Marketing</option><option>Supplies</option><option>Service Payment</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Amount</label>
                                    <input type="number" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Account</label>
                                    <select value={txAccount} onChange={(e) => setTxAccount(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                        {accounts.map((a) => (<option key={a.id} value={a.name}>{a.name}</option>))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => setShowAddTx(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]">Cancel</button>
                            <button onClick={handleAddTx} disabled={!txDesc || !txAmount}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                <FaExchangeAlt size={12} />Add Transaction
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}