import { useState, useEffect, useCallback } from "react";
import { useResetPage } from "../../hooks/useResetPage";
import {
    FaSearch, FaPlus, FaWallet, FaArrowUp, FaArrowDown, FaExchangeAlt,
    FaEye, FaTimes, FaCreditCard, FaBuilding, FaMobileAlt,
    FaMoneyBillWave, FaSpinner, FaEdit, FaTrash,
} from "react-icons/fa";
import { accountsApi, transactionsApi, type AccountData, type TransactionData, type AccountStats } from "../../services";
import Swal from "sweetalert2";

const fmt = (n: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n);

const typeColors: Record<string, string> = {
    Income: "bg-green-500/10 text-green-600 dark:text-green-400",
    Expense: "bg-red-500/10 text-red-600 dark:text-red-400",
    Transfer: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

const accountGradients: Record<string, string> = {
    Bank: "from-[#1E56E0] to-[#45CFFF]",
    Cash: "from-[#10B981] to-[#059669]",
    Mobile: "from-[#E91E63] to-[#C2185B]",
    Card: "from-[#8B5CF6] to-[#6D28D9]",
};

const accountIcons: Record<string, typeof FaWallet> = {
    Bank: FaBuilding,
    Cash: FaMoneyBillWave,
    Mobile: FaMobileAlt,
    Card: FaCreditCard,
};

export default function Accounts() {
    const [accounts, setAccounts] = useState<AccountData[]>([]);
    const [transactions, setTransactions] = useState<TransactionData[]>([]);
    const [stats, setStats] = useState<AccountStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [txLoading, setTxLoading] = useState(true);
    const [txTypeFilter, setTxTypeFilter] = useState("All");
    const [txSearch, setTxSearch] = useState("");
    const [page, setPage] = useResetPage([txTypeFilter, txSearch]);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showDetail, setShowDetail] = useState<TransactionData | null>(null);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState<AccountData | null>(null);
    const [showAddTx, setShowAddTx] = useState(false);

    // Account form
    const [accName, setAccName] = useState("");
    const [accType, setAccType] = useState<"Bank" | "Cash" | "Mobile" | "Card">("Bank");
    const [accBalance, setAccBalance] = useState("");
    const [accNotes, setAccNotes] = useState("");

    // Transaction form
    const [txDesc, setTxDesc] = useState("");
    const [txCategory, setTxCategory] = useState("General");
    const [txType, setTxType] = useState<"Income" | "Expense" | "Transfer">("Income");
    const [txAmount, setTxAmount] = useState("");
    const [txAccountId, setTxAccountId] = useState<number>(0);

    const fetchAccounts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await accountsApi.getAll({ per_page: 20 });
            setAccounts(res.data.data);
        } catch {
            Swal.fire("Error", "Failed to load accounts", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTransactions = useCallback(async () => {
        try {
            setTxLoading(true);
            const params: Record<string, string | number> = { page, per_page: 10 };
            if (txTypeFilter !== "All") params.type = txTypeFilter;
            if (txSearch) params.search = txSearch;
            const res = await transactionsApi.getAll(params as Parameters<typeof transactionsApi.getAll>[0]);
            setTransactions(res.data.data);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch { /* non-critical */ }
        finally { setTxLoading(false); }
    }, [txTypeFilter, txSearch, page]);

    const fetchStats = useCallback(async () => {
        try { const res = await accountsApi.stats(); setStats(res.data); } catch { /* non-critical */ }
    }, []);

    useEffect(() => { fetchAccounts(); }, [fetchAccounts]);
    useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
    useEffect(() => { fetchStats(); }, [fetchStats]);

    const resetAccForm = () => { setAccName(""); setAccType("Bank"); setAccBalance(""); setAccNotes(""); setEditingAccount(null); };

    const openAddAccount = () => { resetAccForm(); setShowAccountModal(true); };
    const openEditAccount = (acc: AccountData) => {
        setEditingAccount(acc);
        setAccName(acc.name); setAccType(acc.type); setAccBalance(String(acc.balance)); setAccNotes(acc.notes || "");
        setShowAccountModal(true);
    };

    const handleSaveAccount = async () => {
        if (!accName) { Swal.fire("Validation", "Account name is required", "warning"); return; }
        try {
            if (editingAccount) {
                await accountsApi.update(editingAccount.id, { name: accName, type: accType, balance: Number(accBalance) || 0, notes: accNotes });
                Swal.fire({ icon: "success", title: "Account updated", timer: 1500, showConfirmButton: false });
            } else {
                await accountsApi.create({ name: accName, type: accType, balance: Number(accBalance) || 0, notes: accNotes });
                Swal.fire({ icon: "success", title: "Account created", timer: 1500, showConfirmButton: false });
            }
            setShowAccountModal(false); resetAccForm();
            fetchAccounts(); fetchStats();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save account";
            Swal.fire("Error", msg, "error");
        }
    };

    const handleDeleteAccount = async (id: number) => {
        const result = await Swal.fire({ icon: "warning", title: "Delete account?", text: "This action cannot be undone", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
        if (!result.isConfirmed) return;
        try {
            await accountsApi.delete(id);
            fetchAccounts(); fetchStats();
            Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to delete", "error"); }
    };

    const handleAddTx = async () => {
        if (!txDesc || !txAmount || !txAccountId) { Swal.fire("Validation", "Please fill all required fields", "warning"); return; }
        try {
            await transactionsApi.create({ account_id: txAccountId, description: txDesc, category: txCategory, type: txType, amount: Number(txAmount), date: new Date().toISOString().split("T")[0] });
            Swal.fire({ icon: "success", title: "Transaction added", timer: 1500, showConfirmButton: false });
            setShowAddTx(false); setTxDesc(""); setTxAmount("");
            fetchTransactions(); fetchAccounts(); fetchStats();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to add transaction";
            Swal.fire("Error", msg, "error");
        }
    };

    const handleDeleteTx = async (id: number) => {
        const result = await Swal.fire({ icon: "warning", title: "Delete transaction?", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
        if (!result.isConfirmed) return;
        try {
            await transactionsApi.delete(id);
            fetchTransactions(); fetchAccounts(); fetchStats();
            Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire("Error", "Failed to delete", "error"); }
    };

    const summaryCards = [
        { label: "Total Balance", value: fmt(stats?.total_balance ?? 0), icon: FaWallet, color: "from-[#45CFFF] to-[#1E56E0]" },
        { label: "Total Income", value: fmt(stats?.total_income ?? 0), icon: FaArrowUp, color: "from-[#10B981] to-[#059669]" },
        { label: "Total Expenses", value: fmt(stats?.total_expenses ?? 0), icon: FaArrowDown, color: "from-[#F59E0B] to-[#D97706]" },
        { label: "Accounts", value: String(stats?.total_accounts ?? 0), icon: FaExchangeAlt, color: "from-[#8B5CF6] to-[#6D28D9]" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sora text-xl font-bold text-[#1a1f36] dark:text-white">Accounts & Finance</h2>
                    <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">Manage accounts, track income & expenses</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => { setTxDesc(""); setTxAmount(""); setTxAccountId(0); setShowAddTx(true); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm font-medium text-[#1a1f36] dark:text-white hover:border-[#45CFFF]/50 transition-colors">
                        <FaExchangeAlt size={14} />Add Transaction
                    </button>
                    <button onClick={openAddAccount}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                        <FaPlus size={14} />New Account
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white mb-3">My Accounts</h3>
                {loading ? (
                    <div className="text-center py-8 text-[#A0AEC0]"><FaSpinner className="mx-auto mb-2 animate-spin" size={24} /> Loading accounts...</div>
                ) : accounts.length === 0 ? (
                    <div className="text-center py-8 text-[#A0AEC0]">No accounts yet. Create one to get started.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {accounts.map((acc) => {
                            const Icon = accountIcons[acc.type] || FaWallet;
                            const grad = accountGradients[acc.type] || "from-[#45CFFF] to-[#1E56E0]";
                            return (
                                <div key={acc.id} className="rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] p-4 hover:shadow-lg transition-all group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}><Icon size={16} /></div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditAccount(acc)} className="p-1 rounded hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF]"><FaEdit size={11} /></button>
                                            <button onClick={() => handleDeleteAccount(acc.id)} className="p-1 rounded hover:bg-red-500/10 text-[#718096] hover:text-red-500"><FaTrash size={11} /></button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#718096] dark:text-[#A0AEC0] mb-0.5">{acc.type}</p>
                                    <p className="text-sm font-medium text-[#1a1f36] dark:text-white mb-2 truncate">{acc.name}</p>
                                    <p className={`text-lg font-sora font-bold ${acc.balance >= 0 ? "text-[#1a1f36] dark:text-white" : "text-red-500"}`}>{fmt(acc.balance)}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Transaction Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={14} />
                    <input type="text" placeholder="Search transactions..." value={txSearch} onChange={(e) => setTxSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["All", "Income", "Expense", "Transfer"].map((s) => (
                        <button key={s} onClick={() => setTxTypeFilter(s)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${txTypeFilter === s ? "bg-[#45CFFF] text-white shadow-md" : "bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] hover:border-[#45CFFF]/50"}`}>
                            {s === "Income" && <FaArrowUp size={10} />}{s === "Expense" && <FaArrowDown size={10} />}{s === "Transfer" && <FaExchangeAlt size={10} />}
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transaction Table */}
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
                            {txLoading ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-[#A0AEC0]"><FaSpinner className="mx-auto animate-spin" size={20} /></td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[#A0AEC0]">No transactions found.</td></tr>
                            ) : transactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 hover:bg-[#F9FAFC] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{tx.date}</td>
                                    <td className="px-6 py-3.5">
                                        <p className="text-sm font-medium text-[#1a1f36] dark:text-white max-w-[260px] truncate">{tx.description}</p>
                                        {tx.reference && <p className="text-xs text-[#A0AEC0] font-mono">{tx.reference}</p>}
                                    </td>
                                    <td className="px-6 py-3.5"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#45CFFF]/10 text-[#45CFFF]">{tx.category || "—"}</span></td>
                                    <td className="px-6 py-3.5 text-sm text-[#718096] dark:text-[#A0AEC0]">{tx.account?.name || "—"}</td>
                                    <td className="px-6 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[tx.type]}`}>{tx.type}</span></td>
                                    <td className="px-6 py-3.5 text-sm font-mono font-bold text-[#1a1f36] dark:text-white">{tx.type === "Expense" || tx.type === "Transfer" ? "-" : "+"}{fmt(tx.amount)}</td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setShowDetail(tx)} className="p-1.5 rounded-lg hover:bg-[#45CFFF]/10 text-[#718096] hover:text-[#45CFFF] transition-all"><FaEye size={13} /></button>
                                            <button onClick={() => handleDeleteTx(tx.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#718096] hover:text-red-500 transition-all"><FaTrash size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748] flex items-center justify-between">
                        <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">{total} transactions</p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] disabled:opacity-40">Prev</button>
                            <span className="text-xs text-[#718096] dark:text-[#A0AEC0]">Page {page} of {totalPages}</span>
                            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-[#718096] dark:text-[#A0AEC0] disabled:opacity-40">Next</button>
                        </div>
                    </div>
                )}
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
                                    {showDetail.type === "Expense" || showDetail.type === "Transfer" ? "-" : "+"}{fmt(showDetail.amount)}
                                </p>
                                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${typeColors[showDetail.type]}`}>{showDetail.type}</span>
                            </div>
                            {([["Description", showDetail.description], ["Category", showDetail.category || "—"], ["Account", showDetail.account?.name || "—"], ["Reference", showDetail.reference || "—"], ["Date", showDetail.date]] as const).map(([l, v]) => (
                                <div key={l} className="flex items-center justify-between py-2 border-b border-[#E2E8F0]/50 dark:border-[#2D3748]/50 last:border-none">
                                    <span className="text-xs font-mono uppercase text-[#718096] dark:text-[#A0AEC0]">{l}</span>
                                    <span className="text-sm text-[#1a1f36] dark:text-white text-right max-w-[60%] truncate">{v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => setShowDetail(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create / Edit Account Modal */}
            {showAccountModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2D3748]">
                            <h3 className="font-sora font-bold text-[#1a1f36] dark:text-white">{editingAccount ? "Edit Account" : "Create New Account"}</h3>
                            <button onClick={() => { setShowAccountModal(false); resetAccForm(); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]"><FaTimes size={14} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Account Name</label>
                                <input type="text" value={accName} onChange={(e) => setAccName(e.target.value)} placeholder="e.g., Savings Account"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Account Type</label>
                                <select value={accType} onChange={(e) => setAccType(e.target.value as typeof accType)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                    <option value="Bank">Bank</option><option value="Cash">Cash</option><option value="Mobile">Mobile</option><option value="Card">Card</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Balance</label>
                                <input type="number" value={accBalance} onChange={(e) => setAccBalance(e.target.value)} placeholder="0"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Notes</label>
                                <textarea value={accNotes} onChange={(e) => setAccNotes(e.target.value)} placeholder="Optional notes" rows={2}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => { setShowAccountModal(false); resetAccForm(); }} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]">Cancel</button>
                            <button onClick={handleSaveAccount} disabled={!accName}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2E8BF0] to-[#1E56E0] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                {editingAccount ? <><FaEdit size={12} />Update</> : <><FaPlus size={12} />Create Account</>}
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
                                <input type="text" value={txDesc} onChange={(e) => setTxDesc(e.target.value)} placeholder="e.g., Office supplies"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#45CFFF]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a1f36] dark:text-white mb-1.5">Type</label>
                                    <select value={txType} onChange={(e) => setTxType(e.target.value as typeof txType)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                        <option value="Income">Income</option><option value="Expense">Expense</option><option value="Transfer">Transfer</option>
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
                                    <select value={txAccountId} onChange={(e) => setTxAccountId(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFC] dark:bg-[#060B14] border border-[#E2E8F0] dark:border-[#2D3748] text-sm text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]">
                                        <option value={0}>Select account</option>
                                        {accounts.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] dark:border-[#2D3748]">
                            <button onClick={() => setShowAddTx(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/[0.06]">Cancel</button>
                            <button onClick={handleAddTx} disabled={!txDesc || !txAmount || !txAccountId}
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
