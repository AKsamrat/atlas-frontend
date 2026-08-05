import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    total: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    total,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPages = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-[#718096] dark:text-[#A0AEC0]">
                Showing page <span className="font-semibold text-[#1a1f36] dark:text-white">{currentPage}</span> of{" "}
                <span className="font-semibold text-[#1a1f36] dark:text-white">{totalPages}</span>{" "}
                ({total} records)
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <FaChevronLeft size={12} />
                </button>
                {getPages().map((p, i) =>
                    p === "..." ? (
                        <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-[#A0AEC0]">
                            ...
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${currentPage === p
                                    ? "bg-gradient-to-r from-[#45CFFF] to-[#1E56E0] text-white shadow-md"
                                    : "text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] dark:text-[#A0AEC0] hover:bg-[#F9FAFC] dark:hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <FaChevronRight size={12} />
                </button>
            </div>
        </div>
    );
}
