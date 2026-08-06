import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";

/* ------------------------------------------------------------------ */
/*  Lightweight Toast System — no external dependencies               */
/* ------------------------------------------------------------------ */

type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "success") => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {createPortal(
                <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                    {toasts.map((toast) => (
                        <ToastCard key={toast.id} toast={toast} onDismiss={removeToast} />
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}

/* ---- Single toast card with auto-dismiss ---- */

const ICON_MAP = {
    success: <FiCheckCircle className="text-emerald-400 text-lg shrink-0" />,
    error: <FiAlertTriangle className="text-red-400 text-lg shrink-0" />,
    warning: <FiAlertTriangle className="text-amber-400 text-lg shrink-0" />,
    info: <FiInfo className="text-sky-400 text-lg shrink-0" />,
};

const BG_MAP = {
    success: "border-emerald-500/30 bg-emerald-950/80",
    error: "border-red-500/30 bg-red-950/80",
    warning: "border-amber-500/30 bg-amber-950/80",
    info: "border-sky-500/30 bg-sky-950/80",
};

function ToastCard({
    toast,
    onDismiss,
}: {
    toast: ToastItem;
    onDismiss: (id: number) => void;
}) {
    useEffect(() => {
        const timer = setTimeout(() => onDismiss(toast.id), 3500);
        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    return (
        <div
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl shadow-black/40 min-w-[260px] max-w-[380px] animate-slide-in ${BG_MAP[toast.type]}`}
        >
            {ICON_MAP[toast.type]}
            <span className="text-sm text-gray-100 flex-1 leading-snug">{toast.message}</span>
            <button
                onClick={() => onDismiss(toast.id)}
                className="text-gray-500 hover:text-gray-300 transition-colors shrink-0"
            >
                <FiX className="text-sm" />
            </button>
        </div>
    );
}
