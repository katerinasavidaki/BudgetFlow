import type {UserReadDTO} from "@/context/AuthContext.ts";
import axios from "axios";

const API_URL = "http://localhost:8080/api/users/me"

export const getCurrentUser = async ():Promise<UserReadDTO> => {
    const token = localStorage.getItem("token");
    console.log("Token used /me", token)
    const res = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
}

export const updateUserApi = async (data: Partial<UserReadDTO>): Promise<UserReadDTO> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.put(`${API_URL}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const changePasswordApi = async (data: {
    userId: number;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    await axios.put("http://localhost:8080/api/users/change-password", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};