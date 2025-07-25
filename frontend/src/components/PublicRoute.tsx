// src/components/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";


type PublicRouteProps = {
    children: React.ReactNode;
}

const PublicRoute = ({children}: PublicRouteProps) => {
    const { isAuthenticated } = useAuth();


    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default PublicRoute;