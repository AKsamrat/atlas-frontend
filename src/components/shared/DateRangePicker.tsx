import { FaCalendarAlt, FaTimes } from "react-icons/fa";

interface DateRangePickerProps {
    fromDate: string;
    toDate: string;
    onFromDateChange: (v: string) => void;
    onToDateChange: (v: string) => void;
    onClear: () => void;
}

export default function DateRangePicker({
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    onClear,
}: DateRangePickerProps) {
    const hasValue = fromDate || toDate;

    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <FaCalendarAlt
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0] pointer-events-none"
                />
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => onFromDateChange(e.target.value)}
                    className="pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-xs text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                />
            </div>
            <span className="text-xs text-[#A0AEC0]">to</span>
            <div className="relative">
                <FaCalendarAlt
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0] pointer-events-none"
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => onToDateChange(e.target.value)}
                    min={fromDate || undefined}
                    className="pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-[#0F1E3D] border border-[#E2E8F0] dark:border-[#2D3748] text-xs text-[#1a1f36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#45CFFF]"
                />
            </div>
            {hasValue && (
                <button
                    onClick={onClear}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] dark:text-[#A0AEC0] hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    title="Clear dates"
                >
                    <FaTimes size={12} />
                </button>
            )}
        </div>
    );
}
