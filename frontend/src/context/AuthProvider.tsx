import {type ReactNode, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {toast} from "sonner";
import {AuthContext, type UserReadDTO} from "./AuthContext";
import {loginApi, type LoginFields} from "@/api/auth/authApi.ts";
import axios from "axios";

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

    const getCurrentUser = async ():Promise<UserReadDTO | null> => {
        if (!token) return null;
        try {
            const response = await axios.get<UserReadDTO>(`${import.meta.env.VITE_API_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch(error) {
            toast.error(error instanceof Error ? error.message : "Failed to fetch user")
            return null;
        }
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!token,
            username,
            token,
            loading,
            login,
            logout,
            getCurrentUser,
        }}>
            { loading ? null : children }
        </AuthContext.Provider>
    );
};