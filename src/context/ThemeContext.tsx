import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Theme Context — Dark / Light mode for Entra Global Tech            */
/*  Persists to localStorage, respects system preference on first load */
/* ------------------------------------------------------------------ */

type Theme = "dark" | "light";

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/** Read saved theme or fall back to system preference. */
function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("entra-theme") as Theme | null;
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    // Apply the class on <html> and persist to localStorage whenever it changes.
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
            root.classList.remove("light");
        } else {
            root.classList.add("light");
            root.classList.remove("dark");
        }
        localStorage.setItem("entra-theme", theme);
    }, [theme]);

    // Listen for system preference changes (only if user hasn't set a manual choice).
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: light)");
        const handler = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem("entra-theme")) {
                setTheme(e.matches ? "light" : "dark");
            }
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

/** Hook to consume the theme context. */
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}
