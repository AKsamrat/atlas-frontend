import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type AllowedRoles = "admin" | "user" | "customer";

interface ProtectedRouteProps {
    allowedRoles: AllowedRoles[];
    children: React.ReactNode;
}

const ROLE_HOME: Record<AllowedRoles, string> = {
    admin: "/dashboard",
    employee: "/user",
    user: "/user",
    customer: "/customer",
};

/**
 * Guards a route by user role.
 * - Not logged in  → /login
 * - Wrong role     → that role's home panel
 */
export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    // Still checking session — show nothing (or a spinner)
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#060B14]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#45CFFF] border-t-transparent" />
            </div>
        );
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role not allowed
    if (!allowedRoles.includes(user.role as AllowedRoles)) {
        const redirect = ROLE_HOME[user.role as AllowedRoles] || "/login";
        return <Navigate to={redirect} replace />;
    }

    return <>{children}</>;
}
