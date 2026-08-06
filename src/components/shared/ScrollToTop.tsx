import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";

/**
 * ScrollToTop
 * 1. Scrolls the window to the top on every route change.
 * 2. Shows a floating "scroll to top" button at the bottom-right
 *    once the user has scrolled past 400 px.
 * 3. Button is hidden on admin/employee/customer panels.
 * 4. Responsive: smaller on mobile, full size on desktop.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();
    const [visible, setVisible] = useState(false);

    /* Routes where the scroll-to-top button should NOT appear */
    const isPanelRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/user") ||
        pathname.startsWith("/customer");

    /* Scroll to top whenever the route changes */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);

    /* Show / hide the floating button based on scroll position */
    useEffect(() => {
        if (isPanelRoute) {
            setVisible(false);
            return;
        }
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [isPanelRoute]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible || isPanelRoute) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-3 right-3 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#45CFFF] to-[#1E56E0] text-[#060B14] shadow-[0_6px_20px_rgba(46,139,240,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(46,139,240,0.6)] active:scale-95 sm:h-12 sm:w-12 sm:bottom-6 sm:right-6 sm:shadow-[0_8px_30px_rgba(46,139,240,0.45)] dark:text-white"
        >
            <ArrowUp size={16} strokeWidth={2.5} className="sm:h-5 sm:w-5" />
        </button>
    );
}
