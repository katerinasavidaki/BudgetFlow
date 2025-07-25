import axios from 'axios';
import z from 'zod';

const API_URL = 'http://localhost:8080/api/auth';

export const loginSchema = z.object({
    username: z.email("Invalid email address"),
    password: z.string().min(5, "Password must be at least 5 characters"),
});

export type LoginFields = z.infer<typeof loginSchema>;

type AuthResponse = {
    token: string;
    username:string;
};

export const loginApi = async ({username, password}: LoginFields): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, { username, password });
    return response.data;
};

export const register = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, { username, password });
    return response.data;
};