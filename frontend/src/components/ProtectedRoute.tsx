import {Navigate} from "react-router-dom";
import {useAuth} from "@/hooks/useAuth.ts";
import type {JSX, ReactNode} from "react";

type ProtectedRouteProps = {
    children: ReactNode;
}

export function ProtectedRoute({children}:ProtectedRouteProps): JSX.Element {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return(
        <>
            {children}
        </>
    )
}