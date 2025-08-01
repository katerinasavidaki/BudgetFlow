import {type ReactNode, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {toast} from "sonner";
import {AuthContext, type UserReadDTO} from "./AuthContext";
import {loginApi, type LoginFields} from "@/api/auth/authApi.ts";
import {getCurrentUser} from "@/api/user.ts";

type JwtPayload = {
    sub: string;  //username
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UserReadDTO | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            try {
                setToken(storedToken);
                const decoded = jwtDecode<JwtPayload>(storedToken);
                setUsername(decoded.sub);

                getCurrentUser()
                    .then((user) => setCurrentUser(user))
                    .then((user) => console.log("Fetched user", user))
                    .catch(() => toast.error("Failed to fetch user"))
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
            localStorage.setItem("token", token);
            const decoded = jwtDecode<JwtPayload>(token);
            console.log("DECODED", decoded);
            console.log("TOKEN",token);

            setToken(token);
            setUsername(decoded.sub);
            const user = await getCurrentUser();
            setCurrentUser(user);

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
        setCurrentUser(null);
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
            currentUser,
            setCurrentUser,
        }}>
            { loading ? null : children }
        </AuthContext.Provider>
    );
};