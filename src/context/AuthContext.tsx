import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { authApi, type AuthUser } from "../services/Auth";

/* ------------------------------------------------------------------ */
/*  Auth Context — Login / Register / Logout for Entra Global Tech     */
/*  Connected to Laravel Sanctum backend API                           */
/* ------------------------------------------------------------------ */

export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    avatar?: string;
}

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User | null>;
    register: (name: string, email: string, password: string) => Promise<User | null>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Map API user to frontend User interface */
function mapApiUser(apiUser: AuthUser): User {
    return {
        id: String(apiUser.id),
        name: apiUser.name,
        email: apiUser.email,
        role: apiUser.role,
        avatar: apiUser.avatar,
    };
}

function getStoredUser(): User | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem("entra-auth-user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(getStoredUser);
    const [loading, setLoading] = useState(true);

    // On mount: if token exists, verify session with the API
    useEffect(() => {
        const token = localStorage.getItem("entra-auth-token");
        if (!token) {
            setLoading(false);
            return;
        }

        authApi
            .profile()
            .then((res) => {
                setUser(mapApiUser(res.data));
            })
            .catch(() => {
                // Token invalid/expired — clear everything
                localStorage.removeItem("entra-auth-token");
                localStorage.removeItem("entra-auth-user");
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    // Persist user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("entra-auth-user", JSON.stringify(user));
        } else {
            localStorage.removeItem("entra-auth-user");
        }
    }, [user]);

    const login = useCallback(async (email: string, password: string): Promise<User | null> => {
        try {
            const res = await authApi.login(email, password);
            const { user: apiUser, token } = res.data;

            // Store Sanctum token for the axios interceptor
            localStorage.setItem("entra-auth-token", token);

            const mappedUser = mapApiUser(apiUser);
            setUser(mappedUser);
            return mappedUser;
        } catch {
            return null;
        }
    }, []);

    const register = useCallback(
        async (name: string, email: string, password: string): Promise<User | null> => {
            try {
                const res = await authApi.register(name, email, password, password);
                const { user: apiUser, token } = res.data;

                localStorage.setItem("entra-auth-token", token);

                const mappedUser = mapApiUser(apiUser);
                setUser(mappedUser);
                return mappedUser;
            } catch {
                return null;
            }
        },
        [],
    );

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {
            // Logout even if API call fails
        } finally {
            localStorage.removeItem("entra-auth-token");
            localStorage.removeItem("entra-auth-user");
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
