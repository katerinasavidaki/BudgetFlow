import {type ReactNode, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {toast} from "sonner";
import { AuthContext } from "./AuthContext";
import {loginApi, type LoginFields} from "@/api/auth/authApi.ts";

type JwtPayload = {
    sub: string;  //username
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            try {
                const decoded = jwtDecode<JwtPayload>(storedToken);
                setToken(storedToken);
                setUsername(decoded.sub);
            } catch (error) {
                toast.error("Invalid token");
                console.error("Invalid token");
                logout(); // reset
            }
        }
        setLoading(false);
    }, []);

    const login = async (fields: LoginFields) => {
        try {
            setLoading(true);
            const {token} = await loginApi(fields);
            const decoded = jwtDecode<JwtPayload>(token);

            setToken(token);
            setUsername(decoded.sub);
            localStorage.setItem("token", token);

            toast.success("Logged in successfully");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUsername(null);
        localStorage.removeItem("token");
        toast.success("Logged out");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!token,
            username,
            token,
            loading,
            login,
            logout,
        }}>
            { loading ? null : children }
        </AuthContext.Provider>
    );
};